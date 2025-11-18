import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/LanguageSelector";
import { useUserRole } from "@/hooks/useUserRole";
import {
  Home,
  PawPrint,
  Heart,
  Syringe,
  Baby,
  UtensilsCrossed,
  ShoppingCart,
  Bot,
  FileText,
  User,
  Bell,
  Phone,
  BarChart3,
  LogOut,
  Menu,
  Shield,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { signOut } = useAuth();
  const { isAdmin, loading } = useUserRole();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Animals", href: "/animals", icon: PawPrint },
    { name: "Health Records", href: "/health", icon: Heart },
    { name: "Vaccinations", href: "/vaccinations", icon: Syringe },
    { name: "Breeding", href: "/breeding", icon: Baby },
    { name: "Feeding", href: "/feeding", icon: UtensilsCrossed },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
    { name: "AI Pashu Doctor", href: "/ai-doctor", icon: Bot },
    { name: "Gov. Schemes", href: "/schemes", icon: FileText },
    { name: "Emergency", href: "/emergency", icon: Phone },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    ...(isAdmin ? [{ name: "Admin", href: "/admin", icon: Shield }] : []),
  ];

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r bg-card">
        <div className="flex items-center gap-2 p-6 border-b">
          <div className="bg-gradient-primary rounded-lg p-2">
            <PawPrint className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">AIS Portal</h1>
            <p className="text-xs text-muted-foreground">Livestock Management</p>
          </div>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          <nav className="flex flex-col gap-1">
            <NavLinks />
          </nav>
        </ScrollArea>

        <div className="p-4 border-t space-y-2">
          <LanguageSelector />
          <Link to="/profile">
            <Button variant="outline" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </Link>
          <Link to="/notifications">
            <Button variant="outline" className="w-full justify-start">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-primary rounded-lg p-2">
              <PawPrint className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-semibold">AIS Portal</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Link to="/notifications">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex items-center gap-2 p-6 border-b">
                  <div className="bg-gradient-primary rounded-lg p-2">
                    <PawPrint className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-semibold text-lg">AIS Portal</h1>
                    <p className="text-xs text-muted-foreground">Livestock Management</p>
                  </div>
                </div>
                
                <ScrollArea className="h-[calc(100vh-200px)] p-4">
                  <nav className="flex flex-col gap-1">
                    <NavLinks />
                  </nav>
                </ScrollArea>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-card space-y-2">
                  <LanguageSelector />
                  <Link to="/profile">
                    <Button variant="outline" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
