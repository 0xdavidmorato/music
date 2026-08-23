#!/usr/bin/env python3
import re
import json
from pathlib import Path

p = Path('index.html')
if not p.exists():
    print('index.html not found')
    raise SystemExit(1)

s = p.read_text(encoding='utf-8')

# Backup original
bk = Path('index.html.bak')
bk.write_text(s, encoding='utf-8')

ipa_texts = []

def repl(m):
    ipa = m.group(1).strip()
    ipa_texts.append(ipa)
    idx = len(ipa_texts)
    key = f"ipa-{idx:04d}"
    return f'<span class="ipa" data-ipa-id="{key}"></span>'

new = re.sub(r'<span\s+class="ipa">(.*?)</span>', repl, s, flags=re.DOTALL)

if not ipa_texts:
    print('No <span class="ipa"> matches found.')
    raise SystemExit(0)

# Write updated index.html
p.write_text(new, encoding='utf-8')

# Write data/ipa.json
data = {f"ipa-{i+1:04d}": ipa_texts[i] for i in range(len(ipa_texts))}
Path('data').mkdir(exist_ok=True)
with open(Path('data') / 'ipa.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'Extracted {len(ipa_texts)} IPA items to data/ipa.json and backed up index.html to index.html.bak')
