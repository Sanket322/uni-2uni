import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sprout, Heart, TrendingUp, ShieldCheck } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <Sprout className="h-12 w-12 text-white" />
            <h1 className="text-5xl font-bold text-white">Animal Information System</h1>
          </div>
          <p className="text-xl text-white/90 mb-2">Mobile App for Healthy Animals, Happy Farmers</p>
          <p className="text-white/80">Reliance Foundation - Digital Livestock Management Platform</p>
        </div>

        <div className="flex justify-center gap-4 mb-20">
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="bg-white text-primary hover:bg-white/90 shadow-lg"
          >
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate("/auth")}
            className="border-white text-white hover:bg-white/10"
          >
            Sign In
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-gradient-primary rounded-lg p-3 w-fit mb-4">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">Animal Health</h3>
            <p className="text-sm text-muted-foreground">Track vaccinations, health records, and veterinary consultations</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-gradient-primary rounded-lg p-3 w-fit mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">Livestock Management</h3>
            <p className="text-sm text-muted-foreground">Manage breeding, feeding schedules, and productivity</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-gradient-primary rounded-lg p-3 w-fit mb-4">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">AI-Powered Insights</h3>
            <p className="text-sm text-muted-foreground">Get instant disease diagnosis with AI Pashu Doctor</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-gradient-primary rounded-lg p-3 w-fit mb-4">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">Marketplace</h3>
            <p className="text-sm text-muted-foreground">Buy and sell livestock with verified listings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
