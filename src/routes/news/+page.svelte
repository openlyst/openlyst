<script lang="ts">
  import { Section, Button } from '$lib';
  import { getAllNews } from '$lib/services/dataService';
  import type { NewsItem } from '$lib/types/repo';
  import type { PageData } from './$types';
  import { t, language, type SupportedLanguage } from '$lib/stores/language';
  import { browser } from '$app/environment';
  import { get } from 'svelte/store';

  let { data }: { data: PageData } = $props();

  let news = $state<NewsItem[]>(data.news || []);
  let currentLang = $state<SupportedLanguage>(get(language));
  let isRefreshing = $state(false);

  $effect(() => {
    if (!browser) return;

    const unsubscribe = language.subscribe(async (lang) => {
      if (lang === currentLang && news.length > 0) return;
      if (isRefreshing) return;

      const prevLang = currentLang;
      currentLang = lang;

      if (prevLang !== lang && news.length > 0) {
        isRefreshing = true;
        try {
          news = await getAllNews(lang);
        } catch (e) {
          console.error('Error fetching news:', e);
        } finally {
          isRefreshing = false;
        }
      }
    });

    return () => unsubscribe();
  });
</script>

<svelte:head>
  <title>{$t.news.title} - OpenLyst</title>
  <meta name="description" content={$t.news.subtitle} />
</svelte:head>

<section class="relative text-white overflow-hidden min-h-[45vh] flex items-center">
  <div class="relative mx-auto max-w-7xl px-4 py-20 sm:py-24 sm:px-6 lg:px-8 text-center">
    <h1 class="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
      {$t.news.title}
    </h1>
    <p class="text-xl text-gray-300 max-w-3xl mx-auto">
      {$t.news.subtitle}
    </p>
  </div>
</section>

<Section title={$t.news.latestUpdates} subtitle={$t.news.latestUpdatesDesc} background="default">
  {#snippet children()}
    {#if news.length === 0}
      <div class="text-center py-12 text-gray-400">
        {$t.news.noNews}
      </div>
    {:else}
      <div class="space-y-6">
        {#each news as item}
          <article class="glass-card rounded-xl p-6">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
              <h2 class="text-xl font-semibold text-white">{item.title}</h2>
              <span class="text-sm text-gray-400">{item.date}</span>
            </div>

            <p class="text-gray-300 leading-relaxed">{item.caption}</p>

            <div class="mt-5 flex flex-wrap gap-3">
              {#if item.url}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center px-4 py-2 rounded-lg bg-cyan-600/30 text-cyan-200 hover:bg-cyan-600/40 transition-colors"
                >
                  {$t.news.readMore}
                </a>
              {/if}

              {#if item.appID}
                <Button text={$t.news.openApp} href={`/apps/${item.appID}`} variant="outline" size="sm" />
              {/if}
            </div>
          </article>
        {/each}
      </div>
    {/if}
  {/snippet}
</Section>
