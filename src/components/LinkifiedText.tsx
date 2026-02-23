'use client';

import { parseTextWithUrls } from '@/lib/utils/linkify';

export interface LinkifiedTextProps {
  text: string;
  className?: string;
}

export function LinkifiedText({ text = '', className = '' }: LinkifiedTextProps) {
  const segments = parseTextWithUrls(text);
  return (
    <span className={className}>
      {segments.map((segment, i) =>
        segment.type === 'url' ? (
          <a
            key={i}
            href={segment.value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline break-all"
          >
            {segment.value}
          </a>
        ) : (
          <span key={i}>{segment.value}</span>
        )
      )}
    </span>
  );
}
