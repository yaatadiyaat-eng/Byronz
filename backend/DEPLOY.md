# Byronz Backend Deploy

Lokasi backend deploy-ready:

- `backend`
- Launcher lokal Windows: `run-byronz.bat`
- Bundle frontend ke backend: `bundle-byronz.bat`

## Opsi jalan lokal

Menjalankan Byronz paling cepat:

```bash
run-byronz.bat
```

Launcher akan:

- memastikan frontend Byronz sudah ter-build
- mencoba menyalakan Ollama bila tersedia
- menjalankan FastAPI Byronz
- membuka Byronz di browser

Install dependency backend manual:

```bash
pip install -r requirements.txt
```

Jalankan backend:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Opsi Docker

Build image:

```bash
docker build -t byronz-backend .
```

Run container:

```bash
docker run -p 8000:8000 --env-file .env byronz-backend
```

Docker Compose:

```bash
bundle-byronz.bat
docker compose up --build
```

## Opsi production di VPS

Untuk domain permanen HTTPS, gunakan file production berikut:

- `docker-compose.production.yml`
- `docker-compose.hosted-llm.yml`
- `.env.production`
- `nginx-byronz.conf.example`
- `../render.yaml`

Alur singkat:

```bash
cp .env.production.example .env.production
docker compose -f docker-compose.production.yml up --build -d
```

Lalu cek dari mesin Windows Anda:

```bat
verify-production-backend.bat https://api.domain-anda.com
```

Setelah container aktif, pull model Ollama yang akan dipakai:

```bash
docker exec -it byronz-ollama ollama pull llama3
docker exec -it byronz-ollama ollama pull mistral
```

Jika tidak ingin backend bergantung pada Ollama lokal/VPS, gunakan provider AI hosted berbasis OpenAI-compatible API.
Contoh paling mudah adalah Groq melalui `BYRONZ_LLM_PROVIDER=groq`.

Untuk VPS tanpa Ollama:

```bash
cp .env.production.example .env.production
docker compose -f docker-compose.hosted-llm.yml up --build -d
```

Untuk deploy managed tanpa laptop, paling praktis gunakan Render dengan blueprint `../render.yaml`.

## Environment penting

- `BYRONZ_LLM_PROVIDER`
- `OLLAMA_BASE_URL`
- `OPENAI_COMPATIBLE_BASE_URL`
- `OPENAI_COMPATIBLE_API_KEY`
- `OPENAI_COMPATIBLE_DEFAULT_MODEL`
- `OPENAI_COMPATIBLE_MODELS`
- `BYRONZ_DB_PATH`
- `CORS_ALLOWED_ORIGINS`
- `TRUSTED_HOSTS`

Contoh ada di `.env.example`.

## Catatan monetisasi

Untuk publikasi ke banyak user, backend Byronz sebaiknya di-host publik. Jangan mengandalkan `localhost` di perangkat user akhir.
