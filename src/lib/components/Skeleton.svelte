<script lang="ts">
  export let variant: 'card' | 'text' | 'circle' | 'rect' = 'rect';
  export let width: string = '100%';
  export let height: string = '1rem';
  export let count: number = 1;
</script>

{#each Array(count) as _, i}
  <div 
    class="skeleton animate-pulse bg-gray-700 rounded-lg {variant === 'circle' ? 'rounded-full' : ''} {variant === 'card' ? 'h-64' : ''}"
    style="width: {width}; height: {variant === 'card' ? 'auto' : height};"
  >
    {#if variant === 'card'}
      <div class="p-6 space-y-4">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-gray-600 rounded-xl animate-pulse"></div>
          <div class="flex-1 space-y-2">
            <div class="h-5 bg-gray-600 rounded w-3/4 animate-pulse"></div>
            <div class="h-4 bg-gray-600 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
        <div class="space-y-2">
          <div class="h-4 bg-gray-600 rounded animate-pulse"></div>
          <div class="h-4 bg-gray-600 rounded w-5/6 animate-pulse"></div>
          <div class="h-4 bg-gray-600 rounded w-4/6 animate-pulse"></div>
        </div>
        <div class="flex gap-2 pt-2">
          <div class="h-6 w-16 bg-gray-600 rounded-full animate-pulse"></div>
          <div class="h-6 w-16 bg-gray-600 rounded-full animate-pulse"></div>
          <div class="h-6 w-16 bg-gray-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    {/if}
  </div>
{/each}

<style>
  .skeleton {
    position: relative;
    overflow: hidden;
  }
  
  .skeleton::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.05),
      transparent
    );
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
