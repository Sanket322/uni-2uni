import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Edit, Trash2, Eye, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const urlSchema = z.string().url().max(500).optional().or(z.literal(""));

const contentSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().trim().max(500, "Description must be less than 500 characters").optional(),
  content_body: z.string().max(50000, "Content must be less than 50,000 characters").optional(),
  category: z.string().min(1, "Category is required"),
  content_type: z.string().min(1, "Content type is required"),
  media_url: urlSchema,
  thumbnail_url: urlSchema,
  download_url: urlSchema,
  tags: z.string().max(500).optional(),
  state: z.string().max(50).optional(),
  district: z.string().max(50).optional(),
  language: z.string().max(10),
  is_active: z.boolean(),
  is_featured: z.boolean()
});

const categories = [
  { value: "feeding_guidelines", label: "Feeding Guidelines" },
  { value: "shelter_management", label: "Shelter Management" },
  { value: "breeding_tips", label: "Breeding Tips" },
  { value: "health_advisory", label: "Health Advisory" },
  { value: "training_resources", label: "Training Resources" },
  { value: "emergency_alerts", label: "Emergency Alerts" },
  { value: "disease_prevention", label: "Disease Prevention" },
  { value: "weather_advisory", label: "Weather Advisory" },
  { value: "best_practices", label: "Best Practices" },
];

const contentTypes = [
  { value: "article", label: "Article" },
  { value: "video", label: "Video" },
  { value: "infographic", label: "Infographic" },
  { value: "document", label: "Document" },
  { value: "audio", label: "Audio" },
  { value: "webinar", label: "Webinar" },
  { value: "tutorial", label: "Tutorial" },
];

const species = ["cattle", "goat", "sheep", "poultry", "buffalo", "pig", "other"];

