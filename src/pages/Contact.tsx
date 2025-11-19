import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { Heart, ArrowLeft, Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import contactHeroImage from "@/assets/contact-hero.jpg";
import Footer from "@/components/Footer";

const feedbackSchema = z.object({
  category: z.enum(["general", "technical", "feature", "billing", "other"]),
  comments: z.string()
    .trim()
    .min(10, "Comments must be at least 10 characters")
    .max(2000, "Comments must be less than 2000 characters"),
  rating: z.number().int().min(1).max(5)
});

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "general",
    comments: "",
    rating: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = feedbackSchema.parse({
        category: formData.category,
        comments: formData.comments,
        rating: parseInt(formData.rating.toString())
      });

      setLoading(true);

      const { error } = await supabase.from("feedback").insert([validatedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Thank you for your feedback! We'll get back to you soon.",
      });

      setFormData({ category: "general", comments: "", rating: 5 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit feedback. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

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
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Blog
            </Link>
            <Link to="/faq" className="text-sm font-medium hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Contact Section */}
      <section className="container px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold">Contact Us</h1>
              <p className="text-xl text-muted-foreground">
                We're here to help. Reach out to us through any of the channels below.
              </p>
            </div>
            <div>
              <img 
                src={contactHeroImage} 
                alt="Customer support representative ready to help farmers"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="flex gap-4">
                    <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Emergency Support</h3>
                      <p className="text-muted-foreground mb-2">
                        For urgent veterinary assistance:
                      </p>
                      <p className="font-medium">+91-1800-XXX-XXXX</p>
                      <p className="text-sm text-muted-foreground">Available 24/7</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">WhatsApp Chatbot</h3>
                      <p className="text-muted-foreground mb-2">
                        Get instant answers to your queries:
                      </p>
                      <Button variant="outline" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Chat Now
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">IVRS Support</h3>
                      <p className="text-muted-foreground mb-2">Voice-based content access:</p>
                      <p className="font-medium">+91-1800-XXX-YYYY</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Email Support</h3>
                      <p className="text-muted-foreground mb-2">For general inquiries:</p>
                      <a
                        href="mailto:support@ais.reliancefoundation.org"
                        className="font-medium text-primary hover:underline"
                      >
                        support@ais.reliancefoundation.org
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Office Address</h3>
                      <p className="text-muted-foreground">
                        Reliance Foundation
                        <br />
                        Mumbai, Maharashtra
                        <br />
                        India
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Need Immediate Help?</h3>
                  <p className="mb-4 opacity-90">
                    For critical animal health emergencies, contact your nearest veterinary hospital
                    or use our emergency contacts feature in the app.
                  </p>
                  <Link to="/emergency">
                    <Button variant="secondary">View Emergency Contacts</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Feedback Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send Us Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Issue</option>
                      <option value="feature">Feature Request</option>
                      <option value="complaint">Complaint</option>
                      <option value="appreciation">Appreciation</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rating: parseInt(e.target.value) || 5,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comments">Your Message</Label>
                    <Textarea
                      id="comments"
                      value={formData.comments}
                      onChange={(e) =>
                        setFormData({ ...formData, comments: e.target.value })
                      }
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Sending..." : "Submit Feedback"}
                  </Button>

                  <p className="text-sm text-muted-foreground">
                    We typically respond within 24-48 hours. For urgent matters, please use our
                    emergency contact numbers above.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/50 py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">Quick Answers</h2>
              <p className="text-xl text-muted-foreground">
                Common questions about getting help
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What are your support hours?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our emergency helpline is available 24/7. Regular support is available from 9
                    AM to 9 PM IST, all days of the week.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How quickly will I get a response?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We typically respond to queries within 2-4 hours during business hours. Critical
                    issues are addressed immediately via our emergency hotline.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do you provide support in my language?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! We provide support in 11 Indian languages including Hindi, Marathi, Tamil,
                    Telugu, Kannada, Malayalam, Gujarati, Punjabi, Bengali, Odia, and English.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is technical support free?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, all basic technical support is included with your subscription. Premium
                    support packages are available for enterprise users.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center pt-8">
              <Link to="/faq">
                <Button size="lg" variant="outline">
                  View All FAQs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
