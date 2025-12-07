<script lang="ts">
  import { Section, Button } from '$lib';
</script>

<svelte:head>
  <title>About OpenLyst - Revolutionary FOSS Collective</title>
  <meta name="description" content="Learn about OpenLyst, our mission to build revolutionary free and open source applications for the people." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-r from-red-700 to-red-800 text-white py-20">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
    <div class="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-8">
      <span class="text-red-900 font-bold text-4xl">★</span>
    </div>
    <h1 class="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
      About OpenLyst
    </h1>
    <p class="mx-auto max-w-2xl text-lg text-red-100">
      We are a collective of developers, designers, and activists building revolutionary 
      free and open source applications that serve the people, not corporate interests.
    </p>
  </div>
</section>

<!-- Mission Section -->
<Section 
  title="Our Mission" 
  subtitle="Technology should liberate, not exploit. We build software that empowers users and respects their freedom."
>
  {#snippet children()}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <h3 class="text-2xl font-bold text-white mb-4">Power to the People</h3>
        <p class="text-gray-400 mb-6">
          In a world where technology increasingly serves corporate interests and surveillance capitalism, 
          we stand for digital freedom. Every application we build is designed to give users complete 
          control over their data, their experience, and their digital life.
        </p>
        
        <ul class="space-y-3">
          <li class="flex items-start">
            <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span class="text-gray-300">No tracking, no surveillance, no data collection</span>
          </li>
          <li class="flex items-start">
            <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span class="text-gray-300">Transparent development and open source code</span>
          </li>
          <li class="flex items-start">
            <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span class="text-gray-300">Community-driven features and development</span>
          </li>
          <li class="flex items-start">
            <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span class="text-gray-300">Free for everyone, forever</span>
          </li>
        </ul>
      </div>
      
      <div class="bg-gray-800 rounded-lg p-8 border border-red-900">
        <blockquote class="text-lg text-gray-200 italic mb-4">
          "The master's tools will never dismantle the master's house. They may allow us temporarily 
          to beat him at his own game, but they will never enable us to bring about genuine change."
        </blockquote>
        <cite class="text-red-600 font-semibold">- Audre Lorde</cite>
        
        <div class="mt-6 p-4 bg-gray-900 rounded border border-red-800">
          <p class="text-sm text-gray-400">
            We believe that to create truly free software, we must build new tools with revolutionary 
            principles from the ground up, not just replicate existing exploitative systems.
          </p>
        </div>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Values Section -->
<Section 
  title="Our Values" 
  subtitle="These principles guide everything we do, from code design to community interaction."
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
        <h3 class="text-xl font-semibold text-white mb-2">Privacy First</h3>
        <p class="text-gray-400">User privacy is not negotiable. We build applications that respect and protect user data by design.</p>
      </div>
      
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-red-900">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">Community Driven</h3>
        <p class="text-gray-400">Our software is built by the community, for the community. Every voice matters in our development process.</p>
      </div>
      
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-red-900">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">Transparency</h3>
        <p class="text-gray-400">All our code is open source. Our development process is transparent and our decisions are made in the open.</p>
      </div>
      
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-red-900">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">Accessibility</h3>
        <p class="text-gray-400">Software should be usable by everyone. We prioritize accessibility and inclusive design in all our applications.</p>
      </div>
      
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-red-900">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">Performance</h3>
        <p class="text-gray-400">We believe good software should be fast, efficient, and respectful of system resources.</p>
      </div>
      
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-red-900">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">Sustainability</h3>
        <p class="text-gray-400">We build software for the long term, with sustainable development practices and minimal environmental impact.</p>
      </div>
    </div>
  {/snippet}
</Section>

<!-- History Section -->
<Section 
  title="Our Story" 
  subtitle="How a group of passionate developers came together to build revolutionary software."
  background="red"
>
  {#snippet children()}
    <div class="max-w-4xl mx-auto">
      <div class="space-y-8">
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 class="text-xl font-semibold text-white mb-3">🌱 The Beginning</h3>
          <p class="text-red-100">
            OpenLyst started as a small group of developers frustrated with the state of proprietary software. 
            We were tired of applications that tracked users, collected unnecessary data, and prioritized 
            profit over user experience. We decided to build the applications we wanted to use ourselves.
          </p>
        </div>
        
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 class="text-xl font-semibold text-white mb-3">🚀 Growing Movement</h3>
          <p class="text-red-100">
            What started as personal projects quickly grew into a movement. More developers joined our cause, 
            bringing diverse skills and perspectives. We realized we could create something bigger - 
            a collection of applications that truly served users, not shareholders.
          </p>
        </div>
        
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 class="text-xl font-semibold text-white mb-3">✊ Revolutionary Software</h3>
          <p class="text-red-100">
            Today, OpenLyst is a thriving collective of contributors from around the world. 
            We've released applications that thousands of users rely on daily, and we're just getting started. 
            Every line of code we write is a step toward a more free and equitable digital future.
          </p>
        </div>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Team Section -->
<Section 
  title="The Collective" 
  subtitle="Meet some of the people building the future of free software."
>
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl">👩‍💻</span>
        </div>
        <h3 class="text-lg font-semibold text-white mb-1">Core Developers</h3>
        <p class="text-gray-400 text-sm mb-3">The backbone of our development team</p>
        <p class="text-gray-500 text-sm">Writing code, fixing bugs, and architecting the future</p>
      </div>
      
      <div class="text-center">
        <div class="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl">🎨</span>
        </div>
        <h3 class="text-lg font-semibold text-white mb-1">Designers</h3>
        <p class="text-gray-400 text-sm mb-3">Creating beautiful, accessible interfaces</p>
        <p class="text-gray-500 text-sm">Making complex software simple and intuitive</p>
      </div>
      
      <div class="text-center">
        <div class="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl">🔒</span>
        </div>
        <h3 class="text-lg font-semibold text-white mb-1">Security Experts</h3>
        <p class="text-gray-400 text-sm mb-3">Protecting user privacy and data</p>
        <p class="text-gray-500 text-sm">Auditing code and implementing security best practices</p>
      </div>
      
      <div class="text-center">
        <div class="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl">📝</span>
        </div>
        <h3 class="text-lg font-semibold text-white mb-1">Documentation</h3>
        <p class="text-gray-400 text-sm mb-3">Making our software accessible to everyone</p>
        <p class="text-gray-500 text-sm">Writing guides, tutorials, and API documentation</p>
      </div>
      
      <div class="text-center">
        <div class="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl">🌍</span>
        </div>
        <h3 class="text-lg font-semibold text-white mb-1">Translators</h3>
        <p class="text-gray-400 text-sm mb-3">Breaking down language barriers</p>
        <p class="text-gray-500 text-sm">Localizing our applications for global accessibility</p>
      </div>
      
      <div class="text-center">
        <div class="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl">💬</span>
        </div>
        <h3 class="text-lg font-semibold text-white mb-1">Community</h3>
        <p class="text-gray-400 text-sm mb-3">Supporting users and building connections</p>
        <p class="text-gray-500 text-sm">Moderating forums, answering questions, and fostering community</p>
      </div>
    </div>
    
    <div class="mt-12 text-center">
      <p class="text-gray-400 mb-6">
        Want to join our collective? We're always looking for passionate people who share our values.
      </p>
      <Button text="Join the Revolution" href="/contribute" variant="primary" size="lg" />
    </div>
  {/snippet}
</Section>