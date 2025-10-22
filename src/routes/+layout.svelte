<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Header, Footer } from '$lib';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen flex flex-col bg-gray-50">
	<Header />
	
	<main class="flex-1">
		{@render children?.()}
	</main>
	
	<Footer />
</div>
