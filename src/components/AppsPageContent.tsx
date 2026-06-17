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
  const [prevLang, setPrevLang] = useState(language);

  useEffect(() => {
    if (prevLang === language) return;
    setPrevLang(language);
    Promise.all([
      getActiveApps(language),
      getDeprecatedApps(language),
    ])
      .then(([active, deprecated]) => {
        setApps([...active, ...deprecated]);
      })
      .catch(console.error);
  }, [language, prevLang]);

  return (
    <>
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
                deprecated={app.deprecated}
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
