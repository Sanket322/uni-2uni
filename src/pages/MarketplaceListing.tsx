import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// SECURITY: Input validation schema
const listingSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().trim().max(2000, "Description must be less than 2000 characters").optional(),
  price: z.string().optional().refine((val) => {
    if (!val) return true;
    const num = parseFloat(val);
    return !isNaN(num) && num > 0 && num <= 10000000;
  }, "Price must be between 0 and 10,000,000"),
  location: z.string().trim().min(3, "Location must be at least 3 characters").max(200, "Location must be less than 200 characters"),
  contact_number: z.string().regex(/^[0-9]{10}$/, "Contact number must be exactly 10 digits"),
});

const MarketplaceListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    contact_number: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // SECURITY: Validate input before submission
    try {
      const validatedData = listingSchema.parse(formData);
      
      setLoading(true);

      const { error } = await supabase.from("marketplace_listings").insert([
        {
          title: validatedData.title,
          description: validatedData.description || null,
          price: validatedData.price ? parseFloat(validatedData.price) : null,
          location: validatedData.location,
          contact_number: validatedData.contact_number,
          seller_id: user.id,
          status: "active",
        },
      ]);

      setLoading(false);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create listing",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Listing created successfully",
      });

      navigate("/marketplace");
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: validationError.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/marketplace">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Create Marketplace Listing</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listing Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Healthy Holstein Friesian Cow"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Provide detailed information about the livestock"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="Enter price"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Village, District, State"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_number">Contact Number</Label>
                <Input
                  id="contact_number"
                  value={formData.contact_number}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_number: e.target.value })
                  }
                  placeholder="Your contact number"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creating..." : "Create Listing"}
                </Button>
                <Link to="/marketplace" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MarketplaceListing;
