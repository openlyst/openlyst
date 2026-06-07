'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { marked } from 'marked';
import { Section } from '@/components';
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

function getPlatformIcon(platform: string) {
  const key = platform.trim().toLowerCase();
  if (key === 'ios') {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="7" y="3.5" width="10" height="17" rx="2.2" />
        <circle cx="12" cy="17.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (key === 'macos') {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3.5" y="5" width="17" height="11" rx="1.5" />
        <path d="M9 19h6M12 16v3" />
      </svg>
    );
  }
  if (key === 'windows') {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 4.5l8-1.2V11H3V4.5zm10-1.5L21 1.8V11h-8V3zM3 13h8v7.7L3 19.5V13zm10 0h8v9.2l-8-1.1V13z" />
      </svg>
    );
  }
  if (key === 'linux') {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
        <path d="M8 10l2 2-2 2M12.5 14H16" />
      </svg>
    );
  }
  if (key === 'android') {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="8" width="12" height="10" rx="3" />
        <path d="M9 8L7.5 5.5M15 8l1.5-2.5M9.5 12h.01M14.5 12h.01" />
      </svg>
    );
  }
  if (key === 'web') {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12h6" />
    </svg>
  );
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
  const byPlatform = groupDownloadsByPlatform(downloadEntries);

  // Selected download URL per platform (for dropdowns). Default to first option when version/entries change.
  const [selectedUrlByPlatform, setSelectedUrlByPlatform] = useState<Record<string, string>>({});
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [activeScreenshotIndex, setActiveScreenshotIndex] = useState<number | null>(null);
  const [mobileVersionsOpen, setMobileVersionsOpen] = useState(false);
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

  useEffect(() => {
    if (activeScreenshotIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveScreenshotIndex(null);
      if (e.key === 'ArrowLeft') {
        setActiveScreenshotIndex((prev) => {
          if (prev === null) return prev;
          return (prev - 1 + screenshots.length) % screenshots.length;
        });
      }
      if (e.key === 'ArrowRight') {
        setActiveScreenshotIndex((prev) => {
          if (prev === null) return prev;
          return (prev + 1) % screenshots.length;
        });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeScreenshotIndex, screenshots.length]);

  const showPrevScreenshot = () => {
    setActiveScreenshotIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + screenshots.length) % screenshots.length;
    });
  };

  const showNextScreenshot = () => {
    setActiveScreenshotIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % screenshots.length;
    });
  };

  const descriptionHtml = { __html: marked(app.localizedDescription || '') };

  return (
    <>
      <section className="relative text-white py-10 sm:py-12">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-800 bg-[#0a0a0a] p-5 sm:p-7">
            <Link
              href="/apps"
              className="inline-flex items-center text-gray-400 hover:text-gray-300 text-sm font-medium mb-8"
            >
              ← {t.appDetail.backToApps}
            </Link>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <img
                src={app.iconURL}
                alt=""
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover flex-shrink-0 bg-gray-900 p-1"
              />
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">{app.name}</h1>
                <p className="text-lg text-gray-300 mt-1">{app.subtitle}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {app.platforms.map((p) => (
                    <span
                      key={p}
                      className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 border border-gray-700"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-800 pt-6">
              <h2 className="text-2xl font-bold tracking-tight text-white">{t.appDetail.about}</h2>
              <div
                className="modal-prose prose-invert max-w-none mt-4"
                dangerouslySetInnerHTML={descriptionHtml}
              />
            </div>
          </div>
        </div>
      </section>

      {app.versions.length > 0 && (
        <Section title={t.appDetail.downloads} background="gray" centered>
          <div className="font-display mx-auto w-full max-w-7xl rounded-2xl border border-gray-800 bg-[#0a0a0a] overflow-hidden flex flex-col lg:flex-row min-h-[540px]">
            {/* Version sidebar */}
            <aside className="lg:w-60 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-800 bg-gray-900 p-3 lg:max-h-[540px] lg:flex lg:flex-col">
              <div className="lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileVersionsOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-left"
                  aria-expanded={mobileVersionsOpen}
                  aria-controls="mobile-versions-list"
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      {t.appDetail.versions}
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {t.common.version} {version?.version}
                    </p>
                  </div>
                  <span className={`text-gray-400 transition-transform ${mobileVersionsOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {mobileVersionsOpen && (
                  <div id="mobile-versions-list" className="mt-2 max-h-64 overflow-y-auto space-y-1">
                    {app.versions.map((v, index) => (
                      <button
                        key={v.version}
                        type="button"
                        onClick={() => {
                          setSelectedVersion(v);
                          setMobileVersionsOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                          version?.version === v.version
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="block">{v.version}</span>
                          {index === 0 ? (
                            <span className="rounded-full bg-gray-600 text-gray-200 text-[10px] font-semibold px-2 py-0.5">
                              {t.appDetail.latest}
                            </span>
                          ) : null}
                        </div>
                        {v.date ? (
                          <span className="block text-xs font-normal text-gray-500 mt-1">{v.date}</span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <nav className="hidden lg:flex lg:flex-col gap-1.5 overflow-y-auto flex-1 min-h-0">
                <p className="text-white text-xs font-semibold px-2 pb-1.5">{t.appDetail.versions}</p>
                {app.versions.map((v, index) => (
                  <button
                    key={v.version}
                    type="button"
                    onClick={() => setSelectedVersion(v)}
                    className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                      version?.version === v.version
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="block">{v.version}</span>
                      {index === 0 ? (
                        <span className="rounded-full bg-gray-600 text-gray-200 text-[10px] font-semibold px-2 py-0.5">
                          {t.appDetail.latest}
                        </span>
                      ) : null}
                    </div>
                    {v.date ? (
                      <span className="block text-xs font-normal text-gray-500 mt-1">{v.date}</span>
                    ) : null}
                  </button>
                ))}
              </nav>
            </aside>
            {/* Main content */}
            <div className="flex-1 overflow-auto flex flex-col min-h-0">
              {version && (
                <div
                  className="p-5 sm:p-6 flex flex-col gap-5 bg-gray-900 min-h-full"
                >
                  <div className="space-y-1">
                    <h3 className="text-white text-2xl font-semibold">{app.name}</h3>
                    <p className="text-gray-400 text-xs">{t.appDetail.chooseDownload}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h4 className="text-white text-4xl md:text-5xl font-bold leading-tight">{t.common.version} {version.version}</h4>
                    <div className="flex items-center gap-2">
                      {version.sourceCode && (
                        <a
                          href={version.sourceCode}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 text-sm font-semibold transition-colors"
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
                        className="inline-flex items-center gap-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 text-sm font-semibold transition-colors border border-gray-700"
                      >
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-600 text-xs">•</span>
                        {t.appDetail.viewDetails}
                      </button>
                    </div>
                  </div>

                  {/* Download cards */}
                  <div>
                    {tempDownloadsOff ? (
                      <div className="rounded-xl bg-gray-800 border border-gray-700 p-4">
                        <h4 className="font-semibold text-gray-300">{t.appDetail.downloadsPausedTitle}</h4>
                        <p className="text-gray-500 text-sm mt-1">{t.appDetail.downloadsPausedReason}</p>
                      </div>
                    ) : byPlatform.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                        {byPlatform.map((group) => {
                          const platform = group[0].platform;
                          const selectedUrl = selectedUrlByPlatform[platform] ?? group[0].url;
                          const singleOption = group.length === 1;
                          const buttonText = t.appDetail.downloadPlatform.includes('{platform}')
                            ? t.appDetail.downloadPlatform.replace('{platform}', platform)
                            : `${t.common.download} ${platform}`;

                          return (
                            <div
                              key={platform}
                              className="group relative rounded-2xl border border-gray-800 bg-gray-900 p-6 flex flex-col gap-5 text-white"
                            >
                              <div className="flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-800 text-gray-400">
                                  {getPlatformIcon(platform)}
                                </span>
                                <span className="text-lg font-semibold text-white tracking-tight">{platform}</span>
                              </div>
                              <div className="flex flex-col gap-3">
                                {!singleOption && (
                                  <div className="relative">
                                    <select
                                      className="w-full appearance-none rounded-xl border border-gray-700 bg-gray-800 text-white text-sm px-4 py-2.5 pr-10 focus:ring-2 focus:ring-gray-500/50 focus:border-transparent transition-colors hover:bg-gray-700 cursor-pointer"
                                      value={selectedUrl}
                                      onChange={(e) =>
                                        setSelectedUrlByPlatform((prev) => ({ ...prev, [platform]: e.target.value }))
                                      }
                                    >
                                      {group.map(({ optionLabel, url }) => (
                                        <option key={url} value={url} className="bg-gray-900 text-white">
                                          {optionLabel}
                                        </option>
                                      ))}
                                    </select>
                                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </div>
                                )}
                                <a
                                  href={selectedUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 bg-gray-800 hover:bg-gray-700 border border-gray-700"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                  </svg>
                                  {buttonText}
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">{t.appDetail.noDownloads}</p>
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
                className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                  <h2 id="changelog-title" className="text-lg font-semibold text-white">
                    {t.common.changelog} — {version.version}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setChangelogOpen(false)}
                    className="text-gray-500 hover:text-white p-2 rounded-lg transition-colors hover:bg-gray-800"
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
        <Section title={t.appDetail.viewScreenshots} background="gray" centered>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {screenshots.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveScreenshotIndex(i)}
                className="rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors"
                aria-label={`${t.appDetail.viewScreenshots} ${i + 1}`}
              >
                <img src={src} alt="" className="w-full aspect-video object-cover" />
              </button>
            ))}
          </div>
        </Section>
      )}

      {activeScreenshotIndex !== null && screenshots[activeScreenshotIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setActiveScreenshotIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={t.appDetail.viewScreenshots}
        >
          <div
            className="relative w-full max-w-6xl max-h-[90vh] rounded-2xl border border-gray-800 bg-[#0a0a0a] p-3 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={screenshots[activeScreenshotIndex]}
              alt=""
              className="w-full max-h-[78vh] object-contain rounded-xl"
            />

            <button
              type="button"
              onClick={() => setActiveScreenshotIndex(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-800 border border-gray-700 text-white hover:bg-gray-700"
              aria-label={t.common.close}
            >
              ×
            </button>

            {screenshots.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPrevScreenshot}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-800 border border-gray-700 text-white hover:bg-gray-700"
                  aria-label={t.common.back}
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={showNextScreenshot}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-800 border border-gray-700 text-white hover:bg-gray-700"
                  aria-label={t.common.next}
                >
                  ›
                </button>
              </>
            )}

            <p className="mt-3 text-center text-xs text-gray-400">
              {activeScreenshotIndex + 1} / {screenshots.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
