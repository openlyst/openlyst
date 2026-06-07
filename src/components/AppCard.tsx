'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { PlatformIcon } from '@/components/PlatformIcon';

const MAX_DESCRIPTION_LENGTH = 150;
const statusColors = {
  released: { bg: 'rgba(75, 85, 99, 0.3)', text: '#9ca3af', border: 'rgba(75, 85, 99, 0.5)' },
  beta: { bg: 'rgba(107, 114, 128, 0.3)', text: '#9ca3af', border: 'rgba(107, 114, 128, 0.5)' },
  development: { bg: 'rgba(156, 163, 175, 0.3)', text: '#9ca3af', border: 'rgba(156, 163, 175, 0.5)' },
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
    <div className="rounded-xl overflow-hidden bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 transition-all duration-200 flex flex-col h-full p-5">
      {/* Icon and Name at top */}
      <div className="flex items-center gap-4 mb-4">
        {image && (image.startsWith('http') || image.startsWith('/')) ? (
          <img src={image} alt={`${title} icon`} className="w-14 h-14 rounded-lg object-cover bg-gray-900 p-1" />
        ) : image ? (
          <div className="w-14 h-14 rounded-lg bg-gray-900 flex items-center justify-center text-2xl">
            {image}
          </div>
        ) : (
          <div className="w-14 h-14 rounded-lg bg-gray-900 flex items-center justify-center border border-gray-800">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="flex flex-col">
          <h3 className="text-white text-xl font-semibold">{title}</h3>
          {status !== 'released' && (
            <span
              className="inline-block w-fit px-2.5 py-1 rounded text-xs font-medium border mt-1.5"
              style={{
                background: statusColors[status].bg,
                color: statusColors[status].text,
                borderColor: statusColors[status].border,
              }}
            >
              {statusText}
            </span>
          )}
        </div>
      </div>

      <div className="border-b border-gray-800 my-4" />

      {/* Platform icons */}
      <div className="flex items-center gap-2.5 mb-4">
        {platforms.map((platform) => (
          <PlatformIcon
            key={platform}
            platform={platform}
            className="text-gray-600 hover:text-gray-500 transition-colors"
          />
        ))}
      </div>

      {/* App description */}
      <div className="flex-grow mb-4">
        <p className="text-gray-400 text-sm leading-relaxed">{displayedText}</p>
        {isLongDescription && (
          <button
            type="button"
            className="inline-flex items-center gap-1 mt-2 text-sm font-medium bg-transparent border-none cursor-pointer hover:opacity-80 text-gray-500"
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

      {/* Download button */}
      <Link
        href={href}
        className="w-full text-white py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all hover:bg-gray-800 mt-auto bg-gray-900 border border-gray-800 hover:border-gray-700"
      >
        {t.common.download}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </Link>
    </div>
  );
}
