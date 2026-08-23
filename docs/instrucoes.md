# 🎵 Plataforma de Inglês através da Música

## 1. Visão do Projeto

Criar uma plataforma web moderna para aprender inglês através de músicas.

O utilizador deve conseguir:

* Escolher uma música.
* Ouvir a música.
* Acompanhar a letra.
* Visualizar a pronúncia em IPA.
* Comparar inglês escrito vs. pronúncia.
* Estudar vocabulário.
* Compreender expressões e estruturas.
* Repetir frases/trechos.
* Testar os conhecimentos adquiridos.
* Acompanhar o próprio progresso.

O produto deve combinar:

> **Music + English + Pronunciation + Vocabulary + Active Learning**

O objetivo não é apenas apresentar letras de músicas, mas transformar cada música numa **aula interativa de inglês**.

---

# 2. Princípios do Produto

## 2.1 Learning First

Toda decisão de UX deve responder:

> "Isto ajuda o utilizador a aprender inglês?"

Evitar funcionalidades que sejam visualmente interessantes, mas pedagogicamente inúteis.

## 2.2 Progressive Disclosure

Não mostrar toda a informação simultaneamente.

Exemplo:

1. Música
2. Letra
3. IPA
4. Tradução
5. Vocabulário
6. Explicação
7. Exercício

O utilizador deve poder aprofundar o conteúdo progressivamente.

## 2.3 Mobile First

A maior parte da experiência deve funcionar perfeitamente em:

* Mobile
* Tablet
* Desktop

A interface mobile não deve ser simplesmente uma versão reduzida do desktop.

---

# 3. Público-Alvo

## Público principal

Pessoas que:

* Estão a aprender inglês.
* Gostam de música.
* Têm dificuldade com pronúncia.
* Querem melhorar listening.
* Querem aprender inglês de forma contextual.
* Têm nível A1–B2.

## Níveis

A plataforma deve suportar:

* A1 — Beginner
* A2 — Elementary
* B1 — Intermediate
* B2 — Upper Intermediate
* C1 — Advanced

Cada música pode ter uma classificação de dificuldade.

Exemplo:

```text
Difficulty: B1
Vocabulary: B1
Pronunciation: B2
Listening: B1
```

---

# 4. Estrutura Principal do Site

## Páginas essenciais

```text
/
├── Home
├── Songs
├── Song/[slug]
├── Artists/[slug]
├── Lessons
├── Vocabulary
├── Pronunciation
├── Exercises
├── Progress
├── About
├── Search
├── Login
└── Profile
```

---

# 5. Home Page

A homepage deve explicar imediatamente o produto.

## Hero

Headline possível:

> Learn English through the music you love.

Subheadline:

> Improve your listening, vocabulary and pronunciation with interactive music lessons.

CTA principal:

> Start Learning

CTA secundário:

> Explore Songs

## Secções

### Featured Songs

Mostrar músicas recomendadas.

Cada card:

```text
Album Art
Song Title
Artist
Level
Duration
Difficulty
```

### How It Works

Explicar em 3–4 passos:

```text
01 — Choose a song
02 — Listen and read
03 — Study pronunciation
04 — Practice
```

### Learning Features

Mostrar:

* Lyrics
* IPA
* Vocabulary
* Pronunciation
* Listening exercises
* Progress tracking

### Popular Songs

Mostrar conteúdo popular.

### Recently Added

Mostrar músicas recentemente adicionadas.

---

# 6. Página da Música

Esta é a página mais importante do produto.

URL:

```text
/songs/song-name
```

Exemplo:

```text
/songs/some-song
```

## Estrutura

### Header da música

```text
[Album Cover]

Song Title
Artist

B1 · 4:12

[▶ Play]
```

Informações:

```text
English Level: B1
Vocabulary: Intermediate
Pronunciation: Intermediate
```

---

# 7. Music Player

O player deve ser persistente.

Funcionalidades:

* Play
* Pause
* Previous
* Next
* Seek
* Volume
* Playback speed
* Repeat
* Progress bar

Velocidades:

```text
0.5x
0.75x
1x
1.25x
1.5x
```

A velocidade reduzida é especialmente importante para estudantes.

---

# 8. Lyrics Experience

A letra deve ser apresentada linha por linha.

Exemplo:

```text
I remember when we were young
/aɪ rɪˈmembə wen wiː wə jʌŋ/

Eu lembro quando éramos jovens.
```

