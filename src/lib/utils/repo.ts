import type { RepoConfig } from '$lib/types/repo';

let cachedConfig: RepoConfig | null = null;

export async function loadRepoConfig(): Promise<RepoConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    // Import the YAML file as a module in SvelteKit
    const configModule = await import('$lib/assets/yaml/repo.yaml?raw');
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