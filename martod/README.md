# MARTOD — Sang Lagenda · Arkib Sejarah

Laman web arkib sinematik untuk cerita **Martod: Sang Lagenda** (Kod Arkib `MU-COMPLETE-001`),
sepenuhnya dalam **Bahasa Melayu**.

* Cerita dipisahkan mengikut **Bahagian** (Bahagian I – VI dan Epilog), dan setiap bahagian
  dipisahkan mengikut **Rekod** (Rekod 001 – 030, Rekod Akhir, Epilog, Tamat) — 33 rekod semuanya.
* Setiap rekod mempunyai **satu gambar**.
* Laman ini **baca-sahaja**: pelawat tidak boleh menyunting atau memuat naik apa-apa. Semua suntingan dibuat melalui kod (lihat di bawah).
* Log masuk hanyalah **simulasi**: pelawat boleh menulis **apa sahaja** pada nama pengguna dan kata laluan.

## Cara menjalankan

Tiada pembinaan (build), tiada pelayan, tiada kebergantungan. Buka **`index.html`** dalam pelayar
moden (Chrome, Edge, Firefox, Safari). Semuanya berfungsi daripada `file://`.

* Log masuk: tulis apa sahaja pada nama pengguna dan kata laluan (boleh juga dikosongkan), kemudian tekan *Masuk Arkib*. Tiada nama pengguna / kata laluan tertentu.
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
namanya** dalam `images/` (jpg) dan muat semula, atau tukar `imagePath` dalam `js/data/archive-data.js`.

## Menukar gambar (melalui kod / folder sahaja)

Setiap item dalam `js/data/archive-data.js` ada `imagePath` (cth. `"images/rekod-002.jpg"`) dan `imageCaption`.
Untuk menukar gambar, **timpa fail yang sama namanya dalam folder `images/`** atau tukar `imagePath`, kemudian muat semula laman.
Rekod yang tiada `imagePath` akan mencari `images/rekod-NNN.jpg` (juga `.png`, `.webp`, `.jpeg`) secara automatik.

## Bahagian laman

| Menu | Kandungan |
|---|---|
| Papan Pemuka | Maklumat arkib, kemajuan gambar setiap Bahagian, imbasan, aktiviti |
| Bahagian & Rekod | Cerita penuh: Bahagian → Rekod, carian, tapisan, pratonton, pemapar kertas imbasan |
| Fail Konflik | Enam peperangan/pertempuran utama (pihak, tempoh, rekod berkaitan) |
| Kerajaan & Pertubuhan | Tujuh Kerajaan, Legion Hitam, Pakatan, Pengawal Abadi, The Vanguard, Ordo Abadi, Penjaga Fajar, Empayar Nova |
| Galeri Artifak | Mahkota hitam, jurnal, surat terakhir dan lain-lain |
| Tokoh | Martod, raja-raja, Arven, Kaien Voss, Lord Veyron dan lain-lain |
| Garis Masa | 30 peristiwa mengikut urutan cerita + peta sambungan ke rekod |
| Log Sistem | Jejak audit semua tindakan |

Bahagian *Fail Konflik*, *Kerajaan & Pertubuhan*, *Tokoh*, *Artifak* dan *Garis Masa* disusun
hanya daripada fakta yang ada dalam teks cerita anda. Anda boleh menyunting atau menambah sendiri dalam fail data.

## Mengedit kandungan (hanya melalui kod)

Buka `js/data/archive-data.js` dalam penyunting teks, ubah, simpan, dan muat semula laman. Tiada butang sunting atau muat naik
dalam laman; data sentiasa dibaca terus daripada fail ini.

Kandungan rekod (`content`) menyokong: `**tebal**`, `*condong*`, `> petikan`, `- senarai`, `1. senarai`,
`### subtajuk` dan jadual `| a | b |`.

Medan rekod (`documents`): `id`, `folder` (Bahagian), `label` (cth. “REKOD AKHIR”), `title`, `classification`,
`reference`, `author`, `extra` (baris `Kunci: nilai` tambahan, cth. `Keputusan: Kemenangan Martod`),
`imagePath`, `imageCaption`, `content`.

Tambah **Bahagian** baharu dengan menambah satu objek dalam `folders`.

## Muzik latar (dua lagu)

Laman ini ada pemain muzik latar (butang not muzik di bar atas; ikon kecil bergerak apabila lagu sedang main).

1. Letak dua fail lagu anda dalam folder `audio/` dengan nama **`lagu-1.mp3`** dan **`lagu-2.mp3`**
   (`.m4a`, `.ogg` atau `.wav` juga dikenali).
