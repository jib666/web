/* MARTOD view — Bahagian & Rekod (cerita dipisahkan mengikut bahagian, kemudian rekod) */
(function (M) {
  'use strict';
  const h = M.h;
  const COLL = 'documents';

  const SORTS = [['num', 'NO. REKOD'], ['title', 'TAJUK A–Z'], ['updated', 'BARU DIKEMAS KINI']];
  function sorter(mode) {
    const num = (a, b) => a.id.localeCompare(b.id, undefined, { numeric: true });
    return {
      num,
      title: (a, b) => (a.title || '￿').localeCompare(b.title || '￿') || num(a, b),
      updated: (a, b) => (b.updated || '').localeCompare(a.updated || '') || num(a, b)
    }[mode] || num;
  }
  const snippet = (d) => {
    const t = String(d.content || '').replace(/[#>*|_-]+/g, ' ').replace(/\s+/g, ' ').trim();
    return t.length > 110 ? t.slice(0, 110).replace(/\s\S*$/, '') + ' …' : t;
  };

  M.router.register('documents', {
    title: 'Bahagian & Rekod',
    mount(root, params) {
      const st = M.ui.docs;
      const list = h('div', { class: 'docs__list' });
      const preview = h('aside', { class: 'docs__preview' });
      const count = h('span', { class: 'toolbar__count' });
      const expanded = new Set();
      let ro = null;

      const matches = (d) => {
        if (!M.clsMatches(st.cls, d.classification)) return false;
        const q = st.q.trim().toLowerCase();
        return !q || M.haystack(COLL, d).includes(q);
      };
      const folderLabel = (d) => { const f = M.store.find('folders', d.folder); return f ? (f.label || f.id) : 'TIADA BAHAGIAN'; };

      /* ---- satu baris rekod ---- */
      function row(d) {
        const locked = !M.canAccess(d);
        const sel = st.selected === d.id;
        const open = expanded.has(d.id);
        const title = locked ? h('span', { class: 'redact' }, '██████████████') : M.ph(d.title, '[TAJUK REKOD]');
        const hasPic = !locked && (d.image || d.imagePath);
        const el = h('div', { class: 'drow' + (sel ? ' sel' : '') + (locked ? ' locked' : '') + (open ? ' open' : ''), dataset: { id: d.id } },
          h('div', { class: 'drow__main', tabindex: '0', role: 'button', onClick: () => { if (window.matchMedia('(pointer: coarse), (max-width: 760px)').matches) openDoc(d); else select(d.id); }, onDblclick: () => openDoc(d), onKeydown: (e) => { if (e.key === 'Enter') openDoc(d); else if (e.key === ' ') { e.preventDefault(); select(d.id); } } },
            h('span', { class: 'drow__no' }, M.numOf(d.id)),
            h('div', { class: 'drow__t' },
              h('b', null, title, hasPic ? h('span', { class: 'drow__pic', title: 'Ada gambar' }, M.icon('image', 12)) : null),
              h('span', { class: 'drow__s' }, locked ? 'KANDUNGAN DISOROKKAN' : (snippet(d) || h('span', { class: 'ph' }, '[KANDUNGAN KOSONG]')))),
            h('span', { class: 'drow__a' }, locked ? h('span', { class: 'redact' }, '██████') : folderLabel(d)),
            h('span', { class: 'drow__c' }, locked ? M.icon('lock', 14) : null, M.stamp(d.classification, { mini: true, seed: d.id }))),
          h('div', { class: 'drow__btns' },
            h('button', { class: 'icon-btn icon-btn--sm', title: 'Buka dalam pemapar', 'aria-label': 'Buka ' + d.id, onClick: () => openDoc(d) }, M.icon('eye', 15)),
            h('button', { class: 'icon-btn icon-btn--sm drow__chev', title: 'Kembangkan butiran', 'aria-label': 'Kembangkan butiran', 'aria-expanded': String(open), onClick: () => { open ? expanded.delete(d.id) : expanded.add(d.id); draw(); } }, M.icon('chevron', 15))));
        if (open) el.append(details(d, locked));
        return el;
      }
      function details(d, locked) {
        if (locked) return h('div', { class: 'drow__det' }, h('div', { class: 'denied denied--inline' }, h('b', null, 'AKSES DITOLAK'), h('span', null, `MEMERLUKAN TAHAP ${M.rank(d.classification)} · ${d.classification}`)));
        const fo = M.store.find('folders', d.folder);
        const kv = (k, v) => [h('dt', null, k), h('dd', null, v)];
        return h('div', { class: 'drow__det' },
          h('dl', { class: 'kv kv--grid' },
            kv('TAJUK REKOD', M.ph(d.title, '[TAJUK REKOD]')), kv('BAHAGIAN', fo ? ((fo.label ? fo.label + ' — ' : '') + (fo.name || '')) : 'TIADA BAHAGIAN'),
            kv('KOD RUJUKAN', M.ph(d.reference, '—', 'mono')), kv('KLASIFIKASI', M.ph(d.classification, M.cfg.unclassifiedLabel)),
            kv('GAMBAR', (d.image || d.imagePath) ? 'ADA' : h('span', { class: 'ph' }, '[BELUM ADA]')), kv('LAMPIRAN', (d.attachments || []).length || '—')),
          h('div', { class: 'kv__desc' }, h('b', null, 'KANDUNGAN'), d.content ? h('p', { class: 'excerpt' }, d.content.replace(/[#>*|]/g, '').slice(0, 420) + (d.content.length > 420 ? ' …' : '')) : h('span', { class: 'ph' }, '[LETAK KANDUNGAN REKOD]')),
          h('div', { class: 'det__act' }, M.btn('BACA REKOD PENUH', 'eye', () => openDoc(d), 'primary')));
      }

      function openDoc(d) { select(d.id); M.docviewer.open(COLL, d.id); }
      function select(id) {
        st.selected = id;
        M.$$('.drow', list).forEach((r) => r.classList.toggle('sel', r.dataset.id === id));
        drawPreview();
      }

      /* ---- anak tetingkap pratonton ---- */
      function drawPreview() {
        M.clear(preview);
        const d = M.store.find(COLL, st.selected);
        preview.append(h('div', { class: 'docs__ph' }, h('span', null, 'PRATONTON'), d ? h('b', null, M.labelOf(COLL, d)) : null,
          d ? h('button', { class: 'btn btn--sm btn--primary', onClick: () => openDoc(d) }, M.icon('eye', 14), 'BUKA') : null));
        if (!d) { preview.append(M.empty('TIADA REKOD DIPILIH', 'Klik satu baris untuk pratonton di sini.')); return; }
        const box = h('div', { class: 'docs__paper' });
        const page = M.canAccess(d) ? M.paper.render(COLL, d, { mini: true }) : M.paper.renderLocked(COLL, d, { mini: true });
        box.append(page); preview.append(box);
        const fitIt = () => { const u = Math.max(0.3, Math.min(1, (box.clientWidth - 6) / 760)); page.style.fontSize = (16 * u) + 'px'; };
        fitIt();
        if (ro) ro.disconnect();
        if ('ResizeObserver' in window) { ro = new ResizeObserver(fitIt); ro.observe(box); }
      }

      /* ---- lukisan senarai ---- */
      function draw() {
        const keep = root.scrollTop;
        M.clear(list);
        const all = M.store.get(COLL);
        const shown = all.filter(matches).sort(sorter(st.sort));
        count.textContent = `${shown.length} DARIPADA ${all.length} REKOD`;
        const filtering = !!(st.q.trim() || st.cls);
        if (!shown.length && filtering) { list.append(M.empty('TIADA REKOD SEPADAN', 'Laraskan carian atau tapisan klasifikasi.')); }
        else if (st.mode === 'list') {
          const head = h('div', { class: 'drow drow--head' }, h('span', null, 'NO.'), h('span', null, 'TAJUK / PETIKAN'), h('span', null, 'BAHAGIAN'), h('span', null, 'KLASIFIKASI'));
          list.append(head, ...shown.map(row));
        } else {
          const folders = M.store.get('folders');
          const groups = folders.map((f) => ({ f, docs: shown.filter((d) => d.folder === f.id) }));
          const unfiled = shown.filter((d) => !d.folder || !folders.some((f) => f.id === d.folder));
          if (unfiled.length) groups.push({ f: { id: '', name: 'TIADA BAHAGIAN' }, docs: unfiled });
          groups.forEach(({ f, docs }) => {
            if (!docs.length && filtering) return;
            const isOpen = filtering || !st.closed.has(f.id);
            const folder = h('section', { class: 'folder' + (isOpen ? ' open' : ''), dataset: { folder: f.id } },
              h('header', { class: 'folder__h' },
                h('button', { class: 'folder__toggle', type: 'button', 'aria-expanded': String(isOpen), onClick: () => { if (filtering) return; isOpen ? st.closed.add(f.id) : st.closed.delete(f.id); draw(); } },
                  M.icon('folder', 18), h('span', { class: 'folder__id' }, f.label || f.id || '—'),
                  h('b', null, f.id ? M.ph(f.name, '[NAMA BAHAGIAN]') : 'TIADA BAHAGIAN'),
                  h('em', null, docs.length + ' REKOD'), M.icon('chevron', 16))),
              isOpen ? h('div', { class: 'folder__b' }, docs.length ? docs.map(row) : h('div', { class: 'folder__empty' }, 'BAHAGIAN KOSONG')) : null);
            list.append(folder);
          });
        }
        root.scrollTop = keep;
        if (!M.store.find(COLL, st.selected)) st.selected = shown[0] ? shown[0].id : null;
        M.$$('.drow', list).forEach((r) => r.classList.toggle('sel', r.dataset.id === st.selected));
        drawPreview();
      }

      /* ---- kepala + bar alat ---- */
      const bar = h('div', { class: 'toolbar' },
        M.searchBox(st.q, 'Cari tajuk, kod atau isi cerita', (v) => { st.q = v; draw(); }),
        M.selectBox('KELAS', M.clsOptions(), st.cls, (v) => { st.cls = v; draw(); }),
        M.selectBox('SUSUN', SORTS, st.sort, (v) => { st.sort = v; draw(); }),
        h('div', { class: 'seg', role: 'group', 'aria-label': 'Susun atur' },
          h('button', { class: st.mode === 'folders' ? 'on' : '', type: 'button', title: 'Paparan bahagian', onClick: () => setMode('folders') }, M.icon('folder', 15), 'BAHAGIAN'),
          h('button', { class: st.mode === 'list' ? 'on' : '', type: 'button', title: 'Paparan senarai', onClick: () => setMode('list') }, M.icon('list', 15), 'SENARAI')),
        count);
      function setMode(m) { st.mode = m; M.$$('.seg button', bar).forEach((b) => b.classList.toggle('on', b.textContent.trim() === (m === 'list' ? 'SENARAI' : 'BAHAGIAN'))); draw(); }

      root.append(
        M.viewHead('// 02 · BAHAGIAN & REKOD', 'BAHAGIAN & REKOD', 'Cerita Martod dipisahkan mengikut bahagian, dan setiap bahagian mengikut rekod. Klik atau ketik satu baris untuk membaca rekod penuh bersama gambarnya.', []),
        bar, h('div', { class: 'docs' }, list, preview));

      const unsub = M.store.onChange((c) => { if (c === COLL || c === 'folders' || c === '*') draw(); });
      draw();
      if (params && params.arg) {
        if (M.store.find(COLL, params.arg)) { select(params.arg); M.docviewer.open(COLL, params.arg); }
        else if (M.store.find('folders', params.arg)) { const el = list.querySelector(`[data-folder="${params.arg}"]`); if (el) setTimeout(() => el.scrollIntoView({ block: 'start' }), 30); }
      }
      return () => { unsub(); if (ro) ro.disconnect(); };
    }
  });
})(window.M);
