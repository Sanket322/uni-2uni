import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
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

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const aiResponse =
        "I'm an AI veterinary assistant. To help diagnose your animal's condition, please provide:\n\n1. Animal species and breed\n2. Age and gender\n3. Specific symptoms you're observing\n4. Duration of symptoms\n5. Any recent changes in behavior or appetite\n\nFor accurate diagnosis, consider uploading photos or videos if possible.";
      
      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Pashu Doctor</h1>
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
                  <p>Start a conversation with the AI Veterinary Assistant</p>
                  <p className="text-sm mt-2">
                    Describe your animal's symptoms for preliminary diagnosis
                  </p>
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
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground">AI is thinking...</p>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your animal's symptoms, behavior, or health concerns..."
                rows={3}
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !input.trim()} className="w-full gap-2">
                <Send className="h-4 w-4" />
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>

            <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
              <p className="font-semibold mb-2">Disclaimer:</p>
              <p>
                This AI assistant provides preliminary guidance only. For accurate
                diagnosis and treatment, please consult a licensed veterinarian.
                In case of emergency, contact your nearest veterinary hospital
                immediately.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AIDoctor;
