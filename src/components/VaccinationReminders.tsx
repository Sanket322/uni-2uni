import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Syringe, Calendar, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface VaccinationReminder {
  id: string;
  animal_id: string;
  animal_name: string;
  species: string;
  vaccine_name: string;
  next_due_date: string;
  days_until_due: number;
  urgency: "overdue" | "urgent" | "upcoming";
}

const VaccinationReminders = () => {
  const [reminders, setReminders] = useState<VaccinationReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReminders();

    // Real-time subscription for new vaccinations
    const channel = supabase
      .channel('vaccination-reminders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vaccinations'
        },
        (payload) => {
          if (payload.new && payload.eventType === 'INSERT') {
            toast({
              title: "New Vaccination Recorded",
              description: "Vaccination schedule updated",
            });
          }
          fetchReminders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchReminders = async () => {
    try {
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const { data: vaccinations } = await supabase
        .from("vaccinations")
        .select(`
          id,
          vaccine_name,
          next_due_date,
          animal_id,
          animals (name, species)
        `)
        .not("next_due_date", "is", null)
        .lte("next_due_date", thirtyDaysFromNow.toISOString().split("T")[0])
        .order("next_due_date", { ascending: true });

      if (vaccinations) {
        const remindersList: VaccinationReminder[] = vaccinations.map((vacc: any) => {
          const dueDate = new Date(vacc.next_due_date);
          const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          let urgency: "overdue" | "urgent" | "upcoming";
          if (daysUntilDue < 0) {
            urgency = "overdue";
          } else if (daysUntilDue <= 7) {
            urgency = "urgent";
          } else {
            urgency = "upcoming";
          }

          return {
            id: vacc.id,
            animal_id: vacc.animal_id,
            animal_name: vacc.animals?.name || "Unknown",
            species: vacc.animals?.species || "Unknown",
            vaccine_name: vacc.vaccine_name,
            next_due_date: vacc.next_due_date,
            days_until_due: daysUntilDue,
            urgency,
          };
        });

        setReminders(remindersList);
      }
    } catch (error) {
      console.error("Error fetching vaccination reminders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyBadge = (urgency: VaccinationReminder["urgency"]) => {
    const variants = {
      overdue: "destructive",
      urgent: "default",
      upcoming: "secondary",
    } as const;

    const labels = {
      overdue: "Overdue",
      urgent: "Due Soon",
      upcoming: "Upcoming",
    };

    return (
      <Badge variant={variants[urgency]} className="text-xs">
        {labels[urgency]}
      </Badge>
    );
  };

  const formatDaysUntilDue = (days: number) => {
    if (days < 0) {
      return `${Math.abs(days)} days overdue`;
    } else if (days === 0) {
      return "Due today";
    } else if (days === 1) {
      return "Due tomorrow";
    } else {
      return `Due in ${days} days`;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Vaccination Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading reminders...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Vaccination Reminders ({reminders.length})
        </CardTitle>
        <CardDescription>
          Upcoming and overdue vaccination schedule
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reminders.length === 0 ? (
          <p className="text-muted-foreground">No upcoming vaccinations in the next 30 days</p>
        ) : (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <Syringe className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{reminder.animal_name}</p>
                      <Badge variant="outline" className="text-xs">
                        {reminder.species}
                      </Badge>
                      {getUrgencyBadge(reminder.urgency)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {reminder.vaccine_name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(reminder.next_due_date).toLocaleDateString()} • {formatDaysUntilDue(reminder.days_until_due)}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/animals/${reminder.animal_id}`)}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VaccinationReminders;
