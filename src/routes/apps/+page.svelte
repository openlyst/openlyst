<script lang="ts">
  import { Section, AppCard } from '$lib';
  import { nameToSlug } from '$lib/utils/repo';
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  const { apps } = data;
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
      {#each apps as app}
        <AppCard 
          title="{app.name}"
          description="{app.localizedDescription}"
          href="/apps/{nameToSlug(app.name)}"
          iconUrl="{app.iconURL}"
          platforms="{app.platforms}"
          version="{app.versions[0]?.version || '1.0'}"
          tintColor="{app.tintColor}"
        />
      {/each}
    </div>
    
    {#if apps.length === 0}
      <div class="text-center py-12">
        <div class="text-6xl mb-4">📱</div>
        <h3 class="text-2xl font-semibold text-gray-900 mb-2">No Apps Yet</h3>
        <p class="text-gray-600 max-w-md mx-auto">
          We're working on adding amazing apps to our collection. Check back soon!
        </p>
      </div>
    {/if}
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