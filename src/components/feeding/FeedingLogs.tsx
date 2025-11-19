import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, ClipboardList, Clock, TrendingUp, CheckCircle, XCircle, MinusCircle } from "lucide-react";
import { z } from "zod";

const feedingLogSchema = z.object({
  animal_id: z.string().uuid("Please select an animal"),
  feed_type: z.string().trim().min(1, "Feed type is required").max(100),
  quantity_fed: z.string().trim().min(1, "Quantity is required").max(50),
  animal_response: z.string().optional().nullable(),
  notes: z.string().trim().max(500).optional().nullable(),
});

type FeedingLogFormData = z.infer<typeof feedingLogSchema>;

const FeedingLogs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FeedingLogFormData>({
    animal_id: "",
    feed_type: "",
    quantity_fed: "",
    animal_response: null,
    notes: null,
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    // Fetch animals
    const { data: animalsData } = await supabase
      .from("animals")
      .select("*")
      .eq("owner_id", user.id);

    if (animalsData) setAnimals(animalsData);

    const animalIds = animalsData?.map((a) => a.id) || [];
    if (animalIds.length === 0) {
      setLoading(false);
      return;
    }

    // Fetch feeding logs
    const { data: logsData, error } = await supabase
      .from("feeding_logs")
      .select(`
        *,
        animals:animal_id (name, species, breed)
      `)
      .in("animal_id", animalIds)
      .order("feeding_time", { ascending: false })
      .limit(50);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch feeding logs",
        variant: "destructive",
      });
    } else {
      setLogs(logsData || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = feedingLogSchema.parse(formData);

      const dataToInsert = {
        animal_id: validated.animal_id,
        feed_type: validated.feed_type,
        quantity_fed: validated.quantity_fed,
        fed_by: user?.id,
        animal_response: validated.animal_response ?? null,
        notes: validated.notes ?? null,
      };

      const { error } = await supabase
        .from("feeding_logs")
        .insert([dataToInsert]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Feeding log recorded successfully",
      });

      resetForm();
      fetchData();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to record feeding log",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      animal_id: "",
      feed_type: "",
      quantity_fed: "",
      animal_response: null,
      notes: null,
    });
    setDialogOpen(false);
  };

  const getResponseIcon = (response: string | null) => {
    switch (response) {
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "normal":
        return <MinusCircle className="h-4 w-4 text-blue-500" />;
      case "poor":
        return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      case "refused":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getResponseBadgeVariant = (response: string | null) => {
    switch (response) {
      case "good":
        return "default";
      case "poor":
      case "refused":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Feeding Logs</h2>
          <p className="text-muted-foreground">Track daily feeding activities and animal responses</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Log Feeding
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Record Feeding Activity</DialogTitle>
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
                  placeholder="e.g., Green fodder, Concentrate mix"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Quantity Fed *</Label>
                <Input
                  value={formData.quantity_fed}
                  onChange={(e) => setFormData({ ...formData, quantity_fed: e.target.value })}
                  placeholder="e.g., 5 kg, 2 bundles"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Animal Response</Label>
                <Select
                  value={formData.animal_response || ""}
                  onValueChange={(value) => setFormData({ ...formData, animal_response: value || null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select response" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Good - Ate well</SelectItem>
                    <SelectItem value="normal">Normal - Average appetite</SelectItem>
                    <SelectItem value="poor">Poor - Ate little</SelectItem>
                    <SelectItem value="refused">Refused - Didn't eat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value || null })}
                  placeholder="Any additional observations"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">Record Log</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{logs.length}</div>
            <p className="text-sm text-muted-foreground">Total Logs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {logs.filter((log) => {
                const logDate = new Date(log.feeding_time);
                const today = new Date();
                return logDate.toDateString() === today.toDateString();
              }).length}
            </div>
            <p className="text-sm text-muted-foreground">Today's Logs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {logs.filter((log) => log.animal_response === "good").length}
            </div>
            <p className="text-sm text-muted-foreground">Good Responses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {logs.filter((log) => log.animal_response === "poor" || log.animal_response === "refused").length}
            </div>
            <p className="text-sm text-muted-foreground">Poor/Refused</p>
          </CardContent>
        </Card>
      </div>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Feeding Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Loading logs...</p>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-muted-foreground">No feeding logs yet</p>
              <p className="text-sm text-muted-foreground mt-2">Start recording feeding activities</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h4 className="font-semibold">
                          {log.animals?.name || "Unknown"} ({log.animals?.species})
                        </h4>
                        {log.animal_response && (
                          <Badge variant={getResponseBadgeVariant(log.animal_response)} className="gap-1">
                            {getResponseIcon(log.animal_response)}
                            {log.animal_response}
                          </Badge>
                        )}
                      </div>

                      <div className="grid md:grid-cols-3 gap-2 text-sm text-muted-foreground mb-2">
                        <div>
                          <span className="font-medium">Feed:</span> {log.feed_type}
                        </div>
                        <div>
                          <span className="font-medium">Quantity:</span> {log.quantity_fed}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(log.feeding_time)}
                        </div>
                      </div>

                      {log.notes && (
                        <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                          {log.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedingLogs;
