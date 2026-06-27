#!/usr/bin/env python3
"""Restore IMG-002: correct layout (66502ef) + legacy industrial datalogger."""
from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.datalogger_draw import (  # noqa: E402
    C,
    _hex,
    draw_legacy_logger_in_enclosure,
    load_font,
)

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"
COMMIT = "66502ef"
GIT_PATH = "assets/images/technology/IMG-002_흙막이-계측-설치-대표-단면도.png"

# composite_002() patch region (same ratios as render-datalogger-figures.py)
PX_RATIO, PY_RATIO, PW_RATIO, PH_RATIO = 0.48, 0.52, 0.11, 0.14


def load_base() -> Image.Image:
    tmp = OUT / "_tmp_img002_66502ef.png"
    if tmp.exists():
        return Image.open(tmp).convert("RGB")
    data = subprocess.run(["git", "show", f"{COMMIT}:{GIT_PATH}"], capture_output=True, cwd=ROOT)
    if data.returncode != 0:
        raise FileNotFoundError("IMG-002 base not found in git or temp")
    return Image.open(__import__("io").BytesIO(data.stdout)).convert("RGB")


def _soil_fill(draw: ImageDraw.ImageDraw, x0: int, y0: int, x1: int, y1: int) -> None:
    """Fill erased CR1000X patch with backfill soil tone."""
    soil = (196, 170, 132)
    draw.rectangle([x0, y0, x1, y1], fill=soil)
    for yy in range(y0 + 6, y1 - 4, 14):
        draw.line([(x0 + 4, yy), (x1 - 4, yy)], fill=(168, 145, 112), width=1)


def fix_datalogger(img: Image.Image) -> Image.Image:
    w, h = img.size
    px = int(w * PX_RATIO)
    py = int(h * PY_RATIO)
    pw = int(w * PW_RATIO)
    ph = int(h * PH_RATIO)
    # White wipe region from composite_image()
    x0 = px - 15
    y0 = py - 25
    x1 = px + pw + 25
    y1 = py + ph + 35

    draw = ImageDraw.Draw(img)
    _soil_fill(draw, x0, y0, x1, y1)

    # Slightly smaller callout than wipe area
    box_w = int(pw * 1.15)
    box_h = int(ph * 1.05)
    bx = px + (pw - box_w) // 2
    by = py + (ph - box_h) // 2
    draw_legacy_logger_in_enclosure(draw, bx, by, box_w, box_h, font=load_font(max(14, h // 70)))
    return img


def save(img: Image.Image, filename: str) -> None:
    path = OUT / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    SOURCE.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, SOURCE / filename)
    print(f"Wrote {path}")


def main() -> None:
    # Resolve on-disk filename (FTP path encoding may vary)
    candidates = list(OUT.glob("IMG-002_*.png"))
    filename = GIT_PATH.split("/")[-1]
    for c in candidates:
        if "대표" in c.name or "단면도" in c.name:
            filename = c.name
            break

    img = fix_datalogger(load_base())
    save(img, filename)


if __name__ == "__main__":
    main()
