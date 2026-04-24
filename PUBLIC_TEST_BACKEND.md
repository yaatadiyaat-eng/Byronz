# Byronz Public Test Backend

File ini menyiapkan jalur uji publik sementara untuk Byronz memakai Cloudflare Quick Tunnel.

## Start backend HTTPS sementara

```bat
start-public-backend-tunnel.bat
```

Output URL akan tersimpan di:

```text
public-backend-url.txt
```

## Build APK test yang memakai URL publik sementara

```bat
build-android-public-test.bat
```

Output:

```text
frontend\android\app\build\outputs\apk\debug\app-debug-public.apk
```

## Stop tunnel

```bat
stop-public-backend-tunnel.bat
```

## Catatan penting

URL `trycloudflare.com` bersifat sementara dan dapat berubah saat tunnel dimulai ulang. Untuk launching Google Play yang serius, gunakan domain tetap dan backend HTTPS permanen.
