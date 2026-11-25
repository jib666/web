/* MARTOD component — one picture slot per record.
   Resolution order:  1) image uploaded in the page (stored in the browser)
                      2) item.imagePath  (e.g. "images/gambar.png")
                      3) images/rekod-NNN.(jpg|png|webp|jpeg)  — dropped into the folder by hand */
(function (M) {
  'use strict';
  const h = M.h;
  const cache = new Map();   // key -> url | null

  const base = (item) => M.cfg.images.prefix + M.numOf(item.id);
  function probe(url) {
    return new Promise((res) => { const im = new Image(); im.onload = () => res(true); im.onerror = () => res(false); im.src = url; });
  }
  async function resolve(item) {
    if (item.image && item.image.blobId) {
      const u = await M.blobs.url(item.image.blobId);
      if (u) return { url: u, source: 'upload', name: item.image.name };
    }
    if (item.imagePath) return { url: item.imagePath, source: 'path', name: item.imagePath };
    if (!/^REK-/.test(item.id)) return null;   // hanya Rekod mencari gambar dalam folder images/
    const key = item.id;
    if (cache.has(key)) { const c = cache.get(key); return c ? { url: c, source: 'folder', name: c } : null; }
    const cfg = M.cfg.images;
    for (const ext of cfg.exts) {
      const u = `${cfg.folder}/${base(item)}.${ext}`;
      if (await probe(u)) { cache.set(key, u); return { url: u, source: 'folder', name: u }; }
    }
    cache.set(key, null);
    return null;
  }
  const SRC_LABEL = { upload: 'DIMUAT NAIK', path: 'LALUAN FAIL', folder: 'FOLDER images/' };

  function lightbox(url, title) {
    const img = h('img', { src: url, alt: title || '' });
    const root = h('div', { class: 'lightbox lightbox--img', role: 'dialog', 'aria-modal': 'true' },
      h('div', { class: 'lb__bar' }, h('div', { class: 'lb__title' }, title || ''), h('div', { class: 'lb__nav' },
        h('button', { class: 'icon-btn', 'aria-label': 'Tutup', onClick: () => close() }, M.icon('x')))),
      h('div', { class: 'lb__main lb__main--img' }, h('div', { class: 'lb__stage is-ready' }, img)),
      h('div', { class: 'viewer__hint' }, 'ESC tutup'));
    const close = M.overlay.push(root);
  }

  async function pick(item, coll, fig) {
    const inp = h('input', { type: 'file', accept: 'image/*', hidden: true });
    document.body.append(inp);
    inp.addEventListener('change', async () => {
      const f = inp.files && inp.files[0]; inp.remove();
      if (!f) return;
      if (!/^image\//.test(f.type) && !/\.(png|jpe?g|gif|webp|bmp|svg|avif)$/i.test(f.name)) { M.toast('HANYA FAIL GAMBAR DITERIMA', 'warn'); return; }
      const meta = await M.blobs.saveFile(f);
      const cur = M.store.find(coll, item.id) || item;
      if (cur.image && cur.image.blobId) await M.blobs.del(cur.image.blobId);
      cur.image = meta;
      M.store.upsert(coll, cur);
      M.logs.add('EDIT', 'GAMBAR DIMUAT NAIK UNTUK ' + cur.id, { view: 'documents', id: cur.id });
      M.toast('GAMBAR DISIMPAN · ' + cur.id, 'ok');
    });
    inp.click();
  }

  M.figure = {
    base, resolve,
    /* opts.mini: compact (no controls). Returns <figure>, fills asynchronously. */
    render(coll, item, opts) {
      opts = opts || {};
      const simple = coll !== 'documents';   // Tokoh / Artifak / Kerajaan / Konflik: gambar sahaja, tiada slot kosong
      if (simple && !item.imagePath && !(item.image && item.image.blobId)) return null;
      const fig = h('figure', { class: 'fig fig--empty' + (opts.mini ? ' fig--mini' : '') + (simple ? ' fig--simple fig--' + coll : '') });
      const label = 'RUANG GAMBAR · ' + M.labelOf(coll, item);
      const slot = h('div', { class: 'fig__slot' },
        h('i', { class: 'corner tl' }), h('i', { class: 'corner tr' }), h('i', { class: 'corner bl' }), h('i', { class: 'corner br' }),
        h('div', { class: 'fig__icon' }, M.icon('image', opts.mini ? 30 : 48)),
        h('b', null, label),
        h('span', { class: 'ph' }, '[LETAK GAMBAR DI SINI]'));
      if (!opts.mini && !simple) slot.append(h('small', { class: 'fig__hint' }, `Letak fail ${M.cfg.images.folder}/${base(item)}.jpg atau muat naik di bawah`));
      const cap = h('figcaption', { class: 'fig__cap' });
      const tools = h('div', { class: 'fig__tools no-print' });
      fig.append(slot);
      if (!opts.mini) fig.append(cap, tools);

      const drawTools = (found) => {
        M.clear(tools);
        if (opts.mini || simple) return;
        tools.append(h('button', { type: 'button', class: 'btn btn--sm', onClick: () => pick(item, coll, fig) }, M.icon('upload', 14), found ? 'TUKAR GAMBAR' : 'MUAT NAIK GAMBAR'));
        if (found && found.source === 'upload') tools.append(h('button', { type: 'button', class: 'btn btn--sm btn--danger', onClick: async () => {
          if (!(await M.modal.confirm('BUANG GAMBAR', 'Padam gambar yang dimuat naik untuk ' + item.id + '?', 'BUANG'))) return;
          const cur = M.store.find(coll, item.id) || item;
          if (cur.image && cur.image.blobId) await M.blobs.del(cur.image.blobId);
          cur.image = null; M.store.upsert(coll, cur); M.logs.add('EDIT', 'GAMBAR DIBUANG DARIPADA ' + cur.id);
        } }, M.icon('trash', 14), 'BUANG'));
        if (found) tools.append(h('span', { class: 'fig__src' }, SRC_LABEL[found.source] + (found.source === 'upload' ? '' : ' · ' + found.name)));
      };
      drawTools(null);
      const capText = (found) => {
        M.clear(cap);
        if (opts.mini) return;
        if (simple) { cap.append(h('b', null, 'RAJAH · '), item.imageCaption || (found ? 'Ilustrasi · ' + M.labelOf(coll, item) : '')); return; }
        cap.append(h('b', null, 'RAJAH ' + M.numOf(item.id) + ' · '), item.imageCaption ? item.imageCaption : h('span', { class: 'ph' }, found ? '[TAMBAH KETERANGAN GAMBAR — SUNTING REKOD]' : '[KETERANGAN GAMBAR]'));
      };
      capText(null);

      resolve(item).then((found) => {
        if (!found) return;
        const img = h('img', { class: 'fig__img', alt: item.imageCaption || label, draggable: 'false' });
        img.addEventListener('load', () => { fig.classList.remove('fig--empty'); fig.classList.add('fig--full'); slot.replaceWith(frame); });
        img.addEventListener('error', () => { if (simple) { fig.remove(); return; } /* broken explicit path: keep empty slot */ if (found.source === 'path') { slot.querySelector('.ph').textContent = '[FAIL TIDAK DITEMUI: ' + found.name + ']'; } });
        const frame = h('div', { class: 'fig__frame', title: 'Klik untuk besarkan', onClick: () => lightbox(found.url, item.title || item.name) }, h('i', { class: 'tape t1' }), h('i', { class: 'tape t2' }), img);
        img.src = found.url;
        drawTools(found); capText(found);
      });
      return fig;
    }
  };
})(window.M);
