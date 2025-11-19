import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number().int().min(1, "Please select a rating").max(5),
  review_text: z.string().trim().max(1000, "Review must be less than 1000 characters").optional(),
});

interface ReviewFormProps {
  listingId: string;
  onSuccess: () => void;
}

export const ReviewForm = ({ listingId, onSuccess }: ReviewFormProps) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = reviewSchema.parse({
        rating,
        review_text: reviewText || undefined,
      });

      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit a review",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("marketplace_reviews").insert({
        listing_id: listingId,
        reviewer_id: user.id,
        rating: validatedData.rating,
        review_text: validatedData.review_text || null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review submitted successfully",
      });

      setRating(0);
      setReviewText("");
      onSuccess();
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
          description: "Failed to submit review",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Your Rating *</Label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoveredRating(i + 1)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 ${
                  (hoveredRating || rating) > i
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="review">Your Review (Optional)</Label>
        <Textarea
          id="review"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your experience with this listing..."
          rows={4}
          maxLength={1000}
        />
        <div className="text-xs text-muted-foreground text-right">
          {reviewText.length}/1000 characters
        </div>
      </div>

      <Button type="submit" disabled={loading || rating === 0}>
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};
