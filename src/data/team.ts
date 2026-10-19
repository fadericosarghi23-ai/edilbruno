/**
 * Team. L'id è l'ancora in /studio/#<id> e il riferimento "referente" nei progetti.
 * EDILBRUNO è una ditta individuale: un solo titolare. Nessuna informazione personale inventata:
 * solo nome e ruolo dal mapping. [[DA COMPILARE: presentazione del titolare scritta con lui (campo bio)]]
 *
 * Foto: nessuna. Al suo posto un riquadro VUOTO (public/img/team/titolare-vuota.svg, colore
 * --grey-light) delle stesse misure, 2000×3020, così il layout non cambia. alt vuoto = riquadro
 * decorativo, e Layout.astro non lo mette nel JSON-LD.
 * [[DA COMPILARE: foto del titolare o della squadra — sostituire src/width/height e mettere l'alt]]
 */
import type { Img } from '../lib/media';

/** bio: presentazione resa sotto il ruolo in /studio/ */
export type Membro = { id: string; nome: string; ruolo: string; foto: Img; bio?: string };

export const team: Membro[] = [
  {
    id: 'bruno-onofrio-michael',
    nome: 'Bruno Onofrio Michael',
    ruolo: 'Titolare',
    foto: { src: '/img/team/titolare-vuota.svg', width: 2000, height: 3020, alt: '' },
  },
];

export const membro = (id: string) => team.find((m) => m.id === id);
