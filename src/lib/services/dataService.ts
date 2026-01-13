/**
 * Data Service for OpenLyst
 * 
 * This service handles loading app data from individual JSON files
 * and provides i18n (internationalization) support for multiple languages.
 * 
 * Supported languages: English (en), Chinese (zh), Russian (ru)
 */

import type { App, NewsItem, RepoConfig, AppVersion, PlatformDownloads } from '$lib/types/repo';

// Supported languages
export type SupportedLanguage = 'en' | 'zh' | 'ru';
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'zh', 'ru'];

// Types for localized content
export interface LocalizedString {
  en: string;
  zh?: string;
  ru?: string;
  [key: string]: string | undefined;
}

export interface LocalizedAppData {
  bundleIdentifier: string;
  name: LocalizedString;
  subtitle: LocalizedString;
  localizedDescription: LocalizedString;
  iconURL: string;
  tintColor: string;
  platforms: string[];
  screenshots: string[];
  deprecated?: boolean;
  versions: LocalizedAppVersion[];
}

export interface LocalizedAppVersion {
  version: string;
  date?: string;
  sourceCode?: string;
  platforms?: string[];
  platformInstall: Record<string, string>;
  downloads: Record<string, unknown>;
  localizedDescription: LocalizedString;
}

export interface LocalizedNewsItem {
  identifier: string;
  title: LocalizedString;
  caption: LocalizedString;
  date: string;
  tintColor: string;
  imageURL?: string;
  notify: boolean;
  url?: string;
  appID?: string;
}

export interface LocalizedConfig {
  name: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  iconURL: string;
  headerURL?: string;
  website: string;
  tintColor: string;
  featuredApps: string[];
  supportedLanguages: string[];
  defaultLanguage: string;
}

export interface I18nStrings {
  common: Record<string, string>;
  platforms: Record<string, string>;
  installMethods: Record<string, string>;
  api: Record<string, string>;
}

const BASE_URL = 'https://openlyst.ink';

// Cache for loaded data
let cachedConfig: LocalizedConfig | null = null;
let cachedApps: Map<string, LocalizedAppData> = new Map();
let cachedNews: LocalizedNewsItem[] | null = null;
let cachedI18n: Map<SupportedLanguage, I18nStrings> = new Map();

/**
 * Get localized string value based on language preference
 */
export function getLocalizedValue(
  localizedString: LocalizedString | string | undefined,
  lang: SupportedLanguage = DEFAULT_LANGUAGE
): string {
  if (!localizedString) return '';
  if (typeof localizedString === 'string') return localizedString;
  
  // Try requested language, fall back to English, then any available
  return localizedString[lang] || localizedString.en || Object.values(localizedString).find(v => v) || '';
}

/**
 * Validate and normalize language code
 */
export function normalizeLanguage(lang?: string | null): SupportedLanguage {
  if (!lang) return DEFAULT_LANGUAGE;
  const normalized = lang.toLowerCase().substring(0, 2) as SupportedLanguage;
  return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : DEFAULT_LANGUAGE;
}

/**
 * Resolve relative URLs to absolute URLs
 */
export function resolveUrl(path: string): string {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  if (path.startsWith('/')) {
    return `${BASE_URL}${path}`;
  }
  return path;
}

/**
 * Recursively resolve all URL-like strings in an object
 */
export function resolveUrlsDeep<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return resolveUrl(obj) as T;
  if (Array.isArray(obj)) return obj.map(item => resolveUrlsDeep(item)) as T;
  
  if (typeof obj === 'object') {
    const resolved: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key.toLowerCase().includes('url') || key.toLowerCase().includes('icon') || 
          key.toLowerCase().includes('image') || key.toLowerCase().includes('header')) {
        resolved[key] = resolveUrlsDeep(value);
      } else if (typeof value === 'string' && value.startsWith('/')) {
        resolved[key] = resolveUrl(value);
      } else if (typeof value === 'object' && value !== null) {
        resolved[key] = resolveUrlsDeep(value);
      } else {
        resolved[key] = value;
      }
    }
    return resolved as T;
  }
  return obj;
}

/**
 * Load repository configuration
 */
export async function loadConfig(): Promise<LocalizedConfig> {
  if (cachedConfig) return cachedConfig;
  
  try {
    const configModule = await import('$lib/data/config.json');
    cachedConfig = configModule.default as LocalizedConfig;
    return cachedConfig;
  } catch (error) {
    console.error('Failed to load config:', error);
    throw new Error('Failed to load repository configuration');
  }
}

/**
 * Load i18n strings for a specific language
 */
export async function loadI18n(lang: SupportedLanguage = DEFAULT_LANGUAGE): Promise<I18nStrings> {
  const cached = cachedI18n.get(lang);
  if (cached) return cached;
  
  try {
    let i18nModule;
    switch (lang) {
      case 'zh':
        i18nModule = await import('$lib/data/i18n/zh.json');
        break;
      case 'ru':
        i18nModule = await import('$lib/data/i18n/ru.json');
        break;
      default:
        i18nModule = await import('$lib/data/i18n/en.json');
    }
    
    const strings = i18nModule.default as I18nStrings;
    cachedI18n.set(lang, strings);
    return strings;
  } catch (error) {
    console.error(`Failed to load i18n for ${lang}:`, error);
    // Fall back to English
    if (lang !== 'en') {
      return loadI18n('en');
    }
    throw new Error('Failed to load translations');
  }
}

/**
 * Load all app data files
 */