Cada linha deve poder ser expandida.

Estados:

```text
Normal
Hover
Active
Playing
Completed
```

Quando a música estiver a tocar, a linha atual deve ficar visualmente destacada.

---

# 9. IPA

A pronúncia deve ser uma funcionalidade central.

Exemplo:

```text
I remember when we were young

/aɪ rɪˈmembə wen wiː wə jʌŋ/
```

O utilizador deve poder:

```text
Show IPA
Hide IPA
```

Não apresentar IPA constantemente para utilizadores iniciantes.

---

# 10. Vocabulary

Palavras importantes devem ser identificadas.

Exemplo:

```text
remember
/rɪˈmembə/

verb

to recall something from memory
```

Cada palavra pode possuir:

* IPA
* Definição
* Tradução
* Classe gramatical
* Exemplos
* Nível CEFR
* Audio pronunciation
* Add to vocabulary

---

# 11. Interactive Vocabulary

Ao clicar numa palavra:

```text
┌─────────────────────────────┐
│ remember                    │
│ /rɪˈmembə/                  │
│                             │
│ verb                        │
│                             │
│ To recall something.        │
│                             │
│ [🔊 Listen] [＋ Save]        │
└─────────────────────────────┘
```

Evitar popups excessivos.

Em mobile, preferir bottom sheet.

---

# 12. Tradução

A tradução deve ser opcional.

Nunca tornar a tradução o elemento principal da experiência.

Ideal:

```text
English
IPA
Translation
```

Com toggles:

```text
☑ Lyrics
☐ IPA
☐ Translation
```

O utilizador controla a quantidade de informação apresentada.

---

# 13. Learning Modes

A música pode possuir diferentes modos.

## Mode 1 — Listen

Objetivo:

Listening comprehension.

Mostrar apenas:

```text
Audio
Lyrics
```

## Mode 2 — Pronunciation

Mostrar:

```text
Lyrics
IPA
Audio
```

## Mode 3 — Vocabulary

Destacar palavras importantes.

## Mode 4 — Study

Mostrar:

```text
Lyrics
IPA
Translation
Vocabulary
Grammar
```

## Mode 5 — Practice

Exercícios.

---

# 14. Exercícios

Cada música deve poder gerar exercícios.

## Fill in the blanks

```text
I ______ when we were young.

[ remember ]
[ forget ]
[ understand ]
```

## Listening

Tocar um trecho e pedir ao utilizador para escrever o que ouviu.

## Multiple choice

```text
What does "remember" mean?

A. Forget
B. Recall
C. Explain
D. Leave
```

## IPA → English

```text
/rɪˈmembə/

[ remember ]
```

## English → IPA

```text
remember

[ /rɪˈmembə/ ]
```

## Word ordering

```text
young / were / we / when

→ We were young when...
```

---

# 15. Sistema de Progresso

O utilizador deve conseguir visualizar:

```text
Songs completed
Minutes listened
Words learned
Exercises completed
Pronunciation practice
Current streak
```

Exemplo:

```text
Your Progress

12 Songs
438 Minutes
186 Words
74 Exercises

🔥 7 day streak
```

---

# 16. Sistema de Gamificação

Utilizar gamificação moderada.

Evitar transformar o produto num jogo.

Possibilidades:

* XP
* Streak
* Completed songs
* Vocabulary mastered
* Levels
* Achievements

Exemplo:

```text
🎵 First Song
Complete your first lesson.

🗣 Pronunciation Starter
Complete 10 pronunciation exercises.

📚 Word Collector
Learn 100 words.
```

---

# 17. Pesquisa

A pesquisa deve permitir procurar por:

* Música
* Artista
* Palavra
* Nível
* Tema

Exemplo:

```text
Search songs, artists or vocabulary...
```

Filtros:

```text
Level
A1
A2
B1
B2
C1

Genre
Pop
Rock
Hip-Hop
R&B
Indie

Difficulty
Easy
Medium
Hard
```

---

# 18. SEO

SEO deve ser pensado desde o início.

Cada música deve possuir uma página indexável.

Exemplo:

```text
/songs/song-name
```

Title:

```text
Song Name — Learn English with Lyrics, IPA & Vocabulary
```

Description:

```text
Learn English with Song Name. Study the lyrics,
IPA pronunciation, vocabulary and listening exercises.
```

## Structured Data

Implementar Schema.org quando aplicável:

