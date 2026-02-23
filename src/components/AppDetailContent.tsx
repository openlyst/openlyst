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

/** Collect all download links for a version with labels from the key path (e.g. "Android · APK"). */
function getVersionDownloadEntries(version: AppVersion): { label: string; url: string }[] {
  const out: { label: string; url: string }[] = [];
  const dl = version.downloads || version.downloadURLs;
  if (!dl || typeof dl !== 'object') return out;

  function walk(obj: unknown, parts: string[]) {
    if (typeof obj === 'string' && obj) {
      const label = parts.join(' · ');
      if (label) out.push({ label, url: obj });
      return;
    }
    if (obj && typeof obj === 'object') {
      const rec = obj as Record<string, unknown>;
      for (const [key, value] of Object.entries(rec)) {
        const next = [...parts];
        if (key !== 'x86_64' && key !== 'arm64' && key !== 'aarch64' && key !== 'universal') {
          next.push(key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
        } else {
          next.push(key.toUpperCase());
        }
        walk(value, next);
      }
    }
  }

  for (const [platform, value] of Object.entries(dl)) {
    walk(value, [platform]);
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
  const downloadEntries = version ? getVersionDownloadEntries(version) : [];

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
        <Section title={t.appDetail.downloads} background="gray">
          <div className="rounded-xl border border-gray-600 bg-gray-800/50 overflow-hidden flex flex-col sm:flex-row min-h-[320px]">
            {/* Version sidebar */}
            <nav className="sm:w-52 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-gray-600 bg-gray-800/80 p-2 flex sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible sm:overflow-y-auto">
              {app.versions.map((v) => (
                <button
                  key={v.version}
                  type="button"
                  onClick={() => setSelectedVersion(v)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    version?.version === v.version
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {v.version}
                  {v.date ? (
                    <span className="block text-xs font-normal opacity-80 mt-0.5">{v.date}</span>
                  ) : null}
                </button>
              ))}
            </nav>
            {/* Main content: downloads, source code, changelog */}
            <div className="flex-1 p-4 sm:p-6 overflow-auto space-y-6">
              {version && (
                <>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      {t.appDetail.downloads}
                    </h3>
                    {tempDownloadsOff ? (
                      <div className="rounded-lg bg-amber-900/20 border border-amber-700/50 p-4">
                        <h4 className="font-semibold text-amber-200">{t.appDetail.downloadsPausedTitle}</h4>
                        <p className="text-gray-400 text-sm mt-1">{t.appDetail.downloadsPausedReason}</p>
                      </div>
                    ) : downloadEntries.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {downloadEntries.map(({ label, url }) => (
                          <a
                            key={url + label}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 bg-gray-700 hover:bg-purple-600 text-gray-200 hover:text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            {label}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">{t.appDetail.noDownloads}</p>
                    )}
                  </div>
                  {version.sourceCode && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        {t.appDetail.sourceCode}
                      </h3>
                      <a
                        href={version.sourceCode}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-gray-700 hover:bg-purple-600 text-gray-200 hover:text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        {t.appDetail.viewSource}
                      </a>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      {t.appDetail.whatsNew}
                    </h3>
                    <div
                      className="modal-prose prose-invert prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: marked(version.localizedDescription || '') }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
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
