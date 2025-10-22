<script lang="ts">
  interface Props {
    title: string;
    subtitle?: string;
    centered?: boolean;
    background?: 'default' | 'red' | 'dark';
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
    default: 'bg-white',
    red: 'bg-red-600 text-white',
    dark: 'bg-red-950 text-white'
  };
</script>

<section class="py-16 {backgroundClasses[background]}">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12 {centered ? '' : 'text-left'}">
      <h2 class="text-3xl font-bold tracking-tight {background === 'default' ? 'text-gray-900' : 'text-white'} sm:text-4xl">
        {title}
      </h2>
      {#if subtitle}
        <p class="mt-4 text-lg {background === 'default' ? 'text-gray-600' : 'text-gray-300'} max-w-2xl {centered ? 'mx-auto' : ''}">
          {subtitle}
        </p>
      {/if}
    </div>
    
    <div class="{centered ? 'text-center' : ''}">
      {@render children()}
    </div>
  </div>
</section>