import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MarketplaceListing = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Marketplace Listing</h1>
        <Card>
          <CardHeader>
            <CardTitle>Listing Details</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12 text-muted-foreground">
            Create a new listing for your livestock
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MarketplaceListing;
