'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Section, AppCard, Button, Skeleton } from '@/components';
import { LinkifiedText } from '@/components/LinkifiedText';
import { Button3D } from '@/components/Button3D';
import { PlatformIcons } from '@/components/PlatformIcons';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { getActiveApps, getRepoConfig, getAllNews, nameToSlug } from '@/lib/services/dataService';
import type { App, NewsItem, RepoConfig } from '@/lib/types/repo';

interface InitialData {
  apps: App[];
  featuredApps: App[];
  config: RepoConfig;
  news: NewsItem[];
}

export function HomePage({ initialData }: { initialData: InitialData }) {
  const { language, t } = useLanguage();
  const [apps, setApps] = useState<App[]>(initialData.apps);
  const [featuredApps, setFeaturedApps] = useState<App[]>(initialData.featuredApps);
  const [news, setNews] = useState<NewsItem[]>(initialData.news);
  const [config, setConfig] = useState<RepoConfig | undefined>(initialData.config);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [prevLang, setPrevLang] = useState(language);

  useEffect(() => {
    if (prevLang === language && apps.length > 0) return;
    if (isRefreshing) return;
    setPrevLang(language);
    setIsRefreshing(true);
    Promise.all([
      getActiveApps(language),
      getRepoConfig(language),
      getAllNews(language),
    ])
      .then(([fetchedApps, fetchedConfig, fetchedNews]) => {
        setApps(fetchedApps);
        setConfig(fetchedConfig);
        setNews(fetchedNews);
        setFeaturedApps(
          (fetchedConfig?.featuredApps || [])
            .map((featuredId: string) =>
              fetchedApps.find(
                (app: App) =>
                  app.bundleIdentifier === featuredId || nameToSlug(app.name) === featuredId
              )
            )
            .filter(Boolean) as App[]
        );
      })
      .catch(console.error)
      .finally(() => setIsRefreshing(false));
  }, [language, prevLang, apps.length, isRefreshing]);

  return (
    <>
      <section className="relative text-white overflow-hidden min-h-screen flex items-center">
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <PlatformIcons />
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 text-white">
              {t.home.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              {t.home.subtitle}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 flex-wrap">
              <Button3D text={t.home.exploreApps} href="/apps" variant="secondary" size="lg" />
              <Button3D
                text={t.home.joinMovement}
                href="https://gitlab.com/Openlyst/"
                variant="outline"
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      <Section
        title={t.home.powerToThePeople}
        subtitle={t.home.powerDescription}
        centered
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="glass-card rounded-xl p-6 text-center scroll-contain-cards">
            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t.home.privacyFirst}</h3>
            <p className="text-gray-400">{t.home.privacyDesc}</p>
          </div>
          <div className="glass-card rounded-xl p-6 text-center scroll-contain-cards">
            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t.home.communityDriven}</h3>
            <p className="text-gray-400">{t.home.communityDesc}</p>
          </div>
          <div className="glass-card rounded-xl p-6 text-center scroll-contain-cards">
            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t.home.openSource}</h3>
            <p className="text-gray-400">{t.home.openSourceDesc}</p>
          </div>
        </div>
      </Section>

      <Section
        title={t.home.latestNews}
        subtitle={t.home.latestNewsDesc}
        background="default"
        centered
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {news.length > 0 ? (
            news.slice(0, 4).map((item) => (
              <article key={item.identifier} className="glass-card rounded-xl p-6 scroll-contain-cards">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <h3 className="text-lg font-semibold text-white">
                    <LinkifiedText text={item.title} />
                  </h3>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{item.date}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  <LinkifiedText text={item.caption} />
                </p>
                {item.url && (
                  <div className="mt-4">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white text-sm font-medium"
                    >
                      {t.home.readMore}
                    </a>
                  </div>
                )}
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-400">{t.home.noNewsYet}</div>
          )}
        </div>
        <div className="mt-10 text-center">
          <Button text={t.home.viewAllNews} href="/news" variant="secondary" />
        </div>
      </Section>

      <Section
        title={t.home.ourApps}
        subtitle={t.home.ourAppsDesc}
        background="default"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {apps.map((app) => (
            <div key={app.slug} className="animate-fadeIn scroll-contain-cards">
              <AppCard
                title={app.name}
                description={app.localizedDescription}
                status={
                  app.versions[0]?.version.includes('beta') ? 'beta' : 'released'
                }
                platforms={app.platforms}
                href={`/apps/${app.slug}`}
                image={app.iconURL}
              />
            </div>
          ))}
          {apps.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-2xl font-semibold text-white mb-2">{t.home.comingSoon}</h3>
              <p className="text-gray-400 max-w-md mx-auto">{t.home.comingSoonDesc}</p>
            </div>
          )}
        </div>
        <div className="mt-12 text-center">
          <Button text={t.home.viewAllApps} href="/apps" variant="primary" />
        </div>
      </Section>

      <Section
        title={t.home.joinRevolution}
        subtitle={t.home.joinRevolutionDesc}
        background="default"
        centered
      >
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            text={t.home.startContributing}
            href="https://gitlab.com/Openlyst/"
            variant="secondary"
            size="lg"
          />
          <Button text={t.home.downloadApps} href="/apps" variant="outline" size="lg" />
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-200 text-lg font-medium">{t.home.quote}</p>
          <p className="text-gray-400 mt-2">{t.home.quoteAuthor}</p>
        </div>
      </Section>
    </>
  );
}
