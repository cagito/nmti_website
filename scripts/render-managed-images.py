# -*- coding: utf-8 -*-
"""
Run managed image renderers only when needed.

Default condition:
- output file is missing, or
- renderer script is newer than the output file, or
- FORCE_RENDER_IMAGES=1 is set.

Manifest:
  scripts/managed-image-renderers.json

Example entry:
  {
    "id": "IMG-111",
    "enabled": true,
    "script": "scripts/render-img111-construction.py",
    "output": "assets/images/technology/IMG-111_external.webp"
  }
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "scripts" / "managed-image-renderers.json"
FORCE = os.environ.get("FORCE_RENDER_IMAGES", "0") == "1"
STRICT = os.environ.get("STRICT_RENDER_IMAGES", "0") == "1"


def rel(path: Path) -> str:
    try:
        return path.relative_to(ROOT).as_posix()
    except ValueError:
        return path.as_posix()


def ensure_pillow() -> None:
    try:
        import PIL  # noqa: F401
        return
    except ModuleNotFoundError:
        print("[INFO] Pillow not found. Installing Pillow...")
        subprocess.run([sys.executable, "-m", "pip", "install", "Pillow"], check=False)


def load_manifest() -> list[dict[str, Any]]:
    if not MANIFEST.exists():
        print(f"[SKIP] renderer manifest not found: {rel(MANIFEST)}")
        return []
    with MANIFEST.open("r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        raise ValueError("managed-image-renderers.json must be a list")
    return data


def should_render(item: dict[str, Any]) -> tuple[bool, str]:
    script = ROOT / str(item["script"])
    output = ROOT / str(item["output"])

    if FORCE:
        return True, "FORCE_RENDER_IMAGES=1"
    if not output.exists():
        return True, "output missing"
    if not script.exists():
        return False, "script missing"

    out_mtime = output.stat().st_mtime
    inputs = [script]
    for extra in item.get("inputs", []) or []:
        inputs.extend(ROOT.glob(str(extra)))

    newer = [p for p in inputs if p.exists() and p.stat().st_mtime > out_mtime]
    if newer:
        return True, "newer input: " + ", ".join(rel(p) for p in newer[:3])
    return False, "up to date"


def main() -> int:
    try:
        items = load_manifest()
    except Exception as exc:
        print(f"[ERROR] failed to load renderer manifest: {exc}")
        return 1 if STRICT else 0

    ran = 0
    failed = 0

    for item in items:
        image_id = str(item.get("id", "UNKNOWN"))
        if item.get("enabled", True) is False:
            print(f"[SKIP] {image_id}: disabled")
            continue

        script = ROOT / str(item.get("script", ""))
        output = ROOT / str(item.get("output", ""))

        if not script.exists():
            print(f"[SKIP] {image_id}: renderer script missing: {rel(script)}")
            continue

        need, reason = should_render(item)
        if not need:
            print(f"[SKIP] {image_id}: {reason}")
            continue

        ensure_pillow()
        print(f"[RENDER] {image_id}: {reason}")
        print(f"         script: {rel(script)}")
        print(f"         output: {rel(output)}")
        output.parent.mkdir(parents=True, exist_ok=True)
        result = subprocess.run([sys.executable, str(script)], cwd=str(ROOT))
        if result.returncode != 0:
            failed += 1
            print(f"[WARN] {image_id}: renderer failed with exit code {result.returncode}")
        else:
            ran += 1

    print(f"[RENDER] completed. rendered={ran}, failed={failed}")
    if failed and STRICT:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
