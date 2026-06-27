#!/usr/bin/env python3
"""Apply WATERMARK-01 to all technology Figure PNGs."""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.watermark_stamp import ensure_watermark_asset, stamp_file  # noqa: E402

IMG_DIRS = [
    ROOT / "assets" / "images" / "technology",
    ROOT / "assets" / "images" / "technology" / "reviewed",
]
MANIFEST = ROOT / "scripts" / "watermark-manifest.json"
PNG_RE = re.compile(r"^IMG-\d{3}_.+\.png$", re.IGNORECASE)


def collect_pngs() -> list[Path]:
    seen: set[str] = set()
    out: list[Path] = []
    for d in IMG_DIRS:
        if not d.is_dir():
            continue
        for png in sorted(d.glob("IMG-*.png")):
            if not PNG_RE.match(png.name):
                continue
            key = str(png.resolve())
            if key in seen:
                continue
            seen.add(key)
            out.append(png)
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description="Stamp NMTI watermark on Figure PNGs")
    parser.add_argument("--force", action="store_true", help="Re-stamp even if manifest says done")
    parser.add_argument("--dry-run", action="store_true", help="List files only")
    args = parser.parse_args()

    ensure_watermark_asset()
    manifest: dict = {}
    if MANIFEST.is_file():
        manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))

    pngs = collect_pngs()
    if not pngs:
        print("No IMG-*.png files found", file=sys.stderr)
        return 1

    changed = skipped = 0
    for png in pngs:
        if args.dry_run:
            print("would stamp", png.relative_to(ROOT))
            continue
        if stamp_file(png, force=args.force, manifest=manifest):
            changed += 1
            print("stamped", png.relative_to(ROOT))
        else:
            skipped += 1

    if not args.dry_run:
        MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"watermark:figures - {changed} stamped, {skipped} skipped, {len(pngs)} total")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
