#!/usr/bin/env python3
"""Render building field audit figures: IMG-099~101, 081~082."""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.building_deflection_draw import render_img099  # noqa: E402
from lib.building_field_draw import (  # noqa: E402
    render_img081,
    render_img082,
    render_img100,
    render_img101,
)
from lib.datalogger_draw import load_font, new_canvas  # noqa: E402
from lib.render_guard import enforce_render_policy  # noqa: E402

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"

JOBS = {
    "081": ("IMG-081_기둥-축소량-계측-개념도_수직변형률계.png", render_img081),
    "082": ("IMG-082_건축-응력변형률-계측-개념도_중대부재하중계.png", render_img082),
    "099": (
        "IMG-099_건축-구조물-처짐-계측-개념도_RC골조LVDT처짐그래프.png",
        render_img099,
    ),
    "100": ("IMG-100_건축공사-계측-전체-개념도_KCS39처짐축소균열.png", render_img100),
    "101": ("IMG-101_건축공사-주변건물-계측-개념도_신축인접균열경사ATS.png", render_img101),
}


def save(img: Image.Image, filename: str) -> Path:
    path = OUT / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    SOURCE.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, SOURCE / filename)
    print(f"Wrote {path}")
    return path


def render_one(suffix: str) -> None:
    if suffix not in JOBS:
        raise SystemExit(f"Unknown id: {suffix}. Choose: {', '.join(sorted(JOBS))}")
    filename, fn = JOBS[suffix]
    img, draw = new_canvas()
    fn(draw, load_font(34, bold=True))
    save(img, filename)


def main() -> None:
    parser = argparse.ArgumentParser(description="Render building field figures")
    parser.add_argument("--id", help="081, 082, 099, 100, 101 or all")
    parser.add_argument("--force-legacy-pillow", action="store_true")
    args = parser.parse_args()
    if args.id and args.id.lower() != "all":
        suffixes = [args.id.replace("IMG-", "").zfill(3)]
    else:
        suffixes = sorted(JOBS)
    enforce_render_policy(suffixes, force=args.force_legacy_pillow)
    for suffix in suffixes:
        render_one(suffix)


if __name__ == "__main__":
    main()
