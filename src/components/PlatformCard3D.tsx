'use client';

import Link from 'next/link';

const platformIcons: Record<string, string> = {
  iOS: '📱',
  macOS: '💻',
  Windows: '🪟',
  Linux: '🐧',
  Android: '🤖',
  Web: '🌐',
};

export interface PlatformCard3DProps {
  platform: string;
  subtitle?: string;
  description?: string;
  downloadUrl?: string;
  downloadText?: string;
  icon?: string;
  color?: string;
}

export function PlatformCard3D({
  platform,
  subtitle = '',
  description = '',
  downloadUrl = '',
  downloadText = 'Download',
  icon = '',
}: PlatformCard3DProps) {
  const iconDisplay = platformIcons[platform] || icon || '📦';

  return (
    <div className="relative w-[340px] h-[200px] rounded-xl overflow-hidden glass-card">
      <div className="relative z-2 h-full flex flex-col items-start justify-start p-6 text-white">
        <div className="text-3xl mb-2">{iconDisplay}</div>
        <div>
          <h3 className="text-xl font-semibold m-0">{platform}</h3>
          {subtitle && <p className="text-sm text-gray-400 mt-1 mb-0">{subtitle}</p>}
        </div>
        {description && <p className="text-sm text-gray-300 mt-3 mb-0 flex-1">{description}</p>}
        {downloadUrl && (
          <Link
            href={downloadUrl}
            className="inline-flex items-center gap-2 py-2 px-5 bg-transparent text-white font-medium text-sm no-underline mt-auto hover:-translate-y-px transition-all"
          >
            {downloadText}
          </Link>
        )}
      </div>
    </div>
  );
}
