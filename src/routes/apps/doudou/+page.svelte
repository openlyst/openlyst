<script lang="ts">
  import { Section, Button } from '$lib';
</script>

<svelte:head>
  <title>DouDou - Revolutionary Music Player - OpenLyst</title>
  <meta name="description" content="DouDou is a revolutionary music player for Jellyfin, Plex, and Navidrome. Free, open source, and privacy-focused." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-purple-600 via-red-600 to-red-700 text-white py-20">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <div class="flex items-center mb-4">
          <span class="text-6xl mr-4">🎵</span>
          <div>
            <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
              DouDou
            </h1>
            <p class="text-xl text-red-100 mt-2">Revolutionary Music Player</p>
          </div>
        </div>
        
        <p class="text-lg text-red-100 mb-8">
          Break free from corporate streaming platforms. DouDou connects to your self-hosted music services 
          like Jellyfin, Plex, and Navidrome, giving you complete control over your music library.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4">
          <Button text="Download Now" href="#downloads" variant="secondary" size="lg" />
          <Button text="View Source Code" href="#" variant="outline" size="lg" />
        </div>
        
        <div class="mt-6 flex items-center">
          <span class="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-200">
            Released
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

<!-- Features Section -->
<Section 
  title="Revolutionary Features" 
  subtitle="DouDou is built to give you complete control over your music experience."
>
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Multi-Server Support</h3>
        <p class="text-gray-600">Connect to Jellyfin, Plex, and Navidrome servers seamlessly. Your music, your choice of platform.</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Offline Playback</h3>
        <p class="text-gray-600">Download your favorite tracks for offline listening. No internet? No problem.</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Privacy First</h3>
        <p class="text-gray-600">No tracking, no analytics, no data collection. Your listening habits are yours alone.</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Cross-Platform</h3>
        <p class="text-gray-600">Available on iOS, Android, macOS, Linux, and Windows. Start listening anywhere.</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Smart Playlists</h3>
        <p class="text-gray-600">Create dynamic playlists that update automatically based on your criteria.</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
        <p class="text-gray-600">Optimized for performance with minimal resource usage. Your battery will thank you.</p>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Downloads Section -->
<Section 
  title="Download DouDou" 
  subtitle="Get started with the revolution. DouDou is available on all major platforms."
  background="default"
