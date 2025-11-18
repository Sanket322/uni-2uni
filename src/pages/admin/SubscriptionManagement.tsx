import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Users, CreditCard, TrendingUp, Search } from "lucide-react";
import { format } from "date-fns";

interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  profiles: {
    full_name: string;
    phone_number: string;
  };
  subscription_plans: {
    name: string;
    price: number;
  };
}

const SubscriptionManagement = () => {
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchSubscriptions();
    fetchStats();
  }, []);

  const fetchSubscriptions = async () => {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select(`
        *,
        profiles (full_name, phone_number),
        subscription_plans (name, price)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch subscriptions",
        variant: "destructive",
      });
      console.error("Error:", error);
    } else {
      setSubscriptions(data as any || []);
    }
  };

  const fetchStats = async () => {
    const { data: allSubs } = await supabase
      .from("user_subscriptions")
      .select("*, subscription_plans(price)");

    if (allSubs) {
      const active = allSubs.filter((s) => s.status === "active").length;
      const revenue = allSubs.reduce((sum, s) => sum + ((s.subscription_plans as any)?.price || 0), 0);

      setStats({
        totalSubscriptions: allSubs.length,
        activeSubscriptions: active,
        totalRevenue: revenue,
      });
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.profiles?.phone_number?.includes(searchQuery)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "expired":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Subscription Management</h2>
        <p className="text-muted-foreground">Monitor and manage farmer subscriptions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubscriptions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by farmer name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Farmer</th>
                  <th className="text-left p-3 font-medium">Plan</th>
                  <th className="text-left p-3 font-medium">Price</th>
                  <th className="text-left p-3 font-medium">Start Date</th>
                  <th className="text-left p-3 font-medium">End Date</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-muted-foreground">
                      No subscriptions found
                    </td>
                  </tr>
                ) : (
                  filteredSubscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{sub.profiles?.full_name}</p>
                          <p className="text-sm text-muted-foreground">{sub.profiles?.phone_number}</p>
                        </div>
                      </td>
                      <td className="p-3">{sub.subscription_plans?.name}</td>
                      <td className="p-3">₹{sub.subscription_plans?.price}</td>
                      <td className="p-3 text-sm">{format(new Date(sub.start_date), "dd MMM yyyy")}</td>
                      <td className="p-3 text-sm">{format(new Date(sub.end_date), "dd MMM yyyy")}</td>
                      <td className="p-3">
                        <Badge variant={getStatusColor(sub.status)}>
                          {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
