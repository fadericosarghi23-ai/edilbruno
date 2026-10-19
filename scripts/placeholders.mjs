/**
 * Rigenera i segnaposto STATICI in public/ (logo, favicon, icone PWA, immagine Open Graph).
 *
 *   npm run placeholders
 *
 * Le immagini di contenuto (progetti, team, metodo, mappa) NON sono qui: sono SVG
 * generati in build da src/pages/img/placeholder/[id].svg.ts con le misure registrate
 * in src/data/*.ts. I PNG sono scritti a mano con zlib (nessuna dipendenza).
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const PUB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const out = (rel, data) => {
  const f = path.join(PUB, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, data);
  console.log('scritto', rel);
};

// ── PNG minimale: fondo grigio, bordo e diagonali più scure ──
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc(td));
  return Buffer.concat([len, td, c]);
};
function png(w, h) {
  const bg = [0xd9, 0xd5, 0xd0], ln = [0xa8, 0xa2, 0x9b];
  const b = Math.max(2, Math.round(Math.min(w, h) / 40));
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 3 + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const edge = x < b || y < b || x >= w - b || y >= h - b;
      const diag = Math.abs(x * h - y * w) < w * b / 2 || Math.abs((w - x) * h - y * w) < w * b / 2;
      const col = edge || diag ? ln : bg;
      const o = y * (w * 3 + 1) + 1 + x * 3;
      raw[o] = col[0]; raw[o + 1] = col[1]; raw[o + 2] = col[2];
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
function ico(pngBuf, size) {
  const head = Buffer.alloc(6 + 16);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
  head[6] = size; head[7] = size; head[8] = 0; head[9] = 0;
  head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12);
  head.writeUInt32LE(pngBuf.length, 14); head.writeUInt32LE(22, 18);
  return Buffer.concat([head, pngBuf]);
}

// ── Logo: 882x182 come il logo originale (scuro per fondo chiaro, chiaro per fondo scuro) ──
const logo = (fg, frame) => `<svg xmlns="http://www.w3.org/2000/svg" width="882" height="182" viewBox="0 0 882 182">
<rect x="3" y="3" width="876" height="176" fill="none" stroke="${frame}" stroke-width="3" stroke-dasharray="14 10"/>
<g font-family="Inter, Arial, sans-serif" fill="${fg}" text-anchor="middle">
<text x="441" y="92" font-size="54" font-weight="700" letter-spacing="4">LOGO 882 × 182</text>
<text x="441" y="140" font-size="30" letter-spacing="2">da sostituire (DA COMPILARE)</text>
</g>
</svg>
`;
out('img/logo/logo.svg', logo('#1c1a19', '#8a847e'));
out('img/logo/logo-light.svg', logo('#ffffff', '#cfcac4'));

out('favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#d9d5d0"/><rect x="8" y="8" width="48" height="48" fill="none" stroke="#57524d" stroke-width="6" stroke-dasharray="8 6"/></svg>
`);
out('favicon.ico', ico(png(32, 32), 32));
out('apple-touch-icon.png', png(180, 180));
out('icon-192.png', png(192, 192));
out('icon-512.png', png(512, 512));
out('img/og/og-default.png', png(1200, 630));
