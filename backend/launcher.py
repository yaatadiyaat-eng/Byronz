import json
import os
import socket
import subprocess
import sys
import threading
import time
import webbrowser
from pathlib import Path
from urllib.error import URLError
from urllib.request import urlopen

ROOT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"
DIST_DIR = FRONTEND_DIR / "dist"
PACKAGE_DIST_DIR = BACKEND_DIR / "frontend-dist"
RUNTIME_FILE = BACKEND_DIR / ".byronz-runtime.json"
HOST = "127.0.0.1"
DEFAULT_PORT = 8000
OLLAMA_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434").rstrip("/")
LLM_PROVIDER = os.getenv("BYRONZ_LLM_PROVIDER", "ollama").strip().lower()


def port_is_open(host: str, port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.5)
        return sock.connect_ex((host, port)) == 0


def wait_for_http(url: str, attempts: int = 20, delay: float = 0.5) -> bool:
    for _ in range(attempts):
        try:
            with urlopen(url, timeout=2):
                return True
        except (URLError, TimeoutError):
            time.sleep(delay)
    return False


def build_base_url(port: int) -> str:
    return f"http://{HOST}:{port}"


def is_byronz_running(port: int) -> bool:
    try:
        with urlopen(f"{build_base_url(port)}/health", timeout=2) as response:
            return response.read().decode("utf-8").strip() == '{"status":"ok"}'
    except (URLError, TimeoutError, OSError):
        return False


def find_available_port(start_port: int, max_attempts: int = 20) -> int:
    for port in range(start_port, start_port + max_attempts):
        if not port_is_open(HOST, port):
            return port
    raise RuntimeError("Tidak menemukan port kosong untuk menjalankan Byronz.")


def process_exists(pid: int) -> bool:
    try:
        os.kill(pid, 0)
    except OSError:
        return False
    return True


def load_runtime() -> tuple[int, int] | None:
    if not RUNTIME_FILE.exists():
        return None

    try:
        payload = json.loads(RUNTIME_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None

    pid = int(payload.get("pid") or 0)
    port = int(payload.get("port") or 0)
    if pid <= 0 or port <= 0:
        return None

    if process_exists(pid) and is_byronz_running(port):
        return pid, port

    try:
        RUNTIME_FILE.unlink()
    except OSError:
        pass

    return None


def save_runtime(pid: int, port: int) -> None:
    payload = {"pid": pid, "port": port}
    RUNTIME_FILE.write_text(json.dumps(payload), encoding="utf-8")


def clear_runtime() -> None:
    try:
        if RUNTIME_FILE.exists():
            RUNTIME_FILE.unlink()
    except OSError:
        pass


def ensure_frontend_build() -> None:
    frontend_source_available = (FRONTEND_DIR / "package.json").exists()
    if not frontend_source_available:
        if (PACKAGE_DIST_DIR / "index.html").exists():
            print("Frontend Byronz paket release sudah siap.")
            return

        print("Frontend Byronz belum ditemukan. Paket release tidak lengkap.")
        return

    source_files = [
        FRONTEND_DIR / "index.html",
        FRONTEND_DIR / "style.css",
        FRONTEND_DIR / "app.js",
        FRONTEND_DIR / "app-config.js",
        FRONTEND_DIR / "manifest.webmanifest",
        FRONTEND_DIR / "sw.js",
    ]

    if not DIST_DIR.exists():
        needs_build = True
    else:
        newest_source = max(file.stat().st_mtime for file in source_files if file.exists())
        oldest_dist = min(file.stat().st_mtime for file in DIST_DIR.rglob("*") if file.is_file())
        needs_build = newest_source > oldest_dist

    if not needs_build:
        print("Frontend Byronz sudah siap.")
    else:
        print("Membangun frontend Byronz...")
        subprocess.check_call(["npm.cmd", "run", "build"], cwd=FRONTEND_DIR)

    sync_script = BACKEND_DIR / "sync_frontend_dist.py"
    if sync_script.exists():
        subprocess.check_call([sys.executable, str(sync_script)], cwd=BACKEND_DIR)


def ensure_ollama_running() -> None:
    if LLM_PROVIDER != "ollama":
        print("Provider AI cloud aktif. Byronz tidak perlu menyalakan Ollama lokal.")
        return

    try:
        if wait_for_http(f"{OLLAMA_URL}/api/tags", attempts=2, delay=0.3):
            print("Ollama terdeteksi dan siap.")
            return
    except Exception:
        pass

    print("Mencoba menyalakan Ollama...")
    try:
        subprocess.Popen(
            ["ollama", "serve"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
        )
    except FileNotFoundError:
        print("Perintah Ollama tidak ditemukan. Install Ollama terlebih dahulu agar Byronz bisa menjawab.")
        return

    if wait_for_http(f"{OLLAMA_URL}/api/tags", attempts=20, delay=0.5):
        print("Ollama berhasil aktif.")
    else:
        print("Ollama belum merespons. Byronz tetap dibuka, tetapi jawaban AI mungkin belum tersedia.")


def open_browser_when_ready(port: int) -> None:
    def _open():
        base_url = build_base_url(port)
        if wait_for_http(f"{base_url}/health", attempts=30, delay=0.5):
            webbrowser.open(base_url)

    threading.Thread(target=_open, daemon=True).start()


def main() -> int:
    ensure_frontend_build()
    ensure_ollama_running()

    existing_runtime = load_runtime()
    if existing_runtime:
        _, port = existing_runtime
        base_url = build_base_url(port)
        print(f"Server Byronz sudah aktif di {base_url}")
        webbrowser.open(base_url)
        return 0

    if port_is_open(HOST, DEFAULT_PORT):
        port = find_available_port(DEFAULT_PORT + 1)
    else:
        port = DEFAULT_PORT

    os.environ.setdefault("CORS_ALLOWED_ORIGINS", "*")
    open_browser_when_ready(port)

    print(f"Menjalankan Byronz di {build_base_url(port)}")
    process = subprocess.Popen(
        [
            sys.executable,
            "-m",
            "uvicorn",
            "main:app",
            "--host",
            HOST,
            "--port",
            str(port),
        ],
        cwd=BACKEND_DIR,
    )
    save_runtime(process.pid, port)
    try:
        process.wait()
    finally:
        clear_runtime()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