async function loadAllApps(): Promise<LocalizedAppData[]> {
  if (cachedApps.size > 0) {
    return Array.from(cachedApps.values());
  }
  
  try {
    // Import all app JSON files
    const appModules = import.meta.glob('$lib/data/apps/*.json', { eager: true });
    
    const apps: LocalizedAppData[] = [];
    for (const [path, module] of Object.entries(appModules)) {
      const appData = (module as { default: LocalizedAppData }).default;
      cachedApps.set(appData.bundleIdentifier, appData);
      apps.push(appData);
    }
    
    return apps;
  } catch (error) {
    console.error('Failed to load apps:', error);
    throw new Error('Failed to load application data');
  }
}

/**
 * Load news data
 */
async function loadNews(): Promise<LocalizedNewsItem[]> {
  if (cachedNews) return cachedNews;
  
  try {
    const newsModule = await import('$lib/data/news.json');
    cachedNews = newsModule.default as LocalizedNewsItem[];
    return cachedNews;
  } catch (error) {
    console.error('Failed to load news:', error);
    throw new Error('Failed to load news data');
  }
}

/**
 * Convert localized app data to standard App format
 */
function localizedAppToApp(appData: LocalizedAppData, lang: SupportedLanguage): App {
  // Always use English name for slug to ensure consistent URLs
  const englishName = getLocalizedValue(appData.name, 'en');
  return {
    name: getLocalizedValue(appData.name, lang),
    slug: nameToSlug(englishName),
    bundleIdentifier: appData.bundleIdentifier,
    subtitle: getLocalizedValue(appData.subtitle, lang),
    localizedDescription: getLocalizedValue(appData.localizedDescription, lang),
    iconURL: resolveUrl(appData.iconURL),
    tintColor: appData.tintColor,
    platforms: appData.platforms,
    screenshots: appData.screenshots.map(s => resolveUrl(s)),
    deprecated: appData.deprecated,
    versions: appData.versions.map(v => localizedVersionToVersion(v, lang))
  };
}

/**
 * Convert localized version to standard AppVersion format
 */
function localizedVersionToVersion(version: LocalizedAppVersion, lang: SupportedLanguage): AppVersion {
  return {
    version: version.version,
    date: version.date,
    sourceCode: version.sourceCode,
    platforms: version.platforms,
    platformInstall: version.platformInstall,
    downloads: resolveUrlsDeep(version.downloads) as PlatformDownloads,
    localizedDescription: getLocalizedValue(version.localizedDescription, lang)
  };
}

/**
 * Convert localized news to standard NewsItem format
 */
function localizedNewsToNews(newsData: LocalizedNewsItem, lang: SupportedLanguage): NewsItem {
  return {
    identifier: newsData.identifier,
    title: getLocalizedValue(newsData.title, lang),
    caption: getLocalizedValue(newsData.caption, lang),
    date: newsData.date,
    tintColor: newsData.tintColor,
    imageURL: newsData.imageURL ? resolveUrl(newsData.imageURL) : undefined,
    notify: newsData.notify,
    url: newsData.url,
    appID: newsData.appID
  };
}

/**
 * Get full repository config with resolved data
 */
export async function getRepoConfig(lang: SupportedLanguage = DEFAULT_LANGUAGE): Promise<RepoConfig> {
  const [config, apps, news] = await Promise.all([
    loadConfig(),
    loadAllApps(),
    loadNews()
  ]);
  
  return {
    name: getLocalizedValue(config.name, lang),
    subtitle: getLocalizedValue(config.subtitle, lang),
    description: getLocalizedValue(config.description, lang),
    iconURL: resolveUrl(config.iconURL),
    headerURL: config.headerURL ? resolveUrl(config.headerURL) : undefined,
    website: config.website,
    tintColor: config.tintColor,
    featuredApps: config.featuredApps,
    apps: apps.map(app => localizedAppToApp(app, lang)),
    news: news.map(n => localizedNewsToNews(n, lang))
  };
}

/**
 * Get all apps with localization
 */
export async function getAllApps(lang: SupportedLanguage = DEFAULT_LANGUAGE): Promise<App[]> {
  const apps = await loadAllApps();
  return apps.map(app => localizedAppToApp(app, lang));
}

/**
 * Get active (non-deprecated) apps
 */
export async function getActiveApps(lang: SupportedLanguage = DEFAULT_LANGUAGE): Promise<App[]> {
  const apps = await getAllApps(lang);
  return apps.filter(app => !app.deprecated);
}

/**
 * Get deprecated apps
 */
export async function getDeprecatedApps(lang: SupportedLanguage = DEFAULT_LANGUAGE): Promise<App[]> {
  const apps = await getAllApps(lang);
  return apps.filter(app => app.deprecated === true);
}

/**
 * Get a single app by slug or bundle identifier
 */
export async function getApp(slug: string, lang: SupportedLanguage = DEFAULT_LANGUAGE): Promise<App | null> {
  const apps = await loadAllApps();
  
  const app = apps.find(app => 
    nameToSlug(getLocalizedValue(app.name, 'en')) === slug || 
    app.bundleIdentifier === slug
  );
  
  return app ? localizedAppToApp(app, lang) : null;
}

/**
 * Get all news items
 */
export async function getAllNews(lang: SupportedLanguage = DEFAULT_LANGUAGE): Promise<NewsItem[]> {
  const news = await loadNews();
  return news.map(n => localizedNewsToNews(n, lang));
}

/**
 * Convert name to URL-friendly slug
 */
export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Convert slug to display name
 */
export function slugToName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Clear all caches (useful for development/testing)
 */
export function clearCache(): void {
  cachedConfig = null;
  cachedApps.clear();
  cachedNews = null;
  cachedI18n.clear();
}
