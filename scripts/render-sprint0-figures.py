#!/usr/bin/env python3
"""Render Sprint 0 pending figures IMG-089~095, 102."""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.datalogger_draw import load_font, new_canvas  # noqa: E402
from lib.render_guard import enforce_render_policy  # noqa: E402
from lib.sprint0_draw import (  # noqa: E402
    render_img089,
    render_img090,
    render_img091,
    render_img092,
    render_img093,
    render_img094,
    render_img095,
    render_img102,
)

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"

JOBS = {
    "089": ("IMG-089_사면-지표경사-계측-개념도_지표경사계pad콘크리트.png", render_img089),
    "090": ("IMG-090_사면-구조물-변위-계측-개념도_옹벽프리즘ATS.png", render_img090),
    "091": ("IMG-091_다점지중변위계-MPBX-설치-개념도_보링다점앵커.png", render_img091),
    "092": ("IMG-092_말뚝-축력-변형률-지중-단면도_CIP철근망변형률계.png", render_img092),
    "093": ("IMG-093_환경-소음-분진-경계-계측주_펜스소음PM로거.png", render_img093),
    "094": ("IMG-094_상시-계측-모드-흐름도_등간격트리거stabletrend.png", render_img094),
    "095": ("IMG-095_실시간-이벤트-계측-모드-토폴로지_고속샘플링impulse.png", render_img095),
    "102": ("IMG-102_경보-알림-상태-제어-흐름도_threshold경광SMS.png", render_img102),
}


def save(img: Image.Image, filename: str) -> Path:
    path = OUT / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    SOURCE.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, SOURCE / filename)
    print(f"Wrote {path}")
    return path


def render_one(suffix: str) -> None:
    filename, fn = JOBS[suffix]
    img, draw = new_canvas()
    fn(draw, load_font(34, bold=True))
    save(img, filename)


def main() -> None:
    parser = argparse.ArgumentParser(description="Render Sprint 0 pending figures")
    parser.add_argument("--id", help="089, 090, … 102, or all")
    parser.add_argument("--force-legacy-pillow", action="store_true", help="Override FT-A/B pillow block")
    args = parser.parse_args()
    ids = list(JOBS.keys()) if not args.id or args.id == "all" else [args.id.replace("IMG-", "").zfill(3)]
    enforce_render_policy(ids, force=args.force_legacy_pillow)
    for suffix in ids:
        if suffix not in JOBS:
            raise SystemExit(f"Unknown id: {suffix}")
        render_one(suffix)


if __name__ == "__main__":
    main()
