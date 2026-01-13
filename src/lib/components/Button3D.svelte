<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		text: string;
		href?: string;
		onclick?: () => void;
		variant?: 'primary' | 'secondary' | 'outline';
		size?: 'sm' | 'md' | 'lg';
	}

	let { text, href = '', onclick, variant = 'primary', size = 'md' }: Props = $props();

	let isHovered = $state(false);
	let isPressed = $state(false);

	const sizeConfig = {
		sm: { padding: 'px-4 py-2', fontSize: 'text-sm' },
		md: { padding: 'px-6 py-3', fontSize: 'text-base' },
		lg: { padding: 'px-8 py-4', fontSize: 'text-lg' }
	};

	const colorConfig = {
		primary: { 
			bg: 'from-purple-600 to-violet-700',
			shadow: 'shadow-purple-500/50',
			border: 'border-purple-400/30',
			glow: 'hover:shadow-purple-500/60'
		},
		secondary: { 
			bg: 'from-cyan-500 to-blue-600',
			shadow: 'shadow-cyan-500/50',
			border: 'border-cyan-400/30',
			glow: 'hover:shadow-cyan-500/60'
		},
		outline: { 
			bg: 'from-gray-700 to-gray-800',
			shadow: 'shadow-gray-500/30',
			border: 'border-purple-400/50',
			glow: 'hover:shadow-purple-500/40'
		}
	};

	const config = sizeConfig[size];
	const colors = colorConfig[variant];

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

<button 
	class="button-3d {config.padding} {config.fontSize} bg-gradient-to-br {colors.bg} {colors.glow} border {colors.border}"
	class:hovered={isHovered}
	class:pressed={isPressed}
	onmouseenter={() => isHovered = true}
	onmouseleave={() => { isHovered = false; isPressed = false; }}
	onmousedown={() => isPressed = true}
	onmouseup={() => isPressed = false}
	onclick={handleClick}
>
	<span class="button-3d-face"></span>
	<span class="button-3d-text">{text}</span>
</button>

<style>
	.button-3d {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-weight: 600;
		color: white;
		border-radius: 12px;
		transform-style: preserve-3d;
		transform: perspective(500px) rotateX(-5deg) translateY(0);
		transition: all 0.2s ease-out;
		box-shadow: 
			0 8px 20px -4px rgba(0, 0, 0, 0.4),
			0 4px 8px -2px rgba(0, 0, 0, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.2),
			inset 0 -2px 0 rgba(0, 0, 0, 0.2);
	}

	.button-3d::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 12px;
		background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%);
		pointer-events: none;
	}

	.button-3d::after {
		content: '';
		position: absolute;
		left: 10%;
		right: 10%;
		bottom: -6px;
		height: 6px;
		background: inherit;
		filter: brightness(0.6);
		border-radius: 0 0 8px 8px;
		transform: rotateX(90deg);
		transform-origin: top;
	}

	.button-3d.hovered {
		transform: perspective(500px) rotateX(-8deg) translateY(-3px);
		box-shadow: 
			0 12px 30px -4px rgba(0, 0, 0, 0.5),
			0 8px 16px -4px rgba(0, 0, 0, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.3),
			inset 0 -2px 0 rgba(0, 0, 0, 0.2);
	}

	.button-3d.pressed {
		transform: perspective(500px) rotateX(-3deg) translateY(2px);
		box-shadow: 
			0 4px 10px -2px rgba(0, 0, 0, 0.4),
			0 2px 4px -1px rgba(0, 0, 0, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.1),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2);
	}

	.button-3d-text {
		position: relative;
		z-index: 2;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		user-select: none;
	}
</style>
