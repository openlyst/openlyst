<script lang="ts">
  import { Section, Button, Skeleton } from '$lib';
  import type { PageData } from './$types';
  import type { App, AppVersion } from '$lib/types/repo';
  import { marked } from 'marked';
  import { browser } from '$app/environment';
  import { getApp } from '$lib/services/dataService';
  import { language, t, type SupportedLanguage } from '$lib/stores/language';
  import { page } from '$app/stores';
  import Button3D from '$lib/components/Button3D.svelte';
  import { get } from 'svelte/store';
  
  let { data }: { data: PageData } = $props();
  
  // Initialize immediately from SSR data to avoid flash of unstyled content
  let isLoaded = $state(true);
  let app = $state<App | undefined>(data.app);
  let latestVersion = $state<AppVersion | undefined>(data.app?.versions[0]);
  let currentLang = $state<SupportedLanguage>(get(language));
  let isRefreshing = $state(false);
  
  // State for version selection and modal visibility
  let selectedVersion = $state<AppVersion | undefined>(data.app?.versions[0]);
  let showModal = $state(false);
  
  // State for download selections per platform
  let downloadSelections = $state<Record<string, { type?: string; arch?: string }>>({});
  
  // State for image lightbox
  let showLightbox = $state(false);
  let lightboxImageUrl = $state('');
  let lightboxIndex = $state(0);

  /** When true, downloads are temporarily disabled (e.g. hosted builds banned). Shows notice and blurs download section. */
  const tempDownloadsOff = true;
  
  // Subscribe to language changes and reload data (only on client-side language changes)
  $effect(() => {
    if (!browser) return;
    
    const unsubscribe = language.subscribe(async (lang) => {
      // Skip if same language and we already have data
      if (lang === currentLang && app) return;
      
      // Skip if we're already refreshing
      if (isRefreshing) return;
      
      const prevLang = currentLang;
      currentLang = lang;
      
      // Only fetch new data if language actually changed (not on initial subscribe)
      if (prevLang !== lang && app) {
        isRefreshing = true;
        try {
          // Get the slug from the current page
          const slug = $page.params.slug;
          if (!slug) return;
          const fetchedApp = await getApp(slug, lang);
          if (fetchedApp) {
            app = fetchedApp;
            latestVersion = fetchedApp.versions[0];
            if (!selectedVersion) {
              selectedVersion = latestVersion;
            }
          }
        } catch (e) {
          console.error('Error fetching app:', e);
        } finally {
          isRefreshing = false;
        }
      }
    });
    
    return () => unsubscribe();
  });
  
  // Function to open lightbox
  function openLightbox(imageUrl: string, index: number) {
    lightboxImageUrl = imageUrl;
    lightboxIndex = index;
    showLightbox = true;
  }
  
  // Function to close lightbox
  function closeLightbox() {
    showLightbox = false;
  }
  
  // Function to navigate to previous image
  function prevImage() {
    const allScreenshots = getScreenshots();
    lightboxIndex = (lightboxIndex - 1 + allScreenshots.length) % allScreenshots.length;
    lightboxImageUrl = allScreenshots[lightboxIndex].imageURL || allScreenshots[lightboxIndex];
  }
  
  // Function to navigate to next image
  function nextImage() {
    const allScreenshots = getScreenshots();
    lightboxIndex = (lightboxIndex + 1) % allScreenshots.length;
    lightboxImageUrl = allScreenshots[lightboxIndex].imageURL || allScreenshots[lightboxIndex];
  }
  
  // Function to handle lightbox keyboard events
  function handleLightboxKeydown(event: KeyboardEvent) {
    if (!showLightbox) return;
    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      prevImage();
    } else if (event.key === 'ArrowRight') {
      nextImage();
    }
  }
  
  // Function to handle modal keyboard events
  function handleModalKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      showModal = false;
    }
  }
  
  // Function to prevent modal from closing when clicking inside
  function handleModalContentClick(event: MouseEvent) {
    event.stopPropagation();
  }
  
  // Function to get platforms supported by a specific version
  function getVersionPlatforms(version?: AppVersion): string[] {
    const v = version || latestVersion;
    if (!v || !app) return [];
    return v.platforms || app.platforms;
  }
  
  // Function to get platform-specific installation instructions
  function getInstallInstructions(platform: string, version?: AppVersion): string {
    const v = version || latestVersion;
    if (!v) return 'Installation instructions not available';
    return v.platformInstall[platform as keyof typeof v.platformInstall] || 'Installation instructions not available';
  }
  
  // Check if a platform has any available downloads
  function platformHasDownloads(platform: string, version?: AppVersion): boolean {
    const v = version || selectedVersion;
    if (!v) return false;
    const downloads = (v.downloads as any)?.[platform] || (v.downloadURLs as any)?.[platform];
    if (!downloads) return false;
    if (typeof downloads === 'string') return downloads !== '';
    // Nested object - check if any value is non-empty
    return hasAnyDownload(downloads);
  }
  
  // Recursively check if any download URL exists
  function hasAnyDownload(obj: any): boolean {
    if (typeof obj === 'string') return obj !== '';
    if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj).some(v => hasAnyDownload(v));
    }
    return false;
  }
  
  // Get download structure for a platform
  function getDownloadStructure(platform: string, version?: AppVersion): any {
    const v = version || selectedVersion;
    if (!v) return null;
    return (v.downloads as any)?.[platform] || (v.downloadURLs as any)?.[platform] || null;
  }
  
  // Get available types for a platform (e.g., zip, deb, rpm for Linux)
  function getAvailableTypes(platform: string, version?: AppVersion): string[] {
    const downloads = getDownloadStructure(platform, version);
    if (!downloads || typeof downloads === 'string') return [];
    
    // For platforms like Linux with type > arch structure
    // Also include direct string URLs (like homebrew, apkpure) as types
    const types = Object.keys(downloads).filter(key => {
      const value = downloads[key];
      // Include if it's an object with downloads OR a non-empty string URL
      return (typeof value === 'object' && hasAnyDownload(value)) || (typeof value === 'string' && value !== '');
    });
    
    return types;
  }
  
  // Get available architectures for a platform/type
  function getAvailableArchs(platform: string, type?: string, version?: AppVersion): string[] {
    const downloads = getDownloadStructure(platform, version);
    if (!downloads || typeof downloads === 'string') return [];
    
    let archObj = downloads;
    if (type && downloads[type]) {
      archObj = downloads[type];
    }
    
    if (typeof archObj === 'string') return [];
    
    return Object.keys(archObj).filter(arch => {
      const value = archObj[arch];
      return typeof value === 'string' && value !== '';
    });
  }
  
  // Get the download URL based on selections
  function getDownloadUrl(platform: string, version?: AppVersion): string | null {
    const downloads = getDownloadStructure(platform, version);
    if (!downloads) return null;
    if (typeof downloads === 'string') return downloads || null;
    
    const selection = downloadSelections[platform] || {};
    const types = getAvailableTypes(platform, version);
    const hasTypes = types.length > 0;
    
    if (hasTypes) {
      // Platform has type structure (like Linux with zip/deb/rpm)
      const selectedType = selection.type || types[0];
      const typeObj = downloads[selectedType];
      if (!typeObj) return null;
      if (typeof typeObj === 'string') return typeObj || null;
      
      const archs = getAvailableArchs(platform, selectedType, version);
      const selectedArch = selection.arch || archs[0];
      return typeObj[selectedArch] || null;
    } else {
      // Platform has only arch structure (like macOS, Windows)
      const archs = getAvailableArchs(platform, undefined, version);
      if (archs.length === 0) return null;
      const selectedArch = selection.arch || archs[0];
      return downloads[selectedArch] || null;
    }
  }
  
  // Get display label for type
  function getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'zip': 'ZIP Archive',
      'appimage': 'AppImage',
      'deb': 'DEB Package',
      'rpm': 'RPM Package',
      'apk': 'APK',
      'aab': 'AAB Bundle',
      'dmg': 'DMG',
      'pkg': 'PKG',
      'homebrew': 'Homebrew',
      'apkpure': 'APKPure'
    };
    return labels[type] || type.toUpperCase();
  }
  
  // Get display label for architecture
  function getArchLabel(arch: string): string {
    const labels: Record<string, string> = {
      'x86_64': 'x86_64 (Intel/AMD)',
      'arm64': 'ARM64 (Apple Silicon/ARM)',
      'aarch64': 'ARM64',
      'i386': 'x86 (32-bit)',
      'universal': 'Universal'
    };
    return labels[arch] || arch;
  }
  
  // Get all available download options for a platform
  interface DownloadOption {
    label: string;
    url: string;
    type?: string;
    arch?: string;
  }
  
  function getAllDownloadOptions(platform: string, version?: AppVersion): DownloadOption[] {
    const downloads = getDownloadStructure(platform, version);
    if (!downloads) return [];
    
    // Simple string URL
    if (typeof downloads === 'string' && downloads) {
      return [{ label: `Download ${platform}`, url: downloads }];
    }
    
    const options: DownloadOption[] = [];
    const types = getAvailableTypes(platform, version);
    
    // Special store types that are direct links (not architecture-based)
    const storeTypes = ['homebrew', 'apkpure'];
    
    if (types.length > 0) {
      // Platform has type structure (like Linux with zip/deb/rpm or Android with apk/aab)
      for (const type of types) {
        const typeObj = downloads[type];
        if (typeof typeObj === 'string' && typeObj) {
          // Direct URL type (like homebrew, apkpure)
          options.push({ label: getTypeLabel(type), url: typeObj, type });
        } else if (typeof typeObj === 'object') {
          const archs = Object.keys(typeObj).filter(arch => typeObj[arch]);
          for (const arch of archs) {
            if (typeObj[arch]) {
              const label = archs.length > 1 
                ? `${getTypeLabel(type)} (${getArchLabel(arch)})`
                : getTypeLabel(type);
              options.push({ label, url: typeObj[arch], type, arch });
            }
          }
        }
      }
    } else {
      // Platform has only arch structure (like macOS, Windows)
      const archs = getAvailableArchs(platform, undefined, version);
      for (const arch of archs) {
        if (downloads[arch]) {
          options.push({ 
            label: archs.length > 1 ? getArchLabel(arch) : `Download ${platform}`, 
            url: downloads[arch], 
            arch 
          });
        }
      }
    }
    
    return options;
  }
  
  // State for open dropdown menus
  let openDropdown = $state<string | null>(null);
  
  function toggleDropdown(platform: string, event?: MouseEvent) {
    event?.stopPropagation();
    openDropdown = openDropdown === platform ? null : platform;
  }
  
  function closeDropdowns() {
    openDropdown = null;
  }
  
  // Close dropdown when clicking outside
  $effect(() => {
    if (browser && openDropdown) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        // Check if click is outside the dropdown
        if (!target.closest('.dropdown-container')) {
          closeDropdowns();
        }
      };
      
      // Add listener with a small delay to prevent immediate closing
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
      
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  });
  
  // Function to format screenshots
  function getScreenshots() {
    if (!app) return [];
    if (Array.isArray(app.screenshots)) {
      return app.screenshots.map(screenshot => 
        typeof screenshot === 'string' 
          ? { imageURL: screenshot } 
          : screenshot
      );
    }
    
    // For device-specific screenshots, combine them
    const allScreenshots: any[] = [];
    Object.values(app.screenshots).forEach(deviceScreenshots => {
      if (Array.isArray(deviceScreenshots)) {
        allScreenshots.push(...deviceScreenshots.map(screenshot => 
          typeof screenshot === 'string' 
            ? { imageURL: screenshot } 
            : screenshot
        ));
      }
    });
    return allScreenshots;
  }
  
  let screenshots = $derived(isLoaded ? getScreenshots() : []);
  
  // Non-null helpers for template use (only used after isLoaded check)
  let appName = $derived(app?.name ?? '');
  let appTintColor = $derived(app?.tintColor ?? '#8b5cf6');
  let appVersions = $derived(app?.versions ?? []);
  let selectedVersionNumber = $derived(selectedVersion?.version ?? '');
  let selectedVersionSourceCode = $derived(selectedVersion?.sourceCode ?? '');
