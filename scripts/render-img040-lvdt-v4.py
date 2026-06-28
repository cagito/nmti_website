#!/usr/bin/env python3
"""Render IMG-040 displacement transducer installation concept to WebP."""
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


def graph(d: ImageDraw.ImageDraw, box: tuple[int, int, int, int]) -> None:
    x0, y0, x1, y1 = box
    navy, teal, grid = "#082b4f", "#16817a", "#d9e2ec"
    d.rounded_rectangle((x0, y0, x1, y1), radius=8, outline=navy, width=2)
    centered(d, ((x0 + x1) // 2, y0 + 34), "변위-시간", 22, bold=True)
    gx0, gy0, gx1, gy1 = x0 + 64, y0 + 82, x1 - 45, y1 - 54
    for i in range(5):
        y = gy0 + i * (gy1 - gy0) // 4
        d.line((gx0, y, gx1, y), fill=grid, width=1)
    d.line((gx0, gy0, gx0, gy1), fill=navy, width=2)
    d.line((gx0, gy1, gx1, gy1), fill=navy, width=2)
    pts = [(gx0 + 10, gy1 - 22), (gx0 + 105, gy1 - 42), (gx0 + 215, gy1 - 74), (gx1 - 12, gy0 + 45)]
    d.line(pts, fill=teal, width=4)
    text(d, (gx0 - 38, gy0 - 8), "δ", 20, bold=True, fill=teal)
    text(d, (gx1 - 18, gy1 + 10), "t", 18, bold=True)


def render(output: Path) -> None:
    img = Image.new("RGB", (W, H), "#ffffff")
    d = ImageDraw.Draw(img)
    navy, teal, orange, red, gray = "#082b4f", "#16817a", "#d9822b", "#a61b1b", "#52606d"

    d.rectangle((16, 16, W - 16, H - 16), outline=navy, width=3)
    text(d, (55, 42), "변위계 설치 개념도", 48, bold=True, fill=navy)
    text(d, (58, 106), "안정 기준점과 이동 대상점 사이의 1축 변위 δ를 LVDT/변위계로 측정", 22, fill="#334e68")

    # Main installation.
    d.rounded_rectangle((65, 175, 1235, 812), radius=8, outline=navy, width=2)
    d.rectangle((135, 545, 545, 690), fill="#d6dde3", outline=navy, width=3)
    d.rectangle((770, 545, 1165, 690), fill="#d6dde3", outline=navy, width=3)
    text(d, (160, 705), "안정 기준점 구조부재", 21, bold=True)
    text(d, (882, 705), "이동 대상점 구조부재", 21, bold=True)
    d.rounded_rectangle((162, 748, 528, 792), radius=8, fill="#fff8e6", outline=orange, width=2)
    centered(d, (345, 770), "영향권 밖 안정 부재", 18, bold=True, fill=orange)

    # Brackets and LVDT.
    d.rectangle((410, 395, 485, 545), fill="#eef6ff", outline=navy, width=3)
    d.rectangle((835, 395, 910, 545), fill="#eef6ff", outline=navy, width=3)
    centered(d, (448, 370), "고정부 브라켓", 19, bold=True)
    centered(d, (872, 370), "이동부 브라켓", 19, bold=True)
    for x in (430, 463, 855, 888):
        d.ellipse((x - 6, 476, x + 6, 488), fill=navy)

    d.rounded_rectangle((500, 443, 670, 497), radius=15, fill="#fff8e6", outline=orange, width=3)
    centered(d, (585, 470), "변위계", 21, bold=True, fill=orange)
    d.line((670, 470, 840, 470), fill=teal, width=8)
    d.ellipse((832, 462, 848, 478), fill=teal, outline=navy, width=1)
    centered(d, (585, 525), "LVDT 본체", 18, bold=True, fill=orange)
    centered(d, (755, 438), "측정축 = 변위 방향", 20, bold=True, fill=teal)
    arrow(d, (720, 330), (910, 330), teal, 5)
    centered(d, (815, 300), "δ 변위", 24, bold=True, fill=teal)

    # Stroke and neutral.
    d.line((515, 250, 895, 250), fill=navy, width=3)
    d.line((515, 232, 515, 268), fill=navy, width=3)
    d.line((895, 232, 895, 268), fill=navy, width=3)
    d.line((705, 225, 705, 285), fill=orange, width=4)
    centered(d, (705, 205), "중립 위치", 20, bold=True, fill=orange)
    centered(d, (705, 278), "stroke 범위", 20, bold=True, fill=navy)
    d.line((485, 510, 500, 510), fill=red, width=4)
    d.line((835, 510, 820, 510), fill=red, width=4)
    text(d, (524, 558), "브라켓 유격 점검", 18, bold=True, fill=red)

    # Cable/logger secondary.
    d.line((585, 497, 585, 610, 1040, 610, 1040, 508), fill="#7b8794", width=4)
    d.rounded_rectangle((980, 398, 1140, 508), radius=10, fill="#f8fbff", outline=navy, width=3)
    centered(d, (1060, 436), "데이터로거", 21, bold=True)
    centered(d, (1060, 473), "보조 함체", 18, fill=gray)

    d.rounded_rectangle((95, 835, 1235, 930), radius=8, outline=navy, width=2)
    text(d, (130, 862), "설치 체크", 22, bold=True, fill=navy)
    text(d, (280, 862), "기준점 안정성 · 측정축 정렬 · stroke 중립 · 브라켓 유격 · 영점 확인", 21)
    text(d, (280, 898), "온도 영향은 보조 인자로 기록하고 보정한다.", 21, fill=gray)

    # Right panels.
    graph(d, (1285, 175, 1845, 500))
    d.rounded_rectangle((1285, 540, 1845, 930), radius=8, outline=navy, width=2)
    centered(d, (1565, 580), "금지·구분", 24, bold=True)
    items = [
        ("한 목적", "LVDT/변위계 1축만 표시"),
        ("ATS 없음", "광학망은 IMG-042 전용"),
        ("신축계 아님", "IMG-039와 구분"),
        ("기준점", "움직이는 대상점과 분리"),
    ]
    y = 635
    for head, body in items:
        d.ellipse((1322, y + 6, 1340, y + 24), fill=teal)
        text(d, (1355, y), head, 20, bold=True, fill=navy)
        text(d, (1510, y), body, 19, fill="#334e68")
        y += 62

    d.rounded_rectangle((60, 956, 1845, 1032), radius=8, outline=navy, width=2)
    text(d, (90, 979), "검수 기준", 22, bold=True, fill=navy)
    text(d, (225, 979), "고정부·이동부, 측정축, 변위 방향, stroke, 중립 위치가 한 도면에서 읽혀야 한다.", 21)
    text(d, (1665, 1000), "NMTI", 24, bold=True, fill="#9fb3c8")

    output.parent.mkdir(parents=True, exist_ok=True)
    img.save(output, "WEBP", lossless=True, quality=100, method=6)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default=str(ROOT / "assets/images/technology/source/IMG-040_v4-lvdt.webp"))
    args = parser.parse_args()
    render(Path(args.output))
    print(args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
