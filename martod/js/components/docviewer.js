/* MARTOD component — pemapar rekod kertas imbasan skrin penuh */
(function (M) {
  'use strict';
  const h = M.h;

  M.docviewer = {
    open(coll, id) {
      const sch = M.schemas[coll];
      const list = M.store.get(coll).map((x) => x.id);
      let idx = list.indexOf(id);
      if (idx < 0) return;
      const fit = () => Math.max(0.42, Math.min(1, (window.innerWidth - 20) / 760));
      let zoom = fit();
      let token = 0;

      const stage = h('div', { class: 'viewer__stage' });
      const label = h('div', { class: 'viewer__label' });
      const zoomLbl = h('span', { class: 'viewer__zoom' });
      const btn = (icon, text, fn, extra) => h('button', { class: 'icon-btn' + (extra ? ' ' + extra : ''), title: text, 'aria-label': text, onClick: fn }, M.icon(icon));

      const bar = h('div', { class: 'viewer__bar' },
        label,
        h('div', { class: 'viewer__tools' },
          btn('left', 'Sebelumnya (←)', () => step(-1)), btn('right', 'Seterusnya (→)', () => step(1)),
          h('i', { class: 'sep' }),
          btn('zoomOut', 'Kecilkan (−)', () => setZoom(zoom - 0.1)), zoomLbl, btn('zoomIn', 'Besarkan (+)', () => setZoom(zoom + 0.1)),
          h('i', { class: 'sep' }),
          coll === 'documents' ? btn('clip', 'Lampirkan fail', () => M.upload.open({ attachTo: { coll, id: list[idx] } })) : null,
          btn('edit', 'Sunting (E)', () => edit()),
          btn('print', 'Cetak', () => window.print()),
          btn('x', 'Tutup (Esc)', () => close(), 'icon-btn--close')));
      const root = h('div', { class: 'viewer', role: 'dialog', 'aria-modal': 'true' }, bar, stage,
        h('div', { class: 'viewer__hint' }, 'ESC tutup · ← → tukar rekod · + − zum · E sunting'));

      let unsub;
      const close = M.overlay.push(root, () => { document.removeEventListener('keydown', onKey); if (unsub) unsub(); });
      document.addEventListener('keydown', onKey);
      unsub = M.store.onChange((c) => { if (c === coll || c === '*') { if (!M.store.find(coll, list[idx])) { close(); return; } render(true); } });

      function onKey(e) {
        const top = M.overlay.top();
        if (!top || top.el !== root) return;
        if (e.target.closest && e.target.closest('input,textarea,select')) return;
        if (e.key === 'ArrowLeft') step(-1);
        else if (e.key === 'ArrowRight') step(1);
        else if (e.key === '+' || e.key === '=') setZoom(zoom + 0.1);
        else if (e.key === '-') setZoom(zoom - 0.1);
        else if (e.key === 'e' || e.key === 'E') edit();
      }
      function setZoom(z) { zoom = Math.max(0.35, Math.min(1.8, z)); stage.style.setProperty('--zoom', zoom); zoomLbl.textContent = Math.round(zoom * 100) + '%'; }
      function step(d) { if (list.length < 2) return; idx = (idx + d + list.length) % list.length; render(false); }
      function edit() { const it = M.store.find(coll, list[idx]); if (it && M.canAccess(it)) M.editor.open(coll, it.id); }

      async function render(quiet) {
        const my = ++token;
        const it = M.store.find(coll, list[idx]);
        if (!it) return;
        const cls = coll === 'personnel' ? it.clearance : it.classification;
        const locked = !M.canAccess(it);
        label.textContent = '';
        label.append(h('b', null, M.labelOf(coll, it)), h('span', { class: 'viewer__ttl' }, locked ? h('span', { class: 'redact' }, '\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588') : M.ph(it[sch.titleKey], M.phOf(coll, sch.titleKey))), M.stamp(cls, { mini: true, seed: it.id }));
        setZoom(zoom);
        const keepScroll = quiet ? stage.scrollTop : 0;
        M.clear(stage);

        /* loading animation (document "decrypt + scan") */
        if (!quiet && M.fx.on) {
          const pct = h('b', null, '0%');
          const bar2 = h('i');
          const log = h('div', { class: 'scanload__log' });
          const ld = h('div', { class: 'scanload' }, h('div', { class: 'scanload__head' }, 'MENGAMBIL ' + M.labelOf(coll, it), pct),
            h('div', { class: 'scanload__bar' }, bar2), log);
          stage.append(ld);
          const steps = ['MENCARI FAIL DALAM ARKIB', 'MENYAHSULIT SEGMEN', 'MENGESAHKAN TAHAP CAPAIAN', 'MEMAPARKAN IMBASAN'];
          for (let i = 0; i <= 100; i += 10) {
            if (my !== token) return;
            pct.textContent = i + '%'; bar2.style.width = i + '%';
            if (i % 30 === 0 && steps[i / 30]) log.append(h('div', null, '> ' + steps[i / 30] + ' ... OK'));
            await M.sleep(32);
          }
          if (my !== token) return;
          M.clear(stage);
        }

        let page;
        if (locked) {
          page = M.paper.renderLocked(coll, it);
          M.logs.add('ALERT', `DITOLAK ${it.id}: TAHAP TIDAK MENCUKUPI`); M.fx.flash('red'); M.fx.beep('fail');
        } else {
          page = M.paper.render(coll, it);
          if (!quiet) M.logs.add('VIEW', 'DIBUKA ' + it.id, { view: coll, id: it.id });
          M.fx.beep('open');
        }
        const wrap = h('div', { class: 'page-wrap' + (quiet ? '' : ' reveal') }, page);
        stage.append(wrap);

        /* attached scans */
        if (!locked && coll === 'documents' && it.attachments && it.attachments.length) {
          for (let i = 0; i < it.attachments.length; i++) {
            const f = it.attachments[i];
            const media = await M.preview.renderMedia(f);
            if (my !== token) return;
            stage.append(h('div', { class: 'page-wrap' },
              h('article', { class: 'paper paper--scan paper--attach' }, h('i', { class: 'paper__tex' }),
                h('div', { class: 'paper__banner' }, cls || M.cfg.bannerLabel),
                h('div', { class: 'attach__cap' }, h('b', null, `LAMPIRAN ${i + 1} DARIPADA ${it.attachments.length}`), h('span', null, f.name + ' · ' + M.fmtSize(f.size)),
                  h('button', { class: 'icon-btn icon-btn--sm', title: 'Buang lampiran', onClick: async () => { if (await M.modal.confirm('BUANG LAMPIRAN', 'Padam ' + f.name + '?', 'BUANG')) { await M.blobs.del(f.blobId); it.attachments.splice(i, 1); M.store.upsert(coll, it); M.logs.add('EDIT', 'LAMPIRAN DIBUANG DARIPADA ' + it.id); } } }, M.icon('trash', 14))),
                media,
                h('div', { class: 'paper__banner paper__banner--bot' }, cls || M.cfg.bannerLabel))));
          }
        }
        stage.scrollTop = keepScroll;
      }
      render(false);
      return close;
    }
  };
})(window.M);
