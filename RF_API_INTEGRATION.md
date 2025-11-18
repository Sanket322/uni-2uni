# Reliance Foundation API Integration Guide

## Overview
This document outlines the API integration points provided by Reliance Foundation (RF) for the Animal Information System (AIS).

## Authentication & OTP Services

### OTP Flow
- **New Users**: OTP mandatory for registration
- **Existing Users**: Password + OTP authentication
- **Unique Identifier**: Mobile number
- **Service Provider**: RF will provide OTP APIs, DLT templates, and credits

### Implementation Notes
```typescript
// Example OTP request (RF will provide actual endpoint)
const sendOTP = async (mobileNumber: string) => {
  const response = await fetch('/api/rf/otp/send', {
    method: 'POST',
    body: JSON.stringify({ mobile: mobileNumber })
  });
  return response.json();
};

const verifyOTP = async (mobileNumber: string, otp: string) => {
  const response = await fetch('/api/rf/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ mobile: mobileNumber, otp })
  });
  return response.json();
};
```

## Translation API

### Supported Languages
1. English (en)
2. Hindi (hi)
3. Bengali (bn)
4. Telugu (te)
5. Marathi (mr)
6. Tamil (ta)
7. Gujarati (gu)
8. Kannada (kn)
9. Malayalam (ml)
10. Punjabi (pa)
11. Odia (or)

### Usage
```typescript
// RF provides Translation API
// Incorrect translations will be corrected by RF in backend
const translateContent = async (text: string, targetLanguage: string) => {
  const response = await fetch('/api/rf/translate', {
    method: 'POST',
    body: JSON.stringify({ text, target: targetLanguage })
  });
  return response.json();
};
```

## Emergency Contacts

### Default Contacts
1. WhatsApp Chatbot Number - Provided by RF
2. IVRS Content Number - Provided by RF
3. IVRS Feedback Number - Provided by RF

### Dynamic Contacts
- RF can add more emergency numbers anytime
- Government helpline numbers displayed based on state/district
- Implementation: Click-to-dial and Click-to-chat functionality

```typescript
// Example WhatsApp integration
const openWhatsApp = (phoneNumber: string, message?: string) => {
  const url = `https://wa.me/${phoneNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
  window.open(url, '_blank');
};

// Example dialer integration
const openDialer = (phoneNumber: string) => {
  window.location.href = `tel:${phoneNumber}`;
};
```

## Push Notifications

### Platforms
- Firebase Cloud Messaging (FCM) or Azure Notification Hub
- RF will handle future billing if needed

### Alert Types
1. Cyclone/Emergency Alerts
2. Vaccination Reminders
3. Training/Event Announcements
4. Disease Outbreak Warnings

**Note**: Auto-alerts only for important events, NOT for new content updates.

## Content Management System (CMS) API

### Content Hierarchy
```
State → District → Category → Subcategory → Thematic → Content Type → Content
```

### Content Types Provided by RF
1. Weather Data & Forecasts
2. Seasonal Advisories
3. Government Schemes
4. Training Videos
5. Text-to-Speech (TTS) Content
6. Disease Information
7. Feeding Guidelines
8. Shelter Recommendations

### API Structure
```typescript
interface ContentRequest {
  state: string;
  district?: string;
  category: string;
  subcategory?: string;
  language: string;
}

const fetchContent = async (params: ContentRequest) => {
  const response = await fetch('/api/rf/cms/content', {
    method: 'POST',
    body: JSON.stringify(params)
  });
  return response.json();
};
```

## Weather API

### Features
- Real-time weather data
- Weather-based advisories
- Seasonal forecasts
- Disaster alerts

```typescript
const getWeatherData = async (latitude: number, longitude: number) => {
  const response = await fetch('/api/rf/weather', {
    method: 'POST',
    body: JSON.stringify({ lat: latitude, lon: longitude })
  });
  return response.json();
};
```

## Media Storage

### Storage Location
- All media (images/videos) stored on RF Azure servers
- No external storage services required
- RF provides upload/download endpoints

```typescript
const uploadMedia = async (file: File, type: 'image' | 'video') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  const response = await fetch('/api/rf/media/upload', {
    method: 'POST',
    body: formData
  });
  return response.json();
};
```

## Animal ID Generation

### Process
1. App collects animal details from livestock owner
2. Send data to RF backend
3. RF backend generates unique Animal ID
4. Return ID to app for display

```typescript
interface AnimalData {
  species: string;
  breed: string;
  gender: string;
  dateOfBirth: string;
  ownerId: string;
  location: string;
}

