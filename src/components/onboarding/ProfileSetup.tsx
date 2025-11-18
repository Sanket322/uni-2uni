import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, MapPin } from "lucide-react";

interface ProfileData {
  full_name: string;
  phone_number: string;
  state: string;
  district: string;
  village: string;
  pin_code: string;
}

interface ProfileSetupProps {
  initialData: ProfileData;
  onComplete: (data: ProfileData) => void;
}

const ProfileSetup = ({ initialData, onComplete }: ProfileSetupProps) => {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update(formData)
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });

      onComplete(formData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>Tell us about yourself and your farm location</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="phone_number">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  required
                  placeholder="Enter your phone number"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                  placeholder="Enter your state"
                />
              </div>

              <div>
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  required
                  placeholder="Enter your district"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="village">Village</Label>
                <Input
                  id="village"
                  value={formData.village || ""}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  placeholder="Enter your village"
                />
              </div>

              <div>
                <Label htmlFor="pin_code">PIN Code</Label>
                <Input
                  id="pin_code"
                  value={formData.pin_code || ""}
                  onChange={(e) => setFormData({ ...formData, pin_code: e.target.value })}
                  placeholder="Enter your PIN code"
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : "Continue to Subscription"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileSetup;
