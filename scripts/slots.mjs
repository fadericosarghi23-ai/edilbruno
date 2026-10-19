/**
 * Report dei segnaposto ancora da compilare.
 *
 *   npm run slots
 *
 * Conta le occorrenze di [[DA COMPILARE: ...]] (slot di testo e di dato) e i token corti
 * usati per le micro-etichette, file per file.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIRS = ['src', 'public', 'astro.config.mjs'];
const EXT = new Set(['.astro', '.ts', '.js', '.mjs', '.md', '.css', '.svg', '.json']);

const files = [];
for (const entry of DIRS) {
  const full = path.join(ROOT, entry);
  if (!fs.existsSync(full)) continue;
  if (fs.statSync(full).isFile()) { files.push(full); continue; }
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (EXT.has(path.extname(e.name))) files.push(p);
    }
  })(full);
}

const SLOT = /\[\[DA COMPILARE[^\]]*\]\]/g;
/** testi scritti da noi in mancanza di materiale del cliente: non bloccano, vanno validati */
const VALIDA = /\[\[DA VALIDARE[^\]]*\]\]/g;
const SHORT = /\[\[(?!DA COMPILARE|DA VALIDARE)[^\]]+\]\]/g;

let slots = 0;
let valida = 0;
let shorts = 0;
const rows = [];

for (const f of files.sort()) {
  const src = fs.readFileSync(f, 'utf8');
  const s = (src.match(SLOT) || []).length;
  const v = (src.match(VALIDA) || []).length;
  const t = (src.match(SHORT) || []).length;
  if (!s && !t && !v) continue;
  slots += s;
  valida += v;
  shorts += t;
  rows.push([path.relative(ROOT, f), s, v, t]);
}

const pad = Math.max(...rows.map((r) => r[0].length));
console.log('\nSegnaposto ancora aperti\n');
console.log('  ' + 'file'.padEnd(pad) + '   slot   valid   token');
for (const [f, s, v, t] of rows) {
  console.log('  ' + f.padEnd(pad) + '   ' + String(s).padStart(4) + '   ' + String(v).padStart(5) + '   ' + String(t).padStart(5));
}
console.log(
  '\n  Totale: ' + slots + ' [[DA COMPILARE]] (manca il materiale), ' + valida +
  ' [[DA VALIDARE]] (testi scritti da noi) e ' + shorts + ' token corti, in ' + rows.length + ' file.'
);
console.log('  I [[DA VALIDARE]] non bloccano la pubblicazione: vanno fatti confermare al cliente.\n');
