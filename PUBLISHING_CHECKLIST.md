# Byronz Publishing Checklist

## Android

- Build debug sudah bisa dibuat dengan `build-android-debug.bat`.
- Build debug lokal yang bisa tersambung ke backend PC dibuat dengan `build-android-debug-local.bat`.
- Backend HTTPS uji publik sementara dibuat dengan `start-public-backend-tunnel.bat` dan otomatis fallback ke `localtunnel` jika Quick Tunnel Cloudflare tidak siap.
- APK test publik sementara dibuat dengan `build-android-public-test.bat`.
- Paket Android live yang langsung siap dipakai dari backend publik lokal dapat dibuat dengan `build-android-live-release.bat`.
- Install ke HP tersambung USB debugging dengan `install-android-debug-local.bat`.
- Siapkan backend publik HTTPS sebelum release.
- Untuk backend 24/7 tanpa laptop, gunakan jalur `render.yaml` + provider AI hosted atau VPS yang selalu menyala.
- Verifikasi backend publik dengan `verify-production-backend.bat https://api.domain-anda.com`.
- Naikkan versi rilis dengan `set-app-version.bat 1.2.1 121`.
- Set URL backend dengan `set-byronz-api.bat https://api.domain-anda.com`.
- Buat signing key dengan `generate-android-keystore.bat`.
- Build release dengan `build-android-release.bat`.
- Upload file `.aab` ke Google Play Console.
- Isi privacy policy, deskripsi aplikasi, screenshot, icon, kategori, dan data safety.

## iOS

- Folder iOS sudah ada di `frontend\ios`, tetapi build iOS wajib memakai macOS dan Xcode.
- Web build iOS sudah bisa disinkronkan dari Windows dengan `npx cap sync ios`.
- Ikuti panduan di `IOS_RELEASE.md` sebelum membuka Xcode.
- Daftar Apple Developer Program diperlukan untuk distribusi App Store.

## Windows

- Untuk penggunaan lokal Windows, jalankan `run-byronz.bat`.
- Paket Windows portable dibuat dengan `build-windows-release.bat`.
- Output tersedia di `release\Byronz-Windows` dan `release\Byronz-Windows-v<versi>.zip`.
- Untuk distribusi publik yang lebih profesional, tahap berikutnya adalah installer `.msi/.exe` dengan Python runtime bawaan.

## Dokumen legal dan store

- Gunakan `PRIVACY_POLICY_DRAFT.md` sebagai draft awal privacy policy.
- Jelaskan penggunaan mikrofon, lokasi, dan upload file/gambar secara transparan.
- Jangan klaim data sepenuhnya offline jika fitur publik memakai backend/server.
