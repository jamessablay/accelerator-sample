// -----------------------------------------------------------------------------
// Verify that every Tailwind utility used in source exists in the compiled CSS.
//
// WHY THIS EXISTS. Tailwind used to be loaded from the CDN, which ships a JIT
// compiler to the browser and generates utilities on demand from whatever class
// strings it finds at runtime. A real build only emits what its `content` globs
// can see at build time, so a class that is constructed dynamically, or that
// depends on a theme key which does not exist, silently produces NOTHING.
//
// "Silently produces nothing" is the important part. There is no error, no
// warning and no visual fallback: the element simply renders without that
// property, which usually looks like a deliberate design choice.
//
// This check found exactly that on its first run. `bg-[#003D33]/92` in the
// Lightbox had never compiled, under the CDN either, because a bare `/92` is a
// LOOKUP in `theme.opacity` and the default scale has no 92 step. The lightbox
// backdrop had been fully transparent in production.
//
// Run: npm run verify:css   (after npm run build)
// -----------------------------------------------------------------------------

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.wrangler', 'scripts']);

/** Our own component classes, defined in styles/app.css rather than generated. */
const OURS = new Set([
  'custom-scrollbar',
  'persona-chip',
  'persona-chip-svg',
  'gap-cell',
  'group',
  'peer',
  'sr-only',
]);

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry) || entry.startsWith('.')) continue;
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(p)) out.push(p);
  }
  return out;
};

/**
 * CSS identifier escaping, matching what Tailwind actually emits.
 *
 * A class cannot START with a digit, so `2xl:foo` is written as a hex escape.
 * The subtlety that cost a round trip here: a hex escape is terminated either by
 * a space OR by the first character that is not a hex digit. `2xl:` becomes
 * `\32xl\:` with NO space, because `x` already terminates it. A space is only
 * emitted when the following character would otherwise be read as part of the
 * escape. Guess wrong and every single `2xl:` utility looks absent.
 */
const HEX = /[0-9a-fA-F]/;
const toSelector = (cls) => {
  const escaped = cls.replace(/[.*+?^${}()|[\]\\#%/,:!]/g, '\\$&');
  if (!/^\d/.test(escaped)) return `.${escaped}`;
  const rest = escaped.slice(1);
  return `.\\3${escaped[0]}${HEX.test(rest[0] ?? '') ? ' ' : ''}${rest}`;
};

/**
 * Strip `${...}` interpolations, brace-counting so nested ternaries and object
 * literals do not leave their tails behind. Without this, an expression like
 * `${activePage === item.page ? 'a' : 'b'}` contributes `item.page` as a token,
 * which then looks exactly like a missing utility.
 */
const stripExpressions = (s) => {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '$' && s[i + 1] === '{') {
      let depth = 1;
      i += 2;
      for (; i < s.length && depth > 0; i++) {
        if (s[i] === '{') depth++;
        else if (s[i] === '}') depth--;
      }
      out += ' ';
      i--;
    } else out += s[i];
  }
  return out;
};

/** Prose caught by the className regex from comments and ternaries. */
const isProse = (t) => /^[a-z]+$/.test(t) && !/-/.test(t);

const cssPath = process.argv[2] ?? findCss();
const css = readFileSync(cssPath, 'utf8');

const used = new Map();
for (const file of walk(ROOT)) {
  // Strip block comments first: they are the main source of false positives,
  // because a JSX comment sitting inside an attribute list gets swept up.
  const src = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ' ');
  const re =
    /className\s*=\s*(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\}|\{'([^']*)'\}|\{"([^"]*)"\})/g;
  let m;
  while ((m = re.exec(src))) {
    const raw = stripExpressions(m[1] ?? m[2] ?? m[3] ?? m[4] ?? m[5] ?? '');
    for (const tok of raw.split(/\s+/)) {
      const t = tok.trim();
      if (!t || t.includes('{') || t.includes('}')) continue;
      if (OURS.has(t) || isProse(t)) continue;
      // A utility always contains a dash, a colon or a bracket. Bare words and
      // dotted member expressions are leftovers from JSX, not classes.
      if (!/[-:[]/.test(t)) continue;
      if (!/^[-a-zA-Z0-9:[\]/.#%(),_@!]+$/.test(t)) continue;
      if (!used.has(t)) used.set(t, file.replace(ROOT, '').replace(/\\/g, '/'));
    }
  }
}

const missing = [...used].filter(([tok]) => !css.includes(toSelector(tok)));

console.log(`[verify:css] ${used.size} utilities scanned against ${cssPath.replace(ROOT, '')}`);
if (!missing.length) {
  console.log('[verify:css] ok. every utility used in source is present in the stylesheet.');
  process.exit(0);
}
console.error(`[verify:css] ${missing.length} MISSING from the stylesheet:\n`);
for (const [tok, file] of missing) console.error(`  ${tok.padEnd(40)} ${file}`);
console.error('\nA missing utility renders as nothing at all, with no error.');
process.exit(1);

function findCss() {
  const dir = join(ROOT, 'dist', 'assets');
  const hit = readdirSync(dir).find((f) => f.endsWith('.css'));
  if (!hit) throw new Error('No CSS in dist/assets. Run `npm run build` first.');
  return join(dir, hit);
}
