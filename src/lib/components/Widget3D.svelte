<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';

	interface Props {
		width?: number;
		height?: number;
		color?: string;
		glowColor?: string;
		children?: any;
	}

	let { 
		width = 300, 
		height = 200, 
		color = '#1f2937',
		glowColor = '#8b5cf6',
		children 
	}: Props = $props();

	let container: HTMLDivElement;
	let animationId: number;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.WebGLRenderer;
	let cardMesh: THREE.Mesh;
	let glowMesh: THREE.Mesh;
	let isHovered = $state(false);
	let mouseX = 0;
	let mouseY = 0;

	function hexToNumber(hex: string): number {
		return parseInt(hex.replace('#', ''), 16);
	}

	onMount(() => {
		init();
		animate();

		return () => cleanup();
	});

	onDestroy(() => {
		cleanup();
	});

	function cleanup() {
		if (animationId) cancelAnimationFrame(animationId);
		if (renderer) {
			renderer.dispose();
			renderer.domElement.remove();
		}
	}

	function init() {
		scene = new THREE.Scene();

		const aspect = width / height;
		camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
		camera.position.z = 150;

		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(width, height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setClearColor(0x000000, 0);
		container.appendChild(renderer.domElement);

		// Create card geometry with rounded appearance
		const cardWidth = 80;
		const cardHeight = 50;
		const cardDepth = 4;

		const geometry = new THREE.BoxGeometry(cardWidth, cardHeight, cardDepth, 2, 2, 2);
		
		const material = new THREE.MeshPhongMaterial({
			color: hexToNumber(color),
			emissive: hexToNumber(glowColor),
			emissiveIntensity: 0.05,
			shininess: 80,
			specular: 0x444444,
			transparent: true,
			opacity: 0.85
		});

		cardMesh = new THREE.Mesh(geometry, material);
		scene.add(cardMesh);

		// Add glowing edges
		const edgeGeometry = new THREE.EdgesGeometry(geometry);
		const edgeMaterial = new THREE.LineBasicMaterial({ 
			color: hexToNumber(glowColor), 
			transparent: true, 
			opacity: 0.4 
		});
		const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
		cardMesh.add(edges);

		// Add subtle glow plane behind
		const glowGeometry = new THREE.PlaneGeometry(cardWidth + 10, cardHeight + 10);
		const glowMaterial = new THREE.MeshBasicMaterial({
			color: hexToNumber(glowColor),
			transparent: true,
			opacity: 0.1,
			side: THREE.DoubleSide
		});
		glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
		glowMesh.position.z = -5;
		scene.add(glowMesh);

		// Lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
		scene.add(ambientLight);

		const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
		frontLight.position.set(0, 20, 50);
		scene.add(frontLight);

		const accentLight = new THREE.PointLight(hexToNumber(glowColor), 0.5, 200);
		accentLight.position.set(30, 30, 40);
		scene.add(accentLight);

		// Initial subtle angle
		cardMesh.rotation.x = -0.05;
		cardMesh.rotation.y = 0.02;
	}

	function handleMouseMove(e: MouseEvent) {
		const rect = container.getBoundingClientRect();
		mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
		mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
	}

	function animate() {
		animationId = requestAnimationFrame(animate);

		if (cardMesh) {
			// Smooth rotation based on mouse position when hovered
			const targetRotY = isHovered ? mouseX * 0.15 : 0.02;
			const targetRotX = isHovered ? -mouseY * 0.1 - 0.05 : -0.05;
			const targetZ = isHovered ? 5 : 0;

			cardMesh.rotation.x += (targetRotX - cardMesh.rotation.x) * 0.08;
			cardMesh.rotation.y += (targetRotY - cardMesh.rotation.y) * 0.08;
			cardMesh.position.z += (targetZ - cardMesh.position.z) * 0.1;

			// Glow effect on hover
			const mat = cardMesh.material as THREE.MeshPhongMaterial;
			const targetEmissive = isHovered ? 0.15 : 0.05;
			mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * 0.1;

			if (glowMesh) {
				const glowMat = glowMesh.material as THREE.MeshBasicMaterial;
				const targetGlowOpacity = isHovered ? 0.2 : 0.1;
				glowMat.opacity += (targetGlowOpacity - glowMat.opacity) * 0.1;
			}
		}

		renderer.render(scene, camera);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
	class="widget-3d-wrapper"
	style="width: {width}px; height: {height}px;"
	onmouseenter={() => isHovered = true}
	onmouseleave={() => isHovered = false}
	onmousemove={handleMouseMove}
>
	<div bind:this={container} class="widget-3d-canvas"></div>
	<div class="widget-3d-content">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<style>
	.widget-3d-wrapper {
		position: relative;
		display: block;
	}

	.widget-3d-canvas {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
	}

	.widget-3d-canvas :global(canvas) {
		display: block;
	}

	.widget-3d-content {
		position: relative;
		z-index: 2;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		color: white;
	}
</style>
