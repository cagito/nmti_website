#!/usr/bin/env python3
"""Render tunnel support figures IMG-078 (rockbolt) and IMG-079 (shotcrete)."""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.render_guard import enforce_render_policy  # noqa: E402
from lib.tunnel_support_draw import render_img078, render_img079  # noqa: E402

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"

JOBS = {
    "078": ("IMG-078_록볼트-축력-계측-개념도_축력계변형률계.png", render_img078),
    "079": ("IMG-079_숏크리트-응력-변형-계측-개념도_변형률계매립.png", render_img079),
}


def save(img: Image.Image, filename: str) -> None:
    path = OUT / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    SOURCE.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, SOURCE / filename)
    print(f"Wrote {path}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--id", choices=list(JOBS.keys()) + ["all"], default="all")
    parser.add_argument("--force-legacy-pillow", action="store_true", help="Override FT-A/B pillow block (emergency)")
    args = parser.parse_args()
    ids = list(JOBS.keys()) if args.id == "all" else [args.id]
    enforce_render_policy(ids, force=args.force_legacy_pillow)
    for iid in ids:
        filename, fn = JOBS[iid]
        save(fn(), filename)


if __name__ == "__main__":
    main()
