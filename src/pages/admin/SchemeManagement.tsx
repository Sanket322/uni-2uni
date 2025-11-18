import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type GovernmentScheme = Tables<"government_schemes">;

const SchemeManagement = () => {
  const { toast } = useToast();
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<GovernmentScheme | null>(null);
  const [formData, setFormData] = useState({
    scheme_name: "",
    description: "",
    state: "",
    district: "",
    eligibility_criteria: "",
    benefits: "",
    application_process: "",
    documents_required: "",
    official_website: "",
    contact_details: "",
    is_active: true,
  });

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("government_schemes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch schemes",
        variant: "destructive",
      });
    } else {
      setSchemes(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const schemeData = {
      ...formData,
      documents_required: formData.documents_required
        ? formData.documents_required.split(",").map((d) => d.trim())
        : [],
    };

    if (editingScheme) {
      const { error } = await supabase
        .from("government_schemes")
        .update(schemeData)
        .eq("id", editingScheme.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update scheme",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Scheme updated successfully",
        });
      }
    } else {
      const { error } = await supabase.from("government_schemes").insert([schemeData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create scheme",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Scheme created successfully",
        });
      }
    }

    setLoading(false);
    setOpen(false);
    setEditingScheme(null);
    setFormData({
      scheme_name: "",
      description: "",
      state: "",
      district: "",
      eligibility_criteria: "",
      benefits: "",
      application_process: "",
      documents_required: "",
      official_website: "",
      contact_details: "",
      is_active: true,
    });
    fetchSchemes();
  };

  const handleEdit = (scheme: GovernmentScheme) => {
    setEditingScheme(scheme);
    setFormData({
      scheme_name: scheme.scheme_name,
      description: scheme.description || "",
      state: scheme.state || "",
      district: scheme.district || "",
      eligibility_criteria: scheme.eligibility_criteria || "",
      benefits: scheme.benefits || "",
      application_process: scheme.application_process || "",
      documents_required: scheme.documents_required?.join(", ") || "",
      official_website: scheme.official_website || "",
      contact_details: scheme.contact_details || "",
      is_active: scheme.is_active ?? true,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scheme?")) return;

    const { error } = await supabase.from("government_schemes").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete scheme",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Scheme deleted successfully",
      });
      fetchSchemes();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Scheme Management</h2>
          <p className="text-muted-foreground">Manage government schemes and subsidies</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Scheme
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingScheme ? "Edit Scheme" : "Add New Scheme"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="scheme_name">Scheme Name *</Label>
                  <Input
                    id="scheme_name"
                    value={formData.scheme_name}
                    onChange={(e) =>
                      setFormData({ ...formData, scheme_name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="eligibility_criteria">Eligibility Criteria</Label>
                  <Textarea
                    id="eligibility_criteria"
                    value={formData.eligibility_criteria}
                    onChange={(e) =>
                      setFormData({ ...formData, eligibility_criteria: e.target.value })
                    }
                    rows={2}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="benefits">Benefits</Label>
                  <Textarea
                    id="benefits"
                    value={formData.benefits}
                    onChange={(e) =>
                      setFormData({ ...formData, benefits: e.target.value })
                    }
                    rows={2}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="application_process">Application Process</Label>
                  <Textarea
                    id="application_process"
                    value={formData.application_process}
                    onChange={(e) =>
                      setFormData({ ...formData, application_process: e.target.value })
                    }
                    rows={2}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="documents_required">
                    Required Documents (comma-separated)
                  </Label>
                  <Textarea
                    id="documents_required"
                    value={formData.documents_required}
                    onChange={(e) =>
                      setFormData({ ...formData, documents_required: e.target.value })
                    }
                    placeholder="Aadhaar Card, Bank Statement, etc."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="official_website">Official Website</Label>
                  <Input
                    id="official_website"
                    type="url"
                    value={formData.official_website}
                    onChange={(e) =>
                      setFormData({ ...formData, official_website: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_details">Contact Details</Label>
                  <Input
                    id="contact_details"
                    value={formData.contact_details}
                    onChange={(e) =>
                      setFormData({ ...formData, contact_details: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading
                  ? "Saving..."
                  : editingScheme
                  ? "Update Scheme"
                  : "Create Scheme"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Schemes ({schemes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scheme Name</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Loading schemes...
                    </TableCell>
                  </TableRow>
                ) : schemes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No schemes found
                    </TableCell>
                  </TableRow>
                ) : (
                  schemes.map((scheme) => (
                    <TableRow key={scheme.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{scheme.scheme_name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1 md:hidden">
                            {scheme.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {scheme.state && scheme.district
                          ? `${scheme.district}, ${scheme.state}`
                          : scheme.state || "All India"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant={scheme.is_active ? "secondary" : "outline"}>
                          {scheme.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {scheme.official_website && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(scheme.official_website || "", "_blank")
                              }
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(scheme)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(scheme.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchemeManagement;
