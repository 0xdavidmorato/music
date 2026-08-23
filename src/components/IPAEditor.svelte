<script>
  export let song
  let editing = false
  function toggle(){ editing = !editing }
  function download(){
    const payload = {id: song.id, lines: song.lines.map((ln,idx)=>({index: idx, text: ln.text, ipa: ln.ipa, chords: ln.chords || ''}))}
    const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `${song.id}-ipa-edits.json`; a.click(); URL.revokeObjectURL(url)
  }
</script>

<div class="ipa-editor">
  <button on:click={toggle}>{editing ? 'Exit edit' : 'Edit IPAs'}</button>
  {#if editing}
    <button on:click={download}>Download edits (JSON)</button>
  {/if}
  <div class="note">Edits are local JSON; use scripts/apply_ipa_edits.py to create a PR.</div>
</div>

<style>
  .ipa-editor{ margin-top:16px }
  .note{ color:#aab; font-size:13px; margin-top:8px }
</style>
