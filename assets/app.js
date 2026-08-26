/* ============================================================
   Repertorio - app
   Dados: window.REPERTORIO (bundle) + adicoes em localStorage.
   ============================================================ */
(function () {
    'use strict';

    var STORAGE_KEY = 'repertorio_user_songs_v1';
    var FOCUS = 0.34; // linha activa a ~34% do topo da area de rolagem

    var base = (window.REPERTORIO && window.REPERTORIO.songs) || [];
    var person = (window.REPERTORIO && window.REPERTORIO.person) || {};
    var userSongs = loadUserSongs();
    var allSongs = base.concat(userSongs);

    function loadUserSongs() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
        catch (e) { return []; }
    }
    function saveUserSongs() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userSongs));
    }

    function $(id) { return document.getElementById(id); }

    function toast(msg) {
        var t = $('toast');
        t.textContent = msg;
        t.classList.remove('hidden');
        t.classList.add('show');
        clearTimeout(t._h);
        t._h = setTimeout(function () {
            t.classList.add('hidden');
            t.classList.remove('show');
        }, 2600);
    }

    function imgPath(song) {
        var s = (song && song.image) ? song.image.trim() : '';
        return s || 'assets/placeholder.svg';
    }

    function sectionLabel(sec) {
        if (!sec) return '';
        return String(sec).replace(/:\s*$/, '').trim();
    }

    function newEl(tag, cls) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        return n;
    }

    /* ============ HERO + GALERIA ============ */
    function renderHero() {
        var box = $('hero-about');
        box.innerHTML = '';
        (person.about || []).forEach(function (p) {
            var pe = newEl('p');
            pe.textContent = p;
            box.appendChild(pe);
        });
        if (person.title) $('hero-title').textContent = person.title;
        if (person.name) $('foot-name').textContent = person.name;
        if (person.avatar) $('hero-avatar').src = person.avatar;
    }

    function renderGrid() {
        var grid = $('grid');
        grid.innerHTML = '';
        $('song-count').textContent = allSongs.length + ' musicas';
        allSongs.forEach(function (song) {
            var frag = $('tpl-card').content;
            var card = frag.firstElementChild.cloneNode(true);
            var img = card.querySelector('.card-cover img');
            img.src = imgPath(song);
            img.alt = song.title || '';
            card.querySelector('.card-title').textContent = song.title;
            card.querySelector('.card-artist').textContent = song.artist || '';
            card.querySelector('.card-info').textContent =
                (song.lyrics ? song.lyrics.length : 0) + ' frases';
            var hint = newEl('div', 'play-hint');
            hint.innerHTML = '<span>' + playSvg + '</span>';
            card.querySelector('.card-cover').appendChild(hint);
            card.querySelector('[data-action=open]').addEventListener('click', function () {
                openPlayer(song);
            });
            grid.appendChild(card);
        });
    }

    var playSvg = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

    /* ============ PLAYER / TELEPROMPTER ============ */
    var state = {
        song: null, playing: false, speed: 1, current: 0,
        showIpa: true, raf: null, lastTs: 0
    };
    var wrapEls = [];
    var scrollEl = null;

    function openPlayer(song) {
        state.song = song;
        state.playing = false;
        state.current = 0;
        cancelAnimationFrame(state.raf);

        $('p-title').textContent = song.title;
        $('p-artist').textContent = song.artist || '';
        $('bar-title').textContent = song.title;
        $('bar-artist').textContent = song.artist || '';
        $('p-cover').src = imgPath(song);

        buildLines(song.lyrics || []);
        setSpeed(1);
        updateIpa();
        $('player').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        scrollEl = $('tp-scroll');
        scrollEl.scrollTop = 0;
        updateProgress();
        setPlay(false);
    }

    function buildLines(lines) {
        wrapEls = [];
        var wrap = $('tp-lines');
        wrap.innerHTML = '';
        var prevSection = '';
        lines.forEach(function (L, i) {
            var frag = $('tpl-line').content;
            var row = frag.firstElementChild.cloneNode(true);
            var sec = sectionLabel(L.section);
            if (sec && sec !== prevSection) {
                row.classList.add('has-section');
                row.querySelector('.line-label').textContent = sec;
                prevSection = sec;
            }
            row.querySelector('.line-phrase').textContent = L.phrase || '';
            row.querySelector('.line-ipa').textContent = L.ipa || '-';
            var idx = newEl('span', 'line-idx');
            idx.textContent = (i + 1);
            row.appendChild(idx);
            row.addEventListener('click', (function (idx) {
                return function () {
                    scrollIntoIndex(idx);
                    if (!state.playing) setPlay(true);
                };
            })(i));
            wrap.appendChild(row);
            wrapEls.push(row);
        });
    }

    function indexAtScreen() {
        if (!wrapEls.length) return 0;
        var mid = scrollEl.scrollTop + scrollEl.clientHeight * FOCUS;
        var idx = 0;
        for (var i = 0; i < wrapEls.length; i++) {
            if (wrapEls[i].offsetTop <= mid) idx = i;
        }
        return idx;
    }

    function updateProgress() {
        if (!wrapEls.length) return;
        var idx = indexAtScreen();
        state.current = idx;
        wrapEls.forEach(function (r, i) { r.classList.toggle('active', i === idx); });
        $('p-line-current').textContent = (idx + 1) + ' / ' + wrapEls.length;
        $('progress-fill').style.width = (idx / wrapEls.length * 100) + '%';
        var lab = wrapEls[idx].querySelector('.line-label').textContent;
        $('p-section').textContent = lab || '-';
    }

    function updateIpa() {
        wrapEls.forEach(function (r) {
            r.querySelector('.line-ipa').style.display = state.showIpa ? '' : 'none';
        });
        $('ipa-check').checked = state.showIpa;
    }

    function setPlay(on) {
        state.playing = on;
        if (on) {
            state.lastTs = 0;
            state.raf = requestAnimationFrame(tick);
        } else {
            cancelAnimationFrame(state.raf);
        }
        $('btn-play').classList.toggle('playing', on);
        $('btn-play-f').classList.toggle('playing', on);
    }

    function tick(ts) {
        if (!state.playing) return;
        var dt = state.lastTs ? (ts - state.lastTs) : 16;
        state.lastTs = ts;
        scrollEl.scrollTop += (60 / 1000) * state.speed * dt;
        updateProgress();
        state.raf = requestAnimationFrame(tick);
    }

    function setSpeed(s) {
        state.speed = Math.max(0.2, Math.min(3, Math.round(s * 10) / 10));
        $('speed').value = state.speed;
        var t = state.speed.toFixed(1) + 'x';
        $('speed-val').textContent = t;
        $('speed-val-big').textContent = t;
    }

    function scrollIntoIndex(i) {
        if (!wrapEls.length) return;
        var target = wrapEls[i].offsetTop - scrollEl.clientHeight * FOCUS;
        scrollEl.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
        setTimeout(updateProgress, 250);
    }

    function closePlayer() {
        setPlay(false);
        $('player').classList.add('hidden');
        document.body.style.overflow = '';
    }

    function wirePlayer() {
        function toggle() { setPlay(!state.playing); }
        $('btn-play').addEventListener('click', toggle);
        $('btn-play-f').addEventListener('click', toggle);
        $('btn-back').addEventListener('click', closePlayer);
        $('btn-close').addEventListener('click', closePlayer);
        $('btn-top').addEventListener('click', function () {
            scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(updateProgress, 250);
        });
        $('btn-focus').addEventListener('click', function () { scrollIntoIndex(state.current); });

        function dec() { setSpeed(state.speed - 0.2); }
        function inc() { setSpeed(state.speed + 0.2); }
        $('btn-slower').addEventListener('click', dec);
        $('btn-faster').addEventListener('click', inc);
        $('btn-speed-m').addEventListener('click', dec);
        $('btn-speed-p').addEventListener('click', inc);
        $('speed').addEventListener('input', function () { setSpeed(parseFloat(this.value)); });

        $('ipa-check').addEventListener('change', function () {
            state.showIpa = this.checked;
            updateIpa();
        });
        scrollEl.addEventListener('scroll', function () {
            if (!state.playing) updateProgress();
        });

        document.addEventListener('keydown', function (e) {
            var open = !$('player').classList.contains('hidden');
            var inField = e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName);
            if (!open || inField) return;
            if (e.code === 'Space') { e.preventDefault(); toggle(); }
            else if (e.key === 'ArrowDown') { e.preventDefault(); inc(); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); dec(); }
            else if (e.key === 'Escape') { closePlayer(); }
        });
    }
    /* ============ MODAL ADICIONAR MUSICA ============ */
    function addLineRow(section, label, ipa) {
        var editor = $('lines-editor');
        var row = newEl('div', 'line-ed');
        row.innerHTML =
            '<select class="le-sel">' +
                '<option value="">-</option>' +
                '<option>Refrao</option><option>Verso</option>' +
                '<option>Ponte</option><option>Final</option><option>Intro</option>' +
            '</select>' +
            '<input class="le-phrase" placeholder="Letra...">' +
            '<input class="le-ipa" placeholder="transcricao fonetica...">' +
            '<button type="button" class="line-del" title="Remover linha">&times;</button>';
        if (section) row.querySelector('.le-sel').value = section;
        if (label) row.querySelector('.le-phrase').value = label;
        if (ipa) row.querySelector('.le-ipa').value = ipa;
        row.querySelector('.line-del').addEventListener('click', function () { row.remove(); });
        editor.appendChild(row);
    }

    function openModal() {
        $('f-title').value = '';
        $('f-artist').value = '';
        $('f-cover').value = '';
        $('lines-editor').innerHTML = '';
        addLineRow(); addLineRow(); addLineRow();
        $('modal-add').classList.remove('hidden');
        setTimeout(function () { $('f-title').focus(); }, 40);
    }

    function closeModal() {
        $('modal-add').classList.add('hidden');
    }

    function submitSong(e) {
        e.preventDefault();
        var title = $('f-title').value.trim();
        var artist = $('f-artist').value.trim();
        var cover = $('f-cover').value.trim();
        if (!title || !artist) { toast('Preenche titulo e artista'); return; }

        var rows = Array.prototype.slice.call(document.querySelectorAll('#lines-editor .line-ed'));
        var lines = [];
        rows.forEach(function (r) {
            var phrase = r.querySelector('.le-phrase').value.trim();
            var ipa = r.querySelector('.le-ipa').value.trim();
            var section = r.querySelector('.le-sel').value.trim();
            if (!phrase && !ipa) return;
            lines.push({ section: section || null, phrase: phrase, ipa: ipa, ipa_id: null });
        });
        if (!lines.length) { toast('Adiciona pelo menos uma linha'); return; }

        var id = 'user-' + Date.now();
        var song = {
            id: id, class: 'user-song', lyrics_id: 'lyrics-' + id,
            title: title, artist: artist, image: cover || null,
            lyrics: lines, _user: true
        };
        userSongs.push(song);
        saveUserSongs();
        allSongs = base.concat(userSongs);
        closeModal();
        renderGrid();
        toast('Musica adicionada');
        openPlayer(song);
    }

    function exportFull() {
        var data = { person: person, songs: allSongs };
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'repertorio.json';
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 500);
        toast('Exportado repertorio.json');
    }

    /* ============ ARRANQUE ============ */
    function init() {
        renderHero();
        renderGrid();
        wirePlayer();

        $('btn-add-song').addEventListener('click', openModal);
        $('btn-add-song-2').addEventListener('click', openModal);
        $('btn-add-line').addEventListener('click', function () { addLineRow(); });
        $('form-add').addEventListener('submit', submitSong);
        document.querySelectorAll('[data-close-modal]').forEach(function (b) {
            b.addEventListener('click', closeModal);
        });
        window.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !$('modal-add').classList.contains('hidden')) {
                closeModal();
            }
        });

        var box = document.getElementById('adicionar').querySelector('.adicionar-box');
        var ex = newEl('button', 'btn btn-ghost');
        ex.type = 'button';
        ex.textContent = 'Exportar repertorio.json';
        ex.addEventListener('click', exportFull);
        box.appendChild(ex);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
