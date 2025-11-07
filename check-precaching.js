#!/usr/bin/env node
// check-precache.js – 2025 ESM
// Checks if any precached file is ignored in .gitignore

import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ignore from 'ignore'; // npm install ignore

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const workboxPath = join(__dirname, 'sw-workbox.js');
const gitignorePath = join(__dirname, '.gitignore');
const projectRoot = __dirname;

async function main() {
  // -------------------------------------------------
  // 1. Load & parse PRECACHE_MANIFEST
  // -------------------------------------------------
  const source = await readFile(workboxPath, 'utf8');
  const lines = source.split('\n');

  const startIdx = lines.findIndex(l =>
    l.trimStart().startsWith('const PRECACHE_MANIFEST')
  );

  if (startIdx === -1) {
    console.error('const PRECACHE_MANIFEST not found');
    process.exit(1);
  }

  let raw = '';
  let braces = 0;
  let inArray = false;

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    raw += line + '\n';
    for (const ch of line) {
      if (ch === '[') { if (!inArray) inArray = true; braces++; }
      if (ch === ']') braces--;
    }
    if (inArray && braces === 0) break;
  }

  const jsonStr = raw
    .replace(/^.*const\s+PRECACHE_MANIFEST\s*=\s*/s, '')
    .replace(/;?\s*$/, '');

  let manifest;
  try { manifest = JSON.parse(jsonStr); }
  catch (err) {
    console.error('Failed to parse PRECACHE_MANIFEST');
    console.error(err.message);
    process.exit(1);
  }

  // -------------------------------------------------
  // 2. Map URLs → relative paths (from project root)
  // -------------------------------------------------
  const entries = manifest.map(entry => {
    const url = entry.url.replace(/^\/+/, ''); // "/assets/x.js" → "assets/x.js"
    const relativePath = join(url); // normalize path separators
    return { url: entry.url, path: relativePath };
  });

  // -------------------------------------------------
  // 3. Load and parse .gitignore
  // -------------------------------------------------
  let gitignoreContent = '';
  try {
    gitignoreContent = await readFile(gitignorePath, 'utf8');
  } catch (err) {
    console.warn('.gitignore not found – assuming nothing is ignored');
  }

  const ig = ignore().add(gitignoreContent);

  // -------------------------------------------------
  // 4. Check which files are ignored
  // -------------------------------------------------
  const ignored = entries.filter(entry =>
    ig.ignores(entry.path)
  );

  // -------------------------------------------------
  // 5. Report
  // -------------------------------------------------
  console.log(`Checked ${entries.length} precache entries against .gitignore\n`);

  if (ignored.length === 0) {
    console.log('All precached files are tracked (not ignored).');
  } else {
    console.error(`${ignored.length} precached file(s) are IGNORED in .gitignore:`);
    ignored.forEach(e => {
      console.error(`  URL: ${e.url}`);
      console.error(`  Path: ${e.path}\n`);
    });
    process.exit(1); // fail script / CI
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});