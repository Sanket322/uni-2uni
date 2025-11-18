import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProfileSetup from "@/components/onboarding/ProfileSetup";
import SubscriptionSelection from "@/components/onboarding/SubscriptionSelection";
import TutorialGuide from "@/components/onboarding/TutorialGuide";
import { Progress } from "@/components/ui/progress";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    full_name: "",
    phone_number: "",
    state: "",
    district: "",
    village: "",
    pin_code: "",
  });
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkOnboardingStatus();
  }, [user]);

  const checkOnboardingStatus = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .single();

    if (data?.onboarding_completed) {
      navigate("/dashboard");
    }
  };

  const handleProfileComplete = (data: typeof profileData) => {
    setProfileData(data);
    setCurrentStep(2);
  };

  const handleSubscriptionComplete = (planId: string) => {
    setSelectedPlan(planId);
    setCurrentStep(3);
  };

  const handleTutorialComplete = async () => {
    try {
      // Mark onboarding as completed
      const { error } = await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: "Welcome aboard!",
        description: "Your account is all set up. Let's get started!",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Welcome to Animal Information System</h1>
          <p className="text-center text-muted-foreground mb-6">
            Let's set up your account in 3 simple steps
          </p>
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>Profile Setup</span>
              <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>Choose Plan</span>
              <span className={currentStep >= 3 ? "text-primary font-medium" : ""}>Tutorial</span>
            </div>
          </div>
        </div>

        {currentStep === 1 && (
          <ProfileSetup
            initialData={profileData}
            onComplete={handleProfileComplete}
          />
        )}

        {currentStep === 2 && (
          <SubscriptionSelection
            onComplete={handleSubscriptionComplete}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <TutorialGuide
            onComplete={handleTutorialComplete}
            onBack={() => setCurrentStep(2)}
          />
        )}
      </div>
    </div>
  );
};

export default Onboarding;
