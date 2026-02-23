'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number>(0);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const shapesRef = useRef<THREE.Group | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const initializedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const init = () => {
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0a0a1a, 0.0008);
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      camera.position.z = 500;
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x030712, 1);
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const particleCount = 2000;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const colorPalette = [
        new THREE.Color(0x8b5cf6),
        new THREE.Color(0x06b6d4),
        new THREE.Color(0xec4899),
        new THREE.Color(0x10b981),
        new THREE.Color(0xf59e0b),
      ];

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = 800;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi) - 200;
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
        sizeAttenuation: true,
      });
      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      particlesRef.current = particles;

      const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      const wireMaterial2 = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      const wireMaterial3 = new THREE.MeshBasicMaterial({
        color: 0xec4899,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });

      const geometricShapes = new THREE.Group();
      const icosahedron = new THREE.Mesh(new THREE.IcosahedronGeometry(80, 1), wireMaterial);
      icosahedron.position.set(-300, 150, -200);
      (icosahedron as THREE.Mesh & { userData: Record<string, unknown> }).userData = {
        rotationSpeed: { x: 0.002, y: 0.003, z: 0.001 },
      };
      geometricShapes.add(icosahedron);

      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(60, 20, 16, 100),
        wireMaterial2
      );
      torus.position.set(350, -100, -150);
      (torus as THREE.Mesh & { userData: Record<string, unknown> }).userData = {
        rotationSpeed: { x: 0.003, y: 0.002, z: 0.001 },
      };
      geometricShapes.add(torus);

      const octahedron = new THREE.Mesh(new THREE.OctahedronGeometry(50, 0), wireMaterial3);
      octahedron.position.set(-200, -200, -100);
      (octahedron as THREE.Mesh & { userData: Record<string, unknown> }).userData = {
        rotationSpeed: { x: 0.001, y: 0.004, z: 0.002 },
      };
      geometricShapes.add(octahedron);

      const dodecahedron = new THREE.Mesh(new THREE.DodecahedronGeometry(40, 0), wireMaterial);
      dodecahedron.position.set(200, 250, -250);
      (dodecahedron as THREE.Mesh & { userData: Record<string, unknown> }).userData = {
        rotationSpeed: { x: 0.002, y: 0.001, z: 0.003 },
      };
      geometricShapes.add(dodecahedron);

      const torusKnot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(35, 10, 100, 16),
        wireMaterial2
      );
      torusKnot.position.set(0, -300, -200);
      (torusKnot as THREE.Mesh & { userData: Record<string, unknown> }).userData = {
        rotationSpeed: { x: 0.001, y: 0.002, z: 0.001 },
      };
      geometricShapes.add(torusKnot);

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(400, 32, 32),
        new THREE.MeshBasicMaterial({
          color: 0x1e1b4b,
          wireframe: true,
          transparent: true,
          opacity: 0.1,
        })
      );
      sphere.position.set(0, 0, -600);
      (sphere as THREE.Mesh & { userData: Record<string, unknown> }).userData = {
        rotationSpeed: { x: 0.0003, y: 0.0005, z: 0 },
      };
      geometricShapes.add(sphere);
      scene.add(geometricShapes);
      shapesRef.current = geometricShapes;

      const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
      scene.add(ambientLight);
      const pointLight1 = new THREE.PointLight(0x8b5cf6, 2, 1000);
      pointLight1.position.set(200, 200, 200);
      scene.add(pointLight1);
      const pointLight2 = new THREE.PointLight(0x06b6d4, 2, 1000);
      pointLight2.position.set(-200, -200, 200);
      scene.add(pointLight2);
      const pointLight3 = new THREE.PointLight(0xec4899, 1.5, 800);
      pointLight3.position.set(0, 300, -200);
      scene.add(pointLight3);
    };

    const onWindowResize = () => {
      const cam = cameraRef.current;
      const ren = rendererRef.current;
      if (!cam || !ren) return;
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
      ren.setSize(window.innerWidth, window.innerHeight);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - window.innerWidth / 2) * 0.05;
      mouseRef.current.targetY = (e.clientY - window.innerHeight / 2) * 0.05;
    };

    const animate = () => {
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const particles = particlesRef.current;
      const geometricShapes = shapesRef.current;

      if (!initializedRef.current || !renderer || !scene || !camera) return;

      animationIdRef.current = requestAnimationFrame(animate);

      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.02;
      m.y += (m.targetY - m.y) * 0.02;
      camera.position.x += (m.x - camera.position.x) * 0.05;
      camera.position.y += (-m.y - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      if (particles) {
        particles.rotation.y += 0.0003;
        particles.rotation.x += 0.0001;
      }

      if (geometricShapes) {
        geometricShapes.children.forEach((shape) => {
          const speed = (shape as THREE.Object3D & { userData: { rotationSpeed?: { x: number; y: number; z: number } } }).userData?.rotationSpeed;
          if (speed) {
            shape.rotation.x += speed.x;
            shape.rotation.y += speed.y;
            shape.rotation.z += speed.z;
          }
        });
      }

      renderer.render(scene, camera);
    };

    const cleanup = () => {
      initializedRef.current = false;
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('mousemove', onMouseMove);
      const renderer = rendererRef.current;
      if (renderer) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };

    if (!initializedRef.current) {
      initializedRef.current = true;
      init();
      animate();
      window.addEventListener('resize', onWindowResize);
      window.addEventListener('mousemove', onMouseMove);
    }

    return cleanup;
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10 pointer-events-none [&_canvas]:block" />;
}