const ContentManagement = () => {
  const [contents, setContents] = useState<any[]>([]);
  const [filteredContents, setFilteredContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content_body: "",
    category: "",
    content_type: "",
    species: [] as string[],
    state: "",
    district: "",
    language: "en",
    media_url: "",
    thumbnail_url: "",
    download_url: "",
    tags: "",
    is_active: true,
    is_featured: false,
  });

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    filterContents();
  }, [searchTerm, filterCategory, filterType, contents]);

  const fetchContents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cms_content")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch content",
        variant: "destructive",
      });
    } else {
      setContents(data || []);
    }
    setLoading(false);
  };

  const filterContents = () => {
    let filtered = contents;

    if (searchTerm) {
      filtered = filtered.filter(
        (content) =>
          content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          content.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((content) => content.category === filterCategory);
    }

    if (filterType !== "all") {
      filtered = filtered.filter((content) => content.content_type === filterType);
    }

    setFilteredContents(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const tagsArray = formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(t => t.length > 0).slice(0, 10) : [];

      const validatedData = contentSchema.parse({
        title: formData.title,
        description: formData.description || undefined,
        content_body: formData.content_body || undefined,
        category: formData.category,
        content_type: formData.content_type,
        media_url: formData.media_url || "",
        thumbnail_url: formData.thumbnail_url || "",
        download_url: formData.download_url || "",
        tags: formData.tags,
        state: formData.state,
        district: formData.district,
        language: formData.language,
        is_active: formData.is_active,
        is_featured: formData.is_featured
      });

      const contentData: any = {
        title: validatedData.title,
        description: validatedData.description,
        content_body: validatedData.content_body,
        category: validatedData.category,
        content_type: validatedData.content_type,
        species: formData.species,
        state: validatedData.state || null,
        district: validatedData.district || null,
        language: validatedData.language,
        media_url: validatedData.media_url || null,
        thumbnail_url: validatedData.thumbnail_url || null,
        download_url: validatedData.download_url || null,
        tags: tagsArray,
        is_active: validatedData.is_active,
        is_featured: validatedData.is_featured,
        published_date: new Date().toISOString(),
      };

      if (editingContent) {
        const { error } = await supabase
          .from("cms_content")
          .update(contentData)
          .eq("id", editingContent.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Content updated successfully",
        });
      } else {
        const { error } = await supabase.from("cms_content").insert(contentData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Content created successfully",
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchContents();
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
          description: "Failed to save content",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (content: any) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      description: content.description || "",
      content_body: content.content_body || "",
      category: content.category,
      content_type: content.content_type,
      species: content.species || [],
      state: content.state || "",
      district: content.district || "",
      language: content.language || "en",
      media_url: content.media_url || "",
      thumbnail_url: content.thumbnail_url || "",
      download_url: content.download_url || "",
      tags: content.tags?.join(", ") || "",
      is_active: content.is_active,
      is_featured: content.is_featured,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    const { error } = await supabase.from("cms_content").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
      fetchContents();
    }
  };

  const resetForm = () => {
    setEditingContent(null);
    setFormData({
      title: "",
      description: "",
      content_body: "",
      category: "",
      content_type: "",
      species: [],
      state: "",
      district: "",
      language: "en",
      media_url: "",
      thumbnail_url: "",
      download_url: "",
      tags: "",
      is_active: true,
      is_featured: false,
    });
    setDialogOpen(false);
  };

  const toggleSpecies = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      species: prev.species.includes(value)
        ? prev.species.filter((s) => s !== value)
        : [...prev.species, value],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Content Management System</h2>
          <p className="text-muted-foreground">
            Manage all educational and advisory content
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContent ? "Edit Content" : "Add New Content"}
              </DialogTitle>
              <DialogDescription>
                Create or update educational and advisory content for farmers
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="col-span-2">
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

                <div className="col-span-2">
                  <Label htmlFor="content_body">Content Body (Rich Text Editor)</Label>
                  <div className="border rounded-md min-h-[300px]">
                    <ReactQuill
                      theme="snow"
                      value={formData.content_body}
                      onChange={(value) =>
                        setFormData({ ...formData, content_body: value })
                      }
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, false] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["blockquote", "code-block"],
                          [{ color: [] }, { background: [] }],
                          ["link", "image", "video"],
                          [{ align: [] }],
                          ["clean"],
                        ],
                      }}
                      placeholder="Enter the main content with rich formatting..."
                      className="h-64"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="content_type">Content Type *</Label>
                  <Select
                    value={formData.content_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, content_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label>Applicable Species</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {species.map((sp) => (
                      <Badge
                        key={sp}
                        variant={
                          formData.species.includes(sp) ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => toggleSpecies(sp)}
                      >
                        {sp}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="media_url">Media URL</Label>
                  <Input
                    id="media_url"
                    type="url"
                    value={formData.media_url}
                    onChange={(e) =>
                      setFormData({ ...formData, media_url: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="download_url">Download URL</Label>
                  <Input
                    id="download_url"
                    type="url"
                    value={formData.download_url}
                    onChange={(e) =>
                      setFormData({ ...formData, download_url: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="e.g., nutrition, disease, monsoon"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_active: checked })
                    }
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_featured: checked })
                    }
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingContent ? "Update" : "Create"} Content
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {contentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-8 text-center">Loading...</CardContent>
            </Card>
          ) : filteredContents.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No content found
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredContents.map((content) => (
                <Card key={content.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{content.title}</CardTitle>
                          {content.is_featured && (
                            <Badge variant="secondary">Featured</Badge>
                          )}
                          {!content.is_active && (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {content.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline">
                            {categories.find((c) => c.value === content.category)?.label}
                          </Badge>
                          <Badge variant="outline">
                            {contentTypes.find((t) => t.value === content.content_type)?.label}
                          </Badge>
                          {content.species?.map((sp: string) => (
                            <Badge key={sp} variant="secondary">
                              {sp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(content)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(content.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {content.view_count} views
                      </div>
                      {content.state && (
                        <div className="flex items-center gap-1">
                          📍 {content.state}
                          {content.district && `, ${content.district}`}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {filteredContents
            .filter((c) => c.is_active)
            .map((content) => (
              <Card key={content.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                </CardHeader>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="featured" className="space-y-4">
          {filteredContents
            .filter((c) => c.is_featured)
            .map((content) => (
              <Card key={content.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                </CardHeader>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagement;
