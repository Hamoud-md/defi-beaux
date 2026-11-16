import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_LOCALE,
  Locale,
  LOCALE_CONFIGS,
  LocaleConfig,
  translations,
} from './translations';

const LOCALE_STORAGE_KEY = 'memoria_echo_detective_locale_v1';

interface I18nContextValue {
  locale: Locale;
  config: LocaleConfig;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
  isRtl: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function detectInitialLocale(): Locale {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved && saved in LOCALE_CONFIGS) {
      return saved as Locale;
    }
  } catch {
    // storage unavailable
  }
  return DEFAULT_LOCALE;
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale);

  const config = LOCALE_CONFIGS[locale];

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    } catch {
      // ignore
    }
  }, []);

  // Update <html> dir and lang attributes
  useEffect(() => {
    document.documentElement.setAttribute('dir', config.dir);
    document.documentElement.setAttribute('lang', locale);
  }, [locale, config.dir]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let text = translations[locale][key] ?? translations[DEFAULT_LOCALE][key] ?? key;
      if (params) {
        for (const [pKey, pVal] of Object.entries(params)) {
          text = text.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
        }
      }
      return text;
    },
    [locale]
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      config,
      setLocale,
      t,
      dir: config.dir,
      isRtl: config.dir === 'rtl',
    }),
    [locale, config, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}

export { LOCALE_CONFIGS };
export type { Locale };
