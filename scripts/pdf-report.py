# -*- coding: utf-8 -*-
"""
Genera il PDF di consegna di EDILBRUNO: palette, errori corretti, miglioramenti, stato deploy.
Quattro pagine A4, una per parte, con le pastiglie di colore vere accanto ai token.

    py -3 scripts/pdf-report.py

Font: Georgia e Segoe UI di Windows, i più vicini a Newsreader e Inter del sito.
Scrive docs/palette-e-interventi.pdf e una copia sul Desktop (Edilbruno-Report.pdf).
I contrasti sono calcolati qui con la formula WCAG 2.x, non scritti a mano.
"""
import copy
import os
import shutil

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, Frame, KeepTogether, PageBreak, PageTemplate, Paragraph, Spacer, Table, TableStyle

FONTS = "C:/Windows/Fonts/"
pdfmetrics.registerFont(TTFont("Geo", FONTS + "georgia.ttf"))
pdfmetrics.registerFont(TTFont("GeoIt", FONTS + "georgiai.ttf"))
pdfmetrics.registerFont(TTFont("Seg", FONTS + "segoeui.ttf"))
pdfmetrics.registerFont(TTFont("SegB", FONTS + "segoeuib.ttf"))
pdfmetrics.registerFontFamily("Seg", normal="Seg", bold="SegB", italic="Seg", boldItalic="SegB")
pdfmetrics.registerFontFamily("Geo", normal="Geo", bold="Geo", italic="GeoIt", boldItalic="GeoIt")

# palette del sito (src/styles/global.css)
ACCENTO = colors.HexColor("#8a3a1f")
ACCENTO_SCURO = colors.HexColor("#e9a46b")
INK = colors.HexColor("#1e1c1a")
TESTO = colors.HexColor("#262320")
GRIGIO = colors.HexColor("#5f5a54")
SABBIA = colors.HexColor("#f6f2ec")
LINEA = colors.HexColor("#ddd6cd")

QUI = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(QUI)
OUT = os.path.join(ROOT, "docs", "palette-e-interventi.pdf")
DESKTOP = os.path.join(os.path.dirname(os.path.dirname(ROOT)), "Edilbruno-Report.pdf")
TOTALE = [0]


def lum(h):
    h = h.lstrip("#")[:6]
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def contrasto(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True)
    return "%.1f:1" % ((la + 0.05) / (lb + 0.05))


H1 = ParagraphStyle("H1", fontName="Geo", fontSize=24, leading=28, textColor=INK, spaceAfter=3)
SOT = ParagraphStyle("SOT", fontName="Seg", fontSize=9.2, leading=13.4, textColor=GRIGIO, spaceAfter=6)
H2 = ParagraphStyle("H2", fontName="Geo", fontSize=17, leading=21, textColor=INK, spaceBefore=8, spaceAfter=4,
                    keepWithNext=1)
P = ParagraphStyle("P", fontName="Seg", fontSize=8.9, leading=12.6, textColor=TESTO, spaceAfter=4)
PM = ParagraphStyle("PM", parent=P, textColor=GRIGIO, fontSize=8.6, leading=12.2)
CELL = ParagraphStyle("CELL", parent=P, fontSize=8.2, leading=11, spaceAfter=0)
CELLB = ParagraphStyle("CELLB", parent=CELL, fontName="SegB")
NUM = ParagraphStyle("NUM", parent=CELL, fontName="Geo", fontSize=12, leading=12, textColor=ACCENTO)

# mattoni del marchio provvisorio (riquadro 64, come scripts/marchio.mjs)
MATTONI = [(4, 8, 26), (34, 8, 26), (4, 25, 12), (20, 25, 24), (48, 25, 12), (4, 42, 26), (34, 42, 26)]


