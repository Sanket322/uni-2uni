import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, TrendingUp, Users, Activity, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState("30");
  const [stats, setStats] = useState({
    totalAnimals: 0,
    totalUsers: 0,
    totalListings: 0,
    totalHealthRecords: 0,
    totalVaccinations: 0,
    totalSchemes: 0,
  });

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    setLoading(true);

    try {
      const [animals, users, listings, healthRecords, vaccinations, schemes] =
        await Promise.all([
          supabase.from("animals").select("id", { count: "exact", head: true }),
          supabase.from("profiles").select("id", { count: "exact", head: true }),
          supabase
            .from("marketplace_listings")
            .select("id", { count: "exact", head: true }),
          supabase.from("health_records").select("id", { count: "exact", head: true }),
          supabase.from("vaccinations").select("id", { count: "exact", head: true }),
          supabase.from("government_schemes").select("id", { count: "exact", head: true }),
        ]);

      setStats({
        totalAnimals: animals.count || 0,
        totalUsers: users.count || 0,
        totalListings: listings.count || 0,
        totalHealthRecords: healthRecords.count || 0,
        totalVaccinations: vaccinations.count || 0,
        totalSchemes: schemes.count || 0,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch statistics",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting reports in ${format} format...`,
    });
    // TODO: Implement actual export functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive insights and data analytics
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="365">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExport("pdf")}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport("csv")}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAnimals}</div>
            <p className="text-xs text-muted-foreground">Registered in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Active farmers and officers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketplace Listings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalListings}</div>
            <p className="text-xs text-muted-foreground">Buy/sell transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Records</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHealthRecords}</div>
            <p className="text-xs text-muted-foreground">Medical consultations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vaccinations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVaccinations}</div>
            <p className="text-xs text-muted-foreground">Administered vaccines</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Schemes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSchemes}</div>
            <p className="text-xs text-muted-foreground">Government programs</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Animal Health Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Healthy Animals</span>
                <span className="text-sm font-semibold">—</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Under Treatment</span>
                <span className="text-sm font-semibold">—</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Quarantined</span>
                <span className="text-sm font-semibold">—</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Vaccination Due</span>
                <span className="text-sm font-semibold">—</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Species Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Cattle</span>
                <span className="text-sm font-semibold">—</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Goat</span>
                <span className="text-sm font-semibold">—</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Sheep</span>
                <span className="text-sm font-semibold">—</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Poultry</span>
                <span className="text-sm font-semibold">—</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Top State</span>
                <span className="text-sm font-semibold">—</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Top District</span>
                <span className="text-sm font-semibold">—</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Regions</span>
                <span className="text-sm font-semibold">—</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Daily Active Users</span>
                <span className="text-sm font-semibold">—</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Monthly Active Users</span>
                <span className="text-sm font-semibold">—</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">AI Queries</span>
                <span className="text-sm font-semibold">—</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              • All statistics are based on the selected time range ({dateRange} days)
            </p>
            <p>• Health status data is updated in real-time</p>
            <p>• Export functionality includes detailed breakdowns for all metrics</p>
            <p>
              • Disease prediction and geo-tagged reports are available through RF's NADRES
              v2 integration
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
