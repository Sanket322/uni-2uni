/**
 * Comprehensive Nutrition Guidelines for Different Livestock Species
 * Based on best practices for Indian livestock management
 */

export interface NutritionRequirement {
  species: string;
  category: string; // calf, young, adult, lactating, pregnant, bull
  dailyRequirements: {
    greenFodder: string; // kg
    dryFodder: string; // kg
    concentrate: string; // kg
    water: string; // liters
    minerals: string;
  };
  feedComposition: {
    protein: string; // percentage
    energy: string; // TDN%
    fiber: string; // percentage
    calcium: string;
    phosphorus: string;
  };
  seasonalAdjustments: {
    summer: string;
    monsoon: string;
    winter: string;
  };
}

export const nutritionDatabase: NutritionRequirement[] = [
  // Cattle - Dairy Cow (Lactating)
  {
    species: "cattle",
    category: "lactating",
    dailyRequirements: {
      greenFodder: "30-35",
      dryFodder: "6-8",
      concentrate: "3-5 (1 kg per 2.5 liters of milk)",
      water: "50-80",
      minerals: "50g mineral mixture + 25g salt",
    },
    feedComposition: {
      protein: "14-16%",
      energy: "65-70% TDN",
      fiber: "18-20%",
      calcium: "0.6-0.8%",
      phosphorus: "0.4-0.5%",
    },
    seasonalAdjustments: {
      summer: "Increase water by 20-30%. Add cooling feeds like berseem, lucerne.",
      monsoon: "Ensure dry storage. Increase vitamin A supplementation.",
      winter: "Increase energy feed by 10%. Provide lukewarm water.",
    },
  },
  // Cattle - Dry Cow
  {
    species: "cattle",
    category: "dry",
    dailyRequirements: {
      greenFodder: "20-25",
      dryFodder: "4-5",
      concentrate: "1-1.5",
      water: "30-40",
      minerals: "30g mineral mixture + 20g salt",
    },
    feedComposition: {
      protein: "10-12%",
      energy: "60% TDN",
      fiber: "20-25%",
      calcium: "0.4-0.5%",
      phosphorus: "0.3%",
    },
    seasonalAdjustments: {
      summer: "Provide shade and plenty of water. Green fodder in evening.",
      monsoon: "Protect from rain. Check for foot rot regularly.",
      winter: "Increase concentrate slightly. Ensure warm shelter.",
    },
  },
  // Cattle - Calf (0-6 months)
  {
    species: "cattle",
    category: "calf",
    dailyRequirements: {
      greenFodder: "3-5 (after 2 months)",
      dryFodder: "0.5-1",
      concentrate: "0.5-1 (calf starter)",
      water: "5-10 + milk/colostrum",
      minerals: "Ad libitum mineral lick",
    },
    feedComposition: {
      protein: "18-20%",
      energy: "70% TDN",
      fiber: "12-15%",
      calcium: "0.8%",
      phosphorus: "0.5%",
    },
    seasonalAdjustments: {
      summer: "Protect from heat stress. Frequent small meals.",
      monsoon: "Keep dry and clean. Prevent pneumonia.",
      winter: "Warm housing. Monitor for hypothermia.",
    },
  },
  // Buffalo - Lactating
  {
    species: "buffalo",
    category: "lactating",
    dailyRequirements: {
      greenFodder: "35-40",
      dryFodder: "8-10",
      concentrate: "4-6 (1 kg per 2-2.5 liters of milk)",
      water: "60-100",
      minerals: "60g mineral mixture + 30g salt",
    },
    feedComposition: {
      protein: "15-18%",
      energy: "68-72% TDN",
      fiber: "18-20%",
      calcium: "0.7%",
      phosphorus: "0.5%",
    },
    seasonalAdjustments: {
      summer: "Provide wallowing facility. Increase water intake.",
      monsoon: "Rich green fodder available. Monitor weight.",
      winter: "Buffaloes handle cold well. Normal feeding.",
    },
  },
  // Goat - Adult
  {
    species: "goat",
    category: "adult",
    dailyRequirements: {
      greenFodder: "3-5",
      dryFodder: "0.5-1",
      concentrate: "0.2-0.3",
      water: "3-5",
      minerals: "10g mineral mixture + 5g salt",
    },
    feedComposition: {
      protein: "12-14%",
      energy: "60% TDN",
      fiber: "12-16%",
      calcium: "0.5%",
      phosphorus: "0.3%",
    },
    seasonalAdjustments: {
      summer: "Browse in early morning/evening. Plenty of shade.",
      monsoon: "Watch for parasites. Deworm regularly.",
      winter: "Increase concentrate slightly. Provide shelter.",
    },
  },
  // Goat - Lactating
  {
    species: "goat",
    category: "lactating",
    dailyRequirements: {
      greenFodder: "4-6",
      dryFodder: "1-1.5",
      concentrate: "0.3-0.5",
      water: "5-8",
      minerals: "15g mineral mixture + 5g salt",
    },
    feedComposition: {
      protein: "14-16%",
      energy: "65% TDN",
      fiber: "14-18%",
      calcium: "0.6%",
      phosphorus: "0.4%",
    },
    seasonalAdjustments: {
      summer: "Milking goats need extra water. Leafy greens.",
      monsoon: "Quality fodder. Watch for mastitis.",
      winter: "Energy-rich feed. Warm housing.",
    },
  },
  // Sheep - Adult
  {
    species: "sheep",
    category: "adult",
    dailyRequirements: {
      greenFodder: "3-4",
      dryFodder: "0.5-1",
      concentrate: "0.2-0.25",
      water: "2-4",
      minerals: "10g mineral mixture + 5g salt",
    },
    feedComposition: {
      protein: "10-12%",
      energy: "58-60% TDN",
      fiber: "15-20%",
      calcium: "0.4%",
      phosphorus: "0.25%",
    },
    seasonalAdjustments: {
      summer: "Grazing in cooler hours. Shade essential.",
      monsoon: "Manage foot problems. Dry bedding.",
      winter: "Good season for sheep. Normal feeding.",
    },
  },
  // Poultry - Layer
  {
    species: "poultry",
    category: "layer",
    dailyRequirements: {
      greenFodder: "Limited greens/vegetables",
      dryFodder: "N/A",
      concentrate: "100-120g layer feed",
      water: "200-300ml",
      minerals: "Provided in layer feed + shell grit",
    },
    feedComposition: {
      protein: "16-18%",
      energy: "2700-2800 kcal/kg",
      fiber: "4-5%",
      calcium: "3.5-4%",
      phosphorus: "0.6%",
    },
    seasonalAdjustments: {
      summer: "Increase water. Add electrolytes. Reduce density.",
      monsoon: "Prevent mycotoxin in feed. Dry storage.",
      winter: "Increase energy by 5%. Prevent cold stress.",
    },
  },
  // Poultry - Broiler
  {
    species: "poultry",
    category: "broiler",
    dailyRequirements: {
      greenFodder: "Minimal",
      dryFodder: "N/A",
      concentrate: "Starter: 50g, Grower: 80g, Finisher: 100g",
      water: "Ad libitum (150-250ml)",
      minerals: "Complete in broiler feed",
    },
    feedComposition: {
      protein: "Starter: 22%, Grower: 20%, Finisher: 18%",
      energy: "3000-3200 kcal/kg",
      fiber: "3-4%",
      calcium: "0.9-1%",
      phosphorus: "0.6-0.7%",
    },
    seasonalAdjustments: {
      summer: "Heat stress management critical. Electrolytes.",
      monsoon: "Prevent wet litter. Ventilation crucial.",
      winter: "Optimal season. Maintain temperature.",
    },
  },
];

