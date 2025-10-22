<script lang="ts">
  import { Section, Button } from '$lib';
  
  const baobaoHeader = '/images/headers/baobao.svg';
</script>

<svelte:head>
  <title>BaoBao - Privacy-Focused e621 Client - OpenLyst</title>
  <meta name="description" content="BaoBao is a modern, privacy-focused client for the e621 community. Built with user experience and data protection as top priorities." />
</svelte:head>

<!-- Hero Section -->
<section class="relative text-white overflow-hidden">
  <img src={baobaoHeader} alt="BaoBao Header" class="w-full h-80 object-cover" />
  
  <div class="absolute inset-0 bg-black bg-opacity-30"></div>
  
  <div class="absolute inset-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
      <div class="lg:ml-8">
        <p class="text-lg text-white mb-8">
          A modern, privacy-focused client for the e621 community. Built with user experience, 
          data protection, and community values as our top priorities.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4">
          <Button text="Coming Soon" href="#" variant="secondary" size="lg" />
          <Button text="View Progress" href="#" variant="outline" size="lg" />
        </div>
        
        <div class="mt-6 flex items-center">
          <span class="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full border border-red-200">
            In Development
          </span>
          <span class="ml-4 text-orange-100">🚀 Building something amazing</span>
        </div>
      </div>
      
      <div class="relative">
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-4 h-4 bg-green-400 rounded-full"></div>
              <span>Privacy-first design</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-4 h-4 bg-green-400 rounded-full"></div>
              <span>Intuitive user interface</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-4 h-4 bg-green-400 rounded-full"></div>
              <span>Advanced search capabilities</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-4 h-4 bg-green-400 rounded-full"></div>
              <span>Offline favorites support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Development Status -->
<Section 
  title="Development Progress" 
  subtitle="BaoBao is currently under active development. Here's what we're working on."
>
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">🎯 Current Focus</h3>
        <ul class="space-y-3">
          <li class="flex items-start">
            <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span class="text-gray-700">Core UI/UX framework</span>
          </li>
          <li class="flex items-start">
            <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span class="text-gray-700">API integration layer</span>
          </li>
          <li class="flex items-start">
            <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span class="text-gray-700">Privacy protection features</span>
          </li>
          <li class="flex items-start">
            <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span class="text-gray-700">Advanced search functionality</span>
          </li>
        </ul>
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">🗓️ Roadmap</h3>
        <div class="space-y-4">
          <div class="border-l-4 border-green-500 pl-4">
            <h4 class="font-semibold text-green-700">Q1 2025 - Alpha Release</h4>
            <p class="text-sm text-gray-600">Basic browsing and search functionality</p>
          </div>
          <div class="border-l-4 border-yellow-500 pl-4">
            <h4 class="font-semibold text-yellow-700">Q2 2025 - Beta Release</h4>
            <p class="text-sm text-gray-600">Favorites, offline support, and enhanced UI</p>
          </div>
          <div class="border-l-4 border-red-500 pl-4">
            <h4 class="font-semibold text-red-700">Q3 2025 - Stable Release</h4>
            <p class="text-sm text-gray-600">Full feature set and community features</p>
          </div>
        </div>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Planned Features -->
<Section 
  title="Planned Features" 
  subtitle="Here's what BaoBao will offer when complete. We're building with privacy and usability in mind."
  background="default"
>
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div class="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Advanced Search</h3>
        <p class="text-gray-600">Powerful search with filters, tags, and smart suggestions. Find exactly what you're looking for.</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div class="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Privacy Protection</h3>
        <p class="text-gray-600">Built-in privacy features including secure browsing, data encryption, and no tracking.</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div class="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Favorites System</h3>
        <p class="text-gray-600">Save and organize your favorites with custom collections and offline access.</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div class="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Mobile Optimized</h3>
        <p class="text-gray-600">Native iOS and Android apps designed for touch interfaces and mobile usage patterns.</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div class="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Community Features</h3>
        <p class="text-gray-600">Connect with the community through comments, discussions, and content sharing.</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div class="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Customizable Interface</h3>
        <p class="text-gray-600">Personalize your experience with themes, layouts, and customizable interface elements.</p>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Beta Signup -->
<Section 
  title="Join the Beta" 
  subtitle="Want to help shape BaoBao? Sign up for our beta program and get early access."
  background="red"
  centered={true}
>
  {#snippet children()}
    <div class="max-w-md mx-auto mt-8">
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 class="text-lg font-semibold text-white mb-4">Beta Program</h3>
        <p class="text-red-100 mb-6">
          Be among the first to try BaoBao and help us build the best privacy-focused client for the community.
        </p>
        
        <div class="space-y-4">
          <div class="flex items-center text-red-100">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Early access to new features
          </div>
          <div class="flex items-center text-red-100">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Direct feedback channel to developers
          </div>
          <div class="flex items-center text-red-100">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Help shape the final product
          </div>
        </div>
        
        <div class="mt-6">
          <Button text="Join Beta Waitlist" href="#" variant="secondary" size="lg" />
        </div>
      </div>
    </div>
    
    <div class="mt-8 text-center">
      <p class="text-red-100">
        Follow our progress and get updates on social media or join our community chat.
      </p>
    </div>
  {/snippet}
</Section>

<!-- Community Section -->
<Section 
  title="Community & Support" 
  subtitle="Connect with other users and contributors. Get updates and share feedback."
>
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Development Chat</h3>
        <p class="text-gray-600 mb-4">Join our Matrix room for development updates and discussions</p>
        <Button text="Join Chat" href="#" variant="primary" />
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Progress Updates</h3>
        <p class="text-gray-600 mb-4">Follow our development blog for regular progress updates</p>
        <Button text="Read Updates" href="#" variant="primary" />
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Contribute</h3>
        <p class="text-gray-600 mb-4">Help us build BaoBao - code contributions welcome</p>
        <Button text="Contribute" href="/contribute" variant="primary" />
      </div>
    </div>
  {/snippet}
</Section>