/**
 * Cerca residui dei clienti dei siti da cui la base è stata ricavata (nomi, persone,
 * indirizzi, contatti, progetti, luoghi, ID tecnici) in src/, public/, config e dist/.
 * Esce con errore se ne trova. Ricerca senza maiuscole/minuscole, a parola intera.
 * Niente termini che sono anche frasi comuni in italiano (es. "casa e"): darebbero falsi positivi.
 *
 *   npm run check-residui        (dopo npm run build per controllare anche dist/)
 *
 * L'elenco è codificato in base64 perché lo script stesso non contenga i dati in chiaro.
 * Per aggiungere termini: decodifica, aggiungi e ricodifica, ad esempio
 *   node -e "console.log(JSON.parse(Buffer.from(process.argv[1], 'base64')))" <TERMINI_B64>
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const TERMINI_B64 = 'WyJncmFwaGl0ZSIsImdyYXBoaXRlc3R1ZGlvIiwiR3JhcGhpdGVTdHVkaW9SRSIsImdyYXBoaXRlc2l0ZSIsIkdhbmRoaSIsIjQyMTIzIiwiMDUyMiIsIjcwOTY2MCIsIiszOTA1MjIiLCJSZWdnaW8gRW1pbGlhIiwiVmlsbGFnZ2lvIEFyY2hpdGV0dGkiLCJJVC1SRSIsIjQ0LjY4MDQ4IiwiMTAuNjE0NiIsIjI1MjBhYWE0IiwiQ2FzdGFnbmV0dGkiLCJEYW5pZWxlIEZlcnJpIiwiSWxhcmlhIEZyYW5jaGkiLCJNZXNzb3JpIiwiUGF0ZXJsaW5pIiwiTG9yZW56byBWaWxsYSIsIkx1Y2EgTG90dGkiLCJCb25hY2luaSIsIlNpbHZpYSBNZXJ6aSIsIkRhcmlhIE1lZGljaSIsIk1hZ25hbmluaSIsIkJlcnRvbGRpIiwiVGFjY2hpbmkiLCJWZXJvbmljYSBDYXNhbGkiLCJTdGFsbGEgVCIsInN0YWxsYS10IiwiQmVsdHJhbWkiLCJDYXNhIEJDIiwiY2FzYS1iYyIsIkNhbm9zc2EiLCJDdXJyYWRhIiwiU2FsdWdnaWEiLCJQYXNjb2xpIiwiUG92aWdsaW8iLCJHYWJiaWFuYSIsIlF1aXN0ZWxsbyIsIkZpb3Jhbm8iLCJDYXNhbGdyYW5kZSIsIk5vdmVsbGFyYSIsIkd1YXN0YWxsYSIsIkdhdHRhdGljbyIsIk1lZGlvcGFkYW5hIiwiR2VsYXRlcmlhIDkwIiwiTGEgU2V0ZSIsIjNDIFNhbHV0ZSIsIkFDRVIgUmVnZ2lvIiwiRG9iZXJkw7IiLCJIZXJhbWJpZW50ZSIsIkJyaW5kYW5pIiwiR2FsaW1iZXJ0aSIsIk5vY2VyaW5vIiwiR3Jhc3NpIiwiUGFsaWRhbm8iLCJHb256YWdhIiwiQ3Jvc3RvbGluYSIsIlJhbWlzZXRvIiwiTWlub3p6byIsIkJhc2lsaWNhbm92YSIsIlN1cGVyYm9udXMiLCJTb3ByaW50ZW5kZW56YSIsIkNvci10ZW4iLCJ0w6xsZGUiLCJ0aWxkZSIsInRpbGRlc3R1ZGlvIiwidGlsZGVzdHVkaW8uZXUiLCJFc2Nvcml6YSIsIlRvcnJhbGJvIiwiUGVkcm8iLCJSZW5hdG8iLCJSaWdoaSIsIk9BTWkiLCIyMTU4NiIsIjIyMTAxIiwiQ2FzdGVsdmV0cm8iLCI0MTEyNCIsIk1vZGVuYSIsIlNldmlsbGEiLCJTZXZpbGxlIiwiQ29uY2VqYWwiLCJKaW3DqW5leiIsIkJlY2VycmlsIiwiNDEwMDkiLCJJVC1NTyIsIjQ0LjY0MDUiLCIxMC45MjY2IiwiRW1pbGlhIiwiQW5kYWx1c2lhIiwiU3BhaW4iLCJTcGFuaXNoIiwiRm9ybWlnaW5lIiwiTWlyYW5kb2xhIiwiQ2FycGkiLCJCb2xvZ25hIiwiRmVycmFyYSIsIlBlZ28iLCJCZXNhbMO5IiwiQmFyY2Vsb25hIiwiQWxpY2FudGUiLCJMb2dyb8OxbyIsIkdyYW5hZGEiLCJCYWRham96IiwiQ2h1ZWNhIiwiUmlvbmVybyIsIlZ1bHR1cmUiLCJDYXRhbmlhIiwiU29yYSIsIkNlc2EiLCJDYXNlcnRhIiwiT211bGkiLCJMYXR2aWEiLCJMaXNib24iLCJPaXJvIiwiUG9ydHVnYWwiLCJCYWdub2xvIiwiU2FuIFBpZXJvIiwiUm9tYSIsIlRlcnJhcGzDqG4iLCJUZXJyYXBsZW4iLCJGZXQgZOKAmUFpZ3VhIiwiZmV0LWRhaWd1YSIsIkVzY29sYSIsIlZpbGFycmFzc2EiLCJWb2x1bWUgVU5PIiwidm9sdW1lLXVubyIsIlRlcnJhY2UgdyIsInRlcnJhY2Utd2l0aC1hLWhvdXNlIiwiQ29udHJhcHVudG8iLCJQYWlzYWplIiwiQ2FzYSBBRCIsImNhc2EtYWQiLCJjYXNhLWUiLCJjYXNhLWMiLCJCbHUgLyBBenVsIiwiYmx1LWF6dWwiLCJIZW1lcmEiLCJIxJNtw6lyYSIsIsOTcHRpY2EiLCJ2aXZhIHZvY2UiLCJhLXZpdmEtdm9jZSIsIlBpYXp6ZXR0YSIsIkdpb3JnaSIsIkFncmljdWx0dXJhbCIsIlRpYmlkYWJvIiwiU3R1ZGlvbG8iLCJEb21lbmljbyIsIlNhbnTigJlBZ2F0YSIsInNhbnRhZ2F0YSIsIkZyYWdtZW50b3MiLCJCb3VsZXZhcmQgZGVsbGEiLCJGbMO5dHR1byIsImZsdXR0dW8iLCJTZWxlY3RpdmUgVXBncmFkZSIsImhvdXNpbmcgYXJjaGl2ZSIsImVzY2VuYSIsIk1hcnRpcmkiLCJCaXNjaW9uZSIsIkN1bmlvbGEiLCJsaW5oYSBkZSBzb21icmEiLCJIb3JzZSBtdXNldW0iLCJBcmJvbGVkYSIsIkNvbmPDqW50cmljbyIsIlRBQyEiLCJGQVIgUm9tYSIsIk1pZXMgdmFuIGRlciBSb2hlIiwiQmxpbmQgd2FsbHMiLCJBQ0VSIiwiQXl1bnRhbWllbnRvIiwiQWp1bnRhbWVudCIsIkdlbmVyYWxpdGF0IiwiUG9sdHJpbmkiLCJCaW5hcmlvIExhYiIsIlNpbHZlc3RyaSIsIkTigJlBbmdlbG8iLCJHb2xkb25pIiwiSXNvbGFuaSIsIk1vcmlsbG8iLCJIZWF0bGV5IiwiUGFsZXJtbyIsIk9nbGlhbmkiLCJQaWNoIiwiUmVnaW5lbGxhIiwiUmlnaGV0dGkiLCJUYXZlbGxhIiwiQ3VhcnRvIEzDumNpZG8iLCJMw7pjaWRvIiwiU3F1YXJlc3BhY2UiLCJQb2xpdGVjbmljbyIsIk5lb2xhdXJlYXRpIiwiZjgwNDk2ZjMiLCJpbmZvQHRpbGRlIl0=';
const TERMINI = JSON.parse(Buffer.from(TERMINI_B64, 'base64').toString('utf8'));

const DIRS = ['src', 'public', 'dist', 'scripts', 'astro.config.mjs', 'netlify.toml', 'package.json', 'README.md'];
const SKIP = new Set(['check-residui.mjs']);
const EXT = /\.(astro|ts|js|mjs|json|md|css|html|txt|xml|svg|webmanifest|toml)$/;

const files = [];
for (const d of DIRS) {
  const full = path.join(ROOT, d);
  if (!fs.existsSync(full)) continue;
  if (fs.statSync(full).isFile()) { files.push(full); continue; }
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (EXT.test(e.name) && !SKIP.has(e.name)) files.push(p);
    }
  })(full);
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const RX = TERMINI.map((t) => [t, new RegExp(`(?<![\\p{L}\\p{N}])${esc(t)}(?![\\p{L}\\p{N}])`, 'giu')]);

let trovati = 0;
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  for (const [term, rx] of RX) {
    for (const m of t.matchAll(rx)) {
      trovati++;
      const i = m.index;
      const riga = t.slice(0, i).split('\n').length;
      console.log(`${path.relative(ROOT, f)}:${riga}  «${term}»  …${t.slice(Math.max(0, i - 40), i + 40).replace(/\s+/g, ' ')}…`);
    }
  }
}
console.log(trovati ? `\n✗ ${trovati} residui trovati in ${files.length} file` : `✓ Nessun residuo dei clienti precedenti in ${files.length} file (${TERMINI.length} termini)`);
process.exitCode = trovati ? 1 : 0;
