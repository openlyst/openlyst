<script lang="ts">
  import { page } from '$app/stores';
  import favicon from '$lib/assets/favicon.svg';
  import { language, t, SUPPORTED_LANGUAGES, LANGUAGE_NAMES, LANGUAGE_FLAGS, type SupportedLanguage } from '$lib/stores/language';
  
  let isMenuOpen = $state(false);
  let isLangMenuOpen = $state(false);
  
  // Reactive navigation based on current language
  const navigation = $derived([
    { name: $t.nav.home, href: '/' },
    { name: $t.nav.apps, href: '/apps' },
    { name: $t.nav.about, href: '/about' },
    { name: $t.nav.contribute, href: '/contribute' },
    { name: $t.nav.support, href: '/support' }
  ]);
  
  function setLanguage(lang: SupportedLanguage) {
    language.set(lang);
    isLangMenuOpen = false;
  }
</script>

<header class="glass text-white shadow-lg sticky top-0 z-50">
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
      <div class="hidden md:flex items-center">
        <div class="flex items-baseline space-x-4">
          {#each navigation as item}
            <a 
              href={item.href} 
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors
                     {$page.url.pathname === item.href 
                       ? 'bg-purple-600/50 text-white' 
                       : 'text-white hover:bg-white/10 hover:text-purple-300'}"
            >
              {item.name}
            </a>
          {/each}
        </div>
        
        <!-- Language Selector Desktop -->
        <div class="relative ml-4">
          <button
            onclick={() => isLangMenuOpen = !isLangMenuOpen}
            class="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors"
          >
            <span>{LANGUAGE_FLAGS[$language]}</span>
            <span class="hidden lg:inline">{LANGUAGE_NAMES[$language]}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {#if isLangMenuOpen}
            <div class="absolute right-0 mt-2 w-40 glass rounded-md shadow-lg ring-1 ring-white/10 z-50">
              <div class="py-1">
                {#each SUPPORTED_LANGUAGES as lang}
                  <button
                    onclick={() => setLanguage(lang)}
                    class="w-full flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors
                           {$language === lang ? 'bg-purple-600/30' : ''}"
                  >
                    <span>{LANGUAGE_FLAGS[lang]}</span>
                    <span>{LANGUAGE_NAMES[lang]}</span>
                    {#if $language === lang}
                      <svg class="w-4 h-4 ml-auto text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    {/if}
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Mobile menu button -->
      <div class="md:hidden flex items-center gap-2">
        <!-- Mobile Language Button -->
        <button
          onclick={() => isLangMenuOpen = !isLangMenuOpen}
          class="p-2 rounded-md text-white hover:bg-red-800"
        >
          <span>{LANGUAGE_FLAGS[$language]}</span>
        </button>
        
        <button
          onclick={() => isMenuOpen = !isMenuOpen}
          class="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-purple-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-400"
        >
          <span class="sr-only">Open main menu</span>
          <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Language Menu -->
    {#if isLangMenuOpen}
      <div class="md:hidden absolute right-4 mt-2 w-40 glass rounded-md shadow-lg ring-1 ring-white/10 z-50">
        <div class="py-1">
          {#each SUPPORTED_LANGUAGES as lang}
            <button
              onclick={() => setLanguage(lang)}
              class="w-full flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors
                     {$language === lang ? 'bg-purple-600/30' : ''}"
            >
              <span>{LANGUAGE_FLAGS[lang]}</span>
              <span>{LANGUAGE_NAMES[lang]}</span>
              {#if $language === lang}
                <svg class="w-4 h-4 ml-auto text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              {/if}
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Mobile Navigation -->
    {#if isMenuOpen}
      <div class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {#each navigation as item}
            <a 
              href={item.href} 
              class="block px-3 py-2 rounded-md text-base font-medium transition-colors
                     {$page.url.pathname === item.href 
                       ? 'bg-purple-600/50 text-white' 
                       : 'text-white hover:bg-white/10 hover:text-purple-300'}"
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