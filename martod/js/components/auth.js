/* MARTOD component — portal akses terkawal dan pengesahan simulasi
   (untuk persembahan sahaja: tiada keselamatan sebenar di sini) */
(function (M) {
  'use strict';
  const h = M.h;

  function fingerprint() {
    const s = document.createElement('span');
    s.className = 'bio';
    let rings = '';
    for (let i = 1; i <= 9; i++) rings += `<ellipse cx="50" cy="56" rx="${6 + i * 4.4}" ry="${8 + i * 5}" stroke-dasharray="${40 - i * 2} ${6 + i}" transform="rotate(${i * 11} 50 56)"/>`;
    s.innerHTML = `<svg viewBox="0 0 100 112" fill="none" stroke="currentColor" stroke-width="1.6">${rings}<line class="bio__scan" x1="4" y1="0" x2="96" y2="0"/></svg>`;
    return s;
  }

  M.auth = {
    run() {
      return new Promise((resolve) => {
        const cfg = M.cfg.auth;
        const root = document.getElementById('portal');
        root.hidden = false; root.className = 'portal';
        let attempts = 0, locked = false, busy = false;

        const user = h('input', { id: 'au_user', name: 'user', type: 'text', autocomplete: 'off', spellcheck: 'false', placeholder: 'NAMA PENGGUNA', maxlength: 24 });
        const pass = h('input', { id: 'au_pass', name: 'pass', type: 'password', autocomplete: 'off', placeholder: '••••••••' });
        const status = h('div', { class: 'auth__status', 'aria-live': 'polite' }, 'MENUNGGU KREDENSIAL');
        const submit = h('button', { class: 'btn btn--primary btn--xl', type: 'submit' }, M.icon('lock', 16), 'MASUK ARKIB');
        const levels = h('div', { class: 'levels', role: 'radiogroup', 'aria-label': 'Tahap capaian' },
          M.cfg.classifications.map((c, i) => h('label', { class: 'level level--' + M.clsKey(c) },
            h('input', { type: 'radio', name: 'clr', value: i + 1, checked: i === M.cfg.classifications.length - 1 }),
            h('span', null, h('b', null, 'T' + (i + 1)), c))));
        const stampHolder = h('div', { class: 'auth__stamp' });
        const card = h('form', { class: 'auth', novalidate: true, autocomplete: 'off' },
          h('div', { class: 'auth__head' }, h('span', null, 'ANTARA MUKA KEBENARAN CAPAIAN'), h('span', { class: 'auth__node' }, 'NOD 07')),
          h('div', { class: 'auth__body' },
            h('div', { class: 'auth__bio' }, fingerprint(), h('span', { class: 'auth__biolbl' }, 'SENSOR BIOMETRIK')),
            h('div', { class: 'auth__fields' },
              h('label', { class: 'field', for: 'au_user' }, h('span', { class: 'field__label' }, 'Nama pengguna'), user),
              h('label', { class: 'field', for: 'au_pass' }, h('span', { class: 'field__label' }, 'Kata laluan'), pass))),
          h('div', { class: 'field' }, h('span', { class: 'field__label' }, 'Tahap capaian'), levels),
          status, submit, stampHolder,
          h('p', { class: 'auth__sim' }, 'ANTARA MUKA SIMULASI — UNTUK PERSEMBAHAN SAHAJA. TIADA PENGESAHAN ATAU KESELAMATAN SEBENAR.' + (cfg.showHint ? (cfg.passcode ? ` KATA LALUAN DEMO: ${cfg.passcode.toUpperCase()}` : ' SEBARANG KATA LALUAN DITERIMA.') : '')));

        const welcome = h('div', { class: 'portal__term' });
        const hero = h('div', { class: 'portal__hero' },
          h('div', { class: 'portal__label' }, h('span', null, 'KLASIFIKASI:'), h('b', null, 'DOKUMEN SEJARAH UTAMA // AKSES TERKAWAL')),
          h('h1', { class: 'portal__title glitch', 'data-text': M.cfg.meta.title }, M.cfg.meta.title),
          h('p', { class: 'portal__sub' }, M.cfg.meta.subtitle),
          h('div', { class: 'portal__restricted' }, h('i', { class: 'led led--red' }), 'AKSES TERKAWAL'));

        M.clear(root);
        root.append(
          h('div', { class: 'portal__strip' }, h('span', null, 'MARTOD // GERBANG SELAMAT'), h('span', { class: 'portal__sid' }, 'SESI ' + Math.random().toString(16).slice(2, 6).toUpperCase() + '-' + Math.random().toString(16).slice(2, 6).toUpperCase())),
          hero, h('div', { class: 'portal__grid' }, welcome, card));

        /* welcome message in terminal style */
        (async () => {
          const lines = ['GERBANG SELAMAT MARTOD // NOD 07', 'SAMBUNGAN DIWUJUDKAN. PENYULITAN PAUTAN: AKTIF', 'ARKIB INI MENYIMPAN SEJARAH SANG LAGENDA.', 'SEMUA AKTIVITI DIREKODKAN.', '', 'HANTAR KREDENSIAL UNTUK MENERUSKAN'];
          const ctl = {};
          for (const l of lines) {
            const d = h('div', { class: 'tl' }); welcome.append(d);
            await M.fx.type(d, l === '' ? ' ' : '> ' + l, 12, ctl);
            await M.sleep(60);
          }
          welcome.append(h('span', { class: 'cursor' }, '█'));
        })();
        setTimeout(() => user.focus(), 400);

        const setStatus = (t, cls) => { status.className = 'auth__status' + (cls ? ' ' + cls : ''); status.textContent = t; };

        card.addEventListener('submit', async (e) => {
          e.preventDefault();
          if (locked || busy) return;
          const u = user.value.trim(), p = pass.value;
          const clr = parseInt((card.querySelector('input[name=clr]:checked') || {}).value, 10) || 1;
          if (!u) { setStatus('MASUKKAN NAMA PENGGUNA', 'bad'); user.focus(); card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake'); return; }
          busy = true; submit.disabled = true;
          card.classList.add('scanning'); setStatus('MENGIMBAS … MENGESAHKAN KREDENSIAL', 'work');
          await M.sleep(M.fx.on ? 1100 : 100);
          card.classList.remove('scanning');
          const ok = !cfg.passcode || p.toLowerCase() === String(cfg.passcode).toLowerCase();
          if (!ok) {
            attempts++;
            M.logs.add('AUTH', `PERCUBAAN LOG MASUK GAGAL ${attempts} UNTUK "${u.toUpperCase()}"`);
            card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
            M.fx.flash('red'); M.fx.beep('fail');
            M.clear(stampHolder); stampHolder.append(h('span', { class: 'stamp stamp--top stamp--slam stamp--lg' }, 'AKSES DITOLAK'));
            pass.value = '';
            const left = cfg.maxAttempts - attempts;
            if (left <= 0) {
              locked = true; let s = cfg.lockoutSeconds;
              const tick = () => { setStatus(`TERMINAL DIKUNCI — CUBA LAGI DALAM ${s}s`, 'bad'); if (s-- > 0) setTimeout(tick, 1000); else { locked = false; attempts = 0; submit.disabled = false; M.clear(stampHolder); setStatus('KUNCI DILEPASKAN. MENUNGGU KREDENSIAL'); } };
              tick();
            } else setStatus(`AKSES DITOLAK — KREDENSIAL TIDAK SAH (${attempts}/${cfg.maxAttempts})`, 'bad');
            busy = false; if (!locked) submit.disabled = false;
            setTimeout(() => { if (!locked) M.clear(stampHolder); }, 1800);
            return;
          }
          /* success */
          M.fx.beep('ok'); M.fx.flash('green');
          card.classList.add('granted');
          M.clear(stampHolder); stampHolder.append(h('span', { class: 'stamp stamp--ok stamp--slam stamp--lg' }, 'AKSES DIBENARKAN'));
          const steps = ['IDENTITI DISAHKAN', `TAHAP ${clr} · ${M.cfg.classifications[clr - 1]} DIBENARKAN`, 'MENYAHSULIT ARKIB'];
          for (const s of steps) { setStatus(s, 'ok'); await M.sleep(M.fx.on ? 520 : 50); }
          root.classList.add('portal--out');
          await M.sleep(M.fx.on ? 650 : 0);
          root.hidden = true; root.className = 'portal'; M.clear(root);
          resolve({ user: u.toUpperCase(), clearance: clr });
        });
      });
    }
  };
})(window.M);
