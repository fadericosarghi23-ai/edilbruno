import type { APIRoute } from 'astro';
import { site } from '../data/site';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: site.nome,
        short_name: site.nome,
        description: `${site.attivita} a ${site.indirizzo.citta} (${site.indirizzo.provincia})`,
        lang: 'it',
        start_url: '/',
        display: 'browser',
        background_color: '#ffffff',
        theme_color: site.themeColor,
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
