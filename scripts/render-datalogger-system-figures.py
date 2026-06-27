#!/usr/bin/env python3
"""Render dynamic DAQ (IMG-076) and MUX (IMG-077) concept figures."""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.datalogger_system_draw import render_img076, render_img077  # noqa: E402

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"

JOBS = {
    "076": ("IMG-076_동적-데이터로거-구성도_모듈형DAQ고속샘플링.png", render_img076),
    "077": ("IMG-077_멀티플렉서-구성도_체인센서순차스캔.png", render_img077),
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
    for iid in ids:
        filename, fn = JOBS[iid]
        save(fn(), filename)


if __name__ == "__main__":
    main()
