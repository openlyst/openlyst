<script lang="ts">
  import { Section, AppCard, Button, Skeleton } from '$lib';
  import { getActiveApps, getAllNews, getRepoConfig, nameToSlug } from '$lib/services/dataService';
  import favicon from '$lib/assets/favicon.svg';
  import { t, language, type SupportedLanguage } from '$lib/stores/language';
  import { browser } from '$app/environment';
  import type { App, NewsItem, RepoConfig } from '$lib/types/repo';
  import Button3D from '$lib/components/Button3D.svelte';
  import PlatformIcons from '$lib/components/PlatformIcons.svelte';
  import { get } from 'svelte/store';
  
  let { data } = $props();
  
  // Initialize immediately from SSR data to avoid flash of unstyled content
  let isLoaded = $state(true);
  let apps = $state<App[]>(data.apps || []);
  let featuredApps = $state<App[]>(data.featuredApps?.filter((a): a is App => a !== undefined) || []);
  let news = $state<NewsItem[]>(data.news || []);
  let config = $state<RepoConfig | undefined>(data.config);
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
          const [fetchedApps, fetchedConfig, fetchedNews] = await Promise.all([
            getActiveApps(lang),
            getRepoConfig(lang),
            getAllNews(lang)
          ]);
          apps = fetchedApps;
          config = fetchedConfig;
          news = fetchedNews;
          
          // Get featured apps
          featuredApps = (fetchedConfig.featuredApps || [])
            .map((featuredId: string) => fetchedApps.find((app: App) => 
              app.bundleIdentifier === featuredId || 
              nameToSlug(app.name) === featuredId
            ))
            .filter(Boolean) as App[];
        } catch (e) {
          console.error('Error fetching data:', e);
        } finally {
          isRefreshing = false;
        }
      }
    });
    
    return () => unsubscribe();
  });
</script>

<svelte:head>
  <title>OpenLyst - {$t.home.title}</title>
  <meta name="description" content={$t.home.subtitle} />
</svelte:head>

<!-- Hero Section -->
<section class="relative text-white overflow-hidden min-h-screen flex items-center">
  <div class="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 sm:px-6 lg:px-8">
    <div class="text-center">
      <!-- Interactive Platform icons bar -->
      <PlatformIcons />
      
      <h1 class="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
        {$t.home.title}
      </h1>
      
      <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
        {$t.home.subtitle}
      </p>
      
      <div class="mt-10 flex items-center justify-center gap-x-6 flex-wrap">
        <Button3D text={$t.home.exploreApps} href="/apps" variant="secondary" size="lg" />
        <Button3D text={$t.home.joinMovement} href="/contribute" variant="outline" size="lg" />
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
      <div class="glass-card rounded-xl p-6 text-center">
        <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">{$t.home.privacyFirst}</h3>
        <p class="text-gray-400">{$t.home.privacyDesc}</p>
      </div>
      
      <div class="glass-card rounded-xl p-6 text-center">
        <div class="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">{$t.home.communityDriven}</h3>
        <p class="text-gray-400">{$t.home.communityDesc}</p>
      </div>
      
      <div class="glass-card rounded-xl p-6 text-center">
        <div class="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/30">
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

<!-- News Section -->
<Section
  title={$t.home.latestNews}
  subtitle={$t.home.latestNewsDesc}
  background="default"
>
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
      {#if news.length > 0}
        {#each news.slice(0, 4) as item}
          <article class="glass-card rounded-xl p-6">
            <div class="flex items-center justify-between gap-4 mb-3">
              <h3 class="text-lg font-semibold text-white">{item.title}</h3>
              <span class="text-xs text-gray-400 whitespace-nowrap">{item.date}</span>
            </div>
            <p class="text-gray-300 text-sm leading-relaxed">{item.caption}</p>
            {#if item.url}
              <div class="mt-4">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-cyan-300 hover:text-cyan-200 text-sm font-medium"
                >
                  {$t.home.readMore}
                </a>
              </div>
            {/if}
          </article>
        {/each}
      {:else}
        <div class="col-span-full text-center py-8 text-gray-400">
          {$t.home.noNewsYet}
        </div>
      {/if}
    </div>

    <div class="mt-10 text-center">
      <Button text={$t.home.viewAllNews} href="/news" variant="secondary" />
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
              title={app.name}
              description={app.localizedDescription}
              status={app.versions[0]?.version.includes('beta') ? 'beta' : 'released'}
              platforms={app.platforms}
              href={`/apps/${app.slug}`}
              image={app.iconURL}
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
