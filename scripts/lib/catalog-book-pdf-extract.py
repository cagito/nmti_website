# -*- coding: utf-8 -*-
"""Extract PDF metadata for catalog-book-pdf.mjs (stdin: JSON paths, stdout: JSON results)."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from pypdf import PdfReader

KEYWORD_TO_TOPIC = {
    "지중경사계": "지중경사계",
    "IPI": "지중경사계",
    "inclinometer": "지중경사계",
    "Inclinometer": "지중경사계",
    "지하수위계": "지하수위계",
    "간극수압계": "간극수압계",
    "piezometer": "간극수압계",
    "Piezometer": "간극수압계",
    "침하계": "침하·침하측정",
    "settlement": "침하·침하측정",
    "Settlement": "침하·침하측정",
    "하중계": "하중계",
    "load cell": "하중계",
    "변위계": "변위계",
    "내공변위": "터널 내공변위",
    "convergence": "터널 내공변위",
    "천단침하": "천단침하",
    "crown": "천단침하",
    "록볼트": "록볼트",
    "rockbolt": "록볼트",
    "숏크리트": "숏크리트",
    "shotcrete": "숏크리트",
    "발파진동": "발파진동",
    "GNSS": "GNSS",
    "GPS": "GNSS",
    "RTK": "GNSS",
    "데이터로거": "데이터 수집",
    "data logger": "데이터 수집",
    "datalogger": "데이터 수집",
    "흙막이": "흙막이·가시설",
    "어스앵커": "어스앵커",
    "anchor": "어스앵커",
    "버팀보": "버팀보",
    "strut": "버팀보",
    "교량": "교량 계측",
    "댐": "댐 계측",
    "터널": "터널 계측",
    "tunnel": "터널 계측",
    "Tunnel": "터널 계측",
}


def sparse_pages(text_by_page: list[str], threshold: int = 80) -> list[int]:
    return [i + 1 for i, t in enumerate(text_by_page) if len((t or "").strip()) < threshold]


def figure_hint_pages(text_by_page: list[str]) -> list[int]:
    hints: list[int] = []
    fig_re = re.compile(r"(그림|Figure|Fig\.|도\s*면|설치|배치|단면|SECTION)", re.I)
    for i, t in enumerate(text_by_page):
        if fig_re.search(t or ""):
            hints.append(i + 1)
    return hints[:30]


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stdin, "reconfigure"):
        sys.stdin.reconfigure(encoding="utf-8", errors="replace")

    paths = json.loads(sys.stdin.read())
    out = []
    for rel in paths:
        p = Path(rel)
        item = {
            "relativePath": rel.replace("\\", "/"),
            "fileName": p.name,
            "pageCount": 0,
            "extractedChars": 0,
            "readError": None,
            "keywords": [],
            "topics": [],
            "sparseTextPages": [],
            "figureHintPages": [],
        }
        try:
            reader = PdfReader(str(p))
            pages_text = [(page.extract_text() or "") for page in reader.pages]
            norm = re.sub(r"\s+", " ", "\n".join(pages_text))
            item["pageCount"] = len(reader.pages)
            item["extractedChars"] = len(norm)
            found = []
            topics = set()
            for kw, topic in KEYWORD_TO_TOPIC.items():
                if kw in norm:
                    found.append(kw)
                    topics.add(topic)
            item["keywords"] = sorted(set(found))
            item["topics"] = sorted(topics)
            item["sparseTextPages"] = sparse_pages(pages_text)
            item["figureHintPages"] = figure_hint_pages(pages_text)
        except Exception as e:  # noqa: BLE001
            item["readError"] = str(e)
        out.append(item)
    print(json.dumps(out, ensure_ascii=False))


if __name__ == "__main__":
    main()
