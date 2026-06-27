#!/usr/bin/env python3
"""Render SVG technology figures to PNG.

⛔ DEPRECATED — DO NOT RUN (2026-06-25)
Policy: docs/16-기술자료-이미지-에이전트-SVG-생성-금지.md
Agents must not create or modify technology figures via SVG generation.
"""
from __future__ import annotations

import sys

if __name__ == "__main__":
    print(
        "BLOCKED: render-svg-figures.py is deprecated.\n"
        "See docs/16-기술자료-이미지-에이전트-SVG-생성-금지.md",
        file=sys.stderr,
    )
    sys.exit(2)

# --- legacy implementation below (do not invoke) ---

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"
SVG_DIR = OUT / "svg"

BASE_W, BASE_H = 1920, 1080

JOBS = {
    "002": {
        "svg": "IMG-002_흙막이-계측-설치-대표-단면도.svg",
        "png": "IMG-002_흙막이-계측-설치-대표-단면도.png",
        "writer": "write_img002_svg",
    },
    "005": {
        "svg": "IMG-005_주변건물-균열-경사-계측도_굴착주변건물배치.svg",
        "png": "IMG-005_주변건물-균열-경사-계측도_굴착주변건물배치.png",
        "writer": "write_img005_svg",
    },
}


def _write_svg(suffix: str) -> Path:
    job = JOBS[suffix]
    if suffix == "002":
        from lib.retaining_wall_svg import write_img002_svg

        return write_img002_svg(SVG_DIR / job["svg"])
    if suffix == "005":
        from lib.adjacent_building_svg import write_img005_svg

        return write_img005_svg(SVG_DIR / job["svg"])
    raise SystemExit(f"No SVG writer for {suffix}")


def _render_cairosvg(svg_path: Path, png_path: Path, width: int, height: int) -> None:
    import cairosvg

    data = svg_path.read_bytes()
    cairosvg.svg2png(
        bytestring=data,
        write_to=str(png_path),
        output_width=width,
        output_height=height,
    )


def _render_inkscape(svg_path: Path, png_path: Path, width: int, height: int) -> None:
    inkscape = shutil.which("inkscape")
    if not inkscape:
        raise RuntimeError("Inkscape not found on PATH")
    subprocess.run(
        [
            inkscape,
            str(svg_path),
            "--export-type=png",
            f"--export-filename={png_path}",
            f"--export-width={width}",
            f"--export-height={height}",
        ],
        check=True,
    )


def render_one(suffix: str, *, scale: float = 2.0, write_svg: bool = False) -> Path:
    if suffix not in JOBS:
        raise SystemExit(f"Unknown id: {suffix}. Choose: {', '.join(JOBS)}")
    job = JOBS[suffix]
    svg_path = SVG_DIR / job["svg"]
    if write_svg or not svg_path.exists():
        svg_path = _write_svg(suffix)
        print(f"Wrote SVG {svg_path}")

    png_path = OUT / job["png"]
    png_path.parent.mkdir(parents=True, exist_ok=True)
    width = int(BASE_W * scale)
    height = int(BASE_H * scale)

    try:
        _render_cairosvg(svg_path, png_path, width, height)
    except ImportError:
        print("cairosvg not installed — trying Inkscape CLI", file=sys.stderr)
        _render_inkscape(svg_path, png_path, width, height)

    SOURCE.mkdir(parents=True, exist_ok=True)
    shutil.copy2(png_path, SOURCE / job["png"])
    print(f"Wrote PNG {png_path} ({width}x{height})")
    return png_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Render SVG technology figures to PNG")
    parser.add_argument("--id", required=True, help="Figure ID suffix (e.g. 002)")
    parser.add_argument("--scale", type=float, default=2.0, help="Output scale vs 1920x1080 (default 2)")
    parser.add_argument("--write-svg", action="store_true", help="Regenerate SVG source before render")
    args = parser.parse_args()
    suffix = args.id.zfill(3) if len(args.id) <= 3 else args.id.replace("IMG-", "")
    render_one(suffix, scale=args.scale, write_svg=args.write_svg)


if __name__ == "__main__":
    main()
