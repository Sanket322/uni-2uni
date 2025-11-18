import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Enums } from "@/integrations/supabase/types";

type UserRole = Enums<"app_role">;

export const useUserRole = () => {
  const { user, impersonatedUserId, isImpersonating } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoles = async () => {
      // Use impersonated user ID if impersonating, otherwise use actual user
      const targetUserId = isImpersonating ? impersonatedUserId : user?.id;
      
      if (!targetUserId) {
        setRoles([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", targetUserId);

      if (error) {
        console.error("Error fetching user roles:", error);
        setRoles([]);
      } else {
        setRoles(data?.map((r) => r.role) || []);
      }
      
      setLoading(false);
    };

    fetchUserRoles();
  }, [user, impersonatedUserId, isImpersonating]);

  const hasRole = (role: UserRole) => roles.includes(role);
  const isAdmin = hasRole("admin");
  const isVeterinaryOfficer = hasRole("veterinary_officer");
  const isProgramCoordinator = hasRole("program_coordinator");
  const isFarmer = hasRole("farmer");

  return {
    roles,
    loading,
    hasRole,
    isAdmin,
    isVeterinaryOfficer,
    isProgramCoordinator,
    isFarmer,
  };
};