>
  {#snippet children()}
    <div id="downloads" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- iOS -->
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200 text-center">
        <div class="text-4xl mb-4">📱</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">iOS</h3>
        <p class="text-gray-600 mb-4">iPhone and iPad</p>
        <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-gray-700 mb-2">
            <strong>Install via AltStore:</strong> Use AltStore to install from our repository
          </p>
          <div class="space-y-2">
            <Button text="Get AltStore" href="https://altstore.io" variant="primary" size="sm" />
            <div class="mt-2">
              <p class="text-xs text-gray-600 mb-1">Then add this repository URL:</p>
              <div class="flex items-center gap-2 justify-center">
                <code class="bg-gray-100 px-2 py-1 rounded text-xs break-all">https://gitlab.com/Openlyst/repos/altstore/-/raw/main/altstore.json?ref_type=heads</code>
                <button 
                  onclick={() => navigator.clipboard.writeText('https://gitlab.com/Openlyst/repos/altstore/-/raw/main/altstore.json?ref_type=heads')}
                  class="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs font-medium transition-colors"
                  title="Copy URL"
                >
                  📋
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Android -->
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200 text-center">
        <div class="text-4xl mb-4">🤖</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Android</h3>
        <p class="text-gray-600 mb-4">Android phones and tablets</p>
        <div class="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-gray-700 mb-2">
            <strong>Install via RepStore:</strong> Use RepStore to install from our repository
          </p>
          <div class="space-y-2">
            <Button text="Get RepStore" href="https://gitlab.com/HttpAnimations/repstore" variant="primary" size="sm" />
            <div class="mt-2">
              <p class="text-xs text-gray-600 mb-1">Visit RepStore for installation instructions</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- macOS -->
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200 text-center">
        <div class="text-4xl mb-4">🖥️</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">macOS</h3>
        <p class="text-gray-600 mb-4">Install via Homebrew</p>
        <div class="p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p class="text-sm text-gray-700 mb-3">
            <strong>Install via Homebrew:</strong> Use the following commands in Terminal
          </p>
          <div class="space-y-3 text-left">
            <div>
              <p class="text-xs text-gray-600 mb-1">1. Add the tap:</p>
              <div class="flex items-start gap-2">
                <code class="bg-gray-100 px-2 py-1 rounded text-xs flex-1 break-all">brew tap Openlyst/macos https://gitlab.com/Openlyst/repos/homebrew/macos.git</code>
                <button 
                  onclick={() => navigator.clipboard.writeText('brew tap Openlyst/macos https://gitlab.com/Openlyst/repos/homebrew/macos.git')}
                  class="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0"
                  title="Copy command"
                >
                  📋
                </button>
              </div>
            </div>
            <div>
              <p class="text-xs text-gray-600 mb-1">2. Install DouDou:</p>
              <div class="flex items-start gap-2">
                <code class="bg-gray-100 px-2 py-1 rounded text-xs flex-1">brew install --cask doudou</code>
                <button 
                  onclick={() => navigator.clipboard.writeText('brew install --cask doudou')}
                  class="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0"
                  title="Copy command"
                >
                  📋
                </button>
              </div>
            </div>
          </div>
          <div class="mt-3 text-center">
            <Button text="Get Homebrew" href="https://brew.sh" variant="outline" size="sm" />
          </div>
        </div>
      </div>
      
      <!-- Linux -->
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200 text-center">
        <div class="text-4xl mb-4">🐧</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Linux</h3>
        <p class="text-gray-600 mb-4">All Linux distributions</p>
        <div class="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <p class="text-sm text-gray-700 mb-3">
            <strong>Direct Download:</strong> Download the latest Linux build
          </p>
          <div class="space-y-2">
            <Button 
              text="Download for Linux" 
              href="https://gitlab.com/Openlyst/doudou/-/jobs/artifacts/9801d626eb5dd23eb6cdc146adc5a2f78631817f/download?job=build_release_linux" 
              variant="primary" 
              size="sm" 
            />
            <p class="text-xs text-gray-600">Latest release build from GitLab CI</p>
          </div>
        </div>
      </div>
      
      <!-- Windows -->
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200 text-center">
        <div class="text-4xl mb-4">🪟</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Windows</h3>
        <p class="text-gray-600 mb-4">Compile from source</p>
        <div class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p class="text-sm text-gray-700 mb-3">
            <strong>Manual Compilation Required:</strong> Download source and compile yourself
          </p>
          <div class="space-y-2">
            <Button 
              text="Download Source" 
              href="https://gitlab.com/Openlyst/doudou/-/archive/pipeline-2070928152/doudou-pipeline-2070928152.tar.gz" 
              variant="primary" 
              size="sm" 
            />
            <p class="text-xs text-gray-600">Source code from GitLab pipeline</p>
            <p class="text-xs text-gray-500 mt-2">⚠️ Windows support not fully tested</p>
          </div>
        </div>
      </div>
      
      <!-- Source Code -->
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200 text-center">
        <div class="text-4xl mb-4">💻</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Source Code</h3>
        <p class="text-gray-600 mb-4">Build from source</p>
        <div class="space-y-2">
          <Button text="GitLab Repository" href="https://gitlab.com/Openlyst/doudou" variant="primary" />
        </div>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Support Section -->
<Section 
  title="Join the Community" 
  subtitle="Get help, report issues, or contribute to making DouDou even better."
  background="red"
  centered={true}
>
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
      <div class="text-center">
        <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Community Chat</h3>
        <p class="text-red-100 mb-4">Join our Matrix room for support and discussion</p>
        <Button text="Join Chat" href="#" variant="outline" />
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Report Issues</h3>
        <p class="text-red-100 mb-4">Found a bug? Let us know on our issue tracker</p>
        <Button text="Report Bug" href="#" variant="outline" />
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Contribute</h3>
        <p class="text-red-100 mb-4">Help improve DouDou for everyone</p>
        <Button text="Contribute" href="/contribute" variant="outline" />
      </div>
    </div>
  {/snippet}
</Section>