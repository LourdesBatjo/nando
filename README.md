# A Chapter of 22 — Website Ulang Tahun

Website satu halaman (HTML + CSS + JavaScript murni, tanpa framework). Bisa langsung dibuka dengan klik dua kali `index.html`, atau di-hosting sebagai situs statis (Netlify, GitHub Pages, Vercel, dll).

## Struktur
```
birthday-memories/
├── index.html
├── README.md
└── assets/
    ├── css/style.css
    ├── js/
    │   ├── data.js       <- ISI KONTEN DIEDIT DI SINI (nama, tanggal, galeri, 14 surat)
    │   ├── utils.js      <- fungsi bantu (fallback gambar/avatar)
    │   ├── gallery.js    <- galeri + lightbox
    │   ├── messages.js   <- 14 kartu surat + modal
    │   ├── music.js      <- pemutar musik
    │   └── main.js       <- pembuka, replay, animasi, partikel
    ├── images/
    │   ├── birthday-person/profile.jpg
    │   ├── gallery/photo1.jpg ...
    │   └── contributors/person1.jpg ... person14.jpg
    └── music/birthday-bgm.mp3
```

## Checklist personalisasi (semua di `assets/js/data.js`)
1. **Nama & tanggal**: ubah `CONFIG.name` dan `CONFIG.date`.
2. **Foto utama**: simpan sebagai `assets/images/birthday-person/profile.jpg`, lalu isi `CONFIG.profile: "assets/images/birthday-person/profile.jpg"`.
3. **Galeri (10-20 foto)**: taruh foto di `assets/images/gallery/` (photo1.jpg, photo2.jpg, ...). Di `GALLERY`, isi `src` dan `caption` tiap item, tambah/hapus item sesuai jumlah foto. `r` adalah rasio kotak sementara ("4/5", "1/1", "3/4", "4/3") dan hanya dipakai kalau foto belum ada.
4. **14 surat**: ganti `LETTERS` dengan 14 objek berformat:
   `{id:1, name:"Nama", relationship:"Sahabat", photo:"assets/images/contributors/person1.jpg", message:"Isi pesan..."}`
   Foto profil tiap pengirim simpan di `assets/images/contributors/person1.jpg` sampai `person14.jpg`. Jika foto tidak ada, otomatis tampil inisial nama.
5. **Musik**: simpan MP3 sebagai `assets/music/birthday-bgm.mp3`, lalu isi `CONFIG.music: "assets/music/birthday-bgm.mp3"`. Jika dikosongkan atau file tidak ditemukan, dipakai musik ambient bawaan.

## Tips
- Kompres foto (lebar maksimal sekitar 1600 px, format JPG/WebP) supaya cepat dibuka.
- Musik baru berbunyi setelah tombol "Open your surprise" diklik (aturan browser).
- Warna dan font ada di bagian atas `assets/css/style.css` (`:root`).
- Bila foto tidak muncul saat dibuka lokal, pastikan nama file persis sama (huruf besar/kecil berpengaruh).