def marchio(c, x, y, h):
    """Il marchio provvisorio del sito: tre file di mattoni a tratto + EDILBRUNO."""
    s = h / 64.0
    c.saveState()
    c.setStrokeColor(ACCENTO_SCURO)
    c.setLineWidth(3.6 * s)
    for (a, b, w) in MATTONI:
        c.rect(x + a * s, y + (64 - b - 14) * s, w * s, 14 * s, stroke=1, fill=0)
    c.setFont("SegB", 10.5)
    c.setFillColor(colors.white)
    c.drawString(x + h + 2.2 * mm, y + h * 0.3, "EDIL")
    w = pdfmetrics.stringWidth("EDIL", "SegB", 10.5)
    c.setFillColor(ACCENTO_SCURO)
    c.drawString(x + h + 2.2 * mm + w, y + h * 0.3, "BRUNO")
    c.restoreState()


def cornice(c, doc):
    c.saveState()
    c.setFillColor(INK)
    c.rect(0, A4[1] - 15 * mm, A4[0], 15 * mm, stroke=0, fill=1)
    marchio(c, 18 * mm, A4[1] - 11.2 * mm, 7 * mm)
    c.setFont("Seg", 7.2)
    c.setFillColor(colors.HexColor("#d9d2c8"))
    c.drawRightString(A4[0] - 18 * mm, A4[1] - 9 * mm, "Palette, errori corretti e miglioramenti · BOZZA")
    c.setStrokeColor(LINEA)
    c.setLineWidth(0.5)
    c.line(18 * mm, 14 * mm, A4[0] - 18 * mm, 14 * mm)
    c.setFont("Seg", 7)
    c.setFillColor(GRIGIO)
    c.drawString(18 * mm, 10 * mm, "Sito EDILBRUNO · github.com/fadericosarghi23-ai/edilbruno · dettagli in README.md")
    c.drawRightString(A4[0] - 18 * mm, 10 * mm,
                      "pagina %d di %d" % (doc.page, TOTALE[0]) if TOTALE[0] else "pagina %d" % doc.page)
    c.restoreState()


def tabella(dati, larghezze, extra=None):
    t = Table(dati, colWidths=larghezze, repeatRows=1, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 3.2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3.2),
        ("LEFTPADDING", (0, 0), (-1, -1), 4.5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4.5),
        ("BACKGROUND", (0, 0), (-1, 0), SABBIA),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, LINEA),
    ] + (extra or [])))
    return t


def elenco(voci):
    righe = [[Paragraph("<b>#</b>", CELL), Paragraph("<b>che cosa · come è stato corretto</b>", CELL)]]
    for i, (tit, testo) in enumerate(voci, start=1):
        righe.append([Paragraph(str(i), NUM), Paragraph("<b>%s.</b> %s" % (tit, testo), CELL)])
    return tabella(righe, [9 * mm, 165 * mm])


story = []

# ================================================================= 1. palette
story.append(Paragraph("Palette, errori corretti e miglioramenti", H1))
story.append(Paragraph(
    "Sito nuovo di EDILBRUNO, impresa edile individuale di Bruno Onofrio Michael a Gallarate (VA), costruito sulla "
    "base svuotata e riempito con la mappa del cliente (CONTENT_FILL.md). È una <b>bozza dimostrativa</b>: oltre ai "
    "dati veri (nome, titolare, città, P.IVA, telefono, i 4 servizi) contiene testi, lavori, foto, logo e colori "
    "d'esempio, e il sito lo dice su ogni pagina. Quattro parti: da dove viene ogni colore, che cosa è stato "
    "sbagliato e corretto, che cosa offre in più della presenza online di oggi, e lo stato per il deploy su Netlify.", SOT))

story.append(Paragraph("1. La palette", H2))
story.append(Paragraph(
    "Tutti i colori stanno nel blocco <b>:root</b> di <b>src/styles/global.css</b>: cambiandoli lì cambia "
    "tutto il sito. L'impresa <b>non ha ancora dato colori né logo</b>: la palette è <b>provvisoria</b>, scelta come "
    "chiede la mappa (niente magenta BD Media, neutri e un accento sobrio). Neutri caldi da cantiere e un rosso "
    "mattone come accento. I contrasti sono calcolati con la formula WCAG.", P))

