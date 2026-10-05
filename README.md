# Personal Life OS
Plan. Pray. Progress.

## Pasang di GitHub Pages
1. Buat repository baru, upload seluruh isi folder ini (semua file langsung di root, tanpa folder).
2. Settings > Pages > Source: Deploy from a branch > main / (root).
3. Buka https://USERNAME.github.io/NAMA-REPO/ di Safari iPhone > Share > Add to Home Screen.

## Ganti jadwal mengajar
Edit `RAW` dan `teach()` di `data.js`.

## Waktu shalat
Kota Depok. Aplikasi mengambil jadwal bulanan Kemenag (via api.myquran.com) saat online, lalu menyimpannya. `prayer.js` memuat cadangan lokal Oktober 2026.

## Sinkronisasi
Settings > Sinkronisasi: isi GitHub token (classic, scope `gist`) dan passphrase. Data dienkripsi sebelum dikirim ke secret gist milik Anda.

## Export
Settings > Export CSV (pemisah titik koma, UTF-8). Backup lengkap tetap tersedia sebagai .json.

## Backup
Settings > Export backup. Data tersimpan di browser perangkat.
