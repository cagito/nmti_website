"""Backup assets/images/technology files before delete (mirrors technology-image-backup.mjs)."""
from __future__ import annotations

import shutil
from datetime import datetime
from pathlib import Path


def _timestamp_local() -> str:
    return datetime.now().strftime("%Y%m%d-%H%M%S")


def backup_technology_image(
    file_path: Path,
    img_dir: Path,
    *,
    reason: str = "",
    dry_run: bool = False,
) -> Path | None:
    file_path = file_path.resolve()
    img_dir = img_dir.resolve()
    if not file_path.is_file():
        return None
    try:
        rel = file_path.relative_to(img_dir)
    except ValueError:
        return None
    rel_posix = rel.as_posix()
    if rel_posix.startswith("backup/"):
        return None

    stamp = _timestamp_local()
    dest = img_dir / "backup" / rel.parent / f"{file_path.stem}.{stamp}{file_path.suffix}"
    suffix = f" ({reason})" if reason else ""
    if dry_run:
        print(f"[dry-run] backup {rel_posix} → {dest.relative_to(img_dir).as_posix()}{suffix}")
        return dest

    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(file_path, dest)
    print(f"Backed up: {rel_posix} → {dest.relative_to(img_dir).as_posix()}{suffix}")
    return dest


def backup_and_unlink(
    file_path: Path,
    img_dir: Path,
    *,
    reason: str = "",
    dry_run: bool = False,
) -> Path | None:
    dest = backup_technology_image(file_path, img_dir, reason=reason, dry_run=dry_run)
    if dry_run:
        if file_path.is_file():
            try:
                rel = file_path.relative_to(img_dir)
                print(f"[dry-run] delete {rel.as_posix()}")
            except ValueError:
                pass
        return dest
    if file_path.is_file():
        file_path.unlink(missing_ok=True)
    return dest
