import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { Link } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const AdminAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const { signIn, user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && !roleLoading) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        toast({
          title: "Access Denied",
          description: "This login is for administrators only",
          variant: "destructive",
        });
        navigate("/");
      }
    }
  }, [user, isAdmin, roleLoading, navigate, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      loginSchema.parse(loginData);
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Welcome back, Admin!", description: "Login successful" });
        // The useEffect will handle redirection after role is loaded
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: err.errors[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-slate-300 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <Card className="shadow-2xl border-slate-700">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-full p-4 shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Admin Access</CardTitle>
              <CardDescription className="text-base mt-2">
                Restricted area for system administrators
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Admin Sign In"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-amber-600 dark:text-amber-400 font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Authorized personnel only
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Unauthorized access attempts are logged and monitored.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuth;
