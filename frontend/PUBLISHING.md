# Byronz Frontend Publishing

Lokasi frontend publish-ready:

- `frontend`
- Launcher cepat Windows: `run-byronz.bat`
- Sinkronisasi wrapper mobile: `sync-mobile.bat`
- Bundle frontend ke backend untuk deploy: `bundle-byronz.bat`

## Yang sudah disiapkan

- PWA installable untuk browser modern
- `manifest.webmanifest`
- `service worker`
- build folder `dist`
- konfigurasi Capacitor untuk Android dan iOS

## Perintah utama

Menjalankan Byronz lokal paling cepat di Windows:

```bash
run-byronz.bat
```

Sinkronkan Android dan iOS wrapper setelah ada perubahan frontend:

```bash
sync-mobile.bat
```

Siapkan bundle frontend untuk backend/Docker:

```bash
bundle-byronz.bat
```

Install dependency frontend manual:

```bash
npm.cmd install
```

Build frontend:

```bash
npm.cmd run build
```

Sinkronkan ke Android dan iOS wrapper:

```bash
npm.cmd run cap:sync
```

Buka project Android:

```bash
npm.cmd run cap:android
```

Buka project iOS:

```bash
npm.cmd run cap:ios
```

## Catatan Windows

Windows sekarang bisa menjalankan Byronz langsung dari launcher `run-byronz.bat`.
Untuk pengalaman seperti aplikasi desktop, host Byronz di HTTPS lalu install sebagai PWA lewat Edge atau Chrome.

## Catatan produksi

Sebelum dipublish, isi `app-config.js` dengan URL backend publik Byronz.
Untuk menaikkan versi rilis Android dan tampilan versi di aplikasi, gunakan `..\set-app-version.bat 1.2.1 121`.
