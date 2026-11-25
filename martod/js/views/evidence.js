/* MARTOD view — galeri artifak */
(function (M) {
  'use strict';
  const h = M.h;

  M.router.register('evidence', {
    title: 'Galeri Artifak',
    mount(root, params) {
      const st = M.ui.evidence;
      const grid = h('div', { class: 'evgrid' });
      const chips = h('div', { class: 'chipbar', role: 'group', 'aria-label': 'Tapis mengikut jenis' });
      const count = h('span', { class: 'toolbar__count' });

      const filtered = () => {
        const q = st.q.trim().toLowerCase();
        return M.store.get('evidence').filter((e) => (st.type === 'all' || e.type === st.type) && (!q || M.haystack('evidence', e).includes(q)));
      };

      function tile(e) {
        const locked = !M.canAccess(e);
        const thumb = h('div', { class: 'evtile__thumb' + (locked ? ' locked' : '') },
          h('i', { class: 'corner tl' }), h('i', { class: 'corner tr' }), h('i', { class: 'corner bl' }), h('i', { class: 'corner br' }), h('i', { class: 'evtile__scan' }));
        if (locked) thumb.append(h('div', { class: 'evtile__ph' }, M.icon('lock', 30), h('span', null, 'TERHAD')));
        else if (e.file) {
          const k = M.kindOf(e.file);
          if (k === 'image') { thumb.append(h('div', { class: 'evtile__img' })); M.blobs.url(e.file.blobId).then((u) => { const d = M.$('.evtile__img', thumb); if (u && d) d.style.backgroundImage = `url("${u}")`; }); }
          else thumb.append(h('div', { class: 'evtile__ph evtile__ph--file' }, M.icon(M.TYPE_ICON[e.type] || 'clip', 34), h('span', null, e.file.name)));
        } else if (e.imagePath) {
          const d = h('div', { class: 'evtile__img' }); d.style.backgroundImage = `url("${e.imagePath}")`; thumb.append(d);
        } else thumb.append(h('div', { class: 'evtile__ph' }, M.icon(M.TYPE_ICON[e.type] || 'clip', 34), h('span', { class: 'ph' }, '[LETAK ' + M.evdTypeLabel(e.type).toUpperCase() + ']')));
        const t = h('article', { class: 'evtile' + (e.file || e.imagePath ? ' has-file' : ''), dataset: { id: e.id } },
          h('button', { class: 'evtile__open', type: 'button', 'aria-label': 'Buka ' + e.id, onClick: () => M.preview.openEvidence(e.id, filtered().map((x) => x.id)) }, thumb),
          h('div', { class: 'evtile__cap' },
            h('div', { class: 'evtile__row' }, h('span', { class: 'evtile__id' }, e.id), h('span', { class: 'evtile__type' }, M.evdTypeLabel(e.type)), e.file ? h('span', { class: 'evtile__file' }, M.icon('clip', 11)) : (e.imagePath ? h('span', { class: 'evtile__file' }, M.icon('image', 11)) : h('span', { class: 'evtile__nofile' }, 'TIADA FAIL'))),
            h('b', null, locked ? h('span', { class: 'redact' }, '████████') : M.ph(e.title, '[NAMA ARTIFAK]')),
            h('div', { class: 'evtile__row' }, M.stamp(e.classification, { mini: true, seed: e.id }),
              h('span', { class: 'evtile__btns' },
                locked ? null : h('button', { class: 'icon-btn icon-btn--sm', title: 'Muat naik / ganti fail', 'aria-label': 'Muat naik fail', onClick: () => M.upload.open({ evidenceId: e.id }) }, M.icon('upload', 14)),
                locked ? null : h('button', { class: 'icon-btn icon-btn--sm', title: 'Sunting butiran', 'aria-label': 'Sunting', onClick: () => M.editor.open('evidence', e.id) }, M.icon('edit', 14))))));
        return t;
      }

      function draw() {
        const keep = root.scrollTop;
        M.clear(chips); M.clear(grid);
        const all = M.store.get('evidence');
        const mk = (val, label, n) => h('button', { type: 'button', class: 'chipbtn' + (st.type === val ? ' on' : ''), onClick: () => { st.type = val; draw(); } }, label, h('em', null, n));
        chips.append(mk('all', 'SEMUA', all.length), ...M.EVD_TYPES.map(([v, l]) => mk(v, l.toUpperCase(), all.filter((e) => e.type === v).length)));
        const shown = filtered();
        count.textContent = `${shown.length} DARIPADA ${all.length} ARTIFAK`;
        if (!shown.length) grid.append(M.empty('TIADA ARTIFAK SEPADAN', 'Tukar tapisan, atau tambah artifak.'));
        shown.forEach((e) => grid.append(tile(e)));
        root.scrollTop = keep;
      }

      root.append(
        M.viewHead('// 05 · ARTIFAK', 'GALERI ARTIFAK', 'Peninggalan Martod yang ditemui dalam cerita: mahkota hitam, jurnal, surat terakhir dan lain-lain. Klik satu jubin untuk pratonton skrin penuh, dan muat naik gambar atau fail pada setiap artifak.', [
          M.btn('TAMBAH ARTIFAK', 'plus', () => M.editor.open('evidence', null), 'primary'), M.btn('MUAT NAIK FAIL', 'upload', () => M.upload.open({ dest: 'evidence' }))]),
        h('div', { class: 'toolbar' }, M.searchBox(st.q, 'Cari artifak', (v) => { st.q = v; draw(); }), count), chips, grid);
      const unsub = M.store.onChange((c) => { if (c === 'evidence' || c === '*') draw(); });
      draw();
      if (params && params.arg && M.store.find('evidence', params.arg)) M.preview.openEvidence(params.arg, filtered().map((x) => x.id));
      return unsub;
    }
  });
})(window.M);
