#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const appsDir = path.resolve(process.cwd(), 'src/lib/data/apps');
const appFiles = fs.readdirSync(appsDir).filter((f) => f.endsWith('.json')).map((f) => path.join(appsDir, f));

let hasErrors = false;

function fail(msg) {
  hasErrors = true;
  console.error(`ERROR: ${msg}`);
}

for (const file of appFiles) {
  const app = JSON.parse(fs.readFileSync(file, 'utf8'));
  const slug = path.basename(file, '.json');
  if (!Array.isArray(app.versions) || app.versions.length === 0) {
    fail(`${slug}: versions must be a non-empty array`);
    continue;
  }

  const sorted = [...app.versions].sort((a, b) => {
    const bnA = Number(a.buildNumber || 0);
    const bnB = Number(b.buildNumber || 0);
    if (bnA !== bnB) return bnB - bnA;
    return String(b.date || '').localeCompare(String(a.date || ''));
  });
  if (JSON.stringify(sorted[0]) !== JSON.stringify(app.versions[0])) {
    fail(`${slug}: latest version is not first (must be newest-first by buildNumber/date)`);
  }

  for (const [idx, v] of app.versions.entries()) {
    if (!v.version) fail(`${slug}[${idx}]: missing version`);
    if (!v.date) fail(`${slug}[${idx}]: missing date`);
    if (!v.downloads || typeof v.downloads !== 'object') {
      fail(`${slug}[${idx}]: missing downloads object`);
      continue;
    }
    const hasDownload = JSON.stringify(v.downloads).includes('http');
    if (!hasDownload) fail(`${slug}[${idx}]: downloads has no URLs`);
    if (v.releaseTag && !String(v.releaseTag).startsWith('build-')) {
      fail(`${slug}[${idx}]: releaseTag must start with build-`);
    }
  }
}

if (hasErrors) process.exit(1);
console.log(`release data validated (${appFiles.length} apps)`);
