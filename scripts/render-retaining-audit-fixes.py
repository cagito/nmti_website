#!/usr/bin/env python3
"""Render external-audit fix figures: IMG-002 v4, IMG-004 v3, IMG-005 v3."""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.adjacent_building_draw import render_img005  # noqa: E402
from lib.anchor_loadcell_draw import render_img004  # noqa: E402
from lib.datalogger_draw import load_font, new_canvas  # noqa: E402
from lib.render_guard import enforce_render_policy  # noqa: E402
from lib.retaining_wall_draw import render_img002  # noqa: E402

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"

JOBS = {
    "002": (
        "IMG-002_흙막이-계측-설치-대표-단면도.png",
        render_img002,
    ),
    "004": (
        "IMG-004_어스앵커-하중계-설치-개념도_앵커두부정착구.png",
        render_img004,
    ),
    "005": (
        "IMG-005_주변건물-균열-경사-계측도_굴착주변건물배치.png",
        render_img005,
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


def render_one(suffix: str) -> None:
    if suffix not in JOBS:
        raise SystemExit(f"Unknown id: {suffix}. Choose: {', '.join(JOBS)}")
    filename, fn = JOBS[suffix]
    img, draw = new_canvas()
    fn(draw, load_font(34, bold=True))
    save(img, filename)


def main() -> None:
    parser = argparse.ArgumentParser(description="Render IMG-002/004/005 audit fixes")
    parser.add_argument("--id", help="002, 004, or 005")
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
