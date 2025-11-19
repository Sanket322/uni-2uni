import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Package, Edit, Trash2, AlertTriangle } from "lucide-react";
import { z } from "zod";

const inventorySchema = z.object({
  feed_name: z.string().trim().min(1, "Feed name is required").max(100),
  feed_type: z.string().min(1, "Feed type is required"),
  quantity: z.number().min(0, "Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  cost_per_unit: z.number().min(0).optional().nullable(),
  supplier_name: z.string().trim().max(100).optional().nullable(),
  purchase_date: z.string().optional().nullable(),
  expiry_date: z.string().optional().nullable(),
  storage_location: z.string().trim().max(100).optional().nullable(),
  notes: z.string().trim().max(500).optional().nullable(),
});

type InventoryFormData = z.infer<typeof inventorySchema>;

const FeedInventory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<InventoryFormData>({
    feed_name: "",
    feed_type: "",
    quantity: 0,
    unit: "",
    cost_per_unit: null,
    supplier_name: null,
    purchase_date: null,
    expiry_date: null,
    storage_location: null,
    notes: null,
  });

  useEffect(() => {
    if (user) {
      fetchInventory();
    }
  }, [user]);

  const fetchInventory = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("feed_inventory")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch inventory",
        variant: "destructive",
      });
    } else {
      setInventory(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = inventorySchema.parse(formData);

      if (editingId) {
        const { error } = await supabase
          .from("feed_inventory")
          .update(validated)
          .eq("id", editingId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Inventory item updated successfully",
        });
      } else {
        const dataToInsert = {
          user_id: user!.id,
          feed_name: validated.feed_name,
          feed_type: validated.feed_type,
          quantity: validated.quantity,
          unit: validated.unit,
          cost_per_unit: validated.cost_per_unit ?? null,
          supplier_name: validated.supplier_name ?? null,
          purchase_date: validated.purchase_date ?? null,
          expiry_date: validated.expiry_date ?? null,
          storage_location: validated.storage_location ?? null,
          notes: validated.notes ?? null,
        };

        const { error } = await supabase
          .from("feed_inventory")
          .insert([dataToInsert]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Inventory item added successfully",
        });
      }

      resetForm();
      fetchInventory();
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
          description: "Failed to save inventory item",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      feed_name: item.feed_name,
      feed_type: item.feed_type,
      quantity: item.quantity,
      unit: item.unit,
      cost_per_unit: item.cost_per_unit,
      supplier_name: item.supplier_name,
      purchase_date: item.purchase_date,
      expiry_date: item.expiry_date,
      storage_location: item.storage_location,
      notes: item.notes,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inventory item?")) return;

    const { error } = await supabase
      .from("feed_inventory")
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
        description: "Inventory item deleted",
      });
      fetchInventory();
    }
  };

  const resetForm = () => {
    setFormData({
      feed_name: "",
      feed_type: "",
      quantity: 0,
      unit: "",
      cost_per_unit: null,
      supplier_name: null,
      purchase_date: null,
      expiry_date: null,
      storage_location: null,
      notes: null,
    });
    setEditingId(null);
    setDialogOpen(false);
  };

  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isLowStock = (quantity: number) => {
    return quantity < 10; // Configurable threshold
  };

  const totalValue = inventory.reduce((sum, item) => {
    return sum + (item.quantity * (item.cost_per_unit || 0));
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Feed Inventory</h2>
          <p className="text-muted-foreground">Manage your feed stock and supplies</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Stock
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Add"} Inventory Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Feed Name *</Label>
                  <Input
                    value={formData.feed_name}
                    onChange={(e) => setFormData({ ...formData, feed_name: e.target.value })}
                    placeholder="e.g., Berseem, Wheat Bran"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Feed Type *</Label>
                  <Select
                    value={formData.feed_type}
                    onValueChange={(value) => setFormData({ ...formData, feed_type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="green_fodder">Green Fodder</SelectItem>
                      <SelectItem value="dry_fodder">Dry Fodder</SelectItem>
                      <SelectItem value="concentrate">Concentrate</SelectItem>
                      <SelectItem value="supplement">Supplement</SelectItem>
                      <SelectItem value="mineral_mix">Mineral Mix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quantity *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Unit *</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) => setFormData({ ...formData, unit: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="bundle">Bundles</SelectItem>
                      <SelectItem value="bag">Bags</SelectItem>
                      <SelectItem value="liter">Liters</SelectItem>
                      <SelectItem value="quintal">Quintals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Cost per Unit (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.cost_per_unit || ""}
                    onChange={(e) => setFormData({ ...formData, cost_per_unit: parseFloat(e.target.value) || null })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Supplier Name</Label>
                  <Input
                    value={formData.supplier_name || ""}
                    onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value || null })}
                    placeholder="Supplier name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Purchase Date</Label>
                  <Input
                    type="date"
                    value={formData.purchase_date || ""}
                    onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value || null })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input
                    type="date"
                    value={formData.expiry_date || ""}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value || null })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Storage Location</Label>
                  <Input
                    value={formData.storage_location || ""}
                    onChange={(e) => setFormData({ ...formData, storage_location: e.target.value || null })}
                    placeholder="e.g., Warehouse A, Shed 2"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Notes</Label>
                  <Input
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value || null })}
                    placeholder="Additional notes"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? "Update" : "Add"} Item</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-sm text-muted-foreground">Total Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₹{totalValue.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {inventory.filter((item) => isLowStock(item.quantity)).length}
            </div>
            <p className="text-sm text-muted-foreground">Low Stock Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {inventory.filter((item) => isExpiringSoon(item.expiry_date) || isExpired(item.expiry_date)).length}
            </div>
            <p className="text-sm text-muted-foreground">Expiring Soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Stock</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Loading inventory...</p>
          ) : inventory.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-muted-foreground">No inventory items yet</p>
              <p className="text-sm text-muted-foreground mt-2">Add your first stock item</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inventory.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h4 className="font-semibold">{item.feed_name}</h4>
                        <Badge variant="outline">{item.feed_type.replace("_", " ")}</Badge>
                        {isLowStock(item.quantity) && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Low Stock
                          </Badge>
                        )}
                        {isExpired(item.expiry_date) && (
                          <Badge variant="destructive">Expired</Badge>
                        )}
                        {isExpiringSoon(item.expiry_date) && !isExpired(item.expiry_date) && (
                          <Badge variant="default">Expiring Soon</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Quantity:</span> {item.quantity} {item.unit}
                        </div>
                        {item.cost_per_unit && (
                          <div>
                            <span className="font-medium">Value:</span> ₹{(item.quantity * item.cost_per_unit).toFixed(2)}
                          </div>
                        )}
                        {item.storage_location && (
                          <div>
                            <span className="font-medium">Location:</span> {item.storage_location}
                          </div>
                        )}
                        {item.expiry_date && (
                          <div>
                            <span className="font-medium">Expiry:</span> {new Date(item.expiry_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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

export default FeedInventory;
