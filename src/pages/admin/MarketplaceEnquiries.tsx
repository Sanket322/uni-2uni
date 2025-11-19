import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Phone, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";

type Enquiry = {
  id: string;
  listing_id: string;
  buyer_id: string;
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

const MarketplaceEnquiries = () => {
  const { toast } = useToast();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check if user is admin
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    let query = supabase
      .from("marketplace_enquiries")
      .select(`
        *,
        listing:marketplace_listings(title)
      `)
      .order("created_at", { ascending: false });

    // If not admin, filter by seller's listings
    if (roleData?.role !== "admin") {
      const { data: listings } = await supabase
        .from("marketplace_listings")
        .select("id")
        .eq("seller_id", user.id);

      if (listings && listings.length > 0) {
        const listingIds = listings.map((l) => l.id);
        query = query.in("listing_id", listingIds);
      } else {
        setEnquiries([]);
        setLoading(false);
        return;
      }
    }

    const { data, error } = await query;

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch enquiries",
        variant: "destructive",
      });
    } else {
      setEnquiries(data || []);
    }

    setLoading(false);
  };

  const updateEnquiryStatus = async (enquiryId: string, status: string) => {
    const { error } = await supabase
      .from("marketplace_enquiries")
      .update({ status })
      .eq("id", enquiryId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update enquiry status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Enquiry status updated",
      });
      fetchEnquiries();
    }
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Marketplace Enquiries</h1>
      </div>

      {enquiries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            No enquiries found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enquiry) => (
            <Card key={enquiry.id}>
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
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
                  <div className="font-semibold">Buyer Details:</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{enquiry.buyer_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{enquiry.buyer_phone}</span>
                    </div>
                    {enquiry.buyer_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{enquiry.buyer_email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-semibold">Message:</div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {enquiry.message}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Select
                    value={enquiry.status}
                    onValueChange={(value) => updateEnquiryStatus(enquiry.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${enquiry.buyer_phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Buyer
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplaceEnquiries;
