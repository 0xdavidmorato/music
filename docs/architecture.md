# Arquitetura — Music Learner (minimal)

Objetivo: manter um repositório mínimo contendo apenas os dados das músicas e as transcrições IPA personalizadas para preservar seu trabalho enquanto iniciamos a reescrita do site.

Dados
- data/ipa.json
  - Mapa global de identificadores -> IPA strings.
  - Fonte autoritativa das transcrições fonéticas personalizadas.

- data/song-<id>.json
  - Modelo JSON (array de linhas) com campos:
    - line_id: string
    - text: string (lyrics line)
    - ipa: string | null
    - chords: optional string or array (chord markup above line)
    - time_start: number | null (seconds)
    - time_end: number | null (seconds)
    - grammar_notes: optional string

Fluxo de trabalho inicial
- Todas as edições nas IPAs devem ser feitas no arquivo data/song-<id>.json e no data/ipa.json.
- Para mudar para a nova aplicação (Svelte/Vite ou outra) criar um projeto isolado e consumir esses JSONs via fetch.

Deploy / Histórico
- Esta mudança substitui o conteúdo do repositório por um snapshot mínimo. Os commits anteriores permanecem no histórico Git e podem ser recuperados se necessário.

Licença e Conteúdo
- Garanta que você tem direitos para publicar letras e áudios caso o site vá para um domínio público.

