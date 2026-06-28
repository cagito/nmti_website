#!/usr/bin/env python3
"""Render IMG-081 column shortening monitoring concept directly to WebP."""
from __future__ import annotations

import argparse
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
W, H = 1920, 1080


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf" if bold else "C:/Windows/Fonts/malgun.ttf", size)


def text(d: ImageDraw.ImageDraw, xy: tuple[int, int], s: str, size: int, *, bold: bool = False, fill: str = "#102a43") -> None:
    d.text(xy, s, font=font(size, bold), fill=fill)


def centered(d: ImageDraw.ImageDraw, xy: tuple[int, int], s: str, size: int, *, bold: bool = False, fill: str = "#102a43") -> None:
    ft = font(size, bold)
    box = d.textbbox((0, 0), s, font=ft)
    d.text((xy[0] - (box[2] - box[0]) / 2, xy[1] - (box[3] - box[1]) / 2), s, font=ft, fill=fill)


def arrow(d: ImageDraw.ImageDraw, p0: tuple[int, int], p1: tuple[int, int], color: str, width: int = 5) -> None:
    d.line((*p0, *p1), fill=color, width=width)
    ang = math.atan2(p1[1] - p0[1], p1[0] - p0[0])
    head = 18
    d.polygon([
        p1,
        (int(p1[0] - head * math.cos(ang - 0.45)), int(p1[1] - head * math.sin(ang - 0.45))),
        (int(p1[0] - head * math.cos(ang + 0.45)), int(p1[1] - head * math.sin(ang + 0.45))),
    ], fill=color)


def strain_gauge(d: ImageDraw.ImageDraw, x: int, y: int, label: str) -> None:
    navy, teal = "#082b4f", "#16817a"
    d.rounded_rectangle((x - 28, y - 42, x + 28, y + 42), radius=8, fill="#e6fffa", outline=navy, width=2)
    d.line((x - 16, y - 24, x + 16, y + 24), fill=teal, width=3)
    d.line((x + 16, y - 24, x - 16, y + 24), fill=teal, width=3)
    text(d, (x + 38, y - 18), label, 17, bold=True, fill=teal)


def thermometer(d: ImageDraw.ImageDraw, x: int, y: int) -> None:
    navy, orange = "#082b4f", "#d9822b"
    d.rounded_rectangle((x - 10, y - 38, x + 10, y + 20), radius=8, fill="#fff8e6", outline=navy, width=2)
    d.ellipse((x - 18, y + 10, x + 18, y + 46), fill="#fff8e6", outline=navy, width=2)
    d.line((x, y + 10, x, y - 25), fill=orange, width=5)
    d.ellipse((x - 10, y + 18, x + 10, y + 38), fill=orange)
    text(d, (x + 28, y - 6), "온도계", 17, bold=True, fill=orange)


