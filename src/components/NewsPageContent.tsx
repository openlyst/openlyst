'use client';

import { useState, useEffect } from 'react';
import { Section } from '@/components';
import { AppCard } from '@/components/AppCard';
import { LinkifiedText } from '@/components/LinkifiedText';
import { LinkPreview } from '@/components/LinkPreview';
import { extractUrls } from '@/lib/utils/linkify';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { getAllNews, getApp } from '@/lib/services/dataService';
import type { NewsItem, App } from '@/lib/types/repo';

export function NewsPageContent({ initialNews }: { initialNews: NewsItem[] }) {
  const { t, language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [prevLang, setPrevLang] = useState(language);
  const [apps, setApps] = useState<Record<string, App>>({});

  useEffect(() => {
    if (prevLang === language) return;
    setPrevLang(language);
    getAllNews(language).then(setNews).catch(console.error);
  }, [language, prevLang]);

  useEffect(() => {
    const appIds = news.filter(item => item.appID).map(item => item.appID!);
    const uniqueAppIds = [...new Set(appIds)];
    
    uniqueAppIds.forEach(appId => {
      if (!apps[appId]) {
        getApp(appId, language).then(app => {
          if (app) {
            setApps(prev => ({ ...prev, [appId]: app }));
          }
        }).catch(console.error);
      }
    });
  }, [news, language, apps]);

  return (
    <>
      <Section title={t.news.latestUpdates} subtitle={t.news.latestUpdatesDesc} background="default" centered>
        {news.length === 0 ? (
          <div className="text-center py-12 text-gray-400">{t.news.noNews}</div>
        ) : (
          <div className="space-y-6">
            {news.map((item) => (
              <article 
                key={item.identifier} 
                className="relative rounded-2xl border border-gray-800 bg-[#0a0a0a] p-6 overflow-hidden"
                style={{ borderColor: item.tintColor ? `${item.tintColor}40` : undefined }}
              >
                <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: item.tintColor || '#8b5cf6' }} />
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 pl-3">
                  <h2 className="text-xl font-semibold text-white">
                    <LinkifiedText text={item.title} />
                  </h2>
                  <span className="text-sm text-gray-400 whitespace-nowrap">{item.date.replace(/-/g, '/')}</span>
                </div>
                <p className="text-gray-300 leading-relaxed pl-3">
                  <LinkifiedText text={item.caption} />
                </p>
                {item.appID && apps[item.appID] && (
                  <div className="mt-4 pl-3">
                    <AppCard
                      title={apps[item.appID].name}
                      description={apps[item.appID].subtitle}
                      status={apps[item.appID].beta ? 'beta' : apps[item.appID].deprecated ? 'development' : 'released'}
                      platforms={apps[item.appID].platforms}
                      image={apps[item.appID].iconURL}
                      href={`/apps/${apps[item.appID].slug}`}
                      tintColor={apps[item.appID].tintColor}
                      deprecated={apps[item.appID].deprecated}
                      version={apps[item.appID].versions[0]?.version}
                    />
                  </div>
                )}
                {item.url && !item.appID && (
                  <div className="mt-4 pl-3">
                    <LinkPreview url={item.url} />
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
