import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LanguageSelector from "@/components/LanguageSelector";
import { NavLink } from "@/components/NavLink";
import { ImpersonationBanner } from "@/components/ImpersonationBanner";
import { 
  Menu, Home, Beef, Heart, Syringe, Calendar, 
  ShoppingCart, MessageSquare, Award, Bell, 
  User, LogOut, CreditCard, BookOpen, Image,
  Utensils, HelpCircle, Settings as SettingsIcon, Mail
} from "lucide-react";

interface FarmerLayoutProps {
  children: ReactNode;
}

const FarmerLayout = ({ children }: FarmerLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Animals", href: "/animals", icon: Beef },
    { name: "Health", href: "/health", icon: Heart },
    { name: "Vaccinations", href: "/vaccinations", icon: Syringe },
    { name: "Breeding", href: "/breeding", icon: Calendar },
    { name: "Feeding", href: "/feeding", icon: Utensils },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
    { name: "Community", href: "/social", icon: Image },
    { name: "Messages", href: "/messages", icon: Mail },
    { name: "AI Doctor", href: "/ai-doctor", icon: MessageSquare },
    { name: "Content Library", href: "/content-library", icon: BookOpen },
    { name: "Schemes", href: "/schemes", icon: Award },
    { name: "Helpdesk", href: "/helpdesk", icon: HelpCircle },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Plans", href: "/plans", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const NavLinks = () => (
    <>
      {navigation.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
          activeClassName="bg-primary/10 text-primary font-medium"
          onClick={() => setMobileMenuOpen(false)}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.name}</span>
        </NavLink>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <ImpersonationBanner />
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-bold text-primary">AIS Portal</h2>
                  <p className="text-sm text-muted-foreground">Farmer Dashboard</p>
                </div>
                
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                  <NavLinks />
                </nav>

                <div className="border-t p-4 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/notifications");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Bell className="w-5 h-5 mr-3" />
                    Notifications
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/profile");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <User className="w-5 h-5 mr-3" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r bg-card">
        <div className="flex flex-col flex-grow overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-primary">AIS Portal</h2>
              <p className="text-sm text-muted-foreground">Farmer Dashboard</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <NavLinks />
          </nav>

          <div className="border-t p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="w-5 h-5 mr-3" />
              Notifications
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/profile")}
            >
              <User className="w-5 h-5 mr-3" />
              Profile
            </Button>
            <LanguageSelector />
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default FarmerLayout;
