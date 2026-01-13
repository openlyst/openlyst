<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';

	interface Props {
		text: string;
		href?: string;
		onclick?: () => void;
		variant?: 'primary' | 'secondary' | 'outline';
		size?: 'sm' | 'md' | 'lg';
	}

	let { text, href = '', onclick, variant = 'primary', size = 'md' }: Props = $props();

	let container: HTMLDivElement;
	let animationId: number;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.WebGLRenderer;
	let buttonMesh: THREE.Mesh;
	let isHovered = $state(false);
	let isPressed = $state(false);

	const sizeConfig = {
		sm: { width: 120, height: 40, depth: 12, fontSize: 14 },
		md: { width: 160, height: 48, depth: 14, fontSize: 16 },
		lg: { width: 200, height: 56, depth: 16, fontSize: 18 }
	};

	const colorConfig = {
		primary: { 
			main: 0x8b5cf6, 
			light: 0xa78bfa, 
			dark: 0x7c3aed,
			glow: 0x8b5cf6
		},
		secondary: { 
			main: 0x06b6d4, 
			light: 0x22d3ee, 
			dark: 0x0891b2,
			glow: 0x06b6d4
		},
		outline: { 
			main: 0x1f2937, 
			light: 0x374151, 
			dark: 0x111827,
			glow: 0x8b5cf6
		}
	};

	const config = sizeConfig[size];
	const colors = colorConfig[variant];

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

		camera = new THREE.PerspectiveCamera(50, config.width / config.height, 0.1, 1000);
		camera.position.z = 80;

		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(config.width, config.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setClearColor(0x000000, 0);
		container.appendChild(renderer.domElement);

		// Create rounded box geometry
		const geometry = new THREE.BoxGeometry(50, 18, config.depth, 4, 4, 4);
		
		// Create gradient material
		const material = new THREE.MeshPhongMaterial({
			color: colors.main,
			emissive: colors.main,
			emissiveIntensity: 0.2,
			shininess: 100,
			specular: 0xffffff,
			transparent: true,
			opacity: 0.95
		});

		buttonMesh = new THREE.Mesh(geometry, material);
		scene.add(buttonMesh);

		// Add edge glow
		const edgeGeometry = new THREE.EdgesGeometry(geometry);
		const edgeMaterial = new THREE.LineBasicMaterial({ 
			color: colors.light, 
			transparent: true, 
			opacity: 0.6 
		});
		const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
		buttonMesh.add(edges);

		// Lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);

		const frontLight = new THREE.PointLight(0xffffff, 1, 200);
		frontLight.position.set(0, 20, 50);
		scene.add(frontLight);

		const topLight = new THREE.PointLight(colors.glow, 0.8, 150);
		topLight.position.set(0, 50, 30);
		scene.add(topLight);

		// Initial rotation for 3D effect
		buttonMesh.rotation.x = -0.1;
	}

	function animate() {
		animationId = requestAnimationFrame(animate);

		if (buttonMesh) {
			// Smooth hover animation
			const targetRotX = isHovered ? -0.15 : -0.1;
			const targetRotY = isHovered ? 0.05 : 0;
			const targetZ = isPressed ? -2 : (isHovered ? 2 : 0);
			const targetScale = isPressed ? 0.95 : (isHovered ? 1.05 : 1);

			buttonMesh.rotation.x += (targetRotX - buttonMesh.rotation.x) * 0.1;
			buttonMesh.rotation.y += (targetRotY - buttonMesh.rotation.y) * 0.1;
			buttonMesh.position.z += (targetZ - buttonMesh.position.z) * 0.15;
			buttonMesh.scale.x += (targetScale - buttonMesh.scale.x) * 0.1;
			buttonMesh.scale.y += (targetScale - buttonMesh.scale.y) * 0.1;

			// Update emissive intensity
			const mat = buttonMesh.material as THREE.MeshPhongMaterial;
			const targetEmissive = isHovered ? 0.4 : 0.2;
			mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * 0.1;
		}

		renderer.render(scene, camera);
	}

	function handleClick() {
		if (onclick) onclick();
		if (href) {
			if (href.startsWith('http')) {
				window.open(href, '_blank');
			} else {
				window.location.href = href;
			}
		}
	}
</script>

<div 
	class="button-3d-wrapper"
	style="width: {config.width}px; height: {config.height}px;"
>
	<div 
		bind:this={container} 
		class="button-3d-canvas"
		role="button"
		tabindex="0"
		onmouseenter={() => isHovered = true}
		onmouseleave={() => { isHovered = false; isPressed = false; }}
		onmousedown={() => isPressed = true}
		onmouseup={() => isPressed = false}
		onclick={handleClick}
		onkeydown={(e) => e.key === 'Enter' && handleClick()}
	></div>
	<span class="button-3d-text" style="font-size: {config.fontSize}px;">
		{text}
	</span>
</div>

<style>
	.button-3d-wrapper {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.button-3d-canvas {
		position: absolute;
		inset: 0;
		z-index: 1;
	}

	.button-3d-canvas :global(canvas) {
		display: block;
	}

	.button-3d-text {
		position: relative;
		z-index: 2;
		color: white;
		font-weight: 600;
		pointer-events: none;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		user-select: none;
	}
</style>
