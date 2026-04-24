# Byronz Public Backend

Backend publik dibutuhkan agar APK/AAB Byronz bisa dipakai banyak user. Aplikasi mobile tidak boleh bergantung pada `localhost` karena `localhost` di HP berarti perangkat user, bukan laptop/server Anda.

## Jalur yang direkomendasikan agar tidak bergantung pada laptop

Gunakan:

- `render.yaml` untuk deploy backend Byronz ke Render yang always-on
- provider AI hosted berbasis OpenAI-compatible API seperti Groq
- official Llama API juga bisa dipakai karena Byronz sudah mendukung endpoint OpenAI-compatible
- `BYRONZ_DB_PATH=/var/data/chat.db` agar SQLite tetap punya storage persisten

Alur ringkas:

1. Push repo Byronz ke GitHub.
2. Buat API key Groq, official Llama API, atau provider OpenAI-compatible lain.
3. Di Render, buat service dari blueprint `render.yaml`.
4. Isi secret:
   - `OPENAI_COMPATIBLE_API_KEY`
   - atau `LLAMA_API_KEY`
   - `CORS_ALLOWED_ORIGINS`
   - `TRUSTED_HOSTS`
5. Setelah deploy selesai, ambil URL publik backend, misalnya `https://byronz-api.onrender.com`.
6. Verifikasi dari Windows:

```bat
verify-production-backend.bat https://byronz-api.onrender.com
```

7. Arahkan aplikasi ke backend permanen lalu build ulang:

```bat
set-byronz-api.bat https://byronz-api.onrender.com
build-android-release.bat
```

## Alternatif jika ingin tetap memakai model lokal Ollama

Jika Anda ingin semua model tetap self-hosted, pakai VPS Linux dan `docker-compose.production.yml`.
Ini lebih berat karena server harus menjalankan FastAPI Byronz plus Ollama 24/7.

Langkah ringkas:

1. Upload folder `backend` ke server.
2. Install Docker dan Docker Compose di server.
3. Salin `.env.production.example` menjadi `.env.production`.
4. Jalankan:

```bash
docker compose -f docker-compose.production.yml up --build -d
```

5. Pull model Ollama yang dipakai.
6. Pasang Nginx/HTTPS dengan `nginx-byronz.conf.example`.

## Alternatif hybrid: VPS biasa + provider AI hosted

Kalau Anda punya VPS tetapi tidak ingin menanggung beban Ollama, pakai `docker-compose.hosted-llm.yml`.
Compose ini hanya menjalankan Byronz API dan menyimpan `chat.db` di volume Docker.

```bash
docker compose -f docker-compose.hosted-llm.yml up --build -d
```

## Jika ingin memakai official Llama API

Byronz sekarang bisa memakai official Llama API selama Anda punya akses/key.
Endpoint kompatibilitas resminya adalah:

`https://api.llama.com/compat/v1/`

Isi environment seperti ini:

```env
BYRONZ_LLM_PROVIDER=openai_compatible
OPENAI_COMPATIBLE_BASE_URL=https://api.llama.com/compat/v1/
LLAMA_API_KEY=isi_llama_api_key_anda
OPENAI_COMPATIBLE_DEFAULT_MODEL=isi_model_id_llama_api_anda
OPENAI_COMPATIBLE_MODELS=isi_model_id_llama_api_anda|Llama
BYRONZ_DB_PATH=/var/data/chat.db
```

## Aturan Cloudflare yang direkomendasikan

Jika domain memakai Cloudflare proxy, buat aturan berikut:

1. `SSL/TLS` gunakan mode `Full (strict)`.
2. Buat `WAF Custom Rule` atau `Security Rule` untuk host API agar request berikut di-skip dari managed challenge:
   - `/health`
   - `/models`
   - `/ask-stream`
   - `/ask-stream-upload`
   - `/ambient-location`
3. Jika Bot Fight Mode memblokir API, matikan untuk subdomain API atau buat bypass rule khusus subdomain API.
4. Tambahkan `Cache Rule` agar path API di atas tidak di-cache.
5. Setelah rule aktif, cek lagi:

```bat
verify-production-backend.bat https://api.domain-anda.com
```
