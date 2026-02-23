'use client';

import { useRef, useState, useCallback } from 'react';

interface Icon {
  gradient: string;
  shadow: string;
  shape: string;
  rotation: number;
  scale: number;
  x: number;
  y: number;
}

const initialIcons: Icon[] = [
  { gradient: 'from-green-400 to-emerald-500', shadow: 'shadow-green-500/50', shape: 'rounded-full', rotation: 0, scale: 1, x: 0, y: 0 },
  { gradient: 'from-orange-400 to-amber-500', shadow: 'shadow-orange-500/50', shape: 'rounded-lg', rotation: 0, scale: 1, x: 0, y: 0 },
  { gradient: 'from-purple-400 to-violet-500', shadow: 'shadow-purple-500/50', shape: 'rounded', rotation: 0, scale: 1, x: 0, y: 0 },
  { gradient: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-500/50', shape: 'rounded-full', rotation: 0, scale: 1, x: 0, y: 0 },
  { gradient: 'from-pink-400 to-rose-500', shadow: 'shadow-pink-500/50', shape: 'rounded-full', rotation: 0, scale: 1, x: 0, y: 0 },
  { gradient: 'from-gray-400 to-slate-500', shadow: 'shadow-gray-500/50', shape: 'rounded', rotation: 0, scale: 1, x: 0, y: 0 },
];

export function PlatformIcons() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [icons, setIcons] = useState<Icon[]>(initialIcons);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      setIcons((prev) =>
        prev.map((icon, i) => {
          const el = iconRefs.current[i];
          if (!el) return icon;
          const iconRect = el.getBoundingClientRect();
          const iconCenterX = iconRect.left - rect.left + iconRect.width / 2;
          const iconCenterY = iconRect.top - rect.top + iconRect.height / 2;
          const dx = mouseX - iconCenterX;
          const dy = mouseY - iconCenterY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;
          const strength = Math.max(0, 1 - distance / maxDistance);
          const angle = Math.atan2(dy, dx);
          const repelX = -Math.cos(angle) * strength * 25;
          const repelY = -Math.sin(angle) * strength * 25;
          const rotation = strength * 15 * (i % 2 === 0 ? 1 : -1);
          const scale = 1 + strength * 0.3;
          return { ...icon, x: repelX, y: repelY, rotation, scale };
        })
      );
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setIcons(initialIcons.map((icon) => ({ ...icon, x: 0, y: 0, rotation: 0, scale: 1 })));
  }, []);

  const handleIconClick = useCallback((index: number) => {
    setIcons((prev) =>
      prev.map((icon, i) => {
        if (i === index) return { ...icon, scale: 1.5 };
        const distance = Math.abs(i - index);
        if (distance <= 2) {
          const pushDirection = i < index ? -1 : 1;
          return {
            ...icon,
            x: pushDirection * (30 / distance),
            rotation: pushDirection * 20,
          };
        }
        return icon;
      })
    );
    setTimeout(() => {
      setIcons(initialIcons.map((icon) => ({ ...icon, x: 0, y: 0, rotation: 0, scale: 1 })));
    }, 300);
  }, []);

  return (
    <div ref={containerRef} className="mb-8 flex justify-center" role="presentation">
      <div
        className="glass-card rounded-2xl px-8 py-4 shadow-2xl cursor-pointer select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center space-x-4">
          {icons.map((icon, i) => (
            <div
              key={i}
              ref={(el) => {
                iconRefs.current[i] = el;
              }}
              className={`w-8 h-8 bg-gradient-to-br ${icon.gradient} ${icon.shape} shadow-lg ${icon.shadow} transition-all duration-150 ease-out hover:brightness-125`}
              style={{
                transform: `translate(${icon.x}px, ${icon.y}px) rotate(${icon.rotation}deg) scale(${icon.scale})`,
                willChange: 'transform',
              }}
              role="button"
              tabIndex={0}
              aria-label={`Platform icon ${i + 1}`}
              onClick={() => handleIconClick(i)}
              onKeyDown={(e) => e.key === 'Enter' && handleIconClick(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
