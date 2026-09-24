#!/usr/bin/env python3
"""Gera o site da Revista Ocupa em revista/site/ para publicar no Netlify.

Para lançar uma edição nova:
  1. Crie revista/ocupa-edicao-NN.html (copie a anterior e troque o conteúdo).
  2. Acrescente a edição na lista EDICOES abaixo e marque status "publicada".
  3. Rode:  python3 revista/build.py
  4. Publique a pasta revista/site no Netlify.

Cada edição fica em /edicao-NN/ para sempre; a página inicial (/) mostra
a mais recente e o arquivo com todas.
"""
from pathlib import Path
import html
import shutil

ROOT = Path(__file__).resolve().parent
SITE = ROOT / "site"

# Ordem: da mais antiga para a mais nova. status: "publicada" ou "em-breve".
EDICOES = [
    {
        "num": "01",
        "fonte": "ocupa-edicao-01.html",
        "status": "publicada",
        "tema": {"pt": "Ocupa-te até que eu volte", "en": "Occupy till I come", "es": "Ocúpate hasta que yo vuelva"},
        "quando": {"pt": "Outono 2026", "en": "Fall 2026", "es": "Otoño 2026"},
        "resumo": {"pt": "Mapa de energia, a parábola das minas e o azeite da viúva.",
                   "en": "Energy map, the parable of the minas and the widow's oil.",
                   "es": "Mapa de energía, la parábola de las minas y el aceite de la viuda."},
    },
    {
        "num": "02",
        "fonte": None,
        "status": "em-breve",
        "tema": {"pt": "Descanso como estratégia", "en": "Rest as strategy", "es": "Descanso como estrategia"},
        "quando": {"pt": "Próximo mês", "en": "Next month", "es": "Próximo mes"},
        "resumo": {"pt": "Sábado, sono e recuperação ocupacional.",
                   "en": "Sabbath, sleep and occupational recovery.",
                   "es": "Sábado, sueño y recuperación ocupacional."},
    },
]

ICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E"
        "%3Crect width='64' height='64' fill='%231F4A3D'/%3E%3Ctext x='32' y='46' font-family='Georgia,serif' "
        "font-size='40' font-weight='700' text-anchor='middle' fill='%23C98A12'%3EO%3C/text%3E%3C/svg%3E")

EXTRA_CSS = """
html,body{min-height:100%}
:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
[hidden]{display:none!important}
img{max-width:100%}
"""


def L(d, tag="span"):
    return "".join(f'<{tag} data-l="{k}">{html.escape(d[k])}</{tag}>' for k in ("pt", "en", "es"))


def documento(fragmento, og_title, og_desc, css_extra=""):
    """Envolve um fragmento de artifact (sem <html>/<head>) num documento completo."""
    cabeca, corpo = fragmento.split("</style>", 1)
    return f"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta property="og:title" content="{html.escape(og_title)}">
<meta property="og:description" content="{html.escape(og_desc)}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#1F4A3D">
<link rel="icon" href="{ICON}">
{cabeca}{EXTRA_CSS}{css_extra}</style>
</head>
<body>{corpo}
</body>
</html>
"""


def capa(ed, link):
    tag = "a" if link else "div"
    href = f' href="{link}"' if link else ""
    classe = "issue" if link else "issue soon"
    selo = "" if link else f'<span class="badge">{L({"pt": "Em breve", "en": "Coming soon", "es": "Próximamente"})}</span>'
    return f"""      <{tag} class="{classe}"{href}>
        <div class="cover">
          <span class="num">{L({"pt": "Edição " + ed["num"], "en": "Issue " + ed["num"], "es": "Edición " + ed["num"]})} · {L(ed["quando"])}</span>
          <span class="c-logo">Ocu<em>pa</em></span>
          <span class="c-theme">{L(ed["tema"])}</span>
        </div>
        {selo}
        <div class="meta"><b>{L(ed["tema"])}</b><span>{L(ed["resumo"])}</span></div>
      </{tag}>"""


def main():
    if SITE.exists():
        for item in SITE.iterdir():
            if item.name.startswith("edicao-"):
                shutil.rmtree(item)
    SITE.mkdir(exist_ok=True)

    publicadas = [e for e in EDICOES if e["status"] == "publicada"]
    link_voltar = ('<a class="home-link" href="/">'
                   '<span data-l="pt">← Todas as edições</span><span data-l="en">← All issues</span>'
                   '<span data-l="es">← Todas las ediciones</span></a>')
    css_voltar = (".home-link{margin-left:auto;font-family:var(--mono);font-weight:600;text-transform:uppercase;"
                  "letter-spacing:.12em;font-size:.72rem;color:var(--soft);text-decoration:none}"
                  ".home-link:hover{color:var(--teal)}\n")

    for ed in publicadas:
        frag = (ROOT / ed["fonte"]).read_text(encoding="utf-8")
        marca = '<span class="brand-sub">Magazine</span></div>'
        assert marca in frag, f"cabeçalho não encontrado em {ed['fonte']}"
        frag = frag.replace(marca, '<span class="brand-sub">Magazine</span>' + link_voltar + "</div>", 1)
        pasta = SITE / f"edicao-{ed['num']}"
        pasta.mkdir()
        (pasta / "index.html").write_text(
            documento(frag, f"Revista Ocupa · Edição {ed['num']}",
                      f"{ed['tema']['pt']}. Terapia ocupacional de alta performance e empreendedorismo cristão, por Integrally Well.",
                      css_voltar),
            encoding="utf-8")

    ultima = publicadas[-1]
    ultima_link = f"/edicao-{ultima['num']}/"
    capas = "\n".join(capa(e, f"/edicao-{e['num']}/" if e["status"] == "publicada" else None)
                      for e in reversed(EDICOES))
    botao = (f'<a class="btn" href="{ultima_link}">'
             + L({"pt": f"Ler a edição {ultima['num']}", "en": f"Read issue {ultima['num']}", "es": f"Leer la edición {ultima['num']}"})
             + "</a>")
    botao_pod = (f'<a class="btn" href="{ultima_link}#entrevista">'
                 + L({"pt": "Quero testemunhar", "en": "Share my story", "es": "Quiero testificar"}) + "</a>")
    home = (ROOT / "home.html").read_text(encoding="utf-8")
    home = home.replace("{{ISSUES}}", capas).replace("{{LATEST_BUTTON}}", botao).replace("{{POD_BUTTON}}", botao_pod)
    (SITE / "index.html").write_text(
        documento(home, "Revista Ocupa",
                  "Terapia ocupacional de alta performance e empreendedorismo cristão. Uma edição por mês, por Integrally Well."),
        encoding="utf-8")
    (SITE / "netlify.toml").write_text('[build]\n  publish = "."\n', encoding="utf-8")
    print("Site gerado em", SITE)
    for e in publicadas:
        print(f"  /edicao-{e['num']}/")


if __name__ == "__main__":
    main()
