'use client';

import type { ReactNode } from 'react';

export interface Widget3DProps {
  width?: number;
  height?: number;
  color?: string;
  glowColor?: string;
  children?: ReactNode;
}

export function Widget3D({
  width = 300,
  height = 200,
  children,
}: Widget3DProps) {
  return (
    <div
      className="relative block rounded-xl overflow-hidden glass-card"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div className="absolute inset-0 z-1 pointer-events-none" />
      <div className="relative z-2 w-full h-full flex flex-col items-center justify-center p-4 text-white">
        {children}
      </div>
    </div>
  );
}
