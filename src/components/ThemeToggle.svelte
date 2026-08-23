<script>
  let enabled = false
  const STORAGE_KEY = 'theme-psychedelic-night-enabled'
  function toggle(){
    enabled = !enabled
    if (enabled){ document.body.classList.add('theme-psychedelic-night'); localStorage.setItem(STORAGE_KEY,'1') }
    else { document.body.classList.remove('theme-psychedelic-night'); localStorage.removeItem(STORAGE_KEY) }
  }
  // init
  if (typeof window !== 'undefined'){
    enabled = !!localStorage.getItem(STORAGE_KEY)
    if (enabled) document.body.classList.add('theme-psychedelic-night')
  }
</script>

<button on:click={toggle} class:active={enabled}>{enabled ? 'Night: ON' : 'Night: OFF'}</button>

<style>
  button{ padding:8px 10px; border-radius:8px; background:linear-gradient(90deg, rgba(123,92,255,0.12), rgba(64,240,255,0.06)); color:#dfefff; border:1px solid rgba(124,92,255,0.12) }
  button.active{ box-shadow:0 6px 24px rgba(64,240,255,0.08); transform:translateY(-1px) }
</style>
