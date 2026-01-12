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
 * Recursively resolves all URL-like strings in an object
 * Handles nested objects, arrays, and string values
 * Resolves paths starting with / to full URLs using BASE_URL
 */
export function resolveUrlsDeep<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return resolveUrl(obj) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => resolveUrlsDeep(item)) as T;
  }

  if (typeof obj === 'object') {
    const resolved: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Only resolve URL-like keys or values that look like paths
      if (key.toLowerCase().includes('url') || key.toLowerCase().includes('icon') || key.toLowerCase().includes('image') || key.toLowerCase().includes('header')) {
        resolved[key] = resolveUrlsDeep(value);
      } else if (typeof value === 'string' && value.startsWith('/')) {
        // Resolve any string value that starts with /
        resolved[key] = resolveUrl(value);
      } else if (typeof value === 'object' && value !== null) {
        // Recursively process nested objects and arrays
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
 * Transforms an app object to resolve all relative URLs to absolute URLs
 */
export function resolveAppUrls<T extends RepoConfig['apps'][0]>(app: T): T {
  return resolveUrlsDeep(app);
}

/**
 * Transforms a news item to resolve all relative URLs to absolute URLs
 */
export function resolveNewsUrls<T extends RepoConfig['news'][0]>(news: T): T {
  return resolveUrlsDeep(news);
}

/**
 * Transforms repo config to resolve all relative URLs to absolute URLs
 */
export function resolveRepoUrls(config: RepoConfig): RepoConfig {
  return resolveUrlsDeep(config);
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