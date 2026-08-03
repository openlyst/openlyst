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

const ARCH_KEYS = new Set(['x86_64', 'arm64', 'aarch64', 'universal', 'i386']);
const ARCH_ORDER = ['universal', 'arm64', 'x86_64', 'aarch64', 'i386'];
const ARCH_LABELS: Record<string, string> = {
  universal: 'Universal',
  arm64: 'ARM64',
  aarch64: 'AArch64',
  x86_64: 'x86_64',
  i386: 'i386',
};

const ARCH_PREFERENCE = ['x86_64', 'universal', 'arm64', 'aarch64', 'i386'];

function defaultArch(arches: string[]): string | null {
  if (arches.length === 0) return null;
  for (const a of ARCH_PREFERENCE) {
    if (arches.includes(a)) return a;
  }
  return arches[0];
}

function detectPlatformFromUA(ua: string): string | null {
  const lower = ua.toLowerCase();
  if (/iphone|ipad|ipod/.test(lower)) return 'iOS';
  if (/android/.test(lower)) return 'Android';
  if (/windows/.test(lower)) return 'Windows';
  if (/macintosh|mac os|macbook/.test(lower)) return 'macOS';
  if (/linux|cros|x11/.test(lower)) return 'Linux';
  return null;
}

function pickDefaultPlatform(available: { platform: string }[], ua: string): string | null {
  if (available.length === 0) return null;
  const detected = detectPlatformFromUA(ua);
  if (detected) {
    const match = available.find((g) => g.platform.toLowerCase() === detected.toLowerCase());
    if (match) return match.platform;
  }
  return available[0].platform;
}

const EXT_LABELS: Record<string, string> = {
  ipa: 'IPA',
  apk: 'APK',
  aab: 'AAB',
  zip: 'Zip',
  exe: 'Exe',
  msi: 'MSI',
  msix: 'MSIX',
  deb: 'Deb',
  rpm: 'RPM',
  appimage: 'AppImage',
  tar: 'Tar',
  gz: 'Tarball',
};

function inferPackageLabel(url: string): string {
  const m = url.match(/\.([a-z0-9]+)(?:$|\?)/i);
  if (m) {
    const ext = m[1].toLowerCase();
    if (EXT_LABELS[ext]) return EXT_LABELS[ext];
  }
  return 'Download';
}

function prettyLabel(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

interface DownloadOption {
  pkg: string;
  arch: string | null;
  url: string;
}

interface PlatformGroup {
  platform: string;
  arches: string[];
  options: DownloadOption[];
}

function collectOptions(obj: unknown, pkg: string | null, arch: string | null, out: DownloadOption[]) {
  if (typeof obj === 'string' && obj) {
    out.push({ pkg: pkg || inferPackageLabel(obj), arch, url: obj });
    return;
  }
  if (obj && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (ARCH_KEYS.has(key.toLowerCase())) {
        const norm = key.toLowerCase() === 'aarch64' ? 'arm64' : key.toLowerCase();
        collectOptions(value, pkg, norm, out);
      } else {
        collectOptions(value, pkg ? `${pkg} · ${prettyLabel(key)}` : prettyLabel(key), arch, out);
      }
    }
  }
}

