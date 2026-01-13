<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  interface Icon {
    gradient: string;
    shadow: string;
    shape: string;
    rotation: number;
    scale: number;
    x: number;
    y: number;
  }
  
  let container: HTMLDivElement;
  let mouseX = $state(0);
  let mouseY = $state(0);
  let isHovering = $state(false);
  let icons = $state<Icon[]>([
    { gradient: 'from-green-400 to-emerald-500', shadow: 'shadow-green-500/50', shape: 'rounded-full', rotation: 0, scale: 1, x: 0, y: 0 },
    { gradient: 'from-orange-400 to-amber-500', shadow: 'shadow-orange-500/50', shape: 'rounded-lg', rotation: 0, scale: 1, x: 0, y: 0 },
    { gradient: 'from-purple-400 to-violet-500', shadow: 'shadow-purple-500/50', shape: 'rounded', rotation: 0, scale: 1, x: 0, y: 0 },
    { gradient: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-500/50', shape: 'rounded-full', rotation: 0, scale: 1, x: 0, y: 0 },
    { gradient: 'from-pink-400 to-rose-500', shadow: 'shadow-pink-500/50', shape: 'rounded-full', rotation: 0, scale: 1, x: 0, y: 0 },
    { gradient: 'from-gray-400 to-slate-500', shadow: 'shadow-gray-500/50', shape: 'rounded', rotation: 0, scale: 1, x: 0, y: 0 },
  ]);
  
  let iconElements: HTMLDivElement[] = [];
  
  function handleMouseMove(e: MouseEvent) {
    if (!container || !browser) return;
    
    const rect = container.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    icons = icons.map((icon, i) => {
      const el = iconElements[i];
      if (!el) return icon;
      
      const iconRect = el.getBoundingClientRect();
      const iconCenterX = iconRect.left - rect.left + iconRect.width / 2;
      const iconCenterY = iconRect.top - rect.top + iconRect.height / 2;
      
      // Distance from mouse to icon
      const dx = mouseX - iconCenterX;
      const dy = mouseY - iconCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Repel effect - icons move away from cursor
      const maxDistance = 150;
      const strength = Math.max(0, 1 - distance / maxDistance);
      
      // Calculate repulsion
      const angle = Math.atan2(dy, dx);
      const repelX = -Math.cos(angle) * strength * 25;
      const repelY = -Math.sin(angle) * strength * 25;
      
      // Add some rotation based on distance
      const rotation = strength * 15 * (i % 2 === 0 ? 1 : -1);
      
      // Scale up slightly when close
      const scale = 1 + strength * 0.3;
      
      return {
        ...icon,
        x: repelX,
        y: repelY,
        rotation,
        scale
      };
    });
  }
  
  function handleMouseEnter() {
    isHovering = true;
  }
  
  function handleMouseLeave() {
    isHovering = false;
    // Reset all icons
    icons = icons.map(icon => ({
      ...icon,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1
    }));
  }
  
  function handleIconClick(index: number) {
    // Fun bounce effect on click
    icons = icons.map((icon, i) => {
      if (i === index) {
        return { ...icon, scale: 1.5 };
      }
      // Push nearby icons away
      const distance = Math.abs(i - index);
      if (distance <= 2) {
        const pushDirection = i < index ? -1 : 1;
        return { 
          ...icon, 
          x: pushDirection * (30 / distance),
          rotation: pushDirection * 20
        };
      }
      return icon;
    });
    
    // Reset after animation
    setTimeout(() => {
      icons = icons.map(icon => ({
        ...icon,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1
      }));
    }, 300);
  }
</script>

<div 
  bind:this={container}
  class="mb-8 flex justify-center"
  role="presentation"
>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class="glass-card rounded-2xl px-8 py-4 shadow-2xl cursor-pointer select-none"
    onmousemove={handleMouseMove}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
  >
    <div class="flex items-center space-x-4">
      {#each icons as icon, i}
        <div
          bind:this={iconElements[i]}
          class="w-8 h-8 bg-gradient-to-br {icon.gradient} {icon.shape} shadow-lg {icon.shadow} transition-all duration-150 ease-out hover:brightness-125"
          style="transform: translate({icon.x}px, {icon.y}px) rotate({icon.rotation}deg) scale({icon.scale}); will-change: transform;"
          onclick={() => handleIconClick(i)}
          onkeydown={(e) => e.key === 'Enter' && handleIconClick(i)}
          role="button"
          tabindex="0"
          aria-label="Platform icon {i + 1}"
        ></div>
      {/each}
    </div>
  </div>
</div>

<style>
  div[role="button"]:focus {
    outline: 2px solid rgba(139, 92, 246, 0.5);
    outline-offset: 2px;
  }
</style>
