<script>
  export let song = null
  let audioEl
  let playing = false
  function play(){ audioEl.play(); playing = true }
  function pause(){ audioEl.pause(); playing = false }
</script>

{#if song}
  <div class="player">
    <audio bind:this={audioEl} src={song.audio} controls></audio>
    <div class="meta">{song.title} — {song.artist}</div>
  </div>
{/if}

<style>
  .player{ margin:12px 0 }
  .meta{ color:#bfefff; margin-top:6px }
</style>
