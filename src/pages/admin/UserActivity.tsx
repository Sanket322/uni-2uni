import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Clock, Activity, TrendingUp, Users, Calendar, BarChart3 } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

interface LoginHistory {
  id: string;
  user_id: string;
  login_timestamp: string;
  ip_address: string | null;
  user_agent: string | null;
}

interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  activity_description: string | null;
  feature_name: string | null;
  created_at: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
}

const UserActivity = () => {
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchActivityData();
  }, [selectedUser, dateRange]);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .order("full_name");

      if (error) throw error;

      const usersWithEmail = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: { user } } = await supabase.auth.admin.getUserById(profile.id);
          return {
            id: profile.id,
            full_name: profile.full_name,
            email: user?.email || "N/A",
          };
        })
      );

      setUsers(usersWithEmail);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchActivityData = async () => {
    setLoading(true);
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));

      // Fetch login history
      let loginQuery = supabase
        .from("user_login_history")
        .select("*")
        .gte("login_timestamp", daysAgo.toISOString())
        .order("login_timestamp", { ascending: false })
        .limit(100);

      if (selectedUser !== "all") {
        loginQuery = loginQuery.eq("user_id", selectedUser);
      }

      const { data: loginData, error: loginError } = await loginQuery;
      if (loginError) throw loginError;

      // Fetch activity logs
      let activityQuery = supabase
        .from("user_activity_logs")
        .select("*")
        .gte("created_at", daysAgo.toISOString())
        .order("created_at", { ascending: false })
        .limit(100);

      if (selectedUser !== "all") {
        activityQuery = activityQuery.eq("user_id", selectedUser);
      }

      const { data: activityData, error: activityError } = await activityQuery;
      if (activityError) throw activityError;

      setLoginHistory(loginData || []);
      setActivityLogs(activityData || []);
    } catch (error) {
      console.error("Error fetching activity data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch activity data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const totalLogins = loginHistory.length;
  const uniqueUsers = new Set(loginHistory.map(l => l.user_id)).size;
  const totalActivities = activityLogs.length;

  // Feature usage data
  const featureUsage = activityLogs.reduce((acc, log) => {
    const feature = log.feature_name || "Other";
    acc[feature] = (acc[feature] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const featureChartData = Object.entries(featureUsage).map(([name, count]) => ({
    name,
    count,
  }));

  // Activity type distribution
  const activityTypes = activityLogs.reduce((acc, log) => {
    acc[log.activity_type] = (acc[log.activity_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activityTypeData = Object.entries(activityTypes).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.full_name || "Unknown User";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">User Activity Tracking</h2>
        <p className="text-muted-foreground">Monitor user engagement, login history, and feature usage</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select User</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Last 24 Hours</SelectItem>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLogins}</div>
            <p className="text-xs text-muted-foreground">
              Across {uniqueUsers} users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActivities}</div>
            <p className="text-xs text-muted-foreground">
              User interactions tracked
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Activities/User</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uniqueUsers > 0 ? (totalActivities / uniqueUsers).toFixed(1) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Per active user
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Feature Usage</CardTitle>
            <CardDescription>Most used features by activity count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Type Distribution</CardTitle>
            <CardDescription>Breakdown by activity type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={activityTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {activityTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Login History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Login History</CardTitle>
          <CardDescription>Latest user login events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Login Time</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>User Agent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : loginHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No login history found
                    </TableCell>
                  </TableRow>
                ) : (
                  loginHistory.map((login) => (
                    <TableRow key={login.id}>
                      <TableCell className="font-medium">
                        {getUserName(login.user_id)}
                      </TableCell>
                      <TableCell>
                        {new Date(login.login_timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{login.ip_address || "N/A"}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {login.user_agent || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Logs</CardTitle>
          <CardDescription>Latest user activities and feature usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Activity Type</TableHead>
                  <TableHead>Feature</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : activityLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No activity logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  activityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {getUserName(log.user_id)}
                      </TableCell>
                      <TableCell>{log.activity_type}</TableCell>
                      <TableCell>{log.feature_name || "N/A"}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {log.activity_description || "N/A"}
                      </TableCell>
                      <TableCell>
                        {new Date(log.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivity;