import FarmerLayout from "@/components/FarmerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";
import { Link } from "react-router-dom";

type GovernmentScheme = Tables<"government_schemes">;

const Schemes = () => {
  const { toast } = useToast();
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    const { data, error } = await supabase
      .from("government_schemes")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch government schemes",
        variant: "destructive",
      });
      return;
    }

    setSchemes(data || []);
  };

  return (
    <FarmerLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Government Schemes</h1>
        </div>
        
        {schemes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">
              No schemes available at the moment
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {schemes.map((scheme) => (
              <Card key={scheme.id}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg">{scheme.scheme_name}</CardTitle>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {scheme.description}
                  </p>
                  {(scheme.state || scheme.district) && (
                    <div className="flex gap-2 text-sm">
                      {scheme.state && <Badge variant="outline">{scheme.state}</Badge>}
                      {scheme.district && <Badge variant="outline">{scheme.district}</Badge>}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Link to={`/schemes/${scheme.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    {scheme.official_website && (
                      <Button
                        variant="default"
                        size="icon"
                        onClick={() => window.open(scheme.official_website || "", "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
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

export default Schemes;
