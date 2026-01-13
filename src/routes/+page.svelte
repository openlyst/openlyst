<script lang="ts">
  import { Section, AppCard, Button, Skeleton } from '$lib';
  import { nameToSlug } from '$lib/services/dataService';
  import favicon from '$lib/assets/favicon.svg';
  import { onMount } from 'svelte';
  import { t } from '$lib/stores/language';
  
  export let data;
  
  let isLoaded = false;
  let apps: typeof data.apps = [];
  let featuredApps: typeof data.featuredApps = [];
  let config: typeof data.config;
  
  onMount(() => {
    // Simulate async content loading for smooth transition
    setTimeout(() => {
      apps = data.apps;
      featuredApps = data.featuredApps;
      config = data.config;
      isLoaded = true;
    }, 100);
  });
</script>

<svelte:head>
  <title>OpenLyst - {$t.home.title}</title>
  <meta name="description" content={$t.home.subtitle} />
</svelte:head>

<!-- Hero Section -->
<section class="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white overflow-hidden min-h-screen flex items-center">
  <!-- Decorative circles like in the header -->
  <div class="absolute inset-0">
    <div class="absolute top-20 left-20 w-8 h-8 bg-yellow-400 rounded-full opacity-30"></div>
    <div class="absolute top-32 right-32 w-12 h-12 bg-orange-400 rounded-full opacity-25"></div>
    <div class="absolute bottom-40 left-32 w-6 h-6 bg-yellow-300 rounded-full opacity-35"></div>
    <div class="absolute bottom-20 right-20 w-10 h-10 bg-orange-300 rounded-full opacity-20"></div>
    <div class="absolute top-1/3 left-1/4 w-4 h-4 bg-yellow-500 rounded-full opacity-40"></div>
    <div class="absolute top-2/3 right-1/3 w-8 h-8 bg-orange-500 rounded-full opacity-30"></div>
  </div>
  
  <div class="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 sm:px-6 lg:px-8">
    <div class="text-center">
      <!-- Platform icons bar like in the header -->
      <div class="mb-8 flex justify-center">
        <div class="bg-blue-500 bg-opacity-80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-2xl">
          <div class="flex items-center space-x-4">
            <!-- iOS circle -->
            <div class="w-8 h-8 bg-green-400 rounded-full"></div>
            <!-- Android rounded square -->
            <div class="w-8 h-8 bg-orange-400 rounded-lg"></div>
            <!-- Desktop hexagon -->
            <div class="w-8 h-8 bg-red-400 rounded"></div>
            <!-- Additional platform indicators -->
            <div class="w-8 h-8 bg-green-500 rounded-full"></div>
            <div class="w-8 h-8 bg-yellow-400 rounded-full"></div>
            <div class="w-8 h-8 bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
      
      <h1 class="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
        {$t.home.title}
      </h1>
      
      <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-red-100">
        {$t.home.subtitle}
      </p>
      
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <Button text={$t.home.exploreApps} href="/apps" variant="secondary" size="lg" />
        <Button text={$t.home.joinMovement} href="/contribute" variant="outline" size="lg" />
      </div>
    </div>
  </div>
</section>

<!-- Mission Section -->
<Section 
  title={$t.home.powerToThePeople}
  subtitle={$t.home.powerDescription}
  centered={true}
>
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      <div class="text-center">
        <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">{$t.home.privacyFirst}</h3>
        <p class="text-gray-400">{$t.home.privacyDesc}</p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">{$t.home.communityDriven}</h3>
        <p class="text-gray-400">{$t.home.communityDesc}</p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">{$t.home.openSource}</h3>
        <p class="text-gray-400">{$t.home.openSourceDesc}</p>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Applications Section -->
<Section 
  title={$t.home.ourApps}
  subtitle={$t.home.ourAppsDesc}
  background="default"
>
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
      {#if !isLoaded}
        <!-- Skeleton loading state -->
        {#each Array(4) as _}
          <Skeleton variant="card" />
        {/each}
      {:else}
        {#each apps as app}
          <div class="animate-fadeIn">
            <AppCard
              title="{app.name}"
              description="{app.localizedDescription}"
              status="{app.versions[0]?.version.includes('beta') ? 'beta' : 'released'}"
              platforms="{app.platforms}"
              href="/apps/{nameToSlug(app.name)}"
              image="{app.iconURL}"
            />
          </div>
        {/each}
        
        {#if apps.length === 0}
          <!-- Fallback content if no apps are loaded -->
          <div class="col-span-full text-center py-12">
            <div class="text-6xl mb-4">🚀</div>
            <h3 class="text-2xl font-semibold text-white mb-2">{$t.home.comingSoon}</h3>
            <p class="text-gray-400 max-w-md mx-auto">
              {$t.home.comingSoonDesc}
            </p>
          </div>
        {/if}
      {/if}
    </div>
    
    <div class="mt-12 text-center">
      <p class="text-gray-400 mb-6">{$t.home.moreAppsComing}</p>
      <Button text={$t.home.viewAllApps} href="/apps" variant="primary" />
    </div>
  {/snippet}
</Section>

<!-- Call to Action -->
<Section 
  title={$t.home.joinRevolution}
  subtitle={$t.home.joinRevolutionDesc}
  background="red"
  centered={true}
>
  {#snippet children()}
    <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
      <Button text={$t.home.startContributing} href="/contribute" variant="secondary" size="lg" />
      <Button text={$t.home.downloadApps} href="/apps" variant="outline" size="lg" />
    </div>
    
    <div class="mt-12 text-center">
      <p class="text-red-100 text-lg font-medium">
        {$t.home.quote}
      </p>
      <p class="text-red-200 mt-2">{$t.home.quoteAuthor}</p>
    </div>
  {/snippet}
</Section>

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
</style>
