import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

const AIDoctor = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Pashu Doctor</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Diagnosis</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12 text-muted-foreground">
            Get instant AI-powered health diagnosis for your livestock
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AIDoctor;
