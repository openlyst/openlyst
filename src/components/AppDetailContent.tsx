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

/** Group entries by platform (first segment of label). Option label = rest after platform. */
function groupDownloadsByPlatform(
  entries: { label: string; url: string }[]
): { platform: string; optionLabel: string; url: string }[][] {
  const byPlatform = new Map<string, { optionLabel: string; url: string }[]>();
  for (const { label, url } of entries) {
    const i = label.indexOf(' · ');
    const platform = i >= 0 ? label.slice(0, i) : label;
    const optionLabel = i >= 0 ? label.slice(i + 3) : label;
    let list = byPlatform.get(platform);
    if (!list) {
      list = [];
      byPlatform.set(platform, list);
    }
    list.push({ optionLabel, url });
  }
  return Array.from(byPlatform.entries()).map(([platform, list]) =>
    list.map(({ optionLabel, url }) => ({ platform, optionLabel, url }))
  );
}

const platformIcons: Record<string, string> = {
  iOS: '📱',
  macOS: '💻',
  Windows: '🪟',
  Linux: '🐧',
  Android: '🤖',
  Web: '🌐',
};

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
  const byPlatform = groupDownloadsByPlatform(downloadEntries);

  // Selected download URL per platform (for dropdowns). Default to first option when version/entries change.
  const [selectedUrlByPlatform, setSelectedUrlByPlatform] = useState<Record<string, string>>({});
  const [changelogOpen, setChangelogOpen] = useState(false);
  useEffect(() => {
    const next: Record<string, string> = {};
    for (const group of byPlatform) {
      if (group.length > 0) next[group[0].platform] = group[0].url;
    }
    setSelectedUrlByPlatform(next);
  }, [version?.version]);

  useEffect(() => {
    if (changelogOpen) setChangelogOpen(false);
  }, [version?.version]);

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
          <div className="rounded-2xl border border-white/10 bg-gray-800/40 overflow-hidden flex flex-col sm:flex-row min-h-[340px] shadow-xl fun-mode:border-purple-500/20 fun-mode:glass-card">
            {/* Version sidebar */}
            <nav className="sm:w-56 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-white/10 bg-gray-900/50 p-3 flex sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible sm:overflow-y-auto">
              {app.versions.map((v) => (
                <button
                  key={v.version}
                  type="button"
                  onClick={() => setSelectedVersion(v)}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    version?.version === v.version
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="block">{v.version}</span>
                  {v.date ? (
                    <span className="block text-xs font-normal opacity-70 mt-1">{v.date}</span>
                  ) : null}
                </button>
              ))}
            </nav>
            {/* Main content */}
            <div className="flex-1 overflow-auto flex flex-col min-h-0">
              {version && (
                <div
                  key={version.version}
                  className="app-detail-version-content p-5 sm:p-6 flex flex-col gap-5"
                >
                  {/* Action bar: subtle links */}
                  <div className="flex flex-wrap items-center gap-3">
                    {version.sourceCode && (
                      <a
                        href={version.sourceCode}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-purple-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        {t.appDetail.viewSource}
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setChangelogOpen(true)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      {t.appDetail.viewChangelog}
                    </button>
                  </div>
                  {/* Download cards */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
                      {t.appDetail.downloads}
                    </h3>
                    {tempDownloadsOff ? (
                      <div className="rounded-xl bg-amber-900/20 border border-amber-600/40 p-4">
                        <h4 className="font-semibold text-amber-200">{t.appDetail.downloadsPausedTitle}</h4>
                        <p className="text-gray-400 text-sm mt-1">{t.appDetail.downloadsPausedReason}</p>
                      </div>
                    ) : byPlatform.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {byPlatform.map((group) => {
                          const platform = group[0].platform;
                          const selectedUrl = selectedUrlByPlatform[platform] ?? group[0].url;
                          const singleOption = group.length === 1;
                          const icon = platformIcons[platform] ?? '📦';
                          return (
                            <div
                              key={platform}
                              className="rounded-xl border border-white/10 bg-gray-800/60 p-4 flex flex-col gap-3 hover:border-purple-500/30 transition-colors fun-mode:glass-card fun-mode:hover:border-purple-500/40"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl" aria-hidden>{icon}</span>
                                <span className="text-base font-semibold text-white">{platform}</span>
                              </div>
                              <div className="flex flex-col gap-2 mt-auto">
                                {!singleOption && (
                                  <select
                                    className="w-full rounded-lg border border-white/10 bg-gray-700/80 text-white text-sm px-3 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    value={selectedUrl}
                                    onChange={(e) =>
                                      setSelectedUrlByPlatform((prev) => ({ ...prev, [platform]: e.target.value }))
                                    }
                                  >
                                    {group.map(({ optionLabel, url }) => (
                                      <option key={url} value={url}>
                                        {optionLabel}
                                      </option>
                                    ))}
                                  </select>
                                )}
                                <a
                                  href={selectedUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`inline-flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shadow-lg shadow-purple-600/20 ${singleOption ? 'w-full' : ''}`}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                  </svg>
                                  {t.appDetail.downloadNow}
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">{t.appDetail.noDownloads}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Changelog modal */}
          {changelogOpen && version && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setChangelogOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="changelog-title"
            >
              <div
                className="bg-gray-800 border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gray-800/80">
                  <h2 id="changelog-title" className="text-lg font-semibold text-white">
                    {t.common.changelog} — {version.version}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setChangelogOpen(false)}
                    className="text-gray-400 hover:text-white p-2 rounded-lg transition-colors hover:bg-white/10"
                    aria-label={t.common.close}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="overflow-y-auto p-5 flex-1">
                  <div
                    className="modal-prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: marked(version.localizedDescription || '') }}
                  />
                </div>
              </div>
            </div>
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
