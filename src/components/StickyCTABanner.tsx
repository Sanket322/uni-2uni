import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";

export const StickyCTABanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show banner after scrolling 400px down
      if (window.scrollY > 400 && !isDismissed) {
        setIsVisible(true);
      } else if (window.scrollY <= 400) {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-in-up">
      <div className="bg-primary text-primary-foreground shadow-lg">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Ready to Transform Your Livestock Management?</h3>
                <p className="text-sm text-primary-foreground/90">
                  Join thousands of farmers using AI-powered tools to improve animal health
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/auth">
                  <Button 
                    variant="secondary" 
                    className="gap-2 whitespace-nowrap"
                  >
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/demo-login">
                  <Button 
                    variant="outline" 
                    className="whitespace-nowrap bg-background/10 hover:bg-background/20 border-primary-foreground/20"
                  >
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDismissed(true)}
              className="hover:bg-primary-foreground/10 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
