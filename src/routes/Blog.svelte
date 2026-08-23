<script>
  import { onMount } from 'svelte'
  let posts = []
  onMount(async ()=>{
    try{ const res = await fetch('/posts/index.html'); const text = await res.text(); /* index generated as static HTML */
      // fallback: show link to /posts/index.html
    }catch(e){ console.error(e) }
  })
</script>

<article>
  <h2>Blog</h2>
  <p>See posts: <a href="/posts/index.html">Posts index</a></p>
</article>
