/**
 * LAVORI (rotta /progetti/ della base). 3 categorie e i lavori. Ogni lavoro genera
 * /progetti/<slug>/, entra nella pagina della sua categoria e nella mappa del sito.
 *
 * BOZZA: i 9 lavori sono ESEMPI inventati, coerenti con i servizi verificati di EDILBRUNO
 * (luoghi nei comuni intorno a Gallarate). Testi marcati con ex(), foto d'esempio da Unsplash
 * (src/data/immagini.json, scripts/foto-unsplash.mjs). Le schede mostrano la nota "Lavoro d'esempio".
 * [[DA COMPILARE: 3-4 lavori veri con foto, titolo, luogo, anno e descrizione]]
 */
import type { Img } from '../lib/media';
import { ex } from '../lib/bozza';
import immagini from './immagini.json';

export type CategoriaId = 'cat-1' | 'cat-2' | 'cat-3';

export type Categoria = {
  id: CategoriaId;
  /** slug della pagina /progetti/<slug>/ */
  slug: string;
  /** nome completo (filtri, breadcrumb, eyebrow) */
  nome: string;
  /** etichetta corta sul badge della card */
  etichetta: string;
  /** testo introduttivo della pagina categoria */
  intro: string;
  title: string;
  description: string;
};

export const categorie: Categoria[] = [
  {
    id: 'cat-1',
    slug: 'ristrutturazioni',
    nome: 'Ristrutturazioni',
    etichetta: 'Ristrutturazione',
    intro: ex('Appartamenti, bagni e cucine rinnovati tra Gallarate e Busto Arsizio: dalle demolizioni alle finiture, con un solo referente per tutto il cantiere.'),
    title: 'Ristrutturazioni | EDILBRUNO, impresa edile a Gallarate',
    description: ex('Piccole ristrutturazioni di appartamenti, bagni e cucine a Gallarate e dintorni: demolizioni, murature, pavimenti e finiture con un solo referente.'),
  },
  {
    id: 'cat-2',
    slug: 'pavimenti-rivestimenti',
    nome: 'Pavimenti e rivestimenti',
    etichetta: 'Pavimenti',
    intro: ex('Gres, ceramica e masselli per interni ed esterni: piani precisi, fughe regolari e tagli curati anche negli angoli più difficili.'),
    title: 'Pavimenti e rivestimenti | EDILBRUNO, Gallarate',
    description: ex('Posa di piastrelle, gres porcellanato e pavimentazioni interne ed esterne a Gallarate e nei comuni vicini.'),
  },
  {
    id: 'cat-3',
    slug: 'muratura-completamenti',
    nome: 'Muratura e completamenti',
    etichetta: 'Muratura',
    intro: ex('Muri, tramezze, intonaci, cartongesso e tinteggiature: i lavori che chiudono un cantiere o sistemano una casa senza rifarla da capo.'),
    title: 'Muratura e completamenti | EDILBRUNO, Gallarate',
    description: ex('Lavori di muratura, intonaci, cartongesso e finiture a Gallarate e dintorni: muri, tramezze, rasature e tinteggiature.'),
  },
];

export const categoria = (id: CategoriaId) => categorie.find((c) => c.id === id)!;

export type Progetto = {
  slug: string;
  titolo: string;
  luogo: string;
  /** categoria principale (badge) */
  categoria: CategoriaId;
  /** tutte le categorie in cui compare (filtri) */
  categorie: CategoriaId[];
  intervento: string;
  progettisti?: string[];
  importo?: string;
  temi: string[];
  /** id del membro del team referente (src/data/team.ts); vuoto = riga nascosta */
  referente: string;
  paragrafi: string[];
  immagini: Img[];
  /** lavoro d'esempio della bozza (nota nella scheda) */
  esempio?: boolean;
};

type Foto = { src: string; width: number; height: number; widths: number[]; drawing: boolean };
const foto = immagini.progetti as Record<string, Foto[]>;

const imgs = (slug: string, titolo: string, luogo: string): Img[] =>
  (foto[slug] ?? []).map((f, k) => ({
    src: f.src,
    width: f.width,
    height: f.height,
    widths: f.widths,
    responsive: true,
    alt: `Foto d’esempio ${k + 1}: ${titolo}, ${luogo}`,
  }));

type Riga = [
  slug: string,
  cat: CategoriaId,
  titolo: string,
  luogo: string,
  anno: string,
  contesto: string,
  tipologia: string,
  paragrafi: string[],
];

