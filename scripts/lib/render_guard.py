"""Block Pillow re-render for FT-A/B figures (doc 31).

Usage from render-*.py:
    from lib.render_guard import enforce_render_policy
    enforce_render_policy(["002", "004"], force="--force-legacy-pillow" in sys.argv)
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
POLICY_PATH = ROOT / "scripts" / "figure-production-policy.json"
DOC = "docs/31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md"


def _load_policy() -> dict:
    if not POLICY_PATH.exists():
        return {"figures": {}}
    return json.loads(POLICY_PATH.read_text(encoding="utf-8"))


def _img_id(suffix: str) -> str:
    s = suffix.replace("IMG-", "").strip()
    return f"IMG-{int(s):03d}"


def enforce_render_policy(suffixes: list[str], *, force: bool = False) -> None:
    """Exit 2 if any id is FT-A/B — Pillow render scripts are never allowed for these tiers."""
    if force:
        print("render_guard: --force-legacy-pillow (override)", file=sys.stderr)
        return

    policy = _load_policy()
    figures = policy.get("figures", {})
    blocked: list[str] = []

    for suffix in suffixes:
        img_id = _img_id(suffix)
        fig = figures.get(img_id)
        if not fig:
            continue
        tier = fig.get("tier", "")
        method = fig.get("currentMethod", "")
        if tier in ("FT-A", "FT-B"):
            blocked.append(
                f"{img_id} ({tier}, method={method}) via {fig.get('renderScript', '?')}"
            )

    if not blocked:
        return

    print("BLOCKED: Pillow re-render forbidden for FT-A/B figures.", file=sys.stderr)
    for line in blocked:
        print(f"  - {line}", file=sys.stderr)
    print(f"  Use external PNG (cad / ai-reviewed). See {DOC}", file=sys.stderr)
    print("  Emergency only: pass --force-legacy-pillow", file=sys.stderr)
    sys.exit(2)


def img_id_from_filename(src_name: str) -> str | None:
    """Extract IMG-### from canonical PNG filename."""
    if not src_name.startswith("IMG-"):
        return None
    num = src_name[4:7]
    if not num.isdigit():
        return None
    return f"IMG-{int(num):03d}"


def enforce_composite_policy(src_name: str, *, force: bool = False) -> None:
    """Block logger composite patch on ai-reviewed/cad FT-A/B heroes (doc 31 §4.2)."""
    if force:
        return
    img_id = img_id_from_filename(src_name)
    if not img_id:
        return
    policy = _load_policy()
    fig = policy.get("figures", {}).get(img_id)
    if not fig:
        return
    method = fig.get("currentMethod", "")
    tier = fig.get("tier", "")
    if tier in ("FT-A", "FT-B") and method in ("ai-reviewed", "cad"):
        print(
            f"BLOCKED: composite logger patch forbidden on {img_id} "
            f"({tier}, {method}). Use PNG with embedded 함체.",
            file=sys.stderr,
        )
        print(f"  See {DOC} §Phase 4.2", file=sys.stderr)
        sys.exit(2)
