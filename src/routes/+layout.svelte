<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Header, Footer } from '$lib';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	
	let { children } = $props();
	let showBackground = $state(false);
	let Background3DComponent: any = $state(null);
	
	onMount(async () => {
		if (browser) {
			try {
				const module = await import('$lib/components/Background3D.svelte');
				Background3DComponent = module.default;
				// Use tick to ensure the component is ready before showing
				await new Promise(resolve => requestAnimationFrame(resolve));
				showBackground = true;
			} catch (e) {
				console.error('Failed to load Background3D:', e);
			}
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if showBackground && Background3DComponent}
	<Background3DComponent />
{/if}

<div class="min-h-screen flex flex-col bg-transparent">
	<Header />
	
	<main class="flex-1">
		{@render children?.()}
	</main>
	
	<Footer />
</div>