B = "#ffffff"
PALETTE = [
    ("--accent", "#8a3a1f", "Bottoni, sopratitoli, link, fascia contatti", contrasto("#8a3a1f", B) + " su bianco, " + contrasto("#8a3a1f", "#f6f2ec") + " su --sand"),
    ("--accent-dark", "#6b2c17", "Hover dei bottoni", contrasto("#6b2c17", B) + " su bianco"),
    ("--accent-on-dark", "#e9a46b", "Evidenze sui fondi scuri, «BRUNO» nel logo chiaro e nell'intro", contrasto("#e9a46b", "#1e1c1a") + " su --ink"),
    ("--ink", "#1e1c1a", "Titoli, footer, fondo dell'intro e delle testate", contrasto("#1e1c1a", B) + " col bianco"),
    ("--ink-2", "#2a2724", "Superfici scure secondarie", "derivato"),
    ("--text", "#262320", "Testo corrente", contrasto("#262320", B) + " su bianco"),
    ("--grey", "#5f5a54", "Testo secondario, didascalie", contrasto("#5f5a54", B) + " su bianco"),
    ("--sand", "#f6f2ec", "Sezioni chiare alternate", "fondo neutro caldo"),
    ("--grey-light", "#ebe6df", "Fondo foto, riquadro vuoto del titolare", "derivato"),
    ("--accent-soft", "#f2e3da", "Anello di focus nei campi", "derivato dall'accento"),
    ("--line", "#0000001a", "Righe divisorie", "nero al 10%"),
    ("--white", "#ffffff", "Fondo pagina", "bianco"),
]
dati = [[Paragraph("<b>token</b>", CELL), "", Paragraph("<b>colore</b>", CELL),
         Paragraph("<b>ruolo</b>", CELL), Paragraph("<b>contrasto</b>", CELL)]]
stile = []
for i, (tok, hexv, ruolo, fonte) in enumerate(PALETTE, start=1):
    dati.append([Paragraph(tok, CELLB), "", Paragraph(hexv, CELL), Paragraph(ruolo, CELL), Paragraph(fonte, CELL)])
    sw = hexv[:7] if hexv != "#0000001a" else "#e6e6e6"
    stile += [("BACKGROUND", (1, i), (1, i), colors.HexColor(sw)), ("BOX", (1, i), (1, i), 0.4, LINEA)]
story.append(tabella(dati, [27 * mm, 10 * mm, 19 * mm, 63 * mm, 55 * mm], stile))
story.append(Spacer(1, 5))
story.append(Paragraph(
    "<b>Il giallo della bozza.</b> L'etichetta fissa \"Bozza dimostrativa\", il suo pulsante \"Mostra testi "
    "inventati\" e le note sui lavori d'esempio usano un giallo avviso (#fff3cd, testo #5c4400, "
    + contrasto("#5c4400", "#fff3cd") + ") che non fa parte della palette: sparisce con <b>BOZZA = false</b>. "
    "La sottolineatura ondulata gialla dei testi inventati compare solo quando si preme il pulsante.", PM))
story.append(Paragraph(
    "<b>Tipografia.</b> Quella della base: <b>Newsreader</b> per i titoli e <b>Inter</b> per il testo, ospitati "
    "sul sito. <b>Logo e icone provvisori.</b> Il marchio è fatto di tre file di mattoni a tratto e del nome "
    "EDIL<b>BRUNO</b> in bastoni nero, nei riquadri della base (882×182). Favicon, icone, immagine di condivisione, "
    "segno della fascia contatti e intro usano gli stessi mattoni. Da sostituire col logo SVG vero; "
    "<b>da validare</b> col cliente anche i colori.", PM))

# ================================================================= 2. errori
story.append(PageBreak())
story.append(Paragraph("2. Errori corretti", H2))
story.append(Paragraph(
    "Errori trovati durante il lavoro (nel riempimento, nella base o nei dati di partenza) e come sono stati "
    "sistemati.", PM))
