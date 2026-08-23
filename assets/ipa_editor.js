(function(){
  // Simple inline IPA editor for song pages
  function initEditor(container){
    const toolbar = document.createElement('div');
    toolbar.className = 'ipa-editor-toolbar';
    toolbar.innerHTML = `
      <button id="ipa-edit-toggle">Edit IPAs</button>
      <button id="ipa-download" style="display:none">Download edits (JSON)</button>
      <span style="margin-left:8px;color:var(--light-gray70);font-size:13px">Edit mode allows inline editing of IPA and original text. Click Download to save edits as a file, then run scripts/apply_ipa_edits.py to create a PR.</span>
    `;
    container.prepend(toolbar);

    let editing = false;
    const editToggle = toolbar.querySelector('#ipa-edit-toggle');
    const downloadBtn = toolbar.querySelector('#ipa-download');

    editToggle.addEventListener('click', ()=>{
      editing = !editing;
      container.querySelectorAll('.line').forEach(line => {
        const ipa = line.querySelector('.ipa');
        const orig = line.querySelector('.original');
        if (!ipa || !orig) return;
        if (editing){
          ipa.contentEditable = 'true';
          orig.contentEditable = 'true';
          ipa.classList.add('editable');
          orig.classList.add('editable');
        } else {
          ipa.contentEditable = 'false';
          orig.contentEditable = 'false';
          ipa.classList.remove('editable');
          orig.classList.remove('editable');
        }
      });
      downloadBtn.style.display = editing ? 'inline-block' : 'none';
      editToggle.textContent = editing ? 'Exit edit mode' : 'Edit IPAs';
    });

    downloadBtn.addEventListener('click', ()=>{
      const songId = container.dataset.songId;
      const lines = [];
      container.querySelectorAll('.line').forEach(el=>{
        const idx = el.dataset.index;
        const orig = el.querySelector('.original')?.textContent || '';
        const ipa = el.querySelector('.ipa')?.textContent || '';
        const chords = el.querySelector('.chords')?.textContent || '';
        lines.push({index: parseInt(idx,10), text: orig, ipa, chords});
      });
      const payload = {id: songId, lines};
      const blob = new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${songId}-ipa-edits.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('.lyrics[data-song-id]').forEach(container=>{
      // only init after karaoke rendered (lines exist)
      const check = setInterval(()=>{
        if (container.querySelectorAll('.line').length > 0){
          clearInterval(check);
          initEditor(container);
        }
      }, 200);
    });
  });
})();
