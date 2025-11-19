import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import FarmerLayout from "@/components/FarmerLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type HelpdeskTicket = Tables<"helpdesk_tickets">;

const Helpdesk = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["helpdesk-tickets", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("helpdesk_tickets")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as HelpdeskTicket[];
    },
    enabled: !!user?.id,
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <FarmerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Helpdesk</h1>
          <p className="text-muted-foreground">Submit and track your support tickets</p>
        </div>
        <Button onClick={() => navigate("/submit-ticket")}>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading tickets...</div>
      ) : tickets?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No tickets found</p>
            <Button onClick={() => navigate("/submit-ticket")}>
              Create Your First Ticket
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tickets?.map((ticket) => (
            <Card
              key={ticket.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/ticket/${ticket.id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{ticket.subject}</CardTitle>
                    <CardDescription>
                      {ticket.category && `Category: ${ticket.category}`}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {ticket.description}
                </p>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Created: {format(new Date(ticket.created_at), "PPp")}</span>
                  {ticket.sla_breach && (
                    <Badge variant="destructive">SLA Breach</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </FarmerLayout>
  );
};

export default Helpdesk;
