import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Heart, ArrowLeft, MessageCircle } from "lucide-react";
import Footer from "@/components/Footer";

const FAQ = () => {
  const faqCategories = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create an account on AIS?",
          answer: "Creating an account is simple! Click on 'Get Started' or 'Farmer Sign Up' on the homepage. You'll need to provide your name, phone number, and location details. After registration, you'll be guided through a quick onboarding process to set up your profile and select a subscription plan."
        },
        {
          question: "Is the platform available in my local language?",
          answer: "Yes! AIS is available in English and 10 regional Indian languages including Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and Odia. You can select your preferred language during registration or change it anytime from the Settings page."
        },
        {
          question: "What devices can I use to access AIS?",
          answer: "AIS works on smartphones, tablets, and computers with internet access. The platform is optimized for mobile devices and supports Android Version 10.0 and above. You can access it through any modern web browser."
        }
      ]
    },
    {
      category: "Features & Usage",
      questions: [
        {
          question: "What is AI Pashu Doctor and how does it work?",
          answer: "AI Pashu Doctor is an intelligent chatbot that provides preliminary diagnosis for animal health issues. Simply describe the symptoms, upload photos or videos of your animal, and our AI will analyze the information to suggest possible health concerns and recommend whether veterinary consultation is needed."
        },
        {
          question: "How do I add animals to my account?",
          answer: "Go to the 'Animals' section in your dashboard and click 'Add Animal'. Fill in details like species, breed, gender, date of birth, and identification number. You can also upload a photo and add location information. All animal records are stored securely in your account."
        },
        {
          question: "Can I track vaccination schedules for my animals?",
          answer: "Absolutely! The Vaccinations section allows you to record all vaccinations with details like vaccine name, date administered, and next due date. You'll also receive automatic reminders before upcoming vaccination dates."
        },
        {
          question: "How does the Livestock Marketplace work?",
          answer: "The Marketplace allows you to buy and sell livestock. To list an animal, provide details, photos, health records, and your contact information. Buyers can browse listings by location, view complete health history, and contact sellers directly through the platform."
        }
      ]
    },
    {
      category: "Subscription & Payment",
      questions: [
        {
          question: "What are the available subscription plans?",
          answer: "We offer flexible subscription plans designed for different needs. Currently, all plans provide access to core features including health management, AI diagnosis, marketplace access, and government schemes information. Visit the Plans page to see current pricing and duration options."
        },
        {
          question: "How do I upgrade or change my subscription?",
          answer: "You can view and manage your subscription from the Profile or Settings page. Administrators can also help you change your plan if needed. Your data and animal records remain intact when changing plans."
        },
        {
          question: "Are there any free features available?",
          answer: "Yes! You can browse government schemes, view public marketplace listings, and access basic information about the platform without a subscription. However, to manage your own animals and access personalized features, a subscription is required."
        }
      ]
    },
    {
      category: "Health & Records",
      questions: [
        {
          question: "How do I maintain health records for my animals?",
          answer: "Health records are maintained by veterinary officers who examine your animals. These records include symptoms, diagnosis, treatment, prescriptions, and next checkup dates. You can view all health history for each of your animals in the Health Records section."
        },
        {
          question: "What should I do in a medical emergency?",
          answer: "Use the Emergency/SOS feature immediately. This provides quick access to emergency contacts including WhatsApp Chatbot, IVRS support, and your custom emergency contacts. You can also use the AI Pashu Doctor for preliminary guidance while arranging professional veterinary care."
        },
        {
          question: "Can I get disease alerts for my area?",
          answer: "Yes! The Disease Surveillance widget on your dashboard shows real-time disease alerts for your region. These alerts are based on data from the National Animal Disease Reporting System (NADRES v2) and help you take preventive measures."
        }
      ]
    },
    {
      category: "Support & Help",
      questions: [
        {
          question: "How do I contact customer support?",
          answer: "You can reach our support team through multiple channels: Call our toll-free number 1800-123-4567, email support@ais.reliancefoundation.org, or submit a ticket through the Helpdesk section. Our team is available 24/7 to assist you."
        },
        {
          question: "What if I encounter technical issues?",
          answer: "For technical problems, use the Helpdesk feature to submit a detailed ticket with screenshots if possible. Our technical team will respond based on the priority level of your issue. You can also call our support hotline for urgent matters."
        },
        {
          question: "Can I suggest new features or improvements?",
          answer: "We welcome your feedback! Use the Contact Us page to submit your suggestions, or provide feedback through the Support section. Your input helps us improve the platform for all farmers."
        }
      ]
    },
    {
      category: "Government Schemes",
      questions: [
        {
          question: "How can I find government schemes for livestock?",
          answer: "Visit the 'Government Schemes' section to browse active schemes filtered by your state and district. Each scheme listing includes eligibility criteria, benefits, required documents, and application process details with official website links."
        },
        {
          question: "Who updates the government schemes information?",
          answer: "Government schemes are managed and updated by system administrators in coordination with government agencies. This ensures you always have access to the latest and most accurate scheme information."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
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
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about using the Animal Information System
            </p>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="container px-4 pb-20">
          <div className="max-w-4xl mx-auto space-y-8">
            {faqCategories.map((category, idx) => (
              <Card key={idx} className="p-6">
                <h2 className="text-2xl font-bold mb-6">{category.category}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, qIdx) => (
                    <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-muted/50 py-16">
          <div className="container px-4">
            <Card className="max-w-2xl mx-auto p-8 text-center space-y-4">
              <MessageCircle className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold">Still Have Questions?</h2>
              <p className="text-muted-foreground">
                Our support team is here to help. Reach out to us anytime!
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg">Contact Support</Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline">Submit a Ticket</Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
