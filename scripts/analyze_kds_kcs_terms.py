# -*- coding: utf-8 -*-
"""Extract KDS/KCS terminology contexts for comparison with site content."""
from pypdf import PdfReader
import re
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "book" / "_kds_kcs_term_extract.json"

# (path, section_key, optional section markers for chunk extract)
FILES = [
    (ROOT / "book" / "KDS 11 10 15 지반계측(25.12).pdf", "KDS"),
    (ROOT / "book" / "KCS 11 10 15 시공 중 지반계측_(25. 12. 24).pdf", "KCS"),
    (ROOT / "book" / "KDS 27 50 10 터널 계측(23.09).pdf", "KDS_27_tunnel"),
    (ROOT / "book" / "KCS 24 99 05 교량계측시설(23.09).pdf", "KCS_24_bridge"),
    (ROOT / "book" / "KCS 54 20 25 댐 계측설비(18.08).pdf", "KCS_54_dam"),
]

COMMON_TERMS = [
    "내공변위",
    "천단침하",
    "천단",
    "수렴",
    "변위계",
    "침하계",
    "지표침하",
    "지표침하판",
    "지중경사계",
    "지반변위",
    "수평변위",
    "수직변위",
    "지중변위",
    "굴착면",
    "막장",
    "막장전방",
    "선행변위",
    "록볼트",
    "숏크리트",
    "강지보",
    "자동광파기",
    "수광변위계",
    "변위핀",
    "관리기준",
    "설계예상변위",
    "최대허용변위",
    "계측책임자",
    "데이터로거",
    "진동현식",
    "지하수위계",
    "간극수압계",
    "토압계",
    "하중계",
    "로드셀",
    "층별침하계",
    "가시설",
    "흙막이",
    "동바리",
    "발파진동",
    "내공변위계",
    "수렴량",
    "변형률계",
    "구조물경사계",
    "항만",
    "호안",
    "조위",
]

BRIDGE_TERMS = [
    "교량",
    "교각",
    "교대",
    "신축이음",
    "종방향",
    "횡변위",
    "온도",
    "지진",
    "진동",
    "처짐",
    "기초침하",
]

DAM_TERMS = [
    "댐",
    "제방",
    "간극수압",
    "누수",
    "유량",
    "온도",
    "지진",
    "변형률",
    "기울기",
    "침하",
    "제체",
]

SECTION_MARKERS = {
    "KCS": [("tunnel_3_5", r"3\.5\s*터널공사", 15000)],
    "KDS": [
        ("tunnel_markers", None, 0),  # special
    ],
    "KDS_27_tunnel": [("overview", "터널", 8000)],
    "KCS_24_bridge": [("overview", "교량", 8000)],
    "KCS_54_dam": [("overview", "댐", 8000)],
}


def terms_for_key(key: str) -> list[str]:
    terms = list(COMMON_TERMS)
    if "bridge" in key:
        terms.extend(BRIDGE_TERMS)
    if "dam" in key:
        terms.extend(DAM_TERMS)
    if "tunnel" in key or key in ("KDS", "KCS"):
        pass
    return sorted(set(terms))


def extract_hits(full_norm: str, terms: list[str]) -> dict:
    hits = {}
    for term in terms:
        contexts = []
        for m in re.finditer(re.escape(term), full_norm):
            start = max(0, m.start() - 100)
            end = min(len(full_norm), m.end() + 150)
            ctx = full_norm[start:end].replace("\n", " ")
            contexts.append(ctx)
        if contexts:
            hits[term] = contexts[:10]
    return hits


def extract_clause_index(full_norm: str, doc_key: str) -> dict:
    """§/표 단위 오프셋 인덱스 (docs/40 Phase 0.4 · validate-citations 교차검증용)."""
    sections: dict[str, list] = {}
    tables: dict[str, list] = {}

    sec_re = re.compile(r"(?<!\d)(\d{1,2}\.\d+(?:\.\d+)*)(?!\d)")
    for m in sec_re.finditer(full_norm):
        cite = f"§{m.group(1)}"
        if cite not in sections:
            sections[cite] = []
        if len(sections[cite]) >= 3:
            continue
        start = max(0, m.start() - 40)
        end = min(len(full_norm), m.end() + 120)
        sections[cite].append(
            {
                "offset": m.start(),
                "snippet": full_norm[start:end].strip(),
            }
        )

    tbl_re = re.compile(r"표\s*(\d+(?:\.\d+)*-\d+)")
    for m in tbl_re.finditer(full_norm):
        cite = f"표 {m.group(1)}"
        if cite not in tables:
            tables[cite] = []
        if len(tables[cite]) >= 3:
            continue
        start = max(0, m.start() - 40)
        end = min(len(full_norm), m.end() + 120)
        tables[cite].append(
            {
                "offset": m.start(),
                "snippet": full_norm[start:end].strip(),
            }
        )

    registry_cites = REGISTRY_CITES.get(doc_key, [])
    verified = []
    missing = []
    for raw in registry_cites:
        key = raw if raw.startswith("표") else raw
        bucket = tables if raw.startswith("표") else sections
        if key in bucket:
            verified.append({"cite": raw, "hits": len(bucket[key])})
        else:
            missing.append(raw)

    return {
        "sections": {k: v for k, v in sorted(sections.items())},
        "tables": {k: v for k, v in sorted(tables.items())},
        "registry_check": {"verified": verified, "missing": missing},
    }


# Registry cites to spot-check per PDF key (from kds-kcs-citation-registry.json)
REGISTRY_CITES = {
    "KDS": ["§4.1.1", "§4.1.5", "§4.1.6", "§4.1.8", "§4.1.9"],
    "KCS": ["§3", "§3.9", "표 3.5-1"],
    "KDS_27_tunnel": ["§4.1.5"],
    "KCS_24_bridge": ["§3.1", "§3.2"],
    "KCS_54_dam": ["§3"],
}


def main() -> int:
    sections = {}
    missing = []

    for path, key in FILES:
        if not path.exists():
            missing.append(path.name)
            continue
        reader = PdfReader(str(path))
        pages = [(page.extract_text() or "") for page in reader.pages]
        full = "\n".join(pages)
        full_norm = re.sub(r"[ \t]+", " ", full)

        terms = terms_for_key(key)
        sections[key] = {
            "source": path.name,
            "pages": len(reader.pages),
            "hits": extract_hits(full_norm, terms),
            "clause_index": extract_clause_index(full_norm, key),
        }

        for name, pattern, length in SECTION_MARKERS.get(key, []):
            if key == "KDS" and name == "tunnel_markers":
                chunks = []
                for marker in ["터널공사", "4.1.5", "내공변위", "천단침하", "강지보"]:
                    idx = full_norm.find(marker)
                    if idx >= 0:
                        chunks.append({"marker": marker, "text": full_norm[idx : idx + 5000]})
                sections["KDS_tunnel_markers"] = chunks
                continue
            if pattern:
                m = re.search(pattern, full_norm)
                if m:
                    sections[f"{key}_{name}"] = full_norm[m.start() : m.start() + length]

    sections["_meta"] = {
        "generated_by": "scripts/analyze_kds_kcs_terms.py",
        "missing_pdfs": missing,
    }

    OUT.write_text(json.dumps(sections, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT}")
    if missing:
        print("Missing PDFs:", ", ".join(missing))
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
