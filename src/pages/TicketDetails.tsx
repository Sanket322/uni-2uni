import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send } from "lucide-react";
import { format } from "date-fns";

const TicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");

  const { data: ticket, isLoading: ticketLoading } = useQuery({
    queryKey: ["helpdesk-ticket", ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("helpdesk_tickets")
        .select("*")
        .eq("id", ticketId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!ticketId,
  });

  const { data: responses, isLoading: responsesLoading } = useQuery({
    queryKey: ["helpdesk-responses", ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("helpdesk_responses")
        .select("*")
        .eq("ticket_id", ticketId)
        .eq("is_internal_note", false)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!ticketId,
  });

  const addResponseMutation = useMutation({
    mutationFn: async (responseMessage: string) => {
      const { error } = await supabase.from("helpdesk_responses").insert({
        ticket_id: ticketId!,
        user_id: user!.id,
        message: responseMessage,
        is_internal_note: false,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["helpdesk-responses", ticketId] });
      setMessage("");
      toast({
        title: "Response added",
        description: "Your message has been sent.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmitResponse = () => {
    if (!message.trim()) return;
    addResponseMutation.mutate(message);
  };

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

  if (ticketLoading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!ticket) {
    return <div className="container mx-auto p-6">Ticket not found</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <Button variant="ghost" onClick={() => navigate("/helpdesk")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Helpdesk
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{ticket.subject}</CardTitle>
              <CardDescription>
                Ticket #{ticket.id.slice(0, 8)} • Created{" "}
                {format(new Date(ticket.created_at), "PPp")}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant={ticket.priority === "critical" ? "destructive" : "default"}>
                {ticket.priority}
              </Badge>
              <Badge className={getStatusColor(ticket.status)}>
                {ticket.status.replace("_", " ")}
              </Badge>
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
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {responsesLoading ? (
            <div>Loading responses...</div>
          ) : responses?.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No responses yet. Add a message below.
            </p>
          ) : (
            <div className="space-y-4">
              {responses?.map((response) => (
                <div
                  key={response.id}
                  className={`p-4 rounded-lg ${
                    response.user_id === user?.id
                      ? "bg-primary/10 ml-8"
                      : "bg-muted mr-8"
                  }`}
                >
                  <p className="text-sm font-medium mb-1">
                    {response.user_id === user?.id ? "You" : "Support Team"}
                  </p>
                  <p className="whitespace-pre-wrap">{response.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(response.created_at), "PPp")}
                  </p>
                </div>
              ))}
            </div>
          )}

          {ticket.status !== "closed" && (
            <div className="space-y-2 pt-4 border-t">
              <Textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
              <Button
                onClick={handleSubmitResponse}
                disabled={!message.trim() || addResponseMutation.isPending}
              >
                <Send className="h-4 w-4 mr-2" />
                {addResponseMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketDetails;
