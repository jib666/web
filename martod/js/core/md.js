/* MARTOD core — tiny, safe markdown-subset renderer (DOM only, never innerHTML).
   Supports: paragraphs, ### sub-headings, **bold**, *italic*, > quotes, - lists, 1. lists, | tables |, --- rules. */
(function (M) {
  'use strict';
  const h = M.h;

  function inline(text) {
    const out = [];
    const re = /\*\*([^*]+)\*\*|\*([^*\s][^*]*?)\*/g;
    let last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) out.push(text.slice(last, m.index));
      out.push(m[1] !== undefined ? h('strong', null, m[1]) : h('em', null, m[2]));
      last = m.index + m[0].length;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
  }
  const cells = (row) => row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());

  M.md = function (src) {
    const root = h('div', { class: 'md' });
    const lines = String(src || '').replace(/\r/g, '').split('\n');
    let i = 0;
    while (i < lines.length) {
      const raw = lines[i], s = raw.trim();
      if (!s) { i++; continue; }
      if (/^-{3,}$/.test(s)) { root.append(h('hr')); i++; continue; }
      let m = s.match(/^(#{1,6})\s+(.*)$/);
      if (m) { root.append(h('h4', { class: 'md__h' }, inline(m[2]))); i++; continue; }
      if (s.startsWith('>')) {
        const paras = [[]];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          const t = lines[i].trim().replace(/^>\s?/, '');
          if (!t.trim()) { if (paras[paras.length - 1].length) paras.push([]); } else paras[paras.length - 1].push(t);
          i++;
        }
        root.append(h('blockquote', null, paras.filter((p) => p.length).map((p) => h('p', null, inline(p.join(' '))))));
        continue;
      }
      if (s.startsWith('|')) {
        const rows = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) { rows.push(lines[i].trim()); i++; }
        const body = rows.filter((r) => !/^\|?\s*:?-{2,}/.test(r.replace(/\s/g, '')) || /[^|:\-\s]/.test(r));
        const data = body.map(cells);
        if (data.length) {
          const head = data[0], rest = data.slice(1);
          root.append(h('div', { class: 'md__tablewrap' }, h('table', { class: 'md__table' },
            h('thead', null, h('tr', null, head.map((c) => h('th', null, inline(c))))),
            h('tbody', null, rest.map((r) => h('tr', null, r.map((c) => h('td', null, inline(c)))))))));
        }
        continue;
      }
      if (/^[-*]\s+/.test(s)) {
        const items = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^[-*]\s+/, '')); i++; }
        root.append(h('ul', null, items.map((t) => h('li', null, inline(t))))); continue;
      }
      if (/^\d+\.\s+/.test(s)) {
        const items = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^\d+\.\s+/, '')); i++; }
        root.append(h('ol', null, items.map((t) => h('li', null, inline(t))))); continue;
      }
      const para = [];
      while (i < lines.length && lines[i].trim() && !/^(>|\||#{1,6}\s|[-*]\s|\d+\.\s|-{3,}$)/.test(lines[i].trim())) { para.push(lines[i].trim()); i++; }
      root.append(h('p', null, inline(para.join(' '))));
    }
    return root;
  };
})(window.M);
