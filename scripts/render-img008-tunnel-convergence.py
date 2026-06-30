#!/usr/bin/env python3
"""Render IMG-008 — tunnel upper-arch convergence (no third-party product names)."""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.datalogger_draw import W, H, _hex, load_font, new_canvas  # noqa: E402
from lib.render_guard import enforce_render_policy  # noqa: E402
from lib.tunnel_convergence_draw import render_img008  # noqa: E402
from lib.technology_image_backup import backup_and_unlink  # noqa: E402

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"
FILENAME = "IMG-008_터널-전단면-내공변위-측정시스템_상부아치내공변위.png"

# Legacy filenames to remove after deploy
LEGACY_GLOBS = [
    "IMG-008_*ACE-TCS*.png",
    "IMG-008_*진동현식*.png",
]


def save(img: Image.Image) -> None:
    path = OUT / FILENAME
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    SOURCE.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, SOURCE / FILENAME)
    print(f"Wrote {path}")


def remove_legacy() -> None:
    for pattern in LEGACY_GLOBS:
        for p in list(OUT.glob(pattern)) + list(SOURCE.glob(pattern)):
            if p.name != FILENAME and p.is_file():
                backup_and_unlink(p, OUT, reason="legacy-img008")
                print(f"Removed legacy {p}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force-legacy-pillow", action="store_true", help="Override FT-A/B pillow block (emergency)")
    args = parser.parse_args()
    enforce_render_policy(["008"], force=args.force_legacy_pillow)
    img, draw = new_canvas()
    render_img008(draw, load_font(34, bold=True))
    save(img)
    remove_legacy()


if __name__ == "__main__":
    main()
