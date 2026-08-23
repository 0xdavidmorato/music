#!/usr/bin/env python3
"""
Generate static song pages under songs/<id>.html from data/songs.json
"""
import json
from pathlib import Path

songs_index = Path('data/songs.json')
if not songs_index.exists():
    print('data/songs.json not found')
    raise SystemExit(1)

songs = json.loads(songs_index.read_text(encoding='utf-8'))
Path('songs').mkdir(exist_ok=True)

template = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} — {artist}</title>
<link rel="stylesheet" href="/assets/music_styles.css">
<link rel="stylesheet" href="/assets/psychedelic_night.css">
<link rel="stylesheet" href="/assets/karaoke.css">
</head>
<body>
<main>
  <article class="song-page">
    <h1>{title}</h1>
    <h2>{artist}</h2>
    <div class="song-container lyrics" data-song-id="{id}"></div>
  </article>
</main>
<script src="/assets/theme_toggle.js"></script>
<script src="/assets/karaoke_player.js"></script>
<script src="/assets/ipa_editor.js"></script>
<script src="/assets/music_scripts.js"></script>
</body>
</html>
'''

for s in songs:
    fname = Path('songs') / f"{s['id']}.html"
    content = template.format(title=s.get('title','Song'), artist=s.get('artist',''), id=s['id'])
    fname.write_text(content, encoding='utf-8')
    print('Wrote', fname)