ERRORI = [
    ("Mappa scritta per un'altra base",
     "CONTENT_FILL.md descrive la base Zeroseistudio (Tailwind, card espandibili), che non c'è. Ogni voce è stata "
     "riportata sugli slot della base usata: Progetti diventa Lavori, Studio diventa L'impresa."),
    ("Base in inglese",
     "Menu, bottoni, form, etichette accessibili, lightbox, pagine legali, 404 e llms.txt erano in inglese. Tutto "
     "tradotto; lang=\"it\", og:locale it_IT, dati strutturati in italiano."),
    ("Sezioni da studio di architettura",
     "Seconda sede, pagina premi, \"dove lavoriamo\", 12 collaboratori e un secondo fondatore non hanno senso per "
     "una ditta individuale: tolti dai template e dai dati strutturati."),
    ("32 lavori per una ditta individuale",
     "La base aveva 32 schede progetto. Ridotte a 9 lavori d'esempio in 3 categorie, nei comuni intorno a "
     "Gallarate, coerenti con i servizi verificati."),
    ("Riferimenti a foto inesistenti",
     "Hero, foto della pagina impresa e dei servizi puntavano agli slug della base: ripuntati sui lavori nuovi."),
    ("Informazioni personali inventate",
     "Bio, anni di mestiere, \"segue ogni cantiere di persona\": tolti. Del titolare restano solo nome, ruolo e "
     "impresa individuale a Gallarate, come nella mappa."),
    ("Foto al posto del titolare",
     "Una foto di attrezzi stava dove va il ritratto: sostituita con un riquadro vuoto delle stesse misure, e "
     "nessuna immagine del titolare nei dati strutturati."),
    ("Omonimia",
     "edilbruno.it è di un'altra azienda (Capaccio Paestum): nessun dominio o email inventati su quel nome, "
     "canonical su example.com finché non c'è il dominio vero."),
    ("Instagram non confermato",
     "La mappa dubita che @edilbruno sia dell'impresa: il profilo non è pubblicato finché non è confermato."),
    ("Testi inventati non riconoscibili",
     "Ogni testo non preso dalla mappa passa da ex() nel codice e si sottolinea in giallo con il pulsante della "
     "bozza. Il segno invisibile è tolto da title, meta e dati strutturati."),
    ("Copertina poco credibile",
     "Il primo lavoro si apriva con un soggiorno americano di lusso: copertina sostituita con il cantiere in "
     "corso, la sala finita va in fondo."),
    ("Indirizzo lungo che sporgeva",
     "Nella cookie policy un indirizzo web come testo faceva scorrere la pagina di lato a 375 px: ora è un link."),
    ("Modulo verso un indirizzo sbagliato",
     "La base apriva la posta verso un altro indirizzo: modulo scollegato, all'invio avvisa che il sito è in bozza."),
    ("Falsi positivi nel controllo residui",
     "Il controllo dei dati dei clienti precedenti segnalava \"casa e\" nelle frasi italiane: tolti i due termini troppo generici."),
    ("Node 20 fuori supporto",
     "netlify.toml chiedeva Node 20, fuori supporto da aprile 2026. Portato a Node 22."),
]
story.append(elenco(ERRORI))

