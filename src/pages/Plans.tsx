import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import FarmerLayout from "@/components/FarmerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Crown, Star, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_months: number;
  features: string[];
  is_active: boolean;
}

interface UserSubscription {
  id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  status: string;
}

const Plans = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
    if (user) {
      fetchCurrentSubscription();
    }
  }, [user]);

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("price", { ascending: true });

    if (error) {
      console.error("Error fetching plans:", error);
      toast({
        title: "Error",
        description: "Failed to load subscription plans",
        variant: "destructive",
      });
    } else {
      setPlans(data || []);
    }
    setLoading(false);
  };

  const fetchCurrentSubscription = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!error && data) {
      setCurrentSubscription(data);
    }
  };

  const handleSubscribe = async (planId: string, durationMonths: number) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setSubscribing(planId);

    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + durationMonths);

      const { error } = await supabase
        .from("user_subscriptions")
        .insert({
          user_id: user.id,
          plan_id: planId,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: "active",
          payment_details: { method: "pending_payment" },
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your subscription has been activated",
      });

      fetchCurrentSubscription();
    } catch (error) {
      console.error("Error subscribing:", error);
      toast({
        title: "Error",
        description: "Failed to activate subscription",
        variant: "destructive",
      });
    } finally {
      setSubscribing(null);
    }
  };

  const getPlanIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Zap className="w-8 h-8 text-primary" />;
      case 1:
        return <Star className="w-8 h-8 text-primary" />;
      case 2:
        return <Crown className="w-8 h-8 text-primary" />;
      default:
        return <Star className="w-8 h-8 text-primary" />;
    }
  };

  if (loading) {
    return (
      <FarmerLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </FarmerLayout>
    );
  }

  return (
    <FarmerLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Select the perfect plan for your farm management needs
          </p>
          {currentSubscription && (
            <Badge variant="secondary" className="text-sm">
              Currently Active Subscription
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all hover:shadow-lg ${
                index === 1 ? "border-primary shadow-md scale-105" : ""
              }`}
            >
              {index === 1 && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="space-y-4">
                <div className="flex justify-between items-start">
                  {getPlanIcon(index)}
                  {currentSubscription?.plan_id === plan.id && (
                    <Badge variant="secondary">Active</Badge>
                  )}
                </div>
                
                <div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">₹{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.duration_months} month{plan.duration_months > 1 ? 's' : ''}</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  variant={index === 1 ? "default" : "outline"}
                  disabled={currentSubscription?.plan_id === plan.id || subscribing === plan.id}
                  onClick={() => handleSubscribe(plan.id, plan.duration_months)}
                >
                  {subscribing === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : currentSubscription?.plan_id === plan.id ? (
                    "Current Plan"
                  ) : (
                    "Subscribe Now"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="bg-muted rounded-lg p-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            All plans include mobile app access, data backup, and email support
          </p>
          <p className="text-xs text-muted-foreground">
            Need a custom plan for your enterprise? Contact us at support@ais.com
          </p>
        </div>
      </div>
    </FarmerLayout>
  );
};

export default Plans;
