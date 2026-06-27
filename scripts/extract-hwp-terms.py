#!/usr/bin/env python3
"""Extract HWP/PDF standard text and match monitoring keywords vs web nodes.

Usage: python scripts/extract-hwp-terms.py
Output: docs/book-hwp-terms-audit.json, book/HWP_TERMS.md
"""
from __future__ import annotations

import json
import re
from pathlib import Path

try:
    import olefile
except ImportError as exc:
    raise SystemExit("pip install olefile") from exc

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
BOOK = ROOT / "book"
OUT_JSON = ROOT / "docs" / "book-hwp-terms-audit.json"
OUT_MD = BOOK / "HWP_TERMS.md"
TERM_EXTRACT = BOOK / "_kds_kcs_term_extract.json"

FILE_TO_NODES = {
    "KCS 11 10 15": ["fields/retaining-excavation", "sensors/inclinometer"],
    "KDS 11 10 15": ["fields/retaining-excavation", "intro"],
    "KCS 24 99 05": ["fields/bridge"],
    "KCS 54 20 25": ["fields/dam", "fields/dam/river-levee"],
    "KDS 27 50 10": ["fields/tunnel", "fields/tunnel/blast-vibration"],
}

KEYWORD_TO_NODE = {
    "지중경사계": "sensors/inclinometer",
    "지하수위계": "sensors/water-level-meter",
    "간극수압계": "sensors/piezometer",
    "침하계": "sensors/settlement-gauge",
    "하중계": "sensors/load-cell",
    "로드셀": "fields/retaining-excavation/anchor",
    "변위계": "sensors/displacement-transducer",
    "내공변위": "fields/tunnel/convergence",
    "천단침하": "fields/tunnel/crown-settlement",
    "막장전방": "fields/tunnel/face-advance",
    "발파진동": "fields/tunnel/blast-vibration",
    "록볼트": "fields/tunnel/rockbolt",
    "숏크리트": "fields/tunnel/shotcrete",
    "강지보": "fields/tunnel/steel-support",
    "하천제방": "fields/dam/river-levee",
    "제방": "fields/dam",
    "진동계": "sensors/vibration-meter",
    "변형률계": "sensors/strain-gauge",
    "데이터로거": "sensors/datalogger",
    "계측책임자": "intro",
    "흙막이": "fields/retaining-excavation",
    "어스앵커": "fields/retaining-excavation/anchor",
    "버팀보": "fields/retaining-excavation/strut",
    "GNSS": "sensors/gnss",
    "GPS": "sensors/gnss",
    "RTK": "sensors/gnss",
    "자동광파기": "sensors/automated-total-station",
    "가시설": "fields/retaining-excavation",
    "터널 계측": "fields/tunnel",
    "교량계측": "fields/bridge",
    "댐계측": "fields/dam",
}


def clean_prvtext(raw: bytes) -> str:
    text = raw.decode("utf-16-le", errors="ignore")
    text = text.replace("<", " ").replace(">", " ")
    return re.sub(r"\s+", " ", text).strip()


def pdf_text(path: Path) -> str:
    reader = PdfReader(str(path))
    return re.sub(r"\s+", " ", "\n".join((p.extract_text() or "") for p in reader.pages))


def match_keywords(text: str) -> dict[str, str]:
    return {kw: node for kw, node in KEYWORD_TO_NODE.items() if kw in text}


PDF_ONLY_NODES = {
    "GNSS.pdf": ["sensors/gnss"],
}


def extract_pdf_only(path: Path) -> dict:
    pt = pdf_text(path)
    kw = match_keywords(pt)
    file_nodes = PDF_ONLY_NODES.get(path.name, [])
    return {
        "file": path.name,
        "pdf_pair": None,
        "prv_chars": 0,
        "pdf_chars": len(pt),
        "keywords": kw,
        "file_nodes": file_nodes,
        "preview": pt[:300],
    }


def nodes_from_filename(name: str) -> list[str]:
    out: list[str] = []
    for prefix, nodes in FILE_TO_NODES.items():
        if prefix in name:
            out.extend(nodes)
    return sorted(set(out))


