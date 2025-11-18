import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import Layout from "@/components/Layout";
import { z } from "zod";

const vaccinationSchema = z.object({
  animal_id: z.string().min(1, "Please select an animal"),
  vaccine_name: z.string().min(2, "Vaccine name must be at least 2 characters"),
  vaccine_type: z.string().optional(),
  batch_number: z.string().optional(),
  administered_by: z.string().min(2, "Administered by is required"),
  next_due_date: z.string().optional(),
  notes: z.string().optional(),
});

const AddVaccination = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [animals, setAnimals] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    animal_id: "",
    vaccine_name: "",
    vaccine_type: "",
    batch_number: "",
    administered_by: "",
    next_due_date: "",
    notes: "",
  });

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    const { data, error } = await supabase
      .from("animals")
      .select("id, name, species, identification_number")
      .order("name");

    if (!error && data) {
      setAnimals(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = vaccinationSchema.parse(formData);

      const { error } = await supabase.from("vaccinations").insert([{
        animal_id: validated.animal_id,
        vaccine_name: validated.vaccine_name,
        vaccine_type: validated.vaccine_type || null,
        batch_number: validated.batch_number || null,
        administered_by: validated.administered_by || null,
        next_due_date: validated.next_due_date || null,
        notes: validated.notes || null,
        administered_date: new Date().toISOString().split("T")[0],
      }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vaccination record added successfully",
      });

      navigate("/veterinary-dashboard");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to add vaccination record",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate("/veterinary-dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Add Vaccination Record</CardTitle>
            <CardDescription>Record animal vaccination details and schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="animal">Animal *</Label>
                <Select
                  value={formData.animal_id}
                  onValueChange={(value) => setFormData({ ...formData, animal_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {animals.map((animal) => (
                      <SelectItem key={animal.id} value={animal.id}>
                        {animal.name} - {animal.species} ({animal.identification_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vaccine-name">Vaccine Name *</Label>
                  <Input
                    id="vaccine-name"
                    placeholder="e.g., FMD Vaccine"
                    value={formData.vaccine_name}
                    onChange={(e) => setFormData({ ...formData, vaccine_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vaccine-type">Vaccine Type</Label>
                  <Input
                    id="vaccine-type"
                    placeholder="e.g., Live Attenuated"
                    value={formData.vaccine_type}
                    onChange={(e) => setFormData({ ...formData, vaccine_type: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batch">Batch Number</Label>
                  <Input
                    id="batch"
                    placeholder="Vaccine batch number"
                    value={formData.batch_number}
                    onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="administered-by">Administered By *</Label>
                  <Input
                    id="administered-by"
                    placeholder="Veterinarian name"
                    value={formData.administered_by}
                    onChange={(e) => setFormData({ ...formData, administered_by: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="next-due">Next Due Date</Label>
                <Input
                  id="next-due"
                  type="date"
                  value={formData.next_due_date}
                  onChange={(e) => setFormData({ ...formData, next_due_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes or observations"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Saving..." : "Save Vaccination Record"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddVaccination;
