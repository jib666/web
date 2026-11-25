/* MARTOD component — application shell: banner, top bar, sidebar, status bar, global search */
(function (M) {
  'use strict';
  const h = M.h;

  const NAV = [
    ['dashboard', 'Papan Pemuka', 'dash', null],
    ['documents', 'Bahagian & Rekod', 'doc', () => M.store.get('documents').length],
    ['investigations', 'Fail Konflik', 'briefcase', () => M.store.get('investigations').length],
    ['reports', 'Kerajaan & Pertubuhan', 'chart', () => M.store.get('reports').length],
    ['evidence', 'Galeri Artifak', 'camera', () => M.store.get('evidence').length],
    ['personnel', 'Tokoh', 'user', () => M.store.get('personnel').length],
    ['timeline', 'Garis Masa', 'clock', () => M.store.get('timeline').length],
    ['logs', 'Log Sistem', 'terminal', () => M.logs.all().length]
  ];
  const COLL_LABEL = { documents: 'REKOD', reports: 'ENTITI', investigations: 'KONFLIK', evidence: 'ARTIFAK', personnel: 'TOKOH', timeline: 'PERISTIWA' };

  let refs = {}, timer = null, unsubs = [];

  M.shell = {
    mount(root) {
      refs = {};
      M.clear(root);
      /* ---- classification banner ---- */
      refs.banner = h('div', { class: 'cbanner' });
      /* ---- top bar ---- */
      refs.clr = h('button', { class: 'chip chip--clr', title: 'Tukar tahap capaian sesi (simulasi)', onClick: () => clearanceDialog() });
      refs.op = h('span', { class: 'chip chip--op' });
      const gs = globalSearch();
      const topbar = h('header', { class: 'topbar' },
        h('button', { class: 'icon-btn menu-btn', 'aria-label': 'Buka/tutup navigasi', onClick: () => document.body.classList.toggle('nav-open') }, M.icon('menu', 20)),
        h('a', { class: 'brand', href: '#/dashboard' }, h('i', { class: 'led led--red' }), h('b', null, 'MARTOD'), h('span', null, 'ARKIB')),
        gs,
        h('div', { class: 'topbar__right' },
          refs.clr, refs.op,
          h('button', { class: 'icon-btn', title: 'Muat naik fail', 'aria-label': 'Muat naik fail', onClick: () => M.upload.open() }, M.icon('upload')),
          h('button', { class: 'icon-btn', id: 'btn-fx', title: 'Hidup/matikan kesan visual', 'aria-label': 'Kesan visual', onClick: (e) => { M.fx.toggle(); e.currentTarget.classList.toggle('on', M.fx.on); } }, M.icon('zap')),
          h('button', { class: 'icon-btn', id: 'btn-term', title: 'Terminal ( ` )', 'aria-label': 'Buka/tutup terminal', onClick: () => M.terminal.toggle() }, M.icon('terminal')),
          h('button', { class: 'icon-btn', title: 'Log keluar', 'aria-label': 'Log keluar', onClick: () => M.app.logout() }, M.icon('logout'))));
      /* ---- sidebar ---- */
      refs.nav = {};
      const nav = h('nav', { class: 'sidebar', 'aria-label': 'Utama' },
        h('div', { class: 'sidebar__title' }, '// NAVIGASI'),
        NAV.map(([key, label, icon, count], i) => {
          const c = h('span', { class: 'nav__count' });
          const a = h('a', { class: 'nav__item', href: '#/' + key, dataset: { key } },
            h('span', { class: 'nav__no' }, M.pad(i + 1)), M.icon(icon, 17), h('span', { class: 'nav__label' }, label), c);
          refs.nav[key] = { a, c, count };
          return a;
        }),
        h('div', { class: 'sidebar__foot' },
          h('div', { class: 'radar-mini' }, h('i')),
          h('div', null, h('b', null, 'PAUTAN ARKIB'), h('span', null, 'DISULIT // SIMULASI'))));
      const main = h('main', { class: 'main', id: 'view', tabindex: '-1' });
      /* ---- status bar ---- */
      refs.sess = h('span');
      refs.clock = h('span');
      refs.edits = h('button', { class: 'status__edits', onClick: () => editsDialog() });
      const status = h('footer', { class: 'statusbar' },
        h('span', { class: 'status__link' }, h('i', { class: 'led led--green' }), 'PAUTAN SELAMAT (SIMULASI)'),
        h('span', { class: 'status__sess' }, 'SESI ', refs.sess),
        refs.edits, h('span', { class: 'status__spacer' }), refs.clock);
      const veil = h('div', { class: 'dropveil' }, M.icon('upload', 40), h('b', null, 'LEPASKAN FAIL UNTUK MUAT NAIK'));
      root.append(refs.banner, topbar, h('div', { class: 'shell' }, nav, main, h('div', { class: 'nav-backdrop', onClick: () => document.body.classList.remove('nav-open') })), status, veil);

      /* nav closes on mobile after choosing */
      nav.addEventListener('click', (e) => { if (e.target.closest('a')) document.body.classList.remove('nav-open'); });

      /* global drag and drop to upload */
      let dragN = 0;
      const hasFiles = (e) => e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files');
      window.addEventListener('dragenter', (e) => { if (hasFiles(e) && !M.overlay.count()) { dragN++; document.body.classList.add('dragging'); } });
      window.addEventListener('dragleave', (e) => { if (hasFiles(e)) { dragN = Math.max(0, dragN - 1); if (!dragN) document.body.classList.remove('dragging'); } });
      window.addEventListener('dragover', (e) => { if (hasFiles(e)) e.preventDefault(); });
      window.addEventListener('drop', (e) => {
        if (!hasFiles(e)) return;
        dragN = 0; document.body.classList.remove('dragging');
        if (e.target.closest && e.target.closest('.dropzone')) return;
        e.preventDefault();
        if (!M.overlay.count()) M.upload.open({ files: e.dataTransfer.files });
      });

      document.getElementById('btn-fx').classList.toggle('on', M.fx.on);
      this.refresh();
      tick();
      timer = setInterval(tick, 1000);
      unsubs.push(M.store.onChange(() => this.refresh()));
      unsubs.push(M.logs.on(() => this.refresh()));
      return main;
    },

    refresh() {
      if (!refs.banner) return;
      const lvl = M.session.levelName();
      refs.banner.textContent = '';
      refs.banner.className = 'cbanner cbanner--' + M.clsKey(lvl);
      refs.banner.append(h('span', null, `${lvl} // ARKIB SEJARAH ${M.cfg.meta.title} UNIVERSE // CAPAIAN TERKAWAL`));
      refs.clr.textContent = ''; refs.clr.append(M.icon('shield', 14), h('span', null, `L${M.session.clearance} · ${lvl}`));
      refs.op.textContent = ''; refs.op.append(M.icon('user', 14), h('span', null, M.session.user || ''));
      NAV.forEach(([key,,, count]) => { if (count && refs.nav[key]) refs.nav[key].c.textContent = count(); });
      refs.edits.textContent = M.store.hasLocalEdits() ? '◆ SUNTINGAN TEMPATAN AKTIF' : '◇ DATA ASAL ARKIB';
      refs.edits.classList.toggle('on', M.store.hasLocalEdits());
      refs.sess.textContent = M.session.id || '';
    },
    setActive(name) { Object.entries(refs.nav || {}).forEach(([k, v]) => v.a.classList.toggle('active', k === name)); },
    teardown() { clearInterval(timer); unsubs.forEach((u) => u()); unsubs = []; }
  };

  function tick() {
    if (!refs.clock) return;
    refs.clock.textContent = 'UTC ' + M.fmtClock(new Date()) + ' · AKTIF ' + (() => { const s = Math.floor((Date.now() - (M.session.started || Date.now())) / 1000); return M.pad(Math.floor(s / 60)) + ':' + M.pad(s % 60); })();
  }

  /* ---- global search with dropdown ---- */
  function globalSearch() {
    const input = h('input', { type: 'search', id: 'gsearch', placeholder: 'Cari dalam arkib ( / )', autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Cari seluruh arkib' });
    const list = h('div', { class: 'gsearch__list', role: 'listbox' });
    const wrap = h('div', { class: 'gsearch' }, M.icon('search', 16), input, list);
    let results = [], sel = -1;
    const draw = () => {
      M.clear(list);
      const q = input.value.trim();
      if (!q) { wrap.classList.remove('open'); return; }
      results = M.searchAll(q);
      wrap.classList.add('open');
      if (!results.length) { list.append(h('div', { class: 'gs__none' }, `TIADA PADANAN UNTUK "${q}"`)); return; }
      results.slice(0, 12).forEach((r, i) => list.append(h('button', { class: 'gs__item' + (i === sel ? ' sel' : ''), type: 'button', onMousedown: (e) => { e.preventDefault(); go(r); } },
        h('span', { class: 'gs__tag' }, COLL_LABEL[r.coll]), h('b', null, r.item.id),
        h('span', { class: 'gs__t' }, M.titleOf(r.coll, r.item) || h('span', { class: 'ph' }, M.phOf(r.coll, M.schemas[r.coll].titleKey))))));
      if (results.length > 12) list.append(h('div', { class: 'gs__none' }, `+${results.length - 12} LAGI · PERSEMPIT CARIAN`));
    };
    function go(r) {
      input.value = ''; wrap.classList.remove('open'); input.blur(); sel = -1;
      M.logs.add('SEARCH', 'DIBUKA ' + r.item.id + ' DARIPADA CARIAN');
      if (r.coll === 'timeline' || r.coll === 'evidence') { M.router.go(r.coll === 'timeline' ? 'timeline' : 'evidence', r.item.id); }
      else M.openRecord(r.coll, r.item.id);
    }
    input.addEventListener('input', M.debounce(() => { sel = -1; draw(); }, 80));
    input.addEventListener('focus', draw);
    input.addEventListener('blur', () => setTimeout(() => wrap.classList.remove('open'), 120));
    input.addEventListener('keydown', (e) => {
      const max = Math.min(12, results.length) - 1;
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(max, sel + 1); draw(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); draw(); }
      else if (e.key === 'Enter') { const r = results[Math.max(0, sel)]; if (r) go(r); }
      else if (e.key === 'Escape') { input.value = ''; input.blur(); }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !M.overlay.count() && !(e.target.closest && e.target.closest('input,textarea,select'))) { e.preventDefault(); input.focus(); }
    });
    return wrap;
  }

  /* ---- dialogs ---- */
  function clearanceDialog() {
    const sel = h('select', null, M.cfg.classifications.map((c, i) => h('option', { value: i + 1 }, `TAHAP ${i + 1} · ${c}`)));
    sel.value = M.session.clearance;
    M.modal.open({
      title: 'TAHAP CAPAIAN SESI',
      body: h('div', { class: 'form' },
        h('p', { class: 'field field--wide modal__msg' }, 'Simulasi: tukar tahap capaian untuk melihat bagaimana rekod di atas tahap anda disorokkan. Rekod tanpa klasifikasi boleh dibaca pada semua tahap.'),
        h('label', { class: 'field field--wide' }, h('span', { class: 'field__label' }, 'Tahap capaian'), sel)),
      actions: [{ label: 'BATAL' }, { label: 'LAKSANA', kind: 'primary', onClick: () => { M.session.setClearance(+sel.value); M.logs.add('AUTH', `TAHAP CAPAIAN DITETAPKAN: ${sel.value} (${M.session.levelName()})`); M.shell.refresh(); M.router.render(); M.toast('TAHAP: ' + M.session.levelName(), 'ok'); } }]
    });
  }
  function editsDialog() {
    const has = M.store.hasLocalEdits();
    M.modal.open({
      title: 'DATA ARKIB', wide: true,
      body: h('div', { class: 'modal__msg' },
        h('p', null, has ? 'Suntingan yang dibuat dalam pelayar ini disimpan setempat dan mengatasi js/data/archive-data.js.' : 'Belum ada suntingan dalam pelayar. Arkib memaparkan tepat apa yang ada dalam js/data/archive-data.js.'),
        h('p', { class: 'dim' }, 'Untuk menjadikan suntingan kekal dalam projek, eksport dan gantikan js/data/archive-data.js dengan fail yang dimuat turun. Fail yang dimuat naik (termasuk gambar rekod) kekal dalam pelayar sahaja; untuk gambar kekal, letakkan dalam folder images/.')),
      actions: [
        { label: 'EKSPORT archive-data.js', icon: 'download', close: false, onClick: () => { M.download('archive-data.js', M.store.exportJS(), 'text/javascript'); M.logs.add('SYS', 'DATA DIEKSPORT'); return false; } },
        { label: 'EKSPORT JSON', icon: 'download', close: false, onClick: () => { M.download('archive-data.json', JSON.stringify(M.store.exportObject(), null, 2), 'application/json'); return false; } },
        { label: 'IMPORT JSON', icon: 'upload', close: false, onClick: () => { importJSON(); return false; } },
        { label: 'SET SEMULA KE ASAL', kind: 'danger', icon: 'reset', onClick: async () => { if (await M.modal.confirm('SET SEMULA ARKIB', 'Buang semua suntingan dan muat naik yang disimpan dalam pelayar ini?', 'SET SEMULA')) { M.store.reset(); M.logs.add('SYS', 'ARKIB DISET SEMULA KE ASAL'); M.router.render(); M.toast('ARKIB DISET SEMULA', 'warn'); } } }
      ]
    });
  }
  function importJSON() {
    const inp = h('input', { type: 'file', accept: '.json,application/json', hidden: true });
    inp.addEventListener('change', async () => {
      const f = inp.files[0]; if (!f) return;
      try { const obj = JSON.parse(await f.text()); const n = M.store.importObject(obj); M.logs.add('SYS', `${n} REKOD DIIMPORT DARIPADA ${f.name}`); M.toast(`${n} REKOD DIIMPORT`, 'ok'); M.router.render(); }
      catch (e) { M.toast('IMPORT GAGAL: JSON TIDAK SAH', 'warn'); }
    });
    document.body.append(inp); inp.click(); setTimeout(() => inp.remove(), 60000);
  }
  M.shell.editsDialog = editsDialog;
  M.shell.clearanceDialog = clearanceDialog;
})(window.M);
