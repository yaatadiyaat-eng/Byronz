from __future__ import annotations

import csv
import io
import json
from pathlib import Path

from fastapi import UploadFile
from PIL import Image, ImageStat
from PyPDF2 import PdfReader

MAX_ATTACHMENTS = 5
MAX_ATTACHMENT_TEXT = 4200
MAX_TOTAL_CONTEXT = 12000

TEXT_EXTENSIONS = {
    ".txt",
    ".md",
    ".json",
    ".csv",
    ".tsv",
    ".py",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".html",
    ".css",
    ".sql",
    ".xml",
    ".yml",
    ".yaml",
    ".log",
    ".ini",
    ".cfg",
}


async def build_attachments_context(files: list[UploadFile] | None) -> str | None:
    if not files:
        return None

    sections: list[str] = []
    current_length = 0

    for index, upload in enumerate(files[:MAX_ATTACHMENTS], start=1):
        try:
            content = await upload.read()
            summary = summarize_upload(upload.filename or f"attachment-{index}", upload.content_type or "", content)
        except Exception as exc:  # pragma: no cover - defensive fallback
            summary = (
                f"- Nama file: {upload.filename or f'attachment-{index}'}\n"
                f"- Status: gagal dibaca secara offline.\n"
                f"- Catatan: {exc}"
            )
        finally:
            await upload.close()

        section = f"Lampiran {index}:\n{summary}".strip()
        if current_length + len(section) > MAX_TOTAL_CONTEXT:
            sections.append("Lampiran berikutnya dipersingkat karena batas konteks sudah tercapai.")
            break

        sections.append(section)
        current_length += len(section)

    if len(files) > MAX_ATTACHMENTS:
        sections.append(f"Hanya {MAX_ATTACHMENTS} lampiran pertama yang dianalisis untuk menjaga performa offline.")

    joined = "\n\n".join(sections).strip()
    return joined or None


def summarize_upload(filename: str, content_type: str, content: bytes) -> str:
    suffix = Path(filename).suffix.lower()

    if not content:
        return (
            f"- Nama file: {filename}\n"
            f"- Tipe: {content_type or 'tidak diketahui'}\n"
            f"- Status: file kosong."
        )

    if content_type.startswith("image/") or suffix in {".png", ".jpg", ".jpeg", ".webp", ".bmp", ".gif"}:
        return summarize_image(filename, content_type, content)

    if suffix == ".pdf":
        return summarize_pdf(filename, content_type, content)

    if suffix in {".csv", ".tsv"}:
        return summarize_table(filename, content_type, content, delimiter="\t" if suffix == ".tsv" else ",")

    if suffix in {".json"}:
        return summarize_json(filename, content_type, content)

    if suffix in TEXT_EXTENSIONS or content_type.startswith("text/"):
        return summarize_text(filename, content_type, content)

    return (
        f"- Nama file: {filename}\n"
        f"- Tipe: {content_type or 'biner/offline'}\n"
        f"- Ukuran: {format_bytes(len(content))}\n"
        "- Status: format ini belum diekstrak penuh secara offline. Jika perlu analisis isi, gunakan TXT, PDF, CSV, JSON, atau gambar."
    )


def summarize_text(filename: str, content_type: str, content: bytes) -> str:
    decoded = decode_text(content)
    excerpt = compact_text(decoded, MAX_ATTACHMENT_TEXT)

    return (
        f"- Nama file: {filename}\n"
        f"- Tipe: {content_type or 'text/plain'}\n"
        f"- Ukuran: {format_bytes(len(content))}\n"
        f"- Ringkasan isi:\n{indent_block(excerpt)}"
    )


def summarize_json(filename: str, content_type: str, content: bytes) -> str:
    decoded = decode_text(content)

    try:
        parsed = json.loads(decoded)
        pretty = json.dumps(parsed, ensure_ascii=False, indent=2)
    except json.JSONDecodeError:
        pretty = decoded

    excerpt = compact_text(pretty, MAX_ATTACHMENT_TEXT)

    return (
        f"- Nama file: {filename}\n"
        f"- Tipe: {content_type or 'application/json'}\n"
        f"- Ukuran: {format_bytes(len(content))}\n"
        f"- Cuplikan struktur:\n{indent_block(excerpt)}"
    )


def summarize_table(filename: str, content_type: str, content: bytes, delimiter: str = ",") -> str:
    decoded = decode_text(content)
    reader = csv.reader(io.StringIO(decoded), delimiter=delimiter)
    rows = [row for row in reader if row][:6]

    if not rows:
        return summarize_text(filename, content_type, content)

    headers = rows[0]
    sample_rows = rows[1:4]
    sample_preview = "\n".join(
        "- " + " | ".join(cell.strip()[:40] for cell in row)
        for row in sample_rows
    ) or "- Tidak ada baris contoh selain header."

    return (
        f"- Nama file: {filename}\n"
        f"- Tipe: {content_type or 'text/csv'}\n"
        f"- Ukuran: {format_bytes(len(content))}\n"
        f"- Kolom terdeteksi: {', '.join(headers[:10]) if headers else 'tidak terdeteksi'}\n"
        f"- Contoh isi:\n{indent_block(sample_preview)}"
    )


