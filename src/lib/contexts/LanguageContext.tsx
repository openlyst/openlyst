'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { SupportedLanguage } from '@/lib/services/dataService';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/lib/services/dataService';
import enUI from '@/lib/data/i18n/ui/en.json';
import zhUI from '@/lib/data/i18n/ui/zh.json';
import ruUI from '@/lib/data/i18n/ui/ru.json';

export type { SupportedLanguage };
export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE };

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  zh: '中文',
  ru: 'Русский',
};

export const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  en: '🇬🇧',
  zh: '🇨🇳',
  ru: '🇷🇺',
};

type UITranslations = typeof enUI;
const uiTranslations: Record<SupportedLanguage, UITranslations> = {
  en: enUI as UITranslations,
  zh: zhUI as UITranslations,
  ru: ruUI as UITranslations,
};

function getInitialLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const stored = localStorage.getItem('language');
  if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
    return stored as SupportedLanguage;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang as SupportedLanguage)) {
    return urlLang as SupportedLanguage;
  }
  const browserLang = navigator.language.split('-')[0];
  if (SUPPORTED_LANGUAGES.includes(browserLang as SupportedLanguage)) {
    return browserLang as SupportedLanguage;
  }
  return DEFAULT_LANGUAGE;
}

type LanguageContextValue = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: UITranslations;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const lang = getInitialLanguage();
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url.toString());
    }
    setLanguageState(lang);
  }, []);

  const t = uiTranslations[language] ?? uiTranslations[DEFAULT_LANGUAGE];
  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
