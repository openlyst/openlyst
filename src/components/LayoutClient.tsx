'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Background3D } from '@/components/Background3D';

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showBackground, setShowBackground] = useState(false);

  const isApiPage = pathname?.startsWith('/docs/api');
  const isFunMode = !isApiPage;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isFunMode) {
      setShowBackground(true);
    } else {
      setShowBackground(false);
    }
  }, [mounted, isFunMode]);

  return (
    <div className={isFunMode ? 'fun-mode' : ''}>
      {isFunMode && showBackground && <Background3D />}
      {children}
    </div>
  );
}
