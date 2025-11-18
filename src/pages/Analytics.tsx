import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const Analytics = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Livestock Analytics</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12 text-muted-foreground">
            View insights and analytics for your livestock
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;
