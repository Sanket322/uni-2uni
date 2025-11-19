import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Wind, AlertTriangle, Thermometer, Droplets } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: string;
  alerts: string[];
  advisory: string;
}

const WeatherWidget = ({ latitude, longitude }: { latitude?: number; longitude?: number }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Import demo data generator dynamically
        const { generateWeatherData } = await import("@/utils/demoDataGenerators");
        const mockWeather = generateWeatherData({ latitude, longitude });
        
        setWeather(mockWeather);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch weather:", error);
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Weather & Advisories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading weather data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return null;
  }

  const getWeatherIcon = (condition: string) => {
    if (condition.toLowerCase().includes("rain")) return <CloudRain className="h-8 w-8" />;
    if (condition.toLowerCase().includes("cloud")) return <Cloud className="h-8 w-8" />;
    return <Sun className="h-8 w-8" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Weather & Advisories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weather Alerts */}
        {weather.alerts.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {weather.alerts.map((alert, index) => (
                <div key={index}>{alert}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {/* Current Weather */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getWeatherIcon(weather.condition)}
            <div>
              <p className="text-3xl font-bold">{weather.temperature}°C</p>
              <p className="text-muted-foreground">{weather.condition}</p>
            </div>
          </div>
          <Badge variant="secondary">{weather.forecast.split('.')[0]}</Badge>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Humidity</p>
              <p className="text-sm text-muted-foreground">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Wind Speed</p>
              <p className="text-sm text-muted-foreground">{weather.windSpeed} km/h</p>
            </div>
          </div>
        </div>

        {/* Livestock Advisory */}
        <div className="rounded-lg bg-muted p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold">Livestock Advisory</p>
          </div>
          <p className="text-sm text-muted-foreground">{weather.advisory}</p>
        </div>

        {/* Forecast */}
        <div className="pt-2 border-t">
          <p className="text-sm font-medium mb-1">Today's Forecast</p>
          <p className="text-sm text-muted-foreground">{weather.forecast}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
