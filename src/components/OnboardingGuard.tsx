import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

const OnboardingGuard = ({ children }: OnboardingGuardProps) => {
  const { user } = useAuth();
  const { isFarmer, loading: rolesLoading } = useUserRole();
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkOnboardingStatus();
  }, [user, isFarmer, rolesLoading]);

  const checkOnboardingStatus = async () => {
    if (!user || rolesLoading) {
      setChecking(false);
      return;
    }

    // Only check onboarding for farmers
    if (!isFarmer) {
      setChecking(false);
      return;
    }

    // Don't redirect if already on onboarding page
    if (location.pathname === "/onboarding") {
      setChecking(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (!data?.onboarding_completed) {
        navigate("/onboarding");
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    } finally {
      setChecking(false);
    }
  };

  if (checking || rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default OnboardingGuard;
