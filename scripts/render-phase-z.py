#!/usr/bin/env python3
"""Phase Z — external ZIP audit figure re-render (10 IDs).

Usage:
  python scripts/render-phase-z.py
  python scripts/render-phase-z.py --id 008
  python scripts/render-phase-z.py --force-legacy-pillow
"""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.datalogger_draw import load_font, new_canvas  # noqa: E402
from lib.data_qc_draw import render_img060  # noqa: E402
from lib.earth_pressure_draw import render_img034  # noqa: E402
from lib.field_heroes_draw import render_img080  # noqa: E402
from lib.gnss_draw import render_img043  # noqa: E402
from lib.render_guard import enforce_render_policy  # noqa: E402
from lib.settlement_plate_draw import render_img032  # noqa: E402
from lib.slope_draw import render_img015  # noqa: E402
from lib.tunnel_convergence_draw import render_img008  # noqa: E402
from lib.tunnel_support_draw import render_img009, render_img078  # noqa: E402
from lib.vibration_draw import render_img041  # noqa: E402

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"

DRAW_JOBS = {
    "008": ("IMG-008_터널-전단면-내공변위-측정시스템_상부아치내공변위.png", render_img008),
    "015": ("IMG-015_사면-계측-전체-개념도_활동면지중경사계지하수위계.png", render_img015),
    "032": ("IMG-032_침하판-침하계-설치-개념도_성토하부연장봉보호관.png", render_img032),
    "034": ("IMG-034_토압계-설치-개념도_흙막이배면성토부.png", render_img034),
    "041": ("IMG-041_진동계-설치-개념도_구조물지반3축방향.png", render_img041),
    "043": ("IMG-043_GNSS-변위-계측-개념도_기준국이동국서버연결.png", render_img043),
    "060": ("IMG-060_데이터-품질관리-흐름도_수집검증보정분석보고.png", render_img060),
}

CALLABLE_JOBS = {
    "009": ("IMG-009_록볼트-축력-숏크리트-응력-계측도_지보재거동센서.png", render_img009),
    "078": ("IMG-078_록볼트-축력-계측-개념도_축력계변형률계.png", render_img078),
    "080": ("IMG-080_강지보-응력-계측-개념도_스틸세트변형률계.png", render_img080),
}


def save(img: Image.Image, filename: str) -> None:
    path = OUT / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    SOURCE.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, SOURCE / filename)
    print(f"Wrote {path}")


def render_draw(suffix: str) -> None:
    filename, fn = DRAW_JOBS[suffix]
    img, draw = new_canvas()
    fn(draw, load_font(34, bold=True))
    save(img, filename)


def render_callable(suffix: str) -> None:
    filename, fn = CALLABLE_JOBS[suffix]
    save(fn(), filename)


def main() -> None:
    parser = argparse.ArgumentParser(description="Render Phase Z ZIP-audit figures")
    parser.add_argument("--id", help="008, 009, 015, 032, 034, 041, 043, 060, 078, 080")
    parser.add_argument("--force-legacy-pillow", action="store_true")
    args = parser.parse_args()

    all_ids = list(DRAW_JOBS) + list(CALLABLE_JOBS)
    ids = [args.id.replace("IMG-", "").zfill(3)] if args.id else all_ids
    enforce_render_policy(ids, force=args.force_legacy_pillow)

    for suffix in ids:
        if suffix in DRAW_JOBS:
            render_draw(suffix)
        elif suffix in CALLABLE_JOBS:
            render_callable(suffix)
        else:
            raise SystemExit(f"Unknown id: {suffix}")


if __name__ == "__main__":
    main()
