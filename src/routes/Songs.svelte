<script>
  import { onMount } from 'svelte'
  let songs = []
  onMount(async ()=>{
    try{ const res = await fetch('/data/songs.json'); songs = await res.json() }catch(e){ console.error(e) }
  })
</script>

<h2>Songs</h2>
{#if songs.length}
  <ul>
    {#each songs as s}
      <li><a href={`/songs/${s.id}`} on:click|preventDefault={() => location.href = `/songs/${s.id}`} >{s.title} — {s.artist}</a></li>
    {/each}
  </ul>
{:else}
  <p>Loading songs...</p>
{/if}
