'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Section, AppCard, Skeleton } from '@/components';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { getActiveApps, getDeprecatedApps } from '@/lib/services/dataService';
import type { App } from '@/lib/types/repo';

export function AppsPageContent({ initialApps }: { initialApps: App[] }) {
  const { t, language } = useLanguage();
  const [apps, setApps] = useState<App[]>(initialApps);
  const [deprecatedApps, setDeprecatedApps] = useState<App[]>([]);
  const [prevLang, setPrevLang] = useState(language);

  useEffect(() => {
    if (prevLang === language) return;
    setPrevLang(language);
    Promise.all([
      getActiveApps(language),
      getDeprecatedApps(language),
    ])
      .then(([active, deprecated]) => {
        setApps(active);
        setDeprecatedApps(deprecated);
      })
      .catch(console.error);
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
        {deprecatedApps.length > 0 && (
          <div className="mt-12 text-center">
            <div className="glass-card inline-block px-4 py-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
              <p className="text-yellow-300 text-sm font-medium mb-2">
                ⚠️ {deprecatedApps.length} {deprecatedApps.length === 1 ? 'app is' : 'apps are'} deprecated
              </p>
              <p className="text-gray-400 text-xs">
                These apps are no longer maintained but may still work
              </p>
            </div>
          </div>
        )}
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