* MusicRecording
* MusicGroup
* WebPage
* BreadcrumbList
* FAQPage
* Article, quando semanticamente apropriado

Não utilizar structured data apenas para manipular resultados de pesquisa.

---

# 19. SEO Técnico

Implementar:

* Semantic HTML
* Correct heading hierarchy
* `<title>`
* Meta description
* Canonical URL
* Open Graph
* Twitter/X Cards
* Sitemap
* Robots.txt
* Structured data
* Clean URLs
* Internal linking
* Breadcrumbs
* Alt text
* Fast loading
* Mobile usability

Cada página deve possuir apenas um:

```html
<h1>
```

Utilizar:

```text
H1
 ├── H2
 │    ├── H3
 │    └── H3
 └── H2
```

---

# 20. SEO de Conteúdo

Não depender apenas do nome das músicas.

Criar conteúdo contextual.

Exemplo:

```text
/songs/song-name
/songs/song-name/vocabulary
/songs/song-name/pronunciation
/songs/song-name/meaning
```

Também podem existir páginas educativas:

```text
/learn/english-pronunciation
/learn/ipa
/learn/english-through-music
/learn/connected-speech
/learn/phrasal-verbs
```

Isso cria uma arquitetura de conteúdo capaz de gerar tráfego orgânico.

---

# 21. Internal Linking

As páginas devem estar conectadas.

Exemplo:

```text
Song
 ↓
Artist
 ↓
Other songs
 ↓
Vocabulary
 ↓
Grammar lesson
 ↓
Pronunciation lesson
```

Nunca deixar páginas importantes isoladas.

---

# 22. Design System

Criar um design system antes de construir todas as páginas.

Definir:

### Colors

```text
Primary
Secondary
Background
Surface
Text
Muted
Success
Warning
Error
```

### Typography

Definir:

```text
Font family
Heading sizes
Body sizes
Line heights
Letter spacing
```

### Spacing

Utilizar uma escala consistente.

Exemplo:

```text
4
8
12
16
24
32
48
64
```

Evitar valores aleatórios como:

```text
17px
23px
37px
51px
```

sem necessidade.

---

# 23. Componentes

Criar componentes reutilizáveis.

Exemplo:

```text
Button
Card
SongCard
ArtistCard
AudioPlayer
LyricsLine
IPAText
VocabularyCard
ProgressBar
Modal
BottomSheet
Dropdown
Tabs
Badge
Tooltip
SearchInput
Pagination
Breadcrumb
```

O mesmo componente deve ser utilizado em diferentes páginas sempre que possível.

---

# 24. UX

## Estados obrigatórios

Todo componente interativo deve considerar:

```text
Default
Hover
Focus
Active
Disabled
Loading
Error
Success
```

## Empty States

Exemplo:

```text
No songs found.

Try another search or remove some filters.
```

## Loading

Evitar ecrãs completamente vazios.

Utilizar:

* Skeletons
* Spinners apenas quando apropriado
* Progressive loading

---

# 25. Acessibilidade

Seguir WCAG.

Garantir:

* Contraste adequado
* Navegação por teclado
* Focus states
* Labels
* ARIA quando necessário
* Semântica HTML
* Alt text
* Botões verdadeiros para ações
* Links verdadeiros para navegação
* Não depender exclusivamente de cor

Exemplo:

Não fazer:

```html
<div onclick="playSong()">
```

Preferir:

```html
<button>
```

---

# 26. Responsividade

Breakpoints devem ser definidos pelo design system.

Exemplo:

```text
Mobile
Tablet
Desktop
Large Desktop
```

A interface deve adaptar:

### Desktop

```text
Sidebar | Lyrics | Vocabulary
```

### Mobile

```text
Header
Player
Lyrics
Vocabulary
```

O player deve permanecer facilmente acessível no mobile.

---

# 27. Performance

Prioridades:

1. HTML inicial rápido
2. CSS mínimo
3. JavaScript apenas quando necessário
4. Lazy loading
5. Images otimizadas
6. Audio otimizado
7. Cache
8. CDN
9. Code splitting

Monitorizar:

* LCP
* INP
* CLS
* TTFB

Objetivo:

```text
Fast
Stable
Responsive
```

---

# 28. Imagens

Nunca carregar imagens gigantes sem necessidade.

Utilizar formatos modernos quando apropriado:

```text
WebP
AVIF
```

Definir:

