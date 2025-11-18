import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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

const healthRecordSchema = z.object({
  animal_id: z.string().min(1, "Please select an animal"),
  symptoms: z.string().min(3, "Symptoms must be at least 3 characters"),
  diagnosis: z.string().min(3, "Diagnosis must be at least 3 characters"),
  treatment: z.string().min(3, "Treatment must be at least 3 characters"),
  prescription: z.string().optional(),
  veterinarian_notes: z.string().optional(),
  next_checkup_date: z.string().optional(),
});

const AddHealthRecord = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [animals, setAnimals] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    animal_id: "",
    symptoms: "",
    diagnosis: "",
    treatment: "",
    prescription: "",
    veterinarian_notes: "",
    next_checkup_date: "",
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
      const validated = healthRecordSchema.parse(formData);

      const { error } = await supabase.from("health_records").insert([{
        animal_id: validated.animal_id,
        symptoms: validated.symptoms,
        diagnosis: validated.diagnosis,
        treatment: validated.treatment,
        prescription: validated.prescription || null,
        veterinarian_notes: validated.veterinarian_notes || null,
        next_checkup_date: validated.next_checkup_date || null,
        record_date: new Date().toISOString().split("T")[0],
        recorded_by: user?.id || null,
      }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Health record added successfully",
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
          description: error.message || "Failed to add health record",
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
            <CardTitle>Add Health Record</CardTitle>
            <CardDescription>Record animal health examination and treatment details</CardDescription>
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
                  <Label htmlFor="symptoms">Symptoms *</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe observed symptoms"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis *</Label>
                  <Textarea
                    id="diagnosis"
                    placeholder="Medical diagnosis"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatment">Treatment Plan *</Label>
                <Textarea
                  id="treatment"
                  placeholder="Describe treatment plan and procedures"
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prescription">Prescription</Label>
                <Textarea
                  id="prescription"
                  placeholder="Medications and dosage instructions"
                  value={formData.prescription}
                  onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Veterinarian Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional observations and recommendations"
                  value={formData.veterinarian_notes}
                  onChange={(e) => setFormData({ ...formData, veterinarian_notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkup">Next Checkup Date</Label>
                <Input
                  id="checkup"
                  type="date"
                  value={formData.next_checkup_date}
                  onChange={(e) => setFormData({ ...formData, next_checkup_date: e.target.value })}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Saving..." : "Save Health Record"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddHealthRecord;
