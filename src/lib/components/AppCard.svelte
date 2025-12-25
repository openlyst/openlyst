<script lang="ts">
  interface Props {
    title: string;
    description: string;
    status: 'released' | 'beta' | 'development';
    platforms: string[];
    image?: string;
    href: string;
    features?: string[];
    tintColor?: string;
  }

  let { 
    title, 
    description, 
    status, 
    platforms, 
    image = '', 
    href,
    features = [],
    tintColor = '#dc2626'
  }: Props = $props();

  let expanded = $state(false);
  
  // Parse tintColor to RGB for various uses
  function parseColor(color: string): { r: number; g: number; b: number } {
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16)
      };
    }
    return { r: 220, g: 38, b: 38 }; // Default red
  }

  function darkenColor(color: string, factor: number = 0.8): string {
    const { r, g, b } = parseColor(color);
    return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
  }

  const baseColor = tintColor || '#dc2626';
  const darkerColor = darkenColor(baseColor, 0.75);
  const { r, g, b } = parseColor(baseColor);
  
  const MAX_DESCRIPTION_LENGTH = 150;
  const isLongDescription = description.length > MAX_DESCRIPTION_LENGTH;
  const truncatedDescription = isLongDescription 
    ? description.slice(0, MAX_DESCRIPTION_LENGTH).trim() + '...' 
    : description;

  const statusColors = {
    released: { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981', border: 'rgba(16, 185, 129, 0.3)' },
    beta: { bg: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
    development: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' }
  };

  const statusText = {
    released: 'Released',
    beta: 'Beta',
    development: 'In Development'
  };
</script>

<div class="card">
  <!-- Header with gradient -->
  <div 
    class="header"
    style="background: linear-gradient(135deg, {baseColor} 0%, {darkerColor} 100%);"
  >
    <div class="logo-container">
      {#if image && (image.startsWith('http') || image.startsWith('/'))}
        <img src={image} alt="{title} icon" class="logo-img" />
      {:else if image}
        <div class="logo-emoji">{image}</div>
      {:else}
        <div class="logo-fallback">🎵</div>
      {/if}
      <div class="header-text">
        <h3>{title}</h3>
        <span 
          class="status-badge"
          style="background: {statusColors[status].bg}; color: {statusColors[status].text}; border-color: {statusColors[status].border};"
        >
          {statusText[status]}
        </span>
      </div>
    </div>
  </div>

  <!-- Content -->
  <div class="content">
    <div class="description-container">
      <p class="description">
        {#if expanded || !isLongDescription}
          {description}
        {:else}
          {truncatedDescription}
        {/if}
      </p>
      {#if isLongDescription}
        <button 
          class="read-more-btn"
          onclick={() => expanded = !expanded}
          style="color: {baseColor};"
        >
          {expanded ? 'Show less' : 'Read more'}
          <svg 
            class="read-more-icon {expanded ? 'rotated' : ''}" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      {/if}
    </div>

    <div class="platforms-section">
      <div class="platforms-label">Available Platforms</div>
      <div class="platforms-grid">
        {#each platforms as platform}
          <span 
            class="platform-tag"
            style="background: rgba({r}, {g}, {b}, 0.1); color: rgba({Math.min(r + 50, 255)}, {Math.min(g + 50, 255)}, {Math.min(b + 50, 255)}, 1); border-color: rgba({r}, {g}, {b}, 0.2);"
          >
            {platform}
          </span>
        {/each}
      </div>
    </div>

    <a 
      {href}
      class="cta-button"
      style="background: linear-gradient(135deg, {baseColor} 0%, {darkerColor} 100%); box-shadow: 0 4px 16px rgba({r}, {g}, {b}, 0.3);"
    >
      Learn More
      <span class="cta-arrow">→</span>
    </a>
  </div>
</div>

<style>
  .card {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-radius: 24px;
    width: 100%;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 24px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.3));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  .header {
    padding: 40px 32px 32px;
    position: relative;
    overflow: hidden;
  }

  .header::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%;
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: 16px;
    position: relative;
    z-index: 1;
  }

  .logo-img {
    width: 72px;
    height: 72px;
    border-radius: 18px;
    object-fit: cover;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }

  .logo-emoji, .logo-fallback {
    width: 72px;
    height: 72px;
    background: linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%);
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }

  .header-text {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .header-text h3 {
    color: white;
    font-size: 28px;
    font-weight: 700;
    margin: 0;
  }

  .status-badge {
    display: inline-block;
    width: fit-content;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    border: 1px solid;
  }

  .content {
    padding: 28px 32px 32px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .description-container {
    margin-bottom: 24px;
    flex-grow: 1;
  }

  .description {
    color: #cbd5e1;
    font-size: 15px;
    line-height: 1.7;
    margin: 0;
  }

  .read-more-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 8px;
    padding: 0;
    transition: opacity 0.2s ease;
  }

  .read-more-btn:hover {
    opacity: 0.8;
  }

  .read-more-icon {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
  }

  .read-more-icon.rotated {
    transform: rotate(180deg);
  }

  .platforms-section {
    margin-bottom: 24px;
  }

  .platforms-label {
    color: #94a3b8;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
  }

  .platforms-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .platform-tag {
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    border: 1px solid;
    transition: all 0.3s ease;
  }

  .platform-tag:hover {
    transform: translateY(-2px);
  }

  .cta-button {
    width: 100%;
    color: white;
    padding: 14px 28px;
    border-radius: 12px;
    border: none;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s ease;
    text-decoration: none;
    margin-top: auto;
  }

  .cta-button:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }

  .cta-arrow {
    font-size: 18px;
    transition: transform 0.3s ease;
  }

  .cta-button:hover .cta-arrow {
    transform: translateX(4px);
  }

  @media (max-width: 480px) {
    .header {
      padding: 32px 20px 24px;
    }

    .content {
      padding: 20px;
    }

    .logo-img, .logo-emoji, .logo-fallback {
      width: 56px;
      height: 56px;
      font-size: 24px;
      border-radius: 14px;
    }

    .header-text h3 {
      font-size: 22px;
    }
  }
</style>