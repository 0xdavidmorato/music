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
    <Player {song} />
    <section class="lyrics">
      {#each song.lines as ln, idx}
        <div class="line">
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

<style>
  .lyrics .line{ padding:8px; border-bottom:1px solid rgba(255,255,255,0.03) }
  .chords{ color:#ffd78a; font-weight:600 }
  .ipa{ color:#bfefff; font-family:monospace; margin-top:4px }
</style>
