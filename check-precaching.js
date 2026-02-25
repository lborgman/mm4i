#!/usr/bin/env node
// check-precaching.js – 2026 Ultimate Debug Version
import { readFile, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ignore from 'ignore';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const workboxPath = join(__dirname, 'sw-workbox.js');
const gitignorePath = join(__dirname, '.gitignore');

// IMPORTANT: Ensure this points to the folder where your web server (8090) starts
const projectRoot = resolve(__dirname);

async function main() {
  console.log(`\n--- Precache Integrity Check [${new Date().toLocaleTimeString('en-GB', { hour12: false })}] ---`);

  // 1. Extract Manifest using "Brute Force"
  console.log('1. Extract Manifest using "Brute Force"');

  const source = await readFile(workboxPath, 'utf8');
  const manifestMatch = source.match(/(\[\s*{\s*["'](?:revision|url)["'][\s\S]*?\])/);

  if (!manifestMatch) {
    console.error('❌ Error: Could not find any Workbox manifest array in sw-workbox.js.');
    process.exit(1);
  }

  const manifest = JSON.parse(manifestMatch[1]);
  console.log(`🔍 Found ${manifest.length} entries. Verifying paths...`);

  // 2. Load .gitignore
  console.log("2. Load .gitignore");

  let gitignoreContent = '';
  try { gitignoreContent = await readFile(gitignorePath, 'utf8'); } catch (e) { }
  const ig = ignore().add(gitignoreContent);

  let failCount = 0;
  const issues = [];

  for (const entry of manifest) {
    // 🔑 Fix 1: Decode URL (spaces, %20, etc)
    const decodedUrl = decodeURIComponent(entry.url);

    // 🔑 Fix 2: Remove leading slashes and dots to prevent "path jump"
    const cleanedUrl = decodedUrl.replace(/^(\.\/|\/)/, '');
    if (cleanedUrl.includes(" ")) {
      console.log(`ERROR: Contains space: ${entry.url}`);
      failCount++;
      continue;
    }

    const fullPath = join(projectRoot, cleanedUrl);

    // 🔬 ADD THIS LINE HERE:
    if (entry.url.includes('Copy')) console.log(`DEBUG: Checking Copy file at: ${fullPath}`);

    let isMissing = false;
    try {
      await access(fullPath);
    } catch {
      isMissing = true;
    }

    const isIgnored = ig.ignores(cleanedUrl);

    // DEBUG: Uncomment the line below if you want to see exactly what it's checking
    // console.log(`Checking: ${cleanedUrl} -> ${fullPath} [Missing: ${isMissing}, Ignored: ${isIgnored}]`);

    if (isMissing || isIgnored) {
      failCount++;
      issues.push({
        url: entry.url,
        fullPath: fullPath,
        reason: isMissing && isIgnored ? 'MISSING & IGNORED' : (isMissing ? 'MISSING' : 'IGNORED')
      });
    }
  }

  if (failCount === 0) {
    console.log('✅ PASS: All files verified.\n');
    process.exit(0);
  } else {
    console.error(`❌ FAIL: Found ${failCount} issue(s):\n`);
    issues.forEach(issue => {
      console.error(`  [${issue.reason}]`);
      console.error(`  URL:  ${issue.url}`);
      console.error(`  DISK: ${issue.fullPath}\n`);
    });
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});