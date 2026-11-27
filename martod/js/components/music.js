/* MARTOD component — muzik latar (senarai main) dengan butang + panel kecil pada bar atas.
   Lagu diletakkan dalam folder audio/ dan disenaraikan dalam js/data/archive-data.js -> music.tracks.
   Jika fail belum ada, pemain memaparkan arahan ringkas dan laman terus berfungsi seperti biasa. */
(function (M) {
  'use strict';
  const h = M.h;
  const KEY = 'martod.music.v1';
  const EXTS = ['mp3', 'm4a', 'ogg', 'wav'];

  const cfg = () => M.cfg.music || { enabled: false, tracks: [] };
  const tracks = () => (cfg().tracks || []).map((t, i) => ({
    title: t.title || ('Lagu ' + (i + 1)), artist: t.artist || '', file: t.file || '',
    cands: /\.[a-z0-9]{2,4}$/i.test(t.file || '') ? [t.file] : EXTS.map((e) => t.file + '.' + e), missing: false
  }));

  let list = [], idx = 0, extIdx = 0, audio = null, wantPlay = false, armed = false, fade = null;
  let btn, panel, ui = {}, mounted = false;
  const saved = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ on: wantPlay, vol: audio ? audio.volume : saved.vol })); } catch (e) { /* ignore */ } };
  const fmt = (s) => (isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '0:00');
  const anyOk = () => list.some((t) => !t.missing);
  const isPlaying = () => !!audio && !audio.paused && !audio.error && !(list[idx] && list[idx].missing);

  function init() {
    if (audio || !cfg().enabled) return;
    list = tracks();
    if (!list.length) return;
    audio = new Audio();
    audio.preload = 'auto';
    const base = typeof cfg().volume === 'number' ? cfg().volume : 0.5;
    audio.volume = Math.min(1, Math.max(0, typeof saved.vol === 'number' ? saved.vol : base));
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', () => next(true));
    audio.addEventListener('timeupdate', draw);
    audio.addEventListener('loadedmetadata', draw);
    audio.addEventListener('play', () => { document.body.classList.add('music-on'); draw(); });
    audio.addEventListener('pause', () => { document.body.classList.remove('music-on'); draw(); });
    setSrc();
  }

  function setSrc() { const t = list[idx]; audio.src = t.cands[extIdx]; audio.load(); }

  function onError() {
    const t = list[idx];
    if (extIdx < t.cands.length - 1) { extIdx++; setSrc(); if (wantPlay) tryPlay(); return; }
    t.missing = true;
    if (!anyOk()) { audio.pause(); idx = 0; draw(); return; }
    next(true);
  }

  function tryPlay() {
    const p = audio.play();
    if (p && p.catch) p.catch((e) => { if (e && e.name === 'NotAllowedError') arm(); });
  }

  /* pelayar menyekat main-sendiri sehingga pelawat berinteraksi: tunggu sentuhan / klik / kekunci pertama */
  function arm() {
    if (armed) return; armed = true;
    const go = () => {
      armed = false;
      ['pointerdown', 'keydown'].forEach((ev) => window.removeEventListener(ev, go, true));
      if (wantPlay && audio.paused) tryPlay();
    };
    ['pointerdown', 'keydown'].forEach((ev) => window.addEventListener(ev, go, true));
  }

  function fadeIn() {
    if (!audio) return;
    clearInterval(fade);
    const target = audio.volume; audio.volume = 0; let v = 0;
    fade = setInterval(() => { v += target / 20; if (v >= target) { audio.volume = target; clearInterval(fade); } else audio.volume = v; }, 75);
  }

  function play(auto) {
    if (!audio || !cfg().enabled) return;
    wantPlay = true; save();
    if (list[idx].missing) { const n = list.findIndex((t) => !t.missing); if (n >= 0) select(n, true); }
    if (audio.paused && auto) fadeIn();
    tryPlay(); draw();
  }
  function pause() { if (!audio) return; wantPlay = false; clearInterval(fade); audio.pause(); save(); draw(); }
  function toggle() { if (!audio) return; (isPlaying() ? pause : play)(); }
  function select(i, keepPlaying) {
    if (!audio) return;
    idx = (i + list.length) % list.length; extIdx = 0; list[idx].missing = false; setSrc();
    if (keepPlaying || wantPlay) { wantPlay = true; tryPlay(); }
    draw();
  }
  function next(auto) {
    if (!audio) return;
    for (let k = 1; k <= list.length; k++) {
      const n = (idx + k) % list.length;
      if (!list[n].missing || n === idx) {
        if (n === idx && list[n].missing) { draw(); return; }
        if (n === idx) { audio.currentTime = 0; tryPlay(); return; }
        select(n, auto || wantPlay); return;
      }
    }
  }
  function prev() { if (!audio) return; if (audio.currentTime > 3) { audio.currentTime = 0; return; } select(idx - 1, wantPlay); }

  /* ---------- paparan ---------- */
  function draw() {
    if (!mounted) return;
    const t = list[idx], playing = isPlaying();
    btn.classList.toggle('playing', !!playing);
    btn.setAttribute('aria-pressed', String(!!playing));
    ui.play.replaceChildren(M.icon(playing ? 'pause' : 'play', 20));
    ui.play.setAttribute('aria-label', playing ? 'Jeda' : 'Main');
    ui.title.textContent = t.title;
    ui.artist.textContent = t.artist || 'MUZIK LATAR';
    const none = !anyOk();
    ui.note.hidden = !t.missing && !none;
    ui.note.textContent = none ? 'BELUM ADA FAIL LAGU. Letak fail lagu dalam folder audio/ (cth. ' + list[0].file + (/\.[a-z0-9]+$/i.test(list[0].file) ? '' : '.mp3') + ') dan muat semula laman.' : 'Fail lagu ini tiada: ' + t.cands[0] + (t.cands.length > 1 ? ' (.mp3 / .m4a / .ogg / .wav)' : '');
    ui.note.classList.toggle('warn', true);
    const d = audio.duration, c = audio.currentTime || 0;
    ui.cur.textContent = fmt(c); ui.dur.textContent = fmt(d);
    if (!ui.seeking) ui.seek.value = isFinite(d) && d > 0 ? String(Math.round((c / d) * 1000)) : '0';
    ui.vol.value = String(Math.round(audio.volume * 100));
    ui.items.forEach((b, i) => { b.classList.toggle('on', i === idx); b.classList.toggle('miss', list[i].missing); });
  }

  function build() {
    btn = h('button', { class: 'icon-btn music-btn', type: 'button', title: 'Muzik latar', 'aria-label': 'Muzik latar', 'aria-haspopup': 'true', onClick: (e) => { e.stopPropagation(); panel.hidden = !panel.hidden; btn.classList.toggle('open', !panel.hidden); draw(); } },
      M.icon('music'), h('span', { class: 'eq', 'aria-hidden': 'true' }, h('i'), h('i'), h('i')));
    ui.title = h('b', { class: 'mus__title' }); ui.artist = h('span', { class: 'mus__artist' });
    ui.note = h('p', { class: 'mus__note', hidden: true });
    ui.cur = h('span'); ui.dur = h('span');
    ui.seek = h('input', { type: 'range', min: '0', max: '1000', value: '0', class: 'mus__range', 'aria-label': 'Kedudukan lagu' });
    ui.seek.addEventListener('input', () => { ui.seeking = true; });
    ui.seek.addEventListener('change', () => { const d = audio.duration; if (isFinite(d)) audio.currentTime = (ui.seek.value / 1000) * d; ui.seeking = false; });
    ui.vol = h('input', { type: 'range', min: '0', max: '100', value: '50', class: 'mus__range mus__range--vol', 'aria-label': 'Kelantangan' });
    ui.vol.addEventListener('input', () => { audio.volume = ui.vol.value / 100; save(); });
    const cb = (icon, label, fn, cls) => h('button', { type: 'button', class: 'icon-btn mus__c' + (cls ? ' ' + cls : ''), 'aria-label': label, title: label, onClick: fn }, M.icon(icon, cls ? 20 : 18));
    ui.play = cb('play', 'Main', toggle, 'mus__play');
    ui.items = list.map((t, i) => h('button', { type: 'button', class: 'mus__item', onClick: () => { select(i, true); play(); } }, h('em', null, String(i + 1).padStart(2, '0')), h('span', null, t.title), t.artist ? h('small', null, t.artist) : null));
    panel = h('div', { class: 'mus', hidden: true, role: 'dialog', 'aria-label': 'Pemain muzik latar' },
      h('div', { class: 'mus__h' }, h('span', null, '// MUZIK LATAR'), h('button', { type: 'button', class: 'icon-btn icon-btn--sm', 'aria-label': 'Tutup', onClick: () => { panel.hidden = true; btn.classList.remove('open'); } }, M.icon('x', 14))),
      h('div', { class: 'mus__now' }, ui.title, ui.artist),
      ui.note,
      h('div', { class: 'mus__seek' }, ui.cur, ui.seek, ui.dur),
      h('div', { class: 'mus__ctl' }, cb('prev', 'Lagu sebelumnya', prev), ui.play, cb('next', 'Lagu seterusnya', () => next(false))),
      h('label', { class: 'mus__volrow' }, M.icon('volume', 16), ui.vol),
      h('div', { class: 'mus__list' }, ui.items));
    document.addEventListener('click', (e) => { const path = e.composedPath ? e.composedPath() : []; if (!panel.hidden && !path.includes(panel) && !path.includes(btn)) { panel.hidden = true; btn.classList.remove('open'); } });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden && !M.overlay.count()) { panel.hidden = true; btn.classList.remove('open'); } });
    mounted = true; draw();
  }

  M.music = {
    /* dipanggil semasa log masuk (ada sentuhan pelawat) dan apabila apl dibuka */
    start() {
      if (!cfg().enabled) return;
      init(); if (!audio) return;
      if (saved.on === false) return;           // pelawat pernah menjeda: hormati pilihan itu
      if (!wantPlay) play(true);
    },
    button() {
      if (!cfg().enabled) return null;
      init(); if (!audio) return null;
      build(); return btn;
    },
    panel() { return panel || null; },
    toggle, next: () => next(false), prev, play: () => play(false), pause,
    isPlaying,
    info: () => ({ enabled: !!cfg().enabled, playing: isPlaying(), track: list[idx] && list[idx].title, available: list.filter((t) => !t.missing).length, total: list.length })
  };
})(window.M);
