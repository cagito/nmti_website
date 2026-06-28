#!/usr/bin/env python3
"""Render IMG-016 circular slip surface interpretation concept to WebP."""
from __future__ import annotations

import argparse
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
W, H = 1920, 1080


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf" if bold else "C:/Windows/Fonts/malgun.ttf", size)


def text(d: ImageDraw.ImageDraw, xy: tuple[int, int], value: str, size: int, *, bold: bool = False, fill: str = "#102a43") -> None:
    d.text(xy, value, font=font(size, bold), fill=fill)


def centered(d: ImageDraw.ImageDraw, xy: tuple[int, int], value: str, size: int, *, bold: bool = False, fill: str = "#102a43") -> None:
    ft = font(size, bold)
    box = d.textbbox((0, 0), value, font=ft)
    d.text((xy[0] - (box[2] - box[0]) / 2, xy[1] - (box[3] - box[1]) / 2), value, font=ft, fill=fill)


def arrow(d: ImageDraw.ImageDraw, p0: tuple[int, int], p1: tuple[int, int], color: str, width: int = 5) -> None:
    d.line((*p0, *p1), fill=color, width=width)
    ang = math.atan2(p1[1] - p0[1], p1[0] - p0[0])
    head = 18
    d.polygon([
        p1,
        (int(p1[0] - head * math.cos(ang - 0.45)), int(p1[1] - head * math.sin(ang - 0.45))),
        (int(p1[0] - head * math.cos(ang + 0.45)), int(p1[1] - head * math.sin(ang + 0.45))),
    ], fill=color)


def dashed_line(d: ImageDraw.ImageDraw, p0: tuple[int, int], p1: tuple[int, int], color: str, width: int = 4, dash: int = 18) -> None:
    x0, y0 = p0
    x1, y1 = p1
    length = math.hypot(x1 - x0, y1 - y0)
    if length == 0:
        return
    ux, uy = (x1 - x0) / length, (y1 - y0) / length
    pos = 0.0
    while pos < length:
        end = min(pos + dash, length)
        d.line((x0 + ux * pos, y0 + uy * pos, x0 + ux * end, y0 + uy * end), fill=color, width=width)
        pos += dash * 1.8


def dashed_arc(d: ImageDraw.ImageDraw, box: tuple[int, int, int, int], start: int, end: int, color: str, width: int = 5, step: int = 8) -> None:
    on = True
    a = start
    while a < end:
        b = min(a + step, end)
        if on:
            d.arc(box, a, b, fill=color, width=width)
        on = not on
        a += step


def ipi(d: ImageDraw.ImageDraw, x: int, top: int, bottom: int) -> None:
    navy, teal = "#082b4f", "#16817a"
    d.line((x, top, x, bottom), fill=navy, width=8)
    d.ellipse((x - 18, top - 18, x + 18, top + 18), fill="#f8fbff", outline=navy, width=3)
    for y in range(top + 80, bottom - 20, 92):
        d.ellipse((x - 14, y - 14, x + 14, y + 14), fill=teal, outline=navy, width=2)
    centered(d, (x, top - 52), "센서형 다단식", 17, bold=True)
    centered(d, (x, top - 27), "지중경사계", 17, bold=True)
    centered(d, (x, bottom + 35), "Base = 안정층", 17, bold=True, fill=teal)


