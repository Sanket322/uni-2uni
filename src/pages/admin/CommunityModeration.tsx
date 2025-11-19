import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, Trash2, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Post {
  id: string;
  user_id: string;
  caption: string | null;
  image_url: string;
  created_at: string;
  report_count: number;
  profiles: {
    full_name: string;
  };
}

interface Report {
  id: string;
  post_id: string;
  reporter_id: string;
  reason: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  posts: {
    caption: string | null;
    image_url: string;
    user_id: string;
  };
  reporter_profile: {
    full_name: string;
  };
}

const CommunityModeration = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all posts with report counts - using direct user_id lookup
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      // Fetch profiles separately
      if (postsData && postsData.length > 0) {
        const userIds = [...new Set(postsData.map(p => p.user_id))];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds);

        const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
        
        const postsWithProfiles = postsData.map(post => ({
          ...post,
          profiles: profilesMap.get(post.user_id) || { full_name: "Unknown User" }
        }));
        
        setPosts(postsWithProfiles);
      } else {
        setPosts([]);
      }

      // Fetch all reports
      const { data: reportsData, error: reportsError } = await supabase
        .from("post_reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (reportsError) throw reportsError;

      // Fetch related data for reports
      if (reportsData && reportsData.length > 0) {
        const postIds = [...new Set(reportsData.map(r => r.post_id))];
        const reporterIds = [...new Set(reportsData.map(r => r.reporter_id))];

        const { data: reportPostsData } = await supabase
          .from("posts")
          .select("id, caption, image_url, user_id")
          .in("id", postIds);

        const { data: reporterProfilesData } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", reporterIds);

        const postsMap = new Map(reportPostsData?.map(p => [p.id, p]) || []);
        const profilesMap = new Map(reporterProfilesData?.map(p => [p.id, p]) || []);

        const reportsWithData = reportsData.map(report => ({
          ...report,
          posts: postsMap.get(report.post_id) || { caption: null, image_url: "", user_id: "" },
          reporter_profile: profilesMap.get(report.reporter_id) || { full_name: "Unknown User" }
        }));

        setReports(reportsWithData);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load community data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!selectedPostId) return;

    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", selectedPostId);

      if (error) throw error;

      toast({
        title: "Post Deleted",
        description: "The post has been removed successfully",
      });

      fetchData();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedPostId(null);
    }
  };

  const handleReportAction = async (reportId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("post_reports")
        .update({ 
          status,
          admin_notes: adminNotes || null
        })
        .eq("id", reportId);

      if (error) throw error;

      toast({
        title: "Report Updated",
        description: `Report has been marked as ${status}`,
      });

      setAdminNotes("");
      fetchData();
    } catch (error) {
      console.error("Error updating report:", error);
      toast({
        title: "Error",
        description: "Failed to update report",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "destructive",
      reviewed: "secondary",
      resolved: "default",
      dismissed: "outline",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading community data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Community Moderation</h1>
        <p className="text-muted-foreground">
          Monitor and manage community posts and reports
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{posts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reported Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {posts.filter(p => p.report_count > 0).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {reports.filter(r => r.status === "pending").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="posts">All Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          {reports.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No reports found</p>
              </CardContent>
            </Card>
          ) : (
            reports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        Reported by: {report.reporter_profile?.full_name || "Unknown User"}
                      </CardTitle>
                      <CardDescription>
                        {new Date(report.created_at).toLocaleString()}
                      </CardDescription>
                    </div>
                    {getStatusBadge(report.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <img
                      src={report.posts?.image_url}
                      alt="Reported post"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <p className="text-sm">
                        <strong>Post Caption:</strong>{" "}
                        {report.posts?.caption || "No caption"}
                      </p>
                      <p className="text-sm">
                        <strong>Report Reason:</strong> {report.reason}
                      </p>
                      {report.admin_notes && (
                        <p className="text-sm">
                          <strong>Admin Notes:</strong> {report.admin_notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {report.status === "pending" && (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Add admin notes..."
                        value={selectedReportId === report.id ? adminNotes : ""}
                        onChange={(e) => {
                          setSelectedReportId(report.id);
                          setAdminNotes(e.target.value);
                        }}
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleReportAction(report.id, "reviewed")}
                          size="sm"
                          variant="outline"
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Mark Reviewed
                        </Button>
                        <Button
                          onClick={() => handleReportAction(report.id, "resolved")}
                          size="sm"
                          variant="default"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Resolve
                        </Button>
                        <Button
                          onClick={() => handleReportAction(report.id, "dismissed")}
                          size="sm"
                          variant="secondary"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Dismiss
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedPostId(report.post_id);
                            setDeleteDialogOpen(true);
                          }}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Post
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No posts found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {post.profiles?.full_name || "Unknown User"}
                        </CardTitle>
                        <CardDescription>
                          {new Date(post.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {post.report_count > 0 && (
                        <Badge variant="destructive">{post.report_count} reports</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <img
                      src={post.image_url}
                      alt="Post"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {post.caption && (
                      <p className="text-sm line-clamp-2">{post.caption}</p>
                    )}
                    <Button
                      onClick={() => {
                        setSelectedPostId(post.id);
                        setDeleteDialogOpen(true);
                      }}
                      variant="destructive"
                      size="sm"
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Post
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post
              and all associated comments and likes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CommunityModeration;