```html
width
height
```

para evitar layout shift.

Utilizar `loading="lazy"` para imagens fora do viewport inicial.

---

# 29. Áudio

O áudio deve ser tratado como elemento crítico.

Considerar:

* Streaming progressivo
* Preloading inteligente
* Compression
* Caching
* Playback state
* Current timestamp
* Synchronization with lyrics

A arquitetura deve permitir sincronizar:

```text
Audio timestamp
        ↓
Lyrics line
        ↓
Word
```

No futuro:

```text
Audio timestamp
        ↓
Word timestamp
        ↓
IPA
        ↓
Vocabulary
```

Isso permitirá uma experiência muito mais avançada.

---

# 30. Arquitetura de Dados

Estrutura conceptual:

```text
Artist
 └── Songs
      └── Sections
           └── Lines
                └── Words
```

Exemplo:

```json
{
  "song": {
    "title": "Example Song",
    "artist": "Example Artist",
    "level": "B1",
    "duration": 240
  }
}
```

Cada linha pode possuir:

```text
text
translation
ipa
startTime
endTime
words
```

---

# 31. Separar Conteúdo de Interface

Muito importante.

Não colocar todas as letras e IPA diretamente nos componentes.

Separar:

```text
UI
Content
Data
Logic
```

Exemplo:

```text
/content
  songs/
    song-name.json
```

O frontend apenas interpreta os dados.

Isso permitirá adicionar centenas ou milhares de músicas sem reescrever componentes.

---

# 32. Stack Recomendada

Uma stack moderna possível:

### Frontend

```text
Next.js
React
TypeScript
```

### Styling

```text
Tailwind CSS
```

ou um sistema baseado em CSS Modules.

### UI

Utilizar uma biblioteca acessível como base quando fizer sentido.

Possibilidades:

```text
Radix UI
shadcn/ui
Headless UI
```

Não utilizar uma biblioteca apenas porque está na moda.

Cada dependência deve resolver um problema real.

### Icons

```text
Lucide
```

### Forms

```text
React Hook Form
Zod
```

### State

Começar com:

```text
React state
Context
URL state
```

Só adicionar Zustand/Redux/etc. quando houver necessidade real.

---

# 33. Backend

Se existir autenticação, progresso, favoritos e vocabulário pessoal, será necessário persistir dados.

Modelo conceptual:

```text
User
Song
Artist
Lesson
Vocabulary
Exercise
UserProgress
SavedWord
CompletedLesson
```

Não misturar dados públicos das músicas com dados privados do utilizador.

---

# 34. Segurança

Implementar:

* Authentication segura
* Authorization
* Input validation
* Rate limiting
* CSRF protection quando aplicável
* Secure cookies
* Environment variables
* Não expor secrets no frontend

Nunca guardar:

```text
API_KEY
DATABASE_PASSWORD
SECRET
```

diretamente no código.

---

# 35. URLs

URLs devem ser:

* Curtas
* Legíveis
* Estáveis
* Sem IDs desnecessários

Preferir:

```text
/songs/bohemian-rhapsody
```

em vez de:

```text
/song?id=8291837
```

---

# 36. Analytics

Medir comportamento de aprendizagem, não apenas pageviews.

Eventos importantes:

```text
song_started
song_completed
lyrics_line_clicked
ipa_toggled
translation_toggled
word_saved
exercise_started
exercise_completed
audio_speed_changed
lesson_completed
```

Isso permitirá descobrir quais funcionalidades realmente ajudam os estudantes.

---

# 37. Privacy

Não recolher dados desnecessários.

Definir claramente:

* Que dados são recolhidos.
* Porquê.
* Durante quanto tempo.
* Como eliminar os dados.

Considerar requisitos de privacidade aplicáveis ao público europeu.

---

# 38. Conteúdo Musical e Direitos

Este ponto é crítico.

Antes de colocar músicas, letras, gravações, traduções ou outros conteúdos protegidos no site, verificar os respetivos direitos/licenças.

A arquitetura do sistema deve permitir separar:

```text
Original content
Licensed content
Third-party content
User-generated content
```

Não assumir que uma música disponível publicamente pode ser reproduzida, armazenada ou redistribuída livremente.

---

# 39. Arquitetura de Pastas

Uma possível estrutura:

