#!/usr/bin/env python3
"""Render IMG-011 bridge monitoring overview v3."""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.bridge_overview_draw import render_img011  # noqa: E402

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"
FILENAME = "IMG-011_교량-계측-전체-개념도_상부구조교각교대기초.png"


def save(img: Image.Image) -> None:
    path = OUT / FILENAME
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    SOURCE.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, SOURCE / FILENAME)
    print(f"Wrote {path}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.parse_args()
    save(render_img011())


if __name__ == "__main__":
    main()
