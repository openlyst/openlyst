<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';

	let container: HTMLDivElement;
	let animationId: number;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.WebGLRenderer;
	let particles: THREE.Points;
	let geometricShapes: THREE.Group;
	let mouseX = 0;
	let mouseY = 0;
	let targetMouseX = 0;
	let targetMouseY = 0;
	let isInitialized = false;

	onMount(() => {
		// Wait for next frame to ensure container is mounted
		requestAnimationFrame(() => {
			if (container && !isInitialized) {
				isInitialized = true;
				init();
				animate();
				window.addEventListener('resize', onWindowResize);
				window.addEventListener('mousemove', onMouseMove);
			}
		});

		return () => {
			cleanup();
		};
	});

	onDestroy(() => {
		cleanup();
	});

	function cleanup() {
		isInitialized = false;
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
		window.removeEventListener('resize', onWindowResize);
		window.removeEventListener('mousemove', onMouseMove);
		if (renderer) {
			renderer.dispose();
		}
	}

	function init() {
		if (!container) return;
		// Scene
		scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2(0x0a0a1a, 0.0008);

		// Camera
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
		camera.position.z = 500;

		// Renderer
		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setClearColor(0x030712, 1);
		container.appendChild(renderer.domElement);

		// Create particles
		createParticles();

		// Create geometric shapes
		createGeometricShapes();

		// Add ambient light
		const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
		scene.add(ambientLight);

		// Add point lights
		const pointLight1 = new THREE.PointLight(0x8b5cf6, 2, 1000);
		pointLight1.position.set(200, 200, 200);
		scene.add(pointLight1);

		const pointLight2 = new THREE.PointLight(0x06b6d4, 2, 1000);
		pointLight2.position.set(-200, -200, 200);
		scene.add(pointLight2);

		const pointLight3 = new THREE.PointLight(0xec4899, 1.5, 800);
		pointLight3.position.set(0, 300, -200);
		scene.add(pointLight3);
	}

	function createParticles() {
		const particleCount = 2000;
		const positions = new Float32Array(particleCount * 3);
		const colors = new Float32Array(particleCount * 3);
		const sizes = new Float32Array(particleCount);

		const colorPalette = [
			new THREE.Color(0x8b5cf6), // Purple
			new THREE.Color(0x06b6d4), // Cyan
			new THREE.Color(0xec4899), // Pink
			new THREE.Color(0x10b981), // Emerald
			new THREE.Color(0xf59e0b)  // Amber
		];

		for (let i = 0; i < particleCount; i++) {
			const i3 = i * 3;

			// Spread particles in a sphere
			const radius = 800;
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);

			positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
			positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
			positions[i3 + 2] = radius * Math.cos(phi) - 200;

			// Random color from palette
			const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
			colors[i3] = color.r;
			colors[i3 + 1] = color.g;
			colors[i3 + 2] = color.b;

			sizes[i] = Math.random() * 3 + 1;
		}

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
		geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

		const material = new THREE.PointsMaterial({
			size: 2,
			vertexColors: true,
			transparent: true,
			opacity: 0.8,
			blending: THREE.AdditiveBlending,
			sizeAttenuation: true
		});

		particles = new THREE.Points(geometry, material);
		scene.add(particles);
	}

	function createGeometricShapes() {
		geometricShapes = new THREE.Group();

		// Wireframe material
		const wireMaterial = new THREE.MeshBasicMaterial({
			color: 0x8b5cf6,
			wireframe: true,
			transparent: true,
			opacity: 0.3
		});

		const wireMaterial2 = new THREE.MeshBasicMaterial({
			color: 0x06b6d4,
			wireframe: true,
			transparent: true,
			opacity: 0.3
		});

		const wireMaterial3 = new THREE.MeshBasicMaterial({
			color: 0xec4899,
			wireframe: true,
			transparent: true,
			opacity: 0.25
		});

		// Icosahedron
		const icosahedron = new THREE.Mesh(
			new THREE.IcosahedronGeometry(80, 1),
			wireMaterial
		);
		icosahedron.position.set(-300, 150, -200);
		icosahedron.userData = { rotationSpeed: { x: 0.002, y: 0.003, z: 0.001 } };
		geometricShapes.add(icosahedron);

		// Torus
		const torus = new THREE.Mesh(
			new THREE.TorusGeometry(60, 20, 16, 100),
			wireMaterial2
		);
		torus.position.set(350, -100, -150);
		torus.userData = { rotationSpeed: { x: 0.003, y: 0.002, z: 0.001 } };
		geometricShapes.add(torus);

		// Octahedron
		const octahedron = new THREE.Mesh(
			new THREE.OctahedronGeometry(50, 0),
			wireMaterial3
		);
		octahedron.position.set(-200, -200, -100);
		octahedron.userData = { rotationSpeed: { x: 0.001, y: 0.004, z: 0.002 } };
		geometricShapes.add(octahedron);

		// Dodecahedron
		const dodecahedron = new THREE.Mesh(
			new THREE.DodecahedronGeometry(40, 0),
			wireMaterial
		);
		dodecahedron.position.set(200, 250, -250);
		dodecahedron.userData = { rotationSpeed: { x: 0.002, y: 0.001, z: 0.003 } };
		geometricShapes.add(dodecahedron);

		// TorusKnot
		const torusKnot = new THREE.Mesh(
			new THREE.TorusKnotGeometry(35, 10, 100, 16),
			wireMaterial2
		);
		torusKnot.position.set(0, -300, -200);
		torusKnot.userData = { rotationSpeed: { x: 0.001, y: 0.002, z: 0.001 } };
		geometricShapes.add(torusKnot);

		// Large background sphere
		const sphere = new THREE.Mesh(
			new THREE.SphereGeometry(400, 32, 32),
			new THREE.MeshBasicMaterial({
				color: 0x1e1b4b,
				wireframe: true,
				transparent: true,
				opacity: 0.1
			})
		);
		sphere.position.set(0, 0, -600);
		sphere.userData = { rotationSpeed: { x: 0.0003, y: 0.0005, z: 0 } };
		geometricShapes.add(sphere);

		scene.add(geometricShapes);
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function onMouseMove(event: MouseEvent) {
		targetMouseX = (event.clientX - window.innerWidth / 2) * 0.05;
		targetMouseY = (event.clientY - window.innerHeight / 2) * 0.05;
	}

	function animate() {
		if (!isInitialized || !renderer || !scene || !camera) return;
		
		animationId = requestAnimationFrame(animate);

		// Smooth mouse following
		mouseX += (targetMouseX - mouseX) * 0.02;
		mouseY += (targetMouseY - mouseY) * 0.02;

		// Rotate camera based on mouse position
		camera.position.x += (mouseX - camera.position.x) * 0.05;
		camera.position.y += (-mouseY - camera.position.y) * 0.05;
		camera.lookAt(scene.position);

		// Rotate particles
		if (particles) {
			particles.rotation.y += 0.0003;
			particles.rotation.x += 0.0001;
		}

		// Rotate geometric shapes
		if (geometricShapes) {
			geometricShapes.children.forEach((shape) => {
				const speed = shape.userData.rotationSpeed;
				if (speed) {
					shape.rotation.x += speed.x;
					shape.rotation.y += speed.y;
					shape.rotation.z += speed.z;
				}
			});
		}

		renderer.render(scene, camera);
	}
</script>

<div bind:this={container} class="fixed inset-0 -z-10 pointer-events-none"></div>

<style>
	div :global(canvas) {
		display: block;
	}
</style>
