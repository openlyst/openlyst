<script lang="ts">
  import { Section, Button } from '$lib';
</script>

<svelte:head>
  <title>Contribute to OpenLyst - Join the Revolution</title>
  <meta name="description" content="Join the OpenLyst community and help build revolutionary free and open source applications. Every contribution makes a difference." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-20">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
    <div class="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-8">
      <span class="text-red-900 font-bold text-4xl">✊</span>
    </div>
    <h1 class="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
      Join the Revolution
    </h1>
    <p class="mx-auto max-w-2xl text-lg text-red-100">
      Help us build revolutionary free and open source applications that serve the people. 
      Every contribution, no matter how small, makes a difference in the fight for digital freedom.
    </p>
  </div>
</section>

<!-- Ways to Contribute -->
<Section 
  title="Ways to Contribute" 
  subtitle="There are many ways to support our mission, regardless of your technical background."
>
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Code Development</h3>
        <p class="text-gray-600 mb-4">Contribute to our applications with new features, bug fixes, and improvements.</p>
        <ul class="text-sm text-gray-600 space-y-1 mb-4">
          <li>• Frontend development (Svelte, React, Flutter)</li>
          <li>• Backend development (Node.js, Rust, Go)</li>
          <li>• Mobile development (iOS, Android)</li>
          <li>• DevOps and infrastructure</li>
        </ul>
        <Button text="View Repositories" href="#" variant="primary" />
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2H7z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Design & UX</h3>
        <p class="text-gray-600 mb-4">Help create beautiful, accessible, and user-friendly interfaces.</p>
        <ul class="text-sm text-gray-600 space-y-1 mb-4">
          <li>• UI/UX design</li>
          <li>• Accessibility improvements</li>
          <li>• Icon and graphic design</li>
          <li>• User research and testing</li>
        </ul>
        <Button text="Design Guidelines" href="#" variant="primary" />
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Documentation</h3>
        <p class="text-gray-600 mb-4">Help make our software accessible through clear documentation and guides.</p>
        <ul class="text-sm text-gray-600 space-y-1 mb-4">
          <li>• User guides and tutorials</li>
          <li>• API documentation</li>
          <li>• Developer onboarding docs</li>
          <li>• FAQ and troubleshooting</li>
        </ul>
        <Button text="Documentation Hub" href="#" variant="primary" />
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Translation</h3>
        <p class="text-gray-600 mb-4">Help make our applications accessible to users around the world.</p>
        <ul class="text-sm text-gray-600 space-y-1 mb-4">
          <li>• Application interface translation</li>
          <li>• Documentation translation</li>
          <li>• Website localization</li>
          <li>• Cultural adaptation</li>
        </ul>
        <Button text="Translation Portal" href="#" variant="primary" />
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Testing & QA</h3>
        <p class="text-gray-600 mb-4">Help ensure our applications work perfectly across all platforms and use cases.</p>
        <ul class="text-sm text-gray-600 space-y-1 mb-4">
          <li>• Bug reporting and reproduction</li>
          <li>• Beta testing new features</li>
          <li>• Performance testing</li>
          <li>• Accessibility testing</li>
        </ul>
        <Button text="Testing Guidelines" href="#" variant="primary" />
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Community Support</h3>
        <p class="text-gray-600 mb-4">Help other users get the most out of our applications and build our community.</p>
        <ul class="text-sm text-gray-600 space-y-1 mb-4">
          <li>• Answer questions in forums</li>
          <li>• Moderate community spaces</li>
          <li>• Create tutorials and content</li>
          <li>• Organize local meetups</li>
        </ul>
        <Button text="Join Community" href="#" variant="primary" />
      </div>
    </div>
  {/snippet}
</Section>

<!-- Getting Started -->
<Section 
  title="Getting Started" 
  subtitle="Ready to contribute? Here's how to get involved with the OpenLyst community."
  background="default"
