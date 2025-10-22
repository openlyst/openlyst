<script lang="ts">
  import { Section, AppCard, Button } from '$lib';
  import doudouHeader from '$lib/assets/headers/doudou.svg';
  import baobaoHeader from '$lib/assets/headers/baobao.svg';
</script>

<svelte:head>
  <title>Our Applications - OpenLyst</title>
  <meta name="description" content="Discover our revolutionary free and open source applications built for the people." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
        Our Applications
      </h1>
      <p class="mx-auto max-w-2xl text-lg text-red-100">
        Revolutionary software that puts users first. Each application is designed with privacy, freedom, and community in mind.
      </p>
    </div>
  </div>
</section>

<!-- Applications Grid -->
<Section 
  title="Available Now" 
  subtitle="Download and start using our applications today. All software is free and open source."
>
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AppCard
        title="DouDou"
        description="A revolutionary music player that connects to your favorite self-hosted music services. Break free from corporate streaming platforms and enjoy your music library on your terms."
        status="released"
        platforms={['iOS', 'Android', 'macOS', 'Linux', 'Windows*']}
        href="/apps/doudou"
        headerImage={doudouHeader}
        features={[
          'Jellyfin integration',
          'Plex support',
          'Navidrome compatibility', 
          'Cross-platform sync',
          'Offline playback',
          'No ads or tracking'
        ]}
      />
      
      <AppCard
        title="BaoBao"
        description="A modern, privacy-focused client for the e621 community. Built with user experience and data protection as top priorities."
        status="development"
        platforms={['iOS', 'Android']}
        href="/apps/baobao"
        headerImage={baobaoHeader}
        features={[
          'Intuitive interface',
          'Advanced search',
          'Offline favorites',
          'Privacy protection',
          'Community features'
        ]}
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
  {/snippet}
</Section>

<!-- Coming Soon -->
<Section 
  title="In Development" 
  subtitle="We're always working on new applications to serve the community better."
  background="default"
>
  {#snippet children()}
    <div class="bg-gray-100 rounded-lg p-8 text-center">
      <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">More Apps Coming Soon</h3>
      <p class="text-gray-600 mb-4">
        We're constantly developing new applications based on community needs. 
        Have an idea for a revolutionary app?
      </p>
      <Button text="Suggest an App" href="/contribute" variant="primary" />
    </div>
  {/snippet}
</Section>

<!-- Call to Action -->
<Section 
  title="Get Involved" 
  subtitle="Help us build better software for everyone. Your contributions make a difference."
  background="red"
  centered={true}
>
  {#snippet children()}
    <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
      <Button text="Contribute Code" href="/contribute" variant="secondary" size="lg" />
      <Button text="Report Issues" href="#" variant="outline" size="lg" />
      <Button text="Join Community" href="#" variant="outline" size="lg" />
    </div>
  {/snippet}
</Section>