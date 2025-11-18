import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
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
import { Plus, UtensilsCrossed, Pencil, Trash } from "lucide-react";

const Feeding = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    animal_id: "",
    feed_type: "",
    quantity: "",
    frequency: "",
    season: "",
    special_instructions: "",
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

    const { data: schedulesData } = await supabase
      .from("feeding_schedules")
      .select(`
        *,
        animals:animal_id (name, species, breed)
      `)
      .in("animal_id", animalIds)
      .order("created_at", { ascending: false });

    if (schedulesData) setSchedules(schedulesData);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.animal_id || !formData.feed_type) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("feeding_schedules")
        .update(formData)
        .eq("id", editingId);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Feeding schedule updated successfully",
        });
        resetForm();
        fetchData();
      }
    } else {
      const { error } = await supabase.from("feeding_schedules").insert([formData]);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Feeding schedule added successfully",
        });
        resetForm();
        fetchData();
      }
    }
  };

  const handleEdit = (schedule: any) => {
    setEditingId(schedule.id);
    setFormData({
      animal_id: schedule.animal_id,
      feed_type: schedule.feed_type,
      quantity: schedule.quantity || "",
      frequency: schedule.frequency || "",
      season: schedule.season || "",
      special_instructions: schedule.special_instructions || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feeding schedule?")) return;

    const { error } = await supabase
      .from("feeding_schedules")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Feeding schedule deleted successfully",
      });
      fetchData();
    }
  };

  const resetForm = () => {
    setFormData({
      animal_id: "",
      feed_type: "",
      quantity: "",
      frequency: "",
      season: "",
      special_instructions: "",
    });
    setEditingId(null);
    setDialogOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Feeding Schedules</h1>
            <p className="text-muted-foreground">Manage animal feeding routines</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit" : "Add"} Feeding Schedule</DialogTitle>
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
                  <Label>Feed Type *</Label>
                  <Input
                    value={formData.feed_type}
                    onChange={(e) => setFormData({ ...formData, feed_type: e.target.value })}
                    placeholder="e.g., Green fodder, Concentrates, Silage"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="e.g., 10 kg, 2 bundles"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once_daily">Once Daily</SelectItem>
                        <SelectItem value="twice_daily">Twice Daily</SelectItem>
                        <SelectItem value="thrice_daily">Thrice Daily</SelectItem>
                        <SelectItem value="as_needed">As Needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Season</Label>
                  <Select
                    value={formData.season}
                    onValueChange={(value) => setFormData({ ...formData, season: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summer">Summer</SelectItem>
                      <SelectItem value="monsoon">Monsoon</SelectItem>
                      <SelectItem value="winter">Winter</SelectItem>
                      <SelectItem value="all_year">All Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Special Instructions</Label>
                  <Textarea
                    value={formData.special_instructions}
                    onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
                    placeholder="Additional feeding instructions"
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    {editingId ? "Update" : "Add"} Schedule
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
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
        ) : schedules.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {schedules.map((schedule) => (
              <Card key={schedule.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <UtensilsCrossed className="h-5 w-5 text-primary" />
                        {schedule.animals?.name || "Unknown Animal"}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {schedule.animals?.species} {schedule.animals?.breed && `• ${schedule.animals?.breed}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(schedule)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(schedule.id)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Feed Type:</p>
                    <p className="text-sm text-muted-foreground">{schedule.feed_type}</p>
                  </div>

                  {schedule.quantity && (
                    <div>
                      <p className="text-sm font-medium">Quantity:</p>
                      <p className="text-sm text-muted-foreground">{schedule.quantity}</p>
                    </div>
                  )}

                  {schedule.frequency && (
                    <div>
                      <p className="text-sm font-medium">Frequency:</p>
                      <p className="text-sm text-muted-foreground capitalize">{schedule.frequency.replace("_", " ")}</p>
                    </div>
                  )}

                  {schedule.season && (
                    <div>
                      <p className="text-sm font-medium">Season:</p>
                      <p className="text-sm text-muted-foreground capitalize">{schedule.season.replace("_", " ")}</p>
                    </div>
                  )}

                  {schedule.special_instructions && (
                    <div>
                      <p className="text-sm font-medium">Instructions:</p>
                      <p className="text-sm text-muted-foreground">{schedule.special_instructions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <UtensilsCrossed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No feeding schedules yet</p>
              <p className="text-sm text-muted-foreground mt-2">Add your first feeding schedule</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Feeding;
