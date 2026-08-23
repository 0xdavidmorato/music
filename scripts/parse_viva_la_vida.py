#!/usr/bin/env python3
import re
import json
from pathlib import Path

bak = Path('index.html.bak')
if not bak.exists():
    print('index.html.bak not found')
    raise SystemExit(1)

s = bak.read_text(encoding='utf-8')

# locate the lyrics block by id "lyrics11"
m = re.search(r'<div[^>]+id="lyrics11"[^>]*>(.*?)</div>', s, flags=re.S)
if not m:
    print('Could not find lyrics11 block')
    raise SystemExit(1)

block = m.group(1)

# Find headers (h2,h3,h4) and paragraphs with following span.ipa
parts = []
# Use regex to find either header tags or paragraph + optional span.ipa
pattern = re.compile(r'(<h[234][^>]*>.*?</h[234]>)|(<p[^>]*>.*?</p>)(?:\s*<span[^>]*class="ipa"[^>]*>.*?</span>)?', flags=re.S)
for pm in pattern.finditer(block):
    hdr = pm.group(1)
    p = pm.group(2)
    if hdr:
        # strip tags
        text = re.sub(r'<.*?>', '', hdr).strip()
        parts.append({'type':'header','text':text})
    elif p:
        text = re.sub(r'<.*?>', '', p).strip()
        # try to find following span.ipa text specifically by searching after the match
        ipa = ''
        # lookahead region
        start = pm.end()
        # try to match a span.ipa immediately after (within next 1000 chars)
        look = block[start:start+1000]
        m2 = re.match(r"\s*<span[^>]*class=\"ipa\"[^>]*>(.*?)</span>", look, flags=re.S)
        if m2:
            ipa = re.sub(r'<.*?>','', m2.group(1)).strip()
        parts.append({'type':'line','text':text,'ipa':ipa})

# extract all ipa spans in the block in order
ipa_spans = [m.group(1).strip() for m in re.finditer(r'<span[^>]*class="ipa"[^>]*>(.*?)</span>', block, flags=re.S)]

lines = []
ipa_idx = 0
for i, part in enumerate(parts):
    if part['type'] == 'header':
        lines.append({'line_id': f'l{len(lines)+1:03d}', 'text': part['text'], 'ipa': '', 'chords': '', 'is_header': True, 'time_start': None, 'time_end': None, 'grammar_notes': []})
    else:
        ipa_text = ''
        if ipa_idx < len(ipa_spans):
            ipa_text = ipa_spans[ipa_idx]
            ipa_idx += 1
        lines.append({'line_id': f'l{len(lines)+1:03d}', 'text': part['text'], 'ipa': ipa_text, 'chords': '', 'time_start': None, 'time_end': None, 'grammar_notes': []})

Path('data').mkdir(exist_ok=True)
out = Path('data/song-viva-la-vida.json')
with out.open('w', encoding='utf-8') as f:
    json.dump({'id':'viva-la-vida','title':'Viva la Vida','artist':'Coldplay','source':'index.html.bak','audio':'assets/audio/viva-la-vida.mp3','thumbnail':'assets/img/viva-la-vida.jpg','lines': lines}, f, ensure_ascii=False, indent=2)

print(f'Wrote {len(lines)} lines to {out} (filled {ipa_idx} IPA spans)')
