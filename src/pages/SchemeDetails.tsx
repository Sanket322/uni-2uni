import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";
import { Link, useParams } from "react-router-dom";

type GovernmentScheme = Tables<"government_schemes">;

const SchemeDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [scheme, setScheme] = useState<GovernmentScheme | null>(null);

  useEffect(() => {
    if (id) {
      fetchScheme();
    }
  }, [id]);

  const fetchScheme = async () => {
    const { data, error } = await supabase
      .from("government_schemes")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch scheme details",
        variant: "destructive",
      });
      return;
    }

    setScheme(data);
  };

  if (!scheme) {
    return (
      <Layout>
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            Loading scheme details...
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/schemes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{scheme.scheme_name}</h1>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{scheme.description}</p>
              <div className="flex gap-2">
                {scheme.state && <Badge variant="outline">{scheme.state}</Badge>}
                {scheme.district && <Badge variant="outline">{scheme.district}</Badge>}
                <Badge variant="secondary">Active</Badge>
              </div>
            </CardContent>
          </Card>

          {scheme.eligibility_criteria && (
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{scheme.eligibility_criteria}</p>
              </CardContent>
            </Card>
          )}

          {scheme.benefits && (
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{scheme.benefits}</p>
              </CardContent>
            </Card>
          )}

          {scheme.documents_required && scheme.documents_required.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Required Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {scheme.documents_required.map((doc, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {scheme.application_process && (
            <Card>
              <CardHeader>
                <CardTitle>Application Process</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{scheme.application_process}</p>
              </CardContent>
            </Card>
          )}

          {scheme.contact_details && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{scheme.contact_details}</p>
              </CardContent>
            </Card>
          )}

          {scheme.official_website && (
            <Card>
              <CardHeader>
                <CardTitle>Official Website</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => window.open(scheme.official_website || "", "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit Official Website
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SchemeDetails;
