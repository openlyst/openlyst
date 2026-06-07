'use client';

import type { ReactNode } from 'react';

type Background = 'default' | 'red' | 'dark' | 'gray' | 'glass';

const backgroundClasses: Record<Background, string> = {
  default: 'bg-transparent',
  red: 'glass-light text-white',
  dark: 'bg-transparent text-white',
  gray: 'bg-transparent',
  glass: 'glass',
};

export interface SectionProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  background?: Background;
  children: ReactNode;
}

export function Section({
  title,
  subtitle = '',
  centered = false,
  background = 'default',
  children,
}: SectionProps) {
  return (
    <section className={`py-16 ${backgroundClasses[background]}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${centered ? '' : 'text-left'}`}>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            {title}
          </h2>
          {subtitle && (
            <p className={`mt-4 text-lg text-gray-300 max-w-2xl ${centered ? 'mx-auto' : ''}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={centered ? 'text-center' : ''}>{children}</div>
      </div>
    </section>
  );
}
