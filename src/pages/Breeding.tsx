import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby } from "lucide-react";

const Breeding = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Baby className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Breeding Management</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Breeding Records</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12 text-muted-foreground">
            Manage breeding cycles and offspring records
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Breeding;
