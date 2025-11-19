import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, Navigate } from "react-router-dom";
import { User, Shield, Stethoscope, Target } from "lucide-react";

const DemoLogin = () => {
  const navigate = useNavigate();

  // SECURITY: Disable demo login in production
  if (import.meta.env.PROD) {
    return <Navigate to="/" replace />;
  }

  const roles = [
    {
      id: "farmer",
      name: "Farmer",
      description: "Access livestock management, health records, and marketplace",
      icon: User,
      route: "/dashboard",
      color: "text-green-600"
    },
    {
      id: "veterinary",
      name: "Veterinary Officer",
      description: "Manage health records, vaccinations, and disease tracking",
      icon: Stethoscope,
      route: "/veterinary-dashboard",
      color: "text-blue-600"
    },
    {
      id: "coordinator",
      name: "Program Coordinator",
      description: "Monitor programs, analytics, and scheme management",
      icon: Target,
      route: "/coordinator-dashboard",
      color: "text-purple-600"
    },
    {
      id: "admin",
      name: "Admin",
      description: "Full system access and management capabilities",
      icon: Shield,
      route: "/admin",
      color: "text-red-600"
    }
  ];

  const handleRoleSelect = (route: string) => {
    // For demo purposes, directly navigate without authentication
    navigate(route);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Demo Login</CardTitle>
          <CardDescription className="text-base">
            Select a role to explore the platform (No authentication required)
          </CardDescription>
          <div className="mt-4 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-600 dark:text-yellow-500">
              ⚠️ This is a demo mode for testing purposes only
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Button
                  key={role.id}
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-accent hover:border-primary transition-all"
                  onClick={() => handleRoleSelect(role.route)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`p-3 rounded-lg bg-primary/10 ${role.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-lg">{role.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    {role.description}
                  </p>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoLogin;
