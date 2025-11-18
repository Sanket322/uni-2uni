import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { X, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const ImpersonationBanner = () => {
  const { isImpersonating, impersonatedUserId, stopImpersonation } = useAuth();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (impersonatedUserId) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", impersonatedUserId)
          .single();
        
        if (data) {
          setUserName(data.full_name);
        }
      }
    };

    fetchUserName();
  }, [impersonatedUserId]);

  if (!isImpersonating) return null;

  return (
    <Alert className="fixed top-0 left-0 right-0 z-50 rounded-none border-b-2 bg-destructive text-destructive-foreground">
      <UserCog className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          <strong>Impersonating User:</strong> {userName || "Loading..."}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={stopImpersonation}
          className="ml-4 bg-background text-foreground hover:bg-accent"
        >
          <X className="h-4 w-4 mr-2" />
          Exit Impersonation
        </Button>
      </AlertDescription>
    </Alert>
  );
};
