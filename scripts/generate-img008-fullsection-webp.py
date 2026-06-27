#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate IMG-008 full-name WebP directly in the repository.

Purpose:
- Avoid manual download/copy steps.
- Generate a deterministic full-section tunnel convergence schematic.
- Write only the canonical full-name WebP operation file.

Note:
- This script is an automation aid. Final PASS still requires visual/technical review
  against docs/126 IMG008-F1~F8.
"""

from __future__ import annotations

import argparse
import math
import os
import subprocess
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except Exception as exc:  # pragma: no cover
    raise SystemExit(
        "Pillow is required. Install with: python -m pip install pillow\n"
        f"Original error: {exc}"
    )

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets/images/technology/IMG-008_터널-전단면-내공변위-측정시스템_상부아치내공변위.webp"
REGISTRY_PATCH = ROOT / "scripts/patch-img008-rework-status.mjs"

W, H = 1920, 1080
NAVY = (11, 31, 58)
TEAL = (0, 166, 166)
GRAY = (102, 116, 128)
LIGHT = (245, 247, 250)
MID = (210, 218, 226)
DARK = (45, 55, 65)
WHITE = (255, 255, 255)
BG = (248, 250, 252)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = []
    if sys.platform.startswith("win"):
        candidates += [
            r"C:\Windows\Fonts\malgunbd.ttf" if bold else r"C:\Windows\Fonts\malgun.ttf",
            r"C:\Windows\Fonts\NotoSansKR-Bold.otf" if bold else r"C:\Windows\Fonts\NotoSansKR-Regular.otf",
        ]
    candidates += [
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc" if bold else "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc" if bold else "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/System/Library/Fonts/AppleSDGothicNeo.ttc",
    ]
    for p in candidates:
        if p and os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()


F_TITLE = font(54, True)
F_SUB = font(27, False)
F_HEAD = font(31, True)
F_LABEL = font(25, True)
F_SMALL = font(20, False)
F_TINY = font(17, False)
F_POINT = font(24, True)


def text(draw: ImageDraw.ImageDraw, xy, value: str, fill=NAVY, fnt=None, anchor=None):
    draw.text(xy, value, fill=fill, font=fnt or F_SMALL, anchor=anchor)


def line_arrow(draw: ImageDraw.ImageDraw, p1, p2, fill=TEAL, width=5, head=16):
    draw.line([p1, p2], fill=fill, width=width)
    x1, y1 = p1
    x2, y2 = p2
    ang = math.atan2(y2 - y1, x2 - x1)
    pts = []
    for a in (ang + math.pi * 0.82, ang - math.pi * 0.82):
        pts.append((x2 + head * math.cos(a), y2 + head * math.sin(a)))
    draw.polygon([p2, pts[0], pts[1]], fill=fill)


def dashed_arc(draw: ImageDraw.ImageDraw, bbox, start, end, fill, width=4, dash=8):
    for a in range(start, end, dash * 2):
        draw.arc(bbox, a, min(a + dash, end), fill=fill, width=width)


def draw_tunnel(draw: ImageDraw.ImageDraw):
    # Tunnel geometry
    cx, cy = 675, 680
    rx_outer, ry_outer = 500, 430
    rx_inner, ry_inner = 410, 345
    base_y = 755

    # Light ground panel
    draw.rounded_rectangle([100, 165, 1210, 955], radius=28, fill=WHITE, outline=(225, 232, 240), width=2)

    # Outer lining arch
    outer = [cx - rx_outer, cy - ry_outer, cx + rx_outer, cy + ry_outer]
    inner = [cx - rx_inner, cy - ry_inner, cx + rx_inner, cy + ry_inner]
    draw.arc(outer, 200, 340, fill=MID, width=95)
    draw.arc(inner, 200, 340, fill=NAVY, width=5)
    draw.arc(outer, 200, 340, fill=DARK, width=5)

    # Side walls and invert / roadbed
    left_wall_outer = (cx - 470, base_y)
    right_wall_outer = (cx + 470, base_y)
    left_wall_inner = (cx - 385, base_y)
    right_wall_inner = (cx + 385, base_y)
    draw.line([left_wall_outer, (cx - 425, 610)], fill=DARK, width=6)
    draw.line([right_wall_outer, (cx + 425, 610)], fill=DARK, width=6)
    draw.line([left_wall_inner, (cx - 350, 620)], fill=NAVY, width=5)
    draw.line([right_wall_inner, (cx + 350, 620)], fill=NAVY, width=5)
    draw.rounded_rectangle([cx - 390, base_y - 15, cx + 390, base_y + 55], radius=20, fill=(232, 237, 243), outline=DARK, width=4)
    draw.line([(cx - 320, base_y + 20), (cx + 320, base_y + 20)], fill=(180, 190, 200), width=3)
    text(draw, (cx, base_y + 88), "노반 / 궤도부", GRAY, F_SMALL, "mm")

    # Representative points around full section
    points = {
        "P1": (cx, 305),
        "P2": (cx - 245, 380),
        "P3": (cx + 245, 380),
        "P4": (cx - 360, 565),
        "P5": (cx + 360, 565),
        "P6": (cx - 290, 715),
        "P7": (cx + 290, 715),
    }

    # Measurement lines: horizontal, vertical, diagonal
    pairs = [("P4", "P5"), ("P1", "P6"), ("P1", "P7"), ("P2", "P7"), ("P3", "P6")]
    for a, b in pairs:
        draw.line([points[a], points[b]], fill=TEAL, width=5)

    # Inward convergence arrows on representative axes
    line_arrow(draw, (points["P4"][0] + 62, points["P4"][1]), (cx - 85, points["P4"][1]), TEAL, 4, 13)
    line_arrow(draw, (points["P5"][0] - 62, points["P5"][1]), (cx + 85, points["P5"][1]), TEAL, 4, 13)
    line_arrow(draw, (points["P1"][0], points["P1"][1] + 55), (cx, cy - 110), TEAL, 4, 13)

    # Points
    for label, (x, y) in points.items():
        draw.ellipse([x - 16, y - 16, x + 16, y + 16], fill=WHITE, outline=TEAL, width=6)
        text(draw, (x, y - 34), label, TEAL, F_POINT, "mm")

    # Labels
    text(draw, (175, 220), "터널 라이닝", NAVY, F_LABEL)
    draw.line([(310, 240), (cx - 295, 345)], fill=GRAY, width=3)
    text(draw, (185, 315), "전단면 대표 측점", TEAL, F_LABEL)
    draw.line([(420, 335), points["P2"]], fill=TEAL, width=3)
    text(draw, (185, 865), "수평·수직·대각 대표 측선", TEAL, F_LABEL)
    draw.line([(510, 872), (cx, 565)], fill=TEAL, width=3)
    text(draw, (820, 865), "수렴 변위 방향", TEAL, F_LABEL)
    line_arrow(draw, (1010, 865), (950, 865), TEAL, 4, 12)


def draw_side_panel(draw: ImageDraw.ImageDraw):
    x0, y0, x1, y1 = 1260, 165, 1815, 955
    draw.rounded_rectangle([x0, y0, x1, y1], radius=30, fill=WHITE, outline=(220, 228, 236), width=2)
    draw.rounded_rectangle([x0, y0, x1, y0 + 82], radius=30, fill=NAVY)
    draw.rectangle([x0, y0 + 50, x1, y0 + 82], fill=NAVY)
    text(draw, (x0 + 30, y0 + 42), "전단면 내공변위계", WHITE, F_HEAD, "lm")

    y = y0 + 130
    text(draw, (x0 + 34, y), "측정 개념", NAVY, F_LABEL)
    y += 42
    bullets = [
        "터널 단면 전체의 내공 변화",
        "상·중·하부 대표 측점",
        "수평·수직·대각 대표 측선",
        "수렴·확대·비대칭 변형 파악",
    ]
    for b in bullets:
        text(draw, (x0 + 45, y), f"• {b}", DARK, F_SMALL)
        y += 40

    draw.line([(x0 + 30, y + 10), (x1 - 30, y + 10)], fill=(225, 232, 240), width=2)
    y += 55

    text(draw, (x0 + 34, y), "대표 측선", NAVY, F_LABEL)
    y += 55
    # Mini schematic
    mini_cx = (x0 + x1) // 2
    mini_cy = y + 155
    r = 135
    draw.arc([mini_cx - r, mini_cy - r, mini_cx + r, mini_cy + r], 200, 340, fill=GRAY, width=5)
    mp = {
        "상": (mini_cx, mini_cy - 118),
        "좌": (mini_cx - 105, mini_cy - 30),
        "우": (mini_cx + 105, mini_cy - 30),
        "좌하": (mini_cx - 80, mini_cy + 60),
        "우하": (mini_cx + 80, mini_cy + 60),
    }
    for a, b in [("좌", "우"), ("상", "좌하"), ("상", "우하"), ("좌", "우하"), ("우", "좌하")]:
        draw.line([mp[a], mp[b]], fill=TEAL, width=4)
    for k, p in mp.items():
        x, yy = p
        draw.ellipse([x - 10, yy - 10, x + 10, yy + 10], fill=WHITE, outline=TEAL, width=4)
    text(draw, (x0 + 40, mini_cy + 125), "전단면 대표 측선 예시", TEAL, F_SMALL)

    y = mini_cy + 175
    draw.line([(x0 + 30, y), (x1 - 30, y)], fill=(225, 232, 240), width=2)
    y += 38
    text(draw, (x0 + 34, y), "검수 기준", NAVY, F_LABEL)
    y += 40
    checks = ["상부 아치 단독 아님", "천단침하계 아님", "서버·UI 혼입 없음"]
    for c in checks:
        text(draw, (x0 + 45, y), f"✓ {c}", DARK, F_SMALL)
        y += 36


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--build", action="store_true", help="Run npm run build:images after generation")
    parser.add_argument("--patch-registry", action="store_true", help="Run IMG-008 registry patch script after generation")
    args = parser.parse_args()

    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    # Header
    text(draw, (95, 58), "터널 전단면 내공변위 측정시스템", NAVY, F_TITLE)
    text(draw, (98, 126), "전단면 대표 측점 · 수평/수직/대각 대표 측선 · 수렴 변위 해석", GRAY, F_SUB)
    draw.line([(95, 150), (1010, 150)], fill=TEAL, width=5)

    draw_tunnel(draw)
    draw_side_panel(draw)

    text(draw, (1810, 1018), "개념도 / 전단면 대표 측선 예시 / 현장 조건에 따라 상이", GRAY, F_TINY, "rm")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, format="WEBP", quality=92, method=6)
    print(f"Generated: {OUT}")

    if args.patch_registry:
        if REGISTRY_PATCH.exists():
            subprocess.run(["node", str(REGISTRY_PATCH)], cwd=ROOT, check=True)
        else:
            print(f"Skipped registry patch: {REGISTRY_PATCH} not found")

    if args.build:
        subprocess.run(["npm", "run", "build:images"], cwd=ROOT, check=True, shell=sys.platform.startswith("win"))

    print("Next commands:")
    print(f"  git add {OUT.relative_to(ROOT).as_posix()} scripts/image-review-registry.json js/technology/images.js docs/IMAGE_REVIEW_LOG.md")
    print('  git commit -m "Generate IMG-008 full-section convergence WebP"')
    print("  git push origin main")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
