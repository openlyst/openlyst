'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const MAX_DESCRIPTION_LENGTH = 150;
const statusColors = {
  released: { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981', border: 'rgba(16, 185, 129, 0.3)' },
  beta: { bg: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
  development: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
};

function parseColor(color: string): { r: number; g: number; b: number } {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }
  return { r: 139, g: 92, b: 246 };
}

function darkenColor(color: string, factor = 0.8): string {
  const { r, g, b } = parseColor(color);
  return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
}

export interface AppCardProps {
  title: string;
  description: string;
  status: 'released' | 'beta' | 'development';
  platforms: string[];
  image?: string;
  href: string;
  features?: string[];
  tintColor?: string;
}

export function AppCard({
  title,
  description,
  status,
  platforms,
  image = '',
  href,
  tintColor = '#8b5cf6',
}: AppCardProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const baseColor = tintColor || '#8b5cf6';
  const darkerColor = darkenColor(baseColor, 0.75);
  const { r, g, b } = parseColor(baseColor);
  const isLongDescription = description.length > MAX_DESCRIPTION_LENGTH;
  const truncatedDescription = isLongDescription
    ? description.slice(0, MAX_DESCRIPTION_LENGTH).trim() + '...'
    : description;
  const displayedText = expanded ? description : truncatedDescription;

  const statusText =
    status === 'released'
      ? t.appCard.released
      : status === 'beta'
        ? t.appCard.beta
        : t.appCard.inDevelopment;

  return (
    <div className="rounded-2xl overflow-hidden bg-gray-800/50 backdrop-blur-xl border border-white/10 shadow-xl hover:shadow-2xl hover:border-purple-500/30 transition-all duration-300 flex flex-col h-full">
      <div
        className="p-10 pb-8 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${baseColor} 0%, ${darkerColor} 100%)`,
        }}
      >
        <div className="flex items-center gap-4 relative z-10">
          {image && (image.startsWith('http') || image.startsWith('/')) ? (
            <img src={image} alt={`${title} icon`} className="w-[72px] h-[72px] rounded-[18px] object-cover shadow-lg" />
          ) : image ? (
            <div className="w-[72px] h-[72px] rounded-[18px] bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center text-3xl shadow-lg">
              {image}
            </div>
          ) : (
            <div className="w-[72px] h-[72px] rounded-[18px] bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center text-3xl shadow-lg">
              🎵
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <h3 className="text-white text-2xl font-bold">{title}</h3>
            <span
              className="inline-block w-fit px-3 py-1 rounded-xl text-xs font-semibold border"
              style={{
                background: statusColors[status].bg,
                color: statusColors[status].text,
                borderColor: statusColors[status].border,
              }}
            >
              {statusText}
            </span>
          </div>
        </div>
      </div>

      <div className="p-7 flex flex-col flex-grow">
        <div className="mb-6 flex-grow">
          <p className="text-slate-300 text-[15px] leading-relaxed">{displayedText}</p>
          {isLongDescription && (
            <button
              type="button"
              className="inline-flex items-center gap-1 mt-2 text-sm font-medium bg-transparent border-none cursor-pointer hover:opacity-80"
              style={{ color: baseColor }}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? t.appCard.showLess : t.appCard.readMore}
              <svg
                className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        <div className="mb-6">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
            {t.appCard.availablePlatforms}
          </div>
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <span
                key={platform}
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium border"
                style={{
                  background: `rgba(${r}, ${g}, ${b}, 0.1)`,
                  color: `rgba(${Math.min(r + 50, 255)}, ${Math.min(g + 50, 255)}, ${Math.min(b + 50, 255)}, 1)`,
                  borderColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
                }}
              >
                {platform}
              </span>
            ))}
          </div>
        </div>

        <Link
          href={href}
          className="w-full text-white py-3.5 px-7 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all hover:brightness-110 hover:-translate-y-0.5 mt-auto"
          style={{
            background: `linear-gradient(135deg, ${baseColor} 0%, ${darkerColor} 100%)`,
            boxShadow: `0 4px 16px rgba(${r}, ${g}, ${b}, 0.3)`,
          }}
        >
          {t.appCard.learnMore}
          <span className="text-lg">→</span>
        </Link>
      </div>
    </div>
  );
}
