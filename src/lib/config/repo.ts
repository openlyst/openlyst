import yaml from 'js-yaml';
import repoYaml from '$lib/assets/yaml/repo.yaml?raw';

export interface AppVersion {
  version: string;
  downloadURL: string;
  localizedDescription: string;
}

export interface App {
  name: string;
  subtitle: string;
  localizedDescription: string;
  iconURL: string;
  tintColor: string;
  platforms: string[];
  screenshots: string[] | { [key: string]: string[] };
  versions: AppVersion[];
  id?: string; // We'll derive this from the array index or add it manually
}

export interface NewsItem {
  title: string;
  identifier: string;
  caption: string;
  date: string;
  tintColor: string;
  imageURL: string;
  notify: boolean;
  url?: string;
  appID?: string;
}

export interface RepoConfig {
  name: string;
  subtitle: string;
  description: string;
  iconURL: string;
  headerURL: string;
  website: string;
  tintColor: string;
  featuredApps: string[];
  apps: App[];
  news: NewsItem[];
}

let repoConfig: RepoConfig | null = null;

export function getRepoConfig(): RepoConfig {
  if (!repoConfig) {
    try {
      repoConfig = yaml.load(repoYaml) as RepoConfig;
      
      // Add IDs to apps based on their names (slugified)
      repoConfig.apps = repoConfig.apps.map((app, index) => ({
        ...app,
        id: app.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }));
    } catch (error) {
      console.error('Failed to parse repo.yaml:', error);
      throw new Error('Invalid repo configuration');
    }
  }
  
  return repoConfig;
}

export function getAppById(id: string): App | undefined {
  const config = getRepoConfig();
  return config.apps.find(app => app.id === id);
}

export function getAllApps(): App[] {
  const config = getRepoConfig();
  return config.apps;
}

export function getFeaturedApps(): App[] {
  const config = getRepoConfig();
  return config.featuredApps
    .map(appId => config.apps.find(app => app.id === appId))
    .filter(Boolean) as App[];
}