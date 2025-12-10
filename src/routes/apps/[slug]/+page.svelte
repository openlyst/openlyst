<script lang="ts">
  import { Section, Button, Skeleton } from '$lib';
  import type { PageData } from './$types';
  import { marked } from 'marked';
  import { onMount } from 'svelte';
  
  export let data: PageData;
  
  let isLoaded = false;
  let app: typeof data.app;
  let latestVersion: typeof data.app.versions[0];
  
  // State for version selection and modal visibility
  let selectedVersion: typeof data.app.versions[0];
  let showModal = false;
  
  // State for download selections per platform
  let downloadSelections: Record<string, { type?: string; arch?: string }> = {};
  
  // State for image lightbox
  let showLightbox = false;
  let lightboxImageUrl = '';
  let lightboxIndex = 0;
  
  onMount(() => {
    setTimeout(() => {
      app = data.app;
      latestVersion = app.versions[0];
      selectedVersion = latestVersion;
      isLoaded = true;
    }, 100);
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
  function getVersionPlatforms(version = latestVersion): string[] {
    return version.platforms || app.platforms;
  }
  
  // Function to get platform-specific installation instructions
  function getInstallInstructions(platform: string, version = latestVersion): string {
    return version.platformInstall[platform as keyof typeof version.platformInstall] || 'Installation instructions not available';
  }
  
  // Check if a platform has any available downloads
  function platformHasDownloads(platform: string, version = selectedVersion): boolean {
    const downloads = (version.downloads as any)?.[platform] || (version.downloadURLs as any)?.[platform];
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
  function getDownloadStructure(platform: string, version = selectedVersion): any {
    return (version.downloads as any)?.[platform] || (version.downloadURLs as any)?.[platform] || null;
  }
  
  // Get available types for a platform (e.g., zip, deb, rpm for Linux)
  function getAvailableTypes(platform: string, version = selectedVersion): string[] {
    const downloads = getDownloadStructure(platform, version);
    if (!downloads || typeof downloads === 'string') return [];
    
    // For platforms like Linux with type > arch structure
    const types = Object.keys(downloads).filter(key => {
      const value = downloads[key];
      return typeof value === 'object' && hasAnyDownload(value);
    });
    
    return types;
  }
  
  // Get available architectures for a platform/type
  function getAvailableArchs(platform: string, type?: string, version = selectedVersion): string[] {
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
  function getDownloadUrl(platform: string, version = selectedVersion): string | null {
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
      'pkg': 'PKG'
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
  
  function getAllDownloadOptions(platform: string, version = selectedVersion): DownloadOption[] {
    const downloads = getDownloadStructure(platform, version);
    if (!downloads) return [];
    
    // Simple string URL
    if (typeof downloads === 'string' && downloads) {
      return [{ label: `Download ${platform}`, url: downloads }];
    }
    
    const options: DownloadOption[] = [];
    const types = getAvailableTypes(platform, version);
    
    if (types.length > 0) {
      // Platform has type structure (like Linux with zip/deb/rpm or Android with apk/aab)
      for (const type of types) {
        const typeObj = downloads[type];
        if (typeof typeObj === 'string' && typeObj) {
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
  let openDropdown: string | null = null;
  
  function toggleDropdown(platform: string) {
    openDropdown = openDropdown === platform ? null : platform;
  }
  
  function closeDropdowns() {
    openDropdown = null;
  }
  
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
  
  $: screenshots = isLoaded ? getScreenshots() : [];
</script>

<svelte:head>
  <title>{isLoaded ? app.name : 'Loading...'} - OpenLyst</title>
  <meta name="description" content="{isLoaded ? app.localizedDescription : 'Loading app details...'}" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
</svelte:head>

{#if !isLoaded}
  <!-- Loading State -->
  <section class="bg-gradient-to-br from-purple-600 via-red-600 to-red-700 text-white py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div class="flex items-center mb-4">
            <div class="w-16 h-16 bg-white/20 rounded-2xl mr-4 animate-pulse"></div>
            <div class="flex-1">
              <div class="h-10 bg-white/20 rounded-lg w-48 animate-pulse mb-2"></div>
              <div class="h-6 bg-white/20 rounded-lg w-64 animate-pulse"></div>
            </div>
          </div>
          <div class="space-y-3 mb-8">
            <div class="h-5 bg-white/20 rounded animate-pulse"></div>
            <div class="h-5 bg-white/20 rounded animate-pulse w-5/6"></div>
            <div class="h-5 bg-white/20 rounded animate-pulse w-4/6"></div>
          </div>
          <div class="flex gap-4">
            <div class="h-12 w-40 bg-white/20 rounded-lg animate-pulse"></div>
            <div class="h-12 w-40 bg-white/20 rounded-lg animate-pulse"></div>
          </div>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div class="space-y-4">
            {#each Array(4) as _}
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
                <div class="h-5 bg-white/20 rounded w-32 animate-pulse"></div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <Section title="Loading..." subtitle="Please wait while we load the app details" background="default">
    {#snippet children()}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each Array(3) as _}
          <div class="bg-gray-800 rounded-lg h-64 animate-pulse"></div>
        {/each}
      </div>
    {/snippet}
  </Section>
{:else}

<!-- Deprecation Warning Banner -->
{#if app.deprecated}
<div class="bg-yellow-500 text-yellow-900">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
    <div class="flex items-center justify-center gap-3">
      <svg class="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      <div class="text-center">
        <p class="font-bold">This app has been deprecated</p>
        <p class="text-sm">This application is no longer maintained and will not receive updates. Consider using an alternative.</p>
      </div>
      <a href="/apps" class="ml-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap">
        View Active Apps
      </a>
    </div>
  </div>
</div>
{/if}

<!-- Hero Section -->
<section class="bg-gradient-to-br from-purple-600 via-red-600 to-red-700 text-white py-20">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div class="animate-fadeIn">
        <div class="flex items-center mb-4">
          <img src="{app.iconURL}" alt="{app.name} icon" class="w-16 h-16 rounded-2xl mr-4" />
          <div>
            <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
              {app.name}
            </h1>
            <p class="text-xl text-red-100 mt-2">{app.subtitle}</p>
          </div>
        </div>
        
        <p class="text-lg text-red-100 mb-8">
          {app.localizedDescription}
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4">
          <Button text="Download Now" href="#downloads" variant="secondary" size="lg" />
          <Button text="View Screenshots" href="#screenshots" variant="outline" size="lg" />
        </div>
        
        <div class="mt-6 flex items-center">
          <span class="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-200">
            v{latestVersion.version}
          </span>
          <span class="ml-4 text-red-100">🚀 Latest Release</span>
        </div>
      </div>
      
      <div class="relative">
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div class="space-y-4">
            {#each app.platforms as platform}
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-green-400 rounded-full"></div>
                <span>Available on {platform}</span>
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
  title="Screenshots" 
  subtitle="See {app.name} in action"
  background="default"
>
  {#snippet children()}
    <div id="screenshots" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each screenshots.slice(0, 6) as screenshot, index}
        <button 
          class="bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-red-900/20 transition-shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          on:click={() => openLightbox(screenshot.imageURL || screenshot, index)}
        >
          <img 
            src="{screenshot.imageURL || screenshot}" 
            alt="{app.name} screenshot {index + 1}" 
            class="w-full h-64 sm:h-80 object-cover"
          />
        </button>
      {/each}
    </div>
  {/snippet}
</Section>
{/if}

<!-- Downloads Section -->
<Section 
  title="Download {app.name}" 
  subtitle="Choose your version and platform"
  background="default"
>
  {#snippet children()}
    <div id="downloads" class="bg-gray-800 rounded-2xl shadow-xl border border-red-900 overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-4 min-h-[600px]">
        <!-- Sidebar with Versions -->
        <div class="lg:col-span-1 bg-gray-900 border-r border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Versions</h3>
          <div class="space-y-2">
            {#each app.versions as version, index}
              <button
                class="w-full text-left p-3 rounded-lg transition-colors {index === 0 ? 'bg-red-900/50 border border-red-700 text-red-200' : 'hover:bg-gray-800 border border-transparent text-gray-300'}"
                on:click={() => selectedVersion = version}
              >
                <div class="flex items-center justify-between">
                  <span class="font-medium">v{version.version}</span>
                  {#if index === 0}
                    <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Latest</span>
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
          <!-- Version Header -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-2xl font-bold text-white">Version {selectedVersion.version}</h3>
              <div class="flex items-center gap-2">
                {#if selectedVersion.sourceCode}
                  <a
                    href={selectedVersion.sourceCode}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-4 py-2 bg-gray-700 text-gray-200 hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <i class="fas fa-code"></i>
                    Source Code
                  </a>
                {/if}
                <button
                  class="px-4 py-2 bg-red-900/50 text-red-200 hover:bg-red-900 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                  on:click={() => showModal = true}
                >
                  <i class="fas fa-info-circle"></i>
                  View Details
                </button>
              </div>
            </div>
          </div>

          <!-- Platform Downloads -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each getVersionPlatforms(selectedVersion) as platform}
              {#if platformHasDownloads(platform, selectedVersion)}
              <div class="border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-red-900/10 transition-shadow bg-gray-900">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style="background: linear-gradient(135deg, {app.tintColor}88, {app.tintColor});">
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
                      {#if platform === 'iOS'}iPhone and iPad
                      {:else if platform === 'Android'}Phones and tablets
                      {:else if platform === 'macOS'}Mac computers
                      {:else if platform === 'Linux'}All distributions  
                      {:else if platform === 'Windows'}PC computers
                      {:else if platform === 'Web'}Any web browser
                      {:else}{platform} devices{/if}
                    </p>
                  </div>
                </div>
                
                <p class="text-sm text-gray-300 mb-4">{getInstallInstructions(platform, selectedVersion)}</p>
                
                <!-- Download button with dropdown -->
                {#if getAllDownloadOptions(platform, selectedVersion).length === 1}
                  <!-- Single download option - just a button -->
                  <Button text="Download {platform}" href="{getAllDownloadOptions(platform, selectedVersion)[0].url}" variant="primary" size="sm" />
                {:else if getAllDownloadOptions(platform, selectedVersion).length > 1}
                  <!-- Multiple download options - dropdown button -->
                  <div class="relative">
                    <button
                      class="inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                      style="background-color: {app.tintColor};"
                      on:click={() => toggleDropdown(platform)}
                    >
                      <span class="flex items-center gap-2">
                        <i class="fas fa-download"></i>
                        Download {platform}
                      </span>
                      <i class="fas fa-chevron-down ml-2 transition-transform {openDropdown === platform ? 'rotate-180' : ''}"></i>
                    </button>
                    
                    {#if openDropdown === platform}
                      <div class="absolute z-10 mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                        {#each getAllDownloadOptions(platform, selectedVersion) as option}
                          <a
                            href={option.url}
                            class="block px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 border-b border-gray-700 last:border-b-0 transition-colors"
                            on:click={() => closeDropdowns()}
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
      </div>
    </div>
  {/snippet}
</Section>

<!-- Version History Section -->
<Section 
  title="Version History" 
  subtitle="Latest updates and improvements"
  background="red"
  centered={true}
>
  {#snippet children()}
    <div class="max-w-4xl mx-auto">
      <div class="space-y-6">
        {#each app.versions as version, index}
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-white">Version {version.version}</h3>
              {#if index === 0}
                <span class="px-3 py-1 bg-yellow-400 text-red-900 text-sm font-medium rounded-full">
                  Latest
                </span>
              {/if}
            </div>
            <p class="text-red-100 mb-4">{version.localizedDescription}</p>
            {#if version.date}
              <p class="text-red-200 text-sm">Released: {version.date}</p>
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
    on:click={() => showModal = false}
    on:keydown={handleModalKeydown}
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
              <p class="text-sm text-gray-400">Released: {selectedVersion.date}</p>
            {/if}
          </div>
        </div>
        <button
          class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Close modal"
          on:click={() => showModal = false}
        >
          <i class="fas fa-times text-gray-400"></i>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-6">
        <!-- Version Description -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-white mb-3">What's New</h4>
          <div class="bg-gray-900 border border-gray-700 rounded-lg p-4 modal-prose">
            {@html marked(selectedVersion.localizedDescription)}
          </div>
        </div>

        <!-- Version Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-900 rounded-lg p-4">
            <h5 class="font-medium text-gray-200 mb-2">Version Number</h5>
            <p class="text-gray-300">{selectedVersion.version}</p>
          </div>
          {#if selectedVersion.date}
            <div class="bg-gray-900 rounded-lg p-4">
              <h5 class="font-medium text-gray-200 mb-2">Release Date</h5>
              <p class="text-gray-300">{selectedVersion.date}</p>
            </div>
          {/if}
          {#if selectedVersion.size}
            <div class="bg-gray-900 rounded-lg p-4">
              <h5 class="font-medium text-gray-200 mb-2">Download Size</h5>
              <p class="text-gray-300">{selectedVersion.size}</p>
            </div>
          {/if}
          {#if selectedVersion.minOSVersion}
            <div class="bg-gray-900 rounded-lg p-4">
              <h5 class="font-medium text-gray-200 mb-2">Minimum OS</h5>
              <p class="text-gray-300">{selectedVersion.minOSVersion}</p>
            </div>
          {/if}
        </div>

        <!-- Platform Availability -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-white mb-3">Platform Availability</h4>
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
            on:click={() => showModal = false}
          >
            Close
          </button>
          {#if selectedVersion.sourceCode}
            <a
              href={selectedVersion.sourceCode}
              target="_blank"
              rel="noopener noreferrer"
              class="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <i class="fas fa-code"></i>
              Source Code
            </a>
          {/if}
          <button
            class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
            on:click={() => {showModal = false; document.getElementById('downloads')?.scrollIntoView({behavior: 'smooth'});}}
          >
            Download Now
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Image Lightbox -->
<svelte:window on:keydown={handleLightboxKeydown} />

{#if showLightbox}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
    on:click={closeLightbox}
    on:keydown={(e) => e.key === 'Enter' && closeLightbox()}
    role="dialog"
    aria-modal="true"
    aria-label="Image viewer"
    tabindex="-1"
  >
    <!-- Close button -->
    <button 
      class="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors bg-black/30 rounded-full"
      on:click={closeLightbox}
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
        on:click|stopPropagation={prevImage}
        aria-label="Previous image"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <!-- Next button -->
      <button 
        class="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/80 hover:text-white transition-colors bg-black/30 hover:bg-black/50 rounded-full"
        on:click|stopPropagation={nextImage}
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
      class="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
      on:click|stopPropagation={() => {}}
      on:keydown|stopPropagation={() => {}}
    >
      <img 
        src={lightboxImageUrl} 
        alt="{app.name} screenshot {lightboxIndex + 1}"
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