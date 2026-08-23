<script>
  import { createEventDispatcher } from 'svelte'
  export let song = null
  const dispatch = createEventDispatcher()
  let audioEl
  let playing = false
  function play(){ audioEl.play(); playing = true }
  function pause(){ audioEl.pause(); playing = false }

  function onTime(){
    if (!audioEl) return
    dispatch('timeupdate', { currentTime: audioEl.currentTime })
  }

  function onEnded(){
    dispatch('ended')
  }

  function onLoaded(){
    if (!audioEl) return
    dispatch('loaded', { duration: audioEl.duration })
  }

  // expose a seek method so parent components can call playerRef.seek(time)
  export function seek(time){
    if (!audioEl) return
    audioEl.currentTime = time
  }

  export function getCurrentTime(){
    return audioEl ? audioEl.currentTime : 0
  }

  export function getDuration(){
    return audioEl ? audioEl.duration : 0
  }
</script>

{#if song}
  <div class="player">
    <audio bind:this={audioEl} src={song.audio} controls on:timeupdate={onTime} on:ended={onEnded}></audio>
    <div class="meta">{song.title} — {song.artist}</div>
  </div>
{/if}

<style>
  .player{ margin:12px 0 }
  .meta{ color:#bfefff; margin-top:6px }
</style>
