/**
 * Data Service for OpenLyst (Next.js)
 * Loads app data from JSON files with i18n support.
 */

import type {
  App,
  NewsItem,
  RepoConfig,
  AppVersion,
  PlatformDownloads,
} from '@/lib/types/repo';

import configData from '@/lib/data/config.json';
import newsData from '@/lib/data/news.json';
import enI18n from '@/lib/data/i18n/en.json';
import zhI18n from '@/lib/data/i18n/zh.json';
import ruI18n from '@/lib/data/i18n/ru.json';
import doudou from '@/lib/data/apps/doudou.json';
import finar from '@/lib/data/apps/finar.json';
import kilt from '@/lib/data/apps/kilt.json';
import repstore from '@/lib/data/apps/repstore.json';

export type SupportedLanguage = 'en' | 'zh' | 'ru';
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'zh', 'ru'];

export interface LocalizedString {
  en: string;
  zh?: string;
  ru?: string;
  [key: string]: string | undefined;
}

export interface LocalizedAppData {
  bundleIdentifier: string;
  /** Full bundle / package id (e.g. gitlab.openlyst.doudou). API injects apkpure etc. from this. */
  applicationId?: string;
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
  buildVersion?: string;
  buildNumber?: string;
  releaseTag?: string;
  sourceCommit?: string;
  generatedAt?: string;
  publishedAt?: string;
  date?: string;
  sourceCode?: string;
  platforms?: string[];
  platformInstall: Record<string, string>;
  downloads: Record<string, unknown>;
  checksums?: Record<string, string>;
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
  tempDownloadsOff?: boolean;
}

export interface I18nStrings {
  common: Record<string, string>;
  platforms: Record<string, string>;
  installMethods: Record<string, string>;
  api: Record<string, string>;
}

const BASE_URL = 'https://openlyst.ink';

const appModules: LocalizedAppData[] = [
  doudou as LocalizedAppData,
  finar as LocalizedAppData,
  kilt as LocalizedAppData,
  repstore as LocalizedAppData,
];

const config = configData as LocalizedConfig;
const newsItems = newsData as LocalizedNewsItem[];

const uiTranslations: Record<SupportedLanguage, I18nStrings> = {
  en: enI18n as I18nStrings,
  zh: zhI18n as I18nStrings,
  ru: ruI18n as I18nStrings,
};

export function getLocalizedValue(
  localizedString: LocalizedString | string | undefined,
  lang: SupportedLanguage = DEFAULT_LANGUAGE
): string {
  if (!localizedString) return '';
  if (typeof localizedString === 'string') return localizedString;
  return localizedString[lang] || localizedString.en || Object.values(localizedString).find((v) => v) || '';
}

export function normalizeLanguage(lang?: string | null): SupportedLanguage {
  if (!lang) return DEFAULT_LANGUAGE;
  const normalized = lang.toLowerCase().substring(0, 2) as SupportedLanguage;
  return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : DEFAULT_LANGUAGE;
}

/**
 * Resolves a path to a URL. When baseUrl is omitted, paths starting with / are returned
 * as-is (relative) so the browser requests from the current origin (fixes CORS in dev).
 * When baseUrl is provided (e.g. in API routes), paths are made absolute.
 */
export function resolveUrl(path: string, baseUrl?: string): string {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return baseUrl ? `${baseUrl.replace(/\/$/, '')}${path}` : path;
  return path;
}

