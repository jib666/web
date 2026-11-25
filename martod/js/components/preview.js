/* MARTOD component — media rendering and the full-screen evidence preview */
(function (M) {
  'use strict';
  const h = M.h;

  const kindOf = (f) => {
    if (!f) return 'none';
    const t = (f.type || '').toLowerCase(), n = (f.name || '').toLowerCase();
    if (t.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp|svg|avif)$/.test(n)) return 'image';
    if (t === 'application/pdf' || n.endsWith('.pdf')) return 'pdf';
    if (t.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|flac|aac)$/.test(n)) return 'audio';
    if (t.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogv)$/.test(n)) return 'video';
    if (t.startsWith('text/') || /\.(txt|md|csv|json|log|xml)$/.test(n)) return 'text';
    return 'other';
  };
  M.kindOf = kindOf;
  const TYPE_ICON = { gambar: 'camera', peta: 'image', imbasan: 'doc', audio: 'mic', video: 'film', lain: 'clip' };
  M.TYPE_ICON = TYPE_ICON;
  M.evdTypeLabel = (t) => (M.EVD_TYPES.find((x) => x[0] === t) || [t, t])[1];

  /* Suggest an evidence type from a file */
  M.evdTypeFor = function (file) {
    const k = kindOf(file);
    if (k === 'image') return /peta|map/i.test(file.name) ? 'peta' : 'gambar';
    if (k === 'pdf' || k === 'text') return 'imbasan';
    if (k === 'audio') return 'audio';
    if (k === 'video') return 'video';
    return 'lain';
  };

  M.preview = {
    kindOf,

    /* Returns an element showing the stored file */
    async renderMedia(file) {
      const k = kindOf(file);
      const url = await M.blobs.url(file.blobId);
      if (!url) return h('div', { class: 'media-missing' }, M.icon('alert', 28), h('b', null, 'DATA FAIL TIDAK DITEMUI'), h('span', null, 'Storan pelayar tidak lagi menyimpan fail ini. Sila muat naik semula.'));
      if (k === 'image') {
        const img = h('img', { class: 'media-img', src: url, alt: file.name, draggable: 'false' });
        img.addEventListener('click', () => img.classList.toggle('zoomed'));
        return h('div', { class: 'media media--image' }, img);
      }
      if (k === 'pdf') return h('div', { class: 'media media--pdf' }, h('iframe', { src: url, title: file.name }));
      if (k === 'video') return h('div', { class: 'media media--video' }, h('video', { src: url, controls: true, playsinline: true }));
      if (k === 'audio') {
        const bars = h('div', { class: 'wave' }, Array.from({ length: 48 }, (_, i) => h('i', { style: { '--h': (18 + (M.hash(file.blobId + i) % 70)) + '%' } })));
        return h('div', { class: 'media media--audio' }, bars, h('audio', { src: url, controls: true }));
      }
      if (k === 'text') {
        const blob = await M.blobs.get(file.blobId);
        let txt = ''; try { txt = (await blob.text()).slice(0, 200000); } catch (e) { txt = '[TIDAK BOLEH DIBACA]'; }
        return h('pre', { class: 'media media--text' }, txt);
      }
      return h('div', { class: 'media-missing' }, M.icon('file', 34), h('b', null, 'TIADA PRAPAPAR'), h('span', null, file.name + ' · ' + M.fmtSize(file.size)),
        h('a', { class: 'btn btn--primary', href: url, download: file.name }, M.icon('download', 15), 'MUAT TURUN'));
    },

    /* Placeholder frame for an evidence slot with no file */
    emptyFrame(type) {
      return h('div', { class: 'ev-empty' },
        h('i', { class: 'corner tl' }), h('i', { class: 'corner tr' }), h('i', { class: 'corner bl' }), h('i', { class: 'corner br' }),
        h('div', { class: 'ev-empty__icon' }, M.icon(TYPE_ICON[type] || 'clip', 54)),
        h('b', null, 'TIADA FAIL DILAMPIRKAN'),
        h('span', { class: 'ph' }, '[LETAK ' + M.evdTypeLabel(type).toUpperCase() + ']'));
    },

    /* Full-screen preview for evidence. ids = ordered list of evidence ids to page through. */
    openEvidence(id, ids) {
      const list = (ids && ids.length ? ids : M.store.get('evidence').map((e) => e.id));
      let idx = Math.max(0, list.indexOf(id));
      const stage = h('div', { class: 'lb__stage' });
      const side = h('aside', { class: 'lb__side' });
      const title = h('div', { class: 'lb__title' });
      const count = h('span', { class: 'lb__count' });
      let unsub;

      const root = h('div', { class: 'lightbox', role: 'dialog', 'aria-modal': 'true' },
        h('div', { class: 'lb__bar' },
          title, count,
          h('div', { class: 'lb__nav' },
            h('button', { class: 'icon-btn', 'aria-label': 'Sebelumnya', onClick: () => step(-1) }, M.icon('left')),
            h('button', { class: 'icon-btn', 'aria-label': 'Seterusnya', onClick: () => step(1) }, M.icon('right')),
            h('button', { class: 'icon-btn', 'aria-label': 'Tutup', onClick: () => close() }, M.icon('x')))),
        h('div', { class: 'lb__main' }, stage, side),
        h('div', { class: 'viewer__hint' }, 'ESC tutup · ← → semak imbas · klik gambar untuk zum'));
      const close = M.overlay.push(root, () => { document.removeEventListener('keydown', onKey); if (unsub) unsub(); });

      function onKey(e) {
        if (!M.overlay.top() || M.overlay.top().el !== root) return;
        if (e.target.closest && e.target.closest('input,textarea,select')) return;
        if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'ArrowRight') step(1);
      }
      document.addEventListener('keydown', onKey);
      unsub = M.store.onChange((c) => { if (c === 'evidence' || c === '*') { if (!M.store.find('evidence', list[idx])) { close(); return; } show(); } });

      function step(d) { if (list.length < 2) return; idx = (idx + d + list.length) % list.length; show(); }

      async function show() {
        const it = M.store.find('evidence', list[idx]);
        if (!it) return;
        M.clear(stage); M.clear(side);
        title.textContent = '';
        const locked = !M.canAccess(it);
        title.append(h('span', { class: 'lb__id' }, M.labelOf('evidence', it)), locked ? h('span', { class: 'redact' }, '\u2588\u2588\u2588\u2588\u2588\u2588') : M.ph(it.title, M.phOf('evidence', 'title')));
        count.textContent = `${idx + 1} / ${list.length}`;
        stage.classList.remove('is-ready'); stage.classList.add('is-loading');
        if (locked) {
          stage.append(h('div', { class: 'ev-empty ev-empty--locked' }, M.icon('lock', 54), h('b', null, 'AKSES DITOLAK'), h('span', null, `MEMERLUKAN ${it.classification}`)));
          M.logs.add('ALERT', `DITOLAK ${it.id}: TAHAP TIDAK MENCUKUPI`); M.fx.flash('red');
        } else {
          let node;
          if (it.file) { node = await M.preview.renderMedia(it.file); M.logs.add('VIEW', 'PRAPAPAR ' + it.id, { view: 'evidence', id: it.id }); }
          else if (it.imagePath) { const im = h('img', { class: 'media-img', src: it.imagePath, alt: it.title || '', draggable: 'false' }); im.addEventListener('click', () => im.classList.toggle('zoomed')); node = h('div', { class: 'media media--image' }, im); }
          else node = M.preview.emptyFrame(it.type);
          if (list[idx] !== it.id) return;
          stage.append(node);
          if (it.file && it.file.name) stage.append(h('div', { class: 'lb__caption' }, it.file.name + ' · ' + M.fmtSize(it.file.size)));
        }
        stage.classList.remove('is-loading'); stage.classList.add('is-ready');
        // metadata
        if (locked) { side.append(h('div', { class: 'lb__cls' }, M.stamp(it.classification, { seed: it.id })), h('div', { class: 'denied denied--inline' }, h('b', null, 'AKSES DITOLAK'), h('span', null, `MEMERLUKAN TAHAP ${M.rank(it.classification)} · ${it.classification}`))); return; }
        const rows = [['ID', it.id], ['JENIS', M.evdTypeLabel(it.type)], ['TARIKH', M.fmtDate(it.date)], ['LOKASI', it.source], ['FAIL', it.file ? it.file.name : ''], ['SAIZ', it.file ? M.fmtSize(it.file.size) : '']];
        side.append(
          h('div', { class: 'lb__cls' }, M.stamp(it.classification, { seed: it.id })),
          h('dl', { class: 'kv' }, rows.map(([k, v]) => [h('dt', null, k), h('dd', null, v ? v : h('span', { class: 'ph' }, '—'))])),
          h('div', { class: 'kv__desc' }, h('b', null, 'KETERANGAN'), M.ph(it.description, M.phOf('evidence', 'description'))),
          h('div', { class: 'lb__actions' },
            locked ? null : h('button', { class: 'btn btn--primary', onClick: () => M.upload.open({ evidenceId: it.id }) }, M.icon('upload', 15), it.file ? 'GANTI FAIL' : 'MUAT NAIK FAIL'),
            it.file ? h('button', { class: 'btn', onClick: async () => { const u = await M.blobs.url(it.file.blobId); if (u) { const a = h('a', { href: u, download: it.file.name }); document.body.append(a); a.click(); a.remove(); } } }, M.icon('download', 15), 'MUAT TURUN') : null,
            locked ? null : h('button', { class: 'btn', onClick: () => M.editor.open('evidence', it.id) }, M.icon('edit', 15), 'SUNTING BUTIRAN'),
            it.file && !locked ? h('button', { class: 'btn btn--danger', onClick: async () => { if (await M.modal.confirm('BUANG FAIL', 'Tanggalkan dan padam fail yang disimpan daripada artifak ini?', 'BUANG')) { await M.blobs.del(it.file.blobId); it.file = null; M.store.upsert('evidence', it); M.logs.add('EDIT', 'FAIL DITANGGALKAN DARIPADA ' + it.id); } } }, M.icon('trash', 15), 'BUANG FAIL') : null));
      }
      show();
      return close;
    },
    openEvidenceFile(id) { return this.openEvidence(id); }
  };
})(window.M);
