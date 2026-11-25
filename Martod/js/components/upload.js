/* MARTOD component — antara muka muat naik (gambar rekod, artifak, lampiran, rekod baharu) */
(function (M) {
  'use strict';
  const h = M.h;

  M.upload = {
    /* opts: { files, attachTo:{coll,id}, evidenceId } */
    open(opts) {
      opts = opts || {};
      let files = Array.from(opts.files || []);
      const urls = [];
      const fileList = h('div', { class: 'ul-files' });
      const dest = h('select', { id: 'ul_dest' });
      const docSel = h('select', { id: 'ul_doc' });
      const docRow = h('label', { class: 'field field--wide' }, h('span', { class: 'field__label' }, 'Rekod sasaran'), docSel);
      const input = h('input', { type: 'file', multiple: !opts.evidenceId, hidden: true });

      M.store.get('documents').forEach((d) => docSel.append(h('option', { value: d.id }, d.id + (M.titleOf('documents', d) ? ' · ' + M.titleOf('documents', d) : ''))));
      if (opts.attachTo) docSel.value = opts.attachTo.id;

      if (opts.evidenceId) dest.append(h('option', { value: 'item' }, 'Artifak ' + opts.evidenceId));
      else if (opts.attachTo) dest.append(h('option', { value: 'attach' }, 'Lampirkan pada rekod ' + opts.attachTo.id));
      else [['recimg', 'Gambar rekod (satu gambar bagi setiap rekod)'], ['evidence', 'Galeri Artifak (mengisi slot kosong, kemudian menambah item baharu)'], ['attach', 'Lampirkan pada rekod sedia ada'], ['newdoc', 'Cipta rekod baharu daripada fail']].forEach(([v, l]) => dest.append(h('option', { value: v }, l)));
      if (opts.dest && Array.from(dest.options).some((o) => o.value === opts.dest)) dest.value = opts.dest;
      dest.disabled = !!(opts.evidenceId || opts.attachTo);

      const sync = () => { docRow.style.display = (dest.value === 'attach' || dest.value === 'recimg') && !opts.attachTo ? '' : 'none'; };
      dest.addEventListener('change', sync); sync();

      const dz = h('div', { class: 'dropzone', tabindex: '0', role: 'button', 'aria-label': 'Pilih fail untuk dimuat naik' },
        M.icon('upload', 34),
        h('b', null, 'LEPASKAN FAIL DI SINI'),
        h('span', null, 'atau klik untuk semak imbas · gambar, PDF, audio, video, teks dan fail lain'));
      dz.addEventListener('click', () => input.click());
      dz.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
      ['dragenter', 'dragover'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('over'); }));
      ['dragleave', 'drop'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove('over'); }));
      dz.addEventListener('drop', (e) => add(Array.from(e.dataTransfer.files || [])));
      input.addEventListener('change', () => { add(Array.from(input.files || [])); input.value = ''; });

      function add(list) {
        if (opts.evidenceId) files = list.slice(0, 1); else files = files.concat(list);
        draw();
      }
      function draw() {
        M.clear(fileList);
        files.forEach((f, i) => {
          const k = M.kindOf({ name: f.name, type: f.type });
          let thumb;
          if (k === 'image') { const u = URL.createObjectURL(f); urls.push(u); thumb = h('img', { src: u, alt: '' }); }
          else thumb = M.icon(k === 'audio' ? 'mic' : k === 'video' ? 'film' : k === 'pdf' || k === 'text' ? 'doc' : 'clip', 22);
          fileList.append(h('div', { class: 'ul-file' }, h('span', { class: 'ul-file__thumb' }, thumb),
            h('span', { class: 'ul-file__name' }, f.name), h('em', null, M.fmtSize(f.size)),
            h('button', { type: 'button', class: 'icon-btn icon-btn--sm', 'aria-label': 'Buang', onClick: () => { files.splice(i, 1); draw(); } }, M.icon('x', 13))));
        });
        if (!files.length) fileList.append(h('div', { class: 'ul-none' }, 'TIADA FAIL DALAM BARISAN'));
        go.disabled = !files.length;
        go.textContent = '';
        go.append(M.icon('upload', 15), `MUAT NAIK ${files.length || ''} FAIL`);
      }

      const body = h('div', { class: 'form' }, h('div', { class: 'field field--wide' }, dz), input, fileList,
        h('label', { class: 'field field--wide' }, h('span', { class: 'field__label' }, 'Destinasi'), dest), docRow,
        h('p', { class: 'field field--wide field__hint' }, 'Fail disimpan dalam pelayar ini sahaja (IndexedDB). Tiada apa dihantar ke pelayan. Untuk gambar kekal dalam projek, letakkan dalam folder images/ dengan nama rekod-001.jpg dan seterusnya.'));
      const go = h('button', { class: 'btn btn--primary', disabled: true });
      const modal = M.modal.open({
        title: 'MUAT NAIK', wide: true, body, noFocus: true,
        actions: [{ label: 'BATAL' }],
        onClose: () => urls.forEach((u) => URL.revokeObjectURL(u))
      });
      modal.actions.append(go);
      go.addEventListener('click', async () => {
        go.disabled = true; go.textContent = 'MENYIMPAN…';
        try { await commit(); modal.close(); } catch (e) { console.error(e); M.toast('MUAT NAIK GAGAL: ' + e.message, 'warn'); go.disabled = false; }
      });
      draw();

      async function commit() {
        const mode = dest.value;
        let n = 0;
        for (const f of files) {
          const meta = await M.blobs.saveFile(f);
          const base = f.name.replace(/\.[^.]+$/, '');
          if (mode === 'item') {
            const it = M.store.find('evidence', opts.evidenceId);
            if (it.file) await M.blobs.del(it.file.blobId);
            it.file = meta; M.store.upsert('evidence', it); M.logs.add('EDIT', `${f.name} DILAMPIRKAN PADA ${it.id}`, { view: 'evidence', id: it.id });
          } else if (mode === 'recimg') {
            const target = opts.attachTo ? opts.attachTo.id : docSel.value;
            const d = M.store.find('documents', target);
            if (!d) throw new Error('rekod sasaran tiada');
            if (M.kindOf({ name: f.name, type: f.type }) !== 'image') { await M.blobs.del(meta.blobId); M.toast('DILANGKAU (BUKAN GAMBAR): ' + f.name, 'warn'); continue; }
            if (d.image && d.image.blobId) await M.blobs.del(d.image.blobId);
            d.image = meta; M.store.upsert('documents', d); M.logs.add('EDIT', `GAMBAR ${f.name} UNTUK ${d.id}`, { view: 'documents', id: d.id });
          } else if (mode === 'attach') {
            const target = opts.attachTo ? opts.attachTo.id : docSel.value;
            const d = M.store.find('documents', target);
            if (!d) throw new Error('rekod sasaran tiada');
            d.attachments = d.attachments || []; d.attachments.push(meta);
            M.store.upsert('documents', d); M.logs.add('EDIT', `${f.name} DILAMPIRKAN PADA ${d.id}`, { view: 'documents', id: d.id });
          } else if (mode === 'newdoc') {
            const k = M.kindOf({ name: f.name, type: f.type });
            let content = '';
            if (k === 'text') { try { content = (await f.text()).slice(0, 100000); } catch (e) { /* ignore */ } }
            const d = { id: M.store.nextId('documents'), folder: '', title: base, classification: '', reference: '', date: '', author: '', subject: '', extra: '', image: null, imagePath: '', imageCaption: '', content, updated: null, attachments: k === 'text' ? [] : [meta] };
            if (k === 'text') await M.blobs.del(meta.blobId);
            M.store.upsert('documents', d); M.logs.add('EDIT', `${d.id} DICIPTA DARIPADA ${f.name}`, { view: 'documents', id: d.id });
          } else { // evidence archive
            const type = M.evdTypeFor(f);
            const slot = M.store.get('evidence').find((e) => !e.file && e.type === type);
            if (slot) { const s = { ...slot, file: meta, title: slot.title || base }; M.store.upsert('evidence', s); M.logs.add('EDIT', `${f.name} DIFAILKAN SEBAGAI ${s.id}`, { view: 'evidence', id: s.id }); }
            else { const e = { id: M.store.nextId('evidence'), type, title: base, classification: '', date: '', source: '', description: '', file: meta, updated: null }; M.store.upsert('evidence', e); M.logs.add('EDIT', `${f.name} DIFAILKAN SEBAGAI ${e.id}`, { view: 'evidence', id: e.id }); }
          }
          n++;
        }
        M.toast(`${n} FAIL DISIMPAN`, 'ok'); M.fx.beep('ok');
        if (opts.onDone) opts.onDone();
      }
      return modal;
    }
  };
})(window.M);
