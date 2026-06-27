#!/usr/bin/env python3
"""Render IMG-014 bridge expansion joint meter figure (BRI-EJ).

Usage:
  python scripts/render-expansion-joint.py
  python scripts/render-expansion-joint.py --force-legacy-pillow
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
from lib.expansion_joint_draw import render_img014  # noqa: E402
from lib.render_guard import enforce_render_policy  # noqa: E402

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"
FILENAME = "IMG-014_교량-신축이음부-신축량-계측도_신축이음계핑거형.png"


def save(img: Image.Image, filename: str) -> Path:
    path = OUT / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    SOURCE.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, SOURCE / filename)
    print(f"Wrote {path}")
    return path


def main() -> None:
    parser = argparse.ArgumentParser(description="Render IMG-014 expansion joint figure")
    parser.add_argument("--force-legacy-pillow", action="store_true")
    args = parser.parse_args()
    enforce_render_policy(["014"], force=args.force_legacy_pillow)
    img, draw = new_canvas()
    render_img014(draw, load_font(34, bold=True))
    save(img, FILENAME)


if __name__ == "__main__":
    main()
