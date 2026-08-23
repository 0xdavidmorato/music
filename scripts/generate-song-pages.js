#!/usr/bin/env node
// scripts/generate-song-pages.js
// Read data/songs.json and data/song-<id>.json and generate simple static pages under docs/songs/<id>.html

const fs = require('fs')
const path = require('path')

const dataDir = path.resolve(__dirname, '..', 'data')
const outDir = path.resolve(__dirname, '..', 'docs', 'songs')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

function safe(text) {
  return String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const songsIndexPath = path.join(dataDir, 'songs.json')
if (!fs.existsSync(songsIndexPath)) {
  console.error('Missing songs.json at', songsIndexPath)
  process.exit(1)
}

const songsIndex = JSON.parse(fs.readFileSync(songsIndexPath, 'utf8'))
let count = 0
for (const s of songsIndex) {
  const id = s.id || s.file || ''
  if (!id) continue
  // allow songs.json to point to a data file via s.data, or try common patterns
  let songPath = ''
  if (s.data) {
    songPath = path.isAbsolute(s.data) ? s.data : path.join(__dirname, '..', s.data)
  } else {
    const candidates = [path.join(dataDir, `${id}.json`), path.join(dataDir, `song-${id}.json`)]
    songPath = candidates.find(p => fs.existsSync(p)) || candidates[0]
  }
  if (!fs.existsSync(songPath)) {
    console.warn('Missing song file for', id, 'expected at', songPath)
    continue
  }
  const song = JSON.parse(fs.readFileSync(songPath, 'utf8'))

  const title = safe(song.title || s.title || id)
  const artist = safe(song.artist || s.artist || s.artist || '')
  const description = safe((song.description || '').slice(0, 200))

  const linesHtml = (Array.isArray(song.lines) ? song.lines.map(l => {
    const text = safe(l.text || '')
    const ipa = safe(l.ipa || '')
    const chords = safe(l.chords || '')
    return `<li class=\"song-line\"><div class=\"line-text\">${text}</div><div class=\"line-ipa\">${ipa}</div><div class=\"line-chords\">${chords}</div></li>`
  }).join('\n') : '')

  const audioTag = song.audio ? `<audio controls src=\"${safe(song.audio)}\"></audio>` : ''

  const html = `<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title}${artist ? ' — ' + artist : ''}</title>
  <meta name="description" content="${description}" />
  <link rel="stylesheet" href="/frontend/src/style.css" />
  <style>
    body{font-family:system-ui,Segoe UI,Roboto,'Helvetica Neue',Arial,sans-serif;padding:20px}
    .song{max-width:900px;margin:0 auto}
    .song h1{margin-bottom:0}
    .song .meta{color:#666;margin-bottom:10px}
    ol.song-lines{list-style:none;padding:0}
    li.song-line{padding:6px 0;border-bottom:1px solid #eee}
    .line-text{font-size:1.1rem}
    .line-ipa{color:#007700;font-family:monospace}
    .line-chords{color:#333;font-weight:600}
    /* current highlight for active line */
    li.song-line.current{background:linear-gradient(90deg,rgba(255,245,200,0.6),rgba(255,250,230,0.6));}
  </style>
</head>
<body>
  <div class="song">
    <h1>${title}</h1>
    <div class="meta">${artist || ''}</div>
    ${audioTag}
    <ol class="song-lines">
${linesHtml}
    </ol>
    <footer style="margin-top:20px;color:#888">Gerado automaticamente — mantenha IPAs em data/ipa.json</footer>
  </div>

  <script>
  // Inline player highlight script: reads data-start/data-end attributes on .song-line elements
  (function(){
    const audio = document.querySelector('audio')
    if(!audio) return
    const lines = Array.from(document.querySelectorAll('li.song-line'))
    // parse start/end from data attributes on child elements if present
    const entries = lines.map((li,i)=>{
      const startAttr = li.getAttribute('data-start')
      const endAttr = li.getAttribute('data-end')
      const start = startAttr ? Number(startAttr) : undefined
      const end = endAttr ? Number(endAttr) : undefined
      return { li, start, end }
    })

    function update(){
      const t = audio.currentTime
      let found = -1
      for(let i=0;i<entries.length;i++){
        const e = entries[i]
        if(e.start!=null && e.end!=null){
          if(t>=e.start && t<=e.end){ found = i; break }
        } else if(e.start!=null && e.end==null){
          const next = entries[i+1]
          const nextStart = next && next.start!=null ? next.start : Infinity
          if(t>=e.start && t<nextStart){ found = i; break }
        }
      }
      entries.forEach((e,idx)=>{
        if(idx===found) e.li.classList.add('current')
        else e.li.classList.remove('current')
      })
    }

    audio.addEventListener('timeupdate', update)
    audio.addEventListener('seeked', update)
    audio.addEventListener('play', update)
  })()
  </script>
</body>
</html>`

  const outPath = path.join(outDir, `${id}.html`)
  fs.writeFileSync(outPath, html, 'utf8')
  console.log('Wrote', outPath)
  count++
}

console.log('Generated', count, 'pages')
