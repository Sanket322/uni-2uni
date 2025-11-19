import { useState, useEffect } from "react";
import FarmerLayout from "@/components/FarmerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Calendar, BookOpen, Cloud, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  getNotificationPreferences, 
  updateNotificationPreferences,
  type NotificationType 
} from "@/utils/pushNotificationService";

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState<Record<NotificationType, boolean>>({
    emergency_alert: true,
    vaccination_reminder: true,
    training_event: true,
    disease_outbreak: true,
    weather_warning: true,
    scheme_update: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await getNotificationPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error("Failed to load preferences:", error);
      toast({
        title: "Error",
        description: "Failed to load notification preferences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (type: NotificationType, enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [type]: enabled
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateNotificationPreferences(preferences);
      toast({
        title: "Success",
        description: "Notification preferences updated successfully"
      });
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const notificationTypes = [
    {
      id: "emergency_alert" as NotificationType,
      icon: AlertTriangle,
      title: "Emergency Alerts",
      description: "Critical alerts for cyclones, natural disasters, and emergencies",
      color: "text-destructive",
      recommended: true
    },
    {
      id: "disease_outbreak" as NotificationType,
      icon: AlertTriangle,
      title: "Disease Outbreak Warnings",
      description: "Real-time alerts about disease outbreaks in your area",
      color: "text-destructive",
      recommended: true
    },
    {
      id: "vaccination_reminder" as NotificationType,
      icon: Calendar,
      title: "Vaccination Reminders",
      description: "Reminders for upcoming and due vaccinations",
      color: "text-primary",
      recommended: true
    },
    {
      id: "weather_warning" as NotificationType,
      icon: Cloud,
      title: "Weather Warnings",
      description: "Severe weather alerts and livestock care advisories",
      color: "text-blue-500",
      recommended: true
    },
    {
      id: "training_event" as NotificationType,
      icon: BookOpen,
      title: "Training & Events",
      description: "Notifications about training programs and workshops",
      color: "text-green-500",
      recommended: false
    },
    {
      id: "scheme_update" as NotificationType,
      icon: FileText,
      title: "Government Scheme Updates",
      description: "New schemes and updates to existing programs",
      color: "text-purple-500",
      recommended: false
    }
  ];

  if (loading) {
    return (
      <FarmerLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Notification Preferences</h1>
            <p className="text-muted-foreground mt-2">Loading your preferences...</p>
          </div>
        </div>
      </FarmerLayout>
    );
  }

  return (
    <FarmerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notification Preferences
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage what notifications you want to receive
          </p>
        </div>

        {/* Notification Settings */}
        <div className="grid gap-4">
          {notificationTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card key={type.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Icon className={`h-5 w-5 mt-1 ${type.color}`} />
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {type.title}
                          {type.recommended && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              Recommended
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {type.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={type.id}
                        checked={preferences[type.id]}
                        onCheckedChange={(checked) => handleToggle(type.id, checked)}
                      />
                      <Label htmlFor={type.id} className="sr-only">
                        Toggle {type.title}
                      </Label>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Important Notice */}
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-base">📱 Important Notice</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              • <strong>Emergency Alerts</strong> and <strong>Disease Outbreak Warnings</strong> are 
              highly recommended for the safety of your livestock.
            </p>
            <p>
              • Notifications are sent via push notifications. Make sure you have enabled 
              notifications in your device settings.
            </p>
            <p>
              • You can update these preferences anytime from your profile settings.
            </p>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-4">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="flex-1"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
          <Button 
            variant="outline" 
            onClick={loadPreferences}
            disabled={saving}
          >
            Reset
          </Button>
        </div>
      </div>
    </FarmerLayout>
  );
};

export default NotificationPreferences;
