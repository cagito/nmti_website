#!/usr/bin/env python3
"""Render IMG-019 soft ground embankment instrumentation layout v3."""
from __future__ import annotations

import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.soft_ground_layout_draw import render_img019  # noqa: E402

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"
FILENAME = "IMG-019_연약지반-계측-전체-개념도_성토침하간극수압측방유동.png"


def save(img: Image.Image) -> None:
    path = OUT / FILENAME
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    SOURCE.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, SOURCE / FILENAME)
    print(f"Wrote {path}")


if __name__ == "__main__":
    save(render_img019())