function buildPlatformGroups(version: AppVersion): PlatformGroup[] {
  const dl = version.downloads || version.downloadURLs;
  if (!dl || typeof dl !== 'object') return [];
  const groups: PlatformGroup[] = [];
  for (const [platform, value] of Object.entries(dl)) {
    const options: DownloadOption[] = [];
    collectOptions(value, null, null, options);
    const valid = options.filter((o) => o.url);
    if (valid.length === 0) continue;
    const archSet = new Set<string>();
    for (const o of valid) if (o.arch) archSet.add(o.arch);
    const arches = Array.from(archSet).sort((a, b) => {
      const ai = ARCH_ORDER.indexOf(a);
      const bi = ARCH_ORDER.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
    groups.push({ platform: prettyLabel(platform), arches, options: valid });
  }
  return groups;
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
  const groups = version ? buildPlatformGroups(version) : [];

  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedArch, setSelectedArch] = useState<string | null>(null);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [activeScreenshotIndex, setActiveScreenshotIndex] = useState<number | null>(null);

  useEffect(() => {
    if (groups.length > 0) {
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const platform = pickDefaultPlatform(groups, ua);
      setSelectedPlatform(platform);
      const g = groups.find((x) => x.platform === platform);
      setSelectedArch(defaultArch(g ? g.arches : []));
    } else {
      setSelectedPlatform(null);
      setSelectedArch(null);
    }
  }, [version?.version]);

  const activeGroup = groups.find((g) => g.platform === selectedPlatform) || null;
  const visibleOptions = activeGroup
    ? activeGroup.options.filter((o) => o.arch === null || o.arch === selectedArch)
    : [];

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

  const selectPlatform = (platform: string) => {
    setSelectedPlatform(platform);
    const g = groups.find((x) => x.platform === platform);
    setSelectedArch(defaultArch(g ? g.arches : []));
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
        <Section title={t.appDetail.downloads} centered>
          <div className="font-display mx-auto w-full max-w-4xl rounded-2xl border border-gray-800 bg-[#0a0a0a] overflow-hidden">
            <div className="h-1 w-full" style={{ backgroundColor: app.tintColor || '#8b5cf6' }} />

            <div className="p-5 sm:p-7 flex flex-col gap-6">
              {/* Version + actions */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="version-select"
                    className="text-[11px] font-semibold uppercase tracking-wide text-gray-400"
                  >
                    {t.appDetail.versions}
                  </label>
                  <div className="relative">
                    <select
                      id="version-select"
                      value={version?.version}
                      onChange={(e) => {
                        const v = app.versions.find((x) => x.version === e.target.value);
                        if (v) setSelectedVersion(v);
                      }}
                      className="appearance-none rounded-lg border border-gray-700 bg-gray-900 text-white text-sm font-semibold pl-3 pr-9 py-2 cursor-pointer hover:bg-gray-800 focus:ring-2 focus:ring-gray-500/50 focus:border-transparent transition-colors"
                    >
                      {app.versions.map((v, i) => (
                        <option key={v.version} value={v.version} className="bg-gray-900">
                          {v.version}
                          {i === 0 ? ` — ${t.appDetail.latest}` : ''}
                          {v.date ? `  ·  ${v.date.replace(/-/g, '/')}` : ''}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {version?.sourceCode && (
                    <a
                      href={version.sourceCode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 text-sm font-semibold transition-colors"
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
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 text-sm font-semibold transition-colors border border-gray-700"
                  >
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-700 text-[10px]">i</span>
                    {t.appDetail.viewDetails}
                  </button>
                </div>
              </div>

              {tempDownloadsOff ? (
                <div className="rounded-xl bg-gray-900 border border-gray-800 p-5">
                  <h4 className="font-semibold text-gray-300">{t.appDetail.downloadsPausedTitle}</h4>
                  <p className="text-gray-500 text-sm mt-1">{t.appDetail.downloadsPausedReason}</p>
                </div>
              ) : groups.length > 0 ? (
                <>
                  {/* Platform selector */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      {t.appDetail.selectPlatform}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {groups.map((g) => {
                        const active = selectedPlatform === g.platform;
                        return (
                          <button
                            key={g.platform}
                            type="button"
                            onClick={() => selectPlatform(g.platform)}
                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold border transition-all duration-200 ${
                              active
                                ? 'bg-white text-black border-white'
                                : 'bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800 hover:text-white'
                            }`}
                          >
                            <span className={active ? 'text-black' : 'text-gray-400'}>
                              {getPlatformIcon(g.platform)}
                            </span>
                            <span className="truncate">{g.platform}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Arch selector */}
                  {activeGroup && activeGroup.arches.length > 0 && (
                    <div className="flex flex-col gap-2.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        {t.appDetail.selectArch}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {activeGroup.arches.map((a) => {
                          const active = selectedArch === a;
                          return (
                            <button
                              key={a}
                              type="button"
                              onClick={() => setSelectedArch(a)}
                              className={`rounded-lg px-3.5 py-2 text-sm font-semibold border transition-all duration-200 ${
                                active
                                  ? 'bg-gray-100 text-black border-gray-100'
                                  : 'bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800 hover:text-white'
                              }`}
                            >
                              {ARCH_LABELS[a] || a}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Downloads */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      {t.appDetail.downloads}
                    </span>
                    {visibleOptions.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {visibleOptions.map((o) => {
                          const sub = o.arch ? ARCH_LABELS[o.arch] || o.arch : null;
                          return (
                            <a
                              key={`${o.pkg}-${o.url}`}
                              href={o.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center justify-between gap-3 rounded-xl border border-gray-800 bg-gray-900 hover:border-gray-600 hover:bg-gray-800 px-4 py-3.5 transition-colors"
                            >
                              <div className="min-w-0">
                                <p className="font-semibold text-white text-sm truncate">{o.pkg}</p>
                                {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
                              </div>
                              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-800 group-hover:bg-gray-700 text-gray-300 group-hover:text-white transition-colors flex-shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">{t.appDetail.noDownloads}</p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm">{t.appDetail.noDownloads}</p>
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
        <Section title={t.appDetail.viewScreenshots} centered>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {screenshots.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveScreenshotIndex(i)}
                className="rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors"
                aria-label={`${t.appDetail.viewScreenshots} ${i + 1}`}
              >
                <img src={src} alt="" className="w-full h-auto object-contain" />
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
            className="relative w-full max-w-6xl max-h-[90vh] rounded-2xl border border-gray-800 p-3 sm:p-4"
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
