import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "react-router-dom";
import { Heart, ArrowLeft, Calendar, Eye, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import { PublicHeader } from "@/components/PublicHeader";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { StickyCTABanner } from "@/components/StickyCTABanner";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  content_body: string;
  thumbnail_url: string;
  published_date: string;
  category: string;
  tags: string[];
  view_count: number;
}

const BlogPost = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      const { data, error } = await supabase
        .from("cms_content")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setPost(data);

      // Increment view count
      await supabase
        .from("cms_content")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Blog post link copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Blog post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <BreadcrumbNav />
      <StickyCTABanner />

      {/* Main Content */}
      <main className="flex-1">
        <article className="container px-4 py-12 max-w-4xl mx-auto">
          {/* Hero Image */}
          {post.thumbnail_url && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-8">
              <img
                src={post.thumbnail_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge>{post.category.replace("_", " ")}</Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{post.published_date ? format(new Date(post.published_date), "MMMM dd, yyyy") : "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{post.view_count || 0} views</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleShare} className="ml-auto">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

          {/* Description */}
          {post.description && (
            <p className="text-xl text-muted-foreground mb-8">{post.description}</p>
          )}

          {/* Content */}
          <Card>
            <CardContent className="pt-6 prose prose-lg max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: post.content_body || "" }} />
            </CardContent>
          </Card>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
