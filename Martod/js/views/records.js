/* MARTOD views — Fail Konflik, Kerajaan & Pertubuhan, Tokoh
   (satu paparan senarai kad boleh guna semula, dikonfigurasi bagi setiap koleksi) */
(function (M) {
  'use strict';
  const h = M.h;

  function silhouette() {
    const s = document.createElement('span');
    s.className = 'avatar';
    s.innerHTML = '<svg viewBox="0 0 80 96" fill="currentColor"><circle cx="40" cy="32" r="16"/><path d="M8 94c2-24 16-36 32-36s30 12 32 36z"/></svg><i></i>';
    return s;
  }

  /* gambar kecil pada kad: avatar potret (Tokoh) atau lakaran (Kerajaan / Konflik); jatuh balik ke siluet jika tiada */
  function cardImg(it, portrait) {
    if (!it.imagePath) return portrait ? silhouette() : null;
    const wrap = h('span', { class: portrait ? 'avatar avatar--photo' : 'rthumb' });
    const img = h('img', { src: it.imagePath, alt: '', loading: 'lazy', draggable: 'false' });
    img.addEventListener('error', () => { if (portrait) wrap.replaceWith(silhouette()); else wrap.remove(); });
    wrap.append(img);
    if (portrait) wrap.append(h('i'));
    return wrap;
  }

  function makeView(cfg) {
    const coll = cfg.coll, sch = M.schemas[coll];
    const clsKey = coll === 'personnel' ? 'clearance' : 'classification';
    const statusField = sch.fields.find((f) => f.key === 'status' && f.type === 'select');
    const hasCls = sch.fields.some((f) => f.key === clsKey);

    return {
      title: cfg.title,
      mount(root, params) {
        const st = M.ui.rec[coll] = M.ui.rec[coll] || { q: '', cls: '', status: '' };
        const grid = h('div', { class: 'rgrid' });
        const count = h('span', { class: 'toolbar__count' });
        const open = new Set();

        const card = (it) => {
          const locked = !M.canAccess({ classification: it[clsKey] });
          const isOpen = open.has(it.id);
          const cardCls = it[clsKey];
          const sumFields = sch.fields.filter((f) => f.key !== sch.titleKey && f.type !== 'textarea' && f.key !== clsKey && f.key !== 'status' && f.type !== 'doclist').slice(0, 2);
          const detail = () => {
            if (locked) return h('div', { class: 'rcard__det' }, h('div', { class: 'denied denied--inline' }, h('b', null, 'AKSES DITOLAK'), h('span', null, `MEMERLUKAN TAHAP ${M.rank(cardCls)} · ${cardCls}`)));
            const kv = [];
            sch.fields.filter((f) => f.type !== 'textarea' && f.key !== sch.titleKey).forEach((f) => {
              if (f.optional && !it[f.key]) return;
              let v;
              if (f.type === 'date') v = M.ph(M.fmtDate(it[f.key]), f.ph);
              else if (f.type === 'doclist') v = it[f.key] ? h('span', { class: 'chips' }, M.docChips(it[f.key])) : M.ph('', f.ph);
              else v = M.ph(it[f.key], f.ph);
              kv.push(h('dt', null, f.label.toUpperCase()), h('dd', null, v));
            });
            const ta = sch.fields.filter((f) => f.type === 'textarea');
            return h('div', { class: 'rcard__det' },
              h('dl', { class: 'kv kv--grid' }, kv),
              ta.map((f) => h('div', { class: 'kv__desc' }, h('b', null, f.label.toUpperCase()), it[f.key] ? h('p', { class: 'excerpt' }, it[f.key].replace(/[>*|]/g, '').slice(0, 500) + (it[f.key].length > 500 ? ' …' : '')) : h('span', { class: 'ph' }, f.ph))),
              h('div', { class: 'det__act' }, M.btn('BUKA FAIL', 'eye', () => M.docviewer.open(coll, it.id), 'primary'), M.btn('SUNTING', 'edit', () => M.editor.open(coll, it.id))));
          };
          return h('article', { class: 'rcard' + (isOpen ? ' open' : '') + (locked ? ' locked' : ''), dataset: { id: it.id } },
            h('i', { class: 'rcard__scan' }),
            h('header', { class: 'rcard__h' },
              h('span', { class: 'rcard__id' }, M.labelOf(coll, it)),
              statusField && it.status ? h('span', { class: 'status status--' + it.status.toLowerCase() }, h('i'), it.status) : (statusField ? h('span', { class: 'status status--none' }, h('i'), h('span', { class: 'ph' }, '[STATUS]')) : null),
              M.stamp(cardCls, { mini: true, seed: it.id })),
            h('div', { class: 'rcard__body' },
              coll === 'personnel' ? h('div', { class: 'rcard__photo' }, locked ? silhouette() : cardImg(it, true), M.barcode(it.id, 70, 14)) : (!locked && it.imagePath ? cardImg(it, false) : null),
              h('div', { class: 'rcard__txt' },
                h('h3', null, locked ? h('span', { class: 'redact' }, '████████████') : M.ph(it[sch.titleKey], M.phOf(coll, sch.titleKey))),
                h('p', null, locked ? 'KANDUNGAN DISOROKKAN' : sumFields.map((f, i) => [i ? ' · ' : '', M.ph(f.type === 'date' ? M.fmtDate(it[f.key]) : it[f.key], f.ph)])))),
            h('footer', { class: 'rcard__f' },
              h('button', { class: 'btn btn--sm', onClick: () => M.docviewer.open(coll, it.id) }, M.icon('eye', 14), 'BUKA'),
              h('button', { class: 'btn btn--sm', onClick: () => M.editor.open(coll, it.id) }, M.icon('edit', 14), 'SUNTING'),
              h('button', { class: 'icon-btn icon-btn--sm rcard__chev', 'aria-label': 'Kembangkan butiran', 'aria-expanded': String(isOpen), onClick: () => { isOpen ? open.delete(it.id) : open.add(it.id); draw(); } }, M.icon('chevron', 15))),
            isOpen ? detail() : null);
        };

        function draw() {
          const keep = root.scrollTop;
          M.clear(grid);
          const q = st.q.trim().toLowerCase();
          const all = M.store.get(coll);
          const shown = all.filter((it) => M.clsMatches(st.cls, it[clsKey]) && (!st.status || it.status === st.status) && (!q || M.haystack(coll, it).includes(q)));
          count.textContent = `${shown.length} DARIPADA ${all.length} REKOD`;
          if (!shown.length) grid.append(M.empty('TIADA REKOD SEPADAN', 'Laraskan carian atau tapisan, atau cipta rekod baharu.'));
          shown.forEach((it) => grid.append(card(it)));
          root.scrollTop = keep;
        }

        const tools = [M.searchBox(st.q, 'Cari dalam ' + cfg.title.toLowerCase(), (v) => { st.q = v; draw(); })];
        if (hasCls) tools.push(M.selectBox('KELAS', M.clsOptions(), st.cls, (v) => { st.cls = v; draw(); }));
        if (statusField) tools.push(M.selectBox('STATUS', [['', 'SEMUA'], ...statusField.options.map((o) => [o, o])], st.status, (v) => { st.status = v; draw(); }));
        tools.push(count);

        root.append(
          M.viewHead(cfg.code, cfg.title.toUpperCase(), cfg.sub, [M.btn(sch.single.toUpperCase() + ' BAHARU', 'plus', () => M.editor.open(coll, null), 'primary')]),
          h('div', { class: 'toolbar' }, tools), grid);
        const unsub = M.store.onChange((c) => { if (c === coll || c === '*') draw(); });
        draw();
        if (params && params.arg && M.store.find(coll, params.arg)) M.docviewer.open(coll, params.arg);
        return unsub;
      }
    };
  }

  M.router.register('investigations', makeView({ coll: 'investigations', code: '// 03 · FAIL KONFLIK', title: 'Fail Konflik', sub: 'Peperangan dan pertempuran utama dalam sejarah Martod: pihak terlibat, tempoh, keputusan dan rekod berkaitan.' }));
  M.router.register('reports', makeView({ coll: 'reports', code: '// 04 · KERAJAAN & PERTUBUHAN', title: 'Kerajaan & Pertubuhan', sub: 'Tujuh Kerajaan, Legion Hitam, Pengawal Abadi, The Vanguard, Ordo Abadi, Penjaga Fajar dan Empayar Nova.' }));
  M.router.register('personnel', makeView({ coll: 'personnel', code: '// 06 · TOKOH', title: 'Tokoh', sub: 'Watak dan pemerintah dalam cerita Martod, dengan rekod berkaitan yang boleh diklik.' }));
})(window.M);
