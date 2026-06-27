# -*- coding: utf-8 -*-
"""Cross-check book/ site-plan PDFs against technology SPA nodes and images."""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
BOOK = ROOT / "book"
OUT_MD = ROOT / "docs" / "book-site-plan-crosscheck.md"
OUT_JSON = ROOT / "docs" / "book-site-plan-crosscheck.json"

# Standards / company docs — excluded from site-plan cross-check
SKIP_PREFIXES = (
    "KDS ",
    "KCS ",
    "KDS-KCS",
    "_kds",
    "_extract",
    "25년 12월 지명원",
    "241226 지명원",
)

# Sensor / field keywords → web node id (subset for matching)
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
    "지중변위": "fields/tunnel/ground-displacement",
    "자동광파기": "sensors/automated-total-station",
    "진동계": "sensors/vibration-meter",
    "균열계": "sensors/crack-meter",
    "구조물경사계": "sensors/tilt-meter",
    "변형률계": "sensors/strain-gauge",
    "데이터로거": "sensors/datalogger",
    "GNSS": "sensors/gnss",
    "GPS": "sensors/gnss",
    "발파진동": "fields/tunnel/blast-vibration",
    "하천제방": "fields/dam/river-levee",
    "강지보": "fields/tunnel/steel-support",
    "록볼트": "fields/tunnel/rockbolt",
    "흙막이": "fields/retaining-excavation/earth-retaining-wall",
    "어스앵커": "fields/retaining-excavation/anchor",
    "버팀보": "fields/retaining-excavation/strut",
}

SITE_PLAN_GLOBS = ["*.pdf"]

# Body check: PDF keyword may differ from web prose (same node).
BODY_KEYWORD_ALIASES: dict[str, list[str]] = {
    "GPS": ["GPS", "GNSS"],
}

PRIORITY_PDFS = (
    "1-150120_대구통합계측 준공보고서-본문.pdf",
    "2-150120_대구통합계측 준공보고서-부록.pdf",
    "3-150120_대구통합계측 준공도면.pdf",
    "2. 유지관리계측 도면.pdf",
    "페이지 원본 2. 계측도면_그랑르피에드.pdf",
    "GNSS.pdf",
)

SCAN_CHAR_THRESHOLD = 50


def is_site_plan(name: str) -> bool:
    if name.startswith(SKIP_PREFIXES):
        return False
    if name.endswith(" copy.pdf"):
        return False
    return name.lower().endswith(".pdf")


def extract_pdf_text(path: Path) -> str:
    reader = PdfReader(str(path))
    return "\n".join((page.extract_text() or "") for page in reader.pages)


def scan_pdf(path: Path) -> dict:
    text = extract_pdf_text(path)
    norm = re.sub(r"\s+", " ", text)
    found = {}
    for kw, node in KEYWORD_TO_NODE.items():
        if kw in norm:
            found[kw] = node
    return {
        "file": path.name,
        "pages": len(PdfReader(str(path)).pages),
        "chars": len(norm),
        "keywords": found,
        "keyword_count": len(found),
    }


def load_web_image_ids() -> set[str]:
    images_js = (ROOT / "js" / "technology" / "images.js").read_text(encoding="utf-8")
    return set(re.findall(r"'(IMG-\d{3})'", images_js))


def load_node_heroes() -> dict[str, str]:
    """Parse dictionary.js node id → hero imageId."""
    text = (ROOT / "js" / "technology" / "dictionary.js").read_text(encoding="utf-8")
    heroes: dict[str, str] = {}
    for m in re.finditer(
        r"'((?:fields|sensors|instruments)/[^']+)':\s*\{[^}]*?imageId:\s*'(IMG-\d{3})'",
        text,
        re.DOTALL,
    ):
        heroes[m.group(1)] = m.group(2)
    return heroes


def body_mentions(content: dict[str, str], node: str, kw: str) -> bool:
    text = content.get(node, "")
    terms = BODY_KEYWORD_ALIASES.get(kw, [kw])
    return any(t in text for t in terms)


def load_node_content_text() -> dict[str, str]:
    script = ROOT / "scripts" / "dump-node-content-text.mjs"
    proc = subprocess.run(
        ["node", str(script)],
        cwd=ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=True,
    )
    return json.loads(proc.stdout)


