import { useEffect, useState } from "react";
import FarmerLayout from "@/components/FarmerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Plus, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";

const HealthRecords = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [records, setRecords] = useState<any[]>([]);
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    animal_id: "",
    record_date: new Date().toISOString().split("T")[0],
    symptoms: "",
    diagnosis: "",
    treatment: "",
    prescription: "",
    veterinarian_notes: "",
    next_checkup_date: "",
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

    const { data: recordsData } = await supabase
      .from("health_records")
      .select(`
        *,
        animals:animal_id (name, species, breed)
      `)
      .in("animal_id", animalIds)
      .order("record_date", { ascending: false });

    if (recordsData) setRecords(recordsData);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.animal_id || !formData.record_date) {
      toast({
        title: "Error",
        description: "Please select an animal and date",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("health_records").insert([{
      ...formData,
      recorded_by: user?.id,
    }]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Health record added successfully",
      });
      setDialogOpen(false);
      setFormData({
        animal_id: "",
        record_date: new Date().toISOString().split("T")[0],
        symptoms: "",
        diagnosis: "",
        treatment: "",
        prescription: "",
        veterinarian_notes: "",
        next_checkup_date: "",
      });
      fetchData();
    }
  };

  return (
    <FarmerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Health Records</h1>
            <p className="text-muted-foreground">Track animal health history</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Health Record</DialogTitle>
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

                <div className="space-y-2">
                  <Label>Record Date *</Label>
                  <Input
                    type="date"
                    value={formData.record_date}
                    onChange={(e) => setFormData({ ...formData, record_date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Symptoms</Label>
                  <Textarea
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    placeholder="Describe observed symptoms"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Diagnosis</Label>
                  <Textarea
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    placeholder="Veterinary diagnosis"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Treatment</Label>
                  <Textarea
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    placeholder="Treatment provided"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Prescription</Label>
                  <Textarea
                    value={formData.prescription}
                    onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                    placeholder="Medications prescribed"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Veterinarian Notes</Label>
                  <Textarea
                    value={formData.veterinarian_notes}
                    onChange={(e) => setFormData({ ...formData, veterinarian_notes: e.target.value })}
                    placeholder="Additional notes"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Next Checkup Date</Label>
                  <Input
                    type="date"
                    value={formData.next_checkup_date}
                    onChange={(e) => setFormData({ ...formData, next_checkup_date: e.target.value })}
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">Add Record</Button>
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
        ) : records.length > 0 ? (
          <div className="space-y-4">
            {records.map((record) => (
              <Card key={record.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {record.animals?.name || "Unknown Animal"} - {record.animals?.species}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(record.record_date), "PPP")}
                      </p>
                    </div>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {record.symptoms && (
                    <div>
                      <p className="text-sm font-medium">Symptoms:</p>
                      <p className="text-sm text-muted-foreground">{record.symptoms}</p>
                    </div>
                  )}
                  {record.diagnosis && (
                    <div>
                      <p className="text-sm font-medium">Diagnosis:</p>
                      <p className="text-sm text-muted-foreground">{record.diagnosis}</p>
                    </div>
                  )}
                  {record.treatment && (
                    <div>
                      <p className="text-sm font-medium">Treatment:</p>
                      <p className="text-sm text-muted-foreground">{record.treatment}</p>
                    </div>
                  )}
                  {record.prescription && (
                    <div>
                      <p className="text-sm font-medium">Prescription:</p>
                      <p className="text-sm text-muted-foreground">{record.prescription}</p>
                    </div>
                  )}
                  {record.next_checkup_date && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium">Next Checkup:</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(record.next_checkup_date), "PPP")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No health records yet</p>
              <p className="text-sm text-muted-foreground mt-2">Add your first health record to track animal health</p>
            </CardContent>
          </Card>
        )}
      </div>
    </FarmerLayout>
  );
};

export default HealthRecords;
