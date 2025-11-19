import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send } from "lucide-react";
import { format } from "date-fns";

const AdminTicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);

  const { data: ticket } = useQuery({
    queryKey: ["admin-ticket", ticketId],
    queryFn: async () => {
      const { data: ticketData, error } = await supabase
        .from("helpdesk_tickets")
        .select("*")
        .eq("id", ticketId)
        .single();

      if (error) throw error;

      // Fetch profile separately
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, full_name, phone_number")
        .eq("id", ticketData.user_id)
        .single();

      return {
        ...ticketData,
        profile: profileData,
      };
    },
    enabled: !!ticketId,
  });

  const { data: responses } = useQuery({
    queryKey: ["admin-ticket-responses", ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("helpdesk_responses")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!ticketId,
  });

  const addResponseMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("helpdesk_responses").insert({
        ticket_id: ticketId!,
        user_id: user!.id,
        message: message,
        is_internal_note: isInternalNote,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ticket-responses", ticketId] });
      setMessage("");
      setIsInternalNote(false);
      toast({
        title: "Response added",
        description: "Your response has been sent.",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500";
      case "in_progress":
        return "bg-yellow-500";
      case "resolved":
        return "bg-green-500";
      case "closed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!ticket) {
    return (
      <AdminLayout>
        <div>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/admin/helpdesk")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Helpdesk
        </Button>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{ticket.subject}</CardTitle>
                <CardDescription>
                  Ticket #{ticket.id.slice(0, 8)} • User:{" "}
                  {ticket.profile?.full_name || "Unknown"}
                  <br />
                  Created {format(new Date(ticket.created_at), "PPp")}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant={ticket.priority === "critical" ? "destructive" : "default"}
                >
                  {ticket.priority}
                </Badge>
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status.replace("_", " ")}
                </Badge>
                {ticket.sla_breach && <Badge variant="destructive">SLA Breach</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {ticket.category && (
              <p className="text-sm text-muted-foreground mb-2">
                Category: {ticket.category}
              </p>
            )}
            <p className="whitespace-pre-wrap">{ticket.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversation & Internal Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {responses?.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No responses yet. Add a message below.
              </p>
            ) : (
              <div className="space-y-4">
                {responses?.map((response) => (
                  <div
                    key={response.id}
                    className={`p-4 rounded-lg ${
                      response.is_internal_note
                        ? "bg-yellow-50 border-l-4 border-yellow-500"
                        : response.user_id === ticket.user_id
                        ? "bg-muted mr-8"
                        : "bg-primary/10 ml-8"
                    }`}
                  >
                    {response.is_internal_note && (
                      <Badge variant="outline" className="mb-2">
                        Internal Note
                      </Badge>
                    )}
                    <p className="text-sm font-medium mb-1">
                      {response.user_id === ticket.user_id ? "User" : "Support Team"}
                    </p>
                    <p className="whitespace-pre-wrap">{response.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(new Date(response.created_at), "PPp")}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 pt-4 border-t">
              <Textarea
                placeholder="Type your response or internal note..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="internal-note"
                    checked={isInternalNote}
                    onCheckedChange={(checked) => setIsInternalNote(checked as boolean)}
                  />
                  <Label htmlFor="internal-note" className="text-sm cursor-pointer">
                    Internal note (not visible to user)
                  </Label>
                </div>
                <Button
                  onClick={() => addResponseMutation.mutate()}
                  disabled={!message.trim() || addResponseMutation.isPending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {addResponseMutation.isPending ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTicketDetails;
