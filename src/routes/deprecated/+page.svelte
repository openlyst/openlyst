<script lang="ts">
  import { Section, AppCard, Skeleton } from '$lib';
  import { getDeprecatedApps } from '$lib/services/dataService';
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
          const fetchedApps = await getDeprecatedApps(lang);
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
  <title>{$t.deprecated.title} - OpenLyst</title>
  <meta name="description" content={$t.deprecated.subtitle} />
</svelte:head>

<!-- Hero Section -->
<section class="relative text-white overflow-hidden min-h-[60vh] flex items-center">
  <div class="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 sm:px-6 lg:px-8 text-center">
    <div class="text-6xl mb-6">📦</div>
    <h1 class="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
      {$t.deprecated.title}
    </h1>
    <p class="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
      {$t.deprecated.subtitle}
    </p>
    <div class="flex items-center justify-center">
      <span class="glass-card px-4 py-2 text-yellow-300 text-lg font-medium rounded-full">
        ⚠️ {$t.deprecated.noLongerMaintained}
      </span>
    </div>
  </div>
</section>

<!-- Deprecated Apps Grid Section -->
<Section 
  title={$t.deprecated.discontinuedApps}
  subtitle={$t.deprecated.discontinuedDesc}
  background="default"
>
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#if !isLoaded}
        <!-- Skeleton loading state -->
        {#each Array(3) as _}
          <Skeleton variant="card" />
        {/each}
      {:else}
        {#each apps as app}
          <div class="relative animate-fadeIn">
            <div class="absolute -top-2 -right-2 z-10">
              <span class="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full shadow-lg">
                {$t.deprecated.deprecatedBadge}
              </span>
            </div>
            <AppCard 
              title={app.name}
              description={app.localizedDescription}
              href={`/apps/${app.slug}`}
              status="released"
              platforms={app.platforms}
              image={app.iconURL}
            />
          </div>
        {/each}
      {/if}
    </div>
    
    {#if isLoaded && apps.length === 0}
      <div class="text-center py-12">
        <div class="text-6xl mb-4">✨</div>
        <h3 class="text-2xl font-semibold text-white mb-2">{$t.deprecated.noDeprecated}</h3>
        <p class="text-gray-400 max-w-md mx-auto">
          {$t.deprecated.noDeprecatedDesc}
        </p>
      </div>
    {/if}
    
    <div class="mt-12 text-center">
      <a 
        href="/apps" 
        class="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
      >
        <svg class="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {$t.deprecated.viewActiveApps}
      </a>
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
