<script lang="ts">
  import { Section, Button } from '$lib';
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  const { app } = data;
  const latestVersion = app.versions[0];
  
  // Function to get platform-specific installation instructions
  function getInstallInstructions(platform: string): string {
    return latestVersion.platformInstall[platform as keyof typeof latestVersion.platformInstall] || 'Installation instructions not available';
  }
  
  // Function to format screenshots
  function getScreenshots() {
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
  
  const screenshots = getScreenshots();
</script>

<svelte:head>
  <title>{app.name} - OpenLyst</title>
  <meta name="description" content="{app.localizedDescription}" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-purple-600 via-red-600 to-red-700 text-white py-20">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
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
      {#each screenshots.slice(0, 6) as screenshot}
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <img 
            src="{screenshot.imageURL || screenshot}" 
            alt="{app.name} screenshot" 
            class="w-full h-64 sm:h-80 object-cover"
          />
        </div>
      {/each}
    </div>
  {/snippet}
</Section>
{/if}

<!-- Downloads Section -->
<Section 
  title="Download {app.name}" 
  subtitle="Available on all your favorite platforms"
  background="default"
>
  {#snippet children()}
    <div id="downloads" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {#each app.platforms as platform}
        <!-- Platform Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background: linear-gradient(135deg, {app.tintColor}88, {app.tintColor});">
              {#if platform === 'iOS'}
                <i class="fab fa-apple text-2xl text-white"></i>
              {:else if platform === 'Android'}
                <i class="fab fa-android text-2xl text-white"></i>
              {:else if platform === 'macOS'}
                <i class="fab fa-apple text-2xl text-white"></i>
              {:else if platform === 'Linux'}
                <i class="fab fa-linux text-2xl text-white"></i>
              {:else if platform === 'Windows'}
                <i class="fab fa-windows text-2xl text-white"></i>
              {:else}
                <i class="fas fa-desktop text-2xl text-white"></i>
              {/if}
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">
              {platform} 
              <span class="ml-2 inline-block align-middle text-sm bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">v{latestVersion.version}</span>
            </h3>
            <p class="text-gray-500">
              {#if platform === 'iOS'}iPhone and iPad
              {:else if platform === 'Android'}Phones and tablets
              {:else if platform === 'macOS'}Mac computers
              {:else if platform === 'Linux'}All distributions  
              {:else if platform === 'Windows'}PC computers
              {:else}{platform} devices{/if}
            </p>
          </div>
          
          <div class="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <div class="text-center">
              <h4 class="font-semibold text-gray-900 mb-2">Installation</h4>
              <p class="text-sm text-gray-700 mb-4">{getInstallInstructions(platform)}</p>
              {#if latestVersion.downloadURL}
                <Button text="Download" href="{latestVersion.downloadURL}" variant="primary" size="md" />
              {:else}
                <Button text="Get {platform} Version" href="#" variant="primary" size="md" />
              {/if}
            </div>
          </div>
        </div>
      {/each}
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