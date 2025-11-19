import { useState, useEffect } from "react";
import FarmerLayout from "@/components/FarmerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Bell, Globe, Phone, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmergencyContact {
  id: string;
  contact_name: string;
  contact_number: string;
  relationship: string;
  is_default: boolean;
}

interface NotificationPreferences {
  weather_alerts: boolean;
  disease_alerts: boolean;
  vaccination_reminders: boolean;
  marketplace_updates: boolean;
  health_records: boolean;
  system_announcements: boolean;
}

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [newContact, setNewContact] = useState({
    contact_name: "",
    contact_number: "",
    relationship: "",
  });
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    weather_alerts: true,
    disease_alerts: true,
    vaccination_reminders: true,
    marketplace_updates: false,
    health_records: true,
    system_announcements: true,
  });

  useEffect(() => {
    if (user) {
      fetchSettings();
      fetchEmergencyContacts();
    }
  }, [user]);

  const fetchSettings = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("preferred_language")
      .eq("id", user.id)
      .single();

    if (data) {
      setLanguage(data.preferred_language || "en");
    }
  };

  const fetchEmergencyContacts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });

    if (data) {
      setEmergencyContacts(data);
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ preferred_language: newLanguage })
      .eq("id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update language",
        variant: "destructive",
      });
    } else {
      setLanguage(newLanguage);
      toast({
        title: "Success",
        description: "Language updated successfully",
      });
    }
    setLoading(false);
  };

  const handleAddEmergencyContact = async () => {
    if (!user) return;
    if (!newContact.contact_name || !newContact.contact_number) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (emergencyContacts.filter(c => !c.is_default).length >= 5) {
      toast({
        title: "Error",
        description: "Maximum 5 custom emergency contacts allowed",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("emergency_contacts")
      .insert({
        user_id: user.id,
        ...newContact,
        is_default: false,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add emergency contact",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Emergency contact added successfully",
      });
      setNewContact({ contact_name: "", contact_number: "", relationship: "" });
      fetchEmergencyContacts();
    }
    setLoading(false);
  };

  const handleDeleteContact = async (id: string) => {
    setLoading(true);
    const { error } = await supabase
      .from("emergency_contacts")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete emergency contact",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Emergency contact deleted successfully",
      });
      fetchEmergencyContacts();
    }
    setLoading(false);
  };

  const handleNotificationToggle = (key: keyof NotificationPreferences) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    // In real implementation, this would sync with backend
    toast({
      title: "Success",
      description: "Notification preferences updated",
    });
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी (Hindi)" },
    { code: "mr", name: "मराठी (Marathi)" },
    { code: "gu", name: "ગુજરાતી (Gujarati)" },
    { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)" },
    { code: "bn", name: "বাংলা (Bengali)" },
    { code: "ta", name: "தமிழ் (Tamil)" },
    { code: "te", name: "తెలుగు (Telugu)" },
    { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
    { code: "ml", name: "മലയാളം (Malayalam)" },
    { code: "or", name: "ଓଡ଼ିଆ (Odia)" },
  ];

  return (
    <FarmerLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="language">
              <Globe className="h-4 w-4 mr-2" />
              Language
            </TabsTrigger>
            <TabsTrigger value="emergency">
              <Phone className="h-4 w-4 mr-2" />
              Emergency Contacts
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weather">Weather Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts about weather conditions affecting livestock
                    </p>
                  </div>
                  <Switch
                    id="weather"
                    checked={notificationPrefs.weather_alerts}
                    onCheckedChange={() => handleNotificationToggle("weather_alerts")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="disease">Disease Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about disease outbreaks in your area
                    </p>
                  </div>
                  <Switch
                    id="disease"
                    checked={notificationPrefs.disease_alerts}
                    onCheckedChange={() => handleNotificationToggle("disease_alerts")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="vaccination">Vaccination Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Reminders for upcoming vaccinations
                    </p>
                  </div>
                  <Switch
                    id="vaccination"
                    checked={notificationPrefs.vaccination_reminders}
                    onCheckedChange={() => handleNotificationToggle("vaccination_reminders")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketplace">Marketplace Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Updates on your marketplace listings
                    </p>
                  </div>
                  <Switch
                    id="marketplace"
                    checked={notificationPrefs.marketplace_updates}
                    onCheckedChange={() => handleNotificationToggle("marketplace_updates")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="health">Health Records</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications about health check-ups and treatments
                    </p>
                  </div>
                  <Switch
                    id="health"
                    checked={notificationPrefs.health_records}
                    onCheckedChange={() => handleNotificationToggle("health_records")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="system">System Announcements</Label>
                    <p className="text-sm text-muted-foreground">
                      Important system updates and announcements
                    </p>
                  </div>
                  <Switch
                    id="system"
                    checked={notificationPrefs.system_announcements}
                    onCheckedChange={() => handleNotificationToggle("system_announcements")}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Language Tab */}
          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle>Language Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger id="language" className="mt-2">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-2">
                      This will change the language across the entire application
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Contacts Tab */}
          <TabsContent value="emergency" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contact_name">Contact Name *</Label>
                    <Input
                      id="contact_name"
                      value={newContact.contact_name}
                      onChange={(e) => setNewContact({ ...newContact, contact_name: e.target.value })}
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_number">Phone Number *</Label>
                    <Input
                      id="contact_number"
                      value={newContact.contact_number}
                      onChange={(e) => setNewContact({ ...newContact, contact_number: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input
                      id="relationship"
                      value={newContact.relationship}
                      onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                      placeholder="e.g., Veterinarian, Family"
                    />
                  </div>
                  <Button onClick={handleAddEmergencyContact} disabled={loading} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                {emergencyContacts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No emergency contacts added yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {emergencyContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between border-b pb-3 last:border-0"
                      >
                        <div>
                          <p className="font-medium">{contact.contact_name}</p>
                          <p className="text-sm text-muted-foreground">{contact.contact_number}</p>
                          {contact.relationship && (
                            <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                          )}
                          {contact.is_default && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        {!contact.is_default && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteContact(contact.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FarmerLayout>
  );
};

export default Settings;
