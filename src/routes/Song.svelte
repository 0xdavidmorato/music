<script>
  import { onMount } from 'svelte'
  import Player from '../components/Player.svelte'
  import IPAEditor from '../components/IPAEditor.svelte'
  export let params = {}
  let song = null
  onMount(async ()=>{
    const id = params.id || location.pathname.split('/').pop()
    try{ const res = await fetch(`/data/song-${id}.json`); song = await res.json() }catch(e){ console.error(e) }
  })
</script>

{#if song}
  <article>
    <h2>{song.title}</h2>
    <h3>{song.artist}</h3>
    <Player bind:this={playerRef} {song} on:timeupdate={(e)=>handleTime(e.detail.currentTime)} on:loaded={(e)=>handleLoaded(e.detail.duration)} on:ended={()=>handleEnded()} />

    <div class="player-controls">
      <input type="range" min="0" max={duration||0} step="0.01" bind:value={currentTime} on:input={(e)=>seekTo(parseFloat(e.target.value))} />
      <div class="time">{formatTime(currentTime)} / {formatTime(duration)}</div>
    </div>

    <section class="lyrics">
      {#each song.lines as ln, idx}
        <div class="line {idx===currentIndex ? 'current':''}" data-index={idx} on:click={()=>lineClick(idx, ln)}>
          {#if ln.chords}<div class="chords">{ln.chords}</div>{/if}
          <div class="original">{ln.text}</div>
          {#if ln.ipa}<div class="ipa">{ln.ipa}</div>{/if}
        </div>
      {/each}
    </section>
    <IPAEditor {song} />
  </article>
{:else}
  <p>Loading song...</p>
{/if}

<script>
  import { onMount } from 'svelte'
  import Player from '../components/Player.svelte'
  import IPAEditor from '../components/IPAEditor.svelte'
  export let params = {}
  let song = null
  let currentIndex = 0
  let playerRef
  let duration = 0
  let currentTime = 0

  onMount(async ()=>{
    const id = params.id || location.pathname.split('/').pop()
    try{ const res = await fetch(`/data/song-${id}.json`); song = await res.json() }catch(e){ console.error(e) }
  })

  function handleLoaded(d){ duration = d }

  function handleTime(t){
    currentTime = t
    if (!song || !song.lines) return
    // find the line where time_start <= t < time_end
    for (let i=0;i<song.lines.length;i++){
      const ln = song.lines[i]
      if (ln.time_start != null){
        const start = ln.time_start
        const end = ln.time_end != null ? ln.time_end : start + 5
        if (t >= start && t < end){ currentIndex = i; return }
      }
    }
    // fallback: if no matches, do nothing
  }
  function handleEnded(){ currentIndex = song.lines.length-1 }

  function lineClick(idx, ln){
    if (!playerRef) return
    const t = ln.time_start != null ? ln.time_start : null
    if (t !== null) playerRef.seek(t)
    currentIndex = idx
  }

  function seekTo(t){ if (playerRef) playerRef.seek(t) }

  function formatTime(s){
    if (!s && s !== 0) return '--:--'
    const m = Math.floor(s/60)
    const sec = Math.floor(s%60)
    return `${m}:${sec.toString().padStart(2,'0')}`
  }
</script>

<style>
  .player-controls{ display:flex; align-items:center; gap:12px; margin:8px 0 }
  .player-controls input[type=range]{ flex:1 }
  .time{ color:#aab }
  .lyrics .line{ padding:8px; border-bottom:1px solid rgba(255,255,255,0.03); cursor:pointer }
  .line.current{ background: rgba(255,255,255,0.03); border-left:3px solid #6ee7ff }
  .chords{ color:#ffd78a; font-weight:600 }
  .ipa{ color:#bfefff; font-family:monospace; margin-top:4px }
</style>

<style>
  .lyrics .line{ padding:8px; border-bottom:1px solid rgba(255,255,255,0.03) }
  .chords{ color:#ffd78a; font-weight:600 }
  .ipa{ color:#bfefff; font-family:monospace; margin-top:4px }
</style>
