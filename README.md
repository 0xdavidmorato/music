# Repertório · David

Estúdio pessoal de canto e pronúncia — letra e transcrição fonética (IPA adaptado) frase a frase, num modo **Teleprompter** com rolagem automática, controlo de velocidade e pausa.

## Como funciona

- **`data/repertorio.json`** — a fonte de verdade (editável à mão): contém a apresentação pessoal e todas as músicas, cada uma com letra e transcrição frase a frase.
- **`data/repertorio-data.js`** — bundle que a página carrega (gerado a partir do `repertorio.json`). Não editar à mão.
- **`scripts/build_bundle.py`** — converte `repertorio.json` → `repertorio-data.js`.

## Adicionar uma música

### Opção A — na página (rápido, fica no navegador)
1. Clica em **“Adicionar música”**.
2. Preenche título, artista, capa (opcional) e as linhas (letra + transcrição).
3. “Salvar música” → fica no teu navegador (localStorage).
4. Usa **“Exportar repertorio.json”** para guardar as adições num ficheiro.

### Opção B — direto no ficheiro (recomendado, permanente)
1. Edita `data/repertorio.json` e acrescenta a música ao array `songs`:

   ```json
   {
     "id": "nova-musica",
     "class": "nova-musica",
     "lyrics_id": "lyrics-nova",
     "title": "Titulo",
     "artist": "Artista",
     "image": "imagens/nova_musica.jpg",
     "lyrics": [
       { "section": null, "phrase": "Frase um", "ipa": "transcricao", "ipa_id": null },
       { "section": "Refrao", "phrase": "Frase dois", "ipa": "transcricao", "ipa_id": null }
     ]
   }
   ```

2. Coloca a capa em `imagens/` (opcional — sem imagem usa um placeholder).
3. Roda `python3 scripts/build_bundle.py`.
4. Recarrega a página.

## Atalhos no Teleprompter

- **Espaço** — reproduzir / pausar
- **↓ / ↑** — aumentar / diminuir velocidade
- **Esc** — fechar
