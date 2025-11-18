import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, TrendingUp, Bell, MapPin, Calendar, FileText, Target, Activity } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFarmers: 0,
    totalAnimals: 0,
    activeSchemes: 0,
    pendingNotifications: 0,
  });
  const [regionalData, setRegionalData] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [schemeEngagement, setSchemeEngagement] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total farmers (users with farmer role)
      const { count: totalFarmers } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "farmer");

      // Fetch total animals
      const { count: totalAnimals } = await supabase
        .from("animals")
        .select("*", { count: "exact", head: true });

      // Fetch active schemes
      const { count: activeSchemes } = await supabase
        .from("government_schemes")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      // Fetch pending notifications
      const { count: pendingNotifications } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);

      setStats({
        totalFarmers: totalFarmers || 0,
        totalAnimals: totalAnimals || 0,
        activeSchemes: activeSchemes || 0,
        pendingNotifications: pendingNotifications || 0,
      });

      // Fetch regional distribution
      const { data: profiles } = await supabase
        .from("profiles")
        .select("state, district");

      const stateCount: { [key: string]: number } = {};
      profiles?.forEach((profile) => {
        if (profile.state) {
          stateCount[profile.state] = (stateCount[profile.state] || 0) + 1;
        }
      });

      const regionalArray = Object.entries(stateCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setRegionalData(regionalArray);

      // Fetch recent marketplace activities
      const { data: listings } = await supabase
        .from("marketplace_listings")
        .select(`
          id,
          title,
          created_at,
          status,
          seller_id,
          profiles (full_name, state)
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      setRecentActivities(listings || []);

      // Fetch government schemes
      const { data: schemes } = await supabase
        .from("government_schemes")
        .select("scheme_name, state, is_active")
        .eq("is_active", true)
        .limit(10);

      setSchemeEngagement(schemes || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Program Coordinator Portal</h1>
            <p className="text-muted-foreground mt-1">Monitor and coordinate regional livestock programs</p>
          </div>
          <Button onClick={() => navigate("/schemes")}>
            <Target className="mr-2 h-4 w-4" />
            View Schemes
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFarmers}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnimals}</div>
              <p className="text-xs text-muted-foreground">In the system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Schemes</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSchemes}</div>
              <p className="text-xs text-muted-foreground">Government programs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingNotifications}</div>
              <p className="text-xs text-muted-foreground">Pending alerts</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="regional" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="regional">Regional Data</TabsTrigger>
            <TabsTrigger value="activities">Recent Activities</TabsTrigger>
            <TabsTrigger value="schemes">Schemes</TabsTrigger>
          </TabsList>

          <TabsContent value="regional" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
                <CardDescription>Farmers by state/region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionalData.length === 0 ? (
                    <p className="text-center text-muted-foreground">No regional data available</p>
                  ) : (
                    regionalData.map((region, index) => (
                      <div key={region.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{region.name || "Unknown"}</span>
                          </div>
                        </div>
                        <Badge variant="secondary">{region.count} farmers</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Coordination and management tools</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto py-4" onClick={() => navigate("/analytics")}>
                  <TrendingUp className="mr-2 h-5 w-5" />
                  <span>View Analytics</span>
                </Button>
                <Button variant="outline" className="h-auto py-4" onClick={() => navigate("/schemes")}>
                  <Target className="mr-2 h-5 w-5" />
                  <span>Manage Schemes</span>
                </Button>
                <Button variant="outline" className="h-auto py-4" onClick={() => navigate("/notifications")}>
                  <Bell className="mr-2 h-5 w-5" />
                  <span>Send Notifications</span>
                </Button>
                <Button variant="outline" className="h-auto py-4" onClick={() => navigate("/marketplace")}>
                  <Activity className="mr-2 h-5 w-5" />
                  <span>Monitor Marketplace</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Marketplace Activities</CardTitle>
                <CardDescription>Latest listings and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Listing</TableHead>
                        <TableHead>Seller</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentActivities.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            No recent activities
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentActivities.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell>{new Date(activity.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="max-w-xs truncate">{activity.title}</TableCell>
                            <TableCell>{(activity.profiles as any)?.full_name || "Unknown"}</TableCell>
                            <TableCell>{(activity.profiles as any)?.state || "N/A"}</TableCell>
                            <TableCell>
                              <Badge variant={activity.status === "active" ? "default" : "secondary"}>
                                {activity.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="ghost" onClick={() => navigate("/marketplace")}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schemes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Government Schemes</CardTitle>
                <CardDescription>Programs available for farmers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Scheme Name</TableHead>
                        <TableHead>State/Region</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schemeEngagement.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                            No active schemes
                          </TableCell>
                        </TableRow>
                      ) : (
                        schemeEngagement.map((scheme, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{scheme.scheme_name}</TableCell>
                            <TableCell>{scheme.state || "All Regions"}</TableCell>
                            <TableCell>
                              <Badge variant="default">Active</Badge>
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="ghost" onClick={() => navigate("/schemes")}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CoordinatorDashboard;
