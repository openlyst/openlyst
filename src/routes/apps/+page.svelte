<script lang="ts">
  import { Section, AppCard, Skeleton } from '$lib';
  import { getActiveApps } from '$lib/services/dataService';
  import type { PageData } from './$types';
  import type { App } from '$lib/types/repo';
  import { t, language, type SupportedLanguage } from '$lib/stores/language';
  import { browser } from '$app/environment';
  import { get } from 'svelte/store';
  
  let { data }: { data: PageData } = $props();
  
  // Initialize immediately from SSR data to avoid flash of unstyled content
  let isLoaded = $state(true);
  let apps = $state<App[]>(data.apps || []);
  let currentLang = $state<SupportedLanguage>(get(language));
  let isRefreshing = $state(false);
  
  // Subscribe to language changes and reload data (only on client-side language changes)
  $effect(() => {
    if (!browser) return;
    
    const unsubscribe = language.subscribe(async (lang) => {
      // Skip if same language and we already have data
      if (lang === currentLang && apps.length > 0) return;
      
      // Skip if we're already refreshing
      if (isRefreshing) return;
      
      const prevLang = currentLang;
      currentLang = lang;
      
      // Only fetch new data if language actually changed (not on initial subscribe)
      if (prevLang !== lang && apps.length > 0) {
        isRefreshing = true;
        try {
          const fetchedApps = await getActiveApps(lang);
          apps = fetchedApps;
        } catch (e) {
          console.error('Error fetching apps:', e);
        } finally {
          isRefreshing = false;
        }
      }
    });
    
    return () => unsubscribe();
  });
</script>

<svelte:head>
  <title>{$t.apps.title} - OpenLyst</title>
  <meta name="description" content={$t.apps.subtitle} />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-purple-600 via-red-600 to-red-700 text-white py-20">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
    <h1 class="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
      {$t.apps.title}
    </h1>
    <p class="text-xl text-red-100 max-w-3xl mx-auto mb-8">
      {$t.apps.subtitle}
    </p>
    <div class="flex items-center justify-center">
      <span class="px-4 py-2 bg-green-100 text-green-800 text-lg font-medium rounded-full border border-green-200">
        ✊ {$t.apps.powerToThePeople}
      </span>
    </div>
  </div>
</section>

<!-- Apps Grid Section -->
<Section 
  title={$t.apps.ourApps}
  subtitle={$t.apps.ourAppsDesc}
  background="default"
>
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#if !isLoaded}
        <!-- Skeleton loading state -->
        {#each Array(6) as _}
          <Skeleton variant="card" />
        {/each}
      {:else}
        {#each apps as app}
          <div class="animate-fadeIn">
            <AppCard 
              title={app.name}
              description={app.localizedDescription}
              href={`/apps/${app.slug}`}
              status={app.versions[0]?.version.includes('beta') ? 'beta' : 'released'}
              platforms={app.platforms}
              image={app.iconURL}
              tintColor={app.tintColor}
            />
          </div>
        {/each}
      {/if}
    </div>
    
    {#if isLoaded && apps.length === 0}
      <div class="text-center py-12">
        <div class="text-6xl mb-4">📱</div>
        <h3 class="text-2xl font-semibold text-white mb-2">{$t.apps.noAppsYet}</h3>
        <p class="text-gray-400 max-w-md mx-auto">
          {$t.apps.noAppsDesc}
        </p>
      </div>
    {/if}
    
    <!-- Link to deprecated apps -->
    <div class="mt-12 text-center">
      <p class="text-gray-400 text-sm mb-3">{$t.apps.cantFind}</p>
      <a 
        href="/deprecated" 
        class="inline-flex items-center text-gray-300 hover:text-red-400 transition-colors text-sm font-medium"
      >
        <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {$t.apps.checkDeprecated}
      </a>
    </div>
  {/snippet}
</Section>

<!-- Call to Action -->
<Section 
  title={$t.apps.wantToContribute}
  subtitle={$t.apps.wantToContributeDesc}
  background="red"
  centered={true}
>
  {#snippet children()}
    <div class="text-center">
      <p class="text-lg text-red-100 mb-8 max-w-2xl mx-auto">
        {$t.apps.contributeText}
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a 
          href="/contribute" 
          class="inline-flex items-center px-6 py-3 border border-white text-white font-medium rounded-lg hover:bg-white hover:text-red-600 transition-colors"
        >
          {$t.apps.getInvolved}
        </a>
        <a 
          href="https://gitlab.com/openlyst" 
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center px-6 py-3 bg-yellow-400 text-red-900 font-medium rounded-lg hover:bg-yellow-300 transition-colors"
        >
          {$t.apps.viewSourceCode}
        </a>
      </div>
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