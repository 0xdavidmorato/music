# Development Guide (minimal)

1) Objetivo
- Iniciar um novo projeto front-end que consuma dados de data/*.json.

2) Requisitos sugeridos (local)
- Node.js LTS (>=18)
- Editor: VSCode

3) Primeiro passo (exemplo com Svelte + Vite)
- Em pasta separada (fora deste repositório), rodar:
  npm create vite@latest music-app -- --template svelte
  cd music-app
  npm install
  # Durante desenvolvimento, servir os dados locais com um pequeno servidor, ou configure proxy para os JSONs

4) Como usar estes dados
- Coloque os arquivos de data do repositório (data/*.json) em `public/data/` do novo app, ou sirva via URL estática.
- Exemplo fetch: `fetch('/data/song-viva-la-vida.json').then(r => r.json())`

