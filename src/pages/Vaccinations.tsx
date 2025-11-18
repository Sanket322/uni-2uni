import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Syringe } from "lucide-react";

const Vaccinations = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Syringe className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Vaccinations</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Vaccination Schedule</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12 text-muted-foreground">
            Track vaccination schedules and history
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Vaccinations;
