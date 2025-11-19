/**
 * Translation Service for RF Multi-language Support
 * Integrates with Reliance Foundation Translation API
 * 
 * Supported Languages:
 * 1. English (en)
 * 2. Hindi (hi)
 * 3. Bengali (bn)
 * 4. Telugu (te)
 * 5. Marathi (mr)
 * 6. Tamil (ta)
 * 7. Gujarati (gu)
 * 8. Kannada (kn)
 * 9. Malayalam (ml)
 * 10. Punjabi (pa)
 * 11. Odia (or)
 */

export const SUPPORTED_LANGUAGES = {
  en: { code: 'en', name: 'English', nativeName: 'English' },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  bn: { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  te: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  mr: { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  gu: { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  kn: { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  ml: { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  pa: { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  or: { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' }
};

interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence?: number;
}

/**
 * Translates content using RF Translation API
 * RF backend handles translation and corrections
 */
export const translateContent = async ({
  text,
  targetLanguage,
  sourceLanguage = 'en'
}: TranslationRequest): Promise<TranslationResponse> => {
  try {
    // This will integrate with RF Translation API
    // RF provides endpoint: /api/rf/translate
    
    const response = await fetch('/api/rf/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('rf_auth_token')}`
      },
      body: JSON.stringify({
        text,
        target: targetLanguage,
        source: sourceLanguage
      })
    });

    if (!response.ok) {
      throw new Error('Translation request failed');
    }

    const data = await response.json();
    
    return {
      translatedText: data.translated_text,
      sourceLanguage: data.source_language,
      targetLanguage: data.target_language,
      confidence: data.confidence
    };
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback: return original text if translation fails
    return {
      translatedText: text,
      sourceLanguage,
      targetLanguage,
      confidence: 0
    };
  }
};

/**
 * Batch translation for multiple texts
 */
export const translateBatch = async (
  texts: string[],
  targetLanguage: string,
  sourceLanguage = 'en'
): Promise<TranslationResponse[]> => {
  try {
    const response = await fetch('/api/rf/translate/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('rf_auth_token')}`
      },
      body: JSON.stringify({
        texts,
        target: targetLanguage,
        source: sourceLanguage
      })
    });

    if (!response.ok) {
      throw new Error('Batch translation request failed');
    }

    const data = await response.json();
    return data.translations;
  } catch (error) {
    console.error('Batch translation error:', error);
    // Fallback: return original texts
    return texts.map(text => ({
      translatedText: text,
      sourceLanguage,
      targetLanguage,
      confidence: 0
    }));
  }
};

/**
 * Get preferred language from user profile
 */
export const getUserLanguage = (): string => {
  return localStorage.getItem('preferred_language') || 'en';
};

/**
 * Set user's preferred language
 */
export const setUserLanguage = (languageCode: string): void => {
  if (SUPPORTED_LANGUAGES[languageCode as keyof typeof SUPPORTED_LANGUAGES]) {
    localStorage.setItem('preferred_language', languageCode);
  }
};

/**
 * Detect language from text (uses RF API)
 */
export const detectLanguage = async (text: string): Promise<string> => {
  try {
    const response = await fetch('/api/rf/translate/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('rf_auth_token')}`
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error('Language detection failed');
    }

    const data = await response.json();
    return data.detected_language;
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en'; // Default to English
  }
};
