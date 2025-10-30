<script lang="ts">
  import { Section, Button } from '$lib';
  import type { App } from '$lib/config/repo';

  export let app: App;

  // Helper function to get platform-specific download info
  function getPlatformInfo(platform: string) {
    const platformMap: Record<string, any> = {
      'iOS': {
        icon: 'fab fa-apple',
        gradient: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-100',
        textColor: 'text-blue-900',
        description: 'Install via AltStore',
        instructions: 'Use AltStore to install from our repository',
        buttonText: 'Get AltStore',
        buttonUrl: 'https://altstore.io',
        repoUrl: 'https://gitlab.com/Openlyst/repos/altstore/-/raw/main/altstore.json?ref_type=heads'
      },
      'Android': {
        icon: 'fab fa-android',
        gradient: 'from-green-500 to-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-100',
        textColor: 'text-green-900',
        description: 'Install via RepStore',
        instructions: 'Use RepStore to install from our repository',
        buttonText: 'Get RepStore',
        buttonUrl: 'https://gitlab.com/HttpAnimations/repstore'
      },
      'macOS': {
        icon: 'fab fa-apple',
        gradient: 'from-orange-500 to-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-100',
        textColor: 'text-orange-900',
        description: 'Install via Homebrew',
        instructions: 'Use the following commands in Terminal',
        buttonText: 'Get Homebrew',
        buttonUrl: 'https://brew.sh',
        commands: [
          'brew tap Openlyst/macos https://gitlab.com/Openlyst/repos/homebrew/macos.git',
          'brew install --cask ' + (app.id || app.name.toLowerCase())
        ]
      },
      'Linux': {
        icon: 'fab fa-linux',
        gradient: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-100',
        textColor: 'text-purple-900',
        description: 'Direct Download',
        instructions: 'Latest build from GitLab CI',
        buttonText: 'Download for Linux',
        buttonUrl: app.versions[0]?.downloadURL || '#'
      },
      'Windows': {
        icon: 'fab fa-windows',
        gradient: 'from-yellow-500 to-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-100',
        textColor: 'text-yellow-900',
        description: 'Manual Compilation',
        instructions: 'Download source and compile yourself',
        buttonText: 'Download Source',
        buttonUrl: app.versions[0]?.downloadURL || '#',
        warning: 'Windows support not fully tested'
      }
    };
    
    return platformMap[platform] || {
      icon: 'fas fa-download',
      gradient: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-100',
      textColor: 'text-gray-900',
      description: 'Download',
      instructions: 'Platform-specific instructions',
      buttonText: 'Download',
      buttonUrl: app.versions[0]?.downloadURL || '#'
    };
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
</script>

<svelte:head>
  <title>{app.name} - Revolutionary Music Player - OpenLyst</title>
  <meta name="description" content="{app.localizedDescription}" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-purple-600 via-red-600 to-red-700 text-white py-20" style="background: linear-gradient(135deg, {app.tintColor}cc, {app.tintColor});">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <div class="flex items-center mb-4">
          <img src={app.iconURL} alt={app.name} class="w-16 h-16 mr-4 rounded-2xl" />
          <div>
            <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
              {app.name}
            </h1>
            <p class="text-xl text-red-100 mt-2">{app.subtitle}</p>
          </div>
        </div>
        
        <p class="text-lg text-red-100 mb-8">
          {app.localizedDescription}
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4">
          <Button text="Download Now" href="#downloads" variant="secondary" size="lg" />
          <Button text="View Source Code" href="#" variant="outline" size="lg" />
        </div>
        
        <div class="mt-6 flex items-center">
          <span class="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-200">
            v{app.versions[0]?.version || '1.0.0'}
          </span>
          <span class="ml-4 text-red-100">✊ Power to the people</span>
        </div>
      </div>
      
      <div class="relative">
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-4 h-4 bg-green-400 rounded-full"></div>
              <span>No ads or tracking</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-4 h-4 bg-green-400 rounded-full"></div>
              <span>Completely free and open source</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-4 h-4 bg-green-400 rounded-full"></div>
              <span>Your data stays yours</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-4 h-4 bg-green-400 rounded-full"></div>
              <span>Cross-platform synchronization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Downloads Section -->
<Section 
  title="Download {app.name}" 
  subtitle="Get started with the revolution. {app.name} is available on multiple platforms."
  background="default"
>
  {#snippet children()}
    <div id="downloads" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {#each app.platforms as platform}
        {@const platformInfo = getPlatformInfo(platform)}
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-br {platformInfo.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="{platformInfo.icon} text-2xl text-white"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">{platform} <span class="ml-2 inline-block align-middle text-sm bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">v{app.versions[0]?.version || '1.0.0'}</span></h3>
            <p class="text-gray-500">{platform === 'iOS' ? 'iPhone and iPad' : platform === 'Android' ? 'Phones and tablets' : platform === 'macOS' ? 'Install via Homebrew' : platform === 'Linux' ? 'All distributions' : 'Compile from source'}</p>
          </div>
          
          <div class="{platformInfo.bgColor} rounded-xl p-6 border {platformInfo.borderColor}">
            <div class="text-center">
              <h4 class="font-semibold {platformInfo.textColor} mb-2">{platformInfo.description}</h4>
              <p class="text-sm {platformInfo.textColor.replace('900', '700')} mb-4">{platformInfo.instructions}</p>
              
              {#if platform === 'macOS' && platformInfo.commands}
                <div class="space-y-4 mb-4">
                  {#each platformInfo.commands as command, index}
                    <div class="text-left">
                      <p class="text-xs font-medium {platformInfo.textColor.replace('900', '800')} mb-2">{index + 1}. {index === 0 ? 'Add the tap:' : 'Install ' + app.name + ':'}</p>
                      <div class="bg-white rounded-lg p-3 border {platformInfo.borderColor}">
                        <div class="flex items-start gap-2">
                          <code class="text-xs text-gray-700 flex-1 leading-relaxed">{command}</code>
                          <button 
                            onclick={() => copyToClipboard(command)}
                            class="{platformInfo.bgColor.replace('50', '100')} hover:{platformInfo.bgColor.replace('50', '200')} {platformInfo.textColor.replace('900', '700')} p-2 rounded-md transition-colors"
                            title="Copy command"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              {/if}
              
              <Button text={platformInfo.buttonText} href={platformInfo.buttonUrl} variant="primary" size="md" />
              
              {#if platform === 'iOS' && platformInfo.repoUrl}
                <div class="mt-6 pt-4 border-t {platformInfo.borderColor.replace('100', '200')}">
                  <p class="text-xs font-medium {platformInfo.textColor.replace('900', '800')} mb-3">Repository URL:</p>
                  <div class="bg-white rounded-lg p-3 border {platformInfo.borderColor}">
                    <div class="flex items-center gap-2">
                      <code class="text-xs text-gray-700 flex-1 break-all leading-relaxed">{platformInfo.repoUrl}</code>
                      <button 
                        onclick={() => copyToClipboard(platformInfo.repoUrl)}
                        class="{platformInfo.bgColor.replace('50', '100')} hover:{platformInfo.bgColor.replace('50', '200')} {platformInfo.textColor.replace('900', '700')} p-2 rounded-md transition-colors"
                        title="Copy URL"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              {/if}
              
              {#if platformInfo.warning}
                <div class="mt-4 p-3 {platformInfo.bgColor.replace('50', '100')} rounded-lg">
                  <p class="text-xs {platformInfo.textColor.replace('900', '800')}">⚠️ {platformInfo.warning}</p>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/snippet}
</Section>