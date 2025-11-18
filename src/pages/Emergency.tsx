import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone } from "lucide-react";

const Emergency = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Phone className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Emergency Contacts</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Emergency Support</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12 text-muted-foreground">
            Access emergency contacts and support
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Emergency;