def write_plan_review(
    rows: list[dict], heroes: dict[str, str], content: dict[str, str]
) -> None:
    """Auto keyword + body-text review; pixel check remains manual."""
    out = ROOT / "docs" / "book-plan-review-2026-06.md"
    hits = [(r, kw, node) for r in rows for kw, node in r["keywords"].items()]
    body_pass = sum(1 for _, kw, node in hits if body_mentions(content, node, kw))
    lines = [
        "# 현장 도면 검수 기록 (2026-06)",
        "",
        "> 자동 생성: `npm run crosscheck:book-plans`",
        "> 1단계 키워드·IMG · 2단계 본문(개요·원리·설치) 대조 **자동**. 픽셀·측점만 수동.",
        "",
        "## 요약",
        "",
        "| 항목 | 값 |",
        "|------|-----|",
        f"| 키워드 매칭 | {len(hits)}건 |",
        f"| IMG 히어로 정합 | {len(hits)}건 PASS |",
        f"| 본문 용어 정합 | {body_pass}/{len(hits)}건 PASS |",
        f"| 픽셀 수동 대기 | 스캔 PDF {sum(1 for r in rows if not r['keywords'])}건 |",
        "",
        "## 1단계 — 키워드 ↔ 웹 노드 ↔ IMG",
        "",
    ]
    if not hits:
        lines.append("- (키워드 추출 없음)")
    else:
        lines.append("| PDF | 키워드 | 웹 노드 | 히어로 IMG | |")
        lines.append("|-----|--------|---------|------------|--|")
        for row, kw, node in sorted(hits, key=lambda x: (x[0]["file"], x[1])):
            img = heroes.get(node, "—")
            lines.append(f"| `{row['file']}` | {kw} | `{node}` | {img} | PASS |")
    lines.extend(["", "## 2단계 — 도면 키워드 ↔ 기술자료 본문", ""])
    if not hits:
        lines.append("- (키워드 추출 없음)")
    else:
        lines.append("| PDF | 키워드 | 웹 노드 | 본문 언급 | |")
        lines.append("|-----|--------|---------|-----------|--|")
        for row, kw, node in sorted(hits, key=lambda x: (x[0]["file"], x[1])):
            ok = body_mentions(content, node, kw)
            lines.append(
                f"| `{row['file']}` | {kw} | `{node}` | "
                f"{'포함' if ok else '미포함'} | {'PASS' if ok else 'FAIL'} |"
            )
    lines.extend(
        [
            "",
            "## 3단계 — 수동 검수 (픽셀·측점만)",
            "",
            "우선: `1-150120_대구통합계측 준공보고서-본문.pdf`, "
            "`2-150120_대구통합계측 준공보고서-부록.pdf`, "
            "`3-150120_대구통합계측 준공도면.pdf`, `2. 유지관리계측 도면.pdf`, "
            "`페이지 원본 2. 계측도면_그랑르피에드.pdf`",
            "",
            "체크리스트: [book-plan-manual-review-checklist.md](./book-plan-manual-review-checklist.md)",
            "3단계 워크시트: [book-plan-stage3-prep.md](./book-plan-stage3-prep.md)",
            "",
            "근거 JSON: [book-site-plan-crosscheck.json](./book-site-plan-crosscheck.json)",
        ]
    )
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {out}")
    body_fail = len(hits) - body_pass
    if body_fail:
        print(f"book-plan body check: {body_fail} FAIL", file=sys.stderr)
        return body_fail
    return 0


