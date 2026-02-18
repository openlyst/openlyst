<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { language } from '$lib/stores/language';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { tick } from 'svelte';
	
	let { children } = $props();
	let showBackground = $state(false);
	let Background3DComponent: any = $state(null);
	
	const isApiPage = $derived($page.url.pathname.startsWith('/docs/api'));
	const isFunMode = $derived(!isApiPage);
	
	async function loadBackground() {
		if (Background3DComponent) return;
		try {
			const module = await import('$lib/components/Background3D.svelte');
			Background3DComponent = module.default;
			await tick();
			showBackground = true;
		} catch (e) {
			console.error('Failed to load Background3D:', e);
		}
	}
	
	$effect(() => {
		if (browser && isFunMode) loadBackground();
	});
	
	onMount(() => {
		if (browser) language.initialize();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if isFunMode && showBackground && Background3DComponent}
	<Background3DComponent />
{/if}

<div class="min-h-screen flex flex-col bg-transparent" class:fun-mode={isFunMode}>
	<Header />
	
	<main class="flex-1">
		{@render children?.()}
	</main>
	
	<Footer />
</div>
