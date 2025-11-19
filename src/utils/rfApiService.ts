/**
 * Reliance Foundation API Service
 * Centralized API integration for all RF backend services
 */

const RF_API_BASE = '/api/rf'; // Will be configured with actual RF endpoint

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Get authentication token
 */
const getAuthToken = (): string => {
  return localStorage.getItem('rf_auth_token') || '';
};

/**
 * Generic RF API call wrapper
 */
const rfApiCall = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<ApiResponse<T>> => {
  try {
    const token = getAuthToken();
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-API-Version': '1.0'
      }
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${RF_API_BASE}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'API request failed'
      };
    }

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('RF API Error:', error);
    return {
      success: false,
      error: 'Network error or server unavailable'
    };
  }
};

/**
 * Weather API Services
 */
export const weatherApi = {
  getCurrentWeather: async (lat: number, lon: number) => {
    return rfApiCall('/weather', 'POST', { lat, lon });
  },
  
  getForecast: async (lat: number, lon: number, days: number = 7) => {
    return rfApiCall('/weather/forecast', 'POST', { lat, lon, days });
  },
  
  getWeatherAlerts: async (state: string, district?: string) => {
    return rfApiCall('/weather/alerts', 'POST', { state, district });
  }
};

/**
 * Disease Surveillance API Services
 */
export const diseaseApi = {
  getPredictions: async (params: {
    state: string;
    district?: string;
    species?: string;
    month?: number;
  }) => {
    return rfApiCall('/disease/prediction', 'POST', params);
  },
  
  getActiveOutbreaks: async (state: string, district?: string) => {
    return rfApiCall('/disease/outbreaks', 'POST', { state, district });
  },
  
  reportDisease: async (data: {
    animalId: string;
    disease: string;
    symptoms: string[];
    location: { lat: number; lon: number };
  }) => {
    return rfApiCall('/disease/report', 'POST', data);
  }
};

/**
 * Animal ID Generation API
 */
export const animalIdApi = {
  generateId: async (data: {
    species: string;
    breed: string;
    gender: string;
    dateOfBirth: string;
    ownerId: string;
    location: string;
  }) => {
    return rfApiCall('/animal/generate-id', 'POST', data);
  },
  
  validateId: async (animalId: string) => {
    return rfApiCall('/animal/validate-id', 'POST', { animalId });
  }
};

/**
 * Media Upload API
 */
export const mediaApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');
    
    const token = getAuthToken();
    const response = await fetch(`${RF_API_BASE}/media/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    return response.json();
  },
  
  uploadVideo: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'video');
    
    const token = getAuthToken();
    const response = await fetch(`${RF_API_BASE}/media/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    return response.json();
  }
};

/**
 * CMS Content API
 */
export const cmsApi = {
  getContent: async (params: {
    state: string;
    district?: string;
    category: string;
    subcategory?: string;
    language: string;
  }) => {
    return rfApiCall('/cms/content', 'POST', params);
  },
  
  searchContent: async (query: string, language: string) => {
    return rfApiCall('/cms/search', 'POST', { query, language });
  }
};

/**
 * Government Schemes API
 */
export const schemesApi = {
  getSchemes: async (state: string, district?: string) => {
    return rfApiCall('/schemes', 'POST', { state, district });
  },
  
  getSchemeDetails: async (schemeId: string) => {
    return rfApiCall(`/schemes/${schemeId}`, 'GET');
  }
};

/**
 * AI Diagnosis API
 */
export const aiApi = {
  getDiagnosis: async (data: {
    animalId: string;
    symptoms: string[];
    additionalInfo?: string;
    images?: string[];
    videos?: string[];
  }) => {
    return rfApiCall('/ai/diagnosis', 'POST', data);
  },
  
  analyzeImage: async (imageUrl: string, animalId: string) => {
    return rfApiCall('/ai/analyze-image', 'POST', { imageUrl, animalId });
  }
};

/**
 * OTP Services
 */
export const otpApi = {
  sendOTP: async (mobile: string) => {
    return rfApiCall('/otp/send', 'POST', { mobile });
  },
  
  verifyOTP: async (mobile: string, otp: string) => {
    return rfApiCall('/otp/verify', 'POST', { mobile, otp });
  }
};

export default {
  weatherApi,
  diseaseApi,
  animalIdApi,
  mediaApi,
  cmsApi,
  schemesApi,
  aiApi,
  otpApi
};
