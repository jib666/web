/* MARTOD view — garis masa interaktif dengan peta sambungan ke rekod */
(function (M) {
  'use strict';
  const h = M.h;
  const COLL = 'timeline';

  /* Masa ialah teks bebas (cth. "Tahun ke-30 selepas kebangkitan Martod"), jadi susunan ialah susunan dalam senarai. */
  const ordered = () => M.store.get(COLL).slice();

  M.router.register('timeline', {
    title: 'Garis Masa',
    mount(root, params) {
      const line = h('div', { class: 'tline' });
      const mapBox = h('div', { class: 'tmap' });
      const open = new Set();
      let disposeReveal = null, redrawMap = () => {};

      function move(id, dir) {
        const arr = M.store.get(COLL);
        const i = arr.findIndex((e) => e.id === id), j = i + dir;
        if (i < 0 || j < 0 || j >= arr.length) return;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        M.store.upsert(COLL, arr[i], { silent: true });
      }

      function ev(e, idx) {
        const isOpen = open.has(e.id);
        const doc = M.store.find('documents', e.relatedDocument);
        const card = h('div', { class: 'tev' + (isOpen ? ' open' : '') + (idx % 2 ? ' right' : ''), dataset: { id: e.id } },
          h('div', { class: 'tev__node' }, h('i', { class: 'tev__dot' }), h('i', { class: 'tev__ring' })),
          h('div', { class: 'tev__card' },
            h('button', { class: 'tev__head', type: 'button', 'aria-expanded': String(isOpen), onClick: () => { isOpen ? open.delete(e.id) : open.add(e.id); draw(false); } },
              h('span', { class: 'tev__date' }, M.ph(e.date, '[MASA]')),
              h('span', { class: 'tev__id' }, e.id),
              h('b', { class: 'tev__title' }, M.ph(e.title, '[TAJUK PERISTIWA]')),
              M.icon('chevron', 16)),
            h('div', { class: 'tev__body' },
              h('div', { class: 'tev__in' },
                h('p', null, M.ph(e.description, '[KETERANGAN]')),
                h('div', { class: 'tev__rel' }, h('span', null, 'REKOD BERKAITAN'),
                  doc ? h('button', { class: 'docchip', type: 'button', onClick: () => M.docviewer.open('documents', doc.id) }, M.icon('link', 12), doc.id, M.titleOf('documents', doc) ? ' · ' + M.titleOf('documents', doc) : '') : h('span', { class: 'ph' }, '[REKOD BERKAITAN]')),
                h('div', { class: 'det__act' },
                  doc ? M.btn('BACA REKOD', 'eye', () => M.docviewer.open('documents', doc.id), 'primary') : null)))));
        return card;
      }

      /* connection map: events (left) <-> documents (right) */
      function buildMap(list) {
        M.clear(mapBox);
        const links = list.filter((e) => e.relatedDocument && M.store.find('documents', e.relatedDocument));
        const docIds = [...new Set(links.map((e) => e.relatedDocument))].sort();
        if (!links.length) { mapBox.append(M.empty('TIADA SAMBUNGAN', 'Pautkan peristiwa garis masa kepada rekod untuk melihatnya di sini.')); redrawMap = () => {}; return; }
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'tmap__svg');
        const colL = h('div', { class: 'tmap__col' }), colR = h('div', { class: 'tmap__col tmap__col--r' });
        const evNodes = {}, docNodes = {};
        links.forEach((e) => { const n = h('button', { class: 'tmap__n', type: 'button', onMouseenter: () => hi(e.id, e.relatedDocument, true), onMouseleave: () => hi(e.id, e.relatedDocument, false), onFocus: () => hi(e.id, e.relatedDocument, true), onBlur: () => hi(e.id, e.relatedDocument, false), onClick: () => { open.add(e.id); draw(false); const t = M.$(`.tev[data-id="${e.id}"]`, line); if (t) t.scrollIntoView({ behavior: M.fx.on ? 'smooth' : 'auto', block: 'center' }); } }, h('b', null, e.id), M.ph(e.title, '[TAJUK PERISTIWA]')); evNodes[e.id] = n; colL.append(n); });
        docIds.forEach((id) => { const d = M.store.find('documents', id); const n = h('button', { class: 'tmap__n tmap__n--d', type: 'button', onMouseenter: () => links.filter((e) => e.relatedDocument === id).forEach((e) => hi(e.id, id, true)), onMouseleave: () => links.filter((e) => e.relatedDocument === id).forEach((e) => hi(e.id, id, false)), onClick: () => M.docviewer.open('documents', id) }, h('b', null, id), M.ph(M.titleOf('documents', d), '[TAJUK REKOD]')); docNodes[id] = n; colR.append(n); });
        mapBox.append(svg, colL, colR);
        const paths = {};
        function hi(eid, did, on) { if (evNodes[eid]) evNodes[eid].classList.toggle('hi', on); if (docNodes[did]) docNodes[did].classList.toggle('hi', on); if (paths[eid]) paths[eid].classList.toggle('hi', on); mapBox.classList.toggle('focus', on); }
        redrawMap = () => {
          const b = mapBox.getBoundingClientRect();
          if (!b.width) return;
          svg.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`); svg.setAttribute('width', b.width); svg.setAttribute('height', b.height);
          M.clear(svg);
          links.forEach((e) => {
            const a = evNodes[e.id].getBoundingClientRect(), d = docNodes[e.relatedDocument].getBoundingClientRect();
            const x1 = a.right - b.left, y1 = a.top + a.height / 2 - b.top, x2 = d.left - b.left, y2 = d.top + d.height / 2 - b.top, mx = (x1 + x2) / 2;
            const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            p.setAttribute('d', `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`); p.setAttribute('class', 'tmap__path');
            svg.append(p); paths[e.id] = p;
          });
        };
        requestAnimationFrame(redrawMap);
      }

      function draw(rebuildMap) {
        const keep = root.scrollTop;
        if (disposeReveal) disposeReveal();
        M.clear(line);
        const list = ordered();
        if (!list.length) line.append(M.empty('TIADA PERISTIWA', 'Tambah peristiwa dalam js/data/archive-data.js.'));
        const els = list.map((e, i) => ev(e, i));
        els.forEach((e) => line.append(e));
        disposeReveal = M.reveal(els);
        if (rebuildMap !== false) buildMap(list); else requestAnimationFrame(redrawMap);
        root.scrollTop = keep;
      }

      root.append(
        M.viewHead('// 07 · KRONOLOGI', 'GARIS MASA', 'Tiga puluh peristiwa utama mengikut urutan cerita, satu bagi setiap Rekod 001–030. Kembangkan peristiwa untuk keterangan.', [
          M.btn('KEMBANGKAN SEMUA', 'list', () => { M.store.get(COLL).forEach((e) => open.add(e.id)); draw(false); }),
          M.btn('CILKAN', null, () => { open.clear(); draw(false); })]),
        line,
        h('section', { class: 'panel panel--map' }, h('header', { class: 'panel__h' }, h('span', null, 'PAUTAN'), h('b', null, 'PETA SAMBUNGAN REKOD')), h('div', { class: 'panel__b' }, mapBox)));
      const onResize = () => redrawMap();
      window.addEventListener('resize', onResize);
      const unsub = M.store.onChange((c) => { if (c === COLL || c === 'documents' || c === '*') draw(true); });
      draw(true);
      if (params && params.arg && M.store.find(COLL, params.arg)) { open.add(params.arg); draw(false); setTimeout(() => { const t = M.$(`.tev[data-id="${params.arg}"]`, line); if (t) t.scrollIntoView({ block: 'center' }); }, 60); }
      return () => { unsub(); window.removeEventListener('resize', onResize); if (disposeReveal) disposeReveal(); };
    }
  });
})(window.M);
