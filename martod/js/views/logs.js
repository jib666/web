/* MARTOD view — log sistem (rekod langsung semua yang dilakukan dalam sesi) */
(function (M) {
  'use strict';
  const h = M.h;
  const LEVELS = ['SEMUA', 'AUTH', 'NAV', 'VIEW', 'EDIT', 'SEARCH', 'CMD', 'ALERT', 'SYS'];

  M.router.register('logs', {
    title: 'Log Sistem',
    mount(root) {
      const st = M.ui.logs;
      const box = h('div', { class: 'logbox', role: 'log' });
      const chips = h('div', { class: 'chipbar' });
      const count = h('span', { class: 'toolbar__count' });
      let live = null;

      function draw() {
        M.clear(box); M.clear(chips);
        const all = M.logs.all();
        LEVELS.forEach((l) => chips.append(h('button', { class: 'chipbtn' + (st.level === l ? ' on' : ''), type: 'button', onClick: () => { st.level = l; draw(); } }, M.logs.label(l), h('em', null, l === 'SEMUA' ? all.length : all.filter((x) => x.level === l).length))));
        const q = st.q.trim().toLowerCase();
        const shown = all.filter((l) => (st.level === 'SEMUA' || l.level === st.level) && (!q || (l.msg + ' ' + l.user + ' ' + l.level).toLowerCase().includes(q)));
        count.textContent = `${shown.length} DARIPADA ${all.length} ENTRI`;
        if (!shown.length) box.append(M.empty('TIADA ENTRI LOG', 'Aktiviti dalam sistem ini direkodkan di sini.'));
        shown.slice(-300).reverse().forEach((l, i) => {
          const r = h(l.link ? 'button' : 'div', { class: 'logrow' + (l.link ? ' logrow--link' : ''), type: l.link ? 'button' : null, onClick: l.link ? () => { if (l.link.view === 'documents' || l.link.view === 'reports') M.openRecord(l.link.view, l.link.id); else M.router.go(l.link.view, l.link.id); } : null },
            h('span', { class: 'logrow__t' }, M.fmtStamp(l.t)), h('span', { class: 'tag tag--' + l.level.toLowerCase() }, M.logs.label(l.level)), h('span', { class: 'logrow__u' }, l.user), h('span', { class: 'logrow__m' }, l.msg));
          box.append(r);
        });
      }

      root.append(
        M.viewHead('// 08 · JEJAK AUDIT', 'LOG SISTEM', 'Setiap log masuk, paparan, suntingan, carian dan arahan terminal dalam arkib ini direkodkan di sini.', [
          M.btn('EKSPORT .TXT', 'download', () => M.download('martod-system-log.txt', M.logs.all().map((l) => `${l.t}\t${l.level}\t${l.user}\t${l.msg}`).join('\n'), 'text/plain')),
          M.btn('KOSONGKAN LOG', 'trash', async () => { if (await M.modal.confirm('KOSONGKAN LOG', 'Padam seluruh jejak audit yang disimpan dalam pelayar ini secara kekal?', 'PADAM')) { M.logs.clear(); M.logs.add('SYS', 'LOG AUDIT DIKOSONGKAN'); } }, 'danger')]),
        h('div', { class: 'toolbar' }, M.searchBox(st.q, 'Cari log', (v) => { st.q = v; draw(); }), count), chips, box);
      live = M.logs.on(M.debounce(draw, 120));
      draw();
      return live;
    }
  });
})(window.M);