export function resolveUrlsDeep<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return resolveUrl(obj) as T;
  if (Array.isArray(obj)) return obj.map((item) => resolveUrlsDeep(item)) as T;
  if (typeof obj === 'object') {
    const resolved: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (
        key.toLowerCase().includes('url') ||
        key.toLowerCase().includes('icon') ||
        key.toLowerCase().includes('image') ||
        key.toLowerCase().includes('header')
      ) {
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

export async function loadConfig(): Promise<LocalizedConfig> {
  return config;
}

export async function loadI18n(lang: SupportedLanguage = DEFAULT_LANGUAGE): Promise<I18nStrings> {
  return uiTranslations[lang] ?? uiTranslations[DEFAULT_LANGUAGE];
}

const APKPURE_BASE = 'https://apkpure.com/p';

function injectApkpureFromApplicationId(
  versions: AppVersion[],
  applicationId: string | undefined,
  platforms: string[]
): void {
  if (!applicationId?.trim()) return;
  if (!platforms.includes('Android')) return;
  const apkpureUrl = `${APKPURE_BASE}/${applicationId.trim()}`;
  for (const v of versions) {
    const d = v.downloads;
    if (!d || typeof d !== 'object') continue;
    const android = d.Android;
    if (android && typeof android === 'object' && !Array.isArray(android)) {
      const a = android as Record<string, string | undefined>;
      const existing = a.apkpure;
      if (existing === undefined || existing === '' || existing.startsWith(APKPURE_BASE)) {
        a.apkpure = apkpureUrl;
      }
    }
  }
}

function localizedAppToApp(appData: LocalizedAppData, lang: SupportedLanguage): App {
  const englishName = getLocalizedValue(appData.name, 'en');
  const slug =
    appData.bundleIdentifier === 'repstore' ? 'repstore' : nameToSlug(englishName);
  const versions = appData.versions.map((v) => localizedVersionToVersion(v, lang));
  injectApkpureFromApplicationId(versions, appData.applicationId, appData.platforms);
  versions.sort((a, b) => {
    const bnA = Number(a.buildNumber || 0);
    const bnB = Number(b.buildNumber || 0);
    if (bnA !== bnB) return bnB - bnA;
    return String(b.date || '').localeCompare(String(a.date || ''));
  });

  return {
    name: getLocalizedValue(appData.name, lang),
    slug,
    bundleIdentifier: appData.bundleIdentifier,
    applicationId: appData.applicationId,
    subtitle: getLocalizedValue(appData.subtitle, lang),
    localizedDescription: getLocalizedValue(appData.localizedDescription, lang),
    iconURL: resolveUrl(appData.iconURL),
    tintColor: appData.tintColor,
    platforms: appData.platforms,
    screenshots: appData.screenshots.map((s) => resolveUrl(s)),
    deprecated: appData.deprecated,
    versions,
  };
}

function localizedVersionToVersion(version: LocalizedAppVersion, lang: SupportedLanguage): AppVersion {
  return {
    version: version.version,
    buildVersion: version.buildVersion,
    buildNumber: version.buildNumber,
    releaseTag: version.releaseTag,
    sourceCommit: version.sourceCommit,
    generatedAt: version.generatedAt,
    publishedAt: version.publishedAt,
    date: version.date,
    sourceCode: version.sourceCode,
    platforms: version.platforms,
    platformInstall: version.platformInstall,
    downloads: resolveUrlsDeep(version.downloads) as PlatformDownloads,
    checksums: version.checksums,
    localizedDescription: getLocalizedValue(version.localizedDescription, lang),
  };
}

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
    appID: newsData.appID,
  };
}

export async function getRepoConfig(lang: SupportedLanguage = DEFAULT_LANGUAGE): Promise<RepoConfig> {
  const apps = appModules.map((app) => localizedAppToApp(app, lang));
  const news = newsItems.map((n) => localizedNewsToNews(n, lang));
  return {
    name: getLocalizedValue(config.name, lang),
    subtitle: getLocalizedValue(config.subtitle, lang),
    description: getLocalizedValue(config.description, lang),
    iconURL: resolveUrl(config.iconURL),
    headerURL: config.headerURL ? resolveUrl(config.headerURL) : undefined,
    website: config.website,
    tintColor: config.tintColor,
    featuredApps: config.featuredApps,
    apps,
    news,
    tempDownloadsOff: config.tempDownloadsOff,
  };
}

export async function getAllApps(lang: SupportedLanguage = DEFAULT_LANGUAGE): Promise<App[]> {
  return appModules.map((app) => localizedAppToApp(app, lang));
}

export async function getActiveApps(lang: SupportedLanguage = DEFAULT_LANGUAGE): Promise<App[]> {
  const apps = await getAllApps(lang);
  return apps.filter((app) => !app.deprecated);
}

export async function getDeprecatedApps(lang: SupportedLanguage = DEFAULT_LANGUAGE): Promise<App[]> {
  const apps = await getAllApps(lang);
  return apps.filter((app) => app.deprecated === true);
}

export async function getApp(slug: string, lang: SupportedLanguage = DEFAULT_LANGUAGE): Promise<App | null> {
  const app = appModules.find(
    (a) => nameToSlug(getLocalizedValue(a.name, 'en')) === slug || a.bundleIdentifier === slug
  );
  return app ? localizedAppToApp(app, lang) : null;
}

export async function getAllNews(lang: SupportedLanguage = DEFAULT_LANGUAGE): Promise<NewsItem[]> {
  return newsItems.map((n) => localizedNewsToNews(n, lang));
}

export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function slugToName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function clearCache(): void {
  // No-op when using static imports
}
