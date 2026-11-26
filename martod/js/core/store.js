/* MARTOD core — data store, logs, session, binary file storage */
(function (M) {
  'use strict';
  const KEY = 'martod.archive.v1';
  const LOGKEY = 'martod.logs.v1';
  const COLLS = ['folders', 'documents', 'investigations', 'reports', 'evidence', 'personnel', 'timeline'];
  const DEFAULT = M.clone(window.MARTOD_DATA);
  const listeners = new Set();
  const logListeners = new Set();
  let data;
  let localEdits = false;

  M.cfg = {
    meta: DEFAULT.meta,
    auth: DEFAULT.auth,
    classifications: DEFAULT.classifications,
    unclassifiedLabel: DEFAULT.unclassifiedLabel || 'ARKIB SEJARAH',
    bannerLabel: DEFAULT.bannerLabel || 'DOKUMEN SEJARAH UTAMA',
    images: DEFAULT.images || { folder: 'images', prefix: 'rekod-', exts: ['jpg', 'png', 'webp', 'jpeg'] }
  };

  function load() {
    /* Laman ini baca-sahaja: data sentiasa datang daripada js/data/archive-data.js.
       Sebarang salinan lama yang pernah disimpan dalam pelayar dibuang. */
    data = M.clone(DEFAULT);
    localEdits = false;
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
  }
  let pendingNote = null;

  function persist() { /* baca-sahaja: tiada apa disimpan */ }
  function emit(coll) { listeners.forEach((fn) => { try { fn(coll); } catch (e) { console.error(e); } }); }

  const PREFIX = { documents: 'REK', investigations: 'KFL', reports: 'ORG', evidence: 'ART', personnel: 'TKH', timeline: 'EVT', folders: 'BHG' };

  M.store = {
    get: (c) => data[c],
    find: (c, id) => data[c].find((x) => x.id === id),
    findAny(id) { // search every collection for an id
      for (const c of COLLS) { const f = data[c].find((x) => x.id === id); if (f) return { coll: c, item: f }; }
      return null;
    },
    prefix: (c) => PREFIX[c],
    nextId(c) {
      if (c === 'folders') {
        const used = new Set(data.folders.map((f) => f.id));
        let n = data.folders.length + 1;
        while (used.has('BHG-N' + n)) n++;
        return 'BHG-N' + n;
      }
      let max = 0;
      data[c].forEach((x) => { const n = parseInt(String(x.id).split('-')[1], 10); if (n > max) max = n; });
      return PREFIX[c] + '-' + M.pad(max + 1, 3);
    },
    upsert(c, item, opts) {
      const i = data[c].findIndex((x) => x.id === item.id);
      if (!(opts && opts.silent) && c !== 'folders') item.updated = new Date().toISOString();
      if (i >= 0) data[c][i] = item; else data[c].push(item);
      persist(); emit(c);
      return item;
    },
    remove(c, id) {
      const i = data[c].findIndex((x) => x.id === id);
      if (i < 0) return false;
      const [gone] = data[c].splice(i, 1);
      persist(); emit(c);
      // release attached binary files
      const files = [];
      if (gone.file) files.push(gone.file);
      if (gone.image) files.push(gone.image);
      if (gone.attachments) files.push(...gone.attachments);
      files.forEach((f) => M.blobs.del(f.blobId));
      return true;
    },
    touch(c, id) { const it = this.find(c, id); if (it) { it.updated = new Date().toISOString(); persist(); emit(c); } },
    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    hasLocalEdits: () => localEdits,
    reset() {
      try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
      M.blobs.clearAll();
      load(); emit('*');
    },
    exportObject() {
      const out = { meta: { ...DEFAULT.meta, dataRevision: 'export-' + new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '') }, auth: DEFAULT.auth, classifications: DEFAULT.classifications, unclassifiedLabel: M.cfg.unclassifiedLabel, bannerLabel: M.cfg.bannerLabel, images: M.cfg.images };
      COLLS.forEach((c) => { out[c] = M.clone(data[c]); });
      return out;
    },
    exportJS() {
      const o = this.exportObject();
      return '/* Data arkib MARTOD. Dieksport ' + new Date().toISOString() + '\n   Gantikan js/data/archive-data.js dengan fail ini.\n   NOTA: fail yang dimuat naik (gambar rekod, artifak, lampiran) disimpan dalam pelayar dan TIDAK disertakan;\n   letakkan gambar dalam folder images/ (rekod-001.jpg ...) untuk menyimpannya secara kekal. */\nwindow.MARTOD_DATA = ' + JSON.stringify(o, null, 2) + ';\n';
    },
    importObject(obj) {
      let n = 0;
      COLLS.forEach((c) => { if (Array.isArray(obj[c])) { data[c] = obj[c]; n += obj[c].length; } });
      persist(); emit('*');
      return n;
    },
    popNote() { const n = pendingNote; pendingNote = null; return n; }
  };

  /* ---- session ---- */
  const SKEY = 'martod.session.v1';
  M.session = {
    user: null, clearance: 1, authed: false, started: null, id: null,
    load() {
      try {
        const s = JSON.parse(sessionStorage.getItem(SKEY));
        if (s && s.user) { Object.assign(this, s, { authed: true }); return true; }
      } catch (e) { /* ignore */ }
      return false;
    },
    save() { try { sessionStorage.setItem(SKEY, JSON.stringify({ user: this.user, clearance: this.clearance, started: this.started, id: this.id })); } catch (e) { /* ignore */ } },
    start(user, clearance) {
      this.user = user; this.clearance = clearance; this.authed = true; this.started = Date.now();
      this.id = (M.hash(user + this.started).toString(16).toUpperCase().padStart(8, '0'));
      this.id = this.id.slice(0, 4) + '-' + this.id.slice(4, 8);
      this.save();
    },
    end() { this.authed = false; try { sessionStorage.removeItem(SKEY); } catch (e) { /* ignore */ } },
    setClearance(n) { this.clearance = n; this.save(); },
    levelName() { return M.cfg.classifications[this.clearance - 1] || 'TERHAD'; }
  };

  /* ---- classification helpers ---- */
  M.rank = (cls) => { const i = M.cfg.classifications.indexOf(cls); return i + 1; }; // 0 = unassigned
  M.canAccess = (item) => { const c = item && (item.classification || item.clearance); return !c || M.rank(c) <= M.session.clearance; };
  M.clsKey = (cls) => ({ 'RAHSIA BESAR': 'top', 'RAHSIA': 'secret', 'SULIT': 'conf', 'TERHAD': 'restr', 'ARKIB AWAM': 'pub' }[cls] || 'none');

  /* ---- system logs ---- */
  let logs = [];
  try { logs = JSON.parse(localStorage.getItem(LOGKEY)) || []; } catch (e) { logs = []; }
  /* Kod tahap log kekal sebagai kunci dalaman; label paparan dalam Bahasa Melayu */
  const LOGLBL = { VIEW: 'PAPAR', EDIT: 'SUNTING', SEARCH: 'CARI', CMD: 'ARAHAN', ALERT: 'AMARAN', SYS: 'SISTEM' };
  M.logs = {
    label: (l) => LOGLBL[l] || l,
    all: () => logs,
    add(level, msg, link) {
      const e = { t: new Date().toISOString(), level, msg, user: M.session.user || 'SYSTEM', link: link || null };
      logs.push(e);
      if (logs.length > 500) logs = logs.slice(-500);
      try { localStorage.setItem(LOGKEY, JSON.stringify(logs)); } catch (err) { /* ignore */ }
      logListeners.forEach((fn) => fn(e));
      return e;
    },
    clear() { logs = []; try { localStorage.removeItem(LOGKEY); } catch (e) { /* ignore */ } logListeners.forEach((fn) => fn(null)); },
    on(fn) { logListeners.add(fn); return () => logListeners.delete(fn); }
  };

  /* ---- binary file storage (IndexedDB with in-memory fallback) ---- */
  M.blobs = (function () {
    const mem = new Map();
    const urls = new Map();
    let dbp = null;
    function db() {
      if (dbp) return dbp;
      dbp = new Promise((res) => {
        try {
          const r = indexedDB.open('martod-files', 1);
          r.onupgradeneeded = () => r.result.createObjectStore('f');
          r.onsuccess = () => res(r.result);
          r.onerror = () => res(null);
        } catch (e) { res(null); }
      });
      return dbp;
    }
    return {
      async put(id, blob) {
        mem.set(id, blob);
        const d = await db(); if (!d) return false;
        return new Promise((res) => {
          try {
            const tx = d.transaction('f', 'readwrite'); tx.objectStore('f').put(blob, id);
            tx.oncomplete = () => res(true); tx.onerror = () => res(false); tx.onabort = () => res(false);
          } catch (e) { res(false); }
        });
      },
      async get(id) {
        if (mem.has(id)) return mem.get(id);
        const d = await db(); if (!d) return null;
        return new Promise((res) => {
          try {
            const rq = d.transaction('f').objectStore('f').get(id);
            rq.onsuccess = () => { if (rq.result) mem.set(id, rq.result); res(rq.result || null); };
            rq.onerror = () => res(null);
          } catch (e) { res(null); }
        });
      },
      async url(id) {
        if (urls.has(id)) return urls.get(id);
        const b = await this.get(id); if (!b) return null;
        const u = URL.createObjectURL(b); urls.set(id, u); return u;
      },
      async del(id) {
        mem.delete(id);
        if (urls.has(id)) { URL.revokeObjectURL(urls.get(id)); urls.delete(id); }
        const d = await db(); if (!d) return;
        try { d.transaction('f', 'readwrite').objectStore('f').delete(id); } catch (e) { /* ignore */ }
      },
      async clearAll() {
        mem.clear(); urls.forEach((u) => URL.revokeObjectURL(u)); urls.clear();
        const d = await db(); if (!d) return;
        try { d.transaction('f', 'readwrite').objectStore('f').clear(); } catch (e) { /* ignore */ }
      },
      /* Save a File object and return the metadata record stored in the data. */
      async saveFile(file) {
        const blobId = 'F' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
        await this.put(blobId, file);
        return { blobId, name: file.name, type: file.type || '', size: file.size };
      }
    };
  })();

  load();
})(window.M);
