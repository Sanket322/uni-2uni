import { useEffect, useState } from "react";
import FarmerLayout from "@/components/FarmerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Plus, Search, PawPrint } from "lucide-react";

const Animals = () => {
  const { user } = useAuth();
  const [animals, setAnimals] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnimals();
  }, [user]);

  const fetchAnimals = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("animals")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setAnimals(data);
    }
    setLoading(false);
  };

  const filteredAnimals = animals.filter((animal) =>
    (animal.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (animal.species?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (animal.breed?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <FarmerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Animals</h1>
            <p className="text-muted-foreground">Manage your livestock</p>
          </div>
          <Link to="/animals/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Animal
            </Button>
          </Link>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search animals by name, species, or breed..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading animals...</p>
          </div>
        ) : filteredAnimals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAnimals.map((animal) => (
              <Link key={animal.id} to={`/animals/${animal.id}`}>
                <Card className="hover:shadow-lg transition-all hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-primary/10 rounded-full p-3">
                        <PawPrint className="h-6 w-6 text-primary" />
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        animal.health_status === "healthy"
                          ? "bg-success/10 text-success"
                          : animal.health_status === "sick"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-warning/10 text-warning"
                      }`}>
                        {animal.health_status}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-1">
                      {animal.name || "Unnamed"}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize mb-2">
                      {animal.species} {animal.breed && `• ${animal.breed}`}
                    </p>
                    {animal.identification_number && (
                      <p className="text-xs text-muted-foreground">
                        ID: {animal.identification_number}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <PawPrint className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No animals found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Start by adding your first animal"}
              </p>
              <Link to="/animals/add">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Animal
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </FarmerLayout>
  );
};

export default Animals;
