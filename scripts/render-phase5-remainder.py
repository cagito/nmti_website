#!/usr/bin/env python3
"""Render Phase 5 remainder figures (IMG-027, IMG-062).

Usage:
  python scripts/render-phase5-remainder.py
  python scripts/render-phase5-remainder.py --id 062
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
from lib.inclinometer_ground_draw import render_img027  # noqa: E402
from lib.render_guard import enforce_render_policy  # noqa: E402
from lib.water_pore_pressure_draw import render_img062  # noqa: E402

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"

JOBS = {
    "027": (
        "IMG-027_지중경사계-설치-단면도_보링그라우트안정층활동면.png",
        render_img027,
    ),
    "062": (
        "IMG-062_지하수위-간극수압-계측도.png",
        render_img062,
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
    parser = argparse.ArgumentParser(description="Render Phase 5 remainder figures")
    parser.add_argument("--id", help="027 or 062")
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
