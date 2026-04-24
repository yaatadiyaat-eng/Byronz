# Byronz Windows App

Byronz dapat dijalankan sebagai aplikasi Windows portable melalui paket release di `release\Byronz-Windows`.

## Build paket Windows

```bat
build-windows-release.bat
```

Output:

- `release\Byronz-Windows`
- `release\Byronz-Windows-v<versi>.zip`

## Menjalankan

Buka folder `release\Byronz-Windows`, lalu jalankan:

```bat
Byronz.bat
```

## Catatan distribusi

- Paket ini adalah portable package, bukan installer `.msi`.
- Setup pertama butuh Python 3.12+ dan internet untuk memasang dependency backend.
- Untuk pengalaman installer penuh, tahap berikutnya adalah membundel Python runtime dan membuat installer Windows.