// Lavori d'esempio (inventati): tutti i testi passano da ex() qui sotto.
const R: Riga[] = [
  ['bilocale-gallarate', 'cat-1', 'Bilocale in centro', 'Gallarate (VA)', '2024', 'Appartamento privato', 'Ristrutturazione completa', [
    'Ristrutturazione di un bilocale di 55 m²: demolizioni, nuove tramezze, tracce per gli impianti, intonaci, pavimenti in gres e tinteggiatura.',
    'Il cantiere è durato sette settimane, con le macerie portate via ogni sera e la casa consegnata pulita.',
  ]],
  ['bagno-busto-arsizio', 'cat-1', 'Bagno rifatto da zero', 'Busto Arsizio (VA)', '2025', 'Casa unifamiliare', 'Rifacimento bagno', [
    'Rimozione dei vecchi rivestimenti, piatto doccia filo pavimento, nuove piastrelle a parete e a pavimento e montaggio dei sanitari sospesi.',
    'Lavoro concluso in dieci giorni lavorativi, coordinando idraulico ed elettricista.',
  ]],
  ['cucina-cardano', 'cat-1', 'Cucina aperta sul soggiorno', 'Cardano al Campo (VA)', '2024', 'Appartamento privato', 'Piccola ristrutturazione', [
    'Apertura del muro tra cucina e soggiorno con architrave, ripristino delle murature e rasatura delle pareti prima della posa dei nuovi mobili.',
  ]],
  ['pavimento-samarate', 'cat-2', 'Pavimento in gres', 'Samarate (VA)', '2025', 'Villetta', 'Posa pavimenti', [
    'Posa di 90 m² di gres porcellanato effetto pietra su massetto esistente, con battiscopa coordinato e fughe sottili.',
    'Prima della posa il massetto è stato controllato e livellato dove serviva.',
  ]],
  ['rivestimento-cassano', 'cat-2', 'Rivestimento del bagno', 'Cassano Magnago (VA)', '2024', 'Appartamento privato', 'Posa rivestimenti', [
    'Nuovo rivestimento in piastrelle bianche per un bagno di servizio, con profili in alluminio sugli spigoli e stuccatura antimuffa.',
  ]],
  ['cortile-somma', 'cat-2', 'Cortile pavimentato', 'Somma Lombardo (VA)', '2023', 'Casa unifamiliare', 'Pavimentazione esterna', [
    'Rifacimento della pavimentazione di un cortile: rimozione del vecchio fondo, sottofondo drenante e posa di masselli con le pendenze per lo scolo dell’acqua.',
  ]],
  ['muratura-gallarate', 'cat-3', 'Muro divisorio in mattoni', 'Gallarate (VA)', '2024', 'Laboratorio artigianale', 'Lavori di muratura', [
    'Costruzione di un muro in mattoni pieni per separare il magazzino dall’area di lavoro, con architravi sulle aperture e finitura a vista.',
    'Il laboratorio è rimasto aperto durante i lavori, organizzati per zone.',
  ]],
  ['intonaci-castellanza', 'cat-3', 'Intonaci e rasature', 'Castellanza (VA)', '2025', 'Appartamento privato', 'Lavori di completamento', [
    'Ripristino degli intonaci rovinati dall’umidità, rasatura a gesso di tutte le pareti e tinteggiatura finale di un appartamento di tre locali.',
  ]],
  ['cartongesso-busto', 'cat-3', 'Contropareti e finiture', 'Busto Arsizio (VA)', '2023', 'Piccolo ufficio', 'Lavori di completamento', [
    'Contropareti e controsoffitto in cartongesso per un piccolo ufficio, con stuccatura dei giunti, tinteggiatura e piccoli lavori di finitura.',
  ]],
];

export const progetti: Progetto[] = R.map(([slug, cat, titolo, luogo, anno, contesto, tipologia, paragrafi]) => ({
  slug,
  titolo: ex(titolo),
  luogo: ex(luogo),
  categoria: cat,
  categorie: [cat],
  intervento: ex(`${tipologia} · ${contesto}`),
  temi: [ex(anno), ex(tipologia)],
  referente: 'bruno-onofrio-michael',
  paragrafi: paragrafi.map(ex),
  immagini: imgs(slug, titolo, luogo),
  esempio: true,
}));

export const progetto = (slug: string) => progetti.find((p) => p.slug === slug)!;
export const copertina = (p: Progetto) => p.immagini[0];
export const inCategoria = (id: CategoriaId) => progetti.filter((p) => p.categorie.includes(id));
