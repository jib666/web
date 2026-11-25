/* MARTOD view — papan pemuka arkib cerita */
(function (M) {
  'use strict';
  const h = M.h;
  const COLLS = ['documents', 'reports', 'investigations', 'evidence', 'personnel', 'timeline'];

  M.router.register('dashboard', {
    title: 'Papan Pemuka',
    mount(root) {
      let first = true;
      const unsubs = [];
      let pending = null;
      const draw = () => {
        const keep = root.scrollTop;
        M.clear(root);
        root.append(build(first));
        first = false;
        root.scrollTop = keep;
      };
      const soon = () => { clearTimeout(pending); pending = setTimeout(draw, 160); };
      unsubs.push(M.store.onChange(soon), M.logs.on(soon));
      draw();
      return () => { clearTimeout(pending); unsubs.forEach((u) => u()); };
    }
  });

  function build(animate) {
    const docs = M.store.get('documents'), reps = M.store.get('reports'), cases = M.store.get('investigations'), evd = M.store.get('evidence');
    const folders = M.store.get('folders'), people = M.store.get('personnel');
    const withPic = (d) => !!(d.image || d.imagePath);
    const week = Date.now() - 7 * 86400000;
    const recent = [];
    COLLS.forEach((c) => M.store.get(c).forEach((it) => { if (it.updated) recent.push({ coll: c, item: it, t: new Date(it.updated).getTime() }); }));
    recent.sort((a, b) => b.t - a.t);
    const recentCount = recent.filter((r) => r.t > week).length;

    const tile = (label, value, sub, icon, onClick, extra) => {
      const num = h('b', { class: 'tile__num' }, '0');
      const t = h('button', { class: 'tile', type: 'button', onClick }, h('span', { class: 'tile__ico' }, M.icon(icon, 20)), h('span', { class: 'tile__label' }, label), extra || num, h('span', { class: 'tile__sub' }, sub), h('i', { class: 'tile__scan' }));
      if (!extra) { if (animate) M.fx.countUp(num, value, 800); else num.textContent = value; }
      return t;
    };

    /* picture progress: uploaded / path / images/rekod-NNN.* — resolved asynchronously */
    const picNum = h('b', { class: 'tile__num' }, String(docs.filter(withPic).length));
    const picSub = h('span', { class: 'tile__sub' }, `DARIPADA ${docs.length} REKOD · KLIK UNTUK ISI`);
    const picTile = h('button', { class: 'tile', type: 'button', onClick: () => M.router.go('documents') }, h('span', { class: 'tile__ico' }, M.icon('image', 20)), h('span', { class: 'tile__label' }, 'REKOD BERGAMBAR'), picNum, picSub, h('i', { class: 'tile__scan' }));
    const partBars = {};
    Promise.all(docs.map((d) => M.figure.resolve(d).then((r) => [d, !!r]))).then((res) => {
      if (!picNum.isConnected) return;
      picNum.textContent = res.filter((x) => x[1]).length;
      folders.forEach((f) => {
        const mine = res.filter((x) => x[0].folder === f.id), done = mine.filter((x) => x[1]).length, b = partBars[f.id];
        if (b) { b.fill.style.width = (mine.length ? done / mine.length * 100 : 0) + '%'; b.txt.textContent = `${done}/${mine.length} GAMBAR`; }
      });
    });

    const meter = h('div', { class: 'meter' }, M.cfg.classifications.map((c, i) => h('i', { class: i < M.session.clearance ? 'on' : '', title: c })));
    const clrTile = tile('TAHAP CAPAIAN', 0, `TAHAP ${M.session.clearance} DARIPADA ${M.cfg.classifications.length} · KLIK UNTUK TUKAR`, 'shield', () => M.shell.clearanceDialog(),
      h('div', { class: 'tile__clr' }, h('b', null, M.session.levelName()), meter));

    const stats = h('section', { class: 'tiles' },
      tile('REKOD ARKIB', docs.length, `${folders.length} BAHAGIAN · ${docs.filter((d) => d.content).length} BERISI`, 'doc', () => M.router.go('documents')),
      picTile,
      tile('FAIL KONFLIK', cases.length, 'PEPERANGAN & PERTEMPURAN', 'briefcase', () => M.router.go('investigations')),
      tile('KERAJAAN & PERTUBUHAN', reps.length, 'TUJUH KERAJAAN, LEGION, ORDO …', 'chart', () => M.router.go('reports')),
      tile('TOKOH', people.length, `${evd.length} ARTIFAK DALAM GALERI`, 'user', () => M.router.go('personnel')),
      clrTile);

    /* ---- radar ---- */
    const radar = h('div', { class: 'radar' }, h('i', { class: 'radar__sweep' }), h('i', { class: 'radar__ring r1' }), h('i', { class: 'radar__ring r2' }), h('i', { class: 'radar__ring r3' }), h('i', { class: 'radar__x' }), h('i', { class: 'radar__y' }));
    const tip = h('div', { class: 'radar__tip' }, 'LETAK KURSOR PADA TITIK');
    [['documents', docs], ['reports', reps], ['evidence', evd]].forEach(([c, list]) => list.forEach((it) => {
      const hh = M.hash(it.id);
      const ang = (hh % 360) * Math.PI / 180, rad = 0.2 + ((hh >>> 9) % 70) / 100 * 0.75;
      const dot = h('button', { class: 'blip blip--' + c, type: 'button', style: { left: (50 + Math.cos(ang) * rad * 46) + '%', top: (50 + Math.sin(ang) * rad * 46) + '%', '--d': (hh % 40) / 10 + 's' }, 'aria-label': 'Buka ' + it.id, onMouseenter: () => { tip.textContent = `${it.id} · ${M.titleOf(c, it) || M.phOf(c, M.schemas[c].titleKey)}`; }, onClick: () => M.openRecord(c, it.id) });
      radar.append(dot);
    }));

    /* ---- classification distribution ---- */
    const dist = {}; M.cfg.classifications.forEach((c) => { dist[c] = 0; }); dist['TANPA KLASIFIKASI'] = 0;
    ['documents', 'reports', 'investigations', 'evidence'].forEach((c) => M.store.get(c).forEach((it) => { if (it.classification) dist[it.classification] = (dist[it.classification] || 0) + 1; else dist['TANPA KLASIFIKASI']++; }));
    const maxD = Math.max(1, ...Object.values(dist));
    const bars = h('div', { class: 'bars' }, Object.entries(dist).map(([k, v]) => {
      const key = k === 'TANPA KLASIFIKASI' ? 'none' : M.clsKey(k);
      return h('button', { class: 'bar bar--' + key, type: 'button', title: `${v} rekod · klik untuk menapis rekod`, onClick: () => { M.ui.docs.cls = k === 'TANPA KLASIFIKASI' ? '__none' : k; M.router.go('documents'); } },
        h('span', { class: 'bar__k' }, k), h('span', { class: 'bar__t' }, h('i', { style: { width: (v / maxD * 100) + '%' } })), h('b', null, v));
    }));

    /* ---- activity (last 14 days) ---- */
    const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (13 - i)); return { t: d.getTime(), n: 0 }; });
    M.logs.all().forEach((l) => { if (l.level === 'NAV' || l.level === 'SYS') return; const t = new Date(l.t).getTime(); for (let i = days.length - 1; i >= 0; i--) if (t >= days[i].t) { days[i].n++; break; } });
    const maxA = Math.max(1, ...days.map((d) => d.n));
    const act = h('div', { class: 'spark' }, days.map((d) => h('i', { style: { height: (6 + d.n / maxA * 94) + '%' }, title: `${new Date(d.t).toLocaleDateString('ms-MY')} · ${d.n} tindakan` })));

    /* ---- feeds ---- */
    const feedItems = M.logs.all().filter((l) => !['NAV', 'CMD'].includes(l.level)).slice(-8).reverse();
    const feed = h('div', { class: 'feed' }, feedItems.length ? feedItems.map((l) => h('button', { class: 'feed__i', type: 'button', disabled: !l.link, onClick: () => { if (l.link) { if (l.link.view === 'documents' || l.link.view === 'reports') M.openRecord(l.link.view, l.link.id); else M.router.go(l.link.view, l.link.id); } } },
      h('span', { class: 'feed__t' }, M.ago(l.t)), h('span', { class: 'tag tag--' + l.level.toLowerCase() }, M.logs.label(l.level)), h('span', { class: 'feed__m' }, l.msg))) : [M.empty('BELUM ADA AKTIVITI')]);

    const rec = h('div', { class: 'feed', id: 'recent-panel' });
    if (recent.length) recent.slice(0, 6).forEach((r) => rec.append(h('button', { class: 'feed__i', type: 'button', onClick: () => M.openRecord(r.coll, r.item.id) },
      h('span', { class: 'feed__t' }, M.ago(r.item.updated)), h('span', { class: 'tag' }, r.item.id), h('span', { class: 'feed__m' }, M.titleOf(r.coll, r.item) || h('span', { class: 'ph' }, M.phOf(r.coll, M.schemas[r.coll].titleKey))))));
    else {
      rec.append(M.empty('BELUM ADA PERUBAHAN', 'Sunting rekod atau muat naik gambar dan ia akan muncul di sini.'));
      docs.slice(0, 3).forEach((d) => rec.append(h('button', { class: 'feed__i', type: 'button', onClick: () => M.openRecord('documents', d.id) }, h('span', { class: 'feed__t' }, 'BELUM'), h('span', { class: 'tag' }, d.id), h('span', { class: 'feed__m' }, h('span', { class: 'ph' }, '[TAJUK REKOD]')))));
    }

    const welcome = h('div', { class: 'welcome' }, h('span', { class: 'welcome__p' }, '>'), h('span', { class: 'welcome__t' }));
    const msg = `SELAMAT DATANG, ${M.session.user}. TAHAP CAPAIAN: ${M.session.clearance} · ${M.session.levelName()}. INTEGRITI ARKIB: NORMAL.`;
    if (animate) M.fx.type(M.$('.welcome__t', welcome), msg, 14); else M.$('.welcome__t', welcome).textContent = msg;

    const panel = (code, title, body, cls) => h('section', { class: 'panel ' + (cls || '') }, h('header', { class: 'panel__h' }, h('span', null, code), h('b', null, title)), h('div', { class: 'panel__b' }, body));

    /* ---- arkib: tajuk cerita + bahagian ---- */
    const arch = M.cfg.meta.archive || {};
    const about = h('div', { class: 'about' },
      h('p', { class: 'about__story' }, M.cfg.meta.storyTitle || ''),
      h('dl', { class: 'kv kv--grid' }, Object.entries(arch).map(([k, v]) => [h('dt', null, k.toUpperCase()), h('dd', null, v)])));
    const parts = h('div', { class: 'parts' }, folders.map((f) => {
      const mine = docs.filter((d) => d.folder === f.id), n = mine.filter(withPic).length;
      const fill = h('i', { style: { width: (mine.length ? n / mine.length * 100 : 0) + '%' } });
      const txt = h('span', null, `${n}/${mine.length} GAMBAR`);
      partBars[f.id] = { fill, txt };
      return h('button', { class: 'part', type: 'button', onClick: () => { M.ui.docs.mode = 'folders'; M.ui.docs.closed.delete(f.id); M.router.go('documents', f.id); } },
        h('span', { class: 'part__l' }, f.label || f.id), h('b', null, f.name || ''), h('em', null, mine.length + ' REKOD'),
        h('span', { class: 'part__bar' }, fill), txt);
    }));

    return h('div', { class: 'dash' },
      M.viewHead('// 01 · TINJAUAN ARKIB', 'PAPAN PEMUKA', 'Ringkasan arkib sejarah Martod. Semua angka dikira daripada rekod.', [
        M.btn('REKOD BAHARU', 'plus', () => M.editor.open('documents', null), 'primary'), M.btn('MUAT NAIK', 'upload', () => M.upload.open())]),
      welcome, stats,
      h('div', { class: 'dash__grid' },
        panel('ARKIB', 'MARTOD · SANG LAGENDA', about, 'panel--wide'),
        panel('BHG', 'BAHAGIAN CERITA', parts, 'panel--wide'),
        panel('IMBAS', 'IMBASAN ARKIB', [radar, tip, h('div', { class: 'legend' }, h('span', { class: 'lg lg--d' }, 'REKOD'), h('span', { class: 'lg lg--r' }, 'ENTITI'), h('span', { class: 'lg lg--e' }, 'ARTIFAK'))], 'panel--radar'),
        panel('KELAS', 'TABURAN KLASIFIKASI', [bars, h('p', { class: 'panel__note' }, 'Rekod · entiti · konflik · artifak. Klik bar untuk menapis senarai rekod.')]),
        panel('SUAPAN', 'AKTIVITI TERKINI', feed),
        panel('FAIL', 'BARU DIKEMAS KINI', rec),
        panel('AKT', 'AKTIVITI · 14 HARI TERAKHIR', [act, h('div', { class: 'spark__ax' }, h('span', null, '−14H'), h('span', null, 'HARI INI'))], 'panel--wide')));
  }
})(window.M);
