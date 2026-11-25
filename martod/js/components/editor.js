/* MARTOD component — penyunting rekod berdasarkan skema (cipta / sunting / padam) */
(function (M) {
  'use strict';
  const h = M.h;

  function input(f, value, coll) {
    const common = { name: f.key, placeholder: f.ph || '', id: 'f_' + f.key };
    let el;
    switch (f.type) {
      case 'kv': el = h('textarea', { ...common, rows: 3, spellcheck: 'false' }); el.value = value || ''; break;
      case 'textarea': el = h('textarea', { ...common, rows: f.key === 'content' ? 16 : 9 }); el.value = value || ''; break;
      case 'date': el = h('input', { ...common, type: 'date', placeholder: '' }); el.value = value || ''; break;
      case 'classification':
      case 'select':
      case 'folder':
      case 'document': {
        el = h('select', common);
        let opts = [];
        if (f.type === 'classification') opts = M.cfg.classifications.map((c) => [c, c]);
        else if (f.type === 'select') opts = f.options.map((o) => (Array.isArray(o) ? o : [o, o]));
        else if (f.type === 'folder') opts = M.store.get('folders').map((x) => [x.id, x.name ? `${x.label ? x.label + ' · ' : ''}${x.name}` : `${x.id} · [BAHAGIAN TANPA NAMA]`]);
        else opts = M.store.get('documents').map((d) => [d.id, `${d.id}${M.titleOf('documents', d) ? ' · ' + M.titleOf('documents', d) : ''}`]);
        const blankLabel = f.type === 'folder' ? '— TIADA BAHAGIAN —' : '— TIADA —';
        if (!f.noBlank) el.append(h('option', { value: '' }, blankLabel));
        opts.forEach(([v, l]) => el.append(h('option', { value: v }, l)));
        el.value = value || (f.noBlank ? opts[0][0] : '');
        break;
      }
      default: el = h('input', { ...common, type: 'text', autocomplete: 'off', spellcheck: 'false' }); el.value = value || '';
    }
    return el;
  }

  M.editor = {
    open(coll, id, opts) {
      opts = opts || {};
      const sch = M.schemas[coll];
      const existing = id ? M.store.find(coll, id) : null;
      if (id && !existing) return;
      if (existing && !M.canAccess(existing)) { M.modal.alert('AKSES DITOLAK', 'Tahap capaian anda tidak membenarkan penyuntingan rekod ini.', 'danger'); return; }
      const item = existing ? M.clone(existing) : { id: M.store.nextId(coll), updated: null };
      if (!existing) {
        sch.fields.forEach((f) => { item[f.key] = (opts.defaults && opts.defaults[f.key]) || ''; });
        if (coll === 'documents') { item.attachments = []; item.image = null; }
        if (coll === 'evidence') { item.file = null; if (!item.type) item.type = 'lain'; }
        if (coll === 'investigations') item.status = 'BERLANGSUNG';
      }
      const form = h('form', { class: 'form', onSubmit: (e) => { e.preventDefault(); save(); } });
      const inputs = {};
      sch.fields.forEach((f) => {
        const inp = input(f, item[f.key], coll);
        inputs[f.key] = inp;
        form.append(h('label', { class: 'field' + (f.wide ? ' field--wide' : ''), for: 'f_' + f.key },
          h('span', { class: 'field__label' }, f.label),
          inp,
          f.hint ? h('span', { class: 'field__hint' }, f.hint) : null));
      });
      form.append(h('div', { class: 'field field--wide field--meta' }, h('span', null, 'ID REKOD: ' + item.id), item.updated ? h('span', null, 'DIKEMAS KINI: ' + M.fmtStamp(item.updated)) : h('span', null, existing ? 'BELUM PERNAH DIUBAH' : 'REKOD BAHARU')));

      /* attachments management for documents */
      if (coll === 'documents' && existing) {
        const box = h('div', { class: 'field field--wide' }, h('span', { class: 'field__label' }, 'Lampiran'));
        const draw = () => {
          box.querySelectorAll('.att').forEach((n) => n.remove());
          (item.attachments || []).forEach((a, i) => box.append(h('div', { class: 'att' }, M.icon('clip', 14), h('span', null, a.name), h('em', null, M.fmtSize(a.size)),
            h('button', { type: 'button', class: 'icon-btn icon-btn--sm', 'aria-label': 'Buang', onClick: async () => { await M.blobs.del(a.blobId); item.attachments.splice(i, 1); M.store.upsert(coll, { ...M.store.find(coll, id), attachments: item.attachments }, { silent: true }); draw(); } }, M.icon('x', 13)))));
          if (!item.attachments || !item.attachments.length) box.append(h('div', { class: 'att att--none' }, 'Tiada fail dilampirkan.'));
        };
        draw();
        box.append(h('button', { type: 'button', class: 'btn btn--sm', onClick: () => M.upload.open({ attachTo: { coll, id } }) }, M.icon('upload', 14), 'LAMPIRKAN FAIL'));
        form.append(box);
      }
      form.append(h('button', { type: 'submit', hidden: true }));

      const actions = [];
      if (existing) actions.push({ label: 'PADAM', kind: 'danger', icon: 'trash', close: false, onClick: async (close) => { if (await M.modal.confirm('PADAM ' + M.labelOf(coll, item), 'Ini membuang rekod daripada arkib (salinan pelayar) secara kekal. Teruskan?', 'PADAM')) { M.store.remove(coll, item.id); M.logs.add('EDIT', 'DIPADAM ' + item.id); M.toast(item.id + ' DIPADAM', 'warn'); close(); if (opts.onDeleted) opts.onDeleted(item.id); } return false; } });
      actions.push({ label: 'BATAL' });
      actions.push({ label: existing ? 'SIMPAN PERUBAHAN' : 'CIPTA REKOD', kind: 'primary', icon: 'check', close: false, onClick: () => { save(); return false; } });

      const m = M.modal.open({ title: (existing ? 'SUNTING ' : 'BAHARU · ') + sch.single.toUpperCase() + ' · ' + item.id, body: form, actions, wide: true });

      function save() {
        const out = { ...(existing ? M.store.find(coll, id) : item) };
        sch.fields.forEach((f) => { out[f.key] = (inputs[f.key].value || '').trim(); });
        if (coll === 'documents' || coll === 'investigations' || coll === 'reports') { /* normalise doc id lists */ }
        if (coll === 'investigations' && out.relatedDocs) out.relatedDocs = out.relatedDocs.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean).join(', ');
        M.store.upsert(coll, out);
        M.logs.add('EDIT', (existing ? 'DIKEMAS KINI ' : 'DICIPTA ') + out.id, { view: M.VIEWS[coll], id: out.id });
        M.toast((existing ? 'DISIMPAN ' : 'DICIPTA ') + out.id, 'ok');
        M.fx.beep('ok');
        m.close();
        if (opts.onSaved) opts.onSaved(out);
      }
      return m;
    },

    /* Folder rename / create */
    folder(id, opts) {
      const ex = id ? M.store.find('folders', id) : null;
      const lab = h('input', { type: 'text', placeholder: 'BAHAGIAN VII', id: 'f_label' });
      const inp = h('input', { type: 'text', placeholder: '[NAMA BAHAGIAN]', id: 'f_name' });
      lab.value = ex ? (ex.label || '') : ''; inp.value = ex ? (ex.name || '') : '';
      const run = () => {
        const f = ex ? { ...ex } : { id: M.store.nextId('folders') };
        f.label = lab.value.trim().toUpperCase(); f.name = inp.value.trim();
        M.store.upsert('folders', f);
        M.logs.add('EDIT', (ex ? 'BAHAGIAN DIUBAH ' : 'BAHAGIAN DICIPTA ') + f.id);
        if (opts && opts.onSaved) opts.onSaved(f);
      };
      const onEnter = (e) => { if (e.key === 'Enter') { run(); mm.close(); } };
      lab.addEventListener('keydown', onEnter); inp.addEventListener('keydown', onEnter);
      const mm = M.modal.open({
        title: (ex ? 'SUNTING BAHAGIAN · ' + (ex.label || ex.id) : 'BAHAGIAN BAHARU'),
        body: h('div', { class: 'form' },
          h('label', { class: 'field field--wide' }, h('span', { class: 'field__label' }, 'Label Bahagian'), lab),
          h('label', { class: 'field field--wide' }, h('span', { class: 'field__label' }, 'Nama Bahagian'), inp)),
        actions: [{ label: 'BATAL' }, { label: 'SIMPAN', kind: 'primary', onClick: run }]
      });
    }
  };
})(window.M);
