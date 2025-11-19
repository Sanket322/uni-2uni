import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Activity, MapPin, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DiseaseAlert {
  id: string;
  disease: string;
  species: string;
  severity: "low" | "medium" | "high" | "critical";
  location: string;
  reportedCases: number;
  date: string;
  prediction: string;
}

const DiseaseSurveillanceWidget = ({ state, district }: { state?: string; district?: string }) => {
  const [alerts, setAlerts] = useState<DiseaseAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiseaseAlerts = async () => {
      try {
        // Import demo data generator dynamically
        const { generateDiseaseAlerts } = await import("@/utils/demoDataGenerators");
        const mockAlerts = generateDiseaseAlerts(3);
        
        setAlerts(mockAlerts);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch disease alerts:", error);
        setLoading(false);
      }
    };

    fetchDiseaseAlerts();
  }, [state, district]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Disease Surveillance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading disease alerts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Disease Surveillance & Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-6">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No active disease alerts in your area</p>
          </div>
        ) : (
          <>
            {alerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-1" />
                    <div>
                      <h4 className="font-semibold">{alert.disease}</h4>
                      <p className="text-sm text-muted-foreground">Affects: {alert.species}</p>
                    </div>
                  </div>
                  <Badge variant={getSeverityColor(alert.severity)}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {alert.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    {alert.reportedCases} reported cases
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm font-medium mb-1">Prediction & Advisory</p>
                  <p className="text-sm text-muted-foreground">{alert.prediction}</p>
                </div>
              </div>
            ))}

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/health-records")}
            >
              View Full Disease Surveillance Report
            </Button>
          </>
        )}

        <div className="pt-4 border-t text-xs text-muted-foreground">
          <p>Data from ICAR-NIVEDI via NADRES v2</p>
          <p>Updated: {new Date().toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiseaseSurveillanceWidget;
