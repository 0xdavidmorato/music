(function(){
  // Simple karaoke player: auto-scrolls through lines in a song JSON
  function renderSong(container, song) {
    // create controls
    const controls = document.createElement('div');
    controls.className = 'karaoke-controls';
    controls.innerHTML = `
      <button data-k-play>Play</button>
      <button data-k-pause style="display:none">Pause</button>
      <button data-k-prev title="Previous">◀</button>
      <button data-k-next title="Next">▶</button>
      <label>Speed <input type="range" min="0.2" max="2" step="0.1" value="1" data-k-speed></label>
      <button data-k-toggle-ipa>Toggle IPA</button>
      <button data-k-set-loop-start title="Set loop start">Set Loop Start</button>
      <button data-k-set-loop-end title="Set loop end">Set Loop End</button>
      <label>Repeat <input type="number" min="1" max="20" value="1" style="width:60px" data-k-repeat></label>
      <button data-k-practice>Practice Mode</button>
    `;
    container.prepend(controls);

    const list = document.createElement('div');
    list.className = 'lyrics-list';

    song.lines.forEach((ln, idx) => {
      const el = document.createElement('div');
      el.className = 'line';
      el.dataset.index = idx;
      if (ln.is_header) el.classList.add('header');

      // chords (display above the line if present)
      const chords = document.createElement('div');
      chords.className = 'chords';
      chords.textContent = ln.chords || '';
      el.appendChild(chords);

      const text = document.createElement('div');
      text.className = 'original';
      text.textContent = ln.text;
      el.appendChild(text);

      const ipa = document.createElement('div');
      ipa.className = 'ipa';
      ipa.textContent = ln.ipa || '';
      el.appendChild(ipa);
      list.appendChild(el);
    });

    // clear existing children except controls
    // container.innerHTML = '';
    // append list after controls
    container.appendChild(list);

    // state
    let current = 0;
    let timer = null;
    let speed = 1;
    let showingIPA = true;

    function highlight(idx) {
      container.querySelectorAll('.line').forEach(el => el.classList.remove('current'));
      const sel = container.querySelector('.line[data-index="'+idx+'"]');
      if (sel) {
        sel.classList.add('current');
        sel.scrollIntoView({behavior:'smooth', block:'center'});
      }
    }

    // looping/practice state
    let loopStart = null;
    let loopEnd = null;
    let practiceMode = false;
    let repeatCount = 1;
    let repeatLeft = 0;

    function next() {
      if (practiceMode) {
        if (repeatLeft > 0) {
          repeatLeft--;
          highlight(current);
          return;
        }
      }

      const atEnd = current >= song.lines.length-1;
      if (loopStart !== null && loopEnd !== null) {
        // if next would exceed loopEnd, wrap to loopStart
        if (current >= loopEnd) {
          current = loopStart;
          repeatLeft = practiceMode ? (repeatCount-1) : 0;
          highlight(current);
          return;
        }
      }

      current = Math.min(song.lines.length-1, current+1);
      repeatLeft = practiceMode ? (repeatCount-1) : 0;
      if (atEnd) stop();
      highlight(current);
    }
    function prev() {
      current = Math.max(0, current-1);
      highlight(current);
    }

    function play() {
      stop();
      const playBtn = controls.querySelector('[data-k-play]');
      const pauseBtn = controls.querySelector('[data-k-pause]');
      playBtn.style.display='none'; pauseBtn.style.display='inline-block';
      timer = setInterval(() => { next(); if (current >= song.lines.length-1 && loopEnd===null) stop(); }, 2000 / speed);
    }
    function stop() {
      const playBtn = controls.querySelector('[data-k-play]');
      const pauseBtn = controls.querySelector('[data-k-pause]');
      if (timer) clearInterval(timer); timer = null;
      playBtn.style.display='inline-block'; pauseBtn.style.display='none';
    }

    controls.querySelector('[data-k-next]').addEventListener('click', next);
    controls.querySelector('[data-k-prev]').addEventListener('click', prev);
    controls.querySelector('[data-k-play]').addEventListener('click', play);
    controls.querySelector('[data-k-pause]').addEventListener('click', stop);
    controls.querySelector('[data-k-speed]').addEventListener('input', (e)=>{ speed = parseFloat(e.target.value); });
    controls.querySelector('[data-k-toggle-ipa]').addEventListener('click', ()=>{
      showingIPA = !showingIPA;
      container.querySelectorAll('.ipa').forEach(el=> el.style.display = showingIPA ? 'block' : 'none');
    });

    // loop controls
    controls.querySelector('[data-k-set-loop-start]').addEventListener('click', ()=>{
      loopStart = current;
      alert('Loop start set to line '+current);
    });
    controls.querySelector('[data-k-set-loop-end]').addEventListener('click', ()=>{
      loopEnd = current;
      alert('Loop end set to line '+current);
    });
    const repeatInput = controls.querySelector('[data-k-repeat]');
    repeatInput.addEventListener('input', (e)=>{ repeatCount = Math.max(1, parseInt(e.target.value)||1); });
    controls.querySelector('[data-k-practice]').addEventListener('click', (e)=>{
      practiceMode = !practiceMode;
      e.target.textContent = practiceMode ? 'Practice: ON' : 'Practice Mode';
      repeatLeft = practiceMode ? (repeatCount-1) : 0;
    });

    // initialize
    container.querySelectorAll('.ipa').forEach(el=> el.style.display = showingIPA ? 'block' : 'none');
    highlight(0);
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('.lyrics[data-song-id]').forEach(async (container)=>{
      const id = container.dataset.songId;
      const path = `data/song-${id}.json`;
      try {
        const res = await fetch(path);
        if (!res.ok) throw new Error('Failed to fetch '+path);
        const song = await res.json();
        renderSong(container, song);
      } catch(err) {
        console.error('Karaoke load error:', err);
      }
    });
  });
})();
