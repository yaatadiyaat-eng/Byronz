import shutil
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT_DIR / "frontend" / "dist"
TARGET_DIR = ROOT_DIR / "backend" / "frontend-dist"


def main() -> int:
    if not SOURCE_DIR.exists():
        raise SystemExit("Frontend dist belum ada. Jalankan build frontend terlebih dahulu.")

    if TARGET_DIR.exists():
        shutil.rmtree(TARGET_DIR)

    shutil.copytree(SOURCE_DIR, TARGET_DIR)
    print(f"Frontend bundle tersalin ke {TARGET_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
