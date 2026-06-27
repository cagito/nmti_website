#!/usr/bin/env python3
"""Render dam audit fix figures: IMG-024 v2 (DAM-01~03)."""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.dam_draw import render_img024  # noqa: E402
from lib.datalogger_draw import load_font, new_canvas  # noqa: E402
from lib.render_guard import enforce_render_policy  # noqa: E402

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"

JOBS = {
    "024": (
        "IMG-024_댐-안전관리-계측-체계도_필댐6항목데이터흐름.png",
        render_img024,
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
    parser = argparse.ArgumentParser(description="Render IMG-024 dam audit fixes")
    parser.add_argument("--id", default="024", help="024")
    parser.add_argument("--force-legacy-pillow", action="store_true", help="Override FT-A/B pillow block")
    args = parser.parse_args()
    suffix = args.id.replace("IMG-", "").zfill(3)
    enforce_render_policy([suffix], force=args.force_legacy_pillow)
    render_one(suffix)


if __name__ == "__main__":
    main()