# ================================================================= 3. miglioramenti
story.append(PageBreak())
story.append(Paragraph("3. Miglioramenti rispetto alla presenza online di oggi", H2))
MIGLIORIE = [
    ("Un sito proprio",
     "Oggi l'impresa compare solo in una scheda su Mani Fidate (galleria vuota) e con un post Instagram non "
     "confermato. Qui ha un sito suo, con telefono e richiesta di preventivo in ogni pagina."),
    ("Servizi spiegati",
     "I 4 servizi verificati diventano schede con descrizione, voci e lavori collegati, più 2 servizi da "
     "confermare (bagni, pavimentazioni esterne)."),
    ("Lavori per categoria",
     "Ristrutturazioni, pavimenti e rivestimenti, muratura e completamenti: card con filtri, scheda per ogni "
     "lavoro, galleria con lightbox (frecce, tastiera, swipe). Pronti a ricevere i lavori veri."),
    ("Zona e mappa",
     "Gallarate e dintorni con mappa OpenStreetMap senza cookie di profilazione, caricata solo quando serve."),
    ("Foto veloci",
     "AVIF e WebP alle dimensioni giuste per ogni schermo (5 misure × 3 formati), caricate solo quando servono."),
    ("Intro col logo",
     "All'apertura i mattoni del logo si posano dal basso e il pannello sale sul sito; solo alla prima pagina, "
     "saltata con \"riduci animazioni\"."),
    ("SEO pronta",
     "Titoli e descrizioni per pagina, dati strutturati (impresa, sede, titolare, servizi, lavori), sitemap, "
     "llms.txt, Open Graph con immagine: si attivano togliendo la bozza."),
    ("Più movimento",
     "Hero e testate entrano a cascata, foto che si scoprono, numeri che contano, icone che si disegnano, mattoni "
     "della fascia contatti che si posano, parallasse, barra di lettura. Tutto spento con \"riduci animazioni\"."),
    ("Bozza con due interruttori",
     "BOZZA = true mette etichetta, note, noindex e robots bloccato; il pulsante nell'etichetta mostra o "
     "nasconde la sottolineatura dei testi inventati, e il browser ricorda la scelta."),
]
righe = [[Paragraph("<b>cosa</b>", CELL), Paragraph("<b>perché conta</b>", CELL)]]
for tit, testo in MIGLIORIE:
    righe.append([Paragraph("<b>%s</b>" % tit, CELL), Paragraph(testo, CELL)])
story.append(tabella(righe, [36 * mm, 138 * mm]))

story.append(Paragraph("Le pagine del sito", H2))
story.append(Paragraph("22 pagine in tutto, in italiano. Dati veri dalla mappa; lavori, foto e molti testi sono esempi.", PM))
PAGINE = [
    ("/", "Home", "intro col logo, carosello di 5 lavori, l'impresa con 4 numeri, 6 servizi, 6 lavori, il titolare, "
     "zona con mappa, fascia preventivo"),
    ("/studio/", "L'impresa", "presentazione, 4 numeri, modo di lavorare in 3 punti, il titolare, i servizi, la sede"),
    ("/servizi/", "Servizi", "6 servizi a sezioni alternate, ognuno con foto, voci e 3 lavori collegati"),
    ("/progetti/", "Lavori", "9 lavori d'esempio con filtri; 3 pagine categoria; 9 schede con galleria"),
    ("/contatti/", "Contatti", "sede, telefono, email, mappa e modulo di richiesta preventivo"),
    ("legali", "Privacy, cookie", "informativa GDPR con ragione sociale e P.IVA; nessun cookie di profilazione"),
    ("altre", "Mappa, grazie, 404", "mappa del sito, pagina di conferma del modulo, pagina non trovata"),
]
righe = [[Paragraph("<b>indirizzo</b>", CELL), Paragraph("<b>pagina</b>", CELL), Paragraph("<b>cosa contiene</b>", CELL)]]
for url, nome, cosa in PAGINE:
    righe.append([Paragraph(url, CELL), Paragraph("<b>%s</b>" % nome, CELL), Paragraph(cosa, CELL)])
story.append(tabella(righe, [24 * mm, 30 * mm, 120 * mm]))

# ================================================================= 4. stato
STATO = [
    ("Build", "verde: 22 pagine, anche da clone pulito con installazione da zero (come Netlify)", "ok"),
    ("Link e immagini", "2374 riferimenti interni controllati con maiuscole esatte (Linux), 0 rotti", "ok"),
    ("Layout", "nessuno scorrimento orizzontale su 22 pagine a 375, 768 e 1280 px (66 controlli)", "ok"),
    ("Animazioni", "intro, carosello, reveal, lightbox, menu e le animazioni aggiunte verificati a schermo", "ok"),
    ("Netlify", "netlify.toml: build npm run build, cartella dist, Node 22, installazione senza lockfile", "ok"),
    ("GitHub", "push su fadericosarghi23-ai/edilbruno, branch main", "ok"),
    ("Residui", "nessun dato dei clienti delle basi precedenti (195 termini controllati)", "ok"),
    ("Bozza", "etichetta su ogni pagina, noindex, robots.txt Disallow: / finché BOZZA è true", "per scelta"),
    ("Email e modulo", "email d'esempio (bozza@example.com), modulo scollegato: non parte nulla", "manca"),
    ("Lavori e foto", "9 lavori e 34 foto d'esempio (Unsplash, licenza libera): servono lavori e foto veri", "manca"),
    ("Titolare", "nessuna foto (riquadro vuoto) e nessuna presentazione: da scrivere con lui", "manca"),
    ("Logo, colori, dominio", "provvisori; nessun dominio (edilbruno.it è di un'altra azienda)", "manca"),
]
righe = [[Paragraph("<b>voce</b>", CELL), Paragraph("<b>stato</b>", CELL), Paragraph("<b>esito</b>", CELL)]]
for voce, stato, esito in STATO:
    col = "#2f6b3a" if esito == "ok" else ("#5f5a54" if esito == "per scelta" else "#9b2c2c")
    righe.append([Paragraph("<b>%s</b>" % voce, CELL), Paragraph(stato, CELL),
                  Paragraph('<font color="%s"><b>%s</b></font>' % (col, esito), CELL)])
