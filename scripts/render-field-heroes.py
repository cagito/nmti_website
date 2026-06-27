#!/usr/bin/env python3
"""Render field-specific hero figures IMG-080~088."""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.field_heroes_draw import (  # noqa: E402
    render_img080,
    render_img081,
    render_img082,
    render_img083,
    render_img084,
    render_img085,
    render_img086,
    render_img087,
    render_img088,
)
from lib.render_guard import enforce_render_policy  # noqa: E402

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"

JOBS = {
    "080": ("IMG-080_강지보-응력-계측-개념도_스틸세트변형률계.png", render_img080),
    "081": ("IMG-081_기둥-축소량-계측-개념도_수직변형률계.png", render_img081),
    "082": ("IMG-082_건축-응력변형률-계측-개념도_중대부재하중계.png", render_img082),
    "083": ("IMG-083_댐-변형률-계측-개념도_제체매립SG.png", render_img083),
    "084": ("IMG-084_항만구조물-변위-계측-개념도_케이슨안벽변위계.png", render_img084),
    "085": ("IMG-085_교량-종횡변위-계측-개념도_이음부변위계.png", render_img085),
    "086": ("IMG-086_교량-진동-계측-개념도_가속도계통행응답.png", render_img086),
    "087": ("IMG-087_구조물-지진-계측-개념도_강진동응답스펙트럼.png", render_img087),
    "088": ("IMG-088_구조물-온도-계측-개념도_온도계수화열계절.png", render_img088),
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
