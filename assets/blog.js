(function(){
  // Simple client-side Markdown renderer for the blog index and posts
  async function fetchText(path){
    const res = await fetch(path);
    if (!res.ok) throw new Error('Failed to fetch '+path);
    return await res.text();
  }

  function parseFrontmatter(md){
    if (md.startsWith('---')){
      const end = md.indexOf('\n---', 3);
      if (end !== -1){
        const raw = md.slice(3,end+1);
        const body = md.slice(end+5);
        const meta = {};
        raw.split('\n').forEach(line=>{
          const m = line.match(/^(\w+):\s*(.*)$/);
          if (m) meta[m[1].trim()] = m[2].trim();
        });
        return {meta, body};
      }
    }
    return {meta:{}, body:md};
  }

  function mdToHtml(md){
    // minimal markdown conversions: headers, lists, paragraphs
    let html = md;
    // code fences
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    // headers
    html = html.replace(/^###### (.*)$/gm, '<h6>$1</h6>');
    html = html.replace(/^##### (.*)$/gm, '<h5>$1</h5>');
    html = html.replace(/^#### (.*)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');
    // ul
    html = html.replace(/(^|\n)- (.*)(?=\n|$)/g, '$1<li>$2</li>');
    html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    // paragraphs
    html = html.replace(/\n\n+/g, '</p><p>');
    html = '<p>'+html+'</p>';
    // simple links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    return html;
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    // Blog index: if there is a container with data-blog-index, list posts
    const idx = document.querySelector('[data-blog-index]');
    if (idx){
      try{
        // naive: list files from content/posts/posts.json? We don't have directory listing, so include a static list
        const posts = [ 'content/posts/example-post.md' ];
        let out = '';
        for (const p of posts){
          const txt = await fetchText(p);
          const {meta, body} = parseFrontmatter(txt);
          const title = meta.title || 'Post';
          const date = meta.date || '';
          const slug = p.split('/').pop().replace(/\.md$/,'');
          out += `<article><h3><a href="/posts/${slug}.html">${title}</a></h3><time>${date}</time></article>`;
        }
        idx.innerHTML = out;
      }catch(err){ console.error(err); }
    }

    // Single post pages
    const postContainer = document.querySelector('[data-post]');
    if (postContainer){
      // determine slug from path: /posts/<slug>.html
      const path = location.pathname;
      const parts = path.split('/');
      const slug = parts.pop() || parts.pop();
      const mdPath = '/content/posts/'+slug+'.md';
      try{
        const txt = await fetchText(mdPath);
        const {meta, body} = parseFrontmatter(txt);
        postContainer.innerHTML = `<h1>${meta.title||'Post'}</h1><time>${meta.date||''}</time>`+ mdToHtml(body);
      }catch(err){ postContainer.innerHTML = '<p>Post not found</p>'; }
    }
  });
})();
