#!/usr/bin/env python3
"""Render IMG-009 tunnel support instrumentation overview directly to WebP."""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
W, H = 1920, 1080


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf" if bold else "C:/Windows/Fonts/malgun.ttf", size)


def text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], value: str, size: int, *, bold: bool = False, fill: str = "#102a43") -> None:
    draw.text(xy, value, font=font(size, bold), fill=fill)


def center(draw: ImageDraw.ImageDraw, xy: tuple[int, int], value: str, size: int, *, bold: bool = False, fill: str = "#102a43") -> None:
    f = font(size, bold)
    box = draw.textbbox((0, 0), value, font=f)
    draw.text((xy[0] - (box[2] - box[0]) / 2, xy[1] - (box[3] - box[1]) / 2), value, font=f, fill=fill)


def render(output: Path) -> None:
    img = Image.new("RGB", (W, H), "#ffffff")
    draw = ImageDraw.Draw(img)
    navy, teal, blue, orange = "#082b4f", "#16817a", "#2f80ed", "#d9822b"
    rock, shotcrete, steel = "#c8b69b", "#e9edf1", "#596a7a"

    draw.rectangle((16, 16, W - 16, H - 16), outline=navy, width=3)
    text(draw, (55, 42), "터널 지보재 계측 배치도", 48, bold=True, fill=navy)
    text(draw, (58, 105), "록볼트 축력·숏크리트 응력은 전용 Figure로 분리하고, 본 도면은 설치 위치 관계만 표시", 22, fill="#334e68")

    # Main section.
    x0, y0, x1, y1 = 70, 170, 1310, 890
    draw.rounded_rectangle((x0, y0, x1, y1), radius=8, outline=navy, width=2)
    center(draw, (690, 205), "NATM 터널 지보재 계측 위치", 28, bold=True)

    # Rock mass and excavation.
    draw.rectangle((110, 250, 1270, 850), fill=rock)
    draw.rounded_rectangle((310, 355, 1070, 850), radius=275, fill="#ffffff", outline=navy, width=4)
    draw.rounded_rectangle((350, 385, 1030, 850), radius=245, outline=shotcrete, width=24)
    draw.arc((350, 385, 1030, 1045), 180, 360, fill=shotcrete, width=24)
    draw.line((375, 830, 1005, 830), fill="#d6dde3", width=22)
    text(draw, (123, 262), "암반", 24, bold=True, fill="#5f4b32")
    text(draw, (790, 393), "숏크리트", 22, bold=True, fill=navy)
    text(draw, (610, 820), "굴착면", 22, bold=True, fill=navy)

    # Steel ribs.
    for x in (485, 690, 895):
        draw.arc((x - 170, 390, x + 170, 1010), 188, 352, fill=steel, width=8)
    text(draw, (895, 560), "강지보", 20, bold=True, fill=steel)

    # Rock bolts radial, with axial load gauges on bolt axes.
    bolts = [
        ((510, 425), (360, 285), "록볼트"),
        ((690, 405), (690, 255), "축력계"),
        ((870, 425), (1020, 285), "록볼트"),
        ((420, 560), (225, 520), "록볼트"),
        ((960, 560), (1155, 520), "축력계"),
    ]
    for (a, b, lab) in bolts:
        draw.line((a, b), fill=navy, width=5)
        mx, my = (a[0] + b[0]) // 2, (a[1] + b[1]) // 2
        draw.rounded_rectangle((mx - 22, my - 10, mx + 22, my + 10), radius=5, fill="#e9f6ff", outline=navy, width=2)
        text(draw, (b[0] - 34, b[1] - 34), lab, 18, bold=True, fill=navy)

    # Shotcrete gauges embedded in lining, not floating.
    for x, y, lab in [(610, 420, "응력계"), (770, 445, "변형률계"), (540, 585, "응력계")]:
        draw.rounded_rectangle((x - 24, y - 10, x + 24, y + 10), radius=5, fill="#fff7e6", outline=orange, width=2)
        text(draw, (x + 32, y - 18), lab, 18, bold=True, fill=orange)
    text(draw, (435, 708), "숏크리트 내부 매립 계기", 20, bold=True, fill=orange)

    # Separate role tags.
    draw.rounded_rectangle((155, 705, 395, 792), radius=8, fill="#eef8f7", outline=teal, width=2)
    text(draw, (178, 724), "록볼트 축력", 22, bold=True, fill=teal)
    text(draw, (178, 758), "축 방향 하중 변화", 18, fill="#334e68")
    draw.rounded_rectangle((950, 705, 1235, 792), radius=8, fill="#fff7e6", outline=orange, width=2)
    text(draw, (975, 724), "숏크리트 응력", 22, bold=True, fill=orange)
    text(draw, (975, 758), "국부 응력·변형", 18, fill="#334e68")

    # Right checklist panel.
    px = 1390
    draw.rounded_rectangle((px, 170, 1855, 525), radius=8, outline=navy, width=2)
    draw.rectangle((px, 170, 1855, 230), fill=navy)
    center(draw, (px + 232, 204), "구분 원칙", 25, bold=True, fill="#ffffff")
    items = [
        ("IMG-078", "록볼트 축력 전용"),
        ("IMG-079", "숏크리트 응력 전용"),
        ("IMG-009", "지보재 계측 위치 보조"),
        ("금지", "공중 부유 센서·전체 안정성 단정"),
    ]
    y = 260
    for head, body in items:
        draw.ellipse((px + 28, y + 6, px + 44, y + 22), fill=teal)
        text(draw, (px + 60, y - 4), head, 21, bold=True, fill=navy)
        text(draw, (px + 155, y - 1), body, 19, fill="#334e68")
        y += 58

    draw.rounded_rectangle((px, 565, 1855, 890), radius=8, outline=navy, width=2)
    draw.rectangle((px, 565, 1855, 625), fill=navy)
    center(draw, (px + 232, 599), "범례", 25, bold=True, fill="#ffffff")
    legend = [(navy, "록볼트"), ("#e9f6ff", "축력계"), (orange, "숏크리트 매립 계기"), (steel, "강지보"), (rock, "암반")]
    y = 660
    for color, name in legend:
        draw.rectangle((px + 38, y, px + 82, y + 26), fill=color, outline=navy)
        text(draw, (px + 100, y - 1), name, 20)
        y += 48

    draw.rounded_rectangle((70, 910, 1855, 1032), radius=8, outline=navy, width=2)
    text(draw, (100, 935), "비고", 24, bold=True, fill=navy)
    text(draw, (100, 976), "- 록볼트 축력계는 록볼트 축 방향 하중 변화를 표시하며, 숏크리트 응력계와 혼동하지 않는다.", 20)
    text(draw, (100, 1006), "- 숏크리트 계기는 라이닝 내부 또는 표면 위치에 붙어 있어야 하며, 공중 부유 아이콘은 금지한다.", 20)

    output.parent.mkdir(parents=True, exist_ok=True)
    img.save(output, "WEBP", lossless=True, quality=100, method=6)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default=str(ROOT / "assets/images/technology/source/IMG-009_v4-support.webp"))
    args = parser.parse_args()
    render(Path(args.output))
    print(args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