export interface FeedType {
  name: string;
  category: string;
  nutritionPer100g: {
    protein: number;
    energy: number;
    fiber: number;
  };
  cost: number; // average cost in INR
  availability: string;
  bestFor: string[];
}

export const commonFeeds: FeedType[] = [
  {
    name: "Berseem (Egyptian Clover)",
    category: "green_fodder",
    nutritionPer100g: { protein: 3.2, energy: 18, fiber: 4.5 },
    cost: 2,
    availability: "Winter",
    bestFor: ["cattle", "buffalo", "goat", "sheep"],
  },
  {
    name: "Lucerne (Alfalfa)",
    category: "green_fodder",
    nutritionPer100g: { protein: 4.5, energy: 22, fiber: 5 },
    cost: 3,
    availability: "Year-round",
    bestFor: ["cattle", "buffalo", "goat"],
  },
  {
    name: "Maize Fodder",
    category: "green_fodder",
    nutritionPer100g: { protein: 1.8, energy: 20, fiber: 6 },
    cost: 1.5,
    availability: "Summer, Monsoon",
    bestFor: ["cattle", "buffalo"],
  },
  {
    name: "Jowar Fodder",
    category: "green_fodder",
    nutritionPer100g: { protein: 2.0, energy: 18, fiber: 5.5 },
    cost: 1.5,
    availability: "Summer",
    bestFor: ["cattle", "buffalo", "goat", "sheep"],
  },
  {
    name: "Wheat Straw",
    category: "dry_fodder",
    nutritionPer100g: { protein: 2.5, energy: 42, fiber: 38 },
    cost: 1,
    availability: "Year-round",
    bestFor: ["cattle", "buffalo"],
  },
  {
    name: "Rice Straw",
    category: "dry_fodder",
    nutritionPer100g: { protein: 3.0, energy: 35, fiber: 40 },
    cost: 0.8,
    availability: "Year-round",
    bestFor: ["cattle", "buffalo"],
  },
  {
    name: "Cotton Seed Cake",
    category: "concentrate",
    nutritionPer100g: { protein: 22, energy: 78, fiber: 12 },
    cost: 35,
    availability: "Year-round",
    bestFor: ["cattle", "buffalo"],
  },
  {
    name: "Groundnut Cake",
    category: "concentrate",
    nutritionPer100g: { protein: 45, energy: 80, fiber: 8 },
    cost: 50,
    availability: "Year-round",
    bestFor: ["cattle", "buffalo", "goat"],
  },
  {
    name: "Wheat Bran",
    category: "concentrate",
    nutritionPer100g: { protein: 14, energy: 65, fiber: 10 },
    cost: 20,
    availability: "Year-round",
    bestFor: ["cattle", "buffalo", "goat", "sheep"],
  },
  {
    name: "Maize Grain",
    category: "concentrate",
    nutritionPer100g: { protein: 9, energy: 85, fiber: 2.5 },
    cost: 25,
    availability: "Year-round",
    bestFor: ["cattle", "buffalo", "poultry"],
  },
  {
    name: "Soybean Meal",
    category: "concentrate",
    nutritionPer100g: { protein: 48, energy: 78, fiber: 6 },
    cost: 55,
    availability: "Year-round",
    bestFor: ["cattle", "buffalo", "poultry"],
  },
  {
    name: "Mineral Mixture",
    category: "supplement",
    nutritionPer100g: { protein: 0, energy: 0, fiber: 0 },
    cost: 80,
    availability: "Year-round",
    bestFor: ["cattle", "buffalo", "goat", "sheep", "poultry"],
  },
];

