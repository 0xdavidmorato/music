#!/usr/bin/env python3
"""
Generate static post pages under posts/<slug>.html from content/posts/*.md
"""
from pathlib import Path
import re
import json

posts_dir = Path('content/posts')
if not posts_dir.exists():
    print('content/posts not found')
    raise SystemExit(1)

out_dir = Path('posts')
out_dir.mkdir(exist_ok=True)

posts_index = []
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
    title = meta.get('title','Post')
    date = meta.get('date','')
    posts_index.append({'slug':slug,'title':title,'date':date})

    html = f'''<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{meta.get('title','Post')}</title>
<link rel="stylesheet" href="/assets/music_styles.css">
</head><body><main><article data-post></article></main>
<script src="/assets/blog.js"></script>
</body></html>'''
    out_path = out_dir / (slug+'.html')
    out_path.write_text(html, encoding='utf-8')
    print('Wrote', out_path)

# generate posts index
index_html = '<!doctype html>\n<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Blog</title>\n<link rel="stylesheet" href="/assets/music_styles.css">\n</head><body><main><h1>Blog</h1>\n'
posts_json = []
for p in sorted(posts_index, key=lambda x: x.get('date',''), reverse=True):
    index_html += f"<article><h3><a href='/posts/{p['slug']}.html'>{p['title']}</a></h3><time>{p.get('date','')}</time></article>\n"
    posts_json.append({'slug': p['slug'], 'title': p['title'], 'date': p.get('date','')})
index_html += '</main>\n</body></html>'

(Path('posts') / 'index.html').write_text(index_html, encoding='utf-8')
(Path('posts') / 'index.json').write_text(json.dumps(posts_json, ensure_ascii=False, indent=2), encoding='utf-8')
print('Wrote posts/index.html and posts/index.json')
