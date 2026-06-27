#!/usr/bin/env python3
"""Convert technology PNGs to canonical IMG-###_*.webp for web delivery.

Usage:
  python scripts/convert-technology-webp.py [--force] [--quality 85]

Reads assets/images/technology/IMG-###_*.png
Writes assets/images/technology/IMG-###_*.webp
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "assets" / "images" / "technology"
CANONICAL = ROOT / "scripts" / "canonical-image-png.json"
PNG_RE = re.compile(r"^(IMG-\d{3})_.+\.png$", re.IGNORECASE)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="Regenerate even if webp is newer")
    parser.add_argument("--quality", type=int, default=85, help="WebP quality (default 85)")
    args = parser.parse_args()

    if not IMG_DIR.is_dir():
        print("Missing directory:", IMG_DIR, file=sys.stderr)
        return 1

    canonical = {}
    if CANONICAL.is_file():
        canonical = json.loads(CANONICAL.read_text(encoding="utf-8"))

    converted = skipped = 0
    for png in sorted(IMG_DIR.glob("IMG-*.png")):
        m = PNG_RE.match(png.name)
        if not m:
            continue
        img_id = m.group(1)
        target_name = canonical.get(img_id, png.name).removesuffix(".png") + ".webp"
        webp = IMG_DIR / target_name
        if webp.exists() and not args.force and webp.stat().st_mtime >= png.stat().st_mtime:
            skipped += 1
            continue
        with Image.open(png) as im:
            im.save(webp, format="WEBP", quality=args.quality, method=6)
        converted += 1
        print("Wrote", webp.relative_to(ROOT))

    print(f"convert-technology-webp: {converted} converted, {skipped} skipped")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
