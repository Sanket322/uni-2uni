import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  PawPrint,
  Heart,
  Syringe,
  AlertTriangle,
  TrendingUp,
  Plus,
  Calendar,
  Bell,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAnimals: 0,
    healthyAnimals: 0,
    upcomingVaccinations: 0,
    activeListings: 0,
  });
  const [recentAnimals, setRecentAnimals] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    // Fetch total animals
    const { data: animals, error: animalsError } = await supabase
      .from("animals")
      .select("*")
      .eq("owner_id", user.id);

    if (animals) {
      setStats((prev) => ({
        ...prev,
        totalAnimals: animals.length,
        healthyAnimals: animals.filter((a) => a.health_status === "healthy").length,
      }));
      setRecentAnimals(animals.slice(0, 5));
    }

    // Fetch upcoming vaccinations
    const { data: vaccinations } = await supabase
      .from("vaccinations")
      .select(`
        *,
        animals:animal_id (name, species)
      `)
      .gte("next_due_date", new Date().toISOString().split("T")[0])
      .order("next_due_date", { ascending: true })
      .limit(5);

    if (vaccinations) {
      setStats((prev) => ({
        ...prev,
        upcomingVaccinations: vaccinations.length,
      }));
      setUpcomingEvents(vaccinations);
    }

    // Fetch marketplace listings
    const { data: listings } = await supabase
      .from("marketplace_listings")
      .select("*")
      .eq("seller_id", user.id)
      .eq("status", "active");

    if (listings) {
      setStats((prev) => ({
        ...prev,
        activeListings: listings.length,
      }));
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your livestock overview</p>
          </div>
          <Link to="/animals/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Animal
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
              <PawPrint className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnimals}</div>
              <p className="text-xs text-muted-foreground">Registered in system</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Healthy Animals</CardTitle>
              <Heart className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.healthyAnimals}</div>
              <p className="text-xs text-muted-foreground">In good health</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Vaccinations</CardTitle>
              <Syringe className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.upcomingVaccinations}</div>
              <p className="text-xs text-muted-foreground">Due soon</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <TrendingUp className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-info">{stats.activeListings}</div>
              <p className="text-xs text-muted-foreground">In marketplace</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <Link to="/ai-doctor">
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  AI Health Check
                </Button>
              </Link>
              <Link to="/vaccinations">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Vaccination
                </Button>
              </Link>
              <Link to="/marketplace/create">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Create Listing
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Animals & Upcoming Events */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Animals</CardTitle>
            </CardHeader>
            <CardContent>
              {recentAnimals.length > 0 ? (
                <div className="space-y-3">
                  {recentAnimals.map((animal) => (
                    <Link
                      key={animal.id}
                      to={`/animals/${animal.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-full p-2">
                          <PawPrint className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{animal.name || "Unnamed"}</p>
                          <p className="text-sm text-muted-foreground capitalize">{animal.species}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        animal.health_status === "healthy"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}>
                        {animal.health_status}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <PawPrint className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No animals registered yet</p>
                  <Link to="/animals/add">
                    <Button variant="link" className="mt-2">Add your first animal</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="bg-warning/10 rounded-full p-2">
                        <Bell className="h-4 w-4 text-warning" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{event.vaccine_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.animals?.name} - Due: {new Date(event.next_due_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming events</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
