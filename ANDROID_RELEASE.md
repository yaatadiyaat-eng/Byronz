# Byronz Android Release

## Lokasi project

- Frontend: `frontend`
- Android wrapper: `frontend\android`

## Yang sudah disiapkan

- Wrapper Android Capacitor untuk Byronz
- Permission mikrofon untuk English Call
- Permission lokasi untuk cuaca/lokasi real-time
- Template signing release
- Script persiapan dan build release

## Sebelum build APK/AAB

1. Deploy backend Byronz ke domain publik HTTPS.
2. Isi URL backend publik di `frontend\app-config.js`
3. Naikkan versi aplikasi lebih dulu dengan `set-app-version.bat 1.2.1 121`
4. Buat keystore Android release Anda.
5. Salin `frontend\android\keystore.properties.example` menjadi `frontend\android\keystore.properties`
6. Isi data keystore yang benar.
7. Pastikan `apiBaseUrl` tidak kosong saat build release.
8. Pastikan `https://api.domain-anda.com/health` merespons `{"status":"ok"}` tanpa Cloudflare challenge.

## Satu sumber versi

Versi Byronz sekarang dipusatkan di:

- `frontend\release.config.json`
- `frontend\release-config.js`

Untuk rilis baru, cukup jalankan:

```bash
set-app-version.bat 1.2.1 121
```

Perintah ini akan menyinkronkan:

- versi di `frontend\package.json`
- versi yang tampil di UI aplikasi
- `versionName` dan `versionCode` Android release

## Verifikasi backend production

Sebelum build release final untuk Play Console, jalankan:

```bat
verify-production-backend.bat https://api.domain-anda.com
```

Backend dianggap siap jika:

- `/health` membalas `{"status":"ok"}`
- `/models` membalas JSON normal
- preflight CORS untuk `/ask-stream` lolos
- tidak ada Cloudflare challenge/403 untuk request API biasa

## Generate keystore

Contoh:

```bash
keytool -genkeypair -v -keystore frontend\android\release-keystore.jks -alias byronz-release -keyalg RSA -keysize 2048 -validity 3650
```

## Jalur cepat

Build APK debug untuk test di perangkat:

```bash
build-android-debug.bat
```

Build APK debug yang terhubung ke backend lokal PC:

```bash
build-android-debug-local.bat
adb-reverse-byronz.bat
```

Install APK debug lokal ke HP yang tersambung USB debugging:

```bash
install-android-debug-local.bat
```

Jika memakai server lokal lain di jaringan Wi-Fi:

```bash
build-android-debug-local.bat http://192.168.1.10:8000
```

Persiapan Android release:

```bash
prepare-android-release.bat
```

Build release:

```bash
set-app-version.bat 1.2.1 121
generate-android-keystore.bat
build-android-release.bat
```

## Output build

- Debug APK: `frontend\android\app\build\outputs\apk\debug\app-debug.apk`
- Debug APK lokal: `frontend\android\app\build\outputs\apk\debug\app-debug-local.apk`
- `frontend\android\app\build\outputs\bundle\release\app-release.aab`
- `frontend\android\app\build\outputs\apk\release\app-release.apk`

## Untuk Google Play

- Upload file `.aab`, bukan `.apk`, ke Google Play Console
- Aktifkan Play App Signing
- Lengkapi privacy policy, screenshot, icon, deskripsi, dan kategori aplikasi
- Gunakan closed testing terlebih dahulu sebelum production

## Catatan penting

- Byronz versi APK untuk banyak user harus memakai backend publik HTTPS
- Jangan biarkan `apiBaseUrl` kosong saat build release untuk user umum
- Jangan simpan `keystore.properties` asli atau file `.jks` di repo publik
