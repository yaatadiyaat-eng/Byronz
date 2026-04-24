# Byronz iOS Release

Wrapper iOS Byronz sudah tersedia di `frontend\ios` dan web build sudah disinkronkan dengan Capacitor.

## Yang bisa dilakukan dari Windows

```bat
cd /d frontend
npm run build
npx cap sync ios
```

Perintah sync iOS sudah berhasil, tetapi Windows tidak bisa membuat file `.ipa` final karena iOS wajib memakai macOS dan Xcode.

## Build final di macOS

1. Salin project `frontend` ke Mac.
2. Install Node.js, Xcode, CocoaPods, dan Apple Developer account.
3. Jalankan:

```bash
npm install
npm run build
npx cap sync ios
npx cap open ios
```

4. Di Xcode, pilih Team Apple Developer.
5. Set Bundle Identifier, contoh `ai.byronz.app`.
6. Archive aplikasi lewat `Product > Archive`.
7. Upload ke App Store Connect.

## Catatan penting

- Untuk versi publik, set API backend HTTPS terlebih dahulu sebelum `npm run build`.
- Fitur microphone, speech recognition, text-to-speech, lokasi, dan upload file perlu dijelaskan pada App Privacy.
- Apple review biasanya lebih ketat untuk aplikasi AI, jadi deskripsi fitur dan privacy policy harus jelas.