>
  {#snippet children()}
    <div class="max-w-4xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-6">
          <div class="bg-red-50 rounded-lg p-6 border border-red-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">1. Join Our Community</h3>
            <p class="text-gray-600 mb-4">
              Start by joining our Matrix chat room where contributors coordinate, 
              share ideas, and help each other.
            </p>
            <Button text="Join Matrix Chat" href="#" variant="primary" />
          </div>
          
          <div class="bg-red-50 rounded-lg p-6 border border-red-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">2. Find an Issue</h3>
            <p class="text-gray-600 mb-4">
              Browse our issue trackers for beginner-friendly tasks marked with 
              "good first issue" or "help wanted" labels.
            </p>
            <Button text="Browse Issues" href="#" variant="primary" />
          </div>
        </div>
        
        <div class="space-y-6">
          <div class="bg-red-50 rounded-lg p-6 border border-red-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">3. Read the Guidelines</h3>
            <p class="text-gray-600 mb-4">
              Familiarize yourself with our contribution guidelines, code of conduct, 
              and development practices.
            </p>
            <Button text="Contribution Guidelines" href="#" variant="primary" />
          </div>
          
          <div class="bg-red-50 rounded-lg p-6 border border-red-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">4. Make Your First Contribution</h3>
            <p class="text-gray-600 mb-4">
              Start with a small contribution to get familiar with our workflow. 
              Even fixing typos helps!
            </p>
            <Button text="Start Contributing" href="#" variant="primary" />
          </div>
        </div>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Resources -->
<Section 
  title="Resources for Contributors" 
  subtitle="Everything you need to become an effective OpenLyst contributor."
  background="red"
>
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 text-center">
        <div class="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Developer Docs</h3>
        <p class="text-red-100 text-sm mb-4">Setup guides, API docs, and architecture overview</p>
        <Button text="Read Docs" href="#" variant="outline" />
      </div>
      
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 text-center">
        <div class="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Chat Rooms</h3>
        <p class="text-red-100 text-sm mb-4">Real-time discussion with the community</p>
        <Button text="Join Chat" href="#" variant="outline" />
      </div>
      
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 text-center">
        <div class="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Source Code</h3>
        <p class="text-red-100 text-sm mb-4">All our repositories on GitHub and GitLab</p>
        <Button text="Browse Code" href="#" variant="outline" />
      </div>
      
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 text-center">
        <div class="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Issue Tracker</h3>
        <p class="text-red-100 text-sm mb-4">Report bugs and request features</p>
        <Button text="View Issues" href="#" variant="outline" />
      </div>
    </div>
  {/snippet}
</Section>

<!-- Code of Conduct -->
<Section 
  title="Our Code of Conduct" 
  subtitle="We are committed to providing a welcoming and inclusive environment for all contributors."
>
  {#snippet children()}
    <div class="max-w-4xl mx-auto">
      <div class="bg-red-50 rounded-lg p-8 border border-red-200">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Creating a Safe Space</h3>
        <p class="text-gray-600 mb-6">
          OpenLyst is committed to fostering an inclusive, welcoming community where everyone can contribute 
          regardless of their background, experience level, gender identity, sexual orientation, disability, 
          race, ethnicity, religion, or nationality.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">We Encourage:</h4>
            <ul class="space-y-1 text-gray-600">
              <li>• Respectful and constructive communication</li>
              <li>• Welcoming newcomers and helping them learn</li>
              <li>• Gracefully accepting constructive criticism</li>
              <li>• Focusing on what's best for the community</li>
              <li>• Showing empathy toward other contributors</li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">We Don't Tolerate:</h4>
            <ul class="space-y-1 text-gray-600">
              <li>• Harassment or discriminatory behavior</li>
              <li>• Trolling, insulting, or derogatory comments</li>
              <li>• Public or private harassment</li>
              <li>• Publishing others' private information</li>
              <li>• Any conduct that could reasonably be considered inappropriate</li>
            </ul>
          </div>
        </div>
        
        <div class="mt-6 text-center">
          <Button text="Read Full Code of Conduct" href="#" variant="primary" />
        </div>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Call to Action -->
<Section 
  title="Ready to Make a Difference?" 
  subtitle="Join thousands of contributors building the future of free software."
  background="red"
  centered={true}
>
  {#snippet children()}
    <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
      <Button text="Start Contributing Today" href="#" variant="secondary" size="lg" />
      <Button text="Join Our Community" href="#" variant="outline" size="lg" />
    </div>
    
    <div class="mt-12 text-center">
      <p class="text-red-100 text-lg font-medium">
        "Never doubt that a small group of thoughtful, committed citizens can change the world; 
        indeed, it's the only thing that ever has."
      </p>
      <p class="text-red-200 mt-2">- Margaret Mead</p>
    </div>
  {/snippet}
</Section>