#!/usr/bin/env python3
"""Render harbor audit fix figures: IMG-098 (HAR-01~04)."""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.datalogger_draw import load_font, new_canvas  # noqa: E402
from lib.harbor_tide_draw import render_img098  # noqa: E402
from lib.render_guard import enforce_render_policy  # noqa: E402

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"

JOBS = {
    "098": (
        "IMG-098_항만-호안-조위지하수-계측-개념도_외해사석매립지하수위.png",
        render_img098,
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
    parser = argparse.ArgumentParser(description="Render IMG-098 harbor tide fixes")
    parser.add_argument("--id", default="098", help="098")
    parser.add_argument("--force-legacy-pillow", action="store_true")
    args = parser.parse_args()
    suffix = args.id.replace("IMG-", "").zfill(3)
    enforce_render_policy([suffix], force=args.force_legacy_pillow)
    render_one(suffix)


if __name__ == "__main__":
    main()
