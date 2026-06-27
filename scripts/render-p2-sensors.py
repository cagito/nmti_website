#!/usr/bin/env python3
"""Render P2 sensor installation figures (IMG-030, 031, 037, 038, 042).

Usage:
  python scripts/render-p2-sensors.py
  python scripts/render-p2-sensors.py --id 030
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
from lib.render_guard import enforce_render_policy  # noqa: E402
from lib.sensor_install_draw import (  # noqa: E402
    render_img030,
    render_img031,
    render_img037,
    render_img038,
    render_img042,
)

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"

JOBS = {
    "030": ("IMG-030_지하수위계-설치-개념도_관측공수위센서케이블보호함.png", render_img030),
    "031": ("IMG-031_간극수압계-설치도_필터그라우트케이블.png", render_img031),
    "037": ("IMG-037_균열계-설치-개념도_균열양측앵커변위측정.png", render_img037),
    "038": ("IMG-038_구조물-경사계-설치도_벽체교각표면.png", render_img038),
    "042": ("IMG-042_자동광파기-계측-개념도_TotalStation프리즘좌표변위.png", render_img042),
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
    parser = argparse.ArgumentParser(description="Render P2 sensor installation figures")
    parser.add_argument("--id", help="030, 031, 037, 038, 042")
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
