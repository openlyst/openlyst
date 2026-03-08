#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const APPS_DIR = path.resolve(process.cwd(), 'src/lib/data/apps');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function releaseNote(manifest, slug, sourceCommitUrl) {
  return `# ${manifest.build_name}\n\n- Rolling release ${manifest.release_tag}\n- Build number: ${manifest.build_number}\n- App: ${slug}\n- Source commit: ${sourceCommitUrl || 'n/a'}`;
}

function mapArtifactsToDownloads(artifacts) {
  const downloads = {};
  for (const art of artifacts) {
    const url = art.canonical_url || art.artifact_url || '';
    const pkg = (art.package_type || '').toLowerCase();
    const platform = (art.platform || '').toLowerCase();
    if (!url) continue;

    if (platform === 'ios' || pkg === 'ipa') {
      downloads.iOS = url;
      continue;
    }
    if (platform === 'android') {
      downloads.Android = downloads.Android || {};
      if (pkg === 'apk') downloads.Android.apk = url;
      if (pkg === 'aab') downloads.Android.aab = url;
      continue;
    }
    if (platform === 'windows') {
      downloads.Windows = downloads.Windows || {};
      if (pkg === 'zip') downloads.Windows.zip = { x86_64: url, arm64: '' };
      if (pkg === 'exe') downloads.Windows.exe = { x86_64: url, arm64: '' };
      continue;
    }
    if (platform === 'macos') {
      downloads.macOS = downloads.macOS || { x86_64: '', arm64: '', universal: '' };
      if (pkg === 'zip' || pkg === 'dmg') downloads.macOS.universal = url;
      continue;
    }
    if (platform === 'linux') {
      downloads.Linux = downloads.Linux || {};
      if (pkg === 'zip') downloads.Linux.zip = { x86_64: url, arm64: '' };
      if (pkg === 'appimage') downloads.Linux.appimage = { x86_64: url, arm64: '' };
      if (pkg === 'deb') downloads.Linux.deb = { x86_64: url, arm64: '' };
      if (pkg === 'rpm') downloads.Linux.rpm = { x86_64: url, arm64: '' };
      continue;
    }
    if (platform === 'web') {
      downloads.Web = url;
    }
  }
  return downloads;
}

function derivePlatforms(downloads) {
  const out = [];
  if (downloads.iOS) out.push('iOS');
  if (downloads.Android && (downloads.Android.apk || downloads.Android.aab)) out.push('Android');
  if (downloads.macOS && downloads.macOS.universal) out.push('macOS');
  if (downloads.Windows && ((downloads.Windows.zip && downloads.Windows.zip.x86_64) || (downloads.Windows.exe && downloads.Windows.exe.x86_64))) out.push('Windows');
  if (downloads.Linux) out.push('Linux');
  if (downloads.Web) out.push('Web');
  return out;
}

function defaultInstallText(platform) {
  if (platform === 'iOS') return 'Install via AltStore repository.';
  if (platform === 'Android') return 'Download APK from official Openlyst releases.';
  if (platform === 'macOS') return 'Download the latest macOS build.';
  if (platform === 'Windows') return 'Download the latest Windows build.';
  if (platform === 'Linux') return 'Download the latest Linux build.';
  if (platform === 'Web') return 'Use the hosted web build.';
  return 'Download the latest build.';
}

export function upsertAppVersionFromManifest(manifest, appSlug) {
  const appFile = path.join(APPS_DIR, `${appSlug}.json`);
  if (!fs.existsSync(appFile)) {
    return { appSlug, changed: false, reason: `missing app file ${appFile}` };
  }

  const appData = readJson(appFile);
  const appArtifacts = (manifest.artifacts || []).filter((a) => a.project_slug === appSlug);
  if (appArtifacts.length === 0) {
    return { appSlug, changed: false, reason: 'no artifacts for app' };
  }

  const downloads = mapArtifactsToDownloads(appArtifacts);
  const platforms = derivePlatforms(downloads);
  const latest = Array.isArray(appData.versions) && appData.versions.length > 0 ? appData.versions[0] : null;
  const platformInstall = latest?.platformInstall && typeof latest.platformInstall === 'object' ? { ...latest.platformInstall } : {};
  for (const p of platforms) {
    if (!platformInstall[p]) platformInstall[p] = defaultInstallText(p);
  }

  const sourceCommit = appArtifacts.find((a) => a.source_commit_sha)?.source_commit_sha || '';
  const sourceCode = appArtifacts.find((a) => a.source_commit_url)?.source_commit_url || latest?.sourceCode || '';
  const checksums = {};
  for (const art of appArtifacts) {
    checksums[art.artifact_filename] = art.sha256;
  }

  const newVersion = {
    version: manifest.build_name,
    buildVersion: manifest.build_name,
    buildNumber: String(manifest.build_number),
    releaseTag: manifest.release_tag,
    sourceCommit,
    sourceCode,
    date: manifest.build_date,
    generatedAt: manifest.generated_at,
    publishedAt: new Date().toISOString(),
    platforms,
    platformInstall,
    downloads,
    checksums,
    localizedDescription: {
      en: releaseNote(manifest, appSlug, sourceCode),
      zh: releaseNote(manifest, appSlug, sourceCode),
      ru: releaseNote(manifest, appSlug, sourceCode),
    },
  };

  const versions = Array.isArray(appData.versions) ? [...appData.versions] : [];
  const existingIndex = versions.findIndex((v) => v.releaseTag === manifest.release_tag || (v.buildNumber && String(v.buildNumber) === String(manifest.build_number)));
  if (existingIndex >= 0) {
    versions[existingIndex] = { ...versions[existingIndex], ...newVersion };
  } else {
    versions.unshift(newVersion);
  }

  versions.sort((a, b) => {
    const bnA = Number(a.buildNumber || 0);
    const bnB = Number(b.buildNumber || 0);
    if (bnA !== bnB) return bnB - bnA;
    return String(b.date || '').localeCompare(String(a.date || ''));
  });

  appData.versions = versions;
  writeJson(appFile, appData);
  return { appSlug, changed: true, reason: 'updated' };
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const k = argv[i];
    const v = argv[i + 1];
    if (k.startsWith('--')) args[k.slice(2)] = v;
  }
  return args;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv);
  if (!args.manifest) {
    console.error('missing --manifest <path>');
    process.exit(1);
  }
  const manifest = readJson(path.resolve(process.cwd(), args.manifest));
  const slugs = args.app
    ? [args.app]
    : [...new Set((manifest.artifacts || []).map((a) => a.project_slug).filter((s) => s && s !== 'unknown'))];
  const results = slugs.map((slug) => upsertAppVersionFromManifest(manifest, slug));
  for (const r of results) console.log(`${r.appSlug}: ${r.reason}`);
}