story.append(PageBreak())
story.append(KeepTogether([
    Paragraph("4. Stato per il deploy", H2),
    tabella(righe, [34 * mm, 120 * mm, 20 * mm]),
    Spacer(1, 5),
    Paragraph(
        "<b>Su Netlify.</b> Collegare il repository: build e cartella sono già in netlify.toml. L'indirizzo "
        "*.netlify.app funziona subito; finché c'è la bozza i motori non indicizzano. <b>Dominio.</b> Quando c'è, "
        "va messo in astro.config.mjs (SITE_URL) e in src/data/site.ts (dominio): canonical, sitemap e Open Graph lo "
        "usano. <b>Modulo.</b> La mappa prevede Formspree: basta l'endpoint in site.form. <b>Per pubblicare "
        "davvero:</b> contatti, lavori, foto e testi veri, poi BOZZA = false in src/lib/bozza.ts.", PM),
]))

story.append(Paragraph("Cosa serve dall'impresa per togliere la bozza", H2))
SERVE = [
    ("Marchio", "il logo in SVG e i colori; altrimenti approvazione del marchio e della palette provvisori"),
    ("Contatti", "email, conferma del telefono, orari, PEC; conferma del profilo Instagram"),
    ("Dati legali", "via e CAP della sede, forma giuridica dalla visura"),
    ("Lavori veri", "3-4 lavori con titolo, zona, anno e due righe di descrizione"),
    ("Foto", "2-5 foto per lavoro, anche da telefono purché nitide; meglio prima e dopo"),
    ("Titolare", "una foto (o della squadra al lavoro), anni di attività e due righe su come lavora"),
    ("Servizi", "descrizioni con le sue parole e conferma dei servizi aggiuntivi (bagni, esterni)"),
    ("Modulo e dominio", "endpoint Formspree o email per le richieste; il dominio scelto"),
]
righe = [[Paragraph("<b>cosa</b>", CELL), Paragraph("<b>dettaglio</b>", CELL)]]
for tit, testo in SERVE:
    righe.append([Paragraph("<b>%s</b>" % tit, CELL), Paragraph(testo, CELL)])
story.append(tabella(righe, [30 * mm, 144 * mm]))


def costruisci(percorso, contenuto):
    d = BaseDocTemplate(percorso, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
                        topMargin=21 * mm, bottomMargin=18 * mm,
                        title="EDILBRUNO - palette, errori corretti e miglioramenti", author="BD Media")
    f = Frame(d.leftMargin, d.bottomMargin, d.width, d.height, id="corpo")
    d.addPageTemplates([PageTemplate(id="std", frames=[f], onPage=cornice)])
    d.build(copy.deepcopy(contenuto))
    return d.page


os.makedirs(os.path.dirname(OUT), exist_ok=True)
TOTALE[0] = costruisci(os.path.join(QUI, "_conteggio.pdf"), story)
costruisci(OUT, story)
os.remove(os.path.join(QUI, "_conteggio.pdf"))
shutil.copyfile(OUT, DESKTOP)
print("scritto", OUT, "e", DESKTOP, "-", TOTALE[0], "pagine")
