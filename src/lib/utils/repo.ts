import type { RepoConfig } from '$lib/types/repo';

let cachedConfig: RepoConfig | null = null;

const BASE_URL = 'https://openlyst.ink';

/**
 * Resolves a relative URL path to a full URL
 * Paths starting with / are converted to full URLs using BASE_URL
 * Already absolute URLs (http://, https://) are returned as-is
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
 * Transforms an app object to resolve all relative URLs to absolute URLs
 */
export function resolveAppUrls<T extends RepoConfig['apps'][0]>(app: T): T {
  return {
    ...app,
    iconURL: resolveUrl(app.iconURL),
    screenshots: app.screenshots?.map(resolveUrl) || []
  };
}

/**
 * Transforms a news item to resolve all relative URLs to absolute URLs
 */
export function resolveNewsUrls<T extends RepoConfig['news'][0]>(news: T): T {
  return {
    ...news,
    imageURL: resolveUrl(news.imageURL),
    url: news.url?.startsWith('/') ? resolveUrl(news.url) : news.url
  };
}

/**
 * Transforms repo config to resolve all relative URLs to absolute URLs
 */
export function resolveRepoUrls(config: RepoConfig): RepoConfig {
  return {
    ...config,
    iconURL: resolveUrl(config.iconURL),
    apps: config.apps.map(resolveAppUrls),
    news: config.news.map(resolveNewsUrls)
  };
}

export async function loadRepoConfig(): Promise<RepoConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    // Import the YAML file as a module in SvelteKit
    const configModule = await import('$lib/assets/yaml/repo.json?raw');
    const yamlContent = configModule.default;
    
    // The file contains JSON format, so we parse it as JSON
    const config = JSON.parse(yamlContent) as RepoConfig;
    
    cachedConfig = config;
    return config;
  } catch (error) {
    console.error('Failed to load repo config:', error);
    throw new Error('Failed to load repository configuration');
  }
}

export async function getApp(slug: string): Promise<RepoConfig['apps'][0] | null> {
  const config = await loadRepoConfig();
  
  // Find app by converting name to slug format
  const app = config.apps.find(app => 
    nameToSlug(app.name) === slug || 
    app.bundleIdentifier === slug
  );
  
  return app || null;
}

export async function getAllApps(): Promise<RepoConfig['apps']> {
  const config = await loadRepoConfig();
  return config.apps;
}

export async function getActiveApps(): Promise<RepoConfig['apps']> {
  const config = await loadRepoConfig();
  return config.apps.filter(app => !app.deprecated);
}

export async function getDeprecatedApps(): Promise<RepoConfig['apps']> {
  const config = await loadRepoConfig();
  return config.apps.filter(app => app.deprecated === true);
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
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}