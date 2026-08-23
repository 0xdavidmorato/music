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

  // If song.audio exists, wire a simple audio element
  if (song.audio) {
    const audio = document.createElement('audio')
    audio.controls = true
    audio.src = song.audio
    controlsEl.appendChild(audio)
  }

  // Render lines with IPA (preserve ipa field or lookup in ipaMap)
  if (Array.isArray(song.lines)) {
    const ul = document.createElement('ol')
    ul.className = 'lyrics'
    for (const line of song.lines) {
      const li = document.createElement('li')
      const textDiv = document.createElement('div')
      textDiv.className = 'lyric-text'
      textDiv.textContent = line.text

      const ipaDiv = document.createElement('div')
      ipaDiv.className = 'lyric-ipa'
      const ipa = line.ipa ?? (line.id && ipaMap[line.id]) ?? ''
      // preserve IPA exactly as stored; do not normalize
      ipaDiv.textContent = ipa

      li.appendChild(textDiv)
      li.appendChild(ipaDiv)
      ul.appendChild(li)
    }
    lyricsEl.appendChild(ul)
  } else {
    lyricsEl.innerHTML = '<p>No lines found in song file.</p>'
  }
}

// start
loadSongsIndex()
