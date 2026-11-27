/* ==========================================================================
   MARTOD — DATA ARKIB  (SATU-SATUNYA FAIL YANG PERLU ANDA EDIT)
   --------------------------------------------------------------------------
   Fail ini dijana daripada teks "Arkib Sejarah Martod / Martod Universe".

   STRUKTUR
     folders        -> BAHAGIAN (Bahagian I - VI + Epilog)
     documents      -> REKOD (setiap rekod ada SATU slot gambar)
     investigations -> Fail Konflik        reports  -> Kerajaan & Pertubuhan
     personnel      -> Tokoh               evidence -> Galeri Artifak
     timeline       -> Garis Masa

   LAMAN INI BACA-SAHAJA. Semua suntingan dibuat di dalam fail ini (dan folder images/).

   GAMBAR
     Setiap item ada  imagePath: "images/nama-fail.jpg"  dan  imageCaption: "Keterangan".
     Untuk menukar gambar, timpa fail dalam folder images/ atau tukar imagePath.
     Rekod tanpa imagePath akan mencari images/rekod-NNN.jpg secara automatik.

   Kandungan rekod menyokong:  **tebal**  *condong*  > petikan  - senarai  1. senarai
   dan jadual ( | a | b | ).

   Selepas edit fail ini, simpan dan muat semula laman. Lihat README.md untuk panduan penuh.
   ========================================================================== */

