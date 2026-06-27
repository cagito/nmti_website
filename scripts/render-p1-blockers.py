#!/usr/bin/env python3
"""Render P1 audit-blocker hero figures (IMG-001, 015, 043).

IMG-002 is SVG-only — use scripts/render-svg-figures.py --id 002

Usage:
  python scripts/render-p1-blockers.py
  python scripts/render-p1-blockers.py --id 015
"""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.datalogger_draw import load_font, new_canvas  # noqa: E402
from lib.gnss_draw import render_img043  # noqa: E402
from lib.render_guard import enforce_render_policy  # noqa: E402
from lib.retaining_wall_draw import render_img001  # noqa: E402
from lib.slope_draw import render_img015  # noqa: E402

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"

JOBS = {
    "001": (
        "IMG-001_가시설-계측-전체-개념도_굴착단면계측항목.png",
        render_img001,
        "가시설 계측 전체 개념도",
    ),
    "015": (
        "IMG-015_사면-계측-전체-개념도_활동면지중경사계지하수위계.png",
        render_img015,
        "사면 계측 전체 개념도",
    ),
    "043": (
        "IMG-043_GNSS-변위-계측-개념도_기준국이동국서버연결.png",
        render_img043,
        "GNSS 변위 계측 개념도",
    ),
}


def save(img: Image.Image, filename: str) -> Path:
    path = OUT / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    SOURCE.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, SOURCE / filename)
    print(f"Wrote {path}")
    return path


BLOCKED_PILLOW = {"002"}


def render_one(suffix: str) -> None:
    if suffix in BLOCKED_PILLOW:
        raise SystemExit(
            f"IMG-{suffix} is SVG-only (P0). Use: python scripts/render-svg-figures.py --id {suffix}"
        )
    if suffix not in JOBS:
        raise SystemExit(f"Unknown id: {suffix}. Choose: {', '.join(JOBS)}")
    filename, fn, _title = JOBS[suffix]
    img, draw = new_canvas()
    fn(draw, load_font(34, bold=True))
    save(img, filename)


def main() -> None:
    parser = argparse.ArgumentParser(description="Render P1 blocker technology figures")
    parser.add_argument("--id", help="Render single ID suffix (001, 002, 015, 043)")
    parser.add_argument("--force-legacy-pillow", action="store_true", help="Override FT-A/B pillow block (emergency)")
    args = parser.parse_args()
    ids = [args.id.zfill(3) if args.id and len(args.id) <= 3 else args.id.replace("IMG-", "")] if args.id else list(JOBS)
    enforce_render_policy(ids, force=args.force_legacy_pillow)
    if args.id:
        render_one(ids[0])
    else:
        for suffix in JOBS:
            render_one(suffix)


if __name__ == "__main__":
    main()
