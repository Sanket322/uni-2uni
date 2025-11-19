/**
 * Push Notification Service
 * Integrates with Firebase Cloud Messaging (FCM) or Azure Notification Hub
 * 
 * Notification Types:
 * 1. Cyclone/Emergency Alerts
 * 2. Vaccination Reminders
 * 3. Training/Event Announcements
 * 4. Disease Outbreak Warnings
 */

export type NotificationType = 
  | 'emergency_alert'
  | 'vaccination_reminder'
  | 'training_event'
  | 'disease_outbreak'
  | 'weather_warning'
  | 'scheme_update';

export interface PushNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  data?: Record<string, any>;
  timestamp: string;
}

/**
 * Initialize push notification service
 * Request permission and register device token
 */
export const initializePushNotifications = async (): Promise<string | null> => {
  try {
    // Request notification permission
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // This will integrate with FCM/Azure Notification Hub
    // For now, return a mock token
    const deviceToken = await registerDeviceToken();
    
    // Send token to backend
    await saveDeviceToken(deviceToken);
    
    return deviceToken;
  } catch (error) {
    console.error('Failed to initialize push notifications:', error);
    return null;
  }
};

/**
 * Register device token with FCM/Azure
 */
const registerDeviceToken = async (): Promise<string> => {
  // This will integrate with FCM/Azure SDK
  // RF will provide configuration
  
  // Mock implementation
  return `device_token_${Date.now()}`;
};

/**
 * Save device token to backend
 */
const saveDeviceToken = async (token: string): Promise<void> => {
  try {
    await fetch('/api/rf/notifications/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('rf_auth_token')}`
      },
      body: JSON.stringify({
        device_token: token,
        platform: 'web'
      })
    });
  } catch (error) {
    console.error('Failed to save device token:', error);
  }
};

/**
 * Show local notification
 */
export const showNotification = (notification: PushNotification): void => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const options: NotificationOptions = {
      body: notification.body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: notification.id,
      data: notification.data,
      requireInteraction: notification.priority === 'critical'
    };

    const n = new Notification(notification.title, options);
    
    n.onclick = () => {
      window.focus();
      n.close();
      
      // Handle notification click based on type
      handleNotificationClick(notification);
    };
  }
};

/**
 * Handle notification click events
 */
const handleNotificationClick = (notification: PushNotification): void => {
  switch (notification.type) {
    case 'emergency_alert':
      window.location.href = '/emergency';
      break;
    case 'vaccination_reminder':
      window.location.href = '/vaccinations';
      break;
    case 'disease_outbreak':
      window.location.href = '/health-records';
      break;
    case 'training_event':
      window.location.href = '/content-library';
      break;
    case 'weather_warning':
      window.location.href = '/dashboard';
      break;
    case 'scheme_update':
      window.location.href = '/schemes';
      break;
  }
};

/**
 * Subscribe to notification topics
 */
export const subscribeToTopic = async (topic: string): Promise<void> => {
  try {
    await fetch('/api/rf/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('rf_auth_token')}`
      },
      body: JSON.stringify({ topic })
    });
  } catch (error) {
    console.error('Failed to subscribe to topic:', error);
  }
};

/**
 * Unsubscribe from notification topics
 */
export const unsubscribeFromTopic = async (topic: string): Promise<void> => {
  try {
    await fetch('/api/rf/notifications/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('rf_auth_token')}`
      },
      body: JSON.stringify({ topic })
    });
  } catch (error) {
    console.error('Failed to unsubscribe from topic:', error);
  }
};

/**
 * Get notification preferences
 */
export const getNotificationPreferences = async (): Promise<Record<NotificationType, boolean>> => {
  try {
    const response = await fetch('/api/rf/notifications/preferences', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('rf_auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch preferences');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get notification preferences:', error);
    // Return default preferences
    return {
      emergency_alert: true,
      vaccination_reminder: true,
      training_event: true,
      disease_outbreak: true,
      weather_warning: true,
      scheme_update: false
    };
  }
};

/**
 * Update notification preferences
 */
export const updateNotificationPreferences = async (
  preferences: Partial<Record<NotificationType, boolean>>
): Promise<void> => {
  try {
    await fetch('/api/rf/notifications/preferences', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('rf_auth_token')}`
      },
      body: JSON.stringify(preferences)
    });
  } catch (error) {
    console.error('Failed to update notification preferences:', error);
  }
};