def cumulative_graph(d: ImageDraw.ImageDraw, box: tuple[int, int, int, int]) -> None:
    x0, y0, x1, y1 = box
    navy, teal, orange, grid = "#082b4f", "#16817a", "#d9822b", "#d9e2ec"
    d.rounded_rectangle((x0, y0, x1, y1), radius=8, outline=navy, width=2)
    centered(d, ((x0 + x1) // 2, y0 + 34), "층별 시간 경과 축소량 예시", 22, bold=True)
    gx0, gy0, gx1, gy1 = x0 + 70, y0 + 86, x1 - 45, y1 - 58
    for i in range(5):
        y = gy0 + i * (gy1 - gy0) // 4
        d.line((gx0, y, gx1, y), fill=grid, width=1)
    d.line((gx0, gy0, gx0, gy1), fill=navy, width=2)
    d.line((gx0, gy1, gx1, gy1), fill=navy, width=2)
    series = [
        ("저층", teal, [(gx0 + 8, gy1 - 20), (gx0 + 120, gy1 - 54), (gx0 + 250, gy1 - 92), (gx1 - 18, gy1 - 122)]),
        ("중층", orange, [(gx0 + 8, gy1 - 12), (gx0 + 120, gy1 - 32), (gx0 + 250, gy1 - 62), (gx1 - 18, gy1 - 86)]),
        ("상층", "#596a7a", [(gx0 + 8, gy1 - 8), (gx0 + 120, gy1 - 18), (gx0 + 250, gy1 - 36), (gx1 - 18, gy1 - 48)]),
    ]
    ly = y0 + 78
    for name, color, pts in series:
        d.line(pts, fill=color, width=4)
        d.rectangle((x1 - 142, ly - 8, x1 - 124, ly + 10), fill=color)
        text(d, (x1 - 116, ly - 14), name, 16, fill="#334e68")
        ly += 28
    text(d, (gx0 - 52, gy0 - 8), "축소", 17, bold=True)
    text(d, (gx1 - 18, gy1 + 12), "시공단계", 17, bold=True)


def render(output: Path) -> None:
    img = Image.new("RGB", (W, H), "#ffffff")
    d = ImageDraw.Draw(img)
    navy, teal, orange, red, gray = "#082b4f", "#16817a", "#d9822b", "#a61b1b", "#52606d"

    d.rectangle((16, 16, W - 16, H - 16), outline=navy, width=3)
    text(d, (55, 42), "기둥 축소량 계측 개념도", 48, bold=True, fill=navy)
    text(d, (58, 106), "층별 변형률·온도·시공단계를 함께 보아 누적 축소량을 해석", 22, fill="#334e68")

    # Building section.
    d.rounded_rectangle((60, 170, 1218, 835), radius=8, outline=navy, width=2)
    gl_y = 780
    d.rectangle((105, gl_y, 1175, gl_y + 24), fill="#9fb3c8", outline=navy, width=2)
    text(d, (120, gl_y + 32), "지표면 / 1층 바닥", 20, bold=True, fill=navy)
    # Columns and core.
    cols = [(245, 360), (520, 635), (850, 965)]
    for x0, x1 in cols:
        d.rectangle((x0, 265, x1, gl_y), fill="#d6dde3", outline=navy, width=3)
    d.rectangle((610, 235, 760, gl_y), fill="#c6d0d9", outline=navy, width=3)
    centered(d, (685, 210), "코어벽", 21, bold=True)
    centered(d, (305, 240), "위험 기둥 A", 20, bold=True)
    centered(d, (910, 240), "위험 기둥 B", 20, bold=True)

    # Floors.
    for i, y in enumerate([300, 405, 510, 615, 720]):
        d.rectangle((180, y - 10, 1085, y + 10), fill="#eef2f6", outline=navy, width=2)
        centered(d, (155, y), f"{5 - i}F", 17, bold=True, fill=gray)

    # Door and P0-1 signal.
    d.rectangle((455, 708, 505, gl_y), fill="#ffffff", outline=navy, width=2)
    d.arc((466, 714, 520, 772), 270, 360, fill=teal, width=2)

    # Strain gauges and temperature.
    for y, lab in [(330, "5F"), (435, "4F"), (540, "3F"), (645, "2F")]:
        strain_gauge(d, 360, y, f"변형률계 {lab}")
        strain_gauge(d, 910, y, f"변형률계 {lab}")
    thermometer(d, 775, 420)
    text(d, (775, 475), "온도 보정", 18, bold=True, fill=orange)

    # Shortening arrows, not single rod.
    for x in (310, 910):
        arrow(d, (x, 292), (x, 345), teal, 4)
        arrow(d, (x, 397), (x, 450), teal, 4)
        arrow(d, (x, 502), (x, 555), teal, 4)
        text(d, (x + 32, 573), "층별 축소", 18, bold=True, fill=teal)

    d.rounded_rectangle((92, 842, 1218, 932), radius=8, outline=navy, width=2)
    text(d, (125, 866), "해석 원칙", 22, bold=True, fill=navy)
    text(d, (260, 866), "탄성축소 · 크리프 · 건조수축 · 시공하중 증가 · 재령 차이를 분리 검토", 21)
    text(d, (260, 902), "RF층 또는 단일 로드 하나를 절대 기준으로 두지 않는다.", 21, bold=True, fill=red)

    # Right panels.
    cumulative_graph(d, (1260, 170, 1845, 520))

    d.rounded_rectangle((1260, 555, 1845, 932), radius=8, outline=navy, width=2)
    centered(d, (1552, 595), "측정·기록 항목", 24, bold=True)
    items = [
        ("층별 변형률", "주요 기둥·코어벽"),
        ("층별 표고", "승장 시 측량 기록"),
        ("온도·재령", "보정·해석 보조"),
        ("누적 축소", "설계 예측과 비교"),
        ("예시 그래프", "현장별 기준 적용"),
    ]
    y = 648
    for head, body in items:
        d.ellipse((1300, y + 5, 1318, y + 23), fill=teal)
        text(d, (1334, y - 2), head, 20, bold=True, fill=navy)
        text(d, (1480, y), body, 19, fill="#334e68")
        y += 55

    d.rounded_rectangle((60, 956, 1845, 1032), radius=8, outline=navy, width=2)
    text(d, (90, 979), "검수 기준", 22, bold=True, fill=navy)
    text(d, (225, 979), "기둥축소는 단일 수직 변위계가 아니라 층별 변형률·온도·시공단계의 누적 해석으로 표현한다.", 21)
    text(d, (1665, 1000), "NMTI", 24, bold=True, fill="#9fb3c8")

    output.parent.mkdir(parents=True, exist_ok=True)
    img.save(output, "WEBP", lossless=True, quality=100, method=6)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default=str(ROOT / "assets/images/technology/source/IMG-081_v4-column-shortening.webp"))
    args = parser.parse_args()
    render(Path(args.output))
    print(args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
