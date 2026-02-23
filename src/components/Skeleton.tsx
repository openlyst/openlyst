'use client';

type Variant = 'card' | 'text' | 'circle' | 'rect';

export interface SkeletonProps {
  variant?: Variant;
  width?: string;
  height?: string;
  count?: number;
}

export function Skeleton({
  variant = 'rect',
  width = '100%',
  height = '1rem',
  count = 1,
}: SkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);
  return (
    <>
      {items.map((i) => (
        <div
          key={i}
          className={`skeleton animate-pulse bg-gray-700 rounded-lg ${
            variant === 'circle' ? 'rounded-full' : ''
          } ${variant === 'card' ? 'h-64' : ''}`}
          style={{
            width,
            height: variant === 'card' ? undefined : height,
          }}
        >
          {variant === 'card' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-600 rounded-xl animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-600 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-600 rounded w-1/2 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-600 rounded animate-pulse" />
                <div className="h-4 bg-gray-600 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-600 rounded w-4/6 animate-pulse" />
              </div>
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 bg-gray-600 rounded-full animate-pulse" />
                <div className="h-6 w-16 bg-gray-600 rounded-full animate-pulse" />
                <div className="h-6 w-16 bg-gray-600 rounded-full animate-pulse" />
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
