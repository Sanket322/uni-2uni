import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Plus, Upload, X, Flag, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Layout from "@/components/Layout";

interface Post {
  id: string;
  user_id: string;
  caption: string;
  image_url: string;
  created_at: string;
  profiles?: {
    full_name: string;
  } | null;
  post_likes?: { id: string; user_id: string }[];
  post_comments?: { 
    id: string; 
    user_id: string; 
    comment_text: string; 
    created_at: string; 
    profiles?: { 
      full_name: string;
    } | null;
  }[];
}

const SocialFeed = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportPostId, setReportPostId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          post_likes(id, user_id),
          post_comments(id, user_id, comment_text, created_at)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch user profiles separately
      const userIds = [...new Set(data?.map(p => p.user_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

      // Fetch comment user profiles
      const commentUserIds = [...new Set(
        data?.flatMap(p => p.post_comments?.map(c => c.user_id) || []) || []
      )];
      const { data: commentProfiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", commentUserIds);

      // Map profiles to posts
      const postsWithProfiles = data?.map(post => ({
        ...post,
        profiles: profiles?.find(p => p.id === post.user_id) || null,
        post_comments: post.post_comments?.map(comment => ({
          ...comment,
          profiles: commentProfiles?.find(p => p.id === comment.user_id) || null,
        })),
      }));

      setPosts(postsWithProfiles || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = async () => {
    if (!user || !selectedFile) return;

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("posts")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("posts")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          caption,
          image_url: publicUrl,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Post created successfully",
      });

      setCreateDialogOpen(false);
      setCaption("");
      setSelectedFile(null);
      setPreviewUrl("");
      fetchPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    const post = posts.find(p => p.id === postId);
    const alreadyLiked = post?.post_likes?.some(like => like.user_id === user.id);

    try {
      if (alreadyLiked) {
        await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("post_likes")
          .insert({ post_id: postId, user_id: user.id });
      }
      fetchPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const handleComment = async (postId: string) => {
    if (!user || !commentText[postId]?.trim()) return;

    try {
      await supabase
        .from("post_comments")
        .insert({
          post_id: postId,
          user_id: user.id,
          comment_text: commentText[postId].trim(),
        });

      setCommentText({ ...commentText, [postId]: "" });
      fetchPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (postId: string, imageUrl: string) => {
    if (!user) return;

    try {
      const fileName = imageUrl.split("/posts/")[1];
      if (fileName) {
        await supabase.storage.from("posts").remove([fileName]);
      }

      await supabase.from("posts").delete().eq("id", postId);

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });

      fetchPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleReportPost = async () => {
    if (!reportPostId || !reportReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for reporting",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("post_reports").insert({
        post_id: reportPostId,
        reporter_id: user?.id,
        reason: reportReason,
      });

      if (error) throw error;

      toast({
        title: "Report Submitted",
        description: "Thank you for helping keep our community safe",
      });

      setReportDialogOpen(false);
      setReportPostId(null);
      setReportReason("");
    } catch (error) {
      console.error("Error reporting post:", error);
      toast({
        title: "Error",
        description: "Failed to submit report",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Community Feed</h1>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {previewUrl ? (
                  <div className="relative">
                    <img src={previewUrl} alt="Preview" className="w-full rounded-lg" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl("");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="post-image"
                    />
                    <label htmlFor="post-image" className="cursor-pointer">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload image (max 5MB)
                      </p>
                    </label>
                  </div>
                )}
                <Textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleCreatePost}
                  disabled={!selectedFile || uploading}
                  className="w-full"
                >
                  {uploading ? "Uploading..." : "Post"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {posts.map((post) => {
            const isLiked = post.post_likes?.some(like => like.user_id === user?.id);
            const likesCount = post.post_likes?.length || 0;
            const commentsCount = post.post_comments?.length || 0;

            return (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {post.profiles?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{post.profiles?.full_name || "User"}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(post.created_at), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    {post.user_id === user?.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(post.id, post.image_url)}
                      >
                        Delete
                      </Button>
                    )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReportPostId(post.id);
                      setReportDialogOpen(true);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                  {post.user_id === user?.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePost(post.id, post.image_url)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
                <CardContent className="p-0">
                  <img
                    src={post.image_url}
                    alt="Post"
                    className="w-full aspect-square object-cover"
                  />
                  {post.caption && (
                    <div className="p-4">
                      <p className="text-sm">
                        <span className="font-semibold mr-2">{post.profiles?.full_name}</span>
                        {post.caption}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex-col items-stretch gap-3">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={isLiked ? "text-red-500" : ""}
                    >
                      <Heart className={`h-5 w-5 mr-1 ${isLiked ? "fill-current" : ""}`} />
                      {likesCount}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowComments({ ...showComments, [post.id]: !showComments[post.id] })}
                    >
                      <MessageCircle className="h-5 w-5 mr-1" />
                      {commentsCount}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>

                  {showComments[post.id] && (
                    <div className="space-y-3 pt-3 border-t">
                      {post.post_comments?.map((comment) => (
                        <div key={comment.id} className="text-sm">
                          <span className="font-semibold mr-2">{comment.profiles?.full_name}</span>
                          {comment.comment_text}
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Add a comment..."
                          value={commentText[post.id] || ""}
                          onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                          rows={1}
                          className="resize-none"
                        />
                        <Button onClick={() => handleComment(post.id)} size="sm">
                          Post
                        </Button>
                      </div>
                    </div>
                  )}
                </CardFooter>
              </Card>
            );
          })}

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
            </div>
          )}
        </div>

        <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report Post</DialogTitle>
              <DialogDescription>
                Help us understand why this post should be reviewed
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Please describe why you're reporting this post..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows={4}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setReportDialogOpen(false);
                  setReportReason("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleReportPost}>Submit Report</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default SocialFeed;
