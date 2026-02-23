'use client';

import { useEffect, useState } from 'react';

export interface LinkPreviewProps {
  url: string;
}

interface PreviewData {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
}

export function LinkPreview({ url }: LinkPreviewProps) {
  const [data, setData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
        const json = await res.json();
        if (!cancelled && json.success) {
          setData({
            title: json.title,
            description: json.description,
            image: json.image,
            siteName: json.siteName,
          });
        } else if (!cancelled) {
          setError(true);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-600/50 bg-gray-800/40 p-4 flex items-center gap-3 animate-pulse">
        <div className="w-16 h-16 rounded bg-gray-600/50 shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-gray-600/50 rounded w-3/4" />
          <div className="h-3 bg-gray-600/50 rounded w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-gray-600/50 bg-gray-800/40 p-4 flex items-center gap-3 hover:border-cyan-500/50 transition-colors group"
      >
        <div className="w-12 h-12 rounded bg-gray-600/50 shrink-0 flex items-center justify-center text-gray-400 group-hover:text-cyan-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </div>
        <span className="text-blue-400 group-hover:underline truncate text-sm">{url}</span>
      </a>
    );
  }

  if (!data) return null;

  let hostname = '';
  try {
    hostname = new URL(url).hostname;
  } catch {
    hostname = url;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-lg border border-gray-600/50 bg-gray-800/40 overflow-hidden hover:border-cyan-500/50 transition-colors flex flex-col sm:flex-row group"
    >
      {data.image && (
        <div className="sm:w-32 sm:min-w-[8rem] h-24 sm:h-auto sm:min-h-[6rem] bg-gray-700 shrink-0 overflow-hidden">
          <img src={data.image} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}
      <div className="p-4 flex-1 min-w-0">
        {data.siteName && (
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{data.siteName}</p>
        )}
        {data.title && (
          <p className="text-white font-medium group-hover:text-cyan-200 line-clamp-2">
            {data.title}
          </p>
        )}
        {data.description && (
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">{data.description}</p>
        )}
        <p className="text-blue-400 text-sm mt-2 truncate group-hover:underline">{hostname}</p>
      </div>
    </a>
  );
}
