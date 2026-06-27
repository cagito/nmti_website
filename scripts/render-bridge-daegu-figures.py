#!/usr/bin/env python3
"""Render IMG-103~110 bridge Daegu-gap figures."""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.bridge_daegu_draw import (  # noqa: E402
    render_img103,
    render_img104,
    render_img105,
    render_img106,
    render_img107,
    render_img108,
    render_img109,
    render_img110,
)

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"

JOBS = {
    "103": ("IMG-103_교량-상부구조-처짐-계측도_거더처짐계δ.png", render_img103),
    "104": ("IMG-104_처짐계-설치-측정-개념도_LVDT와이어.png", render_img104),
    "105": ("IMG-105_교량-케이블장력-계측도_사장교주파수법.png", render_img105),
    "106": ("IMG-106_케이블장력계-주파수법-설치-개념도.png", render_img106),
    "107": ("IMG-107_교량-변형률-응력-계측도_PSC강재휨응력.png", render_img107),
    "108": ("IMG-108_무응력계-설치-개념도_크리프보정.png", render_img108),
    "109": ("IMG-109_교량-풍향풍속-계측도_주탑교면.png", render_img109),
    "110": ("IMG-110_교량-받침부-변위-계측도_슬라이드회전.png", render_img110),
}


def save(img: Image.Image, filename: str) -> None:
    path = OUT / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    SOURCE.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, SOURCE / filename)
    print(f"Wrote {path}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--id", choices=list(JOBS.keys()) + ["all"], default="all")
    args = parser.parse_args()
    ids = list(JOBS.keys()) if args.id == "all" else [args.id]
    for iid in ids:
        filename, fn = JOBS[iid]
        save(fn(), filename)


if __name__ == "__main__":
    main()
