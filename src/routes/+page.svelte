<script lang="ts">
  import { Section, AppCard, Button } from '$lib';
  import favicon from '$lib/assets/favicon.svg';
</script>

<svelte:head>
  <title>OpenLyst - Revolutionary FOSS Applications</title>
  <meta name="description" content="Building revolutionary free and open source applications for the people. Power to the community through free software." />
</svelte:head>

<!-- Hero Section -->
<section class="relative bg-gradient-to-br from-red-700 via-red-600 to-red-800 text-white overflow-hidden">
  <div class="absolute inset-0 bg-black opacity-10"></div>
  <div class="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 sm:px-6 lg:px-8">
    <div class="text-center">
      <div class="mb-8 flex justify-center">
        <img src="/header.png" alt="OpenLyst Header" class="max-w-md w-full h-auto shadow-2xl rounded-lg" />
      </div>
      
      <h1 class="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
        Revolutionary FOSS Applications
      </h1>
      
      <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-red-100">
        Building free and open source software that serves the people, not corporate interests. 
        Join the revolution and take back control of your digital life.
      </p>
      
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <Button text="Explore Our Apps" href="/apps" variant="secondary" size="lg" />
        <Button text="Join the Movement" href="/contribute" variant="outline" size="lg" />
      </div>
    </div>
  </div>
  
  <!-- Decorative elements -->
  <div class="absolute top-0 left-0 w-full h-full">
    <div class="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full opacity-20"></div>
    <div class="absolute top-20 right-20 w-6 h-6 bg-yellow-400 rounded-full opacity-30"></div>
    <div class="absolute bottom-20 left-20 w-3 h-3 bg-yellow-400 rounded-full opacity-25"></div>
    <div class="absolute bottom-10 right-10 w-5 h-5 bg-yellow-400 rounded-full opacity-20"></div>
  </div>
</section>

<!-- Mission Section -->
<Section 
  title="Power to the People" 
  subtitle="We believe technology should serve humanity, not exploit it. Our applications are built by the community, for the community."
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
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Privacy First</h3>
        <p class="text-gray-600">Your data belongs to you. No tracking, no surveillance, no corporate control.</p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
        <p class="text-gray-600">Built by volunteers who care about creating better software for everyone.</p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Open Source</h3>
        <p class="text-gray-600">All code is transparent, auditable, and free to use, modify, and distribute.</p>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Applications Section -->
<Section 
  title="Our Applications" 
  subtitle="Revolutionary software that puts users first. Each application is designed with privacy, freedom, and community in mind."
  background="default"
>
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
      <AppCard
        title="DouDou"
        description="A revolutionary music player that connects to your favorite self-hosted music services. Break free from corporate streaming platforms and enjoy your music library on your terms."
        status="released"
        platforms={['iOS', 'Android', 'macOS', 'Linux', 'Windows*']}
        href="/apps/doudou"
        features={[
          'Jellyfin integration',
          'Plex support',
          'Navidrome compatibility', 
          'Cross-platform sync',
          'Offline playback',
          'No ads or tracking'
        ]}
        image="🎵"
      />
      
      <AppCard
        title="BaoBao"
        description="A modern, privacy-focused client for the e621 community. Built with user experience and data protection as top priorities."
        status="development"
        platforms={['iOS', 'Android']}
        href="/apps/baobao"
        features={[
          'Intuitive interface',
          'Advanced search',
          'Offline favorites',
          'Privacy protection',
          'Community features'
        ]}
        image="🦊"
      />
    </div>
    
    <div class="mt-12 text-center">
      <p class="text-gray-600 mb-6">More revolutionary applications coming soon!</p>
      <Button text="View All Applications" href="/apps" variant="primary" />
    </div>
  {/snippet}
</Section>

<!-- Call to Action -->
<Section 
  title="Join the Revolution" 
  subtitle="Help us build a better digital future. Contribute code, report bugs, or spread the word about free software."
  background="red"
  centered={true}
>
  {#snippet children()}
    <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
      <Button text="Start Contributing" href="/contribute" variant="secondary" size="lg" />
      <Button text="Download Apps" href="/apps" variant="outline" size="lg" />
    </div>
    
    <div class="mt-12 text-center">
      <p class="text-red-100 text-lg font-medium">
        "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion."
      </p>
      <p class="text-red-200 mt-2">- Albert Camus</p>
    </div>
  {/snippet}
</Section>
