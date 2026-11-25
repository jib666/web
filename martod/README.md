# MARTOD — Sang Lagenda · Arkib Sejarah

Laman web arkib sinematik untuk cerita **Martod: Sang Lagenda** (Kod Arkib `MU-COMPLETE-001`),
sepenuhnya dalam **Bahasa Melayu**.

* Cerita dipisahkan mengikut **Bahagian** (Bahagian I – VI dan Epilog), dan setiap bahagian
  dipisahkan mengikut **Rekod** (Rekod 001 – 030, Rekod Akhir, Epilog, Tamat) — 33 rekod semuanya.
* Setiap rekod mempunyai **satu ruang gambar** untuk anda isi.
* Log masuk hanyalah **simulasi** untuk persembahan, bukan keselamatan sebenar.

## Cara menjalankan

Tiada pembinaan (build), tiada pelayan, tiada kebergantungan. Buka **`index.html`** dalam pelayar
moden (Chrome, Edge, Firefox, Safari). Semuanya berfungsi daripada `file://`.

* Log masuk demo: sebarang nama pengguna + kata laluan **`martod`** (tukar dalam `js/data/archive-data.js` → `auth`).
* Pilih tahap capaian semasa log masuk (T1–T5). Rekod yang diklasifikasikan *melebihi* tahap anda
  akan disorokkan. Rekod 024 *Protokol Kedua* ialah **RAHSIA BESAR**; rekod lain terbuka kepada semua.
* Fon web pilihan (Oswald, Share Tech Mono, Special Elite, IBM Plex Mono) dimuat daripada Google Fonts
  jika dalam talian; jika luar talian, fon sistem digunakan.

## Gambar yang sudah disediakan

Semua gambar sudah dimasukkan dalam folder `images/` dan disambungkan ke laman:

| Fail | Kegunaan |
|---|---|
| `rekod-001.jpg` … `rekod-032.jpg` | satu ilustrasi bagi setiap Rekod |
| `rekod-033.jpg` | foto Martod (gambar yang anda bekalkan) |
| `tokoh-001.jpg` | foto Martod (potongan potret daripada gambar yang sama) |
| `tokoh-002.jpg` … `tokoh-014.jpg` | potret ilustrasi tokoh lain |
| `artifak-001.jpg` … `artifak-009.jpg` | artifak (ART-009 ialah peta ilustrasi hiasan, bukan daripada cerita) |
| `org-001.jpg` … `org-014.jpg` | lambang Tujuh Kerajaan dan pertubuhan |
| `konflik-001.jpg` … `konflik-006.jpg` | gambar Fail Konflik |

Selain foto Martod, semua gambar ialah **ilustrasi asal** yang dilukis dengan kod (bukan foto sebenar). Rupa tokoh lain
ialah rekaan saya kerana cerita tidak memerihalkan rupa mereka. Untuk menggantikan mana-mana gambar, **timpa fail yang sama
namanya** dalam `images/` (jpg) dan muat semula, atau tukar medan *Laluan Gambar* pada rekod itu.

## Meletakkan gambar pada rekod (satu gambar setiap rekod)

Setiap rekod ada kotak bertanda **“RUANG GAMBAR · REKOD NNN”** di bawah tajuknya. Pilih satu cara:

1. **Folder `images/` (disyorkan, kekal bersama projek).**
   Letak fail bernama `rekod-001.jpg`, `rekod-002.jpg` … `rekod-033.jpg` dalam folder `images/`, kemudian muat semula laman.
   Format: `.jpg`, `.jpeg`, `.png`, `.webp`.
   `rekod-031` = Rekod Akhir, `rekod-032` = Epilog, `rekod-033` = Tamat.
2. **Muat naik dalam laman.** Buka rekod → butang **MUAT NAIK GAMBAR** (atau *Muat Naik* → “Gambar rekod”).
   Gambar disimpan dalam pelayar anda sahaja (IndexedDB) dan tidak ikut bersama projek.
3. **Laluan tersendiri.** Sunting rekod → medan *Laluan Gambar* (cth. `images/watak-martod.png`).

Keutamaan: gambar yang dimuat naik → *Laluan Gambar* (sudah diisi untuk semua rekod) → `images/rekod-NNN.*`.
Kapsyen gambar diisi pada medan *Keterangan Gambar* semasa menyunting rekod. Klik gambar untuk melihatnya besar.
Papan Pemuka menunjukkan kemajuan gambar bagi setiap Bahagian.

