'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { marked } from 'marked';
import { Section, Button } from '@/components';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { getApp } from '@/lib/services/dataService';
import type { App, AppVersion } from '@/lib/types/repo';

function getScreenshotsList(app: App): string[] {
  const s = app.screenshots;
  if (Array.isArray(s)) return s.filter((x): x is string => typeof x === 'string');
  const out: string[] = [];
  if (s && typeof s === 'object') {
    for (const key of Object.keys(s)) {
      const arr = (s as Record<string, (string | { imageURL?: string })[]>)[key];
      if (Array.isArray(arr)) {
        for (const item of arr) {
          if (typeof item === 'string') out.push(item);
          else if (item && typeof item === 'object' && item.imageURL) out.push(item.imageURL);
        }
      }
    }
  }
  return out;
}

function getFirstDownloadUrl(d: unknown): string | null {
  if (typeof d === 'string' && d) return d;
  if (d && typeof d === 'object') {
    for (const v of Object.values(d)) {
      const u = getFirstDownloadUrl(v);
      if (u) return u;
    }
  }
  return null;
}

function getVersionDownloads(version: AppVersion, platforms: string[]): { platform: string; url: string }[] {
  const out: { platform: string; url: string }[] = [];
  const dl = version.downloads || version.downloadURLs;
  if (!dl || typeof dl !== 'object') return out;
  for (const platform of platforms) {
    const p = (dl as Record<string, unknown>)[platform];
    const url = getFirstDownloadUrl(p);
    if (url) out.push({ platform, url });
  }
  return out;
}

export function AppDetailContent({
  app: initialApp,
  tempDownloadsOff,
}: {
  app: App;
  tempDownloadsOff: boolean;
}) {
  const { t, language } = useLanguage();
  const [app, setApp] = useState<App>(initialApp);
  const [selectedVersion, setSelectedVersion] = useState<AppVersion | undefined>(initialApp.versions[0]);
  const slug = initialApp.slug;

  useEffect(() => {
    getApp(slug, language).then((a) => {
      if (a) {
        setApp(a);
        setSelectedVersion(a.versions[0]);
      }
    });
  }, [language, slug]);

  const version = selectedVersion || app.versions[0];
  const screenshots = getScreenshotsList(app);
  const downloadLinks = version ? getVersionDownloads(version, app.platforms) : [];

  const descriptionHtml = { __html: marked(app.localizedDescription || '') };

  return (
    <>
      <section className="relative text-white overflow-hidden min-h-[40vh] flex items-center">
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            href="/apps"
            className="inline-flex items-center text-gray-400 hover:text-purple-400 text-sm font-medium mb-8"
          >
            ← {t.appDetail.backToApps}
          </Link>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <img
              src={app.iconURL}
              alt=""
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-xl flex-shrink-0"
            />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">{app.name}</h1>
              <p className="text-lg text-gray-300 mt-1">{app.subtitle}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {app.platforms.map((p) => (
                  <span
                    key={p}
                    className="px-3 py-1 rounded-lg text-sm font-medium bg-white/10 text-gray-300"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section title={t.appDetail.about} background="default">
        <div
          className="modal-prose prose-invert max-w-none"
          dangerouslySetInnerHTML={descriptionHtml}
        />
      </Section>

      {app.versions.length > 0 && (
        <Section title={t.appDetail.versions} background="gray">
          <div className="space-y-4">
            <p className="text-gray-400">{t.appDetail.versionHistory}</p>
            <select
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
              value={version?.version}
              onChange={(e) => {
                const v = app.versions.find((x) => x.version === e.target.value);
                setSelectedVersion(v);
              }}
            >
              {app.versions.map((v) => (
                <option key={v.version} value={v.version}>
                  {v.version} {v.date ? `(${v.date})` : ''}
                </option>
              ))}
            </select>
            {version && (
              <div
                className="modal-prose prose-invert max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: marked(version.localizedDescription || '') }}
              />
            )}
          </div>
        </Section>
      )}

      {version && (
        <Section title={t.appDetail.downloads} background="default">
          {tempDownloadsOff ? (
            <div className="rounded-xl bg-amber-900/20 border border-amber-700/50 p-6">
              <h3 className="text-lg font-semibold text-amber-200">{t.appDetail.downloadsPausedTitle}</h3>
              <p className="text-gray-400 mt-2">{t.appDetail.downloadsPausedReason}</p>
            </div>
          ) : downloadLinks.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {downloadLinks.map(({ platform, url }) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors"
                >
                  {t.appDetail.downloadPlatform.replace('{platform}', platform)}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">{t.appDetail.noDownloads}</p>
          )}
        </Section>
      )}

      {screenshots.length > 0 && (
        <Section title={t.appDetail.viewScreenshots} background="gray">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {screenshots.map((src, i) => (
              <a
                key={i}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl overflow-hidden border border-gray-600 hover:border-purple-500 transition-colors"
              >
                <img src={src} alt="" className="w-full aspect-video object-cover" />
              </a>
            ))}
          </div>
        </Section>
      )}

      <Section title="" background="default">
        <div className="text-center">
          <Button text={t.appDetail.backToApps} href="/apps" variant="secondary" />
        </div>
      </Section>
    </>
  );
}
