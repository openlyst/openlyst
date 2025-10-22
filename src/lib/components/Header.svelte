<script lang="ts">
  import { page } from '$app/stores';
  import favicon from '$lib/assets/favicon.svg';
  
  let isMenuOpen = $state(false);
  
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Apps', href: '/apps' },
    { name: 'About', href: '/about' },
    { name: 'Contribute', href: '/contribute' }
  ];
</script>

<header class="bg-red-900 text-white shadow-lg">
  <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 justify-between items-center">
      <!-- Logo -->
      <div class="flex items-center">
        <a href="/" class="flex items-center space-x-2">
          <img src={favicon} alt="OpenLyst Logo" class="w-8 h-8" />
          <span class="text-xl font-bold">OpenLyst</span>
        </a>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:block">
        <div class="ml-10 flex items-baseline space-x-4">
          {#each navigation as item}
            <a 
              href={item.href} 
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors
                     {$page.url.pathname === item.href 
                       ? 'bg-red-700 text-yellow-400' 
                       : 'text-white hover:bg-red-800 hover:text-yellow-400'}"
            >
              {item.name}
            </a>
          {/each}
        </div>
      </div>

      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button
          onclick={() => isMenuOpen = !isMenuOpen}
          class="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-400 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400"
        >
          <span class="sr-only">Open main menu</span>
          <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation -->
    {#if isMenuOpen}
      <div class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {#each navigation as item}
            <a 
              href={item.href} 
              class="block px-3 py-2 rounded-md text-base font-medium transition-colors
                     {$page.url.pathname === item.href 
                       ? 'bg-red-700 text-yellow-400' 
                       : 'text-white hover:bg-red-800 hover:text-yellow-400'}"
              onclick={() => isMenuOpen = false}
            >
              {item.name}
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </nav>
</header>