</script>

<svelte:head>
  <!-- Basic Meta -->
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={data.meta.url} />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:image" content={data.meta.image} />
  <meta property="og:site_name" content={data.meta.siteName} />
  
  <!-- Twitter / Discord -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:url" content={data.meta.url} />
  <meta name="twitter:title" content={data.meta.title} />
  <meta name="twitter:description" content={data.meta.description} />
  <meta name="twitter:image" content={data.meta.image} />
  
  <!-- Additional app info -->
  <meta name="theme-color" content={data.meta.tintColor} />
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
</svelte:head>

{#if !isLoaded}
  <!-- Loading State -->
  <section class="relative text-white overflow-hidden min-h-[60vh] flex items-center">
    <div class="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div class="flex items-center mb-4">
            <div class="w-16 h-16 glass-card rounded-2xl mr-4 animate-pulse"></div>
            <div class="flex-1">
              <div class="h-10 glass-card rounded-lg w-48 animate-pulse mb-2"></div>
              <div class="h-6 glass-card rounded-lg w-64 animate-pulse"></div>
            </div>
          </div>
          <div class="space-y-3 mb-8">
            <div class="h-5 glass-card rounded animate-pulse"></div>
            <div class="h-5 glass-card rounded animate-pulse w-5/6"></div>
            <div class="h-5 glass-card rounded animate-pulse w-4/6"></div>
          </div>
          <div class="flex gap-4">
            <div class="h-12 w-40 glass-card rounded-lg animate-pulse"></div>
            <div class="h-12 w-40 glass-card rounded-lg animate-pulse"></div>
          </div>
        </div>
        <div class="glass-card rounded-2xl p-8">
          <div class="space-y-4">
            {#each Array(4) as _}
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-purple-500/30 rounded-full animate-pulse"></div>
                <div class="h-5 glass-card rounded w-32 animate-pulse"></div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <Section title={$t.common.loading} subtitle={$t.deprecated.loadingDetails} background="default">
    {#snippet children()}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each Array(3) as _}
          <div class="bg-gray-800 rounded-lg h-64 animate-pulse"></div>
        {/each}
      </div>
    {/snippet}
  </Section>
{:else}

{#if app && latestVersion && selectedVersion}
<!-- Deprecation Warning Banner -->
{#if app.deprecated}
<div class="bg-yellow-500 text-yellow-900">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
    <div class="flex items-center justify-center gap-3">
      <svg class="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      <div class="text-center">
        <p class="font-bold">{$t.deprecated.appDeprecated}</p>
        <p class="text-sm">{$t.deprecated.appDeprecatedDesc}</p>
      </div>
      <a href="/apps" class="ml-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap">
        {$t.deprecated.viewActiveApps}
      </a>
    </div>
  </div>
</div>
{/if}

<!-- Hero Section -->
<section class="relative text-white py-20 overflow-hidden">
  <!-- Gradient overlay that works with 3D background -->
  <div class="absolute inset-0 bg-gradient-to-br from-purple-600/80 via-violet-600/60 to-transparent pointer-events-none" style="background: linear-gradient(135deg, rgba(139,92,246,0.4) 0%, rgba(6,182,212,0.2) 100%);"></div>
  
  <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div class="animate-fadeIn">
        <div class="flex items-center mb-4">
          <div class="w-20 h-20 rounded-2xl mr-4 glass-card p-2 shadow-lg shadow-purple-500/20">
            <img src="{app.iconURL}" alt="{app.name} icon" class="w-full h-full rounded-xl" />
          </div>
          <div>
            <h1 class="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              {app.name}
            </h1>
            <p class="text-xl text-gray-300 mt-2">{app.subtitle}</p>
          </div>
        </div>
        
        <p class="text-lg text-gray-300 mb-8">
          {app.localizedDescription}
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4">
          <Button3D text={$t.appDetail.downloadNow} href="#downloads" variant="secondary" size="lg" />
          <Button3D text={$t.appDetail.viewScreenshots} href="#screenshots" variant="outline" size="lg" />
        </div>
        
        <div class="mt-6 flex items-center">
          <span class="px-3 py-1 glass-card text-cyan-400 text-sm font-medium rounded-full">
            v{latestVersion.version}
          </span>
          <span class="ml-4 text-gray-300">🚀 {$t.appDetail.latestRelease}</span>
        </div>
      </div>
      
      <div class="relative">
        <div class="glass-card rounded-2xl p-8">
          <div class="space-y-4">
            {#each app.platforms as platform}
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
                <span>{$t.appDetail.availableOn.replace('{platform}', platform)}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Screenshots Section -->
{#if screenshots.length > 0}
<Section 
  title={$t.common.screenshots} 
  subtitle={$t.appDetail.seeInAction.replace('{appName}', app.name)}
  background="default"
>
  {#snippet children()}
    <div id="screenshots" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each screenshots.slice(0, 6) as screenshot, index}
        <button 
          class="group bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-red-900/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 hover:-translate-y-2"
          onclick={() => openLightbox(screenshot.imageURL || screenshot, index)}
        >
          <div class="relative overflow-hidden">
            <img 
              src="{screenshot.imageURL || screenshot}" 
              alt="{appName} screenshot {index + 1}" 
              class="w-full h-64 sm:h-80 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <span class="text-white text-sm font-medium flex items-center gap-2">
                <i class="fas fa-expand"></i>
                {$t.appDetail.clickToExpand}
              </span>
            </div>
          </div>
        </button>
      {/each}
    </div>
  {/snippet}
</Section>
{/if}

<!-- Downloads Section -->
<Section 
  title="{$t.common.download} {app.name}" 
  subtitle={$t.appDetail.chooseDownload}
  background="glass"
>
  {#snippet children()}
    {#if tempDownloadsOff}
      <div class="mb-6 p-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200">
        <p class="font-semibold">{$t.appDetail.downloadsPausedTitle}</p>
        <p class="text-sm mt-1 opacity-90">{$t.appDetail.downloadsPausedReason}</p>
      </div>
    {/if}
    <div
      id="downloads"
      class="glass-card rounded-2xl shadow-xl overflow-visible transition-all duration-300 {tempDownloadsOff ? 'select-none pointer-events-none blur-md opacity-60' : ''}"
    >
      <div class="grid grid-cols-1 lg:grid-cols-4 min-h-[600px]">
        <!-- Sidebar with Versions -->
        <div class="lg:col-span-1 glass border-r border-white/10 p-6 rounded-l-2xl">
          <h3 class="text-lg font-semibold text-white mb-4">{$t.appDetail.versions}</h3>
          <div class="space-y-2">
            {#each appVersions as version, index}
              <button
                class="w-full text-left p-3 rounded-lg transition-all duration-300 ease-in-out {selectedVersion === version ? 'bg-purple-600/30 border border-purple-500/50 text-purple-200 scale-[1.02] shadow-lg shadow-purple-500/20' : 'hover:bg-white/5 border border-transparent text-gray-300 hover:scale-[1.01]'}"
                onclick={() => selectedVersion = version}
              >
                <div class="flex items-center justify-between">
                  <span class="font-medium">v{version.version}</span>
                  {#if index === 0}
                    <span class="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30">{$t.appDetail.latest}</span>
                  {/if}
                </div>
                {#if version.date}
                  <p class="text-xs text-gray-500 mt-1">{version.date}</p>
                {/if}
              </button>
            {/each}
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="lg:col-span-3 p-8">
          {#key selectedVersionNumber}
          <div class="animate-version-change">
          <!-- Version Header -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-2xl font-bold text-white">{$t.common.version} {selectedVersionNumber}</h3>
              <div class="flex items-center gap-2">
                {#if selectedVersionSourceCode}
                  <a
                    href={selectedVersionSourceCode}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-4 py-2 glass-card text-gray-200 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <i class="fas fa-code"></i>
                    {$t.appDetail.sourceCode}
                  </a>
                {/if}
                <button
                  class="px-4 py-2 bg-purple-600/30 text-purple-200 hover:bg-purple-600/50 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 border border-purple-500/30"
                  onclick={() => showModal = true}
                >
                  <i class="fas fa-info-circle"></i>
                  {$t.appDetail.viewDetails}
                </button>
              </div>
            </div>
          </div>

          <!-- Platform Downloads -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each getVersionPlatforms(selectedVersion) as platform}
              {#if platformHasDownloads(platform, selectedVersion)}
              <div class="glass-card rounded-xl p-6 transition-all duration-300 overflow-visible hover:shadow-lg hover:shadow-purple-500/10 {openDropdown === platform ? 'relative z-[100]' : 'relative z-[1]'}">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center mr-4 shadow-lg" style="background: linear-gradient(135deg, {appTintColor}88, {appTintColor}); box-shadow: 0 4px 20px {appTintColor}40;">
                    {#if platform === 'iOS'}
                      <i class="fab fa-apple text-xl text-white"></i>
                    {:else if platform === 'Android'}
                      <i class="fab fa-android text-xl text-white"></i>
                    {:else if platform === 'macOS'}
                      <i class="fab fa-apple text-xl text-white"></i>
                    {:else if platform === 'Linux'}
                      <i class="fab fa-linux text-xl text-white"></i>
                    {:else if platform === 'Windows'}
                      <i class="fab fa-windows text-xl text-white"></i>
                    {:else if platform === 'Web'}
                      <i class="fas fa-globe text-xl text-white"></i>
                    {:else}
                      <i class="fas fa-desktop text-xl text-white"></i>
                    {/if}
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-white">{platform}</h4>
                    <p class="text-sm text-gray-400">
                      {#if platform === 'iOS'}{$t.appDetail.iphoneIpad}
                      {:else if platform === 'Android'}{$t.appDetail.phonesTablets}
                      {:else if platform === 'macOS'}{$t.appDetail.macComputers}
                      {:else if platform === 'Linux'}{$t.appDetail.allDistributions}  
                      {:else if platform === 'Windows'}{$t.appDetail.pcComputers}
                      {:else if platform === 'Web'}{$t.appDetail.anyBrowser}
                      {:else}{$t.appDetail.devices.replace('{platform}', platform)}{/if}
                    </p>
                  </div>
                </div>
                
                <p class="text-sm text-gray-300 mb-4">{getInstallInstructions(platform, selectedVersion)}</p>
                
                <!-- Download button with dropdown -->
                {#if getAllDownloadOptions(platform, selectedVersion).length === 1}
                  <!-- Single download option - just a button -->
                  <Button text={$t.appDetail.downloadPlatform.replace('{platform}', platform)} href={getAllDownloadOptions(platform, selectedVersion)[0]?.url ?? ''} variant="primary" size="sm" />
                {:else if getAllDownloadOptions(platform, selectedVersion).length > 1}
                  <!-- Multiple download options - dropdown button -->
                  <div class="relative dropdown-container" style="z-index: 50;">
                    <button
                      class="inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors cursor-pointer"
                      style="background-color: {appTintColor};"
                      onclick={(e) => toggleDropdown(platform, e)}
                    >
                      <span class="flex items-center gap-2">
                        <i class="fas fa-download"></i>
                        {$t.appDetail.downloadPlatform.replace('{platform}', platform)}
                      </span>
                      <i class="fas fa-chevron-down ml-2 transition-transform {openDropdown === platform ? 'rotate-180' : ''}"></i>
                    </button>
                    
                    {#if openDropdown === platform}
                      <div class="absolute z-[100] mt-2 w-full glass rounded-lg shadow-2xl overflow-hidden animate-dropdown-open" style="position: absolute; z-index: 9999;">
                        {#each getAllDownloadOptions(platform, selectedVersion) as option, i}
                          <a
                            href={option.url}
                            class="block px-4 py-3 text-sm text-gray-200 hover:bg-white/10 border-b border-white/10 last:border-b-0 transition-all duration-200 hover:pl-6 animate-dropdown-item"
                            style="animation-delay: {i * 50}ms;"
                            onclick={() => closeDropdowns()}
                          >
                            <div class="flex items-center gap-2">
                              <i class="fas fa-download text-gray-400"></i>
                              {option.label}
                            </div>
                          </a>
                        {/each}
                      </div>
                    {/if}
                  </div>
                {/if}
              </div>
              {/if}
            {/each}
          </div>
          </div>
          {/key}
        </div>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Version History Section -->
<Section 
  title={$t.appDetail.versionHistory} 
  subtitle={$t.appDetail.updatesAndImprovements}
  background="red"
  centered={true}
>
  {#snippet children()}
    <div class="max-w-4xl mx-auto">
      <div class="space-y-6">
        {#each appVersions as version, index}
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-white">{$t.common.version} {version.version}</h3>
              {#if index === 0}
                <span class="px-3 py-1 bg-yellow-400 text-red-900 text-sm font-medium rounded-full">
                  {$t.appDetail.latest}
                </span>
              {/if}
            </div>
            <div class="version-prose text-red-100 mb-4">
              {@html marked(version.localizedDescription)}
            </div>
            {#if version.date}
              <p class="text-red-200 text-sm">{$t.appDetail.released}: {version.date}</p>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/snippet}
</Section>

<!-- Version Details Modal -->
{#if showModal}
  <div 
    class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center p-4 z-50" 
    role="dialog" 
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
    onclick={() => showModal = false}
    onkeydown={handleModalKeydown}
  >
    <div 
      class="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-700" 
      role="document"
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-700">
        <div class="flex items-center gap-3">
          <img src="{app.iconURL}" alt="{app.name} icon" class="w-12 h-12 rounded-xl" />
          <div>
            <h3 id="modal-title" class="text-xl font-bold text-white">{app.name} v{selectedVersion.version}</h3>
            {#if selectedVersion.date}
              <p class="text-sm text-gray-400">{$t.appDetail.released}: {selectedVersion.date}</p>
            {/if}
          </div>
        </div>
        <button
          class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Close modal"
          onclick={(e) => { e.stopPropagation(); showModal = false; }}
        >
          <i class="fas fa-times text-gray-400"></i>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-6">
        <!-- Version Description -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-white mb-3">{$t.appDetail.whatsNew}</h4>
          <div class="bg-gray-900 border border-gray-700 rounded-lg p-4 modal-prose">
            {@html marked(selectedVersion.localizedDescription)}
          </div>
        </div>

        <!-- Version Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-900 rounded-lg p-4">
            <h5 class="font-medium text-gray-200 mb-2">{$t.appDetail.versionNumber}</h5>
            <p class="text-gray-300">{selectedVersion.version}</p>
          </div>
          {#if selectedVersion.date}
            <div class="bg-gray-900 rounded-lg p-4">
              <h5 class="font-medium text-gray-200 mb-2">{$t.appDetail.releaseDate}</h5>
              <p class="text-gray-300">{selectedVersion.date}</p>
            </div>
          {/if}
          {#if selectedVersion.size}
            <div class="bg-gray-900 rounded-lg p-4">
              <h5 class="font-medium text-gray-200 mb-2">{$t.appDetail.downloadSize}</h5>
              <p class="text-gray-300">{selectedVersion.size}</p>
            </div>
          {/if}
          {#if selectedVersion.minOSVersion}
            <div class="bg-gray-900 rounded-lg p-4">
              <h5 class="font-medium text-gray-200 mb-2">{$t.appDetail.minimumOS}</h5>
              <p class="text-gray-300">{selectedVersion.minOSVersion}</p>
            </div>
          {/if}
        </div>

        <!-- Platform Availability -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-white mb-3">{$t.appDetail.platformAvailability}</h4>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            {#each getVersionPlatforms(selectedVersion) as platform}
              <div class="flex items-center gap-2 bg-green-900/30 border border-green-800 rounded-lg p-3">
                {#if platform === 'iOS'}
                  <i class="fab fa-apple text-green-400"></i>
                {:else if platform === 'Android'}
                  <i class="fab fa-android text-green-400"></i>
                {:else if platform === 'macOS'}
                  <i class="fab fa-apple text-green-400"></i>
                {:else if platform === 'Linux'}
                  <i class="fab fa-linux text-green-400"></i>
                {:else if platform === 'Windows'}
                  <i class="fab fa-windows text-green-400"></i>
                {:else if platform === 'Web'}
                  <i class="fas fa-globe text-green-400"></i>
                {:else}
                  <i class="fas fa-desktop text-green-400"></i>
                {/if}
                <span class="text-green-300 font-medium text-sm">{platform}</span>
              </div>
            {/each}
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-700">
          <button
            class="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            onclick={(e) => { e.stopPropagation(); showModal = false; }}
          >
            {$t.common.close}
          </button>
          {#if selectedVersion.sourceCode}
            <a
              href={selectedVersion.sourceCode}
              target="_blank"
              rel="noopener noreferrer"
              class="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <i class="fas fa-code"></i>
              {$t.appDetail.sourceCode}
            </a>
          {/if}
          <button
            class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
            onclick={(e) => { e.stopPropagation(); showModal = false; document.getElementById('downloads')?.scrollIntoView({behavior: 'smooth'}); }}
          >
            {$t.appDetail.downloadNow}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

{/if}
<!-- End of app && latestVersion && selectedVersion check -->

{/if}
<!-- End of isLoaded check -->

<!-- Image Lightbox (always available for keyboard handling) -->
<svelte:window onkeydown={handleLightboxKeydown} />

{#if isLoaded && showLightbox && app}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-lightbox-open"
    onclick={closeLightbox}
    onkeydown={(e) => e.key === 'Enter' && closeLightbox()}
    role="dialog"
    aria-modal="true"
    aria-label="Image viewer"
    tabindex="-1"
  >
    <!-- Close button -->
    <button 
      class="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors bg-black/30 rounded-full"
      onclick={(e) => { e.stopPropagation(); closeLightbox(); }}
      aria-label="Close image viewer"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    
    <!-- Previous button -->
    {#if screenshots.length > 1}
      <button 
        class="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/80 hover:text-white transition-colors bg-black/30 hover:bg-black/50 rounded-full"
        onclick={(e) => { e.stopPropagation(); prevImage(); }}
        aria-label="Previous image"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <!-- Next button -->
      <button 
        class="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/80 hover:text-white transition-colors bg-black/30 hover:bg-black/50 rounded-full"
        onclick={(e) => { e.stopPropagation(); nextImage(); }}
        aria-label="Next image"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    {/if}
    
    <!-- Image container -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
      class="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center animate-lightbox-image"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <img 
        src={lightboxImageUrl} 
        alt="{appName} screenshot {lightboxIndex + 1}"
        class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
      />
    </div>
    
    <!-- Image counter -->
    {#if screenshots.length > 1}
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 text-white text-sm rounded-full">
        {lightboxIndex + 1} / {screenshots.length}
      </div>
    {/if}
  </div>
{/if}

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  :global(.animate-fadeIn) {
    animation: fadeIn 0.3s ease-out forwards;
  }
  
  /* Version History Markdown Styling */
  :global(.version-prose h1),
  :global(.version-prose h2),
  :global(.version-prose h3),
  :global(.version-prose h4),
  :global(.version-prose h5),
  :global(.version-prose h6) {
    color: #ffffff;
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  
  :global(.version-prose h1) { font-size: 1.25rem; }
  :global(.version-prose h2) { font-size: 1.125rem; }
  :global(.version-prose h3) { font-size: 1rem; }
  
  :global(.version-prose p) {
    margin-bottom: 0.75rem;
    line-height: 1.6;
  }
  
  :global(.version-prose ul),
  :global(.version-prose ol) {
    margin-left: 1.5rem;
    margin-bottom: 0.75rem;
  }
  
  :global(.version-prose ul) {
    list-style-type: disc;
  }
  
  :global(.version-prose ol) {
    list-style-type: decimal;
  }
  
  :global(.version-prose li) {
    margin-bottom: 0.375rem;
    line-height: 1.5;
  }
  
  :global(.version-prose strong) {
    font-weight: 600;
    color: #fef08a;
  }
  
  :global(.version-prose em) {
    font-style: italic;
  }
  
  :global(.version-prose code) {
    background-color: rgba(255, 255, 255, 0.15);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-family: 'Courier New', monospace;
    color: #fef08a;
  }
  
  :global(.version-prose a) {
    color: #fef08a;
    text-decoration: underline;
  }
  
  :global(.version-prose a:hover) {
    color: #fde047;
  }
  
  :global(.version-prose blockquote) {
    border-left: 3px solid rgba(255, 255, 255, 0.3);
    padding-left: 1rem;
    margin-left: 0;
    margin-bottom: 0.75rem;
    font-style: italic;
    color: #fecaca;
  }

  /* Version change animation */
  .animate-version-change {
    animation: versionFadeIn 0.3s ease-out;
  }

  @keyframes versionFadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Dropdown animations */
  .animate-dropdown-open {
    animation: dropdownSlideIn 0.2s ease-out;
    transform-origin: top;
  }

  @keyframes dropdownSlideIn {
    from {
      opacity: 0;
      transform: scaleY(0.8) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scaleY(1) translateY(0);
    }
  }

  .animate-dropdown-item {
    animation: dropdownItemFadeIn 0.2s ease-out forwards;
    opacity: 0;
  }

  @keyframes dropdownItemFadeIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Lightbox animations */
  .animate-lightbox-open {
    animation: lightboxFadeIn 0.3s ease-out;
  }

  @keyframes lightboxFadeIn {
    from {
      opacity: 0;
      backdrop-filter: blur(0px);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(12px);
    }
  }

  .animate-lightbox-image {
    animation: lightboxImageZoom 0.3s ease-out;
  }

  @keyframes lightboxImageZoom {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>