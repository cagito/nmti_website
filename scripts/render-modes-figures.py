#!/usr/bin/env python3
"""Render measurement mode figures IMG-070~075."""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.datalogger_draw import load_font, new_canvas  # noqa: E402
from lib.modes_draw import (  # noqa: E402
    render_img070,
    render_img071,
    render_img072,
    render_img073,
    render_img074,
    render_img075,
)

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"

JOBS = {
    "070": ("IMG-070_수동-계측-개념도_현장방문리드아웃기록.png", render_img070),
    "071": ("IMG-071_자동-계측-개념도_로거현장저장주기.png", render_img071),
    "072": ("IMG-072_원격-자동계측-개념도_현장통신서버모니터링.png", render_img072),
    "073": ("IMG-073_스마트-계측-개념도_플랫폼경보보고로그.png", render_img073),
    "074": ("IMG-074_AI-계측-개념도_이상탐지예측HITL.png", render_img074),
    "075": ("IMG-075_계측-방식-5단계-계층도_수동자동원격스마트AI.png", render_img075),
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
    args = parser.parse_args()
    ids = list(JOBS.keys()) if args.id == "all" else [args.id]
    for suffix in ids:
        filename, fn = JOBS[suffix]
        img, draw = new_canvas()
        fn(draw, load_font(34, bold=True))
        save(img, filename)


if __name__ == "__main__":
    main()
