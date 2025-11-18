import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

const HealthRecords = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Health Records</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Health Records</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12 text-muted-foreground">
            View and manage health records for all your animals
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default HealthRecords;