const generateAnimalId = async (data: AnimalData) => {
  const response = await fetch('/api/rf/animal/generate-id', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.json();
};
```

## Disease Surveillance API

### Features
- National Animal Disease Reporting System (NADRES v2) integration
- ICAR-NIVEDI data access
- Geo-tagged disease tracking
- Predictive analytics based on historical data

### Prediction Parameters
- Disease type
- Animal species
- Month/Season
- Geographic location (State/District)
- Historical outbreak patterns

```typescript
interface DiseasePrediction {
  state: string;
  district?: string;
  species?: string;
  month?: number;
}

const getDiseasePrediction = async (params: DiseasePrediction) => {
  const response = await fetch('/api/rf/disease/prediction', {
    method: 'POST',
    body: JSON.stringify(params)
  });
  return response.json();
};
```

## Government Schemes API

### Data Source
- RF provides CMS APIs for scheme data
- Some schemes may have direct government URLs
- Scheme application workflow in Phase-2

```typescript
const getGovernmentSchemes = async (state: string, district?: string) => {
  const response = await fetch('/api/rf/schemes', {
    method: 'POST',
    body: JSON.stringify({ state, district })
  });
  return response.json();
};
```

## AI Features (Current Phase)

### Capabilities
- Text-based health diagnosis
- Symptom analysis
- Treatment suggestions based on stored content
- Expert review integration

### Future Phase (Next Financial Year)
- Image-based disease detection
- Video analysis for health monitoring
- Advanced AI model training

```typescript
interface AIHealthQuery {
  animalId: string;
  symptoms: string[];
  additionalInfo?: string;
  images?: string[]; // URLs to uploaded images
  videos?: string[]; // URLs to uploaded videos
}

const getAIDiagnosis = async (query: AIHealthQuery) => {
  const response = await fetch('/api/rf/ai/diagnosis', {
    method: 'POST',
    body: JSON.stringify(query)
  });
  return response.json();
};
```

## Performance Requirements

### Metrics
- **Scalability**: Support 2M active users concurrently
- **Load Time**: All screens ≤ 3 seconds
- **Uptime**: 99.5% availability
- **Platform**: Android 9+ support
- **Devices**: All major brands and tablets

## Security & Compliance

### Standards
- Follow Reliance Foundation IRM (Information Risk Management) guidelines
- Azure server hosting (RF provided)
- Encrypted data transmission
- Automatic backups
- Audit logs for critical operations

### Data Protection
```typescript
// All API calls should include authentication headers
const rfApiCall = async (endpoint: string, data: any) => {
  const token = await getAuthToken();
  const response = await fetch(`/api/rf/${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-API-Version': '1.0'
    },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

## Deployment & Testing

### UAT Process
1. Vendor internal testing
2. RF manual testing team review
3. Final UAT with stakeholders
4. Post-release issues treated as technical fixes (not new requirements)

### App Store Deployment
- RF provides Play Store account
- RF provides Apple Store account (future)
- Vendor prepares release builds
- RF manages store listings

## Integration Checklist

- [ ] OTP API integration for authentication
- [ ] Translation API for 11 languages
- [ ] WhatsApp & IVRS click-to-dial/chat
- [ ] Push notification service (FCM/Azure)
- [ ] CMS API for content delivery
- [ ] Weather API integration
- [ ] Media upload to RF Azure
- [ ] Animal ID generation API
- [ ] Disease surveillance/prediction API
- [ ] Government schemes API
- [ ] AI diagnosis API (text-based)
- [ ] Emergency contacts integration
- [ ] Geo-tagging for disease reports

## Contact & Support

For API documentation, credentials, and technical support:
- Contact: Reliance Foundation Technical Team
- All API endpoints will be provided during development phase
- Test credentials and sandbox environment will be shared
- Production credentials post-UAT approval

---

**Note**: This document will be updated as RF provides actual API endpoints, credentials, and detailed specifications during the development phase.
