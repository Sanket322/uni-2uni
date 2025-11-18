import { useState, useEffect } from "react";
import FarmerLayout from "@/components/FarmerLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Search,
  Play,
  FileText,
  Download,
  Eye,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const categories = [
  { value: "all", label: "All Categories" },
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

const contentTypeIcons: any = {
  article: FileText,
  video: Play,
  infographic: FileText,
  document: Download,
  audio: Play,
  webinar: Play,
  tutorial: BookOpen,
};

const ContentLibrary = () => {
  const [contents, setContents] = useState<any[]>([]);
  const [filteredContents, setFilteredContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    filterContents();
  }, [searchTerm, filterCategory, contents]);

  const fetchContents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cms_content")
      .select("*")
      .eq("is_active", true)
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
          content.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          content.tags?.some((tag: string) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((content) => content.category === filterCategory);
    }

    setFilteredContents(filtered);
  };

  const handleViewContent = async (content: any) => {
    setSelectedContent(content);
    setDialogOpen(true);

    // Track view
    await supabase.from("content_views").insert({
      content_id: content.id,
      user_id: user?.id,
    });

    // Increment view count
    await supabase
      .from("cms_content")
      .update({ view_count: (content.view_count || 0) + 1 })
      .eq("id", content.id);
  };

  const getContentIcon = (type: string) => {
    const Icon = contentTypeIcons[type] || FileText;
    return <Icon className="h-5 w-5" />;
  };

  const featuredContents = filteredContents.filter((c) => c.is_featured);
  const regularContents = filteredContents.filter((c) => !c.is_featured);

  return (
    <FarmerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Resource Library</h1>
            <p className="text-muted-foreground">
              Educational content and resources for livestock management
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
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
          </CardContent>
        </Card>

        {/* Featured Content */}
        {featuredContents.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Star className="h-6 w-6 text-primary" />
              Featured Resources
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredContents.map((content) => (
                <Card
                  key={content.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleViewContent(content)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getContentIcon(content.content_type)}
                        {content.title}
                      </CardTitle>
                      <Badge variant="secondary">Featured</Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {content.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="outline">
                        {categories.find((c) => c.value === content.category)?.label}
                      </Badge>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {content.view_count || 0}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Content */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {loading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  Loading resources...
                </CardContent>
              </Card>
            ) : regularContents.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No resources found
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {regularContents.map((content) => (
                  <Card
                    key={content.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleViewContent(content)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getContentIcon(content.content_type)}
                        {content.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {content.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">
                            {categories.find((c) => c.value === content.category)?.label}
                          </Badge>
                          {content.species?.slice(0, 2).map((sp: string) => (
                            <Badge key={sp} variant="secondary" className="text-xs">
                              {sp}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          {content.view_count || 0} views
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="videos" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {regularContents
                .filter((c) => ["video", "webinar", "tutorial"].includes(c.content_type))
                .map((content) => (
                  <Card key={content.id} onClick={() => handleViewContent(content)}>
                    <CardHeader>
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="articles" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {regularContents
                .filter((c) => c.content_type === "article")
                .map((content) => (
                  <Card key={content.id} onClick={() => handleViewContent(content)}>
                    <CardHeader>
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {regularContents
                .filter((c) => ["document", "infographic"].includes(c.content_type))
                .map((content) => (
                  <Card key={content.id} onClick={() => handleViewContent(content)}>
                    <CardHeader>
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Content Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedContent && getContentIcon(selectedContent.content_type)}
                {selectedContent?.title}
              </DialogTitle>
              <DialogDescription>
                {selectedContent && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">
                      {categories.find((c) => c.value === selectedContent.category)?.label}
                    </Badge>
                    {selectedContent.species?.map((sp: string) => (
                      <Badge key={sp} variant="secondary">
                        {sp}
                      </Badge>
                    ))}
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            {selectedContent && (
              <div className="space-y-4">
                <p className="text-muted-foreground">{selectedContent.description}</p>
                {selectedContent.content_body && (
                  <div className="prose prose-sm max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedContent.content_body.replace(/\n/g, "<br />"),
                      }}
                    />
                  </div>
                )}
                {selectedContent.media_url && (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    {selectedContent.content_type === "video" ? (
                      <video controls className="w-full h-full">
                        <source src={selectedContent.media_url} />
                      </video>
                    ) : (
                      <img
                        src={selectedContent.media_url}
                        alt={selectedContent.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                )}
                {selectedContent.download_url && (
                  <Button asChild className="w-full">
                    <a
                      href={selectedContent.download_url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Resource
                    </a>
                  </Button>
                )}
                {selectedContent.tags && selectedContent.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <span className="text-sm text-muted-foreground">Tags:</span>
                    {selectedContent.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </FarmerLayout>
  );
};

export default ContentLibrary;
