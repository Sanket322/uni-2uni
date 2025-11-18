import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed } from "lucide-react";

const Feeding = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <UtensilsCrossed className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Feeding Management</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Feeding Schedules</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12 text-muted-foreground">
            Create and manage feeding schedules
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Feeding;
