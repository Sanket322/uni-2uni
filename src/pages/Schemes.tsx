import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const Schemes = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Government Schemes</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Available Schemes</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12 text-muted-foreground">
            Explore government schemes and subsidies
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Schemes;
