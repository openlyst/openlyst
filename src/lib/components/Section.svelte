<script lang="ts">
  interface Props {
    title: string;
    subtitle?: string;
    centered?: boolean;
    background?: 'default' | 'red' | 'dark' | 'gray' | 'glass';
    children: any;
  }

  let { 
    title, 
    subtitle = '', 
    centered = false, 
    background = 'default',
    children
  }: Props = $props();

  const backgroundClasses = {
    default: 'bg-transparent',
    red: 'glass-light text-white',
    dark: 'bg-transparent text-white',
    gray: 'glass-light',
    glass: 'glass'
  };
</script>

<section class="py-16 {backgroundClasses[background]}">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12 {centered ? '' : 'text-left'}">
      <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
        {title}
      </h2>
      {#if subtitle}
        <p class="mt-4 text-lg text-gray-300 max-w-2xl {centered ? 'mx-auto' : ''}">
          {subtitle}
        </p>
      {/if}
    </div>
    
    <div class="{centered ? 'text-center' : ''}">
      {@render children()}
    </div>
  </div>
</section>