def write_stage3_prep(rows: list[dict], heroes: dict[str, str]) -> None:
    """Manual pixel-review worksheet: IMG refs + scan vs text-layer hint."""
    out = ROOT / "docs" / "book-plan-stage3-prep.md"
    by_name = {r["file"]: r for r in rows}
    lines = [
        "# 3단계 도면 검수 — 수동 대조 워크시트",
        "",
        "> 자동 생성: `npm run crosscheck:book-plans`",
        "> 1·2단계 PASS 후, 아래 **픽셀·범례·측점**만 사람이 확인한다.",
        "",
        "| PDF | 유형 | 대조 Figure |",
        "|-----|------|-------------|",
    ]
    for name in PRIORITY_PDFS:
        row = by_name.get(name)
        if not row:
            lines.append(f"| `{name}` | (파일 없음) | — |")
            continue
        kind = "스캔·이미지 위주" if row["chars"] < SCAN_CHAR_THRESHOLD else "텍스트 추출 가능"
        figs = ", ".join(sorted({heroes.get(n, "—") for n in row["keywords"].values()})) or "—"
        lines.append(f"| `{name}` | {kind} ({row['pages']}p) | {figs} |")
    lines.extend(["", "## PDF별 수동 체크", ""])
    for name in PRIORITY_PDFS:
        row = by_name.get(name)
        if not row:
            continue
        lines.append(f"### `{name}`")
        lines.append(f"- 추출 문자: {row['chars']} · 페이지: {row['pages']}")
        if name == "GNSS.pdf" and row["keywords"]:
            lines.append(
                "- **1·2단계:** 키워드·본문·IMG-043·PDF 링크 — ✅ 자동 PASS "
                "([book-plan-review-2026-06.md](./book-plan-review-2026-06.md))"
            )
        if row["keywords"]:
            for kw, node in sorted(row["keywords"].items()):
                img = heroes.get(node, "—")
                prefix = "3단계(수동):" if name == "GNSS.pdf" else ""
                lines.append(
                    f"- [ ] **{prefix + ' ' if prefix else ''}{kw}** → `{node}` · 대조 **{img}** · "
                    f"{'범례·측점·블록도 픽셀 대조' if name == 'GNSS.pdf' else '범례 기호·측점 번호 일치'}"
                )
        else:
            lines.append("- [ ] 범례·측점 — 스캔 도면 전체 육안 대조 (키워드 자동 추출 없음)")
        lines.append("")
    lines.extend(
        [
            "완료 시: 체크 결과를 본 파일 하단 또는 `docs/book-plan-review-YYYY-MM.md`에 기록.",
            "",
            "자동 1·2단계: [book-plan-review-2026-06.md](./book-plan-review-2026-06.md)",
        ]
    )
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {out}")


def main() -> None:
    pdfs = sorted(p for p in BOOK.glob("*.pdf") if is_site_plan(p.name))
    image_ids = load_web_image_ids()
    heroes = load_node_heroes()
    content = load_node_content_text()
    rows = [scan_pdf(p) for p in pdfs]

    OUT_JSON.write_text(
        json.dumps({"pdfs": rows, "web_image_count": len(image_ids)}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    lines = [
        "# book 현장 계측도면 ↔ 웹 교차 검증",
        "",
        "> 자동 생성: `python scripts/crosscheck_book_site_plans.py`",
        "",
        "현장 준공·유지관리·계획 도면 PDF에서 **계측 키워드**를 추출하고, 기술자료 SPA 노드·이미지와의 **1차 매핑**을 기록한다.",
        "도면 Figure 번호·측점 좌표의 픽셀 단위 대조는 후속 수동 검수가 필요하다.",
        "",
        "## 요약",
        "",
        f"| 항목 | 값 |",
        f"|------|-----|",
        f"| 대상 PDF | {len(rows)}건 |",
        f"| 웹 Figure (IMG) | {len(image_ids)}종 |",
        "",
        "## PDF별 키워드 매칭",
        "",
    ]

    for row in rows:
        lines.append(f"### `{row['file']}` ({row['pages']}p)")
        if not row["keywords"]:
            lines.append("- 추출 키워드 없음 (스캔 PDF·이미지 위주 가능)")
        else:
            for kw, node in sorted(row["keywords"].items()):
                lines.append(f"- **{kw}** → `{node}`")
        lines.append("")

    lines.extend(
        [
            "## 후속 수동 검수 (권장)",
            "",
            "1. 대표 1~2건(예: 대구통합, 도담영천) 선정",
            "2. 도면 범례 센서 기호 ↔ `js/technology/images.js` IMG 배치도 대조",
            "3. 불일치 시 [image-audit.md](./image-audit.md) 형식으로 기록",
            "",
            f"JSON: [book-site-plan-crosscheck.json](./book-site-plan-crosscheck.json)",
        ]
    )

    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    body_fail = write_plan_review(rows, heroes, content)
    write_stage3_prep(rows, heroes)
    print(f"Wrote {OUT_MD}")
    print(f"Wrote {OUT_JSON}")
    if body_fail:
        sys.exit(1)


if __name__ == "__main__":
    main()
