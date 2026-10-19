/**
 * Meccanismo immagini della base.
 *
 * Ogni immagine è un oggetto `Img` con width/height INTRINSECI (servono a layout,
 * aspect-ratio della gallery a colonne e classi tall/wide).
 *
 * - Segnaposto: `ph(id, w, h, etichetta)` registra un SVG grigio delle stesse misure,
 *   generato in build da src/pages/img/placeholder/[id].svg.ts → /img/placeholder/<id>.svg
 * - Foto vera, file singolo: { src: '/img/...jpg', width, height, alt }
 * - Foto vera con varianti (come il sito sorgente): metti in public/ i file
 *   <stem>-<w>.avif/.webp/.jpg per ogni larghezza e usa { ..., responsive: true }.
 *   src deve essere la variante jpg da 1200 (o la più grande sotto i 1200):
 *   es. '/img/progetti/casa/casa-01-1200.jpg'. Picture.astro genera i <source>.
 */

export type Img = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** disegno/render tecnico: niente crop (classe drawing / is-drawing) */
  drawing?: boolean;
  /** true = esistono le varianti <stem>-<w>.avif/.webp/.jpg */
  responsive?: boolean;
  /** larghezze delle varianti (default 480/800/1200/1600/2400 fino alla larghezza intrinseca) */
  widths?: number[];
};

type Ph = { width: number; height: number; label: string };
export const placeholders = new Map<string, Ph>();

/** Segnaposto delle stesse misure dell'originale. L'alt resta "DA COMPILARE: ..." */
export function ph(id: string, width: number, height: number, label: string, opts: { drawing?: boolean; alt?: string } = {}): Img {
  placeholders.set(id, { width, height, label });
  return {
    src: `/img/placeholder/${id}.svg`,
    width,
    height,
    alt: `DA COMPILARE: ${opts.alt ?? label.toLowerCase()}`,
    drawing: opts.drawing,
  };
}

const STD = [480, 800, 1200, 1600, 2400];

export function variants(img: Img) {
  if (!img.responsive) return null;
  const m = img.src.match(/^(.*)-\d+\.(?:jpe?g|png)$/);
  if (!m) return null;
  const stem = m[1];
  const max = Math.min(img.width, 2400);
  const widths = img.widths ?? [...STD.filter((w) => w < max), max];
  const set = (ext: string) => widths.map((w) => `${stem}-${w}.${ext} ${w}w`).join(', ');
  return { avif: set('avif'), webp: set('webp'), full: `${stem}-${widths[widths.length - 1]}.webp`, small: `${stem}-${widths[0]}.webp` };
}

/** Immagine grande per la lightbox (data-full) */
export const fullSrc = (img: Img) => variants(img)?.full ?? img.src;
/** Miniatura (es. referente nella scheda progetto) */
export const smallSrc = (img: Img) => variants(img)?.small ?? img.src;

/** Classe della figura in gallery: stessa regola del sito sorgente */
export function galleryClass(img: Img) {
  const r = img.width / img.height;
  if (img.drawing) return r < 0.9 ? 'tall drawing' : 'wide drawing';
  if (r < 0.9) return 'tall';
  if (r >= 1.6) return 'wide';
  return '';
}