def summarize_pdf(filename: str, content_type: str, content: bytes) -> str:
    try:
        reader = PdfReader(io.BytesIO(content))
        pages = []

        for page in reader.pages[:4]:
            extracted = page.extract_text() or ""
            if extracted.strip():
                pages.append(extracted.strip())

        combined = "\n\n".join(pages)
        excerpt = compact_text(combined or "PDF terdeteksi, tetapi teks yang dapat diekstrak sangat sedikit.", MAX_ATTACHMENT_TEXT)
        page_count = len(reader.pages)
    except Exception:
        excerpt = "PDF berhasil diterima, tetapi teks tidak dapat diekstrak secara offline dari file ini."
        page_count = 0

    return (
        f"- Nama file: {filename}\n"
        f"- Tipe: {content_type or 'application/pdf'}\n"
        f"- Ukuran: {format_bytes(len(content))}\n"
        f"- Jumlah halaman: {page_count}\n"
        f"- Ringkasan isi:\n{indent_block(excerpt)}"
    )


def summarize_image(filename: str, content_type: str, content: bytes) -> str:
    with Image.open(io.BytesIO(content)) as image:
        width, height = image.size
        orientation = describe_orientation(width, height)
        rgb_image = image.convert("RGB")
        preview = rgb_image.resize((72, 72))

        grayscale = preview.convert("L")
        grayscale_stat = ImageStat.Stat(grayscale)
        brightness = round(grayscale_stat.mean[0] / 255 * 100)
        contrast = grayscale_stat.extrema[0][1] - grayscale_stat.extrema[0][0]

        avg_color = tuple(int(round(value)) for value in ImageStat.Stat(preview).mean[:3])
        dominant_colors = extract_dominant_colors(preview)

        image_note = "Kemungkinan berupa screenshot atau layout antarmuka." if width >= 1000 and width > height else "Kemungkinan berupa gambar umum atau asset visual."

    return (
        f"- Nama file: {filename}\n"
        f"- Tipe: {content_type or 'image'}\n"
        f"- Ukuran file: {format_bytes(len(content))}\n"
        f"- Dimensi: {width} x {height}px ({orientation})\n"
        f"- Kecerahan rata-rata: {brightness}%\n"
        f"- Kontras visual: {describe_contrast(contrast)}\n"
        f"- Warna dominan: {', '.join(dominant_colors)}\n"
        f"- Warna rata-rata: {rgb_to_hex(avg_color)}\n"
        f"- Catatan offline: {image_note}"
    )


def extract_dominant_colors(image: Image.Image) -> list[str]:
    quantized = image.quantize(colors=4)
    palette = quantized.getpalette() or []
    colors = quantized.getcolors() or []
    sorted_colors = sorted(colors, key=lambda item: item[0], reverse=True)[:4]

    dominant = []
    for _, palette_index in sorted_colors:
        start = palette_index * 3
        rgb = tuple(palette[start:start + 3])
        if len(rgb) == 3:
            dominant.append(rgb_to_hex(rgb))

    return dominant or ["tidak terdeteksi"]


def describe_orientation(width: int, height: int) -> str:
    ratio = width / max(height, 1)
    if 0.92 <= ratio <= 1.08:
        return "square"
    return "landscape" if ratio > 1 else "portrait"


def describe_contrast(value: int) -> str:
    if value >= 160:
        return "tinggi"
    if value >= 90:
        return "sedang"
    return "rendah"


def decode_text(content: bytes) -> str:
    for encoding in ("utf-8-sig", "utf-8", "latin-1"):
        try:
            return content.decode(encoding)
        except UnicodeDecodeError:
            continue
    return content.decode("utf-8", errors="ignore")


def compact_text(text: str, limit: int) -> str:
    normalized = (text or "").replace("\r\n", "\n").replace("\r", "\n").strip()
    if not normalized:
        return "Tidak ada teks yang dapat dibaca."

    lines = [line.rstrip() for line in normalized.splitlines()]
    cleaned = "\n".join(lines).strip()

    if len(cleaned) <= limit:
        return cleaned

    trimmed = cleaned[:limit]
    if "\n" in trimmed:
        trimmed = trimmed.rsplit("\n", 1)[0]

    return f"{trimmed.rstrip()} ...[dipersingkat]"


def indent_block(text: str) -> str:
    lines = str(text or "").splitlines() or [""]
    return "\n".join(f"  {line}" for line in lines)


def format_bytes(size: int) -> str:
    if size <= 0:
        return "0 B"

    units = ["B", "KB", "MB", "GB"]
    scaled = float(size)
    unit_index = 0

    while scaled >= 1024 and unit_index < len(units) - 1:
        scaled /= 1024
        unit_index += 1

    precision = 0 if scaled >= 10 or unit_index == 0 else 1
    return f"{scaled:.{precision}f} {units[unit_index]}"


def rgb_to_hex(rgb: tuple[int, int, int]) -> str:
    return "#{:02X}{:02X}{:02X}".format(*rgb)
