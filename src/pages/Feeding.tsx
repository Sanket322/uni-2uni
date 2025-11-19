import FarmerLayout from "@/components/FarmerLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, BookOpen, ClipboardList, UtensilsCrossed } from "lucide-react";
import FeedInventory from "@/components/feeding/FeedInventory";
import NutritionGuidelines from "@/components/feeding/NutritionGuidelines";
import FeedingLogs from "@/components/feeding/FeedingLogs";

const Feeding = () => {
  return (
    <FarmerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UtensilsCrossed className="h-8 w-8 text-primary" />
            Feeding Management
          </h1>
          <p className="text-muted-foreground">
            Comprehensive nutrition guidelines, inventory tracking, and feeding activity logs
          </p>
        </div>

        <Tabs defaultValue="guidelines" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guidelines" className="gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Nutrition Guidelines</span>
              <span className="sm:hidden">Guidelines</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Feed Inventory</span>
              <span className="sm:hidden">Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Feeding Logs</span>
              <span className="sm:hidden">Logs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guidelines" className="mt-6">
            <NutritionGuidelines />
          </TabsContent>

          <TabsContent value="inventory" className="mt-6">
            <FeedInventory />
          </TabsContent>

          <TabsContent value="logs" className="mt-6">
            <FeedingLogs />
          </TabsContent>
        </Tabs>
      </div>
    </FarmerLayout>
  );
};

export default Feeding;