window.MARTOD_DATA = {

  meta: {
    title: "MARTOD",
    subtitle: "SANG LAGENDA · ARKIB SEJARAH MARTOD UNIVERSE",
    dataRevision: "cerita-2026-11-26-c",
    archive: {
      "Kod Arkib": "MU-COMPLETE-001",
      "Klasifikasi": "DOKUMEN SEJARAH UTAMA",
      "Status": "LENGKAP",
      "Kategori": "Sejarah, Politik, Ketenteraan dan Pemerintahan",
      "Tempoh Sejarah": "Era Tujuh Kerajaan hingga Penutupan Martod Universe",
      "Penyimpan": "Jabatan Arkib Sejarah Dunia"
    },
    storyTitle: "SEJARAH KEBANGKITAN, KEJATUHAN DAN PENGAKHIRAN SANG PENGUASA DUNIA"
  },

  /* Log masuk simulasi (untuk persembahan sahaja; BUKAN keselamatan sebenar).
     Sebarang nama pengguna dan kata laluan diterima. */
  auth: { anything: true },

  /* Muzik latar. Letak fail lagu dalam folder audio/ (lihat audio/LETAK-LAGU-DI-SINI.txt).
     file: tanpa sambungan = cuba .mp3, .m4a, .ogg, .wav.  enabled: false untuk mematikan fungsi ini.
     volume: 0 - 1 (pelawat boleh menukarnya dalam pemain). */
  music: {
    enabled: true,
    volume: 0.5,
    tracks: [
      { title: "Lagu Latar 1", artist: "", file: "audio/lagu-1" },
      { title: "Lagu Latar 2", artist: "", file: "audio/lagu-2" }
    ]
  },

  /* Daripada paling rendah ke paling tinggi. Kedudukan = tahap capaian (1..5). */
  classifications: ["ARKIB AWAM", "TERHAD", "SULIT", "RAHSIA", "RAHSIA BESAR"],
  unclassifiedLabel: "ARKIB SEJARAH",
  bannerLabel: "DOKUMEN SEJARAH UTAMA",

  /* Penjelajahan gambar rekod secara automatik: images/rekod-001.jpg ... */
  images: { folder: "images", prefix: "rekod-", exts: ["jpg", "png", "webp", "jpeg"] },

  /* ---- BAHAGIAN ---- */
  folders: [
    { id: "BHG-I", label: "BAHAGIAN I", name: "ZAMAN TUJUH KERAJAAN" },
    { id: "BHG-II", label: "BAHAGIAN II", name: "PERANG TUJUH KERAJAAN" },
    { id: "BHG-III", label: "BAHAGIAN III", name: "EMPAYAR DUNIA MARTOD" },
    { id: "BHG-IV", label: "BAHAGIAN IV", name: "ERA SELEPAS MARTOD" },
    { id: "BHG-V", label: "BAHAGIAN V", name: "PENGAKHIRAN MARTOD UNIVERSE" },
    { id: "BHG-VI", label: "BAHAGIAN VI", name: "PENUTUP RASMI MARTOD UNIVERSE" },
    { id: "BHG-EP", label: "EPILOG", name: "CATATAN TERAKHIR PENYIMPAN ARKIB" }
  ],

  /* ---- REKOD (setiap rekod: satu slot gambar) ----
     extra = baris "Kunci: nilai" (maklumat tambahan seperti Keputusan, Tempoh ...). */
  documents: [
    {
      id: "REK-001", folder: "BHG-I",
      title: "DUNIA SEBELUM MARTOD",
      classification: "", reference: "", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-001.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Dunia Sebelum Martod.",
      updated: null, attachments: [],
      content: `Sebelum wujudnya Empayar Dunia Martod, dunia berada dalam keadaan politik yang tidak stabil.

Tujuh kerajaan utama menguasai benua Arkhadia. Setiap kerajaan mempunyai pemerintah, tentera, sumber ekonomi dan sistem pentadbiran tersendiri.

Persaingan wilayah dan perebutan sumber menyebabkan peperangan berlaku secara berterusan.

Tujuh kerajaan tersebut ialah:

| Kerajaan | Pemerintah | Kekuatan |
|---|---|---|
| Valtherion | Raja Aldric | Tentera darat |
| Solmera | Ratu Seraphine | Teknologi dan perdagangan |
| Dravosk | Raja Kaelor | Industri dan persenjataan |
| Eryndor | Raja Theron | Armada laut |
| Noveria | Maharaja Lucien | Kekayaan dan diplomasi |
| Kharveth | Raja Malrec | Pasukan elit |
| Asterion | Raja Edric | Sumber tenaga dan pertanian |

Tiada satu pun kerajaan mempunyai kekuatan yang mencukupi untuk menguasai keseluruhan benua.

Walaupun perjanjian damai sering dimeterai, kebanyakan perjanjian tersebut gagal bertahan lama.

Rakyat menjadi mangsa kepada peperangan yang dicetuskan oleh kepentingan politik dan perebutan kuasa.

Dalam keadaan inilah seorang individu mula muncul dalam rekod ketenteraan Valtherion.

Namanya Martod.`
    },
    {
      id: "REK-002", folder: "BHG-I",
      title: "KELAHIRAN MARTOD",
      classification: "", reference: "", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-002.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Kelahiran Martod.",
      updated: null, attachments: [],
      content: `Martod dilahirkan di sebuah kampung kecil bernama Valoria, di bawah pemerintahan Kerajaan Valtherion.

Kehidupan awalnya sederhana. Beliau membesar dalam masyarakat yang sering berhadapan dengan ancaman peperangan.

Sejak kecil, Martod menyaksikan kemusnahan kampung, kehilangan keluarga dan penderitaan rakyat akibat konflik antara kerajaan.

Pada usia 17 tahun, beliau menyertai tentera Valtherion.

Rekod ketenteraan menunjukkan bahawa Martod mempunyai kebolehan luar biasa dalam strategi, kepimpinan dan pengurusan peperangan.

Dalam tempoh lima tahun, beliau dinaikkan pangkat daripada anggota biasa kepada panglima medan.

Namun, kejadian yang mengubah seluruh kehidupannya berlaku ketika peperangan antara Valtherion dan Dravosk.`
    },
    {
      id: "REK-003", folder: "BHG-I",
      title: "PERTEMPURAN VALORIA",
      classification: "", reference: "V-017", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "Keputusan: Kekalahan Valtherion",
      image: null, imagePath: "images/rekod-003.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Pertempuran Valoria.",
      updated: null, attachments: [],
      content: `Kerajaan Dravosk melancarkan serangan besar terhadap Valtherion.

Serangan tersebut mengakibatkan kemusnahan beberapa bandar, termasuk Valoria.

Martod kehilangan keluarga dan tempat tinggalnya.

Selepas kekalahan Valtherion, beliau menolak arahan untuk berundur bersama tentera yang masih terselamat.

Sebaliknya, Martod mengumpulkan baki anggota tentera, bekas tawanan perang dan rakyat yang kehilangan tempat tinggal.

Beliau mula membentuk sebuah pasukan baharu.

Pasukan tersebut kemudiannya dikenali sebagai Legion Hitam.

Pada malam selepas kemusnahan Valoria, Martod mencatatkan satu janji:

> "Aku tidak akan membiarkan dunia ini terus diperintah oleh mereka yang menjadikan rakyat sebagai korban."

Catatan tersebut dianggap sebagai permulaan kepada kebangkitan Martod.`
    },
    {
      id: "REK-004", folder: "BHG-I",
      title: "KEBANGKITAN LEGION HITAM",
      classification: "", reference: "", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-004.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Kebangkitan Legion Hitam.",
      updated: null, attachments: [],
      content: `Legion Hitam bermula dengan kira-kira 3,000 anggota.

Pasukan tersebut terdiri daripada bekas tentera, pahlawan, rakyat yang kehilangan tempat tinggal dan individu yang tidak lagi mempercayai kerajaan lama.

Martod memperkenalkan sistem ketenteraan yang berbeza daripada tujuh kerajaan.

Kenaikan pangkat ditentukan berdasarkan kebolehan dan kesetiaan, bukannya keturunan.

Strategi ketenteraan Legion Hitam mengutamakan risikan, serangan pantas, penyamaran dan penguasaan laluan bekalan.

Dalam tempoh tiga tahun, Legion Hitam berkembang menjadi sebuah pasukan yang mampu menandingi tentera kerajaan.

Martod mula memperoleh sokongan daripada bandar-bandar yang telah kehilangan kepercayaan terhadap pemerintah mereka.

Pada ketika ini, beliau bukan lagi sekadar seorang panglima.

Beliau sedang membina kuasa baharu yang berpotensi mengubah sejarah dunia.`
    },
    {
      id: "REK-005", folder: "BHG-II",
      title: "KEJATUHAN VALTHERION",
      classification: "", reference: "V-021", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-005.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Kejatuhan Valtherion.",
      updated: null, attachments: [],
      content: `Selepas memperoleh sokongan majoriti tentera, Martod kembali ke Valtherion untuk menentang pemerintahan Raja Aldric.

Raja Aldric menolak tuntutan pembaharuan sistem pemerintahan.

Konflik bersenjata tercetus di ibu kota.

Dalam tempoh 11 hari, Legion Hitam berjaya menguasai istana, pusat pentadbiran dan kemudahan ketenteraan.

Raja Aldric ditangkap.

Martod mengumumkan pembubaran keluarga diraja dan pembentukan sistem pentadbiran baharu.

Valtherion menjadi wilayah pertama di bawah penguasaannya.`
    },
    {
      id: "REK-006", folder: "BHG-II",
      title: "PERANG TIGA KERAJAAN",
      classification: "", reference: "", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-006.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Perang Tiga Kerajaan.",
      updated: null, attachments: [],
      content: `Kebangkitan Martod mula menarik perhatian kerajaan-kerajaan lain.

Dravosk, Solmera dan Kharveth membentuk pakatan bagi menghentikan perkembangan Legion Hitam.

Peperangan berlangsung selama enam tahun.

Martod menghadapi kekurangan sumber dan bilangan tentera.

Namun, beliau berjaya memecahkan pakatan tersebut melalui strategi diplomatik dan ketenteraan.

Solmera akhirnya menarik diri daripada pakatan selepas mencapai perjanjian perdagangan.

Kharveth mengalami kekalahan besar, manakala Dravosk kehilangan sebahagian wilayah industrinya.

Kemenangan tersebut memberikan Martod penguasaan terhadap sebahagian besar wilayah barat Arkhadia.`
    },
    {
      id: "REK-007", folder: "BHG-II",
      title: "PAKATAN TUJUH KERAJAAN",
      classification: "", reference: "", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-007.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Pakatan Tujuh Kerajaan.",
      updated: null, attachments: [],
      content: `Melihat perkembangan Martod semakin sukar dikawal, semua kerajaan utama bersetuju membentuk pakatan ketenteraan.

Pakatan Tujuh Kerajaan diwujudkan dengan matlamat menghapuskan kekuatan Martod.

Jumlah tentera yang dikumpulkan dipercayai melebihi 800,000 anggota.

Mereka memiliki armada laut terbesar, persenjataan canggih dan sumber ekonomi yang mencukupi untuk membiayai peperangan selama bertahun-tahun.

Martod hanya memiliki kira-kira 180,000 anggota.

Walaupun berhadapan dengan kekuatan yang jauh lebih besar, Martod enggan menyerah.

Beliau memahami bahawa pakatan tersebut dibina atas dasar ketakutan dan bukannya kepercayaan.

Setiap pemerintah mempunyai kepentingan tersendiri.

Kelemahan tersebut menjadi asas kepada strategi Martod.`
    },
    {
      id: "REK-008", folder: "BHG-II",
      title: "PERTEMPURAN AGUNG ARKHADIA",
      classification: "", reference: "AA-001", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "Tempoh: 47 Hari\nKeputusan: Kemenangan Martod",
      image: null, imagePath: "images/rekod-008.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Pertempuran Agung Arkhadia.",
      updated: null, attachments: [],
      content: `Pertempuran Agung Arkhadia merupakan peperangan terbesar sepanjang sejarah penaklukan Martod.

Pakatan Tujuh Kerajaan melancarkan serangan dari utara, selatan dan timur.

Martod mengelakkan pertempuran secara langsung dengan keseluruhan tentera musuh.

Sebaliknya, beliau memutuskan laluan bekalan, memusnahkan pusat komunikasi dan memecahkan kekuatan pakatan melalui serangan berperingkat.

Pada hari ke-31, tentera Noveria meninggalkan medan perang.

Pada hari ke-38, Kharveth kehilangan pusat komando.

Pada hari ke-47, keseluruhan pakatan mengalami kekalahan.

Kemenangan tersebut mengubah keseimbangan kuasa dunia.

Baki kerajaan tidak lagi mempunyai kemampuan untuk menentang Martod secara bersendirian.`
    },
    {
      id: "REK-009", folder: "BHG-II",
      title: "PENAKLUKAN TERAKHIR",
      classification: "", reference: "", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-009.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Penaklukan Terakhir.",
      updated: null, attachments: [],
      content: `Dalam tempoh lima tahun selepas Pertempuran Agung Arkhadia, kerajaan-kerajaan yang masih bertahan mula menyerah.

Eryndor menyerahkan armada lautnya.

Asterion menerima pemerintahan baharu melalui perjanjian pengagihan sumber.

Noveria membuka pusat perdagangannya kepada sistem pentadbiran Martod.

Solmera mengekalkan sebahagian teknologi dan institusinya, tetapi menerima penguasaan politik Martod.

Kharveth dan Dravosk kehilangan kuasa pemerintahan masing-masing.

Pada tahun ke-30 selepas kebangkitan Martod, seluruh benua Arkhadia berada di bawah satu pemerintahan.

Buat pertama kali dalam sejarah, tujuh kerajaan telah disatukan.`
    },
    {
      id: "REK-010", folder: "BHG-III",
      title: "PENUBUHAN EMPAYAR DUNIA",
      classification: "", reference: "ED-001", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "Pemerintah: Martod\nStatus: Empayar Ditubuhkan",
      image: null, imagePath: "images/rekod-010.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Penubuhan Empayar Dunia.",
      updated: null, attachments: [],
      content: `Selepas penaklukan terakhir, Martod mengisytiharkan penubuhan Empayar Dunia.

Sistem pemerintahan baharu menggantikan tujuh kerajaan lama.

Martod menubuhkan sebuah pentadbiran pusat yang mengawal keseluruhan wilayah dunia.

Antara pembaharuan utama ialah:

1. Penghapusan sempadan ketenteraan antara kerajaan.
2. Penubuhan satu sistem undang-undang.
3. Penggunaan mata wang bersama.
4. Pembinaan jaringan pengangkutan antarabangsa.
5. Penyatuan sistem pendidikan.
6. Pembentukan pasukan keselamatan dunia.
7. Pengembangan teknologi dan perdagangan.

Legion Hitam menjadi pasukan ketenteraan utama empayar.

Martod pula dinobatkan sebagai pemerintah tertinggi dengan gelaran:

**MARTOD, SANG PENGUASA DUNIA.**`
    },
    {
      id: "REK-011", folder: "BHG-III",
      title: "ZAMAN KEGEMILANGAN",
      classification: "", reference: "", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-011.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Zaman Kegemilangan.",
      updated: null, attachments: [],
      content: `Pemerintahan Martod membawa perubahan besar terhadap perkembangan dunia.

Peperangan antara kerajaan semakin berkurangan.

Perdagangan antarabangsa berkembang.

Teknologi baharu diperkenalkan.

Bandar-bandar yang musnah akibat peperangan dibangunkan semula.

Sistem pengangkutan menghubungkan wilayah yang sebelum ini terpisah.

Dalam tempoh 20 tahun, dunia mencapai tahap pembangunan yang belum pernah dicapai sebelumnya.

Martod dianggap sebagai pemimpin paling berpengaruh dalam sejarah manusia.

Namun, kejayaan tersebut turut disertai pengawasan politik yang ketat.

Pihak yang menentang empayar berhadapan tindakan kerajaan.

Kuasa pemerintahan semakin tertumpu kepada Martod.

Keamanan dunia bergantung kepada keputusan seorang individu.`
    },
    {
      id: "REK-012", folder: "BHG-III",
      title: "PENGAWAL ABADI",
      classification: "", reference: "", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-012.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Pengawal Abadi.",
      updated: null, attachments: [],
      content: `Bagi memastikan empayarnya kekal stabil, Martod menubuhkan sebuah pasukan elit yang dikenali sebagai Pengawal Abadi.

Pasukan tersebut terdiri daripada individu terpilih yang mempunyai kemahiran ketenteraan, risikan dan keselamatan.

Mereka diberikan akses kepada teknologi paling maju pada zaman tersebut.

Tugas utama mereka termasuk:

- Melindungi pemerintah.
- Menjaga keselamatan ibu kota.
- Mengawal artifak dan teknologi sulit.
- Menumpaskan ancaman terhadap empayar.
- Memastikan kestabilan pemerintahan.

Pengawal Abadi menjadi antara organisasi paling berkuasa dalam sejarah empayar.

Namun, penubuhan pasukan tersebut juga mewujudkan satu kumpulan yang mempunyai kuasa besar tanpa pengawasan awam.

Legasinya kelak akan memainkan peranan penting dalam sejarah Era Baharu.`
    },
    {
      id: "REK-013", folder: "BHG-III",
      title: "KEMUNCULAN THE VANGUARD",
      classification: "", reference: "", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-013.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Kemunculan The Vanguard.",
      updated: null, attachments: [],
      content: `Selepas beberapa dekad pemerintahan, penentangan terhadap Martod semakin meningkat.

Sekumpulan individu mula membentuk gerakan rahsia yang dikenali sebagai The Vanguard.

Mereka terdiri daripada bekas pegawai empayar, pemimpin masyarakat, pejuang dan individu yang menuntut kebebasan politik.

Antara tokoh penting gerakan tersebut ialah Arven, bekas panglima Martod.

Mereka percaya bahawa keamanan yang diwujudkan oleh Martod telah mengorbankan kebebasan manusia.

The Vanguard mula melancarkan operasi bagi melemahkan struktur pemerintahan empayar.

Martod berjaya menumpaskan sebahagian besar pemberontakan.

Namun, konflik tersebut memberikan kesan mendalam terhadap pemikirannya.

Beliau mula menyedari bahawa sistem yang dibinanya terlalu bergantung kepada dirinya sendiri.`
    },
    {
      id: "REK-014", folder: "BHG-III",
      title: "KEJATUHAN SANG PENGUASA",
      classification: "", reference: "PE-001", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-014.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Kejatuhan Sang Penguasa.",
      updated: null, attachments: [],
      content: `Dalam pertempuran terakhir, Martod berhadapan dengan Arven, bekas panglimanya sendiri.

Arven menyatakan bahawa Martod telah berjaya menyatukan dunia tetapi gagal memahami bahawa dunia bukan milik seorang manusia.

Martod akhirnya menyedari bahawa perjuangannya untuk menghapuskan peperangan telah menjadikannya sebahagian daripada masalah yang pernah ditentangnya.

Selepas konflik tersebut, Martod membuat keputusan yang mengejutkan.

Beliau membubarkan Empayar Dunia.

Legion Hitam dibubarkan.

Pengawal Abadi kehilangan kedudukan rasmi mereka.

Kuasa pemerintahan dikembalikan kepada kerajaan-kerajaan wilayah.

Sebelum meninggalkan takhtanya, Martod menyampaikan satu kenyataan:

> "Aku mengambil dunia daripada tangan mereka yang merosakkannya. Tetapi mungkin sudah tiba masanya dunia belajar menjaganya sendiri."

Selepas itu, Martod menghilangkan diri.

Tiada rekod rasmi mengenai lokasi terakhirnya.

Empayar yang pernah menguasai seluruh dunia akhirnya berakhir.`
    },
    {
      id: "REK-015", folder: "BHG-IV",
      title: "DUNIA TANPA RAJA",
      classification: "", reference: "", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "Tempoh: 100 Tahun Selepas Kejatuhan Empayar",
      image: null, imagePath: "images/rekod-015.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Dunia Tanpa Raja.",
      updated: null, attachments: [],
      content: `Selepas kejatuhan Empayar Dunia Martod, dunia dibahagikan kepada beberapa negara merdeka.

Pada mulanya, sistem baharu disambut sebagai kemenangan kebebasan.

Namun, keamanan tidak bertahan lama.

Persaingan politik kembali berlaku.

Konflik sempadan meningkat.

Teknologi peninggalan Martod mula digunakan untuk tujuan ketenteraan.

Sebahagian masyarakat mula merindui kestabilan yang pernah diwujudkan oleh empayar.

Nama Martod kembali menjadi perdebatan antarabangsa.

Ada yang menganggapnya sebagai diktator.

Ada yang menganggapnya sebagai penyelamat.

Tiada satu pun pandangan berjaya mendominasi penilaian sejarahnya.`
    },
    {
      id: "REK-016", folder: "BHG-IV",
      title: "PENEMUAN MAHKOTA HITAM",
      classification: "", reference: "ARK-001", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "Lokasi: Runtuhan Ibu Kota Lama\nIndividu: Kaien Voss",
      image: null, imagePath: "images/rekod-016.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Penemuan Mahkota Hitam.",
      updated: null, attachments: [],
      content: `Pada tahun ke-100 selepas kejatuhan empayar, seorang pemuda bernama Kaien Voss menemui sebuah bilik rahsia di bawah runtuhan ibu kota Martod.

Di dalamnya terdapat beberapa artifak:

- Catatan terakhir Martod.
- Senjata legenda Legion Hitam.
- Rekod sulit Pengawal Abadi.
- Mahkota hitam yang pernah dimiliki Martod.

Apabila Kaien menyentuh mahkota tersebut, satu rakaman hologram diaktifkan.

**Petikan Rakaman Martod:**

> "Kepada sesiapa yang menemui peninggalan ini, dunia tidak akan selamanya berada dalam keamanan."

Penemuan tersebut menarik perhatian beberapa organisasi rahsia.

Salah satunya ialah Ordo Abadi.`
    },
    {
      id: "REK-017", folder: "BHG-IV",
      title: "KEBANGKITAN ORDO ABADI",
      classification: "", reference: "OA-001", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "Ketua: Lord Veyron",
      image: null, imagePath: "images/rekod-017.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Kebangkitan Ordo Abadi.",
      updated: null, attachments: [],
      content: `Ordo Abadi dipercayai terdiri daripada keturunan Pengawal Abadi.

Organisasi tersebut mempunyai matlamat untuk mengembalikan sistem pemerintahan empayar.

Ketua mereka, Lord Veyron, percaya bahawa dunia telah melakukan kesilapan apabila membenarkan Martod meninggalkan takhta.

Beliau menganggap dirinya sebagai pewaris sebenar legasi Martod.

Dalam satu ucapan sulit, Veyron menyatakan:

> "Martod tidak gagal kerana pemerintahannya terlalu kuat. Dia gagal kerana dunia tidak mempunyai pengganti yang layak."

Ordo Abadi mula mengumpulkan teknologi lama dan membina kekuatan ketenteraan.`
    },
    {
      id: "REK-018", folder: "BHG-IV",
      title: "PENUBUHAN PENJAGA FAJAR",
      classification: "", reference: "PF-001", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-018.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Penubuhan Penjaga Fajar.",
      updated: null, attachments: [],
      content: `Sebagai tindak balas terhadap Ordo Abadi, sebuah kumpulan baharu ditubuhkan.

Kumpulan tersebut dikenali sebagai Penjaga Fajar.

Empat individu utama dikenal pasti:

**Kaien Voss** — pemuda yang menemui mahkota hitam dan memiliki akses kepada peninggalan Martod.

**Aria Solen** — pakar strategi dan teknologi ketenteraan.

**Ryn Calder** — bekas anggota Ordo Abadi yang berpaling tadah.

**Dr. Elian Marek** — saintis yang mengkaji teknologi peninggalan Empayar Martod.

Matlamat mereka adalah menghalang kebangkitan pemerintahan mutlak.

Mereka percaya bahawa dunia tidak memerlukan seorang raja baharu.`
    },
    {
      id: "REK-019", folder: "BHG-IV",
      title: "PROTOKOL MARTOD",
      classification: "", reference: "PM-001", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "Pencipta: Martod",
      image: null, imagePath: "images/rekod-019.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Protokol Martod.",
      updated: null, attachments: [],
      content: `Penyelidikan Dr. Elian Marek terhadap mahkota hitam menemukan sebuah sistem tersembunyi bernama Protokol Martod.

Sistem tersebut dipercayai dibangunkan sebelum Martod meninggalkan takhtanya.

Protokol tersebut direka untuk bertindak balas apabila dunia mencapai tahap ketidakstabilan yang kritikal.

Lebih mengejutkan, sistem tersebut mengenal pasti Kaien sebagai individu yang layak menerima akses.

Protokol tersebut turut menyimpan rekod memori Martod.

Setiap keputusan.

Setiap kemenangan.

Setiap kesilapan.

Dalam salah satu rakaman, Martod menyampaikan pesanan:

> "Dunia tidak memerlukan seorang raja baharu. Ia memerlukan seseorang yang memahami mengapa seorang raja harus berhenti memerintah."`
    },
    {
      id: "REK-020", folder: "BHG-IV",
      title: "KEBANGKITAN EMPAYAR NOVA",
      classification: "", reference: "EN-001", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "Pengasas: Lord Veyron",
      image: null, imagePath: "images/rekod-020.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Kebangkitan Empayar Nova.",
      updated: null, attachments: [],
      content: `Selepas memperoleh sebahagian teknologi peninggalan Martod, Lord Veyron mengisytiharkan penubuhan Empayar Nova.

Empayar tersebut mempunyai sistem ketenteraan yang lebih maju berbanding kerajaan lain.

Antara keupayaannya ialah:

- Sistem pengawasan global.
- Persenjataan automatik.
- Rangkaian pertahanan udara.
- Teknologi komunikasi ketenteraan.
- Sistem kawalan pusat bersepadu.

Veyron mengisytiharkan dirinya sebagai pewaris sah Empayar Dunia Martod.

Namun, Empayar Nova bukanlah sebuah empayar yang dibina atas dasar penyatuan.

Ia dibina atas dasar penguasaan mutlak.`
    },
    {
      id: "REK-021", folder: "BHG-IV",
      title: "PERANG WARISAN",
      classification: "", reference: "PW-001", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-021.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Perang Warisan.",
      updated: null, attachments: [],
      content: `Lord Veyron melancarkan operasi ketenteraan besar-besaran bagi mendapatkan semua artifak peninggalan Martod.

Penjaga Fajar menjadi penghalang utama kepada rancangan tersebut.

Beberapa bandar utama jatuh ke tangan Empayar Nova.

Teknologi ketenteraan purba digunakan semula.

Kemudahan penyelidikan dimusnahkan.

Perang Warisan menjadi konflik terbesar sejak kejatuhan Empayar Dunia.

Dalam tempoh tersebut, Kaien mula mengakses memori Martod melalui mahkota hitam.

Beliau menyaksikan keseluruhan perjalanan hidup Sang Penguasa Dunia.

Daripada seorang anak kampung yang kehilangan keluarganya kepada pemerintah yang menyatukan dunia.

Namun, beliau turut menyaksikan kesilapan yang dilakukan oleh Martod.`
    },
    {
      id: "REK-022", folder: "BHG-IV",
      title: "PERTEMPURAN TERAKHIR",
      classification: "", reference: "", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "Lokasi: Ibu Kota Lama Martod\nPihak Terlibat: Empayar Nova dan Penjaga Fajar",
      image: null, imagePath: "images/rekod-022.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Pertempuran Terakhir.",
      updated: null, attachments: [],
      content: `Pertempuran terakhir berlaku di lokasi yang pernah menjadi pusat pemerintahan Martod.

Kaien berhadapan secara langsung dengan Lord Veyron.

Veyron menawarkan peluang kepada Kaien untuk menyertai Empayar Nova dan menjadi pemerintah kedua tertinggi.

Tawaran tersebut ditolak.

Dalam pertempuran tersebut, Kaien berjaya mengaktifkan Protokol Martod.

Dengan bantuan Penjaga Fajar, sistem utama Empayar Nova dimusnahkan.

Lord Veyron kehilangan kuasa pemerintahannya.

Empayar Nova akhirnya tumbang.

Mahkota hitam dilaporkan musnah dalam pertempuran.

Kaien kemudiannya menolak sebarang tawaran untuk menjadi pemerintah dunia.`
    },
    {
      id: "REK-023", folder: "BHG-V",
      title: "DUNIA ERA BAHARU",
      classification: "", reference: "", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-023.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Dunia Era Baharu.",
      updated: null, attachments: [],
      content: `Selepas Perang Warisan, kerajaan-kerajaan dunia bersetuju membentuk satu sistem kerjasama antarabangsa.

Berbeza dengan Empayar Dunia Martod, sistem baharu tidak meletakkan kuasa mutlak di tangan seorang individu.

Setiap negara diberikan hak untuk mentadbir wilayah masing-masing.

Penjaga Fajar secara rasmi dibubarkan sebagai organisasi ketenteraan.

Kaien Voss menghilangkan diri daripada perhatian umum.

Dunia memasuki era baharu yang lebih stabil.

Namun, satu persoalan masih belum terjawab.

Apakah yang sebenarnya berlaku kepada Martod selepas meninggalkan takhtanya?`
    },
    {
      id: "REK-024", folder: "BHG-V",
      title: "PROTOKOL KEDUA",
      classification: "RAHSIA BESAR", reference: "MU-002-Ω", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "Klasifikasi Asal: SULIT TAHAP MAKSIMUM",
      image: null, imagePath: "images/rekod-024.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Protokol Kedua.",
      updated: null, attachments: [],
      content: `Beberapa bulan selepas Perang Warisan, sebuah pusat penyelidikan mengesan isyarat elektronik daripada serpihan mahkota hitam.

Walaupun mahkota tersebut dilaporkan telah musnah, sistem di dalamnya masih menunjukkan aktiviti.

Apabila isyarat dianalisis, satu mesej muncul:

**PROTOKOL KEDUA DIAKTIFKAN.**

Diikuti satu lagi kenyataan:

> "Martod bukan satu-satunya yang pernah memerintah dunia."

Penemuan tersebut menyebabkan penyiasatan baharu dilancarkan.

Protokol Kedua kemudiannya dikenal pasti sebagai sistem penyimpanan sejarah yang dicipta oleh Martod.

Ia mengandungi rekod yang tidak pernah dimasukkan ke dalam arkib rasmi empayar.

Termasuk lokasi terakhir Martod.`
    },
    {
      id: "REK-025", folder: "BHG-V",
      title: "LOKASI TERAKHIR MARTOD",
      classification: "", reference: "", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-025.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Lokasi Terakhir Martod.",
      updated: null, attachments: [],
      content: `Hasil penyiasatan terhadap Protokol Kedua membawa kepada penemuan sebuah kawasan terpencil di utara Arkhadia.

Lokasi tersebut dikenali sebagai Lembah Aras.

Di sana, Martod dipercayai telah membina sebuah kediaman kecil selepas meninggalkan takhta.

Tiada pengawal.

Tiada tentera.

Tiada simbol pemerintahan.

Martod menghabiskan baki kehidupannya sebagai manusia biasa.

Beliau tidak pernah kembali ke ibu kota.

Beliau tidak pernah menghubungi bekas panglimanya.

Beliau tidak pernah meminta dunia mengembalikan takhtanya.`
    },
    {
      id: "REK-026", folder: "BHG-V",
      title: "CATATAN TERAKHIR SANG PENGUASA",
      classification: "", reference: "", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-026.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Catatan Terakhir Sang Penguasa.",
      updated: null, attachments: [],
      content: `Sebuah jurnal dipercayai milik Martod ditemukan di dalam kediamannya.

Catatan terakhir bertarikh beberapa hari sebelum kematiannya.

Petikan jurnal:

> "Aku pernah percaya bahawa keamanan hanya boleh dicapai melalui kuasa."
>
> "Aku pernah percaya bahawa dunia memerlukan seorang pemimpin yang tidak boleh dikalahkan."
>
> "Namun, semakin lama aku memerintah, semakin aku memahami bahawa manusia tidak boleh dipaksa untuk menjadi baik."
>
> "Aku telah menyatukan dunia, tetapi aku tidak pernah benar-benar menyatukan hati manusia."
>
> "Jika sejarah mengingati aku, biarlah ia mengingati kesilapanku juga."

Jurnal tersebut merupakan antara bukti paling penting mengenai pemikiran Martod selepas meninggalkan pemerintahan.`
    },
    {
      id: "REK-027", folder: "BHG-V",
      title: "KEMATIAN MARTOD",
      classification: "", reference: "", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "Lokasi: Lembah Aras\nStatus: Disahkan Melalui Rekod Peribadi",
      image: null, imagePath: "images/rekod-027.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Kematian Martod.",
      updated: null, attachments: [],
      content: `Martod dipercayai meninggal dunia akibat usia tua.

Tiada rekod pembunuhan.

Tiada rekod peperangan.

Tiada rekod pengkhianatan.

Beliau meninggal dunia di kediamannya sendiri.

Penduduk berhampiran hanya mengetahui tentang kematiannya beberapa minggu kemudian.

Martod dikebumikan di sebuah bukit kecil tanpa nama.

Tiada makam diraja dibina.

Tiada monumen didirikan.

Tiada pengumuman rasmi dikeluarkan.

Manusia yang pernah menguasai seluruh dunia akhirnya meninggal dunia tanpa sebarang kemegahan.

Identitinya hanya diketahui melalui dokumen yang ditinggalkan.`
    },
    {
      id: "REK-028", folder: "BHG-V",
      title: "SURAT TERAKHIR MARTOD",
      classification: "", reference: "", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-028.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Surat Terakhir Martod.",
      updated: null, attachments: [],
      content: `Di dalam sebuah peti besi, penyelidik menemukan satu surat yang tidak pernah dihantar.

Surat tersebut ditujukan kepada seluruh umat manusia.

### KANDUNGAN SURAT

**Kepada dunia yang akan datang,**

Jika surat ini ditemukan, bermakna aku telah tiada.

Aku pernah menjadi seorang anak yang kehilangan segala-galanya akibat peperangan.

Aku membesar dengan kebencian terhadap raja-raja yang membiarkan rakyat mereka menderita.

Aku berjanji untuk mengubah dunia.

Dan aku melakukannya.

Aku menumbangkan tujuh kerajaan.

Aku menyatukan seluruh dunia.

Aku membina empayar yang tidak pernah dibayangkan oleh manusia sebelumnya.

Namun, aku juga melakukan kesilapan.

Aku percaya bahawa keamanan boleh dipaksakan.

Aku percaya bahawa manusia akan berhenti berperang jika mereka tidak mempunyai pilihan.

Aku salah.

Dunia tidak memerlukan seorang manusia yang memegang semua kuasa.

Dunia memerlukan manusia yang berani mempertanggungjawabkan kuasa mereka.

Jangan bina empayar atas nama aku.

Jangan berperang demi mempertahankan nama aku.

Jangan jadikan aku alasan untuk menindas orang lain.

Jika aku pernah menjadi penyelamat, ingatlah apa yang aku lakukan.

Jika aku pernah menjadi penindas, ingatlah apa yang aku lakukan.

Jangan pilih untuk mengingati hanya satu sisi sejarah.

**Aku ialah Martod.**

**Aku pernah menguasai dunia.**

**Tetapi dunia tidak pernah menjadi milik aku.**

— Martod`
    },
    {
      id: "REK-029", folder: "BHG-V",
      title: "PEMBUBARAN PROTOKOL",
      classification: "", reference: "", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-029.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Pembubaran Protokol.",
      updated: null, attachments: [],
      content: `Selepas penemuan surat terakhir, Kaien Voss dan bekas anggota Penjaga Fajar membuat keputusan untuk menamatkan semua sistem peninggalan Martod yang berpotensi digunakan bagi membentuk pemerintahan mutlak.

Protokol Kedua dimatikan.

Rekod ketenteraan sulit diserahkan kepada arkib antarabangsa.

Teknologi berbahaya dimusnahkan.

Mahkota hitam tidak dibina semula.

Keputusan tersebut menandakan berakhirnya segala usaha untuk menghidupkan semula Empayar Dunia Martod.

Buat pertama kalinya, dunia bersetuju bahawa legasi Martod perlu dipelihara sebagai sejarah, bukannya digunakan untuk memperoleh kuasa.`
    },
    {
      id: "REK-030", folder: "BHG-V",
      title: "PENGISYTIHARAN ARKIB DUNIA",
      classification: "", reference: "", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-030.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Pengisytiharan Arkib Dunia.",
      updated: null, attachments: [],
      content: `Seratus tahun selepas kejatuhan Empayar Dunia Martod, Majlis Sejarah Antarabangsa mengeluarkan pengisytiharan rasmi mengenai kedudukan Martod dalam sejarah manusia.

Beliau diiktiraf sebagai salah satu tokoh paling berpengaruh dalam sejarah dunia.

Sebuah pusat arkib dibina di lokasi bekas ibu kota empayarnya.

Segala rekod mengenai kehidupannya dikumpulkan dan disimpan untuk generasi akan datang.

Di pintu masuk utama pusat arkib tersebut, satu inskripsi diukir:

> "Seorang manusia pernah menyatukan dunia.
>
> Seorang manusia juga akhirnya memahami bahawa dunia tidak sepatutnya dimiliki oleh sesiapa."

Tiada lagi kerajaan menggunakan nama Martod sebagai alasan untuk menakluk wilayah lain.

Tiada lagi organisasi mengaku sebagai pewaris sah empayarnya.

Tiada lagi usaha menghidupkan semula pemerintahan mutlak.

Sejarah Martod akhirnya ditutup.`
    },
    {
      id: "REK-031", folder: "BHG-VI",
      label: "REKOD AKHIR",
      title: "Pengakhiran Sang Penguasa Dunia",
      classification: "ARKIB AWAM", reference: "MU-FINAL", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "Status: SEJARAH LENGKAP\nSambungan: TIADA",
      image: null, imagePath: "images/rekod-031.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Pengakhiran Sang Penguasa Dunia.",
      updated: null, attachments: [],
      content: `Martod Universe bermula dengan seorang anak yang kehilangan keluarganya akibat peperangan.

Ia berkembang menjadi kisah kebangkitan seorang panglima.

Kemudian menjadi sejarah penaklukan tujuh kerajaan.

Seterusnya, penyatuan seluruh dunia.

Dan akhirnya, kisah seorang pemerintah yang memilih untuk meninggalkan kuasa.

Martod pernah menjadi manusia paling berkuasa di dunia.

Beliau membina empayar yang tidak pernah wujud sebelumnya.

Beliau mengubah sistem pemerintahan, ekonomi dan ketenteraan.

Namun, beliau juga melakukan kesilapan yang memberikan kesan kepada generasi selepasnya.

Seratus tahun selepas kejatuhan empayarnya, dunia masih mengingati namanya.

Seratus tahun selepas kematiannya, legasinya masih menjadi bahan kajian.

Tetapi tiada lagi mahkota.

Tiada lagi Legion Hitam.

Tiada lagi Empayar Dunia.

Hanya tinggal sejarah.`
    },
    {
      id: "REK-032", folder: "BHG-EP",
      label: "EPILOG",
      title: "CATATAN TERAKHIR PENYIMPAN ARKIB",
      classification: "", reference: "MU-COMPLETE-001", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "Tarikh Penutupan: Tidak Dinyatakan",
      image: null, imagePath: "images/rekod-032.jpg", imageCaption: "Ilustrasi asal untuk arkib ini: Catatan Terakhir Penyimpan Arkib.",
      updated: null, attachments: [],
      content: `"Sepanjang sejarah manusia, ramai pemerintah telah dilahirkan.

Ada yang memerintah melalui kekayaan.

Ada yang memerintah melalui keturunan.

Ada yang memerintah melalui kekuatan tentera.

Tetapi hanya seorang yang pernah menyatukan seluruh dunia di bawah satu nama.

Kami telah mencari seorang raja.

Kami telah menemukan seorang penakluk.

Kami telah mengkaji seorang pemerintah.

Tetapi pada akhirnya, kami menemukan seorang manusia.

Namanya Martod.

Beliau pernah menguasai dunia.

Beliau pernah kehilangan dunia.

Dan akhirnya, beliau memilih untuk melepaskannya."`
    },
    {
      id: "REK-033", folder: "BHG-EP",
      label: "TAMAT",
      title: "MARTOD: SANG PENGUASA DUNIA",
      classification: "", reference: "", date: "", author: "Jabatan Arkib Sejarah Dunia", subject: "",
      extra: "",
      image: null, imagePath: "images/rekod-033.jpg", imageCaption: "Foto Martod yang dibekalkan oleh pemilik arkib.",
      updated: null, attachments: [],
      content: `**MARTOD UNIVERSE**
**SEJARAH KEBANGKITAN, KEJATUHAN DAN PENGAKHIRAN**

**STATUS: COMPLETE**

**END OF ARCHIVE.**

*Tiada fail sambungan dijadualkan.*

*Tiada rekod baharu dijangka.*

*Sejarah Martod ditutup buat selama-lamanya.*`
    }
  ],

  /* ---- FAIL KONFLIK ---- */
  investigations: [
    { id: "KFL-001", title: "V-017 · PERTEMPURAN VALORIA", classification: "", status: "DITUTUP", lead: "Dravosk lawan Valtherion", opened: "", relatedDocs: "REK-002, REK-003", summary: "Kerajaan Dravosk melancarkan serangan besar terhadap Valtherion dan memusnahkan beberapa bandar, termasuk Valoria. Keputusan: Kekalahan Valtherion.", imagePath: "images/konflik-001.jpg", updated: null },
    { id: "KFL-002", title: "V-021 · KEJATUHAN VALTHERION", classification: "", status: "DITUTUP", lead: "Legion Hitam lawan Raja Aldric", opened: "11 hari", relatedDocs: "REK-005", summary: "Legion Hitam menguasai istana, pusat pentadbiran dan kemudahan ketenteraan ibu kota dalam tempoh 11 hari. Raja Aldric ditangkap dan Valtherion menjadi wilayah pertama di bawah penguasaan Martod.", imagePath: "images/konflik-002.jpg", updated: null },
    { id: "KFL-003", title: "PERANG TIGA KERAJAAN", classification: "", status: "DITUTUP", lead: "Dravosk, Solmera dan Kharveth lawan Legion Hitam", opened: "Enam tahun", relatedDocs: "REK-006", summary: "Peperangan berlangsung enam tahun. Solmera menarik diri selepas perjanjian perdagangan, Kharveth kalah besar dan Dravosk kehilangan sebahagian wilayah industrinya.", imagePath: "images/konflik-003.jpg", updated: null },
    { id: "KFL-004", title: "AA-001 · PERTEMPURAN AGUNG ARKHADIA", classification: "", status: "DITUTUP", lead: "Pakatan Tujuh Kerajaan lawan Martod", opened: "47 hari", relatedDocs: "REK-007, REK-008", summary: "Peperangan terbesar sepanjang sejarah penaklukan Martod. Pada hari ke-31 Noveria meninggalkan medan perang, pada hari ke-38 Kharveth kehilangan pusat komando dan pada hari ke-47 seluruh pakatan kalah. Keputusan: Kemenangan Martod.", imagePath: "images/konflik-004.jpg", updated: null },
    { id: "KFL-005", title: "PE-001 · KEJATUHAN SANG PENGUASA", classification: "", status: "DITUTUP", lead: "Martod lawan Arven", opened: "", relatedDocs: "REK-013, REK-014", summary: "Dalam pertempuran terakhir, Martod berhadapan dengan Arven, bekas panglimanya. Selepas itu Martod membubarkan Empayar Dunia dan Legion Hitam, dan Pengawal Abadi kehilangan kedudukan rasmi mereka.", imagePath: "images/konflik-005.jpg", updated: null },
    { id: "KFL-006", title: "PW-001 · PERANG WARISAN", classification: "", status: "DITUTUP", lead: "Empayar Nova lawan Penjaga Fajar", opened: "", relatedDocs: "REK-021, REK-022", summary: "Lord Veyron melancarkan operasi besar-besaran untuk mendapatkan semua artifak peninggalan Martod. Pertempuran terakhir berlaku di Ibu Kota Lama Martod; Kaien mengaktifkan Protokol Martod dan Empayar Nova tumbang.", imagePath: "images/konflik-006.jpg", updated: null }
  ],

  /* ---- KERAJAAN & PERTUBUHAN ---- */
  reports: [
    { id: "ORG-001", title: "VALTHERION", classification: "", reference: "", author: "Kerajaan (Tujuh Kerajaan)", subject: "Raja Aldric", relatedDocs: "REK-001, REK-002, REK-005", content: "Kekuatan utama: tentera darat. Tempat kelahiran Martod. Raja Aldric ditangkap apabila Legion Hitam menawan ibu kota, dan Valtherion menjadi wilayah pertama di bawah penguasaan Martod.", imagePath: "images/org-001.jpg", updated: null },
    { id: "ORG-002", title: "SOLMERA", classification: "", reference: "", author: "Kerajaan (Tujuh Kerajaan)", subject: "Ratu Seraphine", relatedDocs: "REK-001, REK-006, REK-009", content: "Kekuatan utama: teknologi dan perdagangan. Menarik diri daripada pakatan menentang Martod selepas mencapai perjanjian perdagangan; kemudian mengekalkan sebahagian teknologi dan institusinya tetapi menerima penguasaan politik Martod.", imagePath: "images/org-002.jpg", updated: null },
    { id: "ORG-003", title: "DRAVOSK", classification: "", reference: "", author: "Kerajaan (Tujuh Kerajaan)", subject: "Raja Kaelor", relatedDocs: "REK-001, REK-003, REK-006, REK-009", content: "Kekuatan utama: industri dan persenjataan. Melancarkan serangan yang memusnahkan Valoria; kemudian kehilangan sebahagian wilayah industrinya dan akhirnya kehilangan kuasa pemerintahan.", imagePath: "images/org-003.jpg", updated: null },
    { id: "ORG-004", title: "ERYNDOR", classification: "", reference: "", author: "Kerajaan (Tujuh Kerajaan)", subject: "Raja Theron", relatedDocs: "REK-001, REK-009", content: "Kekuatan utama: armada laut. Menyerahkan armada lautnya kepada Martod.", imagePath: "images/org-004.jpg", updated: null },
    { id: "ORG-005", title: "NOVERIA", classification: "", reference: "", author: "Kerajaan (Tujuh Kerajaan)", subject: "Maharaja Lucien", relatedDocs: "REK-001, REK-008, REK-009", content: "Kekuatan utama: kekayaan dan diplomasi. Tenteranya meninggalkan medan Pertempuran Agung Arkhadia pada hari ke-31; kemudian membuka pusat perdagangannya kepada sistem pentadbiran Martod.", imagePath: "images/org-005.jpg", updated: null },
    { id: "ORG-006", title: "KHARVETH", classification: "", reference: "", author: "Kerajaan (Tujuh Kerajaan)", subject: "Raja Malrec", relatedDocs: "REK-001, REK-006, REK-008, REK-009", content: "Kekuatan utama: pasukan elit. Mengalami kekalahan besar dalam Perang Tiga Kerajaan, kehilangan pusat komando pada hari ke-38 dan akhirnya kehilangan kuasa pemerintahan.", imagePath: "images/org-006.jpg", updated: null },
    { id: "ORG-007", title: "ASTERION", classification: "", reference: "", author: "Kerajaan (Tujuh Kerajaan)", subject: "Raja Edric", relatedDocs: "REK-001, REK-009", content: "Kekuatan utama: sumber tenaga dan pertanian. Menerima pemerintahan baharu melalui perjanjian pengagihan sumber.", imagePath: "images/org-007.jpg", updated: null },
    { id: "ORG-008", title: "LEGION HITAM", classification: "", reference: "", author: "Pertubuhan ketenteraan", subject: "Martod", relatedDocs: "REK-003, REK-004, REK-010, REK-014", content: "Bermula dengan kira-kira 3,000 anggota daripada bekas tentera, pahlawan dan rakyat yang kehilangan tempat tinggal. Kenaikan pangkat berdasarkan kebolehan dan kesetiaan, bukan keturunan. Mengutamakan risikan, serangan pantas, penyamaran dan penguasaan laluan bekalan. Menjadi pasukan ketenteraan utama empayar dan dibubarkan apabila Martod membubarkan Empayar Dunia.", imagePath: "images/org-008.jpg", updated: null },
    { id: "ORG-009", title: "PAKATAN TUJUH KERAJAAN", classification: "", reference: "", author: "Pakatan ketenteraan", subject: "", relatedDocs: "REK-007, REK-008", content: "Dibentuk oleh semua kerajaan utama dengan matlamat menghapuskan kekuatan Martod. Jumlah tenteranya dipercayai melebihi 800,000 anggota, tetapi pakatan itu dibina atas dasar ketakutan, bukan kepercayaan, dan kalah dalam Pertempuran Agung Arkhadia.", imagePath: "images/org-009.jpg", updated: null },
    { id: "ORG-010", title: "PENGAWAL ABADI", classification: "", reference: "", author: "Pasukan elit", subject: "Martod", relatedDocs: "REK-012, REK-014, REK-016", content: "Pasukan elit yang ditubuhkan untuk melindungi pemerintah, menjaga ibu kota, mengawal artifak dan teknologi sulit, menumpaskan ancaman dan memastikan kestabilan pemerintahan. Kehilangan kedudukan rasmi selepas Martod membubarkan empayar.", imagePath: "images/org-010.jpg", updated: null },
    { id: "ORG-011", title: "THE VANGUARD", classification: "", reference: "", author: "Gerakan rahsia", subject: "Arven (tokoh penting)", relatedDocs: "REK-013, REK-014", content: "Gerakan penentang yang terdiri daripada bekas pegawai empayar, pemimpin masyarakat, pejuang dan individu yang menuntut kebebasan politik. Percaya bahawa keamanan Martod telah mengorbankan kebebasan manusia.", imagePath: "images/org-011.jpg", updated: null },
    { id: "ORG-012", title: "ORDO ABADI", classification: "", reference: "OA-001", author: "Organisasi rahsia", subject: "Lord Veyron", relatedDocs: "REK-016, REK-017, REK-020", content: "Dipercayai terdiri daripada keturunan Pengawal Abadi. Bermatlamat mengembalikan sistem pemerintahan empayar dan mula mengumpulkan teknologi lama serta membina kekuatan ketenteraan.", imagePath: "images/org-012.jpg", updated: null },
    { id: "ORG-013", title: "PENJAGA FAJAR", classification: "", reference: "PF-001", author: "Pertubuhan", subject: "Kaien Voss, Aria Solen, Ryn Calder, Dr. Elian Marek", relatedDocs: "REK-018, REK-021, REK-022, REK-023", content: "Ditubuhkan sebagai tindak balas terhadap Ordo Abadi dengan matlamat menghalang kebangkitan pemerintahan mutlak. Dibubarkan secara rasmi sebagai organisasi ketenteraan selepas Perang Warisan.", imagePath: "images/org-013.jpg", updated: null },
    { id: "ORG-014", title: "EMPAYAR NOVA", classification: "", reference: "EN-001", author: "Empayar", subject: "Lord Veyron (pengasas)", relatedDocs: "REK-020, REK-021, REK-022", content: "Diisytiharkan oleh Lord Veyron sebagai pewaris sah Empayar Dunia Martod. Memiliki sistem pengawasan global, persenjataan automatik, rangkaian pertahanan udara, teknologi komunikasi ketenteraan dan sistem kawalan pusat bersepadu. Dibina atas dasar penguasaan mutlak dan tumbang dalam pertempuran terakhir.", imagePath: "images/org-014.jpg", updated: null }
  ],

  /* ---- GALERI ARTIFAK ----
     type: gambar | peta | imbasan | audio | video | lain */
  evidence: [
    { id: "ART-001", type: "lain", title: "MAHKOTA HITAM", classification: "", date: "", source: "Runtuhan Ibu Kota Lama · Rekod 016", description: "Mahkota hitam yang pernah dimiliki Martod. Apabila disentuh oleh Kaien, rakaman hologram diaktifkan. Dilaporkan musnah dalam pertempuran terakhir.", file: null, imagePath: "images/artifak-001.jpg", updated: null },
    { id: "ART-002", type: "lain", title: "SENJATA LEGENDA LEGION HITAM", classification: "", date: "", source: "Runtuhan Ibu Kota Lama · Rekod 016", description: "Salah satu artifak yang ditemui dalam bilik rahsia di bawah runtuhan ibu kota.", file: null, imagePath: "images/artifak-002.jpg", updated: null },
    { id: "ART-003", type: "imbasan", title: "CATATAN TERAKHIR MARTOD", classification: "", date: "", source: "Runtuhan Ibu Kota Lama · Rekod 016", description: "Salah satu artifak yang ditemui dalam bilik rahsia di bawah runtuhan ibu kota.", file: null, imagePath: "images/artifak-003.jpg", updated: null },
    { id: "ART-004", type: "imbasan", title: "REKOD SULIT PENGAWAL ABADI", classification: "", date: "", source: "Runtuhan Ibu Kota Lama · Rekod 016", description: "Salah satu artifak yang ditemui dalam bilik rahsia di bawah runtuhan ibu kota.", file: null, imagePath: "images/artifak-004.jpg", updated: null },
    { id: "ART-005", type: "video", title: "RAKAMAN HOLOGRAM MARTOD", classification: "", date: "", source: "Mahkota hitam · Rekod 016", description: "Diaktifkan apabila Kaien menyentuh mahkota hitam.", file: null, imagePath: "images/artifak-005.jpg", updated: null },
    { id: "ART-006", type: "imbasan", title: "JURNAL MARTOD", classification: "", date: "", source: "Lembah Aras · Rekod 026", description: "Jurnal yang dipercayai milik Martod, ditemukan di dalam kediamannya. Catatan terakhirnya bertarikh beberapa hari sebelum kematiannya.", file: null, imagePath: "images/artifak-006.jpg", updated: null },
    { id: "ART-007", type: "imbasan", title: "SURAT TERAKHIR MARTOD", classification: "", date: "", source: "Peti besi di Lembah Aras · Rekod 028", description: "Surat yang tidak pernah dihantar, ditujukan kepada seluruh umat manusia.", file: null, imagePath: "images/artifak-007.jpg", updated: null },
    { id: "ART-008", type: "gambar", title: "INSKRIPSI PUSAT ARKIB", classification: "", date: "", source: "Pintu masuk utama pusat arkib · Rekod 030", description: "Inskripsi yang diukir di pintu masuk utama pusat arkib yang dibina di lokasi bekas ibu kota empayar.", file: null, imagePath: "images/artifak-008.jpg", updated: null },
    { id: "ART-009", type: "peta", title: "PETA TUJUH KERAJAAN (ILUSTRASI)", classification: "", date: "", source: "Lukisan ilustrasi untuk arkib ini", description: "Peta hiasan yang menunjukkan Tujuh Kerajaan secara kasar. Cerita asal tidak mengandungi peta; gambar ini dilukis khas untuk arkib dan boleh diganti dengan peta anda sendiri.", file: null, imagePath: "images/artifak-009.jpg", updated: null }
  ],

  /* ---- TOKOH ---- */
  personnel: [
    { id: "TKH-001", name: "MARTOD", role: "Panglima, pemerintah tertinggi dan Sang Penguasa Dunia", department: "Valtherion · Legion Hitam · Empayar Dunia", status: "Meninggal dunia akibat usia tua di Lembah Aras", relatedDocs: "REK-002, REK-003, REK-010, REK-014, REK-027, REK-028", notes: "Dilahirkan di kampung Valoria. Menyertai tentera Valtherion pada usia 17 tahun dan kemudian membentuk Legion Hitam. Menyatukan seluruh dunia, kemudian membubarkan empayarnya dan menghilangkan diri.", imagePath: "images/tokoh-001.jpg", updated: null },
    { id: "TKH-002", name: "RAJA ALDRIC", role: "Raja Valtherion", department: "Valtherion", status: "Ditangkap apabila ibu kota jatuh", relatedDocs: "REK-001, REK-005", notes: "Menolak tuntutan pembaharuan sistem pemerintahan.", imagePath: "images/tokoh-002.jpg", updated: null },
    { id: "TKH-003", name: "RATU SERAPHINE", role: "Ratu Solmera", department: "Solmera", status: "", relatedDocs: "REK-001", notes: "Kekuatan kerajaannya: teknologi dan perdagangan.", imagePath: "images/tokoh-003.jpg", updated: null },
    { id: "TKH-004", name: "RAJA KAELOR", role: "Raja Dravosk", department: "Dravosk", status: "", relatedDocs: "REK-001", notes: "Kekuatan kerajaannya: industri dan persenjataan.", imagePath: "images/tokoh-004.jpg", updated: null },
    { id: "TKH-005", name: "RAJA THERON", role: "Raja Eryndor", department: "Eryndor", status: "", relatedDocs: "REK-001", notes: "Kekuatan kerajaannya: armada laut.", imagePath: "images/tokoh-005.jpg", updated: null },
    { id: "TKH-006", name: "MAHARAJA LUCIEN", role: "Maharaja Noveria", department: "Noveria", status: "", relatedDocs: "REK-001", notes: "Kekuatan kerajaannya: kekayaan dan diplomasi.", imagePath: "images/tokoh-006.jpg", updated: null },
    { id: "TKH-007", name: "RAJA MALREC", role: "Raja Kharveth", department: "Kharveth", status: "", relatedDocs: "REK-001", notes: "Kekuatan kerajaannya: pasukan elit.", imagePath: "images/tokoh-007.jpg", updated: null },
    { id: "TKH-008", name: "RAJA EDRIC", role: "Raja Asterion", department: "Asterion", status: "", relatedDocs: "REK-001", notes: "Kekuatan kerajaannya: sumber tenaga dan pertanian.", imagePath: "images/tokoh-008.jpg", updated: null },
    { id: "TKH-009", name: "ARVEN", role: "Bekas panglima Martod; tokoh penting The Vanguard", department: "The Vanguard", status: "", relatedDocs: "REK-013, REK-014", notes: "Berhadapan dengan Martod dalam pertempuran terakhir dan menyatakan bahawa dunia bukan milik seorang manusia.", imagePath: "images/tokoh-009.jpg", updated: null },
    { id: "TKH-010", name: "KAIEN VOSS", role: "Pemuda penemu mahkota hitam", department: "Penjaga Fajar", status: "Menghilangkan diri daripada perhatian umum", relatedDocs: "REK-016, REK-018, REK-019, REK-021, REK-022, REK-023, REK-029", notes: "Menemui bilik rahsia di bawah runtuhan ibu kota Martod. Dikenal pasti oleh Protokol Martod sebagai individu yang layak menerima akses. Menolak tawaran Lord Veyron dan menolak menjadi pemerintah dunia.", imagePath: "images/tokoh-010.jpg", updated: null },
    { id: "TKH-011", name: "ARIA SOLEN", role: "Pakar strategi dan teknologi ketenteraan", department: "Penjaga Fajar", status: "", relatedDocs: "REK-018", notes: "", imagePath: "images/tokoh-011.jpg", updated: null },
    { id: "TKH-012", name: "RYN CALDER", role: "Bekas anggota Ordo Abadi yang berpaling tadah", department: "Penjaga Fajar", status: "", relatedDocs: "REK-018", notes: "", imagePath: "images/tokoh-012.jpg", updated: null },
    { id: "TKH-013", name: "DR. ELIAN MAREK", role: "Saintis", department: "Penjaga Fajar", status: "", relatedDocs: "REK-018, REK-019", notes: "Mengkaji teknologi peninggalan Empayar Martod dan menemukan Protokol Martod di dalam mahkota hitam.", imagePath: "images/tokoh-013.jpg", updated: null },
    { id: "TKH-014", name: "LORD VEYRON", role: "Ketua Ordo Abadi; pengasas Empayar Nova", department: "Ordo Abadi · Empayar Nova", status: "Kehilangan kuasa pemerintahan", relatedDocs: "REK-017, REK-020, REK-021, REK-022", notes: "Menganggap dirinya pewaris sebenar legasi Martod. Menawarkan Kaien jawatan pemerintah kedua tertinggi, tetapi ditolak.", imagePath: "images/tokoh-014.jpg", updated: null }
  ],

  /* ---- GARIS MASA (satu peristiwa bagi setiap Rekod 001-030) ----
     date = label masa / tempoh (teks bebas). Susunan dalam senarai = susunan paparan. */
  timeline: [
    { id: "EVT-001", date: "Sebelum Empayar Dunia", title: "DUNIA SEBELUM MARTOD", description: "Sebelum wujudnya Empayar Dunia Martod, dunia berada dalam keadaan politik yang tidak stabil. Tujuh kerajaan utama menguasai benua Arkhadia. Setiap kerajaan mempunyai pemerintah, tentera, sumber ekonomi dan sistem pentadbiran tersendiri.", relatedDocument: "REK-001", updated: null },
    { id: "EVT-002", date: "Usia 17 tahun menyertai tentera", title: "KELAHIRAN MARTOD", description: "Martod dilahirkan di sebuah kampung kecil bernama Valoria, di bawah pemerintahan Kerajaan Valtherion. Kehidupan awalnya sederhana. Beliau membesar dalam masyarakat yang sering berhadapan dengan ancaman peperangan.", relatedDocument: "REK-002", updated: null },
    { id: "EVT-003", date: "Selepas kekalahan Valtherion", title: "PERTEMPURAN VALORIA", description: "Kerajaan Dravosk melancarkan serangan besar terhadap Valtherion. Serangan tersebut mengakibatkan kemusnahan beberapa bandar, termasuk Valoria.", relatedDocument: "REK-003", updated: null },
    { id: "EVT-004", date: "Tiga tahun pertama Legion Hitam", title: "KEBANGKITAN LEGION HITAM", description: "Legion Hitam bermula dengan kira-kira 3,000 anggota. Pasukan tersebut terdiri daripada bekas tentera, pahlawan, rakyat yang kehilangan tempat tinggal dan individu yang tidak lagi mempercayai kerajaan lama.", relatedDocument: "REK-004", updated: null },
    { id: "EVT-005", date: "Operasi 11 hari", title: "KEJATUHAN VALTHERION", description: "Selepas memperoleh sokongan majoriti tentera, Martod kembali ke Valtherion untuk menentang pemerintahan Raja Aldric. Raja Aldric menolak tuntutan pembaharuan sistem pemerintahan.", relatedDocument: "REK-005", updated: null },
    { id: "EVT-006", date: "Enam tahun peperangan", title: "PERANG TIGA KERAJAAN", description: "Kebangkitan Martod mula menarik perhatian kerajaan-kerajaan lain. Dravosk, Solmera dan Kharveth membentuk pakatan bagi menghentikan perkembangan Legion Hitam.", relatedDocument: "REK-006", updated: null },
    { id: "EVT-007", date: "Zaman Pakatan Tujuh Kerajaan", title: "PAKATAN TUJUH KERAJAAN", description: "Melihat perkembangan Martod semakin sukar dikawal, semua kerajaan utama bersetuju membentuk pakatan ketenteraan. Pakatan Tujuh Kerajaan diwujudkan dengan matlamat menghapuskan kekuatan Martod.", relatedDocument: "REK-007", updated: null },
    { id: "EVT-008", date: "47 hari", title: "PERTEMPURAN AGUNG ARKHADIA", description: "Pertempuran Agung Arkhadia merupakan peperangan terbesar sepanjang sejarah penaklukan Martod. Pakatan Tujuh Kerajaan melancarkan serangan dari utara, selatan dan timur.", relatedDocument: "REK-008", updated: null },
    { id: "EVT-009", date: "Tahun ke-30 selepas kebangkitan Martod", title: "PENAKLUKAN TERAKHIR", description: "Dalam tempoh lima tahun selepas Pertempuran Agung Arkhadia, kerajaan-kerajaan yang masih bertahan mula menyerah. Eryndor menyerahkan armada lautnya.", relatedDocument: "REK-009", updated: null },
    { id: "EVT-010", date: "Selepas penaklukan terakhir", title: "PENUBUHAN EMPAYAR DUNIA", description: "Selepas penaklukan terakhir, Martod mengisytiharkan penubuhan Empayar Dunia. Sistem pemerintahan baharu menggantikan tujuh kerajaan lama.", relatedDocument: "REK-010", updated: null },
    { id: "EVT-011", date: "20 tahun pertama empayar", title: "ZAMAN KEGEMILANGAN", description: "Pemerintahan Martod membawa perubahan besar terhadap perkembangan dunia. Peperangan antara kerajaan semakin berkurangan.", relatedDocument: "REK-011", updated: null },
    { id: "EVT-012", date: "Zaman Empayar Dunia", title: "PENGAWAL ABADI", description: "Bagi memastikan empayarnya kekal stabil, Martod menubuhkan sebuah pasukan elit yang dikenali sebagai Pengawal Abadi. Pasukan tersebut terdiri daripada individu terpilih yang mempunyai kemahiran ketenteraan, risikan dan keselamatan.", relatedDocument: "REK-012", updated: null },
    { id: "EVT-013", date: "Beberapa dekad pemerintahan", title: "KEMUNCULAN THE VANGUARD", description: "Selepas beberapa dekad pemerintahan, penentangan terhadap Martod semakin meningkat. Sekumpulan individu mula membentuk gerakan rahsia yang dikenali sebagai The Vanguard.", relatedDocument: "REK-013", updated: null },
    { id: "EVT-014", date: "Pertempuran terakhir Martod", title: "KEJATUHAN SANG PENGUASA", description: "Dalam pertempuran terakhir, Martod berhadapan dengan Arven, bekas panglimanya sendiri. Arven menyatakan bahawa Martod telah berjaya menyatukan dunia tetapi gagal memahami bahawa dunia bukan milik seorang manusia.", relatedDocument: "REK-014", updated: null },
    { id: "EVT-015", date: "100 tahun selepas kejatuhan empayar", title: "DUNIA TANPA RAJA", description: "Selepas kejatuhan Empayar Dunia Martod, dunia dibahagikan kepada beberapa negara merdeka. Pada mulanya, sistem baharu disambut sebagai kemenangan kebebasan.", relatedDocument: "REK-015", updated: null },
    { id: "EVT-016", date: "Tahun ke-100 selepas kejatuhan empayar", title: "PENEMUAN MAHKOTA HITAM", description: "Pada tahun ke-100 selepas kejatuhan empayar, seorang pemuda bernama Kaien Voss menemui sebuah bilik rahsia di bawah runtuhan ibu kota Martod. Di dalamnya terdapat beberapa artifak:", relatedDocument: "REK-016", updated: null },
    { id: "EVT-017", date: "Era selepas Martod", title: "KEBANGKITAN ORDO ABADI", description: "Ordo Abadi dipercayai terdiri daripada keturunan Pengawal Abadi. Organisasi tersebut mempunyai matlamat untuk mengembalikan sistem pemerintahan empayar.", relatedDocument: "REK-017", updated: null },
    { id: "EVT-018", date: "Era selepas Martod", title: "PENUBUHAN PENJAGA FAJAR", description: "Sebagai tindak balas terhadap Ordo Abadi, sebuah kumpulan baharu ditubuhkan. Kumpulan tersebut dikenali sebagai Penjaga Fajar.", relatedDocument: "REK-018", updated: null },
    { id: "EVT-019", date: "Era selepas Martod", title: "PROTOKOL MARTOD", description: "Penyelidikan Dr. Elian Marek terhadap mahkota hitam menemukan sebuah sistem tersembunyi bernama Protokol Martod. Sistem tersebut dipercayai dibangunkan sebelum Martod meninggalkan takhtanya.", relatedDocument: "REK-019", updated: null },
    { id: "EVT-020", date: "Era selepas Martod", title: "KEBANGKITAN EMPAYAR NOVA", description: "Selepas memperoleh sebahagian teknologi peninggalan Martod, Lord Veyron mengisytiharkan penubuhan Empayar Nova. Empayar tersebut mempunyai sistem ketenteraan yang lebih maju berbanding kerajaan lain.", relatedDocument: "REK-020", updated: null },
    { id: "EVT-021", date: "Perang Warisan", title: "PERANG WARISAN", description: "Lord Veyron melancarkan operasi ketenteraan besar-besaran bagi mendapatkan semua artifak peninggalan Martod. Penjaga Fajar menjadi penghalang utama kepada rancangan tersebut.", relatedDocument: "REK-021", updated: null },
    { id: "EVT-022", date: "Perang Warisan", title: "PERTEMPURAN TERAKHIR", description: "Pertempuran terakhir berlaku di lokasi yang pernah menjadi pusat pemerintahan Martod. Kaien berhadapan secara langsung dengan Lord Veyron.", relatedDocument: "REK-022", updated: null },
    { id: "EVT-023", date: "Selepas Perang Warisan", title: "DUNIA ERA BAHARU", description: "Selepas Perang Warisan, kerajaan-kerajaan dunia bersetuju membentuk satu sistem kerjasama antarabangsa. Berbeza dengan Empayar Dunia Martod, sistem baharu tidak meletakkan kuasa mutlak di tangan seorang individu.", relatedDocument: "REK-023", updated: null },
    { id: "EVT-024", date: "Beberapa bulan selepas Perang Warisan", title: "PROTOKOL KEDUA", description: "Beberapa bulan selepas Perang Warisan, sebuah pusat penyelidikan mengesan isyarat elektronik daripada serpihan mahkota hitam. Walaupun mahkota tersebut dilaporkan telah musnah, sistem di dalamnya masih menunjukkan aktiviti.", relatedDocument: "REK-024", updated: null },
    { id: "EVT-025", date: "Penyiasatan Protokol Kedua", title: "LOKASI TERAKHIR MARTOD", description: "Hasil penyiasatan terhadap Protokol Kedua membawa kepada penemuan sebuah kawasan terpencil di utara Arkhadia. Lokasi tersebut dikenali sebagai Lembah Aras.", relatedDocument: "REK-025", updated: null },
    { id: "EVT-026", date: "Beberapa hari sebelum kematian Martod", title: "CATATAN TERAKHIR SANG PENGUASA", description: "Sebuah jurnal dipercayai milik Martod ditemukan di dalam kediamannya. Catatan terakhir bertarikh beberapa hari sebelum kematiannya.", relatedDocument: "REK-026", updated: null },
    { id: "EVT-027", date: "Lembah Aras", title: "KEMATIAN MARTOD", description: "Martod dipercayai meninggal dunia akibat usia tua. Tiada rekod pembunuhan.", relatedDocument: "REK-027", updated: null },
    { id: "EVT-028", date: "Penemuan surat terakhir", title: "SURAT TERAKHIR MARTOD", description: "Di dalam sebuah peti besi, penyelidik menemukan satu surat yang tidak pernah dihantar. Surat tersebut ditujukan kepada seluruh umat manusia.", relatedDocument: "REK-028", updated: null },
    { id: "EVT-029", date: "Selepas penemuan surat terakhir", title: "PEMBUBARAN PROTOKOL", description: "Selepas penemuan surat terakhir, Kaien Voss dan bekas anggota Penjaga Fajar membuat keputusan untuk menamatkan semua sistem peninggalan Martod yang berpotensi digunakan bagi membentuk pemerintahan mutlak. Protokol Kedua dimatikan.", relatedDocument: "REK-029", updated: null },
    { id: "EVT-030", date: "100 tahun selepas kejatuhan empayar", title: "PENGISYTIHARAN ARKIB DUNIA", description: "Seratus tahun selepas kejatuhan Empayar Dunia Martod, Majlis Sejarah Antarabangsa mengeluarkan pengisytiharan rasmi mengenai kedudukan Martod dalam sejarah manusia. Beliau diiktiraf sebagai salah satu tokoh paling berpengaruh dalam sejarah dunia.", relatedDocument: "REK-030", updated: null }
  ]
};
