#!/usr/bin/env python3
"""Remove PNG from assets/images/technology — WebP-only delivery and source.

Converts source/*.png → *.webp when WebP missing, then deletes all IMG-*.png
and staging PNG under technology/ (including source/, reference-retaining/).

Usage:
  python scripts/purge-technology-png.py [--dry-run]
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "assets" / "images" / "technology"
PNG_RE = re.compile(r"^IMG-\d{3}_.+\.png$", re.IGNORECASE)


def convert_if_needed(png: Path, quality: int = 85) -> Path | None:
    webp = png.with_suffix(".webp")
    if webp.exists():
        return webp
    try:
        with Image.open(png) as im:
            im.save(webp, format="WEBP", quality=quality, method=6)
    except OSError as exc:
        print("SKIP convert (corrupt/missing):", png.relative_to(ROOT), exc, file=sys.stderr)
        return None
    print("Converted", webp.relative_to(ROOT))
    return webp


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--quality", type=int, default=85)
    args = parser.parse_args()

    if not IMG_DIR.is_dir():
        print("Missing", IMG_DIR, file=sys.stderr)
        return 1

    png_files = sorted(
        p for p in IMG_DIR.rglob("*.png") if p.is_file() and (PNG_RE.match(p.name) or p.name.endswith("_external.png"))
    )
    # reference-retaining and staging
    png_files = sorted(set(png_files) | {p for p in IMG_DIR.rglob("*.png") if p.is_file() and ("_staging_" in p.name or "reference-retaining" in p.as_posix())})

    converted = deleted = 0
    for png in sorted(set(png_files)):
        webp = png.with_suffix(".webp")
        if not webp.exists():
            if args.dry_run:
                print("[dry-run] would convert", png.relative_to(ROOT))
            else:
                convert_if_needed(png, args.quality)
                converted += 1
        if webp.exists() or args.dry_run:
            if args.dry_run:
                print("[dry-run] would delete", png.relative_to(ROOT))
            else:
                png.unlink(missing_ok=True)
                deleted += 1
                print("Deleted", png.relative_to(ROOT))
        else:
            print("KEEP (no webp):", png.relative_to(ROOT), file=sys.stderr)

    print(f"purge-technology-png: converted={converted} deleted={deleted}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
