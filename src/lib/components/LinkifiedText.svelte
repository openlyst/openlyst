<script lang="ts">
  import { parseTextWithUrls } from '$lib/utils/linkify';

  interface Props {
    text: string;
    class?: string;
  }

  let { text = '', class: className = '' }: Props = $props();
  const segments = $derived(parseTextWithUrls(text));
</script>

<span class={className}>
  {#each segments as segment}
    {#if segment.type === 'url'}
      <a
        href={segment.value}
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-400 hover:text-blue-300 underline break-all"
      >
        {segment.value}
      </a>
    {:else}
      {segment.value}
    {/if}
  {/each}
</span>
