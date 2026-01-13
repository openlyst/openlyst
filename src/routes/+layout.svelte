<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Header, Footer } from '$lib';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	
	let { children } = $props();
	let Background3D: any = $state(null);
	
	onMount(async () => {
		if (browser) {
			const module = await import('$lib/components/Background3D.svelte');
			Background3D = module.default;
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if Background3D}
	<Background3D />
{/if}

<div class="min-h-screen flex flex-col bg-transparent">
	<Header />
	
	<main class="flex-1">
		{@render children?.()}
	</main>
	
	<Footer />
</div>
