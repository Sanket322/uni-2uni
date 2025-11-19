import FarmerLayout from "@/components/FarmerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, MapPin, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { StarRating } from "@/components/StarRating";
import type { Tables } from "@/integrations/supabase/types";

type MarketplaceListing = Tables<"marketplace_listings">;

const Marketplace = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from("marketplace_listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch marketplace listings",
        variant: "destructive",
      });
      return;
    }

    setListings(data || []);
  };

  return (
    <FarmerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Livestock Marketplace</h1>
          </div>
          <Link to="/marketplace/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Listing
            </Button>
          </Link>
        </div>

        {listings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">
              No listings available at the moment
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <Card key={listing.id}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg">{listing.title}</CardTitle>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {listing.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {listing.description}
                    </p>
                  )}
                  {listing.price && (
                    <div className="text-2xl font-bold text-primary">
                      ₹{Number(listing.price).toLocaleString()}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {listing.location}
                  </div>
                  {(listing.average_rating ?? 0) > 0 && (
                    <StarRating
                      rating={Number(listing.average_rating) || 0}
                      showNumber
                      reviewCount={listing.review_count ?? 0}
                      size="sm"
                    />
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {listing.views_count !== null && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {listing.views_count}
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/marketplace/${listing.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </FarmerLayout>
  );
};

export default Marketplace;