2. Muat naik folder `audio/` ke GitHub bersama fail lain, kemudian muat semula laman.
3. Lagu bermula selepas pelawat menekan **Log Masuk** dan bertukar ke lagu seterusnya secara automatik (1 → 2 → 1 …).
   Pelayar menyekat bunyi sebelum pelawat menyentuh/klik skrin, jadi muzik hanya bermula selepas sentuhan pertama.
4. Pelawat boleh jeda, tukar lagu, laras kelantangan; pilihan jeda diingati. Terminal: `muzik`, `muzik off`, `muzik seterusnya`.

Menukar tajuk, nama artis atau nama fail: sunting bahagian `music` dalam `js/data/archive-data.js`
(atau `music` dalam `gen_data.py` jika anda menjana semula). Tetapkan `enabled: false` untuk mematikan fungsi ini.
Jika fail lagu belum ada, pemain hanya memaparkan arahan ringkas dan laman tetap berfungsi.
Fail audio besar: pastikan setiap fail di bawah 25 MB (had muat naik web GitHub) dan sebaiknya kurang 10 MB.

## Terminal

Tekan `` ` `` (atau butang terminal). Arahan: `bantuan`, `bahagian`, `senarai rekod`, `buka 003`,
`cari aldric`, `pergi garis`, `tahap 3`, `statistik`, `log`, `fx`, `bunyi`, `keluar`. Nama arahan Inggeris lama (`help`, `open`, `search` …) turut berfungsi.

## Pintasan papan kekunci

`/` cari · `` ` `` terminal · `Esc` tutup · `←` `→` rekod sebelum/seterusnya · `+` `−` zum

## Struktur projek

```
index.html                  rangka laman
images/                     ★ semua gambar (rekod, tokoh, artifak, lambang, konflik)
css/                        base, effects, components, views, responsive
js/
  data/archive-data.js      ★ SEMUA KANDUNGAN DISUNTING DI SINI (MELALUI KOD) ★
  core/                     dom, store, fx, schemas, router, md (pemapar teks cerita)
  components/               paper, figure (gambar), viewer, terminal, boot, auth, shell
  views/                    papan pemuka, bahagian & rekod, konflik/entiti/tokoh, artifak, garis masa, log
  main.js
```

## Nota

* Semua fail dan kandungan kekal dalam pelayar anda; tiada apa dihantar ke mana-mana pelayan.
* Konsol pelayar mungkin menunjukkan ralat “fail tidak ditemui” untuk `images/rekod-NNN.*` yang belum wujud —
  itu normal; laman sedang mencari gambar yang belum anda letakkan.
* Kesan visual (CRT, bunyi bising, garisan imbasan) boleh dimatikan dengan butang kilat di bar atas,
  dan dihormati secara automatik jika sistem anda meminta pergerakan dikurangkan.


## Membuka di telefon

1. **Ekstrak (unzip) dahulu** fail `martod.zip` — jangan buka `index.html` terus dari dalam zip atau dari pratonton fail,
   kerana skrip dan gambar dalam folder lain tidak akan dimuatkan dan skrin kelihatan kosong.
2. Buka `index.html` dalam pelayar (Chrome / Safari). Atau muat naik seluruh folder ke hos statik (GitHub Pages, Netlify, dsb.) dan buka pautannya.
3. Ketik skrin sekali untuk melangkau animasi permulaan; pilih tahap capaian, kemudian **ketik** rekod untuk membukanya.
Pada skrin kecil, kertas dokumen mengisi lebar skrin dan teksnya boleh dibaca tanpa zum.

## Memuat naik ke GitHub Pages

* Letakkan **kandungan** folder ini (bukan folder `martod` di dalamnya) di akar repositori, supaya `index.html` berada di tahap teratas.
* Penyemak web GitHub hanya menerima **maksimum 100 fail setiap muat naik**. Projek ini ada lebih 100 fail, jadi muat naik dalam dua kelompok
  (cth. folder `images/` dahulu, kemudian `css/`, `js/`, `index.html`, `.nojekyll`) atau gunakan GitHub Desktop / `git push`.
* Fail `.nojekyll` memberitahu GitHub Pages supaya tidak menapis fail; semua fail kod sudah dinamakan tanpa garis bawah di hadapan.
* Aktifkan: *Settings → Pages → Deploy from a branch → main / (root)*. Tunggu 1–2 minit, kemudian buka pautan `https://nama.github.io/nama-repo/`.
* GitHub Pages sensitif huruf besar/kecil: kekalkan nama fail dalam huruf kecil seperti sedia ada.