export const getRecommendationsForAnimal = (
  species: string,
  category: string
): NutritionRequirement | null => {
  return nutritionDatabase.find(
    (req) => req.species.toLowerCase() === species.toLowerCase() && req.category.toLowerCase() === category.toLowerCase()
  ) || nutritionDatabase.find((req) => req.species.toLowerCase() === species.toLowerCase() && req.category === "adult") || null;
};

export const getCurrentSeasonalAdvice = (): string => {
  const month = new Date().getMonth() + 1; // 1-12
  
  if (month >= 3 && month <= 5) {
    return "summer";
  } else if (month >= 6 && month <= 9) {
    return "monsoon";
  } else {
    return "winter";
  }
};

export const getSuitableFeedsForSpecies = (species: string): FeedType[] => {
  return commonFeeds.filter((feed) =>
    feed.bestFor.some((s) => s.toLowerCase() === species.toLowerCase())
  );
};

export const calculateDailyCost = (
  species: string,
  category: string
): { min: number; max: number } | null => {
  const requirements = getRecommendationsForAnimal(species, category);
  if (!requirements) return null;

  // Rough estimation based on common feed costs
  const greenFodderCost = parseFloat(requirements.dailyRequirements.greenFodder.split("-")[0]) * 2;
  const dryFodderCost = parseFloat(requirements.dailyRequirements.dryFodder.split("-")[0]) * 1;
  const concentrateCost = parseFloat(requirements.dailyRequirements.concentrate.split("-")[0].replace(/[^0-9.]/g, "")) * 30;

  const minCost = Math.floor(greenFodderCost + dryFodderCost + concentrateCost);
  const maxCost = Math.ceil(minCost * 1.5);

  return { min: minCost, max: maxCost };
};
