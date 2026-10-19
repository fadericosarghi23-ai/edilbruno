/**
 * BOZZA DIMOSTRATIVA.
 *
 * BOZZA = true: il sito mostra un'etichetta fissa "Bozza dimostrativa" con il pulsante
 * "Mostra testi inventati", le pagine sono noindex e robots.txt blocca i motori.
 *
 * ex('testo') marca un testo inventato (non presente nel mapping del cliente): in bozza gli
 * antepone un carattere invisibile che lo script in Layout.astro usa per riconoscerlo; il pulsante
 * dell'etichetta accende e spegne la sottolineatura gialla. Con BOZZA = false esce pulito.
 * Per trovare tutti i testi inventati: cerca "ex(" in src/. I dati veri del mapping (nome,
 * titolare, P.IVA, telefono, città, i 4 servizi) NON passano da ex().
 */
export const BOZZA = true;

/** Stato iniziale del pulsante (poi vale la scelta del visitatore, salvata nel browser) */
export const EVIDENZIA = false;

/** Carattere invisibile che marca i testi inventati (U+2063, separatore invisibile) */
export const SEGNO = '⁣';

export const ex = (s: string) => (BOZZA ? SEGNO + s : s);

/** Toglie il segno (title, meta, attributi) */
export const pulito = (s: string) => s.split(SEGNO).join('');
