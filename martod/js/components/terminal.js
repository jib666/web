/* MARTOD component — antara muka arahan terminal (buka/tutup dengan kekunci `) */
(function (M) {
  'use strict';
  const h = M.h;
  const ALIAS = { rekod: 'documents', dokumen: 'documents', docs: 'documents', documents: 'documents', doc: 'documents',
    konflik: 'investigations', cases: 'investigations', investigations: 'investigations',
    entiti: 'reports', kerajaan: 'reports', pertubuhan: 'reports', org: 'reports', reports: 'reports',
    artifak: 'evidence', bukti: 'evidence', evidence: 'evidence',
    tokoh: 'personnel', watak: 'personnel', personnel: 'personnel',
    peristiwa: 'timeline', masa: 'timeline', timeline: 'timeline', events: 'timeline',
    bahagian: 'folders', folders: 'folders' };
  const VIEWS = { papan: 'dashboard', dashboard: 'dashboard', rekod: 'documents', docs: 'documents', documents: 'documents', konflik: 'investigations', investigations: 'investigations',
    entiti: 'reports', kerajaan: 'reports', reports: 'reports', artifak: 'evidence', evidence: 'evidence', tokoh: 'personnel', personnel: 'personnel',
    garis: 'timeline', masa: 'timeline', timeline: 'timeline', log: 'logs', logs: 'logs' };
  /* English command names still work */
  const CMD_ALIAS = { help: 'bantuan', clear: 'kosong', whoami: 'siapa', clearance: 'tahap', stats: 'statistik', ls: 'senarai', open: 'buka', search: 'cari', filter: 'tapis', goto: 'pergi', new: 'baharu', upload: 'muatnaik', logs: 'log', sound: 'bunyi', date: 'tarikh', echo: 'gema', reset: 'setsemula', logout: 'keluar' };
  let el, out, inp, open = false, hist = [], hi = 0, booted = false;

  function print(text, cls) {
    String(text).split('\n').forEach((line) => out.append(h('div', { class: 'tl' + (cls ? ' tl--' + cls : '') }, line === '' ? ' ' : line)));
    out.scrollTop = out.scrollHeight;
  }
  function resolve(ref) {
    if (!ref) return null;
    let s = ref.toUpperCase();
    if (/^\d+$/.test(s)) s = 'REK-' + M.pad(+s, 3);
    return M.store.findAny(s);
  }
  const row = (a, w) => a.map((c, i) => String(c == null ? '' : c).slice(0, w[i] - 1).padEnd(w[i])).join('');
  const COLLS = ['documents', 'reports', 'investigations', 'evidence', 'personnel', 'timeline'];

  const C = {
    bantuan: { d: 'Senarai arahan', run() {
      print('ARAHAN YANG ADA', 'hd');
      Object.keys(C).filter((k) => C[k].d).sort().forEach((k) => print('  ' + k.padEnd(11) + C[k].d));
      print('\nTIP: ↑/↓ sejarah · TAB melengkapkan · buka 001 membuka REK-001 · ` buka/tutup terminal', 'dim');
    } },
    kosong: { d: 'Kosongkan skrin', run() { M.clear(out); } },
    siapa: { d: 'Papar pengguna semasa', run() { print(`PENGGUNA : ${M.session.user}\nTAHAP    : ${M.session.clearance} · ${M.session.levelName()}\nSESI     : ${M.session.id}`); } },
    tahap: { d: 'tahap <1-5>: tukar tahap capaian sesi (simulasi)', run(a) {
      const n = parseInt(a[0], 10);
      if (!n) { print(`SEMASA : TAHAP ${M.session.clearance} · ${M.session.levelName()}\nTAHAP  : ` + M.cfg.classifications.map((c, i) => `${i + 1}=${c}`).join('  ')); return; }
      if (n < 1 || n > M.cfg.classifications.length) { print('RALAT: TAHAP DI LUAR JULAT', 'err'); return; }
      M.session.setClearance(n); M.logs.add('AUTH', `TAHAP CAPAIAN DITETAPKAN: ${n} (${M.session.levelName()})`);
      print(`TAHAP CAPAIAN: ${n} · ${M.session.levelName()}`, 'ok'); M.shell.refresh(); M.router.render();
    } },
    status: { d: 'Status sistem', run() {
      print('STATUS SISTEM', 'hd');
      print(`PAUTAN      : SELAMAT (SIMULASI)\nARKIB       : ${M.store.get('folders').length} BAHAGIAN · ${M.store.get('documents').length} REKOD · ${M.store.get('personnel').length} TOKOH · ${M.store.get('evidence').length} ARTIFAK\nSUNTINGAN   : ${M.store.hasLocalEdits() ? 'ADA (salinan pelayar mengatasi archive-data.js)' : 'TIADA'}\nFX          : ${M.fx.on ? 'HIDUP' : 'MATI'}   BUNYI: ${M.fx.sound.on ? 'HIDUP' : 'MATI'}`);
    } },
    statistik: { d: 'Statistik arkib', run() {
      COLLS.forEach((c) => {
        const l = M.store.get(c), filled = l.filter((x) => M.schemas[c].fields.some((f) => f.type !== 'select' && f.type !== 'folder' && f.type !== 'document' && x[f.key])).length;
        print(`${M.schemas[c].plural.toUpperCase().padEnd(24)} ${String(l.length).padStart(3)} rekod · ${filled} berisi`);
      });
      const pics = M.store.get('documents').filter((d) => d.image || d.imagePath).length;
      print(`\nREKOD DENGAN GAMBAR (muat naik/laluan): ${pics} / ${M.store.get('documents').length}`, 'dim');
    } },
    bahagian: { d: 'Senarai bahagian dan bilangan rekod', run() {
      M.store.get('folders').forEach((f) => print(row([f.label || f.id, f.name || '', M.store.get('documents').filter((d) => d.folder === f.id).length + ' rekod'], [14, 62, 10])));
    } },
    senarai: { d: 'senarai [rekod|konflik|entiti|artifak|tokoh|peristiwa|bahagian]', run(a) {
      const c = ALIAS[(a[0] || '').toLowerCase()];
      if (!c) { [...COLLS, 'folders'].forEach((k) => print(`${(M.schemas[k].plural).padEnd(24)} ${M.store.get(k).length}`)); print('\nGUNA: senarai <jenis>', 'dim'); return; }
      print(row(['ID', 'KLASIFIKASI', 'TAJUK'], [13, 15, 60]), 'hd');
      M.store.get(c).forEach((it) => print(row([it.id, it.classification || it.clearance || '—', c === 'folders' ? ((it.label ? it.label + ' · ' : '') + it.name) : (M.titleOf(c, it) || (M.phOf(c, M.schemas[c].titleKey)))], [13, 15, 60])));
    } },
    buka: { d: 'buka <id|nombor>: buka rekod (buka 001 = REK-001)', run(a) {
      const r = resolve(a[0]);
      if (!r) { print('RALAT: REKOD TIDAK DITEMUI' + (a[0] ? ': ' + a[0] : ''), 'err'); return; }
      if (r.coll === 'folders') { M.ui.docs.mode = 'folders'; M.ui.docs.closed.delete(r.item.id); M.router.go('documents', r.item.id); print(`MEMBUKA ${r.item.label || r.item.id} ...`, 'ok'); return; }
      print(`MEMBUKA ${r.item.id} ...`, 'ok'); M.openRecord(r.coll, r.item.id);
    } },
    cari: { d: 'cari <teks>: cari dalam seluruh arkib', run(a) {
      const q = a.join(' ');
      if (!q) { print('GUNA: cari <teks>', 'err'); return; }
      const res = M.searchAll(q);
      print(`${res.length} PADANAN UNTUK "${q}"`, 'hd');
      res.slice(0, 40).forEach((x) => print(row([x.item.id, M.titleOf(x.coll, x.item) || '[KOSONG]'], [13, 60])));
    } },
    tapis: { d: 'tapis <klasifikasi|semua>: tapis senarai rekod', run(a) {
      const v = a.join(' ').toUpperCase();
      if (!v || v === 'ALL' || v === 'SEMUA') M.ui.docs.cls = '';
      else if (v === 'NONE' || v === 'TIADA') M.ui.docs.cls = '__none';
      else if (M.cfg.classifications.includes(v)) M.ui.docs.cls = v;
      else { print('RALAT: KLASIFIKASI TIDAK DIKENALI. GUNA: ' + M.cfg.classifications.join(' | ') + ' | TIADA | SEMUA', 'err'); return; }
      print('TAPISAN DITETAPKAN', 'ok'); M.router.go('documents');
    } },
    pergi: { d: 'pergi <paparan>: papan rekod konflik entiti artifak tokoh garis log', run(a) {
      const v = VIEWS[(a[0] || '').toLowerCase()];
      if (!v) { print('GUNA: pergi <' + ['papan', 'rekod', 'konflik', 'entiti', 'artifak', 'tokoh', 'garis', 'log'].join('|') + '>', 'err'); return; }
      M.router.go(v); print('MENUJU → ' + v.toUpperCase(), 'ok');
    } },
    log: { d: 'log [n]: papar n entri log terakhir', run(a) {
      const n = parseInt(a[0], 10) || 10;
      M.logs.all().slice(-n).forEach((l) => print(`${M.fmtStamp(l.t)}  ${M.logs.label(l.level).padEnd(7)} ${l.msg}`));
    } },
    fx: { d: 'fx [on|off]: hidup/matikan kesan visual', run(a) { if (a[0] === 'on') M.fx.set(true); else if (a[0] === 'off') M.fx.set(false); else M.fx.toggle(); print('FX ' + (M.fx.on ? 'HIDUP' : 'MATI'), 'ok'); } },
    muzik: { d: 'muzik [on|off|seterusnya|sebelum]: kawal muzik latar', run(a) {
      if (!M.music.info().enabled) { print('MUZIK TIDAK DIAKTIFKAN (music.enabled dalam archive-data.js)', 'err'); return; }
      const c = (a[0] || '').toLowerCase();
      if (c === 'on') M.music.play(); else if (c === 'off') M.music.pause(); else if (c === 'seterusnya' || c === 'next') M.music.next(); else if (c === 'sebelum' || c === 'prev') M.music.prev(); else M.music.toggle();
      const i = M.music.info(); print(`MUZIK ${i.playing ? 'MAIN' : 'JEDA'} · ${i.track} · ${i.available}/${i.total} FAIL ADA`, i.available ? 'ok' : 'err');
    } },
    bunyi: { d: 'bunyi [on|off]: hidup/matikan bunyi UI', run(a) { M.fx.sound.set(a[0] ? a[0] === 'on' : !M.fx.sound.on); print('BUNYI ' + (M.fx.sound.on ? 'HIDUP' : 'MATI'), 'ok'); M.fx.beep('ok'); } },
    tarikh: { d: 'Papar tarikh dan masa', run() { print(new Date().toString()); } },
    gema: { d: 'gema <teks>', run(a) { print(a.join(' ')); } },
    keluar: { d: 'Tamatkan sesi', run() { print('MENAMATKAN SESI ...'); setTimeout(() => M.app.logout(), 350); } },
    sudo: { d: '', run() { print('AKSES DITOLAK. INSIDEN INI TELAH DIREKODKAN.', 'err'); M.logs.add('ALERT', 'CUBAAN PENINGKATAN KEBENARAN (TERMINAL)'); M.fx.flash('red'); } }
  };

  M.download = function (name, text, type) {
    const url = URL.createObjectURL(new Blob([text], { type: type || 'text/plain' }));
    const a = h('a', { href: url, download: name }); document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  async function run(line) {
    const parts = line.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return;
    const cmd = parts[0].toLowerCase();
    print(`${M.session.user || 'guest'}@martod:~$ ${line}`, 'cmd');
    hist.push(line); hi = hist.length;
    M.logs.add('CMD', 'TERMINAL: ' + line.slice(0, 80));
    const c = C[cmd] || C[CMD_ALIAS[cmd]];
    if (!c) { print(`ARAHAN TIDAK DIKENALI: ${cmd}. TAIP bantuan`, 'err'); return; }
    try { await c.run(parts.slice(1)); } catch (e) { print('ERROR: ' + e.message, 'err'); }
  }

  M.terminal = {
    mount(root) {
      out = h('div', { class: 'term__out' });
      inp = h('input', { class: 'term__in', type: 'text', autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off', 'aria-label': 'Input terminal' });
      el = h('section', { class: 'term', 'aria-label': 'Terminal' },
        h('div', { class: 'term__head' }, h('span', null, 'TERMINAL MARTOD // SESI ' + (M.session.id || '----')), h('span', { class: 'term__hint' }, 'taip "bantuan"'),
          h('button', { class: 'icon-btn icon-btn--sm', 'aria-label': 'Tutup terminal', onClick: () => this.close() }, M.icon('x', 14))),
        out,
        h('label', { class: 'term__line' }, h('span', { class: 'term__prompt' }, (M.session.user || 'guest') + '@martod:~$'), inp));
      el.addEventListener('click', (e) => { if (!window.getSelection().toString()) inp.focus(); });
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { const v = inp.value; inp.value = ''; run(v); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) inp.value = hist[--hi]; }
        else if (e.key === 'ArrowDown') { e.preventDefault(); inp.value = hi < hist.length - 1 ? hist[++hi] : (hi = hist.length, ''); }
        else if (e.key === 'Tab') { e.preventDefault(); const v = inp.value.trim().toLowerCase(); if (v && !v.includes(' ')) { const m = Object.keys(C).filter((k) => k.startsWith(v) && C[k].d); if (m.length === 1) inp.value = m[0] + ' '; else if (m.length > 1) print(m.join('  '), 'dim'); } }
        else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); M.clear(out); }
        else if (e.key === 'Escape') { this.close(); }
        else M.fx.beep('key');
      });
      root.append(el);
      document.addEventListener('keydown', (e) => {
        if (!M.session.authed || M.overlay.count()) return;
        const typing = e.target && e.target.closest && e.target.closest('input,textarea,select');
        if ((e.key === '`' || e.key === '~') && !typing) { e.preventDefault(); this.toggle(); }
        else if (e.key === '`' && typing && e.target === inp) { e.preventDefault(); this.close(); }
      });
    },
    open() {
      open = true; el.classList.add('open'); document.body.classList.add('term-open');
      if (!booted) { booted = true; print('TERMINAL MARTOD v7.3 — DISAHKAN SEBAGAI ' + M.session.user, 'ok'); print('Taip "bantuan" untuk senarai arahan.', 'dim'); }
      setTimeout(() => inp.focus(), 60);
      const b = document.getElementById('btn-term'); if (b) b.classList.add('on');
    },
    close() { open = false; el.classList.remove('open'); document.body.classList.remove('term-open'); const b = document.getElementById('btn-term'); if (b) b.classList.remove('on'); },
    toggle() { open ? this.close() : this.open(); },
    print
  };
})(window.M);
