import './style.css'

// Minimal song-list + player prototype for development
// Loads data from /data/*.json copied into public for the dev server

type SongIndex = { id: string; title: string; artist?: string; file?: string }

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main>
    <h1>Music — Development Playground</h1>
    <div id="app-root">
      <aside id="songs-list">
        <h2>Songs</h2>
        <ul id="songs"></ul>
      </aside>

      <section id="player-area">
        <h2 id="song-title">Select a song</h2>
        <div id="player-controls"></div>
        <div id="lyrics"></div>
      </section>
    </div>
  </main>
`

const songsListEl = document.getElementById('songs')!
const lyricsEl = document.getElementById('lyrics')!
const titleEl = document.getElementById('song-title')!
const controlsEl = document.getElementById('player-controls')!

async function loadSongsIndex() {
  try {
    const r = await fetch('data/songs.json')
    const list: SongIndex[] = await r.json()
    renderSongs(list)
  } catch (err) {
    songsListEl.innerHTML = `<li>Error loading songs.json</li>`
    console.error(err)
  }
}

function renderSongs(list: SongIndex[]) {
  songsListEl.innerHTML = ''
  for (const s of list) {
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.href = '#'
    a.textContent = `${s.title}${s.artist ? ' — ' + s.artist : ''}`
    a.addEventListener('click', (ev) => {
      ev.preventDefault()
      openSong(s)
    })
    li.appendChild(a)
    songsListEl.appendChild(li)
  }
}

async function openSong(s: SongIndex) {
  titleEl.textContent = `${s.title}${s.artist ? ' — ' + s.artist : ''}`
  lyricsEl.innerHTML = 'Loading song...'
  controlsEl.innerHTML = ''

  try {
    const r = await fetch(`data/${s.file ?? s.id}.json`)
    const song = await r.json()

    // try to load IPA map as well
    let ipaMap: Record<string, string> = {}
    try {
      const ri = await fetch('data/ipa.json')
      ipaMap = await ri.json()
    } catch (_) {
      // ipa.json missing is not fatal in dev
    }

    renderSong(song, ipaMap)
  } catch (err) {
    lyricsEl.innerHTML = '<p>Error loading song file</p>'
    console.error(err)
  }
}

function renderSong(song: any, ipaMap: Record<string, string>) {
  controlsEl.innerHTML = ''
  lyricsEl.innerHTML = ''

  // Container for audio and sync
  let audio: HTMLAudioElement | null = null

  // If song.audio exists, wire a simple audio element
  if (song.audio) {
    audio = document.createElement('audio')
    audio.controls = true
    audio.src = song.audio
    audio.setAttribute('data-test', 'song-audio')
    controlsEl.appendChild(audio)
  }

  // Render lines with IPA (preserve ipa field or lookup in ipaMap)
  if (Array.isArray(song.lines)) {
    const ul = document.createElement('ol')
    ul.className = 'lyrics'
    // prepare an index map of line elements to allow quick highlight
    const lineEls: Array<{ id?: string; el: HTMLLIElement; start?: number; end?: number }> = []

    for (const line of song.lines) {
      const li = document.createElement('li')
      li.className = 'lyric-line'
      li.dataset.lineId = line.id ?? ''

      const textDiv = document.createElement('div')
      textDiv.className = 'lyric-text'
      textDiv.textContent = line.text

      const ipaDiv = document.createElement('div')
      ipaDiv.className = 'lyric-ipa'
      const ipa = line.ipa ?? (line.id && ipaMap[line.id]) ?? ''
      // preserve IPA exactly as stored; do not normalize
      ipaDiv.textContent = ipa

      // small edit button for IPA (opens inline editor)
      const editBtn = document.createElement('button')
      editBtn.className = 'ipa-edit-btn'
      editBtn.textContent = 'Editar IPA'
      editBtn.addEventListener('click', () => openIpaEditor(line, ipaDiv))

      li.appendChild(textDiv)
      li.appendChild(ipaDiv)
      li.appendChild(editBtn)
      ul.appendChild(li)

      const start = typeof line.time_start === 'number' ? line.time_start : (line.time_start ? Number(line.time_start) : undefined)
      const end = typeof line.time_end === 'number' ? line.time_end : (line.time_end ? Number(line.time_end) : undefined)
      lineEls.push({ id: line.id, el: li, start, end })
    }

    lyricsEl.appendChild(ul)

    // Highlighting logic: if audio exists, listen to timeupdate
    if (audio) {
      let lastIndex = -1
      const updateHighlight = () => {
        const t = audio!.currentTime
        // find the active line
        let found = -1
        for (let i = 0; i < lineEls.length; i++) {
          const li = lineEls[i]
          if (li.start !== undefined && li.end !== undefined) {
            if (t >= li.start && t <= li.end) { found = i; break }
          } else if (li.start !== undefined && li.end === undefined) {
            // if only start is present, consider it active until next start
            const next = lineEls[i+1]
            const nextStart = next && next.start !== undefined ? next.start : Number.POSITIVE_INFINITY
            if (t >= li.start && t < nextStart) { found = i; break }
          }
        }

        if (found !== lastIndex) {
          if (lastIndex >= 0) lineEls[lastIndex].el.classList.remove('current')
          if (found >= 0) lineEls[found].el.classList.add('current')
          lastIndex = found
        }
      }

      audio.addEventListener('timeupdate', updateHighlight)
      audio.addEventListener('seeked', updateHighlight)
      // initial check
      audio.addEventListener('play', updateHighlight)
    }

    // Export button: download the currently loaded song JSON (as edited in-memory)
    const exportBtn = document.createElement('button')
    exportBtn.className = 'export-json-btn'
    exportBtn.textContent = 'Exportar JSON'
    exportBtn.addEventListener('click', () => {
      try {
        // attempt to build a filename from song.id or fallback
        const fname = (song && (song.id || song.file)) ? `${song.id || song.file}.json` : `song-export-${Date.now()}.json`
        const blob = new Blob([JSON.stringify(song, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fname
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
      } catch (err) {
        console.error('Export failed', err)
        alert('Falha ao exportar JSON. Veja o console para detalhes.')
      }
    })

    controlsEl.appendChild(exportBtn)

    // Save directly as PR via local server (requires server/create-pr-server.js running and gh auth)
    const savePrBtn = document.createElement('button')
    savePrBtn.className = 'save-pr-btn'
    savePrBtn.textContent = 'Salvar (PR)'
    savePrBtn.addEventListener('click', async () => {
      const fname = (song && (song.id || song.file)) ? `${song.id || song.file}.json` : `song-export-${Date.now()}.json`
      const branch = `autosave/${fname.replace(/\W+/g,'-')}-${Date.now()}`
      const title = `Update data: ${fname}`
      const body = `Atualização via editor de IPA`

      // Basic validation: ensure at least one IPA exists, and JSON is well-formed
      try {
        if (!song || typeof song !== 'object') throw new Error('Song data missing or invalid')
        if (!Array.isArray(song.lines)) throw new Error('Song has no lines')
        const nonEmptyIpas = song.lines.filter((l:any)=> (l.ipa && String(l.ipa).trim().length>0))
        if (nonEmptyIpas.length === 0) {
          // proceed but warn
          const proceed = confirm('Nenhuma linha tem IPA preenchido. Deseja continuar e criar o PR mesmo assim?')
          if (!proceed) return
        }
      } catch (e) {
        alert('Validação básica falhou: ' + e.message)
        return
      }

      try {
        const resp = await fetch('http://127.0.0.1:8787/create-pr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: fname, branch, title, body, file: song })
        })
        const json = await resp.json()
        if (!resp.ok) {
          console.error('PR server error', json)
          alert('Falha ao criar PR: ' + (json.error || JSON.stringify(json)))
          return
        }
        const prUrl = json.prUrl || 'ver console'
        // show link and copy to clipboard
        try { await navigator.clipboard.writeText(prUrl) } catch (_) {}
        alert('PR criado (rascunho). URL copiada para clipboard: ' + prUrl)
        console.log('PR server response', json)
      } catch (err) {
        console.error('Failed to call PR server', err)
        alert('Falha ao contactar o servidor local. Inicie `node server/create-pr-server.js` e tente novamente.')
      }
    })
    controlsEl.appendChild(savePrBtn)
  } else {
    lyricsEl.innerHTML = '<p>No lines found in song file.</p>'
  }
}

// Simple inline IPA editor (modal-free, inline replacement)
function openIpaEditor(line: any, ipaDiv: HTMLElement) {
  const current = line.ipa ?? ''
  const wrapper = document.createElement('div')
  wrapper.className = 'ipa-editor-wrapper'

  const input = document.createElement('input')
  input.type = 'text'
  input.value = current
  input.className = 'ipa-editor-input'
  input.setAttribute('aria-label', 'Editar IPA')

  const save = document.createElement('button')
  save.textContent = 'Salvar local'
  save.className = 'ipa-editor-save'
  save.addEventListener('click', () => {
    const newVal = input.value
    // update DOM
    ipaDiv.textContent = newVal
    // update in-memory model so user can export later
    line.ipa = newVal
    wrapper.remove()
  })

  const cancel = document.createElement('button')
  cancel.textContent = 'Cancelar'
  cancel.className = 'ipa-editor-cancel'
  cancel.addEventListener('click', () => wrapper.remove())

  wrapper.appendChild(input)
  wrapper.appendChild(save)
  wrapper.appendChild(cancel)

  // replace ipaDiv with wrapper temporarily
  ipaDiv.insertAdjacentElement('afterend', wrapper)
  input.focus()
}

// start
loadSongsIndex()
