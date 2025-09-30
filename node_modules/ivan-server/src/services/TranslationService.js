import axios from 'axios';
import { Translate } from '@google-cloud/translate/build/src/v2/index.js';
import redisClient from '../config/redis.js';

class TranslationService {
  constructor() {
    this.googleTranslate = new Translate({
      key: process.env.GOOGLE_TRANSLATE_API_KEY,
    });
    this.supportedLanguages = null;
    this.loadSupportedLanguages();
  }

  async loadSupportedLanguages() {
    try {
      const [languages] = await this.googleTranslate.getLanguages();
      this.supportedLanguages = languages;
    } catch (error) {
      console.error('Failed to load supported languages:', error);
      // Fallback to common languages
      this.supportedLanguages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'zh', name: 'Chinese' },
        { code: 'ru', name: 'Russian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ar', name: 'Arabic' },
      ];
    }
  }

  async translateMessage(text, targetLanguages = ['es', 'fr', 'de', 'ja']) {
    const translations = new Map();
    
    for (const lang of targetLanguages) {
      try {
        const cacheKey = `translation:${Buffer.from(text).toString('base64').substring(0, 32)}:${lang}`;
        
        // Check cache
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          translations.set(lang, cached);
          continue;
        }

        // Translate
        const [translation] = await this.googleTranslate.translate(text, lang);
        translations.set(lang, translation);
        
        // Cache for 24 hours
        await redisClient.set(cacheKey, translation, 86400);
      } catch (error) {
        console.error(`Translation to ${lang} failed:`, error);
      }
    }
    
    return translations;
  }

  async detectLanguage(text) {
    try {
      const [detection] = await this.googleTranslate.detect(text);
      return detection.language;
    } catch (error) {
      console.error('Language detection failed:', error);
      return 'en'; // Default to English
    }
  }

  async translateBatch(texts, targetLanguage) {
    try {
      const [translations] = await this.googleTranslate.translate(texts, targetLanguage);
      return Array.isArray(translations) ? translations : [translations];
    } catch (error) {
      console.error('Batch translation failed:', error);
      return texts; // Return original texts on failure
    }
  }

  isLanguageSupported(languageCode) {
    if (!this.supportedLanguages) return false;
    return this.supportedLanguages.some(lang => lang.code === languageCode);
  }

  async autoTranslate(text, userLanguage) {
    // Detect source language
    const sourceLanguage = await this.detectLanguage(text);
    
    // Don't translate if same language
    if (sourceLanguage === userLanguage) {
      return { original: text, translated: null };
    }

    // Translate to user's language
    const [translation] = await this.googleTranslate.translate(text, userLanguage);
    
    return {
      original: text,
      translated: translation,
      sourceLanguage,
      targetLanguage: userLanguage,
    };
  }
}

export default new TranslationService();
export { TranslationService };

// Convenience function
export const translateMessage = (text, languages) => 
  new TranslationService().translateMessage(text, languages);