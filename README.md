# EDILBRUNO — sito (bozza dimostrativa)

Impresa edile individuale di Bruno Onofrio Michael, Gallarate (VA). Il sito è un clone della base
riutilizzabile per studi di architettura (base svuotata con segnaposto), riempito con la mappa
`CONTENT_FILL.md` (nella root). È **in italiano** ed è **completo**, ma solo i dati del mapping sono veri:
tutto il resto è **inventato** per mostrare il sito al cliente, e a schermo si vede.

```bash
npm install
npm run dev            # http://localhost:4870
npm run build          # dist/ statico
npm run check-residui  # residui dei clienti delle basi precedenti: deve dare 0
node scripts/foto-unsplash.mjs   # riscarica le foto d'esempio (idempotente)
node scripts/marchio.mjs         # rigenera logo, favicon, icone e OG provvisori
py -3 scripts/pdf-report.py      # PDF di consegna (4 pagine): docs/palette-e-interventi.pdf
```

> Non usare `npm run placeholders`: riporterebbe logo e icone ai segnaposto grigi.

## Bozza: come si riconosce cosa è inventato

`BOZZA = true` in `src/lib/bozza.ts`. Finché resta così:

- **etichetta gialla fissa** su ogni pagina: "Bozza dimostrativa · foto, logo e colori sono d’esempio,
  molti testi sono inventati · email e modulo non sono attivi";
- nell'etichetta c'è il pulsante **"Mostra testi inventati"**: accende e spegne la sottolineatura gialla
  (ondulata) di tutti i testi inventati. Parte spento (`EVIDENZIA = false` in `src/lib/bozza.ts`) e il
  browser ricorda la scelta. Nel codice ogni testo inventato passa da `ex('…')`: cerca `ex(` in `src/` (75);
- ogni scheda lavoro ha la nota **"Lavoro d’esempio"**;
- `noindex` su tutte le pagine e `robots.txt` che blocca i motori.

Con `BOZZA = false` spariscono etichetta, note, noindex e blocco: i testi restano.
Prima di farlo vanno sostituiti tutti i testi `ex()` con quelli veri.

## Vero (dal mapping)

Nome EDILBRUNO, denominazione "EDILBRUNO di Bruno Onofrio Michael", titolare Bruno Onofrio Michael
(ruolo: titolare), Gallarate (VA), P.IVA 04128290121, telefono +39 378 427 0606, i 4 servizi
(Piccole ristrutturazioni, Lavori di muratura, Posa piastrelle e pavimentazioni interne, Lavori di
completamento), la descrizione "Interventi rapidi e su misura per abitazioni e locali", i valori
dichiarati online (Precisione, Cura dei dettagli, Affidabilità). CAP 21013 e la mappa sul centro di
Gallarate sono dati pubblici della città.

Da confermare (`[[DA VALIDARE]]` nel codice): telefono (unica fonte Mani Fidate), forma giuridica,
raggio d’azione, i valori, la frase di descrizione composta con i dati veri.

## Inventato (marcato con ex() nel codice)

- Hero, titoli e sottotitoli di sezione, presentazione dell’impresa, CTA.
- Numeri inventati: referente unico, 30 km di raggio, 48 h per un sopralluogo, 100% preventivi scritti.
  Quelli veri: provincia (VA), 4 servizi principali, 1 sede a Gallarate.
- Descrizioni, paragrafi ed elenchi dei servizi; i servizi 5 e 6 (Rifacimento bagni, Pavimentazioni
  esterne), presi dai suggerimenti del mapping.
- I **9 lavori** (`src/data/progetti.ts`): titoli, luoghi, anni, testi. Luoghi nei comuni vicini a Gallarate.
- Slogan, frase del footer, orari, "Sopralluoghi su appuntamento" al posto della via.
- Testi delle 3 categorie dei lavori.

## D’esempio (dichiarato nell’etichetta)

- **Foto**: 34 da Unsplash (licenza Unsplash, uso libero anche commerciale), elenco degli id in
  `scripts/foto-unsplash.mjs` e in `src/data/immagini.json`. **Non sono lavori di EDILBRUNO.**
  Alt "Foto d’esempio". Nessuna foto per il titolare: riquadro vuoto (`public/img/team/titolare-vuota.svg`).
- **Logo e icone provvisori** (`scripts/marchio.mjs`): mattoni a tratto + "EDILBRUNO". Immagine OG con foto d’esempio.
- **Palette provvisoria** (`src/styles/global.css`): neutri caldi + rosso mattone `#8a3a1f` (contrasti nel commento).

## Titolare: niente informazioni personali inventate

Del titolare il sito dice solo quello che c’è nel mapping: nome, ruolo (titolare), impresa individuale con sede
a Gallarate. Nessuna bio, nessun anno di esperienza, nessuna frase su cosa fa di persona: vanno scritti con lui
(campo `bio` in `src/data/team.ts`, numeri in `src/data/contenuti.ts`). Al posto del ritratto c’è un riquadro vuoto delle stesse misure.

## Finti di proposito (non si inventano recapiti reali)

Email `bozza@example.com`, dominio `example.com`, modulo non collegato (dice che il sito è in bozza),
Instagram nascosto (il mapping dubita che @edilbruno sia suo). Attenzione: edilbruno.it è di un’altra
azienda (Capaccio Paestum, SA).

## Intro col logo

All’apertura (solo la prima pagina della visita) i 7 mattoni del marchio si posano dal basso verso l’alto,
compaiono “EDILBRUNO” e “Impresa edile · Gallarate”, poi il pannello sale e scopre la pagina: circa 2,8 s.
`src/components/Intro.astro` + stili in coda a `global.css`; la classe `html.intro-on` la mette lo script in
`<head>` di `Layout.astro` (sessionStorage). Saltata con “riduci animazioni” e senza JavaScript. Col logo vero
va cambiato il segno in `Intro.astro`.

## Rispetto alla base

Tolti seconda sede, pagina premi (`/metodo/`, `ProcessCards`), "dove lavoriamo", collaboratori, secondo
fondatore. Interfaccia in italiano. Lavori: 9 invece dei 32 slot della base. Ragione sociale e P.IVA nel
footer. Struttura, layout, tipografia e animazioni invariati.
