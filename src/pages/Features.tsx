import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Heart,
  ArrowLeft,
  Smartphone,
  Brain,
  ShoppingCart,
  Globe,
  Shield,
  Users,
  Bell,
  MapPin,
  FileText,
  Calendar,
  Video,
  MessageSquare,
  TrendingUp,
  Database,
  Cloud,
  Lock,
  Zap,
  CheckCircle2,
} from "lucide-react";
import Footer from "@/components/Footer";
import { PublicHeader } from "@/components/PublicHeader";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { StickyCTABanner } from "@/components/StickyCTABanner";

const Features = () => {
  const coreFeatures = [
    {
      icon: Brain,
      title: "AI Pashu Doctor",
      description:
        "24/7 AI-powered veterinary consultation with image and video analysis for instant preliminary diagnosis and treatment recommendations.",
      details: [
        "Upload photos/videos of sick animals",
        "AI-powered disease detection",
        "Instant treatment suggestions",
        "Symptom analysis and tracking",
        "Emergency triage system",
      ],
    },
    {
      icon: Globe,
      title: "11 Indian Languages",
      description:
        "Complete multilingual support in Hindi, Marathi, Tamil, Telugu, Kannada, Malayalam, Gujarati, Punjabi, Bengali, Odia, and English.",
      details: [
        "Fully localized interface",
        "Voice input support",
        "Regional content delivery",
        "Language-specific tutorials",
        "Cultural context adaptation",
      ],
    },
    {
      icon: ShoppingCart,
      title: "Livestock Marketplace",
      description:
        "Secure buy and sell platform with complete health records, vaccination history, and ownership verification using unique Animal IDs.",
      details: [
        "Photo galleries and videos",
        "Complete health documentation",
        "Buyer-seller messaging",
        "Location-based search",
        "Price history and trends",
      ],
    },
    {
      icon: FileText,
      title: "Digital Health Records",
      description:
        "Comprehensive health management system with vaccination tracking, medical history, and automated reminders.",
      details: [
        "Complete medical history",
        "Vaccination schedule tracking",
        "Treatment records",
        "Lab test results storage",
        "Prescription management",
      ],
    },
    {
      icon: Bell,
      title: "Disease Surveillance",
      description:
        "Real-time disease alerts and outbreak notifications integrated with ICAR-NIVEDI's NADRES v2 system for your region.",
      details: [
        "Real-time outbreak alerts",
        "Geographic disease mapping",
        "Preventive action guidance",
        "Veterinary bulletins",
        "Weather-based advisories",
      ],
    },
    {
      icon: Calendar,
      title: "Feeding Management",
      description:
        "Complete feeding schedule management with nutrition guidelines, inventory tracking, and cost analysis.",
      details: [
        "Feeding schedules and logs",
        "Nutrition recommendations",
        "Feed inventory management",
        "Cost tracking and analytics",
        "Seasonal feeding guides",
      ],
    },
    {
      icon: Users,
      title: "Breeding Management",
      description:
        "Track breeding cycles, pregnancy monitoring, offspring records, and genetic lineage management.",
      details: [
        "Breeding cycle tracking",
        "Pregnancy monitoring",
        "Offspring records",
        "Delivery date predictions",
        "Genetic history tracking",
      ],
    },
    {
      icon: FileText,
      title: "Government Schemes",
      description:
        "Easy access to relevant government subsidies, schemes, and support programs with step-by-step application guidance.",
      details: [
        "Scheme eligibility checker",
        "Application process guides",
        "Document requirement lists",
        "Status tracking",
        "Regional scheme alerts",
      ],
    },
  ];

  const advancedFeatures = [
    {
      icon: MapPin,
      title: "Location-Based Services",
      description: "Find nearby veterinarians, feed suppliers, and emergency services with GPS integration.",
    },
    {
      icon: Video,
      title: "Tele-Consultation",
      description: "Video consultations with qualified veterinarians for expert advice and follow-ups.",
    },
    {
      icon: MessageSquare,
      title: "Community Forum",
      description: "Connect with other farmers, share experiences, and learn best practices.",
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Track herd health metrics, productivity, and financial performance over time.",
    },
    {
      icon: Database,
      title: "Offline Mode",
      description: "Access critical information and log data even without internet connectivity.",
    },
    {
      icon: Cloud,
      title: "Cloud Backup",
      description: "Automatic cloud backup ensures your data is safe and accessible from any device.",
    },
    {
      icon: Lock,
      title: "Data Privacy",
      description: "Bank-level encryption and strict privacy controls for all your livestock data.",
    },
    {
      icon: Zap,
      title: "Quick Actions",
      description: "One-tap access to emergency contacts, SOS alerts, and frequently used features.",
    },
  ];

  const integrations = [
    {
      name: "ICAR-NIVEDI NADRES v2",
      description: "National Animal Disease Reporting System for real-time disease surveillance",
    },
    {
      name: "Weather Services",
      description: "Integrated weather forecasts and climate-based livestock care advisories",
    },
    {
      name: "Payment Gateways",
      description: "Secure payment processing for marketplace transactions",
    },
    {
      name: "SMS & WhatsApp",
      description: "Multi-channel notifications via SMS, WhatsApp, and push notifications",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Animal Information System</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link to="/blog" className="text-sm font-medium hover:text-primary">
              Blog
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block">
            <div className="px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
              Comprehensive Feature Set
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold">
            Everything You Need for Modern Livestock Management
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complete digital ecosystem designed specifically for Indian livestock farmers with
            cutting-edge AI, multilingual support, and government integration
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">Core Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful tools that transform how you manage your livestock
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {coreFeatures.map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <div className="rounded-full w-14 h-14 bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">Advanced Capabilities</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Additional features that enhance your farming experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {advancedFeatures.map((feature) => (
                <Card key={feature.title}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">Seamless Integrations</h2>
              <p className="text-xl text-muted-foreground">
                Connected to essential services for comprehensive livestock management
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {integrations.map((integration) => (
                <Card key={integration.name}>
                  <CardContent className="pt-6 space-y-2">
                    <h3 className="font-bold text-lg">{integration.name}</h3>
                    <p className="text-muted-foreground">{integration.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Specifications */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">Platform Specifications</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6 text-center space-y-2">
                  <Smartphone className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="font-bold text-lg">Mobile First</h3>
                  <p className="text-sm text-muted-foreground">
                    Optimized for Android 10+ with responsive web design
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center space-y-2">
                  <Zap className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="font-bold text-lg">Fast & Reliable</h3>
                  <p className="text-sm text-muted-foreground">
                    &lt;3 second load time, 99.5% uptime guarantee
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center space-y-2">
                  <Shield className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="font-bold text-lg">Enterprise Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Azure cloud hosting with bank-level encryption
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">Ready to Experience All Features?</h2>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Join thousands of farmers already benefiting from our comprehensive platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 bg-background text-foreground hover:bg-background/90"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link to="/demo-login">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
