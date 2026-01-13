<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';

	interface Props {
		platform: string;
		subtitle?: string;
		description?: string;
		downloadUrl?: string;
		downloadText?: string;
		icon?: string;
		color?: string;
	}

	let { 
		platform,
		subtitle = '',
		description = '',
		downloadUrl = '',
		downloadText = 'Download',
		icon = '',
		color = '#8b5cf6'
	}: Props = $props();

	let container: HTMLDivElement;
	let animationId: number;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.WebGLRenderer;
	let cardMesh: THREE.Mesh;
	let buttonMesh: THREE.Mesh;
	let isHovered = $state(false);
	let isButtonHovered = $state(false);
	let mouseX = 0;
	let mouseY = 0;

	const platformIcons: Record<string, string> = {
		'iOS': '',
		'macOS': '',
		'Windows': '',
		'Linux': '',
		'Android': '',
		'Web': '🌐'
	};

	function hexToNumber(hex: string): number {
		return parseInt(hex.replace('#', ''), 16);
	}

	onMount(() => {
		init();
		animate();
		return () => cleanup();
	});

	onDestroy(() => cleanup());

	function cleanup() {
		if (animationId) cancelAnimationFrame(animationId);
		if (renderer) {
			renderer.dispose();
			renderer.domElement.remove();
		}
	}

	function init() {
		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
		camera.position.z = 200;

		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(340, 200);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setClearColor(0x000000, 0);
		container.appendChild(renderer.domElement);

		// Main card
		const cardGeometry = new THREE.BoxGeometry(120, 70, 6, 2, 2, 2);
		const cardMaterial = new THREE.MeshPhongMaterial({
			color: 0x1e293b,
			emissive: hexToNumber(color),
			emissiveIntensity: 0.03,
			shininess: 60,
			transparent: true,
			opacity: 0.9
		});
		cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
		scene.add(cardMesh);

		// Card edges
		const edgeGeometry = new THREE.EdgesGeometry(cardGeometry);
		const edgeMaterial = new THREE.LineBasicMaterial({ 
			color: hexToNumber(color), 
			transparent: true, 
			opacity: 0.3 
		});
		const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
		cardMesh.add(edges);

		// Download button as 3D element
		const buttonGeometry = new THREE.BoxGeometry(45, 12, 5);
		const buttonMaterial = new THREE.MeshPhongMaterial({
			color: hexToNumber(color),
			emissive: hexToNumber(color),
			emissiveIntensity: 0.3,
			shininess: 100
		});
		buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
		buttonMesh.position.set(0, -22, 5);
		cardMesh.add(buttonMesh);

		// Lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);

		const frontLight = new THREE.DirectionalLight(0xffffff, 0.7);
		frontLight.position.set(20, 30, 50);
		scene.add(frontLight);

		const accentLight = new THREE.PointLight(hexToNumber(color), 0.6, 300);
		accentLight.position.set(-30, 40, 60);
		scene.add(accentLight);

		cardMesh.rotation.x = -0.08;
		cardMesh.rotation.y = 0.05;
	}

	function handleMouseMove(e: MouseEvent) {
		const rect = container.getBoundingClientRect();
		mouseX = ((e.clientX - rect.left) / 340 - 0.5) * 2;
		mouseY = ((e.clientY - rect.top) / 200 - 0.5) * 2;
	}

	function animate() {
		animationId = requestAnimationFrame(animate);

		if (cardMesh) {
			const targetRotY = isHovered ? mouseX * 0.12 : 0.05;
			const targetRotX = isHovered ? -mouseY * 0.08 - 0.08 : -0.08;
			const targetZ = isHovered ? 8 : 0;

			cardMesh.rotation.x += (targetRotX - cardMesh.rotation.x) * 0.06;
			cardMesh.rotation.y += (targetRotY - cardMesh.rotation.y) * 0.06;
			cardMesh.position.z += (targetZ - cardMesh.position.z) * 0.08;

			const mat = cardMesh.material as THREE.MeshPhongMaterial;
			const targetEmissive = isHovered ? 0.08 : 0.03;
			mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * 0.1;
		}

		if (buttonMesh) {
			const btnMat = buttonMesh.material as THREE.MeshPhongMaterial;
			const targetBtnEmissive = isButtonHovered ? 0.6 : 0.3;
			const targetBtnZ = isButtonHovered ? 8 : 5;
			btnMat.emissiveIntensity += (targetBtnEmissive - btnMat.emissiveIntensity) * 0.15;
			buttonMesh.position.z += (targetBtnZ - buttonMesh.position.z) * 0.15;
		}

		renderer.render(scene, camera);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
	class="platform-card-3d"
	onmouseenter={() => isHovered = true}
	onmouseleave={() => { isHovered = false; isButtonHovered = false; }}
	onmousemove={handleMouseMove}
>
	<div bind:this={container} class="platform-canvas"></div>
	<div class="platform-content">
		<div class="platform-icon">
			{platformIcons[platform] || icon || '📦'}
		</div>
		<div class="platform-info">
			<h3>{platform}</h3>
			{#if subtitle}
				<p class="subtitle">{subtitle}</p>
			{/if}
		</div>
		{#if description}
			<p class="description">{description}</p>
		{/if}
		{#if downloadUrl}
			<a 
				href={downloadUrl}
				class="download-btn"
				onmouseenter={() => isButtonHovered = true}
				onmouseleave={() => isButtonHovered = false}
			>
				{downloadText}
			</a>
		{/if}
	</div>
</div>

<style>
	.platform-card-3d {
		position: relative;
		width: 340px;
		height: 200px;
	}

	.platform-canvas {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
	}

	.platform-canvas :global(canvas) {
		display: block;
	}

	.platform-content {
		position: relative;
		z-index: 2;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		padding: 1.5rem;
		color: white;
	}

	.platform-icon {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.platform-info h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0;
	}

	.subtitle {
		font-size: 0.875rem;
		color: #9ca3af;
		margin: 0.25rem 0 0 0;
	}

	.description {
		font-size: 0.875rem;
		color: #d1d5db;
		margin: 0.75rem 0;
		flex: 1;
	}

	.download-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1.25rem;
		background: transparent;
		color: white;
		font-weight: 500;
		font-size: 0.875rem;
		text-decoration: none;
		transition: all 0.2s ease;
		margin-top: auto;
	}

	.download-btn:hover {
		transform: translateY(-1px);
	}
</style>
