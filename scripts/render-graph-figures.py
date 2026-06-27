#!/usr/bin/env python3
"""Render graph / process FT-C figures IMG-018·029·044·046·049~055·057·059."""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from lib.datalogger_draw import load_font, new_canvas  # noqa: E402
from lib.graph_figure_draw import (  # noqa: E402
    render_img018,
    render_img029,
    render_img044,
    render_img046,
    render_img049,
    render_img050,
    render_img051,
    render_img052,
    render_img053,
    render_img054,
    render_img055,
    render_img057,
    render_img059,
)

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"

JOBS = {
    "018": ("IMG-018_강우-지하수위-변위-상관도_강우후수위상승변위증가.png", render_img018),
    "029": ("IMG-029_지중경사계-데이터-해석도_IncrementalCumulative활동면.png", render_img029),
    "044": ("IMG-044_기상계측기-구성도_강우량풍향온습도기압.png", render_img044),
    "046": ("IMG-046_IoT-게이트웨이-구성도_현장센서서버통신중계.png", render_img046),
    "049": ("IMG-049_변위-그래프-예시_관리기준선실시간추세.png", render_img049),
    "050": ("IMG-050_침하-그래프-예시_시간침하곡선예측선.png", render_img050),
    "051": ("IMG-051_간극수압-소산-그래프_성토단계상승소산.png", render_img051),
    "052": ("IMG-052_하중-변화-그래프_버팀보하중경보기준선.png", render_img052),
    "053": ("IMG-053_진동-계측-그래프_PPV기준선표현.png", render_img053),
    "054": ("IMG-054_경보-단계-프로세스_정상주의경고위험조치.png", render_img054),
    "055": ("IMG-055_모바일-경보-알림-화면_휴대폰경보표현.png", render_img055),
    "057": ("IMG-057_자동-보고서-생성-흐름도_계측데이터PDF보고서.png", render_img057),
    "059": ("IMG-059_관리기준-설정-개념도_센서별기준치경보조건.png", render_img059),
}


def save(img: Image.Image, filename: str) -> None:
    path = OUT / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    SOURCE.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, SOURCE / filename)
    print(f"Wrote {path}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--id", choices=list(JOBS.keys()) + ["all"], default="all")
    args = parser.parse_args()
    ids = list(JOBS.keys()) if args.id == "all" else [args.id]
    for suffix in ids:
        filename, fn = JOBS[suffix]
        img, draw = new_canvas()
        fn(draw, load_font(34, bold=True))
        save(img, filename)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
