import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";

const SLAConfiguration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: slaConfig, isLoading } = useQuery({
    queryKey: ["helpdesk-sla-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("helpdesk_sla_config")
        .select("*")
        .order("priority");

      if (error) throw error;
      return data;
    },
  });

  const [configs, setConfigs] = useState<Record<string, { response: number; resolution: number }>>({});

  const updateSLAMutation = useMutation({
    mutationFn: async () => {
      const updates = Object.entries(configs).map(([priority, times]) =>
        supabase
          .from("helpdesk_sla_config")
          .update({
            response_time_hours: times.response,
            resolution_time_hours: times.resolution,
          })
          .eq("priority", priority as "low" | "medium" | "high" | "critical")
      );

      const results = await Promise.all(updates);
      const error = results.find((r) => r.error);
      if (error?.error) throw error.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["helpdesk-sla-config"] });
      toast({
        title: "SLA configuration updated",
        description: "Service level agreements have been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateSLAMutation.mutate();
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/admin/helpdesk")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">SLA Configuration</h1>
            <p className="text-muted-foreground">
              Configure service level agreement timings for different priority levels
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Response & Resolution Times</CardTitle>
            <CardDescription>
              Set the maximum time (in hours) for responding to and resolving tickets
              based on their priority level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {slaConfig?.map((config) => {
              const priority = config.priority;
              const currentConfig = configs[priority] || {
                response: config.response_time_hours,
                resolution: config.resolution_time_hours,
              };

              return (
                <div
                  key={config.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <h3 className="font-semibold text-lg capitalize">
                    {priority} Priority
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${priority}-response`}>
                        Response Time (hours)
                      </Label>
                      <Input
                        id={`${priority}-response`}
                        type="number"
                        min="1"
                        value={currentConfig.response}
                        onChange={(e) =>
                          setConfigs({
                            ...configs,
                            [priority]: {
                              ...currentConfig,
                              response: parseInt(e.target.value),
                            },
                          })
                        }
                      />
                      <p className="text-sm text-muted-foreground">
                        Time to provide first response to user
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${priority}-resolution`}>
                        Resolution Time (hours)
                      </Label>
                      <Input
                        id={`${priority}-resolution`}
                        type="number"
                        min="1"
                        value={currentConfig.resolution}
                        onChange={(e) =>
                          setConfigs({
                            ...configs,
                            [priority]: {
                              ...currentConfig,
                              resolution: parseInt(e.target.value),
                            },
                          })
                        }
                      />
                      <p className="text-sm text-muted-foreground">
                        Time to fully resolve the ticket
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <Button
              onClick={handleSave}
              disabled={updateSLAMutation.isPending || Object.keys(configs).length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateSLAMutation.isPending ? "Saving..." : "Save Configuration"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default SLAConfiguration;