```text
src/
├── app/
│   ├── page.tsx
│   ├── songs/
│   ├── artists/
│   ├── lessons/
│   ├── vocabulary/
│   └── profile/
│
├── components/
│   ├── ui/
│   ├── music/
│   ├── lyrics/
│   ├── vocabulary/
│   └── learning/
│
├── content/
│   ├── songs/
│   ├── artists/
│   └── lessons/
│
├── lib/
│   ├── audio/
│   ├── seo/
│   ├── analytics/
│   └── utils/
│
├── hooks/
├── types/
└── styles/
```

---

# 40. Estratégia de Desenvolvimento

Não construir tudo simultaneamente.

## Fase 1 — MVP

Criar:

* Homepage
* Lista de músicas
* Página de música
* Audio player
* Lyrics
* IPA
* Tradução
* Vocabulary
* Responsive design

Objetivo:

> Uma pessoa consegue aprender uma música do início ao fim.

---

## Fase 2 — Learning

Adicionar:

* Exercícios
* Flashcards
* Saved vocabulary
* Progress
* User accounts

---

## Fase 3 — Personalization

Adicionar:

* Recommended songs
* Learning paths
* Difficulty adaptation
* Personal vocabulary
* Streaks
* Statistics

---

## Fase 4 — Advanced

Adicionar eventualmente:

* Word-level synchronization
* Speech recognition
* Pronunciation scoring
* AI explanations
* Personalized exercises
* Adaptive learning

Não começar pela Fase 4.

---

# 41. Critérios de Qualidade

Antes de considerar uma página terminada:

### UX

* [ ] É intuitiva sem explicação?
* [ ] O utilizador sabe qual é a ação principal?
* [ ] Não existem elementos desnecessários?
* [ ] Funciona bem em mobile?

### Accessibility

* [ ] Funciona com teclado?
* [ ] Tem focus states?
* [ ] Tem contraste suficiente?
* [ ] Utiliza HTML semântico?

### SEO

* [ ] Title correto?
* [ ] Meta description?
* [ ] H1 correto?
* [ ] Canonical?
* [ ] Open Graph?
* [ ] Structured data quando apropriado?
* [ ] Internal links?

### Performance

* [ ] Imagens otimizadas?
* [ ] Audio otimizado?
* [ ] Lazy loading?
* [ ] JavaScript minimizado?
* [ ] Layout estável?

### Code

* [ ] TypeScript sem `any` desnecessário?
* [ ] Componentes reutilizáveis?
* [ ] Sem duplicação?
* [ ] Dados separados da UI?
* [ ] Estados de loading/error tratados?

---

# 42. Princípio Fundamental

A plataforma não deve ser construída como:

> "Um site onde coloco músicas e letras."

Deve ser construída como:

> **"Uma plataforma de aprendizagem onde cada música é transformada numa experiência completa de estudo de inglês."**

A música é o conteúdo.

A aprendizagem é o produto.

---

# 43. Roadmap Inicial

```text
STEP 01
Design System

↓

STEP 02
Homepage

↓

STEP 03
Song database / content structure

↓

STEP 04
Song page

↓

STEP 05
Audio player

↓

STEP 06
Synchronized lyrics

↓

STEP 07
IPA

↓

STEP 08
Vocabulary

↓

STEP 09
Exercises

↓

STEP 10
Authentication

↓

STEP 11
Progress

↓

STEP 12
SEO

↓

STEP 13
Performance

↓

STEP 14
Accessibility

↓

STEP 15
Analytics

↓

STEP 16
Production
```

---

# 44. Regra de Ouro para o Desenvolvimento

Antes de adicionar qualquer feature, perguntar:

1. Isto ajuda o utilizador a aprender?
2. Isto melhora a experiência?
3. É acessível?
4. É necessário?
5. É performante?
6. É escalável?
7. É fácil de manter?
8. Tem impacto real no produto?

Se a resposta for "não" para a maioria, a feature deve ser reconsiderada.

---

# 45. Definition of Done

Uma funcionalidade só está concluída quando:

```text
✓ UX implementada
✓ Responsive
✓ Accessible
✓ Loading state
✓ Error state
✓ Empty state
✓ SEO considerado
✓ Performance considerada
✓ Analytics considerado
✓ TypeScript validado
✓ Testado em mobile
✓ Testado em desktop
```

O objetivo é construir uma plataforma **rápida, acessível, semanticamente correta, escalável e pedagogicamente útil**, em vez de apenas uma interface visualmente bonita.

---

