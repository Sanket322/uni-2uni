import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart, Target, Eye, Award, ArrowLeft } from "lucide-react";
import aboutHeroImage from "@/assets/about-hero.jpg";
import Footer from "@/components/Footer";

const About = () => {
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
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Blog
            </Link>
            <Link to="/faq" className="text-sm font-medium hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
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
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">About AIS</h1>
              <p className="text-xl text-muted-foreground">
                A Reliance Foundation initiative to empower rural livestock farmers through digital
                technology and AI-powered solutions.
              </p>
            </div>
            <div>
              <img 
                src={aboutHeroImage} 
                alt="Team of farmers, veterinarians, and livestock representing our mission"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-muted/50 py-20">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
                <p className="text-muted-foreground">
                  To provide comprehensive digital empowerment to livestock owners and smallholder
                  farmers across rural India through accessible, multilingual, and AI-driven
                  livestock management solutions that improve animal welfare and farmer livelihoods.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Our Vision</h2>
                <p className="text-muted-foreground">
                  To become India's leading digital platform for livestock management, enabling data-
                  driven decision making, preventive animal healthcare, and sustainable livelihood
                  security for millions of rural farming households.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">What Makes AIS Unique</h2>
              <p className="text-xl text-muted-foreground">
                Built specifically for Indian farmers with cutting-edge technology
              </p>
            </div>

            <div className="space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Multilingual Accessibility</h3>
                  <p className="text-muted-foreground mb-4">
                    Available in English and 10 regional Indian languages including Hindi, Bengali,
                    Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, and Odia.
                    Powered by real-time translation APIs to ensure accurate communication.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">AI-Powered Diagnosis</h3>
                  <p className="text-muted-foreground mb-4">
                    Our AI Pashu Doctor provides preliminary diagnostic suggestions based on symptoms
                    and historical disease data. Future updates will include image and video-based
                    disease detection using advanced AI models.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Comprehensive Health Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Digital health cards, vaccination tracking, breeding cycle management, feeding
                    schedules, and complete treatment history - all in one place with automated
                    reminders.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Disease Surveillance & Prediction</h3>
                  <p className="text-muted-foreground mb-4">
                    Geo-tagged disease tracking and predictive analytics based on historical data to
                    forecast disease outbreaks by month, animal type, and region, enabling proactive
                    prevention.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Integrated Marketplace</h3>
                  <p className="text-muted-foreground mb-4">
                    Buy and sell livestock with complete transparency - health records, vaccination
                    details, photos, and location-based browsing. Built with future payment gateway
                    integration support.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">24/7 Emergency Support</h3>
                  <p className="text-muted-foreground mb-4">
                    Quick access to WhatsApp chatbot support, IVRS content delivery, emergency
                    veterinary contacts, and state/district-specific government helplines.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Excellence */}
      <section className="bg-muted/50 py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <Award className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-3xl md:text-5xl font-bold">Built for Scale</h2>
              <p className="text-xl text-muted-foreground">
                Enterprise-grade infrastructure supporting millions of users
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-primary">2M+</div>
                <p className="text-muted-foreground">Concurrent Users Supported</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-primary">&lt;3s</div>
                <p className="text-muted-foreground">Average Load Time</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-primary">99.5%</div>
                <p className="text-muted-foreground">System Uptime</p>
              </div>
            </div>

            <Card className="mt-12">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Security & Compliance</h3>
                <p className="text-muted-foreground">
                  Hosted on Microsoft Azure servers with full compliance to Reliance Foundation IRM
                  (Information Risk Management) security standards. All data is encrypted, backed up
                  automatically, and protected by enterprise-grade security measures.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reliance Foundation */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold">Powered by Reliance Foundation</h2>
            <p className="text-xl text-muted-foreground">
              Part of Reliance Foundation's commitment to rural development and digital enablement,
              the Animal Information System represents our dedication to improving the lives of
              farmers and their livestock across India.
            </p>
            <div className="pt-8">
              <Link to="/auth">
                <Button size="lg">Join AIS Today</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
