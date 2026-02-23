'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Section, AppCard, Button } from '@/components';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { getDeprecatedApps } from '@/lib/services/dataService';
import type { App } from '@/lib/types/repo';

export function DeprecatedPageContent({ initialApps }: { initialApps: App[] }) {
  const { t, language } = useLanguage();
  const [apps, setApps] = useState<App[]>(initialApps);
  const [prevLang, setPrevLang] = useState(language);

  useEffect(() => {
    if (prevLang === language) return;
    setPrevLang(language);
    getDeprecatedApps(language).then(setApps).catch(console.error);
  }, [language, prevLang]);

  return (
    <>
      <section className="relative text-white overflow-hidden min-h-[60vh] flex items-center">
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">📦</div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            {t.deprecated.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">{t.deprecated.subtitle}</p>
          <span className="glass-card px-4 py-2 text-yellow-300 text-lg font-medium rounded-full">
            ⚠️ {t.deprecated.noLongerMaintained}
          </span>
        </div>
      </section>

      <Section
        title={t.deprecated.discontinuedApps}
        subtitle={t.deprecated.discontinuedDesc}
        background="default"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apps.map((app) => (
            <div key={app.slug} className="animate-fadeIn">
              <AppCard
                title={app.name}
                description={app.localizedDescription}
                href={`/apps/${app.slug}`}
                status="released"
                platforms={app.platforms}
                image={app.iconURL}
              />
            </div>
          ))}
        </div>
        {apps.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-semibold text-white mb-2">{t.deprecated.noDeprecated}</h3>
            <p className="text-gray-400 max-w-md mx-auto">{t.deprecated.noDeprecatedDesc}</p>
          </div>
        )}
        <div className="mt-12 text-center">
          <Button text={t.deprecated.viewActiveApps} href="/apps" variant="primary" />
        </div>
      </Section>
    </>
  );
}
