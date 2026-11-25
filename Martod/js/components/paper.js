/* MARTOD component — classified stamps and the scanned-paper document layout */
(function (M) {
  'use strict';
  const h = M.h;

  /* ---- Stamp ---------------------------------------------------------- */
  M.stamp = function (cls, opts) {
    opts = opts || {};
    const key = M.clsKey(cls);
    const text = cls || M.cfg.unclassifiedLabel;
    const rot = (M.hash(text + (opts.seed || '')) % 9) - 4;
    return h('span', {
      class: `stamp stamp--${key}` + (opts.mini ? ' stamp--mini' : '') + (opts.slam ? ' stamp--slam' : ''),
      style: { '--rot': rot + 'deg' }, title: cls ? 'Klasifikasi: ' + cls : 'Tiada klasifikasi khas'
    }, text);
  };

  /* ---- Decorative SVGs ------------------------------------------------ */
  function crest() {
    const wrap = document.createElement('span');
    wrap.className = 'crest';
    let rays = '';
    for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; rays += `<line x1="${50 + Math.cos(a) * 22}" y1="${50 + Math.sin(a) * 22}" x2="${50 + Math.cos(a) * 32}" y2="${50 + Math.sin(a) * 32}"/>`; }
    wrap.innerHTML = `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><circle cx="50" cy="50" r="46"/><circle cx="50" cy="50" r="40" stroke-width="1"/>${rays}<path d="M34 64V36l16 18 16-18v28" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
    return wrap;
  }
  M.crest = crest;

  M.barcode = function (seed, w, hgt) {
    let x = 0, bars = '', n = M.hash(seed);
    while (x < w) {
      n = Math.imul(n ^ (n >>> 15), 2246822507) >>> 0;
      const bw = 1 + (n % 3), gap = 1 + ((n >>> 5) % 3);
      bars += `<rect x="${x}" y="0" width="${bw}" height="${hgt}"/>`; x += bw + gap;
    }
    const s = document.createElement('span');
    s.className = 'barcode';
    s.innerHTML = `<svg width="${w}" height="${hgt}" viewBox="0 0 ${w} ${hgt}" fill="currentColor">${bars}</svg>`;
    return s;
  };

  /* ---- Field value renderers for the paper ---------------------------- */
  function valueNode(coll, f, item) {
    const v = item[f.key];
    if (f.type === 'date') return M.ph(M.fmtDate(v), f.ph);
    if (f.type === 'folder') { const fo = M.store.find('folders', v); return M.ph(fo ? (fo.name || fo.id) : '', f.ph); }
    if (f.type === 'select' && Array.isArray(f.options) && Array.isArray(f.options[0])) { const o = f.options.find((x) => x[0] === v); return M.ph(o ? o[1] : v, f.ph); }
    if (f.type === 'doclist') {
      const ids = String(v || '').split(',').map((s) => s.trim()).filter(Boolean);
      if (!ids.length) return M.ph('', f.ph);
      return h('span', null, ids.map((id, i) => [i ? ', ' : '', h('a', { class: 'paper-link', href: '#', onClick: (e) => { e.preventDefault(); if (M.store.find('documents', id)) M.docviewer.open('documents', id); } }, id)]));
    }
    return M.ph(v, f.ph, f.mono ? 'mono' : null);
  }

  /* ---- Paper ----------------------------------------------------------- */
  const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';

  function kvRows(text) {
    return String(text || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
      const i = l.indexOf(':');
      return i > 0 ? [l.slice(0, i).trim(), l.slice(i + 1).trim()] : ['', l];
    });
  }

  M.paper = {
    render(coll, item, opts) {
      opts = opts || {};
      const sch = M.schemas[coll];
      const cls = coll === 'personnel' ? item.clearance : item.classification;
      const bannerText = cls ? cls : M.cfg.bannerLabel;
      const meta = h('dl', { class: 'paper__meta' });
      const row = (label, node, wide) => meta.append(h('div', { class: 'paper__row' + (wide ? ' wide' : '') }, h('dt', null, label), h('dd', null, node)));
      sch.fields.forEach((f) => {
        if (f.key === sch.titleKey || f.type === 'textarea' || f.noPaper) return;
        if (f.type === 'classification' && !cls) return;       // unclassified: the stamp already says it
        if (f.type === 'kv') { kvRows(item[f.key]).forEach(([k, v]) => row(k || f.label, M.ph(v, ''), true)); return; }
        if (f.optional && isBlank(item[f.key])) return;
        row(f.label, valueNode(coll, f, item), f.wide);
      });
      const body = [];
      sch.fields.filter((f) => f.type === 'textarea').forEach((f) => {
        const txt = item[f.key];
        const has = txt && txt.trim();
        if (!has && f.optional) return;
        body.push(h('section', { class: 'paper__section' },
          f.hideLabel ? null : h('h3', null, f.label),
          has
            ? h('div', { class: 'paper__text paper__text--md' }, M.md(txt))
            : h('div', { class: 'paper__text paper__text--blank' }, h('span', { class: 'ph' }, f.ph), h('div', { class: 'paper__lines' }))));
      });
      const titleField = M.field(coll, sch.titleKey);
      const fo = coll === 'documents' ? M.store.find('folders', item.folder) : null;
      const arch = (M.cfg.meta.archive || {})['Kod Arkib'] || '';
      const el = h('article', { class: 'paper' + (opts.mini ? ' paper--mini' : '') + (opts.scan ? ' paper--scan' : ''), 'data-cls': M.clsKey(cls) },
        h('i', { class: 'paper__tex' }),
        h('i', { class: 'paper__punch p1' }), h('i', { class: 'paper__punch p2' }), h('i', { class: 'paper__punch p3' }),
        h('div', { class: 'paper__banner' }, bannerText),
        h('header', { class: 'paper__head' },
          crest(),
          h('div', { class: 'paper__agency' },
            h('b', null, M.cfg.meta.title),
            h('span', null, 'ARKIB SEJARAH'),
            h('em', null, M.labelOf(coll, item))),
          h('div', { class: 'paper__stampbox' }, M.stamp(cls, { seed: item.id, slam: !opts.mini && M.fx.on }))),
        fo ? h('div', { class: 'paper__part' }, (fo.label ? fo.label + ' — ' : '') + (fo.name || '')) : null,
        h('h2', { class: 'paper__title' }, M.ph(item[sch.titleKey], titleField.ph)),
        meta.children.length ? meta : null,
        M.figure.render(coll, item, { mini: !!opts.mini }),
        h('hr', { class: 'paper__rule' }),
        body,
        h('footer', { class: 'paper__foot' },
          h('span', null, `${M.cfg.meta.title} // ${item.id}${arch ? ' // ' + arch : ''}`),
          M.barcode(item.id, 110, 22)),
        h('div', { class: 'paper__banner paper__banner--bot' }, bannerText));
      return el;
    },

    /* Shown instead of a record the current clearance may not read */
    renderLocked(coll, item, opts) {
      opts = opts || {};
      const cls = coll === 'personnel' ? item.clearance : item.classification;
      const bars = (n) => h('div', { class: 'redact-block' }, Array.from({ length: n }, (_, i) => h('i', { style: { width: (55 + ((M.hash(item.id + i) % 45))) + '%' } })));
      return h('article', { class: 'paper paper--locked' + (opts.mini ? ' paper--mini' : ''), 'data-cls': M.clsKey(cls) },
        h('i', { class: 'paper__tex' }),
        h('div', { class: 'paper__banner' }, cls),
        h('header', { class: 'paper__head' },
          crest(),
          h('div', { class: 'paper__agency' }, h('b', null, M.cfg.meta.title), h('span', null, 'ARKIB SEJARAH'), h('em', null, M.labelOf(coll, item))),
          h('div', { class: 'paper__stampbox' }, M.stamp(cls, { seed: item.id, slam: M.fx.on }))),
        bars(1), bars(5), bars(6),
        h('div', { class: 'denied' },
          h('b', null, 'AKSES DITOLAK'),
          h('span', null, `MEMERLUKAN TAHAP ${M.rank(cls)} · ${cls}`),
          h('span', null, `TAHAP ANDA: ${M.session.clearance} · ${M.session.levelName()}`)),
        h('div', { class: 'paper__banner paper__banner--bot' }, cls));
    }
  };
})(window.M);
