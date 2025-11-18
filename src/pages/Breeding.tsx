import { useEffect, useState } from "react";
import FarmerLayout from "@/components/FarmerLayout";
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
import { Plus, Baby, Calendar } from "lucide-react";
import { format, differenceInDays } from "date-fns";

const Breeding = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [records, setRecords] = useState<any[]>([]);
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    animal_id: "",
    breeding_date: new Date().toISOString().split("T")[0],
    breeding_method: "",
    partner_details: "",
    expected_delivery_date: "",
    actual_delivery_date: "",
    offspring_count: "",
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

    const { data: recordsData } = await supabase
      .from("breeding_records")
      .select(`
        *,
        animals:animal_id (name, species, breed)
      `)
      .in("animal_id", animalIds)
      .order("breeding_date", { ascending: false });

    if (recordsData) setRecords(recordsData);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.animal_id || !formData.breeding_date) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    const submitData = {
      ...formData,
      offspring_count: formData.offspring_count ? parseInt(formData.offspring_count) : null,
    };

    const { error } = await supabase.from("breeding_records").insert([submitData]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Breeding record added successfully",
      });
      setDialogOpen(false);
      setFormData({
        animal_id: "",
        breeding_date: new Date().toISOString().split("T")[0],
        breeding_method: "",
        partner_details: "",
        expected_delivery_date: "",
        actual_delivery_date: "",
        offspring_count: "",
        notes: "",
      });
      fetchData();
    }
  };

  const getPregnancyStatus = (record: any) => {
    if (record.actual_delivery_date) {
      return { label: "Delivered", variant: "default" as const };
    }
    if (record.expected_delivery_date) {
      const today = new Date();
      const expected = new Date(record.expected_delivery_date);
      const daysLeft = differenceInDays(expected, today);
      
      if (daysLeft < 0) {
        return { label: "Overdue", variant: "destructive" as const };
      } else if (daysLeft <= 7) {
        return { label: "Due Soon", variant: "secondary" as const };
      } else {
        return { label: `${daysLeft} days left`, variant: "default" as const };
      }
    }
    return { label: "Pregnant", variant: "default" as const };
  };

  return (
    <FarmerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Breeding Records</h1>
            <p className="text-muted-foreground">Track breeding and reproduction</p>
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
                <DialogTitle>Add Breeding Record</DialogTitle>
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
                    <Label>Breeding Date *</Label>
                    <Input
                      type="date"
                      value={formData.breeding_date}
                      onChange={(e) => setFormData({ ...formData, breeding_date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Breeding Method</Label>
                    <Select
                      value={formData.breeding_method}
                      onValueChange={(value) => setFormData({ ...formData, breeding_method: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="natural">Natural</SelectItem>
                        <SelectItem value="ai">Artificial Insemination</SelectItem>
                        <SelectItem value="ivf">In Vitro Fertilization</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Partner Details</Label>
                  <Input
                    value={formData.partner_details}
                    onChange={(e) => setFormData({ ...formData, partner_details: e.target.value })}
                    placeholder="Bull/Sire details or AI information"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Expected Delivery Date</Label>
                    <Input
                      type="date"
                      value={formData.expected_delivery_date}
                      onChange={(e) => setFormData({ ...formData, expected_delivery_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Actual Delivery Date</Label>
                    <Input
                      type="date"
                      value={formData.actual_delivery_date}
                      onChange={(e) => setFormData({ ...formData, actual_delivery_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Offspring Count</Label>
                  <Input
                    type="number"
                    value={formData.offspring_count}
                    onChange={(e) => setFormData({ ...formData, offspring_count: e.target.value })}
                    placeholder="Number of offspring"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes about breeding"
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
            {records.map((record) => {
              const status = getPregnancyStatus(record);
              return (
                <Card key={record.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Baby className="h-5 w-5 text-primary" />
                          {record.animals?.name || "Unknown Animal"} - {record.animals?.species}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Breeding Date: {format(new Date(record.breeding_date), "PPP")}
                        </p>
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {record.breeding_method && (
                      <div>
                        <p className="text-sm font-medium">Method:</p>
                        <p className="text-sm text-muted-foreground capitalize">{record.breeding_method}</p>
                      </div>
                    )}

                    {record.partner_details && (
                      <div>
                        <p className="text-sm font-medium">Partner Details:</p>
                        <p className="text-sm text-muted-foreground">{record.partner_details}</p>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      {record.expected_delivery_date && (
                        <div>
                          <p className="text-sm font-medium">Expected Delivery</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(record.expected_delivery_date), "PPP")}
                          </p>
                        </div>
                      )}

                      {record.actual_delivery_date && (
                        <div>
                          <p className="text-sm font-medium">Actual Delivery</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(record.actual_delivery_date), "PPP")}
                          </p>
                        </div>
                      )}
                    </div>

                    {record.offspring_count !== null && (
                      <div>
                        <p className="text-sm font-medium">Offspring Count:</p>
                        <p className="text-sm text-muted-foreground">{record.offspring_count}</p>
                      </div>
                    )}

                    {record.notes && (
                      <div>
                        <p className="text-sm font-medium">Notes:</p>
                        <p className="text-sm text-muted-foreground">{record.notes}</p>
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
              <Baby className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No breeding records yet</p>
              <p className="text-sm text-muted-foreground mt-2">Add your first breeding record to track reproduction</p>
            </CardContent>
          </Card>
        )}
      </div>
    </FarmerLayout>
  );
};

export default Breeding;
