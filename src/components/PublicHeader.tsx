import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Heart, Menu, Search, Shield, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const navigationLinks = [
  { href: "/#features", label: "Features" },
  { href: "/features", label: "All Features" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const searchableContent = [
  { title: "AI Pashu Doctor", href: "/features#ai-doctor", category: "Feature" },
  { title: "Livestock Marketplace", href: "/features#marketplace", category: "Feature" },
  { title: "Health Records", href: "/features#health", category: "Feature" },
  { title: "Vaccination Tracking", href: "/features#vaccination", category: "Feature" },
  { title: "Government Schemes", href: "/features#schemes", category: "Feature" },
  { title: "Emergency Support", href: "/features#emergency", category: "Feature" },
  { title: "Multilingual Support", href: "/features#multilingual", category: "Feature" },
  { title: "About Us", href: "/about", category: "Page" },
  { title: "Contact Us", href: "/contact", category: "Page" },
  { title: "Blog", href: "/blog", category: "Page" },
  { title: "FAQ", href: "/faq", category: "Page" },
];

export const PublicHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResults = searchableContent.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold hidden sm:inline">Animal Information System</span>
          <span className="text-xl font-bold sm:hidden">AIS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          
          {/* Search Button */}
          <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Search className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Search</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Search features, pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {filteredResults.length > 0 ? (
                      filteredResults.map((result, index) => (
                        <Link
                          key={index}
                          to={result.href}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="block p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="font-medium">{result.title}</div>
                          <div className="text-sm text-muted-foreground">{result.category}</div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        {searchQuery ? "No results found" : "Start typing to search..."}
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>

          <Link to="/demo-login">
            <Button variant="secondary" size="sm">
              Demo Login
            </Button>
          </Link>
          <Link to="/admin-login">
            <Button variant="outline" size="sm" className="gap-2">
              <Shield className="h-4 w-4" />
              Admin
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="sm">Get Started</Button>
          </Link>
        </nav>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Search */}
          <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Search className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[90%]">
              <DialogHeader>
                <DialogTitle>Search</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Search features, pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {filteredResults.length > 0 ? (
                      filteredResults.map((result, index) => (
                        <Link
                          key={index}
                          to={result.href}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="block p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="font-medium">{result.title}</div>
                          <div className="text-sm text-muted-foreground">{result.category}</div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        {searchQuery ? "No results found" : "Start typing to search..."}
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium hover:text-primary transition-colors py-2"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t">
                  <Link to="/demo-login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" size="lg" className="w-full">
                      Demo Login
                    </Button>
                  </Link>
                  <Link to="/admin-login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="lg" className="w-full gap-2">
                      <Shield className="h-4 w-4" />
                      Admin Login
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="lg" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