def extract_hwp(path: Path) -> dict:
    ole = olefile.OleFileIO(str(path))
    try:
        preview = clean_prvtext(ole.openstream("PrvText").read()) if ole.exists("PrvText") else ""
    finally:
        ole.close()

    pdf_path = path.with_suffix(".pdf")
    pdf_kw: dict[str, str] = {}
    pdf_chars = 0
    if pdf_path.is_file():
        pt = pdf_text(pdf_path)
        pdf_chars = len(pt)
        pdf_kw = match_keywords(pt)

    prv_kw = match_keywords(preview)
    file_nodes = nodes_from_filename(path.name)
    merged = {**prv_kw, **pdf_kw}
    return {
        "file": path.name,
        "pdf_pair": pdf_path.name if pdf_path.is_file() else None,
        "prv_chars": len(preview),
        "pdf_chars": pdf_chars,
        "keywords": merged,
        "file_nodes": file_nodes,
        "preview": preview[:300],
    }


def load_term_extract_hits() -> dict[str, list[str]]:
    if not TERM_EXTRACT.is_file():
        return {}
    data = json.loads(TERM_EXTRACT.read_text(encoding="utf-8"))
    out: dict[str, list[str]] = {}
    for section in ("KDS", "KCS"):
        hits = data.get(section, {}).get("hits", {})
        if isinstance(hits, dict):
            for term in hits:
                if term in KEYWORD_TO_NODE:
                    out.setdefault(term, []).append(KEYWORD_TO_NODE[term])
    return out


def main() -> int:
    dictionary = (ROOT / "js" / "technology" / "dictionary.js").read_text(encoding="utf-8")
    rows = [extract_hwp(p) for p in sorted(BOOK.glob("*.hwp"))]
    for pdf_name in PDF_ONLY_NODES:
        pdf_path = BOOK / pdf_name
        if pdf_path.is_file():
            rows.append(extract_pdf_only(pdf_path))
    rows.sort(key=lambda r: r["file"])
    term_hits = load_term_extract_hits()

    all_nodes: set[str] = set()
    for r in rows:
        all_nodes.update(r["keywords"].values())
        all_nodes.update(r["file_nodes"])
    all_nodes.update(n for nodes in term_hits.values() for n in nodes)

    missing_in_web = sorted(
        n for n in all_nodes if n != "intro" and f"'{n}'" not in dictionary and f'"{n}"' not in dictionary
    )

    payload = {
        "files": rows,
        "term_extract_hits": term_hits,
        "keyword_map_size": len(KEYWORD_TO_NODE),
        "nodes_matched": sorted(all_nodes),
        "missing_in_dictionary": missing_in_web,
    }
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# HWP·PDF 용어 추출·웹 노드 대조",
        "",
        "> `npm run extract:hwp-terms`",
        "",
        f"| HWP | {len(rows)}건 |",
        f"| 매칭 노드 | {len(all_nodes)}종 |",
        f"| dictionary 누락 | {len(missing_in_web)}건 |",
        f"| _kds_kcs_term_extract 용어 | {len(term_hits)}종 |",
        "",
    ]
    if term_hits:
        lines.append("## KDS/KCS PDF 추출 용어 → 웹 노드")
        for term, nodes in sorted(term_hits.items()):
            lines.append(f"- **{term}** → {', '.join(f'`{n}`' for n in sorted(set(nodes)))}")
        lines.append("")

    for row in rows:
        lines.append(f"## `{row['file']}`")
        if row["pdf_pair"]:
            lines.append(f"- PDF: `{row['pdf_pair']}` ({row['pdf_chars']}자)")
        if row["file_nodes"]:
            lines.append(f"- 파일 매핑: {', '.join(f'`{n}`' for n in row['file_nodes'])}")
        if row["keywords"]:
            for kw, node in sorted(row["keywords"].items()):
                lines.append(f"- **{kw}** → `{node}`")
        else:
            lines.append("- (PDF·PrvText 키워드 미매칭)")
        lines.append("")

    lines.extend(
        [
            "## 한계",
            "",
            "- HWP BodyText 전문은 별도 디코더 필요",
            "- PDF 페어가 있는 KDS/KCS는 pypdf 본문 키워드 매칭",
            "- PDF 단독: `GNSS.pdf` → `sensors/gnss`",
            "",
            "JSON: [book-hwp-terms-audit.json](../docs/book-hwp-terms-audit.json)",
        ]
    )
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {OUT_JSON}")
    print(f"Wrote {OUT_MD}")
    print(f"files={len(rows)} nodes={len(all_nodes)} term_hits={len(term_hits)} missing={len(missing_in_web)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
