import { useState } from "react";
import FarmerLayout from "@/components/FarmerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, AlertTriangle, Info, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

const EnhancedEmergency = () => {
  const [selectedState] = useState("Maharashtra"); // From user profile

  // RF Default Contacts
  const rfContacts = [
    {
      id: "whatsapp",
      name: "RF WhatsApp Chatbot",
      description: "24/7 AI-powered support for livestock queries",
      number: "+91-XXXXX-XXXXX", // RF will provide
      type: "whatsapp",
      icon: MessageSquare
    },
    {
      id: "ivrs-content",
      name: "IVRS Content Helpline",
      description: "Access audio content on animal care",
      number: "1800-XXX-XXXX", // RF will provide
      type: "phone",
      icon: Phone
    },
    {
      id: "ivrs-feedback",
      name: "IVRS Feedback Line",
      description: "Share your feedback and suggestions",
      number: "1800-XXX-XXXX", // RF will provide
      type: "phone",
      icon: Phone
    }
  ];

  // Government helplines (dynamic based on state/district)
  const governmentHelplines = [
    {
      id: "vet-emergency",
      name: "State Veterinary Emergency",
      description: `${selectedState} Animal Husbandry Department`,
      number: "1800-XXX-XXXX",
      type: "phone",
      state: selectedState
    },
    {
      id: "disease-control",
      name: "Disease Control Center",
      description: "Report disease outbreaks",
      number: "1800-XXX-XXXX",
      type: "phone",
      state: selectedState
    },
    {
      id: "animal-welfare",
      name: "Animal Welfare Board",
      description: "Animal welfare and rescue services",
      number: "1800-XXX-XXXX",
      type: "phone",
      state: selectedState
    }
  ];

  const handleWhatsAppClick = (number: string) => {
    const message = encodeURIComponent("Hello, I need help with my livestock.");
    window.open(`https://wa.me/${number.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const handleCallClick = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <FarmerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Emergency Support</h1>
          <p className="text-muted-foreground mt-2">
            Get instant help for your livestock emergencies
          </p>
        </div>

        {/* Critical Alert Banner */}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            For life-threatening emergencies, call your local veterinary emergency number immediately.
          </AlertDescription>
        </Alert>

        {/* Tabbed Interface */}
        <Tabs defaultValue="rf-support" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rf-support">RF Support Services</TabsTrigger>
            <TabsTrigger value="govt-helplines">Government Helplines</TabsTrigger>
          </TabsList>

          {/* RF Support Services */}
          <TabsContent value="rf-support" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rfContacts.map((contact) => {
                const Icon = contact.icon;
                return (
                  <Card key={contact.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Icon className="h-8 w-8 text-primary" />
                        <Badge variant="secondary">24/7 Available</Badge>
                      </div>
                      <CardTitle className="mt-4">{contact.name}</CardTitle>
                      <CardDescription>{contact.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-lg font-semibold">
                        <Phone className="h-4 w-4" />
                        {contact.number}
                      </div>
                      <div className="flex gap-2">
                        {contact.type === "whatsapp" ? (
                          <Button 
                            className="flex-1"
                            onClick={() => handleWhatsAppClick(contact.number)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat on WhatsApp
                          </Button>
                        ) : (
                          <Button 
                            className="flex-1"
                            onClick={() => handleCallClick(contact.number)}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Call Now
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  About RF Support Services
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  • <strong>WhatsApp Chatbot:</strong> Get instant answers to common livestock queries, 
                  disease information, and feeding guidelines.
                </p>
                <p>
                  • <strong>IVRS Content:</strong> Access pre-recorded audio content on animal care, 
                  vaccination schedules, and best practices in your regional language.
                </p>
                <p>
                  • <strong>IVRS Feedback:</strong> Share your experience, report issues, or 
                  suggest improvements to help us serve you better.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Government Helplines */}
          <TabsContent value="govt-helplines" className="space-y-4 mt-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Showing helplines for {selectedState}. Numbers are toll-free and available 24/7.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2">
              {governmentHelplines.map((helpline) => (
                <Card key={helpline.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      {helpline.name}
                    </CardTitle>
                    <CardDescription>{helpline.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-2xl font-bold text-primary">
                      {helpline.number}
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handleCallClick(helpline.number)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                    <Badge variant="outline" className="w-full justify-center">
                      {helpline.state}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Report a Disease Outbreak</CardTitle>
                <CardDescription>
                  Help track and prevent disease spread in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Report via NADRES Portal
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Preparedness</CardTitle>
            <CardDescription>
              Download resources to handle common livestock emergencies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <ExternalLink className="h-4 w-4 mr-2" />
              First Aid Guide for Livestock (PDF)
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ExternalLink className="h-4 w-4 mr-2" />
              Common Diseases & Symptoms Chart
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ExternalLink className="h-4 w-4 mr-2" />
              Emergency Contact Card (Printable)
            </Button>
          </CardContent>
        </Card>
      </div>
    </FarmerLayout>
  );
};

export default EnhancedEmergency;
