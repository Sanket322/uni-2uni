/**
 * Demo Data Generators for Weather, Disease Alerts, and Notifications
 * These generators create realistic mock data for testing UI before RF API integration
 */

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: string;
  alerts: string[];
  advisory: string;
}

interface DiseaseAlert {
  id: string;
  disease: string;
  species: string;
  severity: "low" | "medium" | "high" | "critical";
  location: string;
  reportedCases: number;
  date: string;
  prediction: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "weather" | "disease" | "vaccination" | "marketplace" | "health" | "system";
  priority: "low" | "medium" | "high" | "critical";
  timestamp: string;
  isRead: boolean;
}

// Weather conditions pool
const weatherConditions = [
  { condition: "Sunny", temp: [25, 35], humidity: [40, 60] },
  { condition: "Partly Cloudy", temp: [22, 32], humidity: [50, 70] },
  { condition: "Cloudy", temp: [20, 28], humidity: [60, 80] },
  { condition: "Rainy", temp: [18, 25], humidity: [75, 95] },
  { condition: "Stormy", temp: [15, 22], humidity: [85, 98] },
];

const weatherAlerts = [
  "Heavy Rain Warning - Next 48 hours",
  "Heat Wave Alert - Take precautions",
  "Strong Wind Warning - Secure shelters",
  "Thunderstorm Alert - Move animals to covered areas",
  "Cold Wave Warning - Ensure warmth for young animals",
];

const livestockAdvisories = [
  "Move cattle to covered area. Ensure adequate ventilation and dry bedding.",
  "Provide extra water and shade. Monitor for heat stress symptoms.",
  "Secure all loose equipment. Ensure animals have access to sturdy shelters.",
  "Keep animals indoors. Ensure feed stocks are protected from moisture.",
  "Provide extra bedding and warmth. Monitor newborns and young animals closely.",
  "Maintain good air circulation. Check water supply hasn't frozen.",
];

// Disease data pool
const diseases = [
  { name: "Foot and Mouth Disease", species: ["Cattle", "Buffalo", "Goat", "Sheep"], severity: ["high", "critical"] },
  { name: "Lumpy Skin Disease", species: ["Cattle", "Buffalo"], severity: ["medium", "high"] },
  { name: "Brucellosis", species: ["Cattle", "Buffalo", "Goat"], severity: ["medium", "high"] },
  { name: "Peste des Petits Ruminants", species: ["Goat", "Sheep"], severity: ["high", "critical"] },
  { name: "Avian Influenza", species: ["Poultry"], severity: ["critical"] },
  { name: "Black Quarter", species: ["Cattle", "Buffalo"], severity: ["high", "critical"] },
  { name: "Mastitis", species: ["Cattle", "Buffalo"], severity: ["medium"] },
  { name: "Anthrax", species: ["Cattle", "Buffalo", "Sheep", "Goat"], severity: ["critical"] },
];

const locations = [
  "Maharashtra - Pune District",
  "Maharashtra - Nagpur District",
  "Maharashtra - Ahmednagar District",
  "Maharashtra - Nashik District",
  "Maharashtra - Satara District",
  "Gujarat - Ahmedabad District",
  "Rajasthan - Jaipur District",
  "Punjab - Ludhiana District",
];

const predictions = [
  "High risk in your area. Vaccination recommended immediately.",
  "Moderate risk. Monitor animals closely for symptoms.",
  "Low risk currently. Continue regular health checks.",
  "Spreading pattern detected. Implement biosecurity measures.",
  "Declining trend. Maintain current preventive measures.",
  "Seasonal outbreak expected. Prepare vaccination schedule.",
];

// Notification templates
const notificationTemplates = {
  weather: [
    { title: "Weather Alert", message: "Heavy rainfall expected tomorrow. Secure your livestock shelters." },
    { title: "Heat Wave Warning", message: "Temperatures above 40°C expected. Ensure adequate water supply." },
    { title: "Storm Warning", message: "Severe thunderstorm alert for your region. Take necessary precautions." },
  ],
  disease: [
    { title: "Disease Alert", message: "Foot and Mouth Disease cases reported in nearby district." },
    { title: "Health Advisory", message: "Lumpy Skin Disease outbreak detected. Check vaccination status." },
    { title: "Disease Update", message: "Avian Influenza cases declining in your region." },
  ],
  vaccination: [
    { title: "Vaccination Due", message: "Your cattle 'Ganga' needs vaccination in 3 days." },
    { title: "Vaccination Reminder", message: "5 animals due for vaccination this week." },
    { title: "Vaccination Campaign", message: "Free vaccination camp in your village on Friday." },
  ],
  marketplace: [
    { title: "New Inquiry", message: "Someone is interested in your livestock listing." },
    { title: "Listing Approved", message: "Your marketplace listing has been approved and is now live." },
    { title: "Price Update", message: "Similar listings in your area are priced 10% higher." },
  ],
  health: [
    { title: "Health Check Due", message: "Time for routine health check-up of your animals." },
    { title: "Treatment Reminder", message: "Continue medication for 'Lakshmi' for 2 more days." },
    { title: "Health Report", message: "Lab results for your animal are now available." },
  ],
  system: [
    { title: "New Feature", message: "AI Pashu Doctor chatbot is now available!" },
    { title: "System Update", message: "New disease surveillance features added to dashboard." },
    { title: "Scheme Alert", message: "New government scheme available for dairy farmers." },
  ],
};

