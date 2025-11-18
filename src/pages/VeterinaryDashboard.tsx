import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Activity, Users, Syringe, ClipboardList, AlertCircle, Calendar, TrendingUp, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const VeterinaryDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAnimals: 0,
    criticalCases: 0,
    vaccinationsDue: 0,
    healthRecordsToday: 0,
  });
  const [recentCases, setRecentCases] = useState<any[]>([]);
  const [upcomingVaccinations, setUpcomingVaccinations] = useState<any[]>([]);
  const [diseaseStats, setDiseaseStats] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total animals
      const { count: totalAnimals } = await supabase
        .from("animals")
        .select("*", { count: "exact", head: true });

      // Fetch critical cases (animals with sick or under_treatment status)
      const { count: criticalCases } = await supabase
        .from("animals")
        .select("*", { count: "exact", head: true })
        .in("health_status", ["sick", "under_treatment"]);

      // Fetch vaccinations due (next_due_date within 7 days)
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      const { count: vaccinationsDue } = await supabase
        .from("vaccinations")
        .select("*", { count: "exact", head: true })
        .lte("next_due_date", sevenDaysFromNow.toISOString().split("T")[0])
        .gte("next_due_date", new Date().toISOString().split("T")[0]);

      // Fetch today's health records
      const today = new Date().toISOString().split("T")[0];
      const { count: healthRecordsToday } = await supabase
        .from("health_records")
        .select("*", { count: "exact", head: true })
        .eq("record_date", today);

      setStats({
        totalAnimals: totalAnimals || 0,
        criticalCases: criticalCases || 0,
        vaccinationsDue: vaccinationsDue || 0,
        healthRecordsToday: healthRecordsToday || 0,
      });

      // Fetch recent health cases
      const { data: cases } = await supabase
        .from("health_records")
        .select(`
          id,
          record_date,
          diagnosis,
          symptoms,
          animal_id,
          animals (name, species, identification_number)
        `)
        .order("record_date", { ascending: false })
        .limit(10);

      setRecentCases(cases || []);

      // Fetch upcoming vaccinations
      const { data: vaccinations } = await supabase
        .from("vaccinations")
        .select(`
          id,
          vaccine_name,
          next_due_date,
          animal_id,
          animals (name, species, identification_number)
        `)
        .gte("next_due_date", new Date().toISOString().split("T")[0])
        .order("next_due_date", { ascending: true })
        .limit(10);

      setUpcomingVaccinations(vaccinations || []);

      // Fetch disease statistics
      const { data: diseases } = await supabase
        .from("health_records")
        .select("diagnosis")
        .not("diagnosis", "is", null);

      const diseaseCount: { [key: string]: number } = {};
      diseases?.forEach((record) => {
        if (record.diagnosis) {
          diseaseCount[record.diagnosis] = (diseaseCount[record.diagnosis] || 0) + 1;
        }
      });

      const diseaseArray = Object.entries(diseaseCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setDiseaseStats(diseaseArray);
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
            <h1 className="text-3xl font-bold text-foreground">Veterinary Officer Portal</h1>
            <p className="text-muted-foreground mt-1">Manage animal health and medical operations</p>
          </div>
          <Button onClick={() => navigate("/health")}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Add Health Record
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnimals}</div>
              <p className="text-xs text-muted-foreground">Under observation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.criticalCases}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Vaccinations Due</CardTitle>
              <Syringe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.vaccinationsDue}</div>
              <p className="text-xs text-muted-foreground">Next 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Records</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.healthRecordsToday}</div>
              <p className="text-xs text-muted-foreground">Health records added</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="cases" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cases">Recent Cases</TabsTrigger>
            <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
            <TabsTrigger value="analytics">Disease Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="cases" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Health Cases</CardTitle>
                <CardDescription>Latest animal health records and diagnoses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Animal ID</TableHead>
                        <TableHead>Animal Name</TableHead>
                        <TableHead>Species</TableHead>
                        <TableHead>Symptoms</TableHead>
                        <TableHead>Diagnosis</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentCases.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            No health records found
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentCases.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{new Date(record.record_date).toLocaleDateString()}</TableCell>
                            <TableCell className="font-mono text-xs">
                              {record.animals?.identification_number || "N/A"}
                            </TableCell>
                            <TableCell>{record.animals?.name || "Unknown"}</TableCell>
                            <TableCell className="capitalize">{record.animals?.species}</TableCell>
                            <TableCell className="max-w-xs truncate">{record.symptoms || "N/A"}</TableCell>
                            <TableCell className="max-w-xs truncate">{record.diagnosis || "Pending"}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => navigate(`/animals/${record.animal_id}`)}
                              >
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

          <TabsContent value="vaccinations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Vaccinations</CardTitle>
                <CardDescription>Scheduled vaccination reminders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Animal ID</TableHead>
                        <TableHead>Animal Name</TableHead>
                        <TableHead>Species</TableHead>
                        <TableHead>Vaccine</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingVaccinations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            No upcoming vaccinations
                          </TableCell>
                        </TableRow>
                      ) : (
                        upcomingVaccinations.map((vaccination) => {
                          const daysUntil = Math.ceil(
                            (new Date(vaccination.next_due_date).getTime() - new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          );
                          const isUrgent = daysUntil <= 3;

                          return (
                            <TableRow key={vaccination.id}>
                              <TableCell>{new Date(vaccination.next_due_date).toLocaleDateString()}</TableCell>
                              <TableCell className="font-mono text-xs">
                                {vaccination.animals?.identification_number || "N/A"}
                              </TableCell>
                              <TableCell>{vaccination.animals?.name || "Unknown"}</TableCell>
                              <TableCell className="capitalize">{vaccination.animals?.species}</TableCell>
                              <TableCell>{vaccination.vaccine_name}</TableCell>
                              <TableCell>
                                <Badge variant={isUrgent ? "destructive" : "secondary"}>
                                  {daysUntil} days
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => navigate(`/vaccinations`)}
                                >
                                  Record
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Disease Statistics</CardTitle>
                <CardDescription>Most common diseases in the region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {diseaseStats.length === 0 ? (
                    <p className="text-center text-muted-foreground">No disease data available</p>
                  ) : (
                    diseaseStats.map((disease, index) => (
                      <div key={disease.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                            {index + 1}
                          </div>
                          <span className="font-medium">{disease.name}</span>
                        </div>
                        <Badge variant="secondary">{disease.count} cases</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common veterinary tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto py-4" onClick={() => navigate("/health")}>
                  <FileText className="mr-2 h-5 w-5" />
                  <span>Add Health Record</span>
                </Button>
                <Button variant="outline" className="h-auto py-4" onClick={() => navigate("/vaccinations")}>
                  <Syringe className="mr-2 h-5 w-5" />
                  <span>Record Vaccination</span>
                </Button>
                <Button variant="outline" className="h-auto py-4" onClick={() => navigate("/animals")}>
                  <Users className="mr-2 h-5 w-5" />
                  <span>View All Animals</span>
                </Button>
                <Button variant="outline" className="h-auto py-4" onClick={() => navigate("/analytics")}>
                  <TrendingUp className="mr-2 h-5 w-5" />
                  <span>View Reports</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default VeterinaryDashboard;
