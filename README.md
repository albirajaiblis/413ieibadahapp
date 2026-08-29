# 🕌 Prayer App - PWA Offline-First

Aplikasi pengingat waktu shalat dan pencatatan ibadah harian yang ringan, modern, bersih, dan bernuansa Islami. **100% Offline-First**, dapat di-install sebagai **Progressive Web App (PWA)** pada Android, iOS, Windows, dan Mac.

---

## 🚀 Panduan Publish Online ke GitHub Pages (Gratis & Cepat)

Aplikasi ini sudah dikonfigurasi **100% kompatibel dengan GitHub Pages** (menggunakan jalur relatif `./` dan Service Worker subfolder-aware).

### Cara 1: Upload via Website GitHub (Tanpa Terminal)

1. **Buat Repository Baru di GitHub**:
   - Buka [GitHub New Repository](https://github.com/new).
   - Beri nama repository, misalnya `prayer-app`.
   - Pilih **Public**, lalu klik **Create repository**.

2. **Upload Seluruh File**:
   - Di halaman repository baru Anda, klik tautan **uploading an existing file**.
   - Drag & drop seluruh isi folder `prayer_app` (file `index.html`, `manifest.webmanifest`, `sw.js`, folder `css`, `js`, `assets`, `.github`).
   - Klik **Commit changes**.

3. **Aktifkan GitHub Pages**:
   - Buka tab **Settings** di repository GitHub Anda.
   - Di menu sebelah kiri, pilih **Pages**.
   - Pada bagian **Build and deployment -> Source**, pilih **GitHub Actions** (otomatis menggunakan file `.github/workflows/deploy.yml` yang sudah disediakan).
   - Tunggu ~1 menit, aplikasi PWA Anda siap diakses di URL:  
     `https://USERNAME.github.io/prayer-app/`

---

### Cara 2: Upload via Git Command Line / VS Code Terminal

```bash
# 1. Inisialisasi Git di folder ini
git init

# 2. Add seluruh file
git add .

# 3. Commit
git commit -m "Initial commit Prayer App PWA"

# 4. Hubungkan ke repository GitHub Anda
git branch -M main
git remote add origin https://github.com/USERNAME/prayer-app.git

# 5. Push ke GitHub
git push -u origin main
```

Setelah di-push, GitHub Actions akan otomatis mempublish PWA Anda ke **GitHub Pages**!

---

## ✨ Fitur Utama
- **Offline-First PWA**: Berfungsi tanpa koneksi internet & dapat di-install di HP/Desktop.
- **5 Pilihan Tema Warna Modern**: Emerald Zamrud, Royal Sapphire, Midnight Gold, Desert Sunset, dan Sage Harmony.
- **Kalkulator Shalat Offline**: Formula Kemenag RI (Subuh 20°, Isya 18°).
- **Checklist Shalat 5 Waktu & Sunnah**: Subuh, Dzuhur, Ashar, Maghrib, Isya + Tahajjud, Duha, Rawatib, Witir.
- **Tasbih Digital**: Efek bunyi klik audio & getaran haptics.
- **Kompas Kiblat**: Sudut arah Ka'bah dari kota yang dipilih.
- **Bacaan Dzikir Pagi & Petang**: Teks Arab, Latin, dan Terjemahan.
- **Backup / Restore JSON**: Pindah data antar perangkat dengan mudah.
