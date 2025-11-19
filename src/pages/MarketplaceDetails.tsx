import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FarmerLayout from "@/components/FarmerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Phone, Eye, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StarRating } from "@/components/StarRating";
import { ReviewForm } from "@/components/ReviewForm";
import type { Tables } from "@/integrations/supabase/types";

type MarketplaceListing = Tables<"marketplace_listings">;
type MarketplaceReview = Tables<"marketplace_reviews"> & {
  reviewer_profile?: { full_name: string } | null;
};

const MarketplaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listing, setListing] = useState<MarketplaceListing | null>(null);
  const [reviews, setReviews] = useState<MarketplaceReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchListingDetails();
      fetchReviews();
      incrementViewCount();
    }
  }, [id]);

  const fetchListingDetails = async () => {
    const { data, error } = await supabase
      .from("marketplace_listings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch listing details",
        variant: "destructive",
      });
      navigate("/marketplace");
      return;
    }

    setListing(data);
    setLoading(false);
  };

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("marketplace_reviews")
      .select("*")
      .eq("listing_id", id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      // Fetch reviewer profiles separately
      const reviewsWithProfiles = await Promise.all(
        data.map(async (review) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", review.reviewer_id)
            .single();
          
          return {
            ...review,
            reviewer_profile: profile,
          };
        })
      );
      setReviews(reviewsWithProfiles);
    }
  };

  const incrementViewCount = async () => {
    // Update view count
    if (listing) {
      await supabase
        .from("marketplace_listings")
        .update({ views_count: (listing.views_count || 0) + 1 })
        .eq("id", id);
    }
  };

  if (loading) {
    return (
      <FarmerLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </FarmerLayout>
    );
  }

  if (!listing) return null;

  return (
    <FarmerLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/marketplace")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-2xl">{listing.title}</CardTitle>
                {(listing.average_rating ?? 0) > 0 && (
                  <StarRating
                    rating={Number(listing.average_rating) || 0}
                    showNumber
                    reviewCount={listing.review_count ?? 0}
                  />
                )}
              </div>
              <Badge variant={listing.status === "active" ? "secondary" : "outline"}>
                {listing.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {listing.price && (
              <div className="text-3xl font-bold text-primary">
                ₹{Number(listing.price).toLocaleString()}
              </div>
            )}

            {listing.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{listing.location}</span>
              </div>
              {listing.contact_number && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{listing.contact_number}</span>
                </div>
              )}
              {listing.views_count !== null && (
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>{listing.views_count} views</span>
                </div>
              )}
            </div>

            {listing.contact_number && (
              <Button className="w-full" size="lg">
                <Phone className="h-4 w-4 mr-2" />
                Contact Seller
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reviews & Ratings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ReviewForm
              listingId={listing.id}
              onSuccess={() => {
                fetchReviews();
                fetchListingDetails();
              }}
            />

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">
                Customer Reviews ({reviews.length})
              </h3>

              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No reviews yet. Be the first to review this listing!
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">
                              {review.reviewer_profile?.full_name || "Anonymous"}
                            </span>
                          </div>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                        {review.review_text && (
                          <p className="text-muted-foreground">{review.review_text}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.created_at || "").toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </FarmerLayout>
  );
};

export default MarketplaceDetails;
