"""Generate per-product entry pages from index.html (same single-page app, view chosen by URL path),
the 404 page and the sitemap. Run after build_pages.py."""
import os, re, html, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
OUT = os.environ.get('WD_OUT', os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'wisedata-sg'))
src = open(os.path.join(OUT, 'index.html'), encoding='utf8').read()

VIEWS = {
    'office': ('office', 'Wise Office · Wise Data',
               'An AI workforce for your departments, running on your own hardware. Wise Office by Wise Data, Singapore.'),
    'datacentre': ('dc', 'Wise Data Centre · Wise Data',
                   'Modular AI data centre projects in Johor (Malaysia) and Indonesia. Project information for qualified investors, from Wise Data.'),
    'ghostdrive': ('gd', 'Ghostdrive Enterprise · Wise Data',
                   'Encrypted company files and private AI on your own nodes. Ghostdrive Enterprise, deployed by Wise Data.'),
    'wee': ('wee', 'Wee · Wise Data',
            'The agentic messenger: chat, voice and video for people and their AI agents. Wee by Wise Data.'),
}

def sub1(pattern, repl, text):
    new, n = re.subn(pattern, repl, text, count=1, flags=re.S)
    assert n == 1, pattern
    return new

def make(slug, view, title, desc):
    t = re.sub(r'<link rel="canonical"[^>]*>\n?', '', src)
    t = sub1(r'<title>.*?</title>', '<title>%s</title>' % title, t)
    t = sub1(r'<meta name="description" content="[^"]*">', '<meta name="description" content="%s">' % html.escape(desc), t)
    t = sub1(r'<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="%s">' % html.escape(title), t)
    t = sub1(r'<meta property="og:description" content="[^"]*">', '<meta property="og:description" content="%s">' % html.escape(desc), t)
    url = 'https://wisedata.sg/%s' % (slug + '/' if slug else '')
    t = sub1(r'<meta property="og:url" content="[^"]*">', '<meta property="og:url" content="%s">\n<link rel="canonical" href="%s">' % (url, url), t)
    if view:
        t = sub1(r'<body>', '<body data-view="%s">' % view, t)
    return t

# home: add canonical only
home = make('', None, 'Wise Data', 'Wise Data builds the Wise Stack: private AI from the hardware up. Wise Office, Ghostdrive Enterprise, Wee and Wise Data Centre. Singapore.')
# keep original home title/description untouched except canonical
home = src.replace('<meta property="og:url" content="https://wisedata.sg/">', '<meta property="og:url" content="https://wisedata.sg/">\n<link rel="canonical" href="https://wisedata.sg/">') if 'rel="canonical"' not in src else src
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf8').write(home)

for slug, (view, title, desc) in VIEWS.items():
    d = os.path.join(OUT, slug)
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'index.html'), 'w', encoding='utf8').write(make(slug, view, title, desc))
    print('wrote', slug)

# 404 page from the policy template
import importlib.util


import build_pages as bp
body = '<p>The page you are looking for does not exist or has moved.</p><p><a href="/">Go to the Wise Data home page</a></p>'
nf = bp.page('404', 'Page not found', 'Page not found', body, [])
nf = nf.replace('<link rel="canonical" href="https://wisedata.sg/404/">', '<meta name="robots" content="noindex">')
nf = re.sub(r'<div class="eyebrow">Legal</div>', '<div class="eyebrow">404</div>', nf)
nf = re.sub(r'<div class="meta">.*?</div>', '', nf, count=1)
open(os.path.join(OUT, '404.html'), 'w', encoding='utf8').write(nf)

urls = ['', 'office/', 'datacentre/', 'ghostdrive/', 'wee/', 'privacy/', 'terms/', 'cookies/', 'legal/']
sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(
    '  <url><loc>https://wisedata.sg/%s</loc></url>\n' % u for u in urls) + '</urlset>\n'
open(os.path.join(OUT, 'sitemap.xml'), 'w').write(sm)
print('wrote 404, sitemap')
