#!/usr/bin/env python3
"""Render IMG-064 harbor/revetment monitoring overview directly to WebP."""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
W, H = 1920, 1080


def f(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    path = "C:/Windows/Fonts/malgunbd.ttf" if bold else "C:/Windows/Fonts/malgun.ttf"
    return ImageFont.truetype(path, size)


def t(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, size: int, *, bold: bool = False, fill: str = "#102a43") -> None:
    draw.text(xy, text, font=f(size, bold), fill=fill)


def tc(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, size: int, *, bold: bool = False, fill: str = "#102a43") -> None:
    box = draw.textbbox((0, 0), text, font=f(size, bold))
    draw.text((xy[0] - (box[2] - box[0]) / 2, xy[1] - (box[3] - box[1]) / 2), text, font=f(size, bold), fill=fill)


def dashed(draw: ImageDraw.ImageDraw, x0: int, y0: int, x1: int, y1: int, fill: str, width: int = 3) -> None:
    if y0 == y1:
        x = x0
        while x < x1:
            draw.line((x, y0, min(x + 18, x1), y1), fill=fill, width=width)
            x += 34
    else:
        y = y0
        while y < y1:
            draw.line((x0, y, x1, min(y + 18, y1)), fill=fill, width=width)
            y += 34


def borehole(draw: ImageDraw.ImageDraw, x: int, y_top: int, y_bot: int, title: str, *, nodes: bool = False) -> None:
    draw.rounded_rectangle((x - 10, y_top, x + 10, y_bot), radius=7, fill="#f8fbff", outline="#0b3a66", width=2)
    draw.rectangle((x - 17, y_top - 13, x + 17, y_top + 5), fill="#ffffff", outline="#0b3a66", width=2)
    if nodes:
        for y in range(y_top + 40, y_bot - 14, 42):
            draw.ellipse((x - 6, y - 6, x + 6, y + 6), fill="#2f80ed", outline="#0b3a66")
    else:
        for y in range(y_top + 30, y_bot - 14, 22):
            draw.line((x - 7, y, x + 7, y), fill="#2f80ed", width=2)
    tc(draw, (x, y_top - 36), title, 18, bold=True)


def piezometer(draw: ImageDraw.ImageDraw, x: int, y_top: int, y_bot: int) -> None:
    draw.line((x, y_top, x, y_bot), fill="#102a43", width=3)
    draw.rectangle((x - 13, y_top - 12, x + 13, y_top + 5), fill="#ffffff", outline="#102a43", width=2)
    draw.rounded_rectangle((x - 12, y_bot - 44, x + 12, y_bot), radius=5, fill="#e9f6ff", outline="#102a43", width=2)
    for y in range(y_bot - 35, y_bot - 5, 9):
        draw.line((x - 7, y, x + 7, y), fill="#2f80ed", width=2)
    tc(draw, (x, y_top - 36), "간극수압계", 18, bold=True)


def render(output: Path) -> None:
    img = Image.new("RGB", (W, H), "#ffffff")
    draw = ImageDraw.Draw(img)
    navy, blue, teal = "#082b4f", "#2f80ed", "#16817a"
    soil, soil2, sea = "#ead6b8", "#c9a77d", "#bfe6f8"

    draw.rectangle((16, 16, W - 16, H - 16), outline=navy, width=3)
    t(draw, (55, 42), "항만·호안 계측 전체 개념도", 48, bold=True, fill=navy)
    tc(draw, (360, 148), "육측(뒤채움·매립)", 24, bold=True)
    tc(draw, (830, 148), "케이슨·안벽", 24, bold=True)
    tc(draw, (1220, 148), "해측(바다·조위)", 24, bold=True)

    left, top, right, bottom = 48, 165, 1420, 890
    gl, seabed = 610, 760
    draw.rounded_rectangle((left, top, right, bottom), radius=8, outline=navy, width=2)
    draw.rectangle((left + 20, gl, 780, bottom - 16), fill=soil)
    draw.rectangle((left + 20, seabed, 780, bottom - 16), fill=soil2)
    for x in range(left + 35, 760, 36):
        draw.line((x, gl + 8, x + 16, gl + 18), fill="#d3b88f", width=2)
    draw.rectangle((990, 350, right - 20, seabed), fill=sea)
    draw.rectangle((990, seabed, right - 20, bottom - 16), fill="#a6d6ee")

    draw.rectangle((780, 350, 990, seabed), fill="#d8dde2", outline=navy, width=4)
    draw.rectangle((815, 372, 955, 735), outline="#6b7c8f", width=2)
    for y in (430, 510, 590):
        draw.line((796, y, 974, y), fill="#aab4bd", width=2)
    draw.polygon((760, seabed, 1010, seabed, 1050, bottom - 16, 720, bottom - 16), fill="#b9b0a5", outline=navy)
    draw.polygon((990, 610, 1130, 672, 1010, seabed, 990, seabed), fill="#a8a8a8", outline=navy)
    t(draw, (300, 650), "뒤채움 토사", 24, bold=True, fill="#6b4f2a")
    tc(draw, (885, 333), "케이슨", 24, bold=True)
    t(draw, (1040, 655), "사석마운드", 20, bold=True)

    dashed(draw, 1000, 455, right - 55, 455, blue, 3)
    dashed(draw, 1000, 535, right - 55, 535, "#4aa3df", 2)
    t(draw, (1240, 430), "H.W.L", 18, bold=True, fill=blue)
    t(draw, (1240, 544), "L.W.L", 18, bold=True, fill="#2878a8")
    dashed(draw, 150, 560, 735, 560, teal, 3)
    t(draw, (160, 526), "G.W.L", 20, bold=True, fill=teal)

    borehole(draw, 245, 500, 800, "지중경사계", nodes=True)
    draw.ellipse((352, 596, 378, 622), fill="#ffffff", outline=navy, width=2)
    t(draw, (330, 560), "지표침하계", 18, bold=True)
    borehole(draw, 500, 480, 735, "지하수위계")
    piezometer(draw, 650, 525, 760)
    draw.rounded_rectangle((560, 365, 685, 457), radius=8, fill="#d7dee3", outline=navy, width=2)
    t(draw, (555, 335), "데이터로거", 18, bold=True)
    for i in range(4):
        draw.line((586, 395 + i * 12, 634, 395 + i * 12), fill=blue, width=2)
        draw.ellipse((648, 390 + i * 12, 658, 400 + i * 12), fill="#1f9d55")

    draw.rounded_rectangle((805, 360, 845, 400), radius=4, fill="#e9f6ff", outline=navy, width=2)
    t(draw, (850, 365), "구조물경사계", 18, bold=True)
    draw.line((988, 430, 1050, 430), fill=navy, width=4)
    draw.rectangle((1035, 415, 1062, 445), fill="#e9f6ff", outline=navy, width=2)
    t(draw, (1068, 410), "변위계", 18, bold=True)
    draw.rectangle((790, 740, 835, 770), fill="#e9f6ff", outline=navy, width=2)
    draw.rectangle((935, 740, 980, 770), fill="#e9f6ff", outline=navy, width=2)
    t(draw, (815, 786), "반력계", 18, bold=True)
    borehole(draw, 1160, seabed - 6, 855, "해측 지중경사계", nodes=True)
    draw.line((1300, 455, 1300, 610), fill=navy, width=4)
    draw.rectangle((1282, 440, 1318, 468), fill="#e9f6ff", outline=navy, width=2)
    t(draw, (1240, 388), "조위계", 20, bold=True)

    draw.rounded_rectangle((60, 905, 1420, 1032), radius=8, outline=navy, width=2)
    t(draw, (90, 928), "비고", 24, bold=True, fill=navy)
    t(draw, (90, 970), "- 동일 대표 단면에서 구조물·육측 지반·해측 지반·조위를 함께 확인", 22)
    t(draw, (90, 1004), "- 조위선, G.W.L, 간극수압은 서로 다른 물리량으로 분리 표기", 22)

    px = 1460
    draw.rounded_rectangle((px, 64, 1870, 530), radius=8, outline=navy, width=2)
    draw.rectangle((px, 64, 1870, 122), fill=navy)
    tc(draw, (1665, 96), "항만·호안 계측 항목", 24, bold=True, fill="#ffffff")
    items = [
        ("구조물", "변위·경사·반력"),
        ("육측 지반", "지표침하·지중변위·G.W.L"),
        ("해측 지반", "지중변위·사석마운드 안정"),
        ("수리 항목", "조위·간극수압"),
        ("수집", "데이터로거 자동수집"),
    ]
    y = 165
    for head, body in items:
        draw.ellipse((px + 28, y + 4, px + 44, y + 20), fill=teal)
        t(draw, (px + 58, y - 4), head, 20, bold=True)
        t(draw, (px + 58, y + 26), body, 18, fill="#334e68")
        y += 76

    draw.rounded_rectangle((px, 565, 1870, 890), radius=8, outline=navy, width=2)
    draw.rectangle((px, 565, 1870, 623), fill=navy)
    tc(draw, (1665, 597), "범례", 24, bold=True, fill="#ffffff")
    legend = [(blue, "조위선(H.W.L/L.W.L)"), (teal, "G.W.L 지하수위"), ("#2f80ed", "지중경사계·관측공"), ("#e9f6ff", "구조물 부착 계기"), (soil, "뒤채움 토사")]
    y = 655
    for color, name in legend:
        draw.rectangle((px + 36, y, px + 76, y + 24), fill=color, outline=navy)
        t(draw, (px + 92, y - 2), name, 18)
        y += 48

    output.parent.mkdir(parents=True, exist_ok=True)
    img.save(output, "WEBP", lossless=True, quality=100, method=6)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default=str(ROOT / "assets/images/technology/source/IMG-064_v4-harbor.webp"))
    args = parser.parse_args()
    render(Path(args.output))
    print(args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
