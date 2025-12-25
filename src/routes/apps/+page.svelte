<script lang="ts">
  import { Section, AppCard, Skeleton } from '$lib';
  import { nameToSlug } from '$lib/utils/repo';
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  
  export let data: PageData;
  
  let isLoaded = false;
  let apps: typeof data.apps = [];
  
  onMount(() => {
    setTimeout(() => {
      apps = data.apps;
      isLoaded = true;
    }, 100);
  });
</script>

<svelte:head>
  <title>Apps - OpenLyst</title>
  <meta name="description" content="Discover amazing open-source applications. Free, privacy-focused, and community-driven." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-purple-600 via-red-600 to-red-700 text-white py-20">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
    <h1 class="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
      Discover Amazing Apps
    </h1>
    <p class="text-xl text-red-100 max-w-3xl mx-auto mb-8">
      Explore our collection of free, open-source applications. Built for privacy, designed for you.
    </p>
    <div class="flex items-center justify-center">
      <span class="px-4 py-2 bg-green-100 text-green-800 text-lg font-medium rounded-full border border-green-200">
        ✊ Power to the people
      </span>
    </div>
  </div>
</section>

<!-- Apps Grid Section -->
<Section 
  title="Our Applications" 
  subtitle="Free, open-source, and privacy-focused apps for everyone."
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
              title="{app.name}"
              description="{app.localizedDescription}"
              href="/apps/{nameToSlug(app.name)}"
              status="{app.versions[0]?.version.includes('beta') ? 'beta' : 'released'}"
              platforms="{app.platforms}"
              image="{app.iconURL}"
              tintColor="{app.tintColor}"
            />
          </div>
        {/each}
      {/if}
    </div>
    
    {#if isLoaded && apps.length === 0}
      <div class="text-center py-12">
        <div class="text-6xl mb-4">📱</div>
        <h3 class="text-2xl font-semibold text-white mb-2">No Apps Yet</h3>
        <p class="text-gray-400 max-w-md mx-auto">
          We're working on adding amazing apps to our collection. Check back soon!
        </p>
      </div>
    {/if}
    
    <!-- Link to deprecated apps -->
    <div class="mt-12 text-center">
      <p class="text-gray-400 text-sm mb-3">Can't find an app you're looking for?</p>
      <a 
        href="/deprecated" 
        class="inline-flex items-center text-gray-300 hover:text-red-400 transition-colors text-sm font-medium"
      >
        <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Check our deprecated apps
      </a>
    </div>
  {/snippet}
</Section>

<!-- Call to Action -->
<Section 
  title="Want to Contribute?" 
  subtitle="Help us build the future of open-source applications."
  background="red"
  centered={true}
>
  {#snippet children()}
    <div class="text-center">
      <p class="text-lg text-red-100 mb-8 max-w-2xl mx-auto">
        Join our community of developers and users who believe in free, open-source software. 
        Together, we can create alternatives to corporate-controlled platforms.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a 
          href="/contribute" 
          class="inline-flex items-center px-6 py-3 border border-white text-white font-medium rounded-lg hover:bg-white hover:text-red-600 transition-colors"
        >
          Get Involved
        </a>
        <a 
          href="https://gitlab.com/openlyst" 
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center px-6 py-3 bg-yellow-400 text-red-900 font-medium rounded-lg hover:bg-yellow-300 transition-colors"
        >
          View Source Code
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