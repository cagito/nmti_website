#!/usr/bin/env python3
"""DEPRECATED — technology figures are WebP-only.

PNG → WebP conversion is no longer used. Register WebP directly:
  npm run register:figure -- --id IMG-### --input path/to.webp ...

To remove stray PNG files:
  python scripts/purge-technology-png.py
"""
from __future__ import annotations

import sys


def main() -> int:
    print(__doc__, file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
