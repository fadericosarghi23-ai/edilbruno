/**
 * Genera in build un SVG grigio per ogni immagine-segnaposto registrata con ph():
 * stesse misure dell'originale, con scritto cosa rappresenta e la misura da rispettare.
 * Quando si sostituisce un'immagine con la foto vera, questo file non va toccato:
 * il segnaposto sparisce da solo quando nessun dato lo usa più.
 */
import type { APIRoute } from 'astro';
import { placeholders } from '../../../lib/media';
// importati per registrare tutti i segnaposto
import '../../../data/progetti';
import '../../../data/team';
import '../../../data/contenuti';

placeholders.set('mappa', { width: 1200, height: 900, label: 'MAPPA · EMBED DA COLLEGARE' });

export function getStaticPaths() {
  return [...placeholders.keys()].map((id) => ({ params: { id } }));
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export const GET: APIRoute = ({ params }) => {
  const p = placeholders.get(params.id!)!;
  const { width: w, height: h } = p;
  const fs = Math.max(14, Math.round(Math.min(w, h * 1.6) / 22));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<rect width="${w}" height="${h}" fill="#d9d5d0"/>
<path d="M0 0L${w} ${h}M${w} 0L0 ${h}" stroke="#c6c1bb" stroke-width="${Math.max(1, Math.round(fs / 10))}"/>
<rect x="${fs / 2}" y="${fs / 2}" width="${w - fs}" height="${h - fs}" fill="none" stroke="#b5afa8" stroke-width="${Math.max(1, Math.round(fs / 12))}" stroke-dasharray="${fs / 2} ${fs / 3}"/>
<g font-family="Inter, Arial, sans-serif" text-anchor="middle" fill="#57524d">
<text x="${w / 2}" y="${h / 2 - fs * 0.3}" font-size="${fs}" font-weight="700" letter-spacing="1">${esc(p.label)}</text>
<text x="${w / 2}" y="${h / 2 + fs * 1.1}" font-size="${Math.round(fs * 0.8)}">${w} × ${h} px · da sostituire</text>
</g>
</svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
