import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Heart,
  Smartphone,
  Users,
  TrendingUp,
  Shield,
  Globe,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Animal Information System</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link to="#about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link to="#contact" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block">
              <div className="px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
                Powered by Reliance Foundation
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Mobile App for Healthy Animals, Happy Farmers
            </h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive digital platform for livestock management, health monitoring,
              AI-powered diagnosis, and marketplace - all in 11 Indian languages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth">
                <Button size="lg" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="#features">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold">2M+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div>
                <p className="text-3xl font-bold">11</p>
                <p className="text-sm text-muted-foreground">Languages</p>
              </div>
              <div>
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-sm text-muted-foreground">AI Support</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 backdrop-blur">
              <Smartphone className="h-64 w-full text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/50 py-20">
        <div className="container px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">Comprehensive Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your livestock efficiently and profitably
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Health Management</h3>
                <p className="text-muted-foreground">
                  Complete digital health records, vaccination tracking, and breeding cycle
                  management for all your animals.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Pashu Doctor</h3>
                <p className="text-muted-foreground">
                  Get instant AI-powered preliminary diagnosis and veterinary guidance 24/7 in
                  your local language.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Livestock Marketplace</h3>
                <p className="text-muted-foreground">
                  Buy and sell livestock with complete health records, photos, and location-based
                  browsing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Government Schemes</h3>
                <p className="text-muted-foreground">
                  Access information about subsidies, insurance programs, and government support
                  schemes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multi-Language Support</h3>
                <p className="text-muted-foreground">
                  Available in English and 10 Indian regional languages for maximum accessibility.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Emergency Support</h3>
                <p className="text-muted-foreground">
                  Quick access to WhatsApp chatbot, IVRS support, and emergency veterinary
                  contacts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold">
                Why Choose Animal Information System?
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Real-time Disease Alerts</h3>
                    <p className="text-muted-foreground">
                      Get instant notifications about disease outbreaks and preventive measures in
                      your area.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Weather-Based Advisories</h3>
                    <p className="text-muted-foreground">
                      Receive region-specific weather alerts and animal care recommendations.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Expert Veterinary Support</h3>
                    <p className="text-muted-foreground">
                      Connect with qualified veterinarians for tele-consultation and guidance.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Geo-tagged Disease Tracking</h3>
                    <p className="text-muted-foreground">
                      Predictive analytics based on historical data to prevent disease outbreaks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-12 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-primary">99.5%</div>
                <p className="text-xl font-semibold">System Uptime</p>
                <p className="text-muted-foreground">Reliable service for 2M+ farmers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">
            Ready to Transform Your Livestock Management?
          </h2>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Join millions of farmers using AIS to improve animal health and increase productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 bg-background text-foreground hover:bg-background/90"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/50">
        <div className="container px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <span className="font-bold">AIS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering farmers with digital livestock management solutions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="#features" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/schemes" className="hover:text-foreground">
                    Government Schemes
                  </Link>
                </li>
                <li>
                  <Link to="/marketplace" className="hover:text-foreground">
                    Marketplace
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/emergency" className="hover:text-foreground">
                    Emergency Contacts
                  </Link>
                </li>
                <li>
                  <Link to="/ai-doctor" className="hover:text-foreground">
                    AI Doctor
                  </Link>
                </li>
                <li>
                  <Link to="#contact" className="hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Reliance Foundation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
