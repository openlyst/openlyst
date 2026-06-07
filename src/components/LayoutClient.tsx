'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const isApiPage = pathname?.startsWith('/docs/api');
  const isFunMode = !isApiPage;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={isFunMode ? 'fun-mode' : 'min-h-screen bg-gray-950'}>
      {children}
    </div>
  );
}
