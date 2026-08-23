<script>
  import { Router, link } from 'svelte-spa-router'
  import Home from './routes/Home.svelte'
  import Songs from './routes/Songs.svelte'
  import Song from './routes/Song.svelte'
  import Blog from './routes/Blog.svelte'

  const routes = {
    '/': Home,
    '/songs': Songs,
    '/songs/:id': Song,
    '/blog': Blog
  }
</script>

<style>
  :global(body){ font-family: system-ui, Arial; margin:0; background:#0b0720; color:#e8eefc }
  header{ padding:16px; display:flex; align-items:center; justify-content:space-between }
  nav a{ color:inherit; margin-right:12px }
  main{ padding:16px }
</style>

<header>
  <h1>Music Learner</h1>
  <nav>
    <a use:link href="/">Home</a>
    <a use:link href="/songs">Songs</a>
    <a use:link href="/blog">Blog</a>
  </nav>
</header>

<main>
  <Router {routes} />
</main>
