#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { upsertAppVersionFromManifest } from './upsert-app-version.mjs';

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
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

const args = parseArgs(process.argv);
if (!args.manifest) {
  console.error('missing --manifest <path>');
  process.exit(1);
}
const manifestPath = path.resolve(process.cwd(), args.manifest);
const manifest = readJson(manifestPath);
const slugs = [...new Set((manifest.artifacts || []).map((a) => a.project_slug).filter((s) => s && s !== 'unknown'))];

let changed = false;
for (const slug of slugs) {
  const result = upsertAppVersionFromManifest(manifest, slug);
  if (result.changed) changed = true;
  console.log(`${slug}: ${result.reason}`);
}

if (!changed) {
  console.log('no app metadata changes were required');
}
