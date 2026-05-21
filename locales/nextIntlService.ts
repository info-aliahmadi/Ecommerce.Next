'use client';

import CONFIG from '../config';

class NextIntlService {

  /**
   * Set the current language for next-intl (uses NEXT_LOCALE cookie)
   * @param newLocale - The language code to set (e.g., 'en', 'fa', 'ar')
   */
  setNextIntlLocale(newLocale: string): void {
    if (typeof document !== 'undefined') {
      // Set the cookie that next-intl expects
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
  }

  /**
   * Get the current next-intl locale from cookie
   * @returns The current locale or default language if not found
   */
  getNextIntlLocale(): string {
    if (typeof document !== 'undefined') {
      const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1];
      
      return cookieValue || CONFIG.DEFAULT_LANGUAGE;
    }
    
    return CONFIG.DEFAULT_LANGUAGE;
  }
}

// Export a singleton instance
const nextIntlService = new NextIntlService();
export default nextIntlService;

// Also export the class for custom instances if needed
export { NextIntlService };
