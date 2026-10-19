/**
 * Marchio PROVVISORIO di EDILBRUNO (il cliente non ha ancora dato il logo): tre file di mattoni a
 * tratto + nome, nei riquadri della base. [[DA COMPILARE: logo vero in SVG]]
 *
 *   node scripts/marchio.mjs     (dopo scripts/foto-unsplash.mjs: l'OG usa una foto d'esempio)
 *
 * Scrive: public/img/logo/logo.svg e logo-light.svg (882×182), favicon.svg, favicon.ico (32),
 * apple-touch-icon.png (180), icon-192.png, icon-512.png, img/og/og-default.png (1200×630).
 * Non lanciare `npm run placeholders` dopo: riporterebbe i segnaposto grigi.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');
const out = (rel, data) => {
  const f = path.join(PUB, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, data);
  console.log('scritto', rel);
};

const ACCENTO = '#8a3a1f';
const ACCENTO_SCURO = '#e9a46b';

// Segno: tre file di mattoni sfalsati nel riquadro 64×64 (stesso segno della fascia CTA)
export const MATTONI = 'M4 8h26v14H4zM34 8h26v14H34zM4 25h12v14H4zM20 25h24v14H20zM48 25h12v14H48zM4 42h26v14H4zM34 42h26v14H34z';

const logo = (fg, accento) => `<svg xmlns="http://www.w3.org/2000/svg" width="882" height="182" viewBox="0 0 882 182">
<g transform="translate(14 23) scale(2.12)" fill="none" stroke="${accento}" stroke-width="3.2" stroke-linejoin="miter"><path d="${MATTONI}"/></g>
<text x="182" y="112" font-family="Inter, 'Segoe UI', Arial, Helvetica, sans-serif" font-size="88" font-weight="800" letter-spacing="3" fill="${fg}">EDIL<tspan fill="${accento}">BRUNO</tspan></text>
<text x="186" y="156" font-family="Inter, 'Segoe UI', Arial, Helvetica, sans-serif" font-size="25" font-weight="600" letter-spacing="7" fill="${fg}" opacity=".72">IMPRESA EDILE · GALLARATE</text>
</svg>
`;
out('img/logo/logo.svg', logo('#1e1c1a', ACCENTO));
out('img/logo/logo-light.svg', logo('#ffffff', ACCENTO_SCURO));

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${ACCENTO}"/><g transform="translate(6 6) scale(.8125)"><path d="${MATTONI}" fill="none" stroke="#fff" stroke-width="4.5"/></g></svg>
`;
out('favicon.svg', favicon);

const png = (s) => sharp(Buffer.from(favicon), { density: Math.ceil((72 * s) / 64) * 2 }).resize(s, s).png().toBuffer();
function ico(p, s) {
  const h = Buffer.alloc(22); h.writeUInt16LE(0, 0); h.writeUInt16LE(1, 2); h.writeUInt16LE(1, 4); h[6] = s; h[7] = s;
  h.writeUInt16LE(1, 10); h.writeUInt16LE(32, 12); h.writeUInt32LE(p.length, 14); h.writeUInt32LE(22, 18);
  return Buffer.concat([h, p]);
}
out('favicon.ico', ico(await png(32), 32));
out('apple-touch-icon.png', await png(180));
out('icon-192.png', await png(192));
out('icon-512.png', await png(512));

// Immagine di condivisione 1200×630: foto d'esempio + velatura scura + logo chiaro
const foto = path.join(PUB, 'img/lavori/bagno-busto-arsizio');
const src = fs.readdirSync(foto).filter((f) => f.endsWith('.jpg')).sort((a, b) => parseInt(b.split('-').pop()) - parseInt(a.split('-').pop()))[0];
const velo = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e1c1a" stop-opacity=".25"/><stop offset="1" stop-color="#1e1c1a" stop-opacity=".88"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>`);
const marchio = await sharp(Buffer.from(logo('#ffffff', ACCENTO_SCURO)), { density: 144 }).resize(760).png().toBuffer();
const og = await sharp(path.join(foto, src))
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .composite([{ input: velo }, { input: marchio, left: 60, top: 630 - 60 - Math.round((760 * 182) / 882) }])
  .png()
  .toBuffer();
out('img/og/og-default.png', og);
