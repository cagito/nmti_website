#!/usr/bin/env python3
"""Restore PNG assets from git before CR1000X Pillow overwrite."""
from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COMMIT = "4898eb6"
IDS = {"001", "002", "003", "006", "008", "025", "045", "047", "048", "058"}


def git_paths(prefix: str) -> list[str]:
    r = subprocess.run(
        ["git", "ls-tree", "-r", "--name-only", "-z", COMMIT, prefix],
        capture_output=True,
        cwd=ROOT,
    )
    raw = r.stdout.decode("utf-8", errors="surrogateescape")
    return [p for p in raw.split("\0") if p.endswith(".png")]


def restore_file(git_path: str) -> tuple[bool, int | str]:
    data = subprocess.run(
        ["git", "show", f"{COMMIT}:{git_path}"],
        capture_output=True,
        cwd=ROOT,
    )
    if data.returncode != 0:
        return False, "missing"
    out = ROOT / git_path
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(data.stdout)
    return True, len(data.stdout)


def main() -> None:
    targets: set[str] = set()
    for p in git_paths("assets/images/technology/"):
        if not p.endswith(".png"):
            continue
        name = Path(p).name
        if not name.startswith("IMG-"):
            continue
        img_id = name[4:7]
        if img_id in IDS:
            targets.add(p)

    for p in sorted(targets):
        ok, info = restore_file(p)
        print(("OK" if ok else "FAIL"), info, p)


if __name__ == "__main__":
    main()
