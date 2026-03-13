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

export interface ArchDownloads {
  x86_64?: string;
  arm64?: string;
  aarch64?: string;
  i386?: string;
  universal?: string;
  [key: string]: string | undefined;
}

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

export interface WindowsDownloads {
  exe?: ArchDownloads;
  msi?: ArchDownloads;
  msix?: ArchDownloads;
  zip?: ArchDownloads;
  portable?: ArchDownloads;
  winget?: string;
  chocolatey?: string;
  scoop?: string;
  [key: string]: ArchDownloads | string | undefined;
}

export interface AndroidDownloads {
  apk?: string;
  aab?: string;
  [key: string]: string | undefined;
}

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
  buildVersion?: string;
  buildNumber?: string;
  releaseTag?: string;
  sourceCommit?: string;
  generatedAt?: string;
  publishedAt?: string;
  platforms?: string[];
  platformInstall: PlatformInstall;
  localizedDescription: string;
  date?: string;
  downloadURL?: string;
  downloadURLs?: PlatformDownloadURLs;
  downloads?: PlatformDownloads;
  checksums?: Record<string, string>;
  size?: number;
  minOSVersion?: string;
  sourceCode?: string;
}

export interface AppScreenshots {
  iphone?: (string | Screenshot)[];
  ipad?: (string | Screenshot)[];
  appleTV?: (string | Screenshot)[];
  [key: string]: (string | Screenshot)[] | undefined;
}

export interface App {
  name: string;
  slug: string;
  /** Short repo key / legacy id (e.g. doudou). Prefer applicationId for store/bundle identity. */
  bundleIdentifier?: string;
  /**
   * Full application id / bundle id / package name (e.g. gitlab.openlyst.doudou).
   * Exposed by the API so clients need not hardcode store URLs.
   */
  applicationId?: string;
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

/** Resolved repository entry with localized name/description (e.g. from getRepos). */
export interface RepositoryEntry {
  id: string;
  name: string;
  type: string;
  url: string;
  description?: string;
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
  tempDownloadsOff?: boolean;
}
