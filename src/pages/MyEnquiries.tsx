import { useEffect, useState } from "react";
import FarmerLayout from "@/components/FarmerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

type Enquiry = {
  id: string;
  listing_id: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string | null;
  message: string;
  status: string;
  created_at: string;
  listing?: {
    title: string;
  };
};

const MyEnquiries = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("marketplace_enquiries")
      .select(`
        *,
        listing:marketplace_listings(title)
      `)
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your enquiries",
        variant: "destructive",
      });
    } else {
      setEnquiries(data || []);
    }

    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      pending: "secondary",
      contacted: "default",
      resolved: "outline",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
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

  return (
    <FarmerLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My Enquiries</h1>
        </div>

        {enquiries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                You haven't sent any enquiries yet
              </p>
              <Button onClick={() => navigate("/marketplace")}>
                Browse Marketplace
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {enquiries.map((enquiry) => (
              <Card key={enquiry.id}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg">
                        {enquiry.listing?.title || "Unknown Listing"}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(enquiry.created_at), "PPp")}
                      </div>
                    </div>
                    {getStatusBadge(enquiry.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-semibold">Your Message:</div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {enquiry.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Status: <span className="font-medium">{enquiry.status}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/marketplace/${enquiry.listing_id}`)}
                    >
                      View Listing
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </FarmerLayout>
  );
};

export default MyEnquiries;
