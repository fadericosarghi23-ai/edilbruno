/**
 * Team. L'id è l'ancora in /studio/#<id> e il riferimento "referente" nei progetti.
 * EDILBRUNO è una ditta individuale: un solo titolare. Nessuna informazione personale inventata:
 * solo nome e ruolo dal mapping. [[DA COMPILARE: presentazione del titolare scritta con lui (campo bio)]]
 *
 * Foto: non ancora arrivata. Al suo posto un SEGNAPOSTO dichiarato (public/img/team/titolare-segnaposto.svg):
 * sagoma generica a tratto, senza volto, con la scritta "Foto del titolare · in arrivo", nelle stesse
 * misure del riquadro (2000×3020) così il layout non cambia. fotoSegnaposto = true lo tiene fuori dal JSON-LD.
 * [[DA COMPILARE: foto del titolare o della squadra — sostituire src/width/height/alt e togliere fotoSegnaposto]]
 */
import type { Img } from '../lib/media';

/** bio: presentazione resa sotto il ruolo in /studio/. fotoSegnaposto: la foto non è ancora quella vera */
export type Membro = { id: string; nome: string; ruolo: string; foto: Img; bio?: string; fotoSegnaposto?: boolean };

export const team: Membro[] = [
  {
    id: 'bruno-onofrio-michael',
    nome: 'Bruno Onofrio Michael',
    ruolo: 'Titolare',
    foto: { src: '/img/team/titolare-segnaposto.svg', width: 2000, height: 3020, alt: 'Spazio per la foto del titolare: in arrivo' },
    fotoSegnaposto: true,
  },
];

export const membro = (id: string) => team.find((m) => m.id === id);
