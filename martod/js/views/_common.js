/* MARTOD views — keadaan UI dikongsi dan komponen paparan kecil */
(function (M) {
  'use strict';
  const h = M.h;

  /* UI state that survives navigation (kept in memory only) */
  M.ui = {
    docs: { q: '', cls: '', sort: 'num', mode: 'folders', closed: new Set(), selected: null },
    rec: {},
    evidence: { type: 'all', q: '' },
    logs: { level: 'SEMUA', q: '' }
  };

  /* Page header with section code, title, subtitle and action buttons */
  M.viewHead = function (code, title, sub, actions) {
    return h('header', { class: 'vhead' },
      h('div', { class: 'vhead__txt' },
        h('div', { class: 'vhead__code' }, code),
        h('h1', { class: 'vhead__title glitch-hover', 'data-text': title }, title),
        sub ? h('p', { class: 'vhead__sub' }, sub) : null),
      h('div', { class: 'vhead__actions' }, actions || []));
  };

  M.btn = function (label, icon, onClick, kind) {
    return h('button', { class: 'btn' + (kind ? ' btn--' + kind : ''), type: 'button', onClick }, icon ? M.icon(icon, 15) : null, label);
  };

  M.searchBox = function (value, placeholder, onInput) {
    const i = h('input', { type: 'search', value: value || '', placeholder, autocomplete: 'off', spellcheck: 'false', 'aria-label': placeholder });
    i.addEventListener('input', M.debounce(() => onInput(i.value), 90));
    return h('label', { class: 'sbox' }, M.icon('search', 15), i);
  };

  M.selectBox = function (label, options, value, onChange) {
    const s = h('select', { 'aria-label': label }, options.map(([v, l]) => h('option', { value: v }, l)));
    s.value = value;
    s.addEventListener('change', () => onChange(s.value));
    return h('label', { class: 'sel' }, h('span', null, label), s);
  };

  M.clsOptions = (allLabel) => [['', allLabel || 'SEMUA KLASIFIKASI'], ...M.cfg.classifications.map((c) => [c, c]), ['__none', 'TANPA KLASIFIKASI']];

  M.clsMatches = (filter, cls) => !filter || (filter === '__none' ? !cls : cls === filter);

  M.empty = (text, sub) => h('div', { class: 'empty' }, h('b', null, text), sub ? h('span', null, sub) : null);

  /* Cip pautan ke rekod daripada senarai "REK-001, REK-002" */
  M.docChips = function (list) {
    const ids = String(list || '').split(',').map((s) => s.trim()).filter(Boolean);
    return ids.map((id) => {
      const ok = !!M.store.find('documents', id);
      return h('button', { type: 'button', class: 'docchip' + (ok ? '' : ' docchip--bad'), title: ok ? 'Buka ' + id : 'Rekod tidak ditemui', onClick: (e) => { e.stopPropagation(); if (ok) M.docviewer.open('documents', id); } }, M.icon('link', 12), id);
    });
  };

  /* Reveal-on-scroll helper */
  M.reveal = function (els, root) {
    if (!M.fx.on || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return () => {}; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { root: null, threshold: 0.12 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  };
})(window.M);
