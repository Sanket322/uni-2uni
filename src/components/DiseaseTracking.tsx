import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, AlertCircle } from "lucide-react";

interface DiseaseStats {
  diagnosis: string;
  count: number;
  trend: "up" | "down" | "stable";
  recent_cases: number;
  species_affected: string[];
}

const DiseaseTracking = () => {
  const [diseaseStats, setDiseaseStats] = useState<DiseaseStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiseaseStats();

    // Real-time updates for new health records
    const channel = supabase
      .channel('disease-tracking')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'health_records'
        },
        () => {
          fetchDiseaseStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDiseaseStats = async () => {
    try {
      // Get all health records with diagnosis
      const { data: allRecords } = await supabase
        .from("health_records")
        .select(`
          diagnosis,
          record_date,
          animal_id,
          animals (species)
        `)
        .not("diagnosis", "is", null)
        .order("record_date", { ascending: false });

      if (!allRecords) return;

      // Group by diagnosis
      const diseaseMap = new Map<string, {
        count: number;
        recent: number;
        species: Set<string>;
        dates: string[];
      }>();

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      allRecords.forEach((record: any) => {
        const diagnosis = record.diagnosis.trim().toLowerCase();
        const recordDate = new Date(record.record_date);
        
        if (!diseaseMap.has(diagnosis)) {
          diseaseMap.set(diagnosis, {
            count: 0,
            recent: 0,
            species: new Set(),
            dates: [],
          });
        }

        const stats = diseaseMap.get(diagnosis)!;
        stats.count++;
        stats.dates.push(record.record_date);
        
        if (record.animals?.species) {
          stats.species.add(record.animals.species);
        }

        if (recordDate >= thirtyDaysAgo) {
          stats.recent++;
        }
      });

      // Calculate trends
      const diseaseList: DiseaseStats[] = Array.from(diseaseMap.entries()).map(([diagnosis, stats]) => {
        // Simple trend calculation based on recent cases
        let trend: "up" | "down" | "stable" = "stable";
        const recentPercentage = (stats.recent / stats.count) * 100;
        
        if (recentPercentage > 60) {
          trend = "up";
        } else if (recentPercentage < 30) {
          trend = "down";
        }

        return {
          diagnosis: diagnosis.charAt(0).toUpperCase() + diagnosis.slice(1),
          count: stats.count,
          trend,
          recent_cases: stats.recent,
          species_affected: Array.from(stats.species),
        };
      });

      // Sort by count
      diseaseList.sort((a, b) => b.count - a.count);
      setDiseaseStats(diseaseList);
    } catch (error) {
      console.error("Error fetching disease stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendBadge = (trend: "up" | "down" | "stable") => {
    const colors = {
      up: "destructive",
      down: "default",
      stable: "secondary",
    } as const;

    const labels = {
      up: "Rising",
      down: "Declining",
      stable: "Stable",
    };

    return (
      <Badge variant={colors[trend]} className="text-xs">
        {labels[trend]}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Disease Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading disease statistics...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Disease Tracking & Analytics
        </CardTitle>
        <CardDescription>
          Real-time disease prevalence and trend analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        {diseaseStats.length === 0 ? (
          <p className="text-muted-foreground">No disease data available</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disease/Condition</TableHead>
                  <TableHead>Total Cases</TableHead>
                  <TableHead>Recent (30d)</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead>Species Affected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diseaseStats.map((disease, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {disease.trend === "up" && (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                        {disease.diagnosis}
                      </div>
                    </TableCell>
                    <TableCell>{disease.count}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{disease.recent_cases}</Badge>
                    </TableCell>
                    <TableCell>{getTrendBadge(disease.trend)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {disease.species_affected.slice(0, 3).map((species, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {species}
                          </Badge>
                        ))}
                        {disease.species_affected.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{disease.species_affected.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiseaseTracking;
