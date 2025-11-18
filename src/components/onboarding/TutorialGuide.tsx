import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, PawPrint, Heart, ShoppingCart, Bot, FileText, Calendar } from "lucide-react";

interface TutorialGuideProps {
  onComplete: () => void;
  onBack: () => void;
}

const tutorialSteps = [
  {
    icon: PawPrint,
    title: "Manage Your Animals",
    description: "Add and track all your livestock with detailed profiles, health records, and breeding information.",
    features: [
      "Register animals with photos and identification",
      "Track health status and medical history",
      "Monitor breeding cycles and offspring",
    ],
  },
  {
    icon: Heart,
    title: "Health & Vaccination",
    description: "Keep your animals healthy with comprehensive health records and vaccination tracking.",
    features: [
      "Record health checkups and treatments",
      "Get vaccination reminders",
      "Access veterinary support",
    ],
  },
  {
    icon: ShoppingCart,
    title: "Livestock Marketplace",
    description: "Buy and sell livestock with other farmers in your region.",
    features: [
      "List animals for sale with photos",
      "Browse available livestock nearby",
      "Connect with buyers and sellers",
    ],
  },
  {
    icon: Bot,
    title: "AI Pashu Doctor",
    description: "Get instant preliminary diagnosis and health advice powered by AI.",
    features: [
      "Upload symptoms and photos",
      "Receive AI-powered recommendations",
      "Connect with real veterinarians",
    ],
  },
  {
    icon: FileText,
    title: "Government Schemes",
    description: "Discover and apply for government schemes and subsidies for livestock farmers.",
    features: [
      "Browse active schemes in your region",
      "View eligibility criteria",
      "Access application details",
    ],
  },
  {
    icon: Calendar,
    title: "Feeding & Care Schedules",
    description: "Create and manage feeding schedules and care routines for your animals.",
    features: [
      "Set up feeding schedules by season",
      "Track feed quantities and types",
      "Get care reminders",
    ],
  },
];

const TutorialGuide = ({ onComplete, onBack }: TutorialGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const step = tutorialSteps[currentStep];
  const Icon = step.icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>{step.title}</CardTitle>
            <CardDescription>{step.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {step.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <p className="text-sm">{feature}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {tutorialSteps.length}
          </div>
          <div className="flex gap-2">
            {Array.from({ length: tutorialSteps.length }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep ? "w-8 bg-primary" : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrevious} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {currentStep === 0 ? "Back" : "Previous"}
          </Button>
          <Button onClick={handleNext} className="flex-1 gap-2">
            {currentStep === tutorialSteps.length - 1 ? "Get Started" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorialGuide;
