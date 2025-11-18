import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  BookOpen,
  ShoppingCart,
  Bell,
  BarChart3,
  Shield,
  Activity,
} from "lucide-react";

const adminMenuItems = [
  {
    title: "Overview",
    url: "/admin",
    icon: LayoutDashboard,
    group: "Main",
  },
  {
    title: "Reports & Analytics",
    url: "/admin/reports",
    icon: BarChart3,
    group: "Main",
  },
  {
    title: "User Management",
    url: "/admin/users",
    icon: Users,
    group: "Users & Access",
  },
  {
    title: "User Activity",
    url: "/admin/user-activity",
    icon: Activity,
    group: "Users & Access",
  },
  {
    title: "Subscriptions",
    url: "/admin/subscriptions",
    icon: CreditCard,
    group: "Users & Access",
  },
  {
    title: "Scheme Management",
    url: "/admin/schemes",
    icon: FileText,
    group: "Content",
  },
  {
    title: "Content Library",
    url: "/admin/content",
    icon: BookOpen,
    group: "Content",
  },
  {
    title: "Marketplace Moderation",
    url: "/admin/marketplace",
    icon: ShoppingCart,
    group: "Operations",
  },
  {
    title: "Notifications",
    url: "/admin/notifications",
    icon: Bell,
    group: "Operations",
  },
];

const groupedItems = adminMenuItems.reduce((acc, item) => {
  if (!acc[item.group]) {
    acc[item.group] = [];
  }
  acc[item.group].push(item);
  return acc;
}, {} as Record<string, typeof adminMenuItems>);

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            {!collapsed && (
              <div>
                <h2 className="font-bold text-lg">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">System Management</p>
              </div>
            )}
          </div>
        </div>

        {Object.entries(groupedItems).map(([groupName, items]) => (
          <SidebarGroup key={groupName}>
            {!collapsed && <SidebarGroupLabel>{groupName}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const active = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={active}>
                        <NavLink
                          to={item.url}
                          className="flex items-center gap-3 hover:bg-accent"
                          activeClassName="bg-accent text-primary font-medium"
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
