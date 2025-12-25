<script lang="ts">
  interface Props {
    title: string;
    description: string;
    status: 'released' | 'beta' | 'development';
    platforms: string[];
    image?: string;
    href: string;
    features?: string[];
  }

  let { 
    title, 
    description, 
    status, 
    platforms, 
    image = '', 
    href,
    features = []
  }: Props = $props();

  let expanded = $state(false);
  
  const MAX_DESCRIPTION_LENGTH = 120;
  const isLongDescription = description.length > MAX_DESCRIPTION_LENGTH;
  const truncatedDescription = isLongDescription 
    ? description.slice(0, MAX_DESCRIPTION_LENGTH).trim() + '...' 
    : description;

  const statusColors = {
    released: 'bg-green-900/50 text-green-300 border-green-700',
    beta: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    development: 'bg-red-900/50 text-red-300 border-red-700'
  };

  const statusText = {
    released: 'Released',
    beta: 'Beta',
    development: 'In Development'
  };
</script>

<div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-red-900 hover:shadow-xl hover:shadow-red-900/20 transition-shadow duration-300 h-full flex flex-col">
  <div class="h-48 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center flex-shrink-0">
    {#if image && (image.startsWith('http') || image.startsWith('/'))}
      <img src={image} alt="{title} icon" class="w-20 h-20 rounded-2xl object-cover shadow-lg" />
    {:else if image}
      <span class="text-6xl text-white">{image}</span>
    {:else}
      <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
        <span class="text-red-900 font-bold text-2xl">★</span>
      </div>
    {/if}
  </div>

  <div class="p-6 flex flex-col flex-grow">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-xl font-bold text-white">{title}</h3>
      <span class="px-3 py-1 text-xs font-medium rounded-full border {statusColors[status]} flex-shrink-0">
        {statusText[status]}
      </span>
    </div>

    <div class="mb-4 flex-grow">
      <p class="text-gray-300 text-sm leading-relaxed">
        {#if expanded || !isLongDescription}
          {description}
        {:else}
          {truncatedDescription}
        {/if}
      </p>
      {#if isLongDescription}
        <button 
          onclick={() => expanded = !expanded}
          class="text-red-400 hover:text-red-300 text-sm font-medium mt-1 transition-colors"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      {/if}
    </div>

    {#if features.length > 0}
      <div class="mb-4">
        <h4 class="text-sm font-semibold text-gray-200 mb-2">Key Features:</h4>
        <ul class="text-sm text-gray-400 space-y-1">
          {#each features as feature}
            <li class="flex items-center">
              <span class="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
              {feature}
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    <div class="mb-4">
      <h4 class="text-sm font-semibold text-gray-200 mb-2">Platforms:</h4>
      <div class="flex flex-wrap gap-2">
        {#each platforms as platform}
          <span class="px-2 py-1 bg-red-900/50 text-red-200 text-xs rounded-md border border-red-800">
            {platform}
          </span>
        {/each}
      </div>
    </div>

    <div class="mt-auto pt-2">
      <a 
        {href} 
        class="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors duration-200"
      >
        Learn More
        <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  </div>
</div>