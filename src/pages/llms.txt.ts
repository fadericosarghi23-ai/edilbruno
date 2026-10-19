/** llms.txt generato dai dati: nessun testo da tenere allineato a mano. */
import type { APIRoute } from 'astro';
import { site, abs } from '../data/site';
import { pulito } from '../lib/bozza';
import { servizi } from '../data/servizi';
import { team } from '../data/team';
import { categorie, inCategoria, progetti } from '../data/progetti';

export const GET: APIRoute = () => {
  const righe = [
    `# ${site.nome}`,
    '',
    `> ${site.descrizione}`,
    '',
    '## Dati principali',
    '',
    `- Nome: ${site.ragioneSociale || site.nome}`,
    `- Sito: ${abs('/')}`,
    `- Sede: ${site.indirizzo.via}, ${site.indirizzo.cap} ${site.indirizzo.citta} (${site.indirizzo.provincia}), ${site.indirizzo.paeseNome}`,
    `- Zona di lavoro: ${site.zona}`,
    ...(site.telefono ? [`- Telefono: ${site.telefono}`] : []),
    `- Email: ${site.email}`,
    ...(site.piva ? [`- P.IVA: ${site.piva}`] : []),
    ...site.social.map((s) => `- ${s.nome}: ${s.url}`),
    `- Titolare: ${team.map((m) => `${m.nome} (${m.ruolo})`).join(', ')}`,
    `- Lavori: ${progetti.length} lavori documentati`,
    '',
    '## Pagine principali',
    '',
    `- [Home](${abs('/')}): presentazione dell'impresa, servizi, lavori in evidenza e contatti.`,
    `- [L'impresa](${abs('/studio/')}): chi siamo, il titolare e il modo di lavorare.`,
    `- [Servizi](${abs('/servizi/')}): i lavori che l'impresa esegue.`,
    `- [Lavori](${abs('/progetti/')}): tutti i lavori, filtrabili per categoria.`,
    `- [Contatti](${abs('/contatti/')}): telefono, email, sede, mappa e modulo di contatto.`,
    '',
    '## Servizi',
    '',
    ...servizi.map((s) => `- [${s.nome}](${abs(`/servizi/#${s.id}`)}): ${s.breve}`),
    ...categorie.flatMap((c) => ['', `## Lavori — ${c.nome}`, '', ...inCategoria(c.id).map((p) => `- [${p.titolo}](${abs(`/progetti/${p.slug}/`)}): ${p.intervento}. ${p.luogo}.${p.importo ? ` Importo lavori: ${p.importo}.` : ''}`)]),
    '',
  ];
  return new Response(pulito(righe.join('\n')), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
