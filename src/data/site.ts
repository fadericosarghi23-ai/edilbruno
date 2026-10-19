/**
 * IDENTITÀ DEL CLIENTE — unico punto da cui header, footer, contatti, JSON-LD,
 * meta, privacy, cookie, robots e llms.txt leggono i dati dell'impresa.
 *
 * EDILBRUNO: dati veri da CONTENT_FILL.md (nome, titolare, città, P.IVA, telefono, servizi).
 * BOZZA DIMOSTRATIVA (src/lib/bozza.ts): i testi inventati passano da ex() e a schermo sono
 * evidenziati; email ed endpoint sono finti per scelta (non si inventano recapiti reali).
 * Attenzione all'omonimia: edilbruno.it (Capaccio Paestum, SA) è un'altra azienda.
 */
import { BOZZA, ex } from '../lib/bozza';

export const site = {
  /** Bozza dimostrativa: etichetta fissa, testi inventati evidenziati, noindex, robots che blocca */
  bozza: BOZZA,
  bozzaTesto: 'Bozza dimostrativa · foto, logo e colori sono d’esempio, molti testi sono inventati · email e modulo non sono attivi',

  /** Nome breve usato ovunque (title, header, footer, JSON-LD) */
  nome: 'EDILBRUNO',
  /** Denominazione completa (JSON-LD legalName, privacy).
   *  [[DA VALIDARE: forma giuridica "ditta individuale" da confermare su visura]] */
  ragioneSociale: 'EDILBRUNO di Bruno Onofrio Michael',
  /** Varianti del nome (JSON-LD alternateName) */
  nomiAlternativi: ['Edilbruno'],
  /** Alt del logo: nome + attività */
  logoAlt: 'EDILBRUNO — impresa edile a Gallarate',
  /** Tipo di attività in 2-4 parole, usato in eyebrow e meta */
  attivita: 'Impresa edile',
  /** Slogan breve (JSON-LD slogan) */
  slogan: ex('Lavori fatti bene, tempi rispettati'),
  /** Descrizione in 1 frase (meta description di default, JSON-LD, llms.txt).
   *  [[DA VALIDARE: frase composta solo con i dati verificati del mapping]] */
  descrizione:
    'EDILBRUNO è l’impresa edile di Bruno Onofrio Michael a Gallarate (VA): piccole ristrutturazioni, lavori di muratura, posa di piastrelle e pavimentazioni interne, lavori di completamento.',
  /** Frase del footer sotto il logo */
  footerClaim: ex('Ristrutturazioni, muratura e posa di pavimenti a Gallarate e nei comuni vicini.'),

  // ── Dominio e tecnici ───────────────────────────────────────────────
  /** Dominio canonico SENZA slash finale. Tenere allineato con SITE_URL in astro.config.mjs */
  dominio: 'https://www.example.com', // [[DA COMPILARE: dominio del cliente (edilbruno.it è di un'altra azienda)]]
  /** Colore della barra del browser: deve coincidere con --accent in global.css */
  themeColor: '#8a3a1f',
  /** Codice ISO regione/provincia per meta geo.region */
  geoRegion: 'IT-VA',

  // ── Contatti ────────────────────────────────────────────────────────
  email: 'bozza@example.com', // [[DA COMPILARE: email dell'impresa]] (finta di proposito)
  /** Telefono come si legge a schermo. [[DA VALIDARE: unica fonte Mani Fidate]] */
  telefono: '+39 378 427 0606',
  /** Telefono per i link tel: in formato E.164 senza spazi */
  telefonoE164: '+393784270606',
  /** PEC: vuota = non resa. [[DA COMPILARE: PEC]] */
  pec: '',
  piva: '04128290121',

  indirizzo: {
    /** [[DA COMPILARE: via e numero civico, se il cliente vuole mostrarli]] */
    via: ex('Sopralluoghi su appuntamento'),
    cap: '21013',
    citta: 'Gallarate',
    provincia: 'VA',
    paese: 'IT',
    /** Paese come si legge a schermo, dopo l'indirizzo */
    paeseNome: 'Italia',
  },
  /** Zona di lavoro (testo libero). [[DA VALIDARE: raggio d'azione da confermare col cliente]] */
  zona: 'Gallarate (VA) e dintorni',
  /** Coordinate per la mappa OpenStreetMap: centro di Gallarate (manca l'indirizzo preciso).
   *  [[DA COMPILARE: coordinate della sede, quando c'è l'indirizzo]] */
  geo: { lat: 45.66, lng: 8.7917 } as null | { lat: number; lng: number },
  /** Link "Apri in Google Maps / Indicazioni stradali" (oggi sulla città: manca l'indirizzo) */
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Gallarate%20VA',
  /** Orari (pagina contatti) */
  ricevimento: ex('Lun–Ven 8:00–18:00 · sabato su appuntamento'),
  /** Lingue in cui l'impresa risponde (JSON-LD ContactPoint) */
  lingue: ['Italiano'],

  /** Social: vuoto = blocco nascosto. icona: 'facebook' | 'instagram' | 'linkedin'.
   *  [[DA VALIDARE: il mapping indica @edilbruno ma chiede se è davvero suo: non pubblicato finché non è confermato]] */
  social: [] as { nome: string; url: string; handle: string; icona: 'facebook' | 'instagram' | 'linkedin' }[],

  /** Aree servite (JSON-LD areaServed, llms.txt) */
  areeServite: [
    { tipo: 'City', nome: 'Gallarate' },
    { tipo: 'AdministrativeArea', nome: 'Provincia di Varese' },
    { tipo: 'Country', nome: 'Italia' },
  ],
  /** Competenze (JSON-LD knowsAbout): i servizi verificati */
  competenze: [
    'Piccole ristrutturazioni',
    'Lavori di muratura',
    'Posa piastrelle e pavimentazioni interne',
    'Lavori di completamento',
  ],

  /** Form contatti. Tutto vuoto = form NON collegato: l'invio è bloccato e non parte nulla.
   *  [[DA COMPILARE: endpoint Formspree del cliente (il mapping prevede Formspree)]] */
  form: {
    netlify: false,
    endpoint: '',
    mailto: '',
  },

  /** Analytics/pixel: nessuno */
  analytics: null as null | string,

  /** Anno per il copyright */
  anno: new Date().getFullYear(),
};

export const indirizzoRiga = `${site.indirizzo.via}, ${site.indirizzo.cap} ${site.indirizzo.citta}`;
export const abs = (p: string) => site.dominio + p;
