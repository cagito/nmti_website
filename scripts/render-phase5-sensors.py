#!/usr/bin/env python3
"""Render Phase 5 P2 sensor figures (IMG-025, 030, 031, 034, 035).

Usage:
  python scripts/render-phase5-sensors.py
  python scripts/render-phase5-sensors.py --id 025
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
from lib.earth_pressure_draw import render_img034  # noqa: E402
from lib.inclinometer_system_draw import render_img025  # noqa: E402
from lib.load_cell_overview_draw import render_img035  # noqa: E402
from lib.render_guard import enforce_render_policy  # noqa: E402
from lib.sensor_install_draw import render_img030, render_img031  # noqa: E402

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"

JOBS = {
    "025": ("IMG-025_지중경사계-시스템-구성도_ProbeCableReadoutCasing.png", render_img025),
    "030": ("IMG-030_지하수위계-설치-개념도_관측공수위센서케이블보호함.png", render_img030),
    "031": ("IMG-031_간극수압계-설치도_필터그라우트케이블.png", render_img031),
    "034": ("IMG-034_토압계-설치-개념도_흙막이배면성토부.png", render_img034),
    "035": ("IMG-035_하중계-설치-개념도_버팀보앵커하중전달.png", render_img035),
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
        raise SystemExit(f"Unknown id: {suffix}. Choose: {', '.join(JOBS)}")
    filename, fn = JOBS[suffix]
    img, draw = new_canvas()
    fn(draw, load_font(34, bold=True))
    save(img, filename)


def main() -> None:
    parser = argparse.ArgumentParser(description="Render Phase 5 sensor figures")
    parser.add_argument("--id", help="025, 030, 031, 034, 035")
    parser.add_argument("--force-legacy-pillow", action="store_true", help="Override FT-A/B pillow block (emergency)")
    args = parser.parse_args()
    ids = [args.id.replace("IMG-", "").zfill(3)] if args.id else list(JOBS)
    enforce_render_policy(ids, force=args.force_legacy_pillow)
    if args.id:
        render_one(ids[0])
    else:
        for suffix in JOBS:
            render_one(suffix)


if __name__ == "__main__":
    main()
