# -*- coding: utf-8 -*-
"""
Extract KDS/KCS §4.1 (and selected §3.x) figure-rule candidates from book/ PDFs.
Human review only — does NOT modify image-knowledge files.

Usage: python scripts/extract-kds-figure-rules.py
Output: book/_kds_figure_rules_extract.json
"""
from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
BOOK = ROOT / "book"
MAP_PATH = ROOT / "scripts" / "kds-section-image-knowledge-map.json"
OUT = BOOK / "_kds_figure_rules_extract.json"

INSTRUMENT_KEYWORDS = [
    "지중경사계",
    "IPI",
    "지하수위계",
    "간극수압계",
    "토압계",
    "하중계",
    "변위계",
    "침하계",
    "지표침하",
    "내공변위",
    "천단침하",
    "록볼트",
    "숏크리트",
    "GNSS",
    "데이터로거",
    "균열계",
    "경사계",
    "진동계",
    "발파진동",
    "무응력계",
    "변형률계",
    "케이블",
    "받침",
    "신축이음",
    "piezometer",
    "inclinometer",
]

CLAUSE_RE = re.compile(r"\((\d+)\)")


def normalize_text(text: str) -> str:
    text = text.replace("\u2024", ".").replace("\u00b7", "·")
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return re.sub(r"[ \t]+", " ", text)


def find_pdf(prefix: str) -> Path | None:
    matches = sorted(BOOK.glob(f"{prefix}*.pdf"))
    return matches[0] if matches else None


def read_pdf_pages(path: Path) -> list[str]:
    reader = PdfReader(str(path))
    pages: list[str] = []
    for page in reader.pages:
        pages.append(normalize_text(page.extract_text() or ""))
    return pages


def page_hints(pages: list[str], needle: str) -> list[int]:
    hits = []
    for i, text in enumerate(pages):
        if needle in text:
            hits.append(i + 1)
    return hits[:8]


def extract_section_chunk(full: str, section_key: str, max_chars: int = 3500) -> str:
    """Grab text from first section_key hit until next sibling section."""
    parts = section_key.split(".")
    if len(parts) >= 2:
        parent = ".".join(parts[:-1])
        sibling_re = re.compile(
            rf"{re.escape(parent)}\.\d+(?:\.\d+)?|표\s*4\.1-\d+"
        )
    else:
        sibling_re = re.compile(r"4\.\d+(?:\.\d+)?|표\s*4\.1-\d+")

    key_re = re.compile(rf"{re.escape(section_key)}(?:\.\d+)?")
    m = key_re.search(full)
    if not m:
        return ""

    start = m.start()
    rest = full[m.end() :]
    end_offset = len(rest)
    for sm in sibling_re.finditer(rest):
        if sm.start() > 40:
            end_offset = sm.start()
            break
    chunk = full[start : m.end() + end_offset]
    return chunk[:max_chars].strip()


def candidate_bullets(chunk: str, limit: int = 12) -> list[dict]:
    bullets: list[dict] = []
    seen: set[str] = set()

    for m in CLAUSE_RE.finditer(chunk):
        idx = m.start()
        snippet = chunk[idx : idx + 220].strip()
        snippet = re.sub(r"\s+", " ", snippet)
        if len(snippet) < 25:
            continue
        key = snippet[:80]
        if key in seen:
            continue
        seen.add(key)
        bullets.append(
            {
                "text": snippet,
                "kind": "clause",
                "confidence": "medium",
            }
        )
        if len(bullets) >= limit:
            break

    if len(bullets) < 3:
        for kw in INSTRUMENT_KEYWORDS:
            if kw.lower() in chunk.lower() or kw in chunk:
                pos = chunk.lower().find(kw.lower()) if kw.isascii() else chunk.find(kw)
                if pos < 0:
                    continue
                snippet = chunk[max(0, pos - 40) : pos + 120].strip()
                snippet = re.sub(r"\s+", " ", snippet)
                key = snippet[:80]
                if key in seen or len(snippet) < 20:
                    continue
                seen.add(key)
                bullets.append(
                    {
                        "text": snippet,
                        "kind": "instrument_context",
                        "confidence": "low",
                    }
                )
                if len(bullets) >= limit:
                    break

    return bullets


def instrument_mentions(chunk: str) -> list[str]:
    found = []
    lower = chunk.lower()
    for kw in INSTRUMENT_KEYWORDS:
        if kw.isascii():
            if kw.lower() in lower:
                found.append(kw)
        elif kw in chunk:
            found.append(kw)
    return sorted(set(found))


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    mapping = json.loads(MAP_PATH.read_text(encoding="utf-8"))
    sources = []
    warnings = []

    for doc_id, cfg in mapping["documents"].items():
        pdf_path = find_pdf(cfg["pdfPrefix"])
        if not pdf_path:
            warnings.append(f"MISSING_PDF {doc_id} prefix={cfg['pdfPrefix']}")
            continue

        pages = read_pdf_pages(pdf_path)
        full = "\n".join(pages)
        sections_out = []

        for section_key, topic_file in cfg["sections"].items():
            chunk = extract_section_chunk(full, section_key)
            cite = f"§{section_key}"
            bullets = candidate_bullets(chunk) if chunk else []
            sections_out.append(
                {
                    "cite": cite,
                    "sectionKey": section_key,
                    "imageKnowledgeTopic": topic_file,
                    "pageHints": page_hints(pages, section_key),
                    "excerptChars": len(chunk),
                    "excerptPreview": chunk[:400] if chunk else "",
                    "candidateBullets": bullets,
                    "instrumentMentions": instrument_mentions(chunk),
                }
            )

        sources.append(
            {
                "docId": doc_id,
                "pdfFile": pdf_path.relative_to(ROOT).as_posix(),
                "pageCount": len(pages),
                "sections": sections_out,
            }
        )

    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "mapVersion": mapping.get("version", 1),
        "warnings": warnings,
        "sources": sources,
    }

    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    sec_count = sum(len(s["sections"]) for s in sources)
    bul_count = sum(
        len(sec["candidateBullets"])
        for s in sources
        for sec in s["sections"]
    )
    print(f"Wrote {OUT.relative_to(ROOT)} — {len(sources)} PDFs, {sec_count} sections, {bul_count} bullets")
    if warnings:
        for w in warnings:
            print(f"WARN {w}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
