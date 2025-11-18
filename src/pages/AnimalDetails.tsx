import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { PawPrint, Heart, Syringe, Baby, Calendar } from "lucide-react";

const AnimalDetails = () => {
  const { id } = useParams();
  const [animal, setAnimal] = useState<any>(null);
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [vaccinations, setVaccinations] = useState<any[]>([]);
  const [breedingRecords, setBreedingRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnimalDetails();
  }, [id]);

  const fetchAnimalDetails = async () => {
    if (!id) return;

    const { data: animalData } = await supabase
      .from("animals")
      .select("*")
      .eq("id", id)
      .single();

    if (animalData) setAnimal(animalData);

    const { data: healthData } = await supabase
      .from("health_records")
      .select("*")
      .eq("animal_id", id)
      .order("record_date", { ascending: false });

    if (healthData) setHealthRecords(healthData);

    const { data: vaccinationData } = await supabase
      .from("vaccinations")
      .select("*")
      .eq("animal_id", id)
      .order("administered_date", { ascending: false });

    if (vaccinationData) setVaccinations(vaccinationData);

    const { data: breedingData } = await supabase
      .from("breeding_records")
      .select("*")
      .eq("animal_id", id)
      .order("breeding_date", { ascending: false });

    if (breedingData) setBreedingRecords(breedingData);

    setLoading(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </Layout>
    );
  }

  if (!animal) {
    return (
      <Layout>
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Animal not found</p>
            <Link to="/animals">
              <Button className="mt-4">Back to Animals</Button>
            </Link>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{animal.name || "Unnamed Animal"}</h1>
            <p className="text-muted-foreground capitalize">
              {animal.species} {animal.breed && `• ${animal.breed}`}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            animal.health_status === "healthy"
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning"
          }`}>
            {animal.health_status}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Gender</CardTitle>
              <PawPrint className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{animal.gender || "N/A"}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Age</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {animal.date_of_birth 
                  ? `${Math.floor((new Date().getTime() - new Date(animal.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years`
                  : "N/A"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">ID Number</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{animal.identification_number || "N/A"}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="health" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="health">Health Records</TabsTrigger>
            <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
            <TabsTrigger value="breeding">Breeding</TabsTrigger>
          </TabsList>
          
          <TabsContent value="health" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Health History</CardTitle>
              </CardHeader>
              <CardContent>
                {healthRecords.length > 0 ? (
                  <div className="space-y-4">
                    {healthRecords.map((record) => (
                      <div key={record.id} className="border-l-4 border-primary pl-4 py-2">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">{record.diagnosis || "Health Check"}</p>
                          <span className="text-sm text-muted-foreground">
                            {new Date(record.record_date).toLocaleDateString()}
                          </span>
                        </div>
                        {record.symptoms && (
                          <p className="text-sm text-muted-foreground mb-1">
                            <strong>Symptoms:</strong> {record.symptoms}
                          </p>
                        )}
                        {record.treatment && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Treatment:</strong> {record.treatment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No health records yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vaccinations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Vaccination History</CardTitle>
              </CardHeader>
              <CardContent>
                {vaccinations.length > 0 ? (
                  <div className="space-y-4">
                    {vaccinations.map((vac) => (
                      <div key={vac.id} className="border-l-4 border-success pl-4 py-2">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">{vac.vaccine_name}</p>
                          <span className="text-sm text-muted-foreground">
                            {new Date(vac.administered_date).toLocaleDateString()}
                          </span>
                        </div>
                        {vac.next_due_date && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Next Due:</strong> {new Date(vac.next_due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No vaccination records yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breeding" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Breeding History</CardTitle>
              </CardHeader>
              <CardContent>
                {breedingRecords.length > 0 ? (
                  <div className="space-y-4">
                    {breedingRecords.map((record) => (
                      <div key={record.id} className="border-l-4 border-accent pl-4 py-2">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">Breeding Event</p>
                          <span className="text-sm text-muted-foreground">
                            {new Date(record.breeding_date).toLocaleDateString()}
                          </span>
                        </div>
                        {record.expected_delivery_date && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Expected Delivery:</strong> {new Date(record.expected_delivery_date).toLocaleDateString()}
                          </p>
                        )}
                        {record.offspring_count && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Offspring:</strong> {record.offspring_count}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No breeding records yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AnimalDetails;
