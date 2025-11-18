import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Plus, Syringe, Calendar, AlertCircle } from "lucide-react";
import { format, isPast, differenceInDays } from "date-fns";

const Vaccinations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vaccinations, setVaccinations] = useState<any[]>([]);
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    animal_id: "",
    vaccine_name: "",
    vaccine_type: "",
    administered_date: new Date().toISOString().split("T")[0],
    administered_by: "",
    batch_number: "",
    next_due_date: "",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    const { data: animalsData } = await supabase
      .from("animals")
      .select("*")
      .eq("owner_id", user.id);
    
    if (animalsData) setAnimals(animalsData);

    const animalIds = animalsData?.map(a => a.id) || [];
    if (animalIds.length === 0) {
      setLoading(false);
      return;
    }

    const { data: vaccinationsData } = await supabase
      .from("vaccinations")
      .select(`
        *,
        animals:animal_id (name, species, breed)
      `)
      .in("animal_id", animalIds)
      .order("administered_date", { ascending: false});

    if (vaccinationsData) setVaccinations(vaccinationsData);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.animal_id || !formData.vaccine_name) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("vaccinations").insert([formData]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Vaccination record added successfully",
      });
      setDialogOpen(false);
      setFormData({
        animal_id: "",
        vaccine_name: "",
        vaccine_type: "",
        administered_date: new Date().toISOString().split("T")[0],
        administered_by: "",
        batch_number: "",
        next_due_date: "",
        notes: "",
      });
      fetchData();
    }
  };

  const getDueStatus = (dueDate: string | null) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const today = new Date();
    const daysDiff = differenceInDays(due, today);

    if (isPast(due)) {
      return { label: "Overdue", variant: "destructive" as const };
    } else if (daysDiff <= 7) {
      return { label: "Due Soon", variant: "secondary" as const };
    } else if (daysDiff <= 30) {
      return { label: "Upcoming", variant: "default" as const };
    }
    return null;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Vaccinations</h1>
            <p className="text-muted-foreground">Track vaccination schedules and history</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Vaccination
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Vaccination Record</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Animal *</Label>
                  <Select
                    value={formData.animal_id}
                    onValueChange={(value) => setFormData({ ...formData, animal_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose animal" />
                    </SelectTrigger>
                    <SelectContent>
                      {animals.map((animal) => (
                        <SelectItem key={animal.id} value={animal.id}>
                          {animal.name || "Unnamed"} - {animal.species}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vaccine Name *</Label>
                    <Input
                      value={formData.vaccine_name}
                      onChange={(e) => setFormData({ ...formData, vaccine_name: e.target.value })}
                      placeholder="e.g., FMD, PPR, LSD"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Vaccine Type</Label>
                    <Input
                      value={formData.vaccine_type}
                      onChange={(e) => setFormData({ ...formData, vaccine_type: e.target.value })}
                      placeholder="e.g., Live, Inactivated"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Administered Date *</Label>
                    <Input
                      type="date"
                      value={formData.administered_date}
                      onChange={(e) => setFormData({ ...formData, administered_date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Next Due Date</Label>
                    <Input
                      type="date"
                      value={formData.next_due_date}
                      onChange={(e) => setFormData({ ...formData, next_due_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Administered By</Label>
                    <Input
                      value={formData.administered_by}
                      onChange={(e) => setFormData({ ...formData, administered_by: e.target.value })}
                      placeholder="Veterinarian name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Batch Number</Label>
                    <Input
                      value={formData.batch_number}
                      onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                      placeholder="Vaccine batch number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes"
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">Add Vaccination</Button>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : vaccinations.length > 0 ? (
          <div className="space-y-4">
            {vaccinations.map((vaccination) => {
              const dueStatus = getDueStatus(vaccination.next_due_date);
              return (
                <Card key={vaccination.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Syringe className="h-5 w-5 text-primary" />
                          {vaccination.vaccine_name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {vaccination.animals?.name || "Unknown Animal"} - {vaccination.animals?.species}
                        </p>
                      </div>
                      {dueStatus && (
                        <Badge variant={dueStatus.variant} className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {dueStatus.label}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Administered Date</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(vaccination.administered_date), "PPP")}
                        </p>
                      </div>
                      {vaccination.next_due_date && (
                        <div>
                          <p className="text-sm font-medium">Next Due Date</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(vaccination.next_due_date), "PPP")}
                          </p>
                        </div>
                      )}
                    </div>

                    {vaccination.vaccine_type && (
                      <div>
                        <p className="text-sm font-medium">Type:</p>
                        <p className="text-sm text-muted-foreground">{vaccination.vaccine_type}</p>
                      </div>
                    )}

                    {vaccination.administered_by && (
                      <div>
                        <p className="text-sm font-medium">Administered By:</p>
                        <p className="text-sm text-muted-foreground">{vaccination.administered_by}</p>
                      </div>
                    )}

                    {vaccination.batch_number && (
                      <div>
                        <p className="text-sm font-medium">Batch Number:</p>
                        <p className="text-sm text-muted-foreground">{vaccination.batch_number}</p>
                      </div>
                    )}

                    {vaccination.notes && (
                      <div>
                        <p className="text-sm font-medium">Notes:</p>
                        <p className="text-sm text-muted-foreground">{vaccination.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Syringe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No vaccination records yet</p>
              <p className="text-sm text-muted-foreground mt-2">Add your first vaccination to track immunization schedules</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Vaccinations;
