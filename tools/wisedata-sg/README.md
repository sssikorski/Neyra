# wisedata.sg build helpers

After editing `wisedata-sg/index.html`, regenerate the derived files:

    python3 tools/wisedata-sg/build_pages.py   # privacy, terms, cookies, legal pages
    python3 tools/wisedata-sg/build_views.py   # /office/, /datacentre/, /ghostdrive/, /wee/, 404, sitemap

`index.html` is the single source: the product URLs are copies of it with their own title and canonical,
and the router in the page chooses the view from the URL path.
