import FarmerLayout from "@/components/FarmerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check, Cloud, Activity, Syringe, ShoppingCart, Heart, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Notification = Tables<"notifications">;

const Notifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setNotifications(data || []);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark as read",
        variant: "destructive",
      });
      return;
    }

    fetchNotifications();
  };

  const markAllAsRead = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark all as read",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "All notifications marked as read",
    });

    fetchNotifications();
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case "critical":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getTypeIcon = (type: string | null) => {
    switch (type) {
      case "weather":
        return <Cloud className="h-4 w-4" />;
      case "disease":
        return <Activity className="h-4 w-4" />;
      case "vaccination":
        return <Syringe className="h-4 w-4" />;
      case "marketplace":
        return <ShoppingCart className="h-4 w-4" />;
      case "health":
        return <Heart className="h-4 w-4" />;
      case "system":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string | null) => {
    switch (type) {
      case "weather":
        return "bg-blue-500/10 text-blue-500";
      case "disease":
        return "bg-red-500/10 text-red-500";
      case "vaccination":
        return "bg-green-500/10 text-green-500";
      case "marketplace":
        return "bg-purple-500/10 text-purple-500";
      case "health":
        return "bg-pink-500/10 text-pink-500";
      case "system":
        return "bg-orange-500/10 text-orange-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const filterNotifications = (type: string) => {
    if (type === "all") return notifications;
    return notifications.filter((n) => n.type === type);
  };

  const filteredNotifications = filterNotifications(selectedType);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const notificationTypes = [
    { value: "all", label: "All", icon: Bell },
    { value: "weather", label: "Weather", icon: Cloud },
    { value: "disease", label: "Disease", icon: Activity },
    { value: "vaccination", label: "Vaccination", icon: Syringe },
    { value: "marketplace", label: "Marketplace", icon: ShoppingCart },
    { value: "health", label: "Health", icon: Heart },
    { value: "system", label: "System", icon: AlertCircle },
  ];

  const getTypeCount = (type: string) => {
    if (type === "all") return notifications.length;
    return notifications.filter((n) => n.type === type).length;
  };

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "Unknown time";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <FarmerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Notification Center</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Stay updated with alerts, reminders, and important information
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                </div>
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold text-destructive">{unreadCount}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="text-2xl font-bold">
                    {notifications.filter((n) => {
                      const today = new Date();
                      const created = new Date(n.created_at || "");
                      return created.toDateString() === today.toDateString();
                    }).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold">
                    {notifications.filter((n) => n.priority === "critical").length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notification Filters */}
        <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            {notificationTypes.map((type) => (
              <TabsTrigger key={type.value} value={type.value} className="gap-2">
                <type.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{type.label}</span>
                {getTypeCount(type.value) > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {getTypeCount(type.value)}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedType} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedType === "all" ? "All Notifications" : `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Notifications`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-12 text-muted-foreground">Loading notifications...</p>
                ) : filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                    <p className="text-muted-foreground">No notifications in this category</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                          notification.is_read
                            ? "bg-background hover:bg-muted/50"
                            : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                        }`}
                      >
                        <div className={`rounded-full p-2 ${getTypeColor(notification.type)}`}>
                          {getTypeIcon(notification.type)}
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold">{notification.title}</h4>
                                {!notification.is_read && (
                                  <Badge variant="destructive" className="text-xs">
                                    New
                                  </Badge>
                                )}
                                {notification.priority && (
                                  <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                                    {notification.priority}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTimestamp(notification.created_at)}
                                </span>
                                {notification.type && (
                                  <Badge variant="outline" className="text-xs">
                                    {notification.type}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {!notification.is_read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="flex-shrink-0"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FarmerLayout>
  );
};

export default Notifications;
