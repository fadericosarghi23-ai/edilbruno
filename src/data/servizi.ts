/**
 * SERVIZI (6). Usati in: home (griglia 3x2), /servizi/ (una sezione per servizio,
 * alternate), footer, mappa del sito, select del form contatti, JSON-LD.
 * id = ancora in /servizi/#<id>.
 * foto = lavoro la cui copertina illustra il servizio ("Nella foto: ...").
 * correlati = 3 lavori elencati sotto, categoria = pagina dei lavori collegata.
 *
 * EDILBRUNO: i nomi dei primi 4 e la descrizione delle piccole ristrutturazioni sono VERI (mapping).
 * Tutto il resto è inventato per la bozza (ex()): descrizioni, paragrafi, elenchi e i servizi
 * 5 e 6, scelti tra quelli che il mapping suggerisce di chiedere (bagni, esterni).
 * [[DA COMPILARE: descrizioni reali dei servizi ed eventuali servizi aggiuntivi]]
 */
import type { Icona } from './icone';
import type { CategoriaId } from './progetti';
import { ex } from '../lib/bozza';

export type Servizio = {
  id: string;
  nome: string;
  breve: string;
  icona: Icona;
  paragrafi: [string, string];
  punti: string[];
  foto: string;
  correlati: string[];
  categoria: CategoriaId;
};

const ps = (a: string, b: string): [string, string] => [ex(a), ex(b)];

export const servizi: Servizio[] = [
  {
    id: 'ristrutturazioni',
    nome: 'Piccole ristrutturazioni',
    breve: 'Interventi rapidi e su misura per abitazioni e locali.',
    icona: 'divano',
    paragrafi: ps(
      'Appartamenti, case e piccoli locali: demolizioni, nuove tramezze, intonaci, pavimenti e finiture, coordinati da un unico referente.',
      'Si parte da un sopralluogo e da un preventivo scritto, con tempi e costi chiari prima di aprire il cantiere.',
    ),
    punti: ['Sopralluogo e preventivo scritto', 'Demolizioni e smaltimento macerie', 'Nuove tramezze e aperture', 'Intonaci e rasature', 'Pavimenti e rivestimenti', 'Tinteggiatura finale'].map(ex),
    foto: 'bilocale-gallarate', correlati: ['bilocale-gallarate', 'cucina-cardano', 'bagno-busto-arsizio'], categoria: 'cat-1',
  },
  {
    id: 'muratura',
    nome: 'Lavori di muratura',
    breve: ex('Muri, tramezze, aperture e ripristini in mattoni o blocchi, per case, cortili e spazi artigianali.'),
    icona: 'telaio',
    paragrafi: ps(
      'Murature nuove e riparazioni: tramezze interne, muri divisori, muretti di recinzione e aperture con architrave.',
      'Lavoro pulito anche con la casa abitata o l’attività aperta, organizzando il cantiere per zone.',
    ),
    punti: ['Muri e tramezze in laterizio', 'Aperture con architrave', 'Muretti di recinzione', 'Ripristino di murature danneggiate', 'Muri in mattoni a vista', 'Piccole opere in cemento'].map(ex),
    foto: 'muratura-gallarate', correlati: ['muratura-gallarate', 'cucina-cardano', 'cortile-somma'], categoria: 'cat-3',
  },
  {
    id: 'piastrelle-pavimenti',
    nome: 'Posa piastrelle e pavimentazioni interne',
    breve: ex('Gres, ceramica e piastrelle per pavimenti e rivestimenti, con piani precisi e fughe regolari.'),
    icona: 'pianta',
    paragrafi: ps(
      'Posa di pavimenti e rivestimenti in gres porcellanato e ceramica, anche in grande formato, per bagni, cucine e intere abitazioni.',
      'Prima di posare si controlla il fondo; dopo, stuccature, battiscopa e profili per un lavoro finito.',
    ),
    punti: ['Gres porcellanato anche grande formato', 'Rivestimenti di bagni e cucine', 'Battiscopa e profili', 'Controllo e livellamento del fondo', 'Stuccature e sigillature'].map(ex),
    foto: 'pavimento-samarate', correlati: ['pavimento-samarate', 'rivestimento-cassano', 'bagno-busto-arsizio'], categoria: 'cat-2',
  },
  {
    id: 'completamento',
    nome: 'Lavori di completamento',
    breve: ex('Intonaci, rasature, cartongesso, tinteggiature e piccoli lavori: quello che serve per chiudere bene un lavoro.'),
    icona: 'casco',
    paragrafi: ps(
      'Finiture e lavori da tuttofare in casa e negli uffici: intonaci, rasature, contropareti, controsoffitti e tinteggiature.',
      'Anche i piccoli interventi hanno un preventivo chiaro e una data di fine concordata.',
    ),
    punti: ['Intonaci e rasature a gesso', 'Contropareti e controsoffitti in cartongesso', 'Tinteggiature interne', 'Piccole riparazioni in casa', 'Sistemazioni prima di un trasloco'].map(ex),
    foto: 'intonaci-castellanza', correlati: ['intonaci-castellanza', 'cartongesso-busto', 'bilocale-gallarate'], categoria: 'cat-3',
  },
  {
    id: 'bagni',
    nome: ex('Rifacimento bagni'),
    breve: ex('Bagni rifatti da zero o rinnovati: rivestimenti, piatto doccia, sanitari e finiture, con un solo referente.'),
    icona: 'treppiede',
    paragrafi: ps(
      'Dalla rimozione dei vecchi rivestimenti alla posa dei sanitari, coordinando idraulico ed elettricista.',
      'Tempi brevi e casa abitabile: il bagno resta fuori uso solo per i giorni strettamente necessari.',
    ),
    punti: ['Rimozione dei vecchi rivestimenti', 'Piatto doccia filo pavimento', 'Piastrelle a parete e a pavimento', 'Montaggio dei sanitari', 'Coordinamento con gli impiantisti'].map(ex),
    foto: 'bagno-busto-arsizio', correlati: ['bagno-busto-arsizio', 'rivestimento-cassano', 'bilocale-gallarate'], categoria: 'cat-1',
  },
  {
    id: 'esterni',
    nome: ex('Pavimentazioni esterne'),
    breve: ex('Cortili, vialetti e terrazzi: sottofondi, pendenze e posa di masselli, gres da esterno o pietra.'),
    icona: 'ponte',
    paragrafi: ps(
      'Rifacimento di cortili, vialetti e terrazzi, con sottofondo drenante e pendenze studiate per lo scolo dell’acqua.',
      'Materiali scelti insieme al cliente in base all’uso: passaggio di auto, giardino o terrazzo.',
    ),
    punti: ['Sottofondi drenanti', 'Masselli autobloccanti', 'Gres da esterno', 'Pendenze e scolo dell’acqua', 'Cordoli e bordure'].map(ex),
    foto: 'cortile-somma', correlati: ['cortile-somma', 'pavimento-samarate', 'muratura-gallarate'], categoria: 'cat-2',
  },
];
