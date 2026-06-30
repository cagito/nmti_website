#!/usr/bin/env python3
"""Render P3 platform / system figures (IMG-045, 048, 056, 058).

Usage:
  python scripts/render-p3-platform.py
  python scripts/render-p3-platform.py --id 056
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
from lib.platform_draw import (  # noqa: E402
    render_img045,
    render_img048,
    render_img056,
    render_img058,
)
from lib.technology_image_backup import backup_and_unlink  # noqa: E402

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"

IMG048_CANONICAL = "IMG-048_LTE-M2M-통신-구성도_센서로거모뎀서버웹모바일.png"
LEGACY_IMG048 = "IMG-048_LTE-원격계측-통신-구성도_센서로거서버웹모바일.png"

JOBS = {
    "045": ("IMG-045_데이터로거-구성도_센서입력전원통신저장.png", render_img045),
    "048": (IMG048_CANONICAL, render_img048),
    "056": ("IMG-056_웹-대시보드-구성도_지도센서목록그래프이벤트로그.png", render_img056),
    "058": ("IMG-058_통합-계측-플랫폼-아키텍처_센서로거서버DB웹모바일.png", render_img058),
}


def save(img: Image.Image, filename: str) -> Path:
    path = OUT / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    SOURCE.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, SOURCE / filename)
    print(f"Wrote {path}")
    return path


def remove_legacy_img048() -> None:
    for folder in (OUT, SOURCE):
        legacy = folder / LEGACY_IMG048
        if legacy.is_file():
            backup_and_unlink(legacy, OUT, reason="legacy-img048")
            print(f"Removed legacy {legacy}")


def render_one(suffix: str) -> None:
    if suffix not in JOBS:
        raise SystemExit(f"Unknown id: {suffix}. Choose: {', '.join(JOBS)}")
    filename, fn = JOBS[suffix]
    img, draw = new_canvas()
    fn(draw, load_font(34, bold=True))
    save(img, filename)
    if suffix == "048":
        remove_legacy_img048()


def main() -> None:
    parser = argparse.ArgumentParser(description="Render P3 platform/system figures")
    parser.add_argument("--id", help="Render single image suffix (045, 048, 056, 058)")
    args = parser.parse_args()
    if args.id:
        render_one(args.id)
    else:
        for suffix in JOBS:
            render_one(suffix)


if __name__ == "__main__":
    main()
