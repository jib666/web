/* MARTOD core — skema rekod. Memacu penyunting, carian dan reka letak kertas.
   Untuk menambah medan: tambah di sini DAN tambah kunci pada rekod dalam archive-data.js.
   Bendera medan: optional = disembunyikan pada kertas bila kosong; noPaper = tidak dipaparkan pada kertas. */
(function (M) {
  'use strict';
  const STATUS_CASE = ['BERLANGSUNG', 'DITUTUP', 'DIBEKUKAN'];
  const EVD_TYPES = [
    ['gambar', 'Gambar'], ['peta', 'Peta'], ['imbasan', 'Dokumen Imbasan'],
    ['audio', 'Rakaman Audio'], ['video', 'Rakaman Video'], ['lain', 'Lain-lain']
  ];
  M.EVD_TYPES = EVD_TYPES;
  const RELHINT = 'Pisahkan dengan koma, cth. REK-001, REK-004';

  M.schemas = {
    documents: {
      single: 'Rekod', plural: 'Rekod', labelWord: 'REKOD', prefix: 'REK',
      titleKey: 'title', bodyKey: 'content', subjectKey: 'subject',
      fields: [
        { key: 'title', label: 'Tajuk Rekod', ph: '[TAJUK REKOD]', type: 'text', wide: true },
        { key: 'folder', label: 'Bahagian', ph: '[TIADA BAHAGIAN]', type: 'folder', noPaper: true },
        { key: 'classification', label: 'Klasifikasi', ph: '[KLASIFIKASI]', type: 'classification', optional: true },
        { key: 'reference', label: 'Kod Rujukan', ph: '[KOD RUJUKAN]', type: 'text', mono: true, optional: true },
        { key: 'date', label: 'Tarikh', ph: '[TARIKH]', type: 'date', optional: true },
        { key: 'author', label: 'Penyedia', ph: '[PENYEDIA]', type: 'text', optional: true },
        { key: 'subject', label: 'Perkara', ph: '[PERKARA]', type: 'text', wide: true, optional: true },
        { key: 'extra', label: 'Maklumat Tambahan', ph: 'Keputusan: …', type: 'kv', wide: true, optional: true, hint: 'Satu baris bagi setiap item, bentuk  Kunci: nilai  (cth. Tempoh: 47 Hari)' },
        { key: 'imagePath', label: 'Laluan Gambar', ph: 'images/gambar-saya.jpg', type: 'text', wide: true, mono: true, optional: true, noPaper: true, hint: 'Pilihan. Kosongkan jika gambar dimuat naik atau dinamakan images/rekod-NNN.jpg' },
        { key: 'imageCaption', label: 'Keterangan Gambar', ph: '[KETERANGAN GAMBAR]', type: 'text', wide: true, optional: true, noPaper: true },
        { key: 'content', label: 'Kandungan Rekod', ph: '[LETAK KANDUNGAN REKOD]', type: 'textarea', wide: true, hideLabel: true, hint: 'Menyokong **tebal**, *condong*, > petikan, - senarai, 1. senarai dan jadual | a | b |' }
      ]
    },
    reports: {
      single: 'Kerajaan / Pertubuhan', plural: 'Kerajaan & Pertubuhan', labelWord: 'ENTITI', prefix: 'ORG',
      titleKey: 'title', bodyKey: 'content', subjectKey: 'subject',
      fields: [
        { key: 'title', label: 'Nama', ph: '[NAMA]', type: 'text', wide: true },
        { key: 'author', label: 'Jenis', ph: '[JENIS]', type: 'text' },
        { key: 'subject', label: 'Pemimpin / Ketua', ph: '[PEMIMPIN]', type: 'text', optional: true },
        { key: 'reference', label: 'Kod', ph: '[KOD]', type: 'text', mono: true, optional: true },
        { key: 'classification', label: 'Klasifikasi', ph: '[KLASIFIKASI]', type: 'classification', optional: true },
        { key: 'relatedDocs', label: 'Rekod Berkaitan', ph: '[ID REKOD]', type: 'doclist', wide: true, optional: true, hint: RELHINT },
        { key: 'imagePath', label: 'Laluan Gambar', ph: 'images/gambar-saya.jpg', type: 'text', wide: true, mono: true, optional: true, noPaper: true, hint: 'Pilihan. Laluan gambar, contohnya images/gambar-saya.jpg (letak failnya dalam folder images/).' },
        { key: 'content', label: 'Keterangan', ph: '[LETAK KETERANGAN]', type: 'textarea', wide: true }
      ]
    },
    investigations: {
      single: 'Fail Konflik', plural: 'Fail Konflik', labelWord: 'KONFLIK', prefix: 'KFL',
      titleKey: 'title', bodyKey: 'summary', subjectKey: 'summary',
      fields: [
        { key: 'title', label: 'Nama Konflik', ph: '[NAMA KONFLIK]', type: 'text', wide: true },
        { key: 'status', label: 'Status', ph: '[STATUS]', type: 'select', options: STATUS_CASE },
        { key: 'classification', label: 'Klasifikasi', ph: '[KLASIFIKASI]', type: 'classification', optional: true },
        { key: 'lead', label: 'Pihak Terlibat', ph: '[PIHAK TERLIBAT]', type: 'text', wide: true },
        { key: 'opened', label: 'Tempoh', ph: '[TEMPOH]', type: 'text', optional: true },
        { key: 'relatedDocs', label: 'Rekod Berkaitan', ph: '[ID REKOD]', type: 'doclist', wide: true, optional: true, hint: RELHINT },
        { key: 'imagePath', label: 'Laluan Gambar', ph: 'images/gambar-saya.jpg', type: 'text', wide: true, mono: true, optional: true, noPaper: true, hint: 'Pilihan. Laluan gambar, contohnya images/gambar-saya.jpg (letak failnya dalam folder images/).' },
        { key: 'summary', label: 'Ringkasan', ph: '[LETAK RINGKASAN]', type: 'textarea', wide: true }
      ]
    },
    personnel: {
      single: 'Tokoh', plural: 'Tokoh', labelWord: 'TOKOH', prefix: 'TKH',
      titleKey: 'name', bodyKey: 'notes', subjectKey: 'role',
      fields: [
        { key: 'name', label: 'Nama', ph: '[NAMA TOKOH]', type: 'text', wide: true },
        { key: 'role', label: 'Peranan / Gelaran', ph: '[PERANAN]', type: 'text', wide: true },
        { key: 'department', label: 'Pihak / Kumpulan', ph: '[PIHAK]', type: 'text', optional: true },
        { key: 'status', label: 'Nasib / Status', ph: '[STATUS]', type: 'text', optional: true },
        { key: 'relatedDocs', label: 'Rekod Berkaitan', ph: '[ID REKOD]', type: 'doclist', wide: true, optional: true, hint: RELHINT },
        { key: 'imagePath', label: 'Laluan Gambar', ph: 'images/gambar-saya.jpg', type: 'text', wide: true, mono: true, optional: true, noPaper: true, hint: 'Pilihan. Laluan gambar, contohnya images/gambar-saya.jpg (letak failnya dalam folder images/).' },
        { key: 'notes', label: 'Catatan', ph: '[CATATAN]', type: 'textarea', wide: true, optional: true }
      ]
    },
    evidence: {
      single: 'Artifak', plural: 'Artifak', labelWord: 'ARTIFAK', prefix: 'ART',
      titleKey: 'title', bodyKey: 'description', subjectKey: 'description',
      fields: [
        { key: 'title', label: 'Nama Artifak', ph: '[NAMA ARTIFAK]', type: 'text', wide: true },
        { key: 'type', label: 'Jenis', ph: '[JENIS]', type: 'select', options: EVD_TYPES, noBlank: true },
        { key: 'classification', label: 'Klasifikasi', ph: '[KLASIFIKASI]', type: 'classification', optional: true },
        { key: 'date', label: 'Tarikh', ph: '[TARIKH]', type: 'date', optional: true },
        { key: 'source', label: 'Lokasi / Sumber', ph: '[LOKASI]', type: 'text', wide: true, optional: true },
        { key: 'imagePath', label: 'Laluan Gambar', ph: 'images/gambar-saya.jpg', type: 'text', wide: true, mono: true, optional: true, noPaper: true, hint: 'Pilihan. Laluan gambar, contohnya images/gambar-saya.jpg (letak failnya dalam folder images/).' },
        { key: 'description', label: 'Keterangan', ph: '[KETERANGAN]', type: 'textarea', wide: true }
      ]
    },
    timeline: {
      single: 'Peristiwa', plural: 'Peristiwa', labelWord: 'PERISTIWA', prefix: 'EVT',
      titleKey: 'title', bodyKey: 'description', subjectKey: 'description',
      fields: [
        { key: 'date', label: 'Masa / Tempoh', ph: '[MASA]', type: 'text' },
        { key: 'title', label: 'Tajuk Peristiwa', ph: '[TAJUK PERISTIWA]', type: 'text', wide: true },
        { key: 'description', label: 'Keterangan', ph: '[KETERANGAN]', type: 'textarea', wide: true },
        { key: 'relatedDocument', label: 'Rekod Berkaitan', ph: '[REKOD]', type: 'document', wide: true }
      ]
    },
    folders: {
      single: 'Bahagian', plural: 'Bahagian', labelWord: 'BAHAGIAN', prefix: 'BHG',
      titleKey: 'name',
      fields: [
        { key: 'label', label: 'Label Bahagian', ph: 'BAHAGIAN VII', type: 'text' },
        { key: 'name', label: 'Nama Bahagian', ph: '[NAMA BAHAGIAN]', type: 'text', wide: true }
      ]
    }
  };

  /* Display number e.g. DOC-007 -> "007" */
  M.numOf = (id) => String(id).split('-')[1] || id;
  M.labelOf = (coll, item) => item.label || `${M.schemas[coll].labelWord} ${M.numOf(item.id)}`;
  M.field = (coll, key) => M.schemas[coll].fields.find((f) => f.key === key);
  M.titleOf = (coll, item) => (M.canAccess(item) ? (item[M.schemas[coll].titleKey] || '') : '\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588');
  M.phOf = (coll, key) => (M.field(coll, key) || {}).ph || '';

  /* Everything searchable about a record, lower-cased. */
  M.haystack = function (coll, item) {
    const parts = [item.id, M.labelOf(coll, item)];
    if (!M.canAccess(item)) return parts.join(' \n ').toLowerCase(); // redacted records only match by id
    M.schemas[coll].fields.forEach((f) => { if (item[f.key]) parts.push(f.type === 'date' ? item[f.key] + ' ' + M.fmtDate(item[f.key]) : item[f.key]); });
    if (item.file) parts.push(item.file.name);
    return parts.join(' \n ').toLowerCase();
  };

  /* Where each collection lives in the UI */
  M.VIEWS = {
    documents: 'documents', reports: 'reports', investigations: 'investigations',
    evidence: 'evidence', personnel: 'personnel', timeline: 'timeline'
  };

  /* Global search across all collections. */
  M.searchAll = function (q) {
    q = (q || '').trim().toLowerCase();
    if (!q) return [];
    const out = [];
    ['documents', 'reports', 'investigations', 'evidence', 'personnel', 'timeline'].forEach((c) => {
      M.store.get(c).forEach((it) => { if (M.haystack(c, it).includes(q)) out.push({ coll: c, item: it }); });
    });
    return out;
  };

  /* Open any record in the most natural way */
  M.openRecord = function (coll, id) {
    const it = M.store.find(coll, id);
    if (!it) return false;
    if (coll === 'documents' || coll === 'reports' || coll === 'investigations' || coll === 'personnel') M.docviewer.open(coll, id);
    else if (coll === 'evidence') M.preview.openEvidence(id);
    else if (coll === 'timeline') M.router.go('timeline', id);
    return true;
  };
})(window.M);
