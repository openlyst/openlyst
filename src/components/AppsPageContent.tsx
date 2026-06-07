'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Section, AppCard, Skeleton } from '@/components';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { getActiveApps } from '@/lib/services/dataService';
import type { App } from '@/lib/types/repo';

export function AppsPageContent({ initialApps }: { initialApps: App[] }) {
  const { t, language } = useLanguage();
  const [apps, setApps] = useState<App[]>(initialApps);
  const [prevLang, setPrevLang] = useState(language);

  useEffect(() => {
    if (prevLang === language) return;
    setPrevLang(language);
    getActiveApps(language).then(setApps).catch(console.error);
  }, [language, prevLang]);

  return (
    <>
      <section className="relative text-white overflow-hidden min-h-[60vh] flex items-center">
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 text-white">
            {t.apps.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">{t.apps.subtitle}</p>
          <div className="flex items-center justify-center">
            <span className="glass-card px-4 py-2 text-gray-300 text-lg font-medium rounded-full">
              {t.apps.powerToThePeople}
            </span>
          </div>
        </div>
      </section>

      <Section title={t.apps.ourApps} subtitle={t.apps.ourAppsDesc} background="default" centered>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apps.map((app) => (
            <div key={app.slug} className="animate-fadeIn scroll-contain-cards">
              <AppCard
                title={app.name}
                description={app.localizedDescription}
                href={`/apps/${app.slug}`}
                status={app.versions[0]?.version.includes('beta') ? 'beta' : 'released'}
                platforms={app.platforms}
                image={app.iconURL}
                tintColor={app.tintColor}
              />
            </div>
          ))}
        </div>
        {apps.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold text-white mb-2">{t.apps.noAppsYet}</h3>
            <p className="text-gray-400 max-w-md mx-auto">{t.apps.noAppsDesc}</p>
          </div>
        )}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm mb-3">{t.apps.cantFind}</p>
          <Link
            href="/deprecated"
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors text-sm font-medium"
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t.apps.checkDeprecated}
          </Link>
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-6">{t.apps.wantToContributeDesc}</p>
          <Link
            href="https://gitlab.com/Openlyst/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            {t.apps.getInvolved}
          </Link>
        </div>
      </Section>
    </>
  );
}
