# -*- coding: utf-8 -*-
"""
Render IMG-111: 터널 건설중 계측 개념도.

Purpose:
- Replace the low-confidence external image with a deterministic technical diagram.
- Output path intentionally keeps the existing registry path so current pages work:
  assets/images/technology/IMG-111_external.webp

Run:
  python scripts/render-img111-construction.py
"""

from __future__ import annotations

import math
import os
import textwrap
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ModuleNotFoundError as exc:
    raise SystemExit(
        "Pillow is required. Install with: python -m pip install Pillow"
    ) from exc

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "images" / "technology" / "IMG-111_external.webp"

W, H = 1600, 900
BG = (248, 250, 252)
NAVY = (18, 41, 65)
TEAL = (0, 150, 145)
TEAL2 = (0, 122, 128)
GRAY = (100, 116, 139)
LIGHT = (226, 232, 240)
MID = (203, 213, 225)
DARK = (51, 65, 85)
ORANGE = (245, 158, 11)
RED = (220, 38, 38)
WHITE = (255, 255, 255)


def pick_font(bold: bool = False) -> str | None:
    candidates = []
    if os.name == "nt":
        win = Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts"
        candidates += [
            win / ("malgunbd.ttf" if bold else "malgun.ttf"),
            win / ("NanumGothicBold.ttf" if bold else "NanumGothic.ttf"),
        ]
    candidates += [
        Path("/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf" if bold else "/usr/share/fonts/truetype/nanum/NanumGothic.ttf"),
        Path("/usr/share/fonts/truetype/nanum/NanumSquareB.ttf" if bold else "/usr/share/fonts/truetype/nanum/NanumSquareR.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
    ]
    for p in candidates:
        if p.exists():
            return str(p)
    return None

FONT_R = pick_font(False)
FONT_B = pick_font(True) or FONT_R


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    fp = FONT_B if bold else FONT_R
    if fp:
        return ImageFont.truetype(fp, size)
    return ImageFont.load_default()


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    title_f = font(48, True)
    sub_f = font(24)
    label_f = font(22, True)
    small_f = font(18)
    tiny_f = font(15)
    panel_title_f = font(28, True)
    body_f = font(20)
    body_bf = font(20, True)

    # Header
    d.rounded_rectangle([40, 30, 1560, 110], radius=24, fill=WHITE, outline=LIGHT, width=2)
    d.text((70, 50), "터널 건설중 계측 개념도", font=title_f, fill=NAVY)
    d.text((820, 62), "굴착 · 지보 · 계측 확인을 동시에 관리", font=sub_f, fill=GRAY)

    left = [45, 135, 1115, 805]
    right = [1140, 135, 1555, 805]
    d.rounded_rectangle(left, radius=28, fill=WHITE, outline=LIGHT, width=2)
    d.rounded_rectangle(right, radius=28, fill=WHITE, outline=LIGHT, width=2)

    x0, y0, x1, y1 = left
    surface_y = 240
    d.line([x0 + 60, surface_y, x1 - 55, surface_y], fill=DARK, width=4)
    for x in range(x0 + 70, x1 - 80, 35):
        d.line([x, surface_y, x + 18, surface_y + 18], fill=MID, width=2)
    d.text((x0 + 70, surface_y - 38), "지표면 / 지표침하 계측선", font=label_f, fill=DARK)

    settle_x = [190, 310, 430, 550, 670, 790, 910, 1030]
    for i, x in enumerate(settle_x, 1):
        d.ellipse([x - 7, surface_y - 7, x + 7, surface_y + 7], fill=TEAL, outline=WHITE, width=2)
        d.line([x, surface_y - 20, x, surface_y + 30], fill=TEAL, width=2)
        d.text((x - 18, surface_y - 52), f"S{i}", font=tiny_f, fill=TEAL2)

    pts = []
    cx = 600
    for t in range(0, 361, 10):
        x = 160 + (920 - 160) * t / 360
        dist = (x - cx) / 280
        y = surface_y + 30 + 45 * math.exp(-dist * dist)
        pts.append((x, y))
    for a, b in zip(pts[:-1], pts[1:]):
        if int(a[0] / 30) % 2 == 0:
            d.line([a, b], fill=TEAL, width=3)
    d.text((830, surface_y + 42), "침하 추세선", font=small_f, fill=TEAL2)

    tcx, tcy = 600, 548
    d.rounded_rectangle([x0 + 75, 300, x1 - 85, 760], radius=20, fill=(245, 248, 251), outline=LIGHT, width=1)
    d.text((x0 + 90, 318), "시공 중 터널 단면", font=label_f, fill=NAVY)

    outer = [tcx - 275, tcy - 260, tcx + 275, tcy + 230]
    inner = [tcx - 220, tcy - 205, tcx + 220, tcy + 175]
    d.arc(outer, 180, 360, fill=NAVY, width=10)
    d.line([tcx - 275, tcy - 15, tcx - 275, tcy + 160], fill=NAVY, width=10)
    d.line([tcx + 275, tcy - 15, tcx + 275, tcy + 160], fill=NAVY, width=10)
    d.line([tcx - 275, tcy + 160, tcx + 275, tcy + 160], fill=NAVY, width=10)

    d.arc(inner, 180, 360, fill=(15, 118, 110), width=8)
    d.line([tcx - 220, tcy - 5, tcx - 220, tcy + 145], fill=(15, 118, 110), width=8)
    d.line([tcx + 220, tcy - 5, tcx + 220, tcy + 145], fill=(15, 118, 110), width=8)
    d.line([tcx - 220, tcy + 145, tcx + 220, tcy + 145], fill=(15, 118, 110), width=8)

    face_x = tcx + 170
    d.polygon([(face_x, tcy - 145), (face_x + 80, tcy - 100), (face_x + 80, tcy + 120), (face_x, tcy + 145)], fill=(226, 232, 240), outline=GRAY)
    d.text((face_x + 10, tcy + 155), "막장", font=small_f, fill=GRAY)
    d.line([tcx + 315, tcy - 120, tcx + 405, tcy - 120], fill=ORANGE, width=5)
    d.polygon([(tcx + 405, tcy - 120), (tcx + 385, tcy - 132), (tcx + 385, tcy - 108)], fill=ORANGE)
    d.text((tcx + 280, tcy - 160), "굴착 진행 방향", font=body_bf, fill=ORANGE)

    for dx in [-130, -70, -10, 50, 110]:
        cx2 = tcx + dx
        d.arc([cx2 - 45, tcy - 170, cx2 + 45, tcy + 110], 200, 340, fill=GRAY, width=3)
    d.text((tcx - 325, tcy - 235), "숏크리트 · 강지보", font=small_f, fill=GRAY)

    d.rounded_rectangle([tcx - 170, tcy + 125, tcx + 170, tcy + 168], radius=10, fill=(226, 232, 240), outline=MID)
    d.text((tcx - 90, tcy + 135), "작업로 / 굴착저", font=small_f, fill=GRAY)

    points = [(-190, -50), (-135, -145), (0, -195), (135, -145), (190, -50), (-185, 60), (185, 60)]
    for idx, (dx, dy) in enumerate(points, 1):
        x, y = tcx + dx, tcy + dy
        d.ellipse([x - 10, y - 10, x + 10, y + 10], fill=TEAL, outline=WHITE, width=3)
        d.text((x + 12, y - 15), f"C{idx}", font=tiny_f, fill=TEAL2)
    center = (tcx, tcy - 20)
    for dx, dy in points[:5]:
        x, y = tcx + dx, tcy + dy
        d.line([x, y, center[0], center[1]], fill=(94, 234, 212), width=2)
    d.text((tcx - 95, tcy - 55), "내공변위", font=body_bf, fill=TEAL2)

    crown = (tcx, tcy - 205)
    d.line([crown[0], crown[1] - 100, crown[0], crown[1] - 15], fill=RED, width=4)
    d.polygon([(crown[0], crown[1] + 3), (crown[0] - 9, crown[1] - 16), (crown[0] + 9, crown[1] - 16)], fill=RED)
    d.text((crown[0] + 16, crown[1] - 95), "천단침하", font=body_bf, fill=RED)

    bhx = tcx - 360
    d.line([bhx, surface_y + 15, bhx, tcy + 120], fill=NAVY, width=5)
    for y in [surface_y + 80, surface_y + 150, surface_y + 220, surface_y + 290]:
        d.ellipse([bhx - 8, y - 8, bhx + 8, y + 8], fill=TEAL, outline=WHITE, width=2)
    d.text((bhx - 85, surface_y + 330), "지중변위\n또는 지중침하", font=small_f, fill=NAVY, spacing=5)

    box = [x1 - 250, 650, x1 - 100, 735]
    d.rounded_rectangle(box, radius=14, fill=(236, 253, 245), outline=TEAL, width=3)
    d.rectangle([box[0] + 20, box[1] + 20, box[0] + 70, box[1] + 55], fill=TEAL, outline=TEAL)
    d.text((box[0] + 82, box[1] + 18), "로거", font=body_bf, fill=TEAL2)
    d.text((box[0] + 20, box[1] + 58), "수집·전송", font=small_f, fill=TEAL2)
    for p in [(tcx + 190, tcy - 50), (tcx, tcy - 205), (settle_x[-1], surface_y)]:
        d.line([p[0], p[1], box[0], box[1] + 35], fill=MID, width=2)

    stages = [("1", "굴착"), ("2", "지보 설치"), ("3", "계측 확인")]
    sx = x0 + 105
    for num, txt in stages:
        d.ellipse([sx, 720, sx + 42, 762], fill=NAVY)
        d.text((sx + 14, 727), num, font=body_bf, fill=WHITE)
        d.text((sx + 52, 727), txt, font=body_bf, fill=DARK)
        sx += 190

    rx0, ry0, rx1, ry1 = right
    d.text((rx0 + 28, ry0 + 30), "터널 건설중 계측", font=panel_title_f, fill=NAVY)
    d.line([rx0 + 28, ry0 + 70, rx1 - 28, ry0 + 70], fill=LIGHT, width=2)

    sections = [
        ("핵심 목적", ["굴착·지보 단계의 변위 추세 확인", "이상 징후 조기 발견", "지보 안정성 판단 보조"]),
        ("주요 계측 항목", ["내공변위: 터널 내면 수렴", "천단침하: 천단 연직 침하", "지표침하: 지표면 영향 확인", "지중변위: 주변 지반 거동 확인"]),
        ("그리기 금지", ["완성 터널 유지관리 그림처럼 표현 금지", "내공변위와 천단침하 동일선 혼동 금지", "지표침하 측점을 터널 내부에 배치 금지"]),
    ]
    y = ry0 + 95
    for title, items in sections:
        d.rounded_rectangle([rx0 + 25, y, rx1 - 25, y + 34], radius=9, fill=(241, 245, 249), outline=LIGHT)
        d.text((rx0 + 42, y + 6), title, font=body_bf, fill=NAVY)
        y += 48
        for it in items:
            d.ellipse([rx0 + 42, y + 8, rx0 + 52, y + 18], fill=TEAL if title != "그리기 금지" else RED)
            lines = textwrap.wrap(it, width=23)
            for j, line in enumerate(lines):
                d.text((rx0 + 63, y + j * 24), line, font=body_f, fill=DARK)
            y += max(30, 24 * len(lines) + 6)
        y += 12

    d.rounded_rectangle([45, 820, 1555, 875], radius=18, fill=(239, 246, 255), outline=(191, 219, 254), width=1)
    d.text(
        (70, 835),
        "주석: 본 이미지는 터널 건설중 계측의 위치·목적을 설명하는 개념도이며, 실제 계측 배치와 수량은 설계·현장 조건에 따라 달라집니다.",
        font=small_f,
        fill=DARK,
    )

    img.save(OUT, "WEBP", quality=92, method=6)
    print(f"[OK] rendered {OUT}")


if __name__ == "__main__":
    main()
