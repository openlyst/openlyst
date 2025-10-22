<script lang="ts">
  interface Props {
    title: string;
    description: string;
    status: 'released' | 'beta' | 'development';
    platforms: string[];
    image?: string;
    headerImage?: string;
    href: string;
    features?: string[];
  }

  let { 
    title, 
    description, 
    status, 
    platforms, 
    image = '', 
    headerImage = '',
    href,
    features = []
  }: Props = $props();

  const statusColors = {
    released: 'bg-green-100 text-green-800 border-green-200',
    beta: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    development: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusText = {
    released: 'Released',
    beta: 'Beta',
    development: 'In Development'
  };
</script>

<div class="bg-white rounded-lg shadow-lg overflow-hidden border border-red-200 hover:shadow-xl transition-shadow duration-300">
  {#if image}
    <div class="h-48 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
      <span class="text-6xl text-white">{image}</span>
    </div>
  {:else}
    <div class="h-48 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
      <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
        <span class="text-red-900 font-bold text-2xl">★</span>
      </div>
    </div>
  {/if}

  <div class="p-6">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-xl font-bold text-gray-900">{title}</h3>
      <span class="px-3 py-1 text-xs font-medium rounded-full border {statusColors[status]}">
        {statusText[status]}
      </span>
    </div>

    <p class="text-gray-600 mb-4">{description}</p>

    {#if features.length > 0}
      <div class="mb-4">
        <h4 class="text-sm font-semibold text-gray-900 mb-2">Key Features:</h4>
        <ul class="text-sm text-gray-600 space-y-1">
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
      <h4 class="text-sm font-semibold text-gray-900 mb-2">Platforms:</h4>
      <div class="flex flex-wrap gap-2">
        {#each platforms as platform}
          <span class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-md border border-red-200">
            {platform}
          </span>
        {/each}
      </div>
    </div>

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