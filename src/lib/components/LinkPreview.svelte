<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    url: string;
  }

  let { url }: Props = $props();

  let data = $state<{
    title: string | null;
    description: string | null;
    image: string | null;
    siteName: string | null;
  } | null>(null);
  let loading = $state(true);
  let error = $state(false);

  onMount(async () => {
    try {
      const res = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
      const json = await res.json();
      if (json.success) {
        data = {
          title: json.title,
          description: json.description,
          image: json.image,
          siteName: json.siteName
        };
      } else {
        error = true;
      }
    } catch {
      error = true;
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <div class="rounded-lg border border-gray-600/50 bg-gray-800/40 p-4 flex items-center gap-3 animate-pulse">
    <div class="w-16 h-16 rounded bg-gray-600/50 shrink-0"></div>
    <div class="flex-1 min-w-0 space-y-2">
      <div class="h-4 bg-gray-600/50 rounded w-3/4"></div>
      <div class="h-3 bg-gray-600/50 rounded w-full"></div>
    </div>
  </div>
{:else if error}
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    class="rounded-lg border border-gray-600/50 bg-gray-800/40 p-4 flex items-center gap-3 hover:border-cyan-500/50 transition-colors group"
  >
    <div class="w-12 h-12 rounded bg-gray-600/50 shrink-0 flex items-center justify-center text-gray-400 group-hover:text-cyan-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    </div>
    <span class="text-blue-400 group-hover:underline truncate text-sm">{url}</span>
  </a>
{:else if data}
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    class="rounded-lg border border-gray-600/50 bg-gray-800/40 overflow-hidden hover:border-cyan-500/50 transition-colors flex flex-col sm:flex-row group"
  >
    {#if data.image}
      <div class="sm:w-32 sm:min-w-[8rem] h-24 sm:h-auto sm:min-h-[6rem] bg-gray-700 shrink-0 overflow-hidden">
        <img
          src={data.image}
          alt=""
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    {/if}
    <div class="p-4 flex-1 min-w-0">
      {#if data.siteName}
        <p class="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{data.siteName}</p>
      {/if}
      {#if data.title}
        <p class="text-white font-medium group-hover:text-cyan-200 line-clamp-2">{data.title}</p>
      {/if}
      {#if data.description}
        <p class="text-gray-400 text-sm mt-1 line-clamp-2">{data.description}</p>
      {/if}
      <p class="text-blue-400 text-sm mt-2 truncate group-hover:underline">{new URL(url).hostname}</p>
    </div>
  </a>
{/if}
