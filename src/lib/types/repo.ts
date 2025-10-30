export interface Screenshot {
  imageURL?: string;
  width?: number;
  height?: number;
}

export interface PlatformInstall {
  iOS?: string;
  Android?: string;
  macOS?: string;
  Windows?: string;
  Linux?: string;
  Web?: string;
}

export interface PlatformDownloadURLs {
  iOS?: string;
  Android?: string;
  macOS?: string;
  Windows?: string;
  Linux?: string;
  Web?: string;
}

export interface AppVersion {
  version: string;
  platforms?: string[]; // Platform support for this specific version
  platformInstall: PlatformInstall;
  localizedDescription: string;
  date?: string;
  downloadURL?: string; // Keep for backward compatibility
  downloadURLs?: PlatformDownloadURLs;
  size?: number;
  minOSVersion?: string;
}

export interface AppScreenshots {
  iphone?: (string | Screenshot)[];
  ipad?: (string | Screenshot)[];
  appleTV?: (string | Screenshot)[];
  [key: string]: (string | Screenshot)[] | undefined;
}

export interface App {
  name: string;
  bundleIdentifier?: string;
  subtitle: string;
  localizedDescription: string;
  iconURL: string;
  tintColor: string;
  platforms: string[];
  screenshots: (string | Screenshot)[] | AppScreenshots;
  versions: AppVersion[];
  appPermissions?: {
    entitlements?: string[];
    privacy?: string[];
  };
  beta?: boolean;
  patreon?: {
    pledgeURL: string;
  };
}

export interface NewsItem {
  title: string;
  identifier: string;
  caption: string;
  date: string;
  tintColor: string;
  imageURL?: string;
  notify: boolean;
  url?: string;
  appID?: string;
}

export interface RepoConfig {
  name: string;
  subtitle: string;
  description: string;
  iconURL: string;
  headerURL?: string;
  website: string;
  tintColor: string;
  featuredApps: string[];
  apps: App[];
  news: NewsItem[];
}