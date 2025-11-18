import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Syringe, HeartPulse, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Alert {
  id: string;
  type: "critical_health" | "vaccination_due" | "checkup_overdue";
  animal_id: string;
  animal_name: string;
  species: string;
  message: string;
  priority: "high" | "critical";
  created_at: string;
}

const CriticalAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlerts();
    
    // Set up real-time subscription for health records
    const healthChannel = supabase
      .channel('health-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'health_records'
        },
        (payload) => {
          if (payload.new.diagnosis) {
            toast({
              title: "New Health Record",
              description: "A new health record has been added",
            });
            fetchAlerts();
          }
        }
      )
      .subscribe();

    // Set up real-time subscription for animal status changes
    const animalChannel = supabase
      .channel('animal-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'animals'
        },
        (payload: any) => {
          if (payload.new.health_status === 'sick' || payload.new.health_status === 'under_treatment') {
            toast({
              title: "Critical Health Alert",
              description: `Animal ${payload.new.name} status changed to ${payload.new.health_status}`,
              variant: "destructive",
            });
            fetchAlerts();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(healthChannel);
      supabase.removeChannel(animalChannel);
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      const alerts: Alert[] = [];

      // Critical health cases
      const { data: criticalAnimals } = await supabase
        .from("animals")
        .select("id, name, species, health_status")
        .in("health_status", ["sick", "under_treatment", "quarantine"]);

      if (criticalAnimals) {
        criticalAnimals.forEach((animal) => {
          alerts.push({
            id: `health-${animal.id}`,
            type: "critical_health",
            animal_id: animal.id,
            animal_name: animal.name || "Unknown",
            species: animal.species,
            message: `${animal.name} is ${animal.health_status}`,
            priority: animal.health_status === "sick" ? "critical" : "high",
            created_at: new Date().toISOString(),
          });
        });
      }

      // Vaccination overdue (past due date)
      const { data: overdueVaccinations } = await supabase
        .from("vaccinations")
        .select(`
          id,
          next_due_date,
          vaccine_name,
          animal_id,
          animals (name, species)
        `)
        .lt("next_due_date", new Date().toISOString().split("T")[0])
        .not("next_due_date", "is", null);

      if (overdueVaccinations) {
        overdueVaccinations.forEach((vacc: any) => {
          alerts.push({
            id: `vacc-${vacc.id}`,
            type: "vaccination_due",
            animal_id: vacc.animal_id,
            animal_name: vacc.animals?.name || "Unknown",
            species: vacc.animals?.species || "Unknown",
            message: `${vacc.vaccine_name} overdue for ${vacc.animals?.name}`,
            priority: "critical",
            created_at: vacc.next_due_date,
          });
        });
      }

      // Checkup overdue
      const { data: overdueCheckups } = await supabase
        .from("health_records")
        .select(`
          id,
          next_checkup_date,
          animal_id,
          animals (name, species)
        `)
        .lt("next_checkup_date", new Date().toISOString().split("T")[0])
        .not("next_checkup_date", "is", null);

      if (overdueCheckups) {
        overdueCheckups.forEach((checkup: any) => {
          alerts.push({
            id: `checkup-${checkup.id}`,
            type: "checkup_overdue",
            animal_id: checkup.animal_id,
            animal_name: checkup.animals?.name || "Unknown",
            species: checkup.animals?.species || "Unknown",
            message: `Checkup overdue for ${checkup.animals?.name}`,
            priority: "high",
            created_at: checkup.next_checkup_date,
          });
        });
      }

      setAlerts(alerts.sort((a, b) => 
        a.priority === "critical" ? -1 : 1
      ));
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "critical_health":
        return <HeartPulse className="h-5 w-5 text-destructive" />;
      case "vaccination_due":
        return <Syringe className="h-5 w-5 text-orange-500" />;
      case "checkup_overdue":
        return <Calendar className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Critical Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading alerts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Critical Alerts ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-muted-foreground">No critical alerts at this time</p>
        ) : (
          <div className="space-y-3">
            {alerts.slice(0, 10).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{alert.animal_name}</p>
                      <Badge variant="outline" className="text-xs">
                        {alert.species}
                      </Badge>
                      <Badge
                        variant={alert.priority === "critical" ? "destructive" : "default"}
                        className="text-xs"
                      >
                        {alert.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/animals/${alert.animal_id}`)}
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

export default CriticalAlerts;
