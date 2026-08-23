#!/usr/bin/env python3
"""
Generate static post pages under posts/<slug>.html from content/posts/*.md
"""
from pathlib import Path
import re

posts_dir = Path('content/posts')
if not posts_dir.exists():
    print('content/posts not found')
    raise SystemExit(1)

out_dir = Path('posts')
out_dir.mkdir(exist_ok=True)

for md in posts_dir.glob('*.md'):
    text = md.read_text(encoding='utf-8')
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', text, flags=re.S)
    meta = {}
    body = text
    if m:
        raw = m.group(1)
        body = m.group(2)
        for line in raw.split('\n'):
            if ':' in line:
                k,v = line.split(':',1)
                meta[k.strip()] = v.strip()
    slug = md.stem
    html = f'''<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{meta.get('title','Post')}</title>
<link rel="stylesheet" href="/assets/music_styles.css">
</head><body><main><article data-post></article></main>
<script src="/assets/blog.js"></script>
</body></html>'''
    out_path = out_dir / (slug+'.html')
    out_path.write_text(html, encoding='utf-8')
    print('Wrote', out_path)
