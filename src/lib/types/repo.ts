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

// Architecture options for platforms
export interface ArchDownloads {
  x86_64?: string;
  arm64?: string;
  aarch64?: string;
  i386?: string;
  universal?: string;
  [key: string]: string | undefined;
}

// Package type with architecture options (for Linux)
export interface PackageTypeDownloads {
  zip?: ArchDownloads;
  appimage?: ArchDownloads;
  deb?: ArchDownloads;
  rpm?: ArchDownloads;
  tar?: ArchDownloads;
  aur?: ArchDownloads;
  homebrew?: string;
  [key: string]: ArchDownloads | string | undefined;
}

// Windows-specific downloads with installer types
export interface WindowsDownloads {
  exe?: ArchDownloads;      // NSIS, Inno Setup, or other exe installers
  msi?: ArchDownloads;      // Windows Installer packages
  msix?: ArchDownloads;     // Modern Windows app packages
  zip?: ArchDownloads;      // Portable zip archives
  portable?: ArchDownloads; // Standalone portable executables
  winget?: string;          // Windows Package Manager ID
  chocolatey?: string;      // Chocolatey package name
  scoop?: string;           // Scoop package bucket/name
  [key: string]: ArchDownloads | string | undefined;
}

// Android-specific downloads
export interface AndroidDownloads {
  apk?: string;
  aab?: string;
  [key: string]: string | undefined;
}

// Flexible download structure that supports:
// - Simple string URL
// - Architecture-based downloads (macOS)
// - Package type with architecture (Linux, Windows)
// - Android-specific (apk/aab)
export type PlatformDownload = 
  | string 
  | ArchDownloads 
  | PackageTypeDownloads 
  | WindowsDownloads
  | AndroidDownloads;

export interface PlatformDownloads {
  iOS?: string;
  Android?: string | AndroidDownloads;
  macOS?: string | ArchDownloads;
  Windows?: string | ArchDownloads | WindowsDownloads;
  Linux?: string | PackageTypeDownloads;
  Web?: string;
  [key: string]: PlatformDownload | undefined;
}

// Legacy support
export interface PlatformDownloadURLs {
  iOS?: string;
  Android?: string;
  macOS?: string;
  Windows?: string;
  Linux?: string;
  Web?: string;
  [key: string]: string | undefined;
}

export interface AppVersion {
  version: string;
  platforms?: string[]; // Platform support for this specific version
  platformInstall: PlatformInstall;
  localizedDescription: string;
  date?: string;
  downloadURL?: string; // Keep for backward compatibility
  downloadURLs?: PlatformDownloadURLs; // Legacy simple URLs
  downloads?: PlatformDownloads; // New nested structure
  size?: number;
  minOSVersion?: string;
  sourceCode?: string; // URL to source code for this version
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
  deprecated?: boolean;
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