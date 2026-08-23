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
    const r = await fetch('/data/songs.json')
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
    const r = await fetch(`/data/${s.file ?? s.id}.json`)
    const song = await r.json()

    // try to load IPA map as well
    let ipaMap: Record<string, string> = {}
    try {
      const ri = await fetch('/data/ipa.json')
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