## Bahagian laman

| Menu | Kandungan |
|---|---|
| Papan Pemuka | Maklumat arkib, kemajuan gambar setiap Bahagian, imbasan, aktiviti |
| Bahagian & Rekod | Cerita penuh: Bahagian → Rekod, carian, tapisan, pratonton, pemapar kertas imbasan |
| Fail Konflik | Enam peperangan/pertempuran utama (pihak, tempoh, rekod berkaitan) |
| Kerajaan & Pertubuhan | Tujuh Kerajaan, Legion Hitam, Pakatan, Pengawal Abadi, The Vanguard, Ordo Abadi, Penjaga Fajar, Empayar Nova |
| Galeri Artifak | Mahkota hitam, jurnal, surat terakhir dan lain-lain (muat naik fail pada setiap artifak) |
| Tokoh | Martod, raja-raja, Arven, Kaien Voss, Lord Veyron dan lain-lain |
| Garis Masa | 30 peristiwa mengikut urutan cerita + peta sambungan ke rekod |
| Log Sistem | Jejak audit semua tindakan |

Bahagian *Fail Konflik*, *Kerajaan & Pertubuhan*, *Tokoh*, *Artifak* dan *Garis Masa* disusun
hanya daripada fakta yang ada dalam teks cerita anda. Anda boleh menyunting atau menambah sendiri.

## Mengedit kandungan

**Cara 1 — dalam laman (pantas).** Tekan butang sunting (pensel) atau `E` dalam pemapar. Suntingan disimpan
dalam pelayar. Gunakan butang **DATA** → *Eksport archive-data.js* untuk memuat turun, kemudian gantikan
`js/data/archive-data.js` supaya kekal dalam projek.

**Cara 2 — sunting fail data.** Buka `js/data/archive-data.js` dalam penyunting teks. Selepas mengedit,
tukar `meta.dataRevision` (apa-apa teks baharu) supaya pelayar membuang salinan suntingan lama.

Kandungan rekod (`content`) menyokong: `**tebal**`, `*condong*`, `> petikan`, `- senarai`, `1. senarai`,
`### subtajuk` dan jadual `| a | b |`.

Medan rekod (`documents`): `id`, `folder` (Bahagian), `label` (cth. “REKOD AKHIR”), `title`, `classification`,
`reference`, `author`, `extra` (baris `Kunci: nilai` tambahan, cth. `Keputusan: Kemenangan Martod`),
`imagePath`, `imageCaption`, `content`.

Tambah **Bahagian** baharu: butang *Bahagian Baharu*, atau tambah satu objek dalam `folders`.

## Terminal

Tekan `` ` `` (atau butang terminal). Arahan: `bantuan`, `bahagian`, `senarai rekod`, `buka 003`,
`cari aldric`, `pergi garis`, `baharu rekod`, `tahap 3`, `statistik`, `muatnaik`, `eksport`, `log`, `fx`, `bunyi`,
`setsemula`, `keluar`. Nama arahan Inggeris lama (`help`, `open`, `search` …) turut berfungsi.

## Pintasan papan kekunci

`/` cari · `` ` `` terminal · `Esc` tutup · `←` `→` rekod sebelum/seterusnya · `+` `−` zum · `E` sunting

## Struktur projek

```
index.html                  rangka laman
images/                     ★ semua gambar (rekod, tokoh, artifak, lambang, konflik)
css/                        base, effects, components, views, responsive
js/
  data/archive-data.js      ★ SEMUA KANDUNGAN BOLEH SUNTING DI SINI ★
  core/                     dom, store, fx, schemas, router, md (pemapar teks cerita)
  components/               paper, figure (ruang gambar), viewer, editor, upload, terminal, boot, auth, shell
  views/                    papan pemuka, bahagian & rekod, konflik/entiti/tokoh, artifak, garis masa, log
  main.js
```

## Nota

* Semua fail dan kandungan kekal dalam pelayar anda; tiada apa dihantar ke mana-mana pelayan.
* Konsol pelayar mungkin menunjukkan ralat “fail tidak ditemui” untuk `images/rekod-NNN.*` yang belum wujud —
  itu normal; laman sedang mencari gambar yang belum anda letakkan.
* Kesan visual (CRT, bunyi bising, garisan imbasan) boleh dimatikan dengan butang kilat di bar atas,
  dan dihormati secara automatik jika sistem anda meminta pergerakan dikurangkan.
