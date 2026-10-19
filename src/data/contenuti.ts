/**
 * Contenuti ripetuti o in lista (home, pagina impresa). I testi singoli delle pagine
 * sono scritti direttamente nei file .astro.
 *
 * EDILBRUNO: tolti premi e riconoscimenti (pagina /metodo/), aree di lavoro e collaboratori.
 * BOZZA: numeri, modo di lavorare e CTA sono inventati (ex()).
 */
import { progetto } from './progetti';
import { site } from './site';
import { ex } from '../lib/bozza';

/** Carosello hero della home: 5 slide, ognuna punta a un lavoro (titolo · luogo nella didascalia) */
export const heroSlides = [
  { progetto: 'bilocale-gallarate', foto: 0 },
  { progetto: 'pavimento-samarate', foto: 0 },
  { progetto: 'muratura-gallarate', foto: 0 },
  { progetto: 'bagno-busto-arsizio', foto: 0 },
  { progetto: 'intonaci-castellanza', foto: 0 },
].map(({ progetto: slug, foto }) => {
  const p = progetto(slug);
  return { href: `/progetti/${p.slug}/`, titolo: p.titolo, luogo: p.luogo, img: p.immagini[foto] };
});

/** Lavori nella griglia della home (6) */
export const progettiHome = ['bilocale-gallarate', 'bagno-busto-arsizio', 'pavimento-samarate', 'muratura-gallarate', 'intonaci-castellanza', 'cortile-somma'];

/** Numeri (home: 4 card sotto "L'impresa"). Nessun dato personale inventato (es. anni di esperienza).
 *  [[DA COMPILARE: anni di attività e numeri veri, da chiedere al titolare]] */
export const numeriHome = [
  { n: 'VA', label: 'Provincia di Varese' },
  { n: '4', label: 'Servizi principali' },
  { n: ex('1'), label: ex('Referente unico') },
  { n: ex('30 km'), label: ex('Raggio da Gallarate') },
];

/** Numeri (pagina impresa) */
export const numeriStudio = [
  { n: '4', label: 'Servizi principali' },
  { n: '1', label: 'Sede, a Gallarate' },
  { n: ex('48 h'), label: ex('Per un sopralluogo') },
  { n: ex('100%'), label: ex('Preventivi scritti') },
];

/** Modo di lavorare: 3 punti (pagina impresa).
 *  I tre valori sono quelli dichiarati online dall'impresa; i testi sono inventati.
 *  [[DA VALIDARE: precisione, cura dei dettagli e affidabilità, da far confermare e ampliare]] */
export const approccio = [
  {
    titolo: 'Precisione',
    testo: ex('Misure, livelli e piani controllati prima e dopo ogni posa: un pavimento dritto o un muro a piombo si vedono per anni.'),
  },
  {
    titolo: 'Cura dei dettagli',
    testo: ex('Angoli, tagli, fughe e battiscopa finiti a regola d’arte, e casa lasciata pulita alla fine di ogni giornata.'),
  },
  {
    titolo: 'Affidabilità',
    testo: ex('Preventivo scritto, date concordate e rispettate, e un recapito telefonico diretto per ogni cantiere.'),
  },
];

/** Elenco dei lavori nella sezione "Sede" (pagina impresa): i servizi verificati */
export const competenzeStudio = site.competenze;

/** FAQ: nessuna sezione FAQ in home. */
export const faq: { d: string; r: string }[] = [];
export const FAQ_COL1 = 5;

/** CTA in fondo alle pagine */
export const cta = {
  eyebrow: 'Contatti',
  titolo: ex('Richiedi un preventivo'),
  testo: ex('Raccontaci il lavoro da fare: ti richiamiamo per fissare un sopralluogo e prepariamo un preventivo scritto.'),
};
