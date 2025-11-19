import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  impersonatedUserId: string | null;
  isImpersonating: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, phoneNumber: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  startImpersonation: (userId: string) => void;
  stopImpersonation: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [impersonatedUserId, setImpersonatedUserId] = useState<string | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error getting session:', error);
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string, phoneNumber: string) => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          phone_number: phoneNumber,
        }
      }
    });
    return { error };
  };

  const signOut = async () => {
    setImpersonatedUserId(null);
    setIsImpersonating(false);
    await supabase.auth.signOut();
  };

  const startImpersonation = async (userId: string) => {
    try {
      // SECURITY: Call server-side edge function for impersonation with audit logging
      const { data, error } = await supabase.functions.invoke('impersonate-user', {
        body: {
          targetUserId: userId,
          action: 'start'
        }
      });

      if (error) {
        console.error('Failed to start impersonation:', error);
        return;
      }

      setImpersonatedUserId(userId);
      setIsImpersonating(true);
    } catch (error) {
      console.error('Error starting impersonation:', error);
    }
  };

  const stopImpersonation = async () => {
    try {
      if (impersonatedUserId) {
        // SECURITY: Log impersonation end on server
        await supabase.functions.invoke('impersonate-user', {
          body: {
            targetUserId: impersonatedUserId,
            action: 'stop'
          }
        });
      }
    } catch (error) {
      console.error('Error stopping impersonation:', error);
    } finally {
      setImpersonatedUserId(null);
      setIsImpersonating(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      impersonatedUserId,
      isImpersonating,
      signIn, 
      signUp, 
      signOut,
      startImpersonation,
      stopImpersonation
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
