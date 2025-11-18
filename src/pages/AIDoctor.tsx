import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, Upload, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
  images?: string[];
}

const AIDoctor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    // Save to chat history
    const { error: saveError } = await supabase.from("ai_chat_history").insert([
      {
        user_id: user.id,
        message: userMessage,
      },
    ]);

    if (saveError) {
      console.error("Failed to save chat:", saveError);
    }

    // Simulate AI response
    // TODO: Integrate with RF AI API for actual diagnosis
    // Future: Support image/video analysis (Next Financial Year)
    setTimeout(() => {
      const aiResponse =
        "I'm an AI veterinary assistant powered by Reliance Foundation's health database. To help diagnose your animal's condition, please provide:\n\n1. Animal species and breed\n2. Age and gender\n3. Specific symptoms you're observing\n4. Duration of symptoms\n5. Any recent changes in behavior or appetite\n\nFor accurate diagnosis, you can also upload photos or videos (feature coming in next phase). Based on your information, I'll provide preliminary suggestions and connect you with expert veterinarians if needed.";
      
      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">AI Pashu Doctor</h1>
            <p className="text-sm text-muted-foreground">
              Powered by RF AI - 24/7 Veterinary Assistance
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Veterinary Consultation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-[400px] max-h-[400px] overflow-y-auto space-y-4 p-4 border rounded-lg">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <p className="font-semibold mb-2">Start a conversation with AI Pashu Doctor</p>
                  <p className="text-sm">
                    Describe your animal's symptoms for preliminary diagnosis
                  </p>
                  <div className="mt-4 p-4 bg-muted rounded-lg text-left text-xs">
                    <p className="font-semibold mb-2">Current Phase Features:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Text-based symptom analysis</li>
                      <li>Treatment suggestions from RF database</li>
                      <li>Expert veterinarian review available</li>
                    </ul>
                    <p className="font-semibold mt-3 mb-2">Coming Next Year:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Image-based disease detection</li>
                      <li>Video analysis for health monitoring</li>
                      <li>Advanced AI model predictions</li>
                    </ul>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                      {message.images && message.images.length > 0 && (
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {message.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="Uploaded"
                              className="rounded border"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground">AI is analyzing...</p>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your animal's symptoms, behavior, or health concerns in detail..."
                rows={3}
                disabled={loading}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled
                  title="Image upload coming in next phase"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Image (Coming Soon)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled
                  title="Video upload coming in next phase"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add Video (Coming Soon)
                </Button>
                <Button type="submit" disabled={loading || !input.trim()} className="ml-auto gap-2">
                  <Send className="h-4 w-4" />
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>

            <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
              <p className="font-semibold mb-2">Important Disclaimer:</p>
              <p>
                This AI assistant provides preliminary guidance based on Reliance Foundation's
                veterinary database and historical disease data. Suggestions are reviewed by expert
                veterinarians. For accurate diagnosis and treatment, please consult a licensed
                veterinarian. In case of emergency, contact your nearest veterinary hospital
                immediately or use Emergency Contacts.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AIDoctor;
