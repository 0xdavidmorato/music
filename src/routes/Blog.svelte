<script>
  import { onMount } from 'svelte'
  let posts = []
  onMount(async ()=>{
    try{
      const res = await fetch('/posts/index.json')
      posts = await res.json()
    }catch(e){ console.error(e) }
  })
</script>

<article>
  <h2>Blog</h2>
  {#if posts.length}
    <ul>
      {#each posts as p}
        <li><a href={`/posts/${p.slug}.html`}>{p.title}</a> <time>{p.date}</time></li>
      {/each}
    </ul>
  {:else}
    <p>No posts yet. See <a href="/posts/index.html">posts index</a></p>
  {/if}
</article>