def graph_profile(d: ImageDraw.ImageDraw, box: tuple[int, int, int, int]) -> None:
    x0, y0, x1, y1 = box
    navy, teal, orange, blue, grid = "#082b4f", "#16817a", "#d9822b", "#1c7ed6", "#d9e2ec"
    d.rounded_rectangle((x0, y0, x1, y1), radius=8, outline=navy, width=2)
    centered(d, ((x0 + x1) // 2, y0 + 34), "누적변위-깊이 프로파일", 23, bold=True)
    gx0, gy0, gx1, gy1 = x0 + 76, y0 + 88, x1 - 54, y1 - 98
    for i in range(5):
        y = gy0 + i * (gy1 - gy0) // 4
        d.line((gx0, y, gx1, y), fill=grid, width=1)
    d.line((gx0, gy0, gx0, gy1), fill=navy, width=2)
    d.line((gx0, gy1, gx1, gy1), fill=navy, width=2)
    pts = [
        (gx0 + 10, gy0 + 18),
        (gx0 + 42, gy0 + 70),
        (gx0 + 118, gy0 + 128),
        (gx0 + 205, gy0 + 168),
        (gx0 + 270, gy0 + 220),
        (gx1 - 20, gy1 - 26),
    ]
    d.line(pts, fill=teal, width=4)
    d.rectangle((gx0 + 118, gy0 + 118, gx1 - 12, gy0 + 188), outline=orange, width=3)
    text(d, (gx0 + 144, gy0 + 92), "전단변형 집중 구간", 17, bold=True, fill=orange)
    dashed_line(d, (gx0 + 96, gy0 + 190), (gx1 - 10, gy0 + 190), blue, 3)
    text(d, (gx0 + 132, gy0 + 166), "활동면 추정 구간", 17, bold=True, fill=blue)
    text(d, (gx0 - 38, gy0 - 8), "깊이", 17, bold=True)
    text(d, (gx1 - 78, gy1 + 12), "변위", 17, bold=True)
    centered(d, ((x0 + x1) // 2, y1 - 25), "최대변위 심도는 활동면 위치가 아님", 17, bold=True, fill="#a61b1b")


def stability_panel(d: ImageDraw.ImageDraw, box: tuple[int, int, int, int]) -> None:
    x0, y0, x1, y1 = box
    navy, orange, teal, soil = "#082b4f", "#d9822b", "#16817a", "#ead6b8"
    d.rounded_rectangle((x0, y0, x1, y1), radius=8, outline=navy, width=2)
    centered(d, ((x0 + x1) // 2, y0 + 34), "원호파괴 안정해석 검토", 23, bold=True)
    base_y = y1 - 52
    d.polygon([(x0 + 45, base_y), (x0 + 190, base_y), (x0 + 340, y0 + 105), (x1 - 38, y0 + 105), (x1 - 38, base_y), (x0 + 45, base_y)], fill=soil, outline="#6b4f2a")
    d.line((x0 + 45, base_y, x0 + 190, base_y, x0 + 340, y0 + 105, x1 - 38, y0 + 105), fill="#2f855a", width=5)
    dashed_arc(d, (x0 + 70, y0 + 20, x1 - 15, y1 + 175), 196, 318, orange, 5)
    text(d, (x0 + 255, y0 + 205), "점선 원호 = 검토 모식도", 18, bold=True, fill=orange)
    text(d, (x0 + 230, y0 + 240), "계측 확정 단면 아님", 18, bold=True, fill="#a61b1b")
    arrow(d, (x0 + 290, y0 + 140), (x0 + 385, y0 + 178), teal, 4)
    text(d, (x0 + 392, y0 + 170), "하강 방향", 17, bold=True, fill=teal)


def render(output: Path) -> None:
    img = Image.new("RGB", (W, H), "#ffffff")
    d = ImageDraw.Draw(img)
    navy, teal, orange, red, gray, blue = "#082b4f", "#16817a", "#d9822b", "#a61b1b", "#52606d", "#1c7ed6"

    d.rectangle((16, 16, W - 16, H - 16), outline=navy, width=3)
    text(d, (55, 42), "원호활동면 계측 해석도", 48, bold=True, fill=navy)
    text(d, (58, 106), "추정 원호활동면과 IPI 프로파일은 병행 검토 자료이며, 단일 계측으로 활동면을 확정하지 않는다", 22, fill="#334e68")

    # Main slope section.
    d.rounded_rectangle((60, 170, 1218, 820), radius=8, outline=navy, width=2)
    d.polygon([(95, 760), (335, 760), (510, 560), (855, 335), (1190, 335), (1190, 960), (95, 960)], fill="#ead6b8", outline="#6b4f2a")
    d.line((95, 760, 335, 760, 510, 560, 855, 335, 1190, 335), fill="#2f855a", width=6)
    text(d, (105, 774), "지표면(GL)", 20, bold=True, fill=navy)
    text(d, (890, 354), "토사 사면 단면", 22, bold=True, fill=navy)

    d.polygon([(95, 805), (1190, 805), (1190, 960), (95, 960)], fill="#c8d3dc")
    text(d, (105, 825), "하부 안정층", 22, bold=True, fill=navy)

    dashed_arc(d, (185, 180, 990, 1010), 198, 333, orange, 6)
    text(d, (550, 642), "추정 원호활동면", 25, bold=True, fill=orange)
    text(d, (550, 680), "잠재 활동면 · 점선", 18, bold=True, fill=orange)
    arrow(d, (740, 455), (875, 505), teal, 5)
    text(d, (885, 498), "하강 방향 변위", 20, bold=True, fill=teal)

    ipi(d, 430, 300, 870)
    d.line((255, 626, 1040, 548), fill="#75b5d6", width=4)
    text(d, (260, 590), "G.W.L", 20, bold=True, fill=blue)
    d.ellipse((680, 555, 720, 595), fill="#e6fffa", outline=navy, width=2)
    text(d, (730, 558), "간극수압계", 20, bold=True, fill=teal)
    text(d, (730, 590), "활동면 인근 · G.W.L 아래", 17, fill=gray)
    d.line((330, 300, 380, 330), fill=red, width=4)
    d.line((355, 300, 330, 338), fill=red, width=4)
    text(d, (210, 270), "지표 균열", 18, bold=True, fill=red)
    d.ellipse((290, 735, 318, 763), fill="#f8fbff", outline=navy, width=3)
    text(d, (160, 708), "지표침하 측점", 18, bold=True, fill=navy)

    # Interpretation note.
    d.rounded_rectangle((100, 842, 1218, 932), radius=8, outline=navy, width=2)
    text(d, (130, 866), "병행 검토", 22, bold=True, fill=navy)
    text(d, (270, 866), "지질 경계 · G.W.L · 간극수압 · 균열 · 침하 · 현장관찰을 함께 판단", 21)
    text(d, (270, 900), "단일 IPI만으로 활동면 확정 금지", 22, bold=True, fill=red)

    graph_profile(d, (1260, 170, 1845, 500))
    stability_panel(d, (1260, 532, 1845, 820))

    d.rounded_rectangle((1260, 850, 1845, 932), radius=8, outline=navy, width=2)
    text(d, (1290, 874), "판정 원칙", 22, bold=True, fill=navy)
    text(d, (1420, 874), "추정·검토·가능으로 표기", 20)
    text(d, (1420, 904), "확정·인과 표현 금지", 20, bold=True, fill=red)

    d.rounded_rectangle((60, 956, 1845, 1032), radius=8, outline=navy, width=2)
    text(d, (90, 979), "검수 기준", 22, bold=True, fill=navy)
    text(d, (225, 979), "추정 원호활동면, 전단변형 집중 구간, 활동면 추정 구간, 안정해석 검토 모식도를 분리한다.", 21)
    text(d, (1665, 1000), "NMTI", 24, bold=True, fill="#9fb3c8")

    output.parent.mkdir(parents=True, exist_ok=True)
    img.save(output, "WEBP", lossless=True, quality=100, method=6)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default=str(ROOT / "assets/images/technology/source/IMG-016_v4-circular-slip.webp"))
    args = parser.parse_args()
    render(Path(args.output))
    print(args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
