'use client';

import { useState, useEffect } from 'react';
import { Section } from '@/components';
import { LinkifiedText } from '@/components/LinkifiedText';
import { LinkPreview } from '@/components/LinkPreview';
import { extractUrls } from '@/lib/utils/linkify';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { getAllNews } from '@/lib/services/dataService';
import type { NewsItem } from '@/lib/types/repo';

export function NewsPageContent({ initialNews }: { initialNews: NewsItem[] }) {
  const { t, language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [prevLang, setPrevLang] = useState(language);

  useEffect(() => {
    if (prevLang === language) return;
    setPrevLang(language);
    getAllNews(language).then(setNews).catch(console.error);
  }, [language, prevLang]);

  return (
    <>
      <section className="relative text-white overflow-hidden min-h-[45vh] flex items-center">
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 text-white">
            {t.news.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t.news.subtitle}</p>
        </div>
      </section>
    </>
  );
}
