import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Marketplace = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Livestock Marketplace</h1>
          </div>
          <Link to="/marketplace/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Listing
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Active Listings</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12 text-muted-foreground">
            Browse and create livestock listings
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Marketplace;
