/* MARTOD component — urutan hidup CRT dan permulaan sistem */
(function (M) {
  'use strict';
  const h = M.h;

  const LINES = [
    ['KERNEL ARKIB MARTOD v7.3.1', 'hd'],
    ['JABATAN ARKIB SEJARAH DUNIA // MARTOD UNIVERSE', 'dim'],
    ['', ''],
    ['SEMAKAN INTEGRITI BIOS', 'ok'],
    ['UJIAN MEMORI 65536K', 'ok'],
    ['MEMASANG VOLUM TERSULIT /ARKIB', 'ok'],
    ['MEMUAT MODUL KEBENARAN', 'ok'],
    ['MEMBINA INDEKS REKOD', 'ok'],
    ['MEMULAKAN PEMANTAU INTEGRITI', 'ok'],
    ['MENGASINGKAN SEGMEN RANGKAIAN 07', 'ok'],
    ['', ''],
    ['AMARAN: SISTEM TERKAWAL. CAPAIAN TANPA KEBENARAN DILARANG.', 'warn']
  ];

  M.boot = {
    async run(fast) {
      const root = document.getElementById('boot');
      if (!M.fx.on || fast) { root.hidden = true; return; }
      root.hidden = false;
      const log = h('div', { class: 'boot__log' });
      const fill = h('i');
      const skipHint = h('div', { class: 'boot__skip' }, 'TEKAN SEBARANG KUNCI ATAU KLIK UNTUK LANGKAU');
      const crt = h('div', { class: 'boot__crt' }, log, h('div', { class: 'boot__progress' }, fill), skipHint);
      M.clear(root); root.append(h('div', { class: 'boot__line' }), crt);
      root.className = 'boot boot--on';
      const ctl = { skip: false };
      const skip = () => { ctl.skip = true; };
      window.addEventListener('keydown', skip, { once: true });
      root.addEventListener('click', skip, { once: true });
      await M.sleep(520);
      const total = LINES.length + 1;
      for (let i = 0; i < LINES.length; i++) {
        if (ctl.skip) break;
        const [txt, kind] = LINES[i];
        const line = h('div', { class: 'bl bl--' + kind });
        log.append(line);
        if (kind === 'ok') {
          const dots = '.'.repeat(Math.max(2, 44 - txt.length));
          await M.fx.type(line, txt + ' ' + dots + ' ', 4, ctl);
          line.append(h('b', { class: 'okc' }, 'OK'));
        } else await M.fx.type(line, txt, 5, ctl);
        fill.style.width = Math.round(((i + 1) / total) * 100) + '%';
        await M.sleep(kind === 'ok' ? 55 : 25);
      }
      if (!ctl.skip) {
        log.append(h('div', { class: 'bl bl--ok' }, `INDEKS SEDIA: ${M.store.get('documents').length} REKOD DALAM ${M.store.get('folders').length} BAHAGIAN`));
        fill.style.width = '100%';
        await M.sleep(450);
      }
      root.classList.add('boot--off');
      await M.sleep(380);
      root.hidden = true; root.className = 'boot'; M.clear(root);
    }
  };
})(window.M);
