import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Leaf, Wheat, Package, Droplets, Sun, CloudRain, Snowflake } from "lucide-react";
import { nutritionDatabase, commonFeeds, getCurrentSeasonalAdvice, NutritionRequirement, FeedType } from "@/utils/nutritionGuidelines";

const NutritionGuidelines = () => {
  const [selectedSpecies, setSelectedSpecies] = useState<string>("cattle");
  const [selectedCategory, setSelectedCategory] = useState<string>("lactating");
  const currentSeason = getCurrentSeasonalAdvice();

  const filteredGuidelines = nutritionDatabase.filter(
    (guide) => guide.species === selectedSpecies
  );

  const selectedGuideline = nutritionDatabase.find(
    (guide) => guide.species === selectedSpecies && guide.category === selectedCategory
  );

  const suitableFeeds = commonFeeds.filter((feed) =>
    feed.bestFor.includes(selectedSpecies)
  );

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case "summer":
        return <Sun className="h-4 w-4" />;
      case "monsoon":
        return <CloudRain className="h-4 w-4" />;
      case "winter":
        return <Snowflake className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Nutrition Guidelines</h2>
        <p className="text-muted-foreground">Species-specific feeding recommendations and best practices</p>
      </div>

      {/* Species & Category Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Species</label>
              <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cattle">Cattle</SelectItem>
                  <SelectItem value="buffalo">Buffalo</SelectItem>
                  <SelectItem value="goat">Goat</SelectItem>
                  <SelectItem value="sheep">Sheep</SelectItem>
                  <SelectItem value="poultry">Poultry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Animal Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filteredGuidelines.map((guide) => (
                    <SelectItem key={guide.category} value={guide.category}>
                      {guide.category.charAt(0).toUpperCase() + guide.category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedGuideline && (
        <Tabs defaultValue="requirements" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requirements">
              <Package className="h-4 w-4 mr-2" />
              Requirements
            </TabsTrigger>
            <TabsTrigger value="composition">
              <Leaf className="h-4 w-4 mr-2" />
              Composition
            </TabsTrigger>
            <TabsTrigger value="seasonal">
              {getSeasonIcon(currentSeason)}
              <span className="ml-2">Seasonal</span>
            </TabsTrigger>
            <TabsTrigger value="feeds">
              <Wheat className="h-4 w-4 mr-2" />
              Suitable Feeds
            </TabsTrigger>
          </TabsList>

          {/* Daily Requirements Tab */}
          <TabsContent value="requirements">
            <Card>
              <CardHeader>
                <CardTitle>Daily Feeding Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Leaf className="h-5 w-5 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Green Fodder</p>
                        <p className="text-lg font-bold">{selectedGuideline.dailyRequirements.greenFodder} kg</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Wheat className="h-5 w-5 text-yellow-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Dry Fodder</p>
                        <p className="text-lg font-bold">{selectedGuideline.dailyRequirements.dryFodder} kg</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Package className="h-5 w-5 text-orange-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Concentrate</p>
                        <p className="text-lg font-bold">{selectedGuideline.dailyRequirements.concentrate} kg</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Water</p>
                        <p className="text-lg font-bold">{selectedGuideline.dailyRequirements.water} liters</p>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg bg-muted">
                      <p className="text-sm font-medium mb-2">Minerals & Supplements</p>
                      <p className="text-sm text-muted-foreground">{selectedGuideline.dailyRequirements.minerals}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feed Composition Tab */}
          <TabsContent value="composition">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Feed Composition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Protein</p>
                    <p className="text-2xl font-bold text-primary">{selectedGuideline.feedComposition.protein}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Energy (TDN)</p>
                    <p className="text-2xl font-bold text-primary">{selectedGuideline.feedComposition.energy}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Fiber</p>
                    <p className="text-2xl font-bold text-primary">{selectedGuideline.feedComposition.fiber}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Calcium</p>
                    <p className="text-2xl font-bold text-primary">{selectedGuideline.feedComposition.calcium}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Phosphorus</p>
                    <p className="text-2xl font-bold text-primary">{selectedGuideline.feedComposition.phosphorus}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seasonal Adjustments Tab */}
          <TabsContent value="seasonal">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className={currentSeason === "summer" ? "border-primary" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-orange-500" />
                    Summer
                    {currentSeason === "summer" && <Badge>Current</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {selectedGuideline.seasonalAdjustments.summer}
                  </p>
                </CardContent>
              </Card>

              <Card className={currentSeason === "monsoon" ? "border-primary" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CloudRain className="h-5 w-5 text-blue-500" />
                    Monsoon
                    {currentSeason === "monsoon" && <Badge>Current</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {selectedGuideline.seasonalAdjustments.monsoon}
                  </p>
                </CardContent>
              </Card>

              <Card className={currentSeason === "winter" ? "border-primary" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Snowflake className="h-5 w-5 text-cyan-500" />
                    Winter
                    {currentSeason === "winter" && <Badge>Current</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {selectedGuideline.seasonalAdjustments.winter}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Suitable Feeds Tab */}
          <TabsContent value="feeds">
            <Card>
              <CardHeader>
                <CardTitle>Suitable Feed Types for {selectedSpecies.charAt(0).toUpperCase() + selectedSpecies.slice(1)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {suitableFeeds.map((feed) => (
                    <div key={feed.name} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{feed.name}</h4>
                          <Badge variant="outline" className="mt-1">
                            {feed.category.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Avg. Cost</p>
                          <p className="font-bold">₹{feed.cost}/kg</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <p className="text-muted-foreground">Protein</p>
                            <p className="font-medium">{feed.nutritionPer100g.protein}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Energy</p>
                            <p className="font-medium">{feed.nutritionPer100g.energy}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Fiber</p>
                            <p className="font-medium">{feed.nutritionPer100g.fiber}%</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <p className="text-muted-foreground">
                            <span className="font-medium">Availability:</span> {feed.availability}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            General Feeding Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Feed animals at regular intervals (2-3 times daily for larger animals)</li>
            <li>• Always provide fresh, clean drinking water</li>
            <li>• Introduce new feeds gradually over 7-10 days</li>
            <li>• Store feeds in dry, cool, and rodent-proof locations</li>
            <li>• Monitor animal weight and body condition regularly</li>
            <li>• Adjust feeding based on milk production, pregnancy, or work output</li>
            <li>• Provide mineral licks and salt separately</li>
            <li>• Avoid feeding moldy or contaminated fodder</li>
            <li>• Maintain cleanliness in feeding troughs and water containers</li>
            <li>• Consult veterinarians for specific nutritional requirements</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionGuidelines;
