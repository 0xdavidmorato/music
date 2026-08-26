#!/usr/bin/env python3
"""
Converte data/repertorio.json (fonte de verdade, editável à mão)
em data/repertorio-data.js — o bundle que a página carrega.

Fluxo de trabalho diário para adicionar músicas:
  1) Edita data/repertorio.json (acrescenta a música com letra+IPA frase a frase).
  2) Roda:  python3 scripts/build_bundle.py
  3) Recarrega a página. (Alternativa: usa o botão "Adicionar música" na página.
     As adições feitas na página ficam no navegador e podes exportá-las
     para repertorio.json com o botão "Exportar".)

Uso:
    python3 scripts/build_bundle.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "data" / "repertorio.json"
OUT = ROOT / "data" / "repertorio-data.js"

data = json.loads(SRC.read_text(encoding="utf-8"))

js = "// Gerado por scripts/build_bundle.py a partir de data/repertorio.json.\n"
js += "// Não editar este ficheiro à mão — edita data/repertorio.json.\n"
js += "window.REPERTORIO = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n"
OUT.write_text(js, encoding="utf-8")

n = len(data.get("songs", []))
lines = sum(len(s.get("lyrics", [])) for s in data.get("songs", []))
print(f"OK: {OUT}")
print(f"  - Músicas: {n}")
print(f"  - Frases com transcrição: {lines}")
