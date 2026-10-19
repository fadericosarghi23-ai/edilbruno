// Scarica le FOTO D'ESEMPIO della bozza da Unsplash (licenza Unsplash: uso libero, anche commerciale)
// nel formato immagini della base: public/img/lavori/<slug>/<slug>-NN-<w>.<avif|webp|jpg>,
// larghezze 480/800/1200/1600/2000. Scrive src/data/immagini.json (misure reali, src = jpg da 1200).
// Uso: node scripts/foto-unsplash.mjs   (idempotente: salta i file già scaricati)
//
// Sono foto d'esempio, NON lavori di EDILBRUNO: vanno sostituite con le foto vere dei lavori.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const W = [480, 800, 1200, 1600, 2000];

// slug del lavoro d'esempio -> id foto Unsplash (la prima è la copertina)
const FOTO = {
  'bilocale-gallarate': ['1634586648651-f1fb9ec10d90', '1517581177682-a085bb7ffb15', '1656122381069-9ec666d95cf1', '1560185127-6ed189bf02f4'],
  'bagno-busto-arsizio': ['1782805153002-96e099970a9d', '1721394745970-aba71c96836d', '1523413555809-0fb1d4da238d', '1564540579594-0930edb6de43'],
  'cucina-cardano': ['1618832515490-e181c4794a45', '1565183928294-7063f23ce0f8', '1601760561441-16420502c7e0'],
  'pavimento-samarate': ['1747729495579-b26ab7b9c3a6', '1656646523907-97b094c7e63a', '1636200534256-c08268363482', '1610449333145-b0e3538ffe1d'],
  'rivestimento-cassano': ['1523413307857-ef24c53571ae', '1523413363574-c30aa1c2a516', '1614598632980-35ee54daa5b9', '1662624914003-9bb2095ca7a0'],
  'cortile-somma': ['1753893558304-8b1b4b47348c', '1747729495643-2c5cc5c9e2c1', '1630180799448-f58750c61184'],
  'muratura-gallarate': ['1704005445445-2747074be8ac', '1701850009190-2859ba2aeea6', '1734079692087-91bac04efcd1', '1592795694703-24f1814cfb0a'],
  'intonaci-castellanza': ['1768839725085-829e6ac7ac26', '1733431772808-82d878e59000', '1639430257115-f63af9eab97d', '1541323429887-2e393b8db71c'],
  'cartongesso-busto': ['1768321914149-5a6428ec2f82', '1768321916886-30dc323bddf7', '1770838773417-08b18661c62f', '1599619585752-c3edb42a414c'],
};
// Nessuna foto per il titolare: nel sito c'è un riquadro vuoto (public/img/team/titolare-vuota.svg).

/** misure di un JPEG leggendo il marcatore SOF */
function jpegSize(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const m = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  throw new Error('SOF non trovato');
}

async function scarica(url, file) {
  if (fs.existsSync(file) && fs.statSync(file).size > 0) return fs.readFileSync(file);
  for (let t = 0; t < 3; t++) {
    const r = await fetch(url);
    if (r.ok) { const b = Buffer.from(await r.arrayBuffer()); fs.writeFileSync(file, b); return b; }
    await new Promise((s) => setTimeout(s, 1000));
  }
  throw new Error('download fallito: ' + url);
}

/** scarica una foto in tutte le varianti e ne restituisce le misure */
async function foto(id, dir, stem, pub) {
  fs.mkdirSync(dir, { recursive: true });
  const base = `https://images.unsplash.com/photo-${id}?auto=format&fit=max&q=78`;
  // la variante più grande dà le misure (proporzioni originali)
  let big = path.join(dir, `${stem}-2000.jpg`);
  const esistente = fs.readdirSync(dir).find((f) => f.startsWith(stem + '-') && f.endsWith('.jpg') && Number(f.slice(stem.length + 1, -4)) > 1600);
  if (esistente) big = path.join(dir, esistente);
  const buf = await scarica(`${base}&w=2000&fm=jpg`, big);
  const { width, height } = jpegSize(buf);
  const widths = W.filter((w) => w < width).concat([Math.min(width, 2000)]);
  if (width < 2000 && big.endsWith('-2000.jpg')) fs.renameSync(big, path.join(dir, `${stem}-${width}.jpg`));
  await Promise.all(widths.flatMap((w) => ['jpg', 'webp', 'avif'].map((fm) => scarica(`${base}&w=${w}&fm=${fm}`, path.join(dir, `${stem}-${w}.${fm}`)))));
  const src1200 = widths.includes(1200) ? 1200 : widths.filter((w) => w < 1200).pop();
  return { src: `${pub}/${stem}-${src1200}.jpg`, width, height, widths, unsplash: id };
}

const progetti = {};
for (const [slug, ids] of Object.entries(FOTO)) {
  progetti[slug] = [];
  for (const [k, id] of ids.entries()) {
    const stem = `${slug}-${String(k + 1).padStart(2, '0')}`;
    const f = await foto(id, path.join(ROOT, 'public/img/lavori', slug), stem, `/img/lavori/${slug}`);
    progetti[slug].push({ ...f, drawing: false });
    console.log(slug, k + 1, `${f.width}x${f.height}`);
  }
}

fs.writeFileSync(
  path.join(ROOT, 'src/data/immagini.json'),
  JSON.stringify({ _nota: 'Foto d’esempio da Unsplash (scripts/foto-unsplash.mjs): NON sono lavori di EDILBRUNO, sostituire con le foto vere.', progetti }, null, 1) + '\n',
);
console.log('scritto src/data/immagini.json');
