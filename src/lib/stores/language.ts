import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import enUI from '$lib/data/i18n/ui/en.json';
import zhUI from '$lib/data/i18n/ui/zh.json';
import ruUI from '$lib/data/i18n/ui/ru.json';

export type SupportedLanguage = 'en' | 'zh' | 'ru';
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'zh', 'ru'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
	en: 'English',
	zh: '中文',
	ru: 'Русский'
};

export const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
	en: '🇬🇧',
	zh: '🇨🇳',
	ru: '🇷🇺'
};

// UI translations
const uiTranslations: Record<SupportedLanguage, typeof enUI> = {
	en: enUI,
	zh: zhUI,
	ru: ruUI
};

// Helper to get initial language
function getInitialLanguage(): SupportedLanguage {
	if (browser) {
		// Check localStorage first
		const stored = localStorage.getItem('language');
		if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
			return stored as SupportedLanguage;
		}
		
		// Check URL parameter
		const urlParams = new URLSearchParams(window.location.search);
		const urlLang = urlParams.get('lang');
		if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang as SupportedLanguage)) {
			return urlLang as SupportedLanguage;
		}
		
		// Check browser language
		const browserLang = navigator.language.split('-')[0];
		if (SUPPORTED_LANGUAGES.includes(browserLang as SupportedLanguage)) {
			return browserLang as SupportedLanguage;
		}
	}
	return DEFAULT_LANGUAGE;
}

// Create the language store
function createLanguageStore() {
	// Always start with SSR-safe default to avoid hydration mismatches.
	// We detect browser preference after mount via initialize().
	const { subscribe, set: internalSet } = writable<SupportedLanguage>(DEFAULT_LANGUAGE);
	
	return {
		subscribe,
		set: (lang: SupportedLanguage) => {
			if (browser) {
				localStorage.setItem('language', lang);
				// Update URL without reload
				const url = new URL(window.location.href);
				url.searchParams.set('lang', lang);
				window.history.replaceState({}, '', url.toString());
			}
			internalSet(lang);
		},
		initialize: () => {
			if (browser) {
				const lang = getInitialLanguage();
				internalSet(lang);
				localStorage.setItem('language', lang);
			}
		}
	};
}

export const language = createLanguageStore();

// Derived store for UI translations
export const t = derived(language, ($language) => {
	return uiTranslations[$language] || uiTranslations[DEFAULT_LANGUAGE];
});

// Helper function to get nested translation
export function getTranslation(translations: typeof enUI, key: string): string {
	const keys = key.split('.');
	let value: unknown = translations;
	
	for (const k of keys) {
		if (value && typeof value === 'object' && k in value) {
			value = (value as Record<string, unknown>)[k];
		} else {
			return key; // Return key if translation not found
		}
	}
	
	return typeof value === 'string' ? value : key;
}

// Convenience function to get current language
export function getCurrentLanguage(): SupportedLanguage {
	return get(language);
}
