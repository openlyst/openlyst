<script lang="ts">
  import { Section, AppCard } from '$lib';
  import { nameToSlug } from '$lib/utils/repo';
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  const { apps } = data;
</script>

<svelte:head>
  <title>Deprecated Apps - OpenLyst</title>
  <meta name="description" content="View deprecated and discontinued applications from OpenLyst." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 text-white py-20">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
    <div class="text-6xl mb-6">📦</div>
    <h1 class="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
      Deprecated Apps
    </h1>
    <p class="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
      These applications are no longer actively maintained. They may still work but won't receive updates or support.
    </p>
    <div class="flex items-center justify-center">
      <span class="px-4 py-2 bg-yellow-100 text-yellow-800 text-lg font-medium rounded-full border border-yellow-200">
        ⚠️ No longer maintained
      </span>
    </div>
  </div>
</section>

<!-- Deprecated Apps Grid Section -->
<Section 
  title="Discontinued Applications" 
  subtitle="These apps have been replaced or discontinued. Check our active apps for alternatives."
  background="default"
>
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each apps as app}
        <div class="relative">
          <div class="absolute -top-2 -right-2 z-10">
            <span class="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full shadow-lg">
              DEPRECATED
            </span>
          </div>
          <AppCard 
            title="{app.name}"
            description="{app.localizedDescription}"
            href="/apps/{nameToSlug(app.name)}"
            status="released"
            platforms="{app.platforms}"
            image="{app.iconURL}"
          />
        </div>
      {/each}
    </div>
    
    {#if apps.length === 0}
      <div class="text-center py-12">
        <div class="text-6xl mb-4">✨</div>
        <h3 class="text-2xl font-semibold text-gray-900 mb-2">No Deprecated Apps</h3>
        <p class="text-gray-600 max-w-md mx-auto">
          All our apps are currently active and maintained!
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
        View Active Apps
      </a>
    </div>
  {/snippet}
</Section>