/**
 * Generate realistic weather data
 */
export const generateWeatherData = (location?: { latitude?: number; longitude?: number }): WeatherData => {
  const selectedWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
  const hasAlert = Math.random() > 0.6; // 40% chance of weather alert
  
  const temperature = Math.floor(
    Math.random() * (selectedWeather.temp[1] - selectedWeather.temp[0]) + selectedWeather.temp[0]
  );
  
  const humidity = Math.floor(
    Math.random() * (selectedWeather.humidity[1] - selectedWeather.humidity[0]) + selectedWeather.humidity[0]
  );

  const windSpeed = Math.floor(Math.random() * 25) + 5;

  const forecastOptions = [
    `Expect ${selectedWeather.condition.toLowerCase()} conditions throughout the day.`,
    `${selectedWeather.condition} in the morning, clearing by afternoon.`,
    `${selectedWeather.condition} conditions expected. ${hasAlert ? 'Monitor weather updates regularly.' : ''}`,
  ];

  return {
    temperature,
    condition: selectedWeather.condition,
    humidity,
    windSpeed,
    forecast: forecastOptions[Math.floor(Math.random() * forecastOptions.length)],
    alerts: hasAlert ? [weatherAlerts[Math.floor(Math.random() * weatherAlerts.length)]] : [],
    advisory: livestockAdvisories[Math.floor(Math.random() * livestockAdvisories.length)],
  };
};

/**
 * Generate realistic disease alerts
 */
export const generateDiseaseAlerts = (count: number = 2): DiseaseAlert[] => {
  const alerts: DiseaseAlert[] = [];
  const usedDiseases = new Set<string>();

  for (let i = 0; i < count && i < diseases.length; i++) {
    let disease;
    do {
      disease = diseases[Math.floor(Math.random() * diseases.length)];
    } while (usedDiseases.has(disease.name));
    
    usedDiseases.add(disease.name);

    const severity = disease.severity[Math.floor(Math.random() * disease.severity.length)] as "low" | "medium" | "high" | "critical";
    const reportedCases = severity === "critical" ? Math.floor(Math.random() * 50) + 40 :
                          severity === "high" ? Math.floor(Math.random() * 40) + 20 :
                          severity === "medium" ? Math.floor(Math.random() * 25) + 10 :
                          Math.floor(Math.random() * 15) + 5;

    alerts.push({
      id: `disease-${Date.now()}-${i}`,
      disease: disease.name,
      species: disease.species.join(", "),
      severity,
      location: locations[Math.floor(Math.random() * locations.length)],
      reportedCases,
      date: new Date().toISOString(),
      prediction: predictions[Math.floor(Math.random() * predictions.length)],
    });
  }

  return alerts.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
};

/**
 * Generate realistic notifications
 */
export const generateNotifications = (count: number = 10): Notification[] => {
  const notifications: Notification[] = [];
  const types: Array<keyof typeof notificationTemplates> = ["weather", "disease", "vaccination", "marketplace", "health", "system"];
  const priorities: Array<"low" | "medium" | "high" | "critical"> = ["low", "medium", "high", "critical"];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const template = notificationTemplates[type][Math.floor(Math.random() * notificationTemplates[type].length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    // Generate timestamps going back in time
    const hoursAgo = Math.floor(Math.random() * 72); // Up to 3 days ago
    const timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();

    notifications.push({
      id: `notification-${Date.now()}-${i}`,
      title: template.title,
      message: template.message,
      type,
      priority,
      timestamp,
      isRead: Math.random() > 0.4, // 60% chance of being read
    });
  }

  return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

/**
 * Generate a single random notification (useful for real-time testing)
 */
export const generateSingleNotification = (): Notification => {
  return generateNotifications(1)[0];
};

/**
 * Simulate real-time weather updates
 */
export const simulateWeatherUpdate = (currentWeather: WeatherData): WeatherData => {
  return {
    ...currentWeather,
    temperature: currentWeather.temperature + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3),
    humidity: Math.max(20, Math.min(100, currentWeather.humidity + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5))),
    windSpeed: Math.max(0, currentWeather.windSpeed + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3)),
  };
};

/**
 * Generate demo emergency contacts
 */
export const generateEmergencyContacts = () => {
  return [
    {
      id: "default-1",
      contact_name: "RF WhatsApp Chatbot",
      contact_number: "+91-1234567890",
      relationship: "AI Support",
      is_default: true,
    },
    {
      id: "default-2",
      contact_name: "RF IVRS - Content Support",
      contact_number: "+91-0987654321",
      relationship: "Content Helpline",
      is_default: true,
    },
    {
      id: "default-3",
      contact_name: "RF IVRS - Feedback",
      contact_number: "+91-1122334455",
      relationship: "Feedback Line",
      is_default: true,
    },
  ];
};

/**
 * Seed demo notifications into database (for testing)
 * Call this from your app to populate the notifications table
 */
export const seedDemoNotifications = async (userId: string, supabaseClient: any) => {
  const demoNotifications = generateNotifications(15);
  
  const notificationsToInsert = demoNotifications.map(notification => ({
    user_id: userId,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    priority: notification.priority,
    is_read: notification.isRead,
    created_at: notification.timestamp,
  }));

  const { data, error } = await supabaseClient
    .from('notifications')
    .insert(notificationsToInsert);

  if (error) {
    console.error('Error seeding notifications:', error);
    return { success: false, error };
  }

  return { success: true, data };
};
