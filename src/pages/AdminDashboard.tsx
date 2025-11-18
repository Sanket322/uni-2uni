import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, FileText, Bell, ShoppingCart, BarChart3, CreditCard, BookOpen } from "lucide-react";
import UserManagement from "./admin/UserManagement";
import SchemeManagement from "./admin/SchemeManagement";
import ContentManagement from "./admin/ContentManagement";
import NotificationManagement from "./admin/NotificationManagement";
import MarketplaceModeration from "./admin/MarketplaceModeration";
import Reports from "./admin/Reports";
import SubscriptionManagement from "./admin/SubscriptionManagement";

const AdminDashboard = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Complete system administration and management</p>
          </div>
        </div>

        <Tabs defaultValue="reports" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="reports" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Subscriptions</span>
            </TabsTrigger>
            <TabsTrigger value="schemes" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Schemes</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Marketplace</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <Reports />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="subscriptions">
            <SubscriptionManagement />
          </TabsContent>

          <TabsContent value="schemes">
            <SchemeManagement />
          </TabsContent>

          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>

          <TabsContent value="marketplace">
            <MarketplaceModeration />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationManagement />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
