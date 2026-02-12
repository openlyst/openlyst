<script lang="ts">
  import { Section, Button } from '$lib';
  import { t } from '$lib/stores/language';
</script>

<svelte:head>
  <title>{$t.about.title} - OpenLyst</title>
  <meta name="description" content={$t.about.subtitle} />
</svelte:head>

<!-- Hero Section -->
<section class="relative text-white overflow-hidden min-h-[60vh] flex items-center">
  <div class="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 sm:px-6 lg:px-8 text-center">
    <div class="glass-card w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border-purple-500/30">
      <span class="text-purple-400 font-bold text-4xl">★</span>
    </div>
    <h1 class="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
      {$t.about.title}
    </h1>
    <p class="mx-auto max-w-2xl text-lg text-gray-300">
      {$t.about.subtitle}
    </p>
  </div>
</section>

<!-- Mission Section -->
<Section 
  title={$t.about.ourMission}
  subtitle={$t.about.missionDesc}
>
  {#snippet children()}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <h3 class="text-2xl font-bold text-white mb-4">{$t.about.powerToThePeople}</h3>
        <p class="text-gray-400 mb-6">
          {$t.about.powerDesc}
        </p>
        
        <ul class="space-y-3">
          <li class="flex items-start">
            <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span class="text-gray-300">{$t.about.noTracking}</span>
          </li>
          <li class="flex items-start">
            <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span class="text-gray-300">{$t.about.transparentDev}</span>
          </li>
          <li class="flex items-start">
            <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span class="text-gray-300">{$t.about.communityDrivenFeatures}</span>
          </li>
          <li class="flex items-start">
            <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span class="text-gray-300">{$t.about.freeForever}</span>
          </li>
        </ul>
      </div>
      
      <div class="bg-gray-800 rounded-lg p-8 border border-red-900">
        <blockquote class="text-lg text-gray-200 italic mb-4">
          {$t.about.quoteAudre}
        </blockquote>
        <cite class="text-red-600 font-semibold">{$t.about.quoteAudreAuthor}</cite>
        
        <div class="mt-6 p-4 bg-gray-900 rounded border border-red-800">
          <p class="text-sm text-gray-400">
            {$t.about.quoteNote}
          </p>
        </div>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Values Section -->
<Section 
  title={$t.about.ourValues}
  subtitle={$t.about.valuesDesc}
  background="default"
>
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-red-900">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">{$t.about.privacyFirst}</h3>
        <p class="text-gray-400">{$t.about.privacyFirstDesc}</p>
      </div>
      
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-red-900">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">{$t.about.communityDriven}</h3>
        <p class="text-gray-400">{$t.about.communityDrivenDesc}</p>
      </div>
      
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-red-900">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">{$t.about.transparency}</h3>
        <p class="text-gray-400">{$t.about.transparencyDesc}</p>
      </div>
      
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-red-900">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">{$t.about.accessibility}</h3>
        <p class="text-gray-400">{$t.about.accessibilityDesc}</p>
      </div>
      
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-red-900">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">{$t.about.performance}</h3>
        <p class="text-gray-400">{$t.about.performanceDesc}</p>
      </div>
      
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-red-900">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">{$t.about.sustainability}</h3>
        <p class="text-gray-400">{$t.about.sustainabilityDesc}</p>
      </div>
    </div>
  {/snippet}
</Section>

<!-- History Section -->
<Section 
  title={$t.about.ourStory} 
  subtitle={$t.about.ourStoryDesc}
  background="red"
>
  {#snippet children()}
    <div class="max-w-4xl mx-auto">
      <div class="space-y-8">
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 class="text-xl font-semibold text-white mb-3">{$t.about.theBeginning}</h3>
          <p class="text-red-100">
            {$t.about.beginningDesc}
          </p>
        </div>
        
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 class="text-xl font-semibold text-white mb-3">{$t.about.growingMovement}</h3>
          <p class="text-red-100">
            {$t.about.growingDesc}
          </p>
        </div>
        
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 class="text-xl font-semibold text-white mb-3">{$t.about.revolutionarySoftware}</h3>
          <p class="text-red-100">
            {$t.about.revolutionaryDesc}
          </p>
        </div>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Team Section -->
<Section 
  title={$t.about.theCollective} 
  subtitle={$t.about.collectiveDesc}
>
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl">👩‍💻</span>
        </div>
        <h3 class="text-lg font-semibold text-white mb-1">{$t.about.coreDevelopers}</h3>
        <p class="text-gray-400 text-sm mb-3">{$t.about.coreDevelopersSubtitle}</p>
        <p class="text-gray-500 text-sm">{$t.about.coreDevelopersDesc}</p>
      </div>
      
      <div class="text-center">
        <div class="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl">🎨</span>
        </div>
        <h3 class="text-lg font-semibold text-white mb-1">{$t.about.designers}</h3>
        <p class="text-gray-400 text-sm mb-3">{$t.about.designersSubtitle}</p>
        <p class="text-gray-500 text-sm">{$t.about.designersDesc}</p>
      </div>
      
      <div class="text-center">
        <div class="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl">🔒</span>
        </div>
        <h3 class="text-lg font-semibold text-white mb-1">{$t.about.securityExperts}</h3>
        <p class="text-gray-400 text-sm mb-3">{$t.about.securityExpertsSubtitle}</p>
        <p class="text-gray-500 text-sm">{$t.about.securityExpertsDesc}</p>
      </div>
      
      <div class="text-center">
        <div class="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl">📝</span>
        </div>
        <h3 class="text-lg font-semibold text-white mb-1">{$t.about.documentationTeam}</h3>
        <p class="text-gray-400 text-sm mb-3">{$t.about.documentationTeamSubtitle}</p>
        <p class="text-gray-500 text-sm">{$t.about.documentationTeamDesc}</p>
      </div>
      
      <div class="text-center">
        <div class="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl">🌍</span>
        </div>
        <h3 class="text-lg font-semibold text-white mb-1">{$t.about.translators}</h3>
        <p class="text-gray-400 text-sm mb-3">{$t.about.translatorsSubtitle}</p>
        <p class="text-gray-500 text-sm">{$t.about.translatorsDesc}</p>
      </div>
      
      <div class="text-center">
        <div class="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl">💬</span>
        </div>
        <h3 class="text-lg font-semibold text-white mb-1">{$t.about.communityTeam}</h3>
        <p class="text-gray-400 text-sm mb-3">{$t.about.communityTeamSubtitle}</p>
        <p class="text-gray-500 text-sm">{$t.about.communityTeamDesc}</p>
      </div>
    </div>
    
    <div class="mt-12 text-center">
      <p class="text-gray-400 mb-6">
        {$t.about.joinCollective}
      </p>
      <Button text={$t.about.joinRevolution} href="https://gitlab.com/Openlyst/" variant="primary" size="lg" />
    </div>
  {/snippet}
</Section>