# 46. Preservação e edição dos IPAs (crucial)

Os IPAs personalizados são um ativo crítico e devem ser preservados cuidadosamente.

Arquivos principais:

- data/ipa.json — mapa id → transcrição IPA (fonte autoritativa).
- data/song-<id>.json — campo "ipa" por linha.

Recomendações operacionais:

1. Antes de grandes mudanças, criar um backup: git tag pre-reorg-YYYYMMDD && git push origin --tags
2. Edição de IPAs: editar localmente os JSONs -> criar branch feature/ipa-edit-<id> -> abrir PR com diffs JSON -> Review -> Merge.
3. Não editar IPAs diretamente na branch main sem PR. Use o fluxo de PR para revisão e manter histórico.
4. Fazer exportações periódicas (zip) de data/ e armazenar fora do repositório para segurança adicional.

---

# 47. JSON Schema para validação de conteúdo

Ter um schema JSON permite validar automaticamente os arquivos de música antes do deploy ou PR.

Exemplo simplificado (docs/schema/song-schema.json):

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "artist": { "type": "string" },
    "level": { "type": ["string","null"] },
    "duration": { "type": ["number","null"] },
    "lines": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "line_id": { "type": "string" },
          "text": { "type": "string" },
          "ipa": { "type": ["string", "null"] },
          "chords": { "type": ["string", "array", "null"] },
          "time_start": { "type": ["number", "null"] },
          "time_end": { "type": ["number", "null"] },
          "grammar_notes": { "type": ["string", "null"] }
        },
        "required": ["line_id","text"]
      }
    }
  },
  "required": ["id","title","lines"]
}
```

Validação rápida local (exemplo):

- Instalar ajv-cli: npm install -g ajv-cli  (ou usar npx)
- Validar: npx ajv validate -s docs/schema/song-schema.json -d data/song-<id>.json

---

# 48. Fluxo Git, Branching e Backups

Recomendações de branching:

- main — conteúdo publicado (proteja esta branch)
- develop — integração contínua
- feature/* — novas features
- hotfix/* — correções críticas

Antes de operações destrutivas:

- Tag de backup: git tag pre-YYYYMMDD && git push origin --tags
- Para grandes reorganizações, criar branch e PR; só forçar main com confirmação explícita.

Como recuperar commits removidos por force-push (rápido):

```bash
# encontrar SHA antigo
git reflog
# criar branch a partir do SHA
git checkout -b restore-old <SHA>
# subir para remoto
git push origin restore-old
```

---

# 49. Como começar localmente — passos práticos

Exemplo com Svelte + Vite (diretório separado do repositório atual):

```bash
# fora deste repositório, criar app front-end
mkdir ~/dev && cd ~/dev
npm create vite@latest music-app -- --template svelte
cd music-app
npm install
# copiar dados para public
cp -r /path/to/this/repo/data public/data
npm run dev
```

Exemplo com Next.js (React + TypeScript):

```bash
npx create-next-app@latest music-app --ts
cd music-app
cp -r /path/to/this/repo/data public/data
npm run dev
```

Notas:
- Mantenha os dados separados do código (public/data ou CDN).
- No desenvolvimento, um pequeno script pode sincronizar /data para public/data automaticamente.

---

# 50. CI / Deploy (práticas)

- Preferir que GITHUB_TOKEN tenha permissão Read and write para permitir actions que pusham (pages, assets).
- Alternativa: criar um PAT (scope repo) e guardá-lo em Settings → Secrets → GITHUB_PAGES_PAT e configurar a action para usar o PAT quando necessário.

Exemplo mínimo de step (peaceiris/actions-gh-pages):

```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v4
  with:
    github_token: ${{ secrets.GITHUB_PAGES_PAT }} # ou ${{ secrets.GITHUB_TOKEN }} se Read/Write
    publish_dir: ./dist
```

Checklist pré-deploy:

- Validar JSONs (schema)
- Tag de backup criada
- Build local/testes OK
- IPAs verificados (grep por null/empty)
- Verificar permissões do token

---

# 51. Checklist resumido antes de publicar

- [ ] backup/tag criado
- [ ] JSONs validados
- [ ] IPAs revisados
- [ ] Build local OK
- [ ] Testes básicos passados
- [ ] Token para deploy configurado


---

_Fim das adições: estas secções tornam as instruções mais imediatas, acionáveis e seguras para preservar os IPAs e iniciar o desenvolvimento._