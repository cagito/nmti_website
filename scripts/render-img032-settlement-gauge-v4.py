#!/usr/bin/env python3
"""Render IMG-032 settlement plate / settlement gauge concept directly to WebP."""
from __future__ import annotations

import argparse
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
W, H = 1920, 1080


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf" if bold else "C:/Windows/Fonts/malgun.ttf", size)


def text(
    d: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    value: str,
    size: int,
    *,
    bold: bool = False,
    fill: str = "#102a43",
) -> None:
    d.text(xy, value, font=font(size, bold), fill=fill)


def centered(
    d: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    value: str,
    size: int,
    *,
    bold: bool = False,
    fill: str = "#102a43",
) -> None:
    ft = font(size, bold)
    box = d.textbbox((0, 0), value, font=ft)
    d.text((xy[0] - (box[2] - box[0]) / 2, xy[1] - (box[3] - box[1]) / 2), value, font=ft, fill=fill)


def arrow(d: ImageDraw.ImageDraw, p0: tuple[int, int], p1: tuple[int, int], color: str, width: int = 5) -> None:
    d.line((*p0, *p1), fill=color, width=width)
    ang = math.atan2(p1[1] - p0[1], p1[0] - p0[0])
    head = 20
    d.polygon(
        [
            p1,
            (int(p1[0] - head * math.cos(ang - 0.45)), int(p1[1] - head * math.sin(ang - 0.45))),
            (int(p1[0] - head * math.cos(ang + 0.45)), int(p1[1] - head * math.sin(ang + 0.45))),
        ],
        fill=color,
    )


def label_box(d: ImageDraw.ImageDraw, box: tuple[int, int, int, int], title: str, body: str, accent: str = "#16817a") -> None:
    x0, y0, x1, y1 = box
    navy = "#082b4f"
    d.rounded_rectangle(box, radius=8, fill="#ffffff", outline=navy, width=2)
    d.rectangle((x0, y0, x1, y0 + 48), fill=navy)
    centered(d, ((x0 + x1) // 2, y0 + 25), title, 22, bold=True, fill="#ffffff")
    d.ellipse((x0 + 22, y0 + 70, x0 + 42, y0 + 90), fill=accent)
    text(d, (x0 + 58, y0 + 61), body, 20, fill="#334e68")


def hatch_soil(d: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str = "#d9b781") -> None:
    x0, y0, x1, y1 = box
    for x in range(x0 - 120, x1 + 120, 32):
        d.line((x, y1, x + 170, y0), fill=color, width=1)


def render(output: Path) -> None:
    img = Image.new("RGB", (W, H), "#ffffff")
    d = ImageDraw.Draw(img)
    navy, teal, orange = "#082b4f", "#16817a", "#d9822b"
    gray, soil, fill_soil = "#52606d", "#8a6f3d", "#ead6b8"

    d.rectangle((16, 16, W - 16, H - 16), outline=navy, width=3)
    text(d, (55, 42), "침하판·침하계 설치 개념도", 48, bold=True, fill=navy)
    text(d, (58, 106), "성토 하부 침하판, 연장봉, 보호관과 침하 방향을 분리해 표시", 22, fill="#334e68")

    # Main drawing frame.
    d.rounded_rectangle((60, 165, 1285, 955), radius=8, outline=navy, width=2)

    # Embankment and natural ground.
    ground_y = 610
    embankment = [(155, ground_y), (480, 365), (875, 365), (1205, ground_y)]
    d.polygon(embankment, fill=fill_soil, outline=soil)
    d.line((155, ground_y, 1205, ground_y), fill=soil, width=4)
    d.line((60, ground_y, 1285, ground_y), fill="#6b4f2a", width=3)
    hatch_soil(d, (155, 365, 1205, ground_y), "#d1a869")
    d.rectangle((60, ground_y, 1285, 925), fill="#f5e8cc", outline=None)
    hatch_soil(d, (60, ground_y, 1285, 925), "#d8c49d")
    d.line((60, ground_y, 1285, ground_y), fill="#6b4f2a", width=4)
    text(d, (85, ground_y - 43), "지표면", 24, bold=True, fill="#6b4f2a")
    d.line((185, ground_y - 10, 308, ground_y - 10), fill="#6b4f2a", width=3)

    # Settlement plate, extension rod and protection pipe.
    cx = 690
    plate_y = 790
    d.rounded_rectangle((cx - 215, plate_y, cx + 215, plate_y + 42), radius=6, fill="#c8d2dc", outline=navy, width=3)
    d.rectangle((cx - 175, plate_y - 13, cx + 175, plate_y), fill="#e9eef3", outline=navy, width=2)
    centered(d, (cx, plate_y + 72), "침하판", 25, bold=True, fill=navy)

    pipe_left, pipe_right = cx - 40, cx + 40
    d.rounded_rectangle((pipe_left, ground_y - 92, pipe_right, plate_y + 6), radius=12, fill="#f8fbff", outline=navy, width=3)
    d.rectangle((cx - 9, ground_y - 78, cx + 9, plate_y + 3), fill=teal, outline="#0f5c56")
    d.rounded_rectangle((cx - 66, ground_y - 146, cx + 66, ground_y - 92), radius=10, fill="#eef6ff", outline=navy, width=3)
    d.rectangle((cx - 24, ground_y - 92, cx + 24, ground_y - 78), fill="#d7f2ef", outline=navy, width=2)
    centered(d, (cx, ground_y - 170), "측정점", 24, bold=True, fill=teal)

    # Settlement arrows.
    for ax in (cx - 320, cx, cx + 320):
        arrow(d, (ax, 425), (ax, 542), teal, 6)
    centered(d, (cx, 330), "침하 방향", 26, bold=True, fill=teal)

    # Leader labels.
    d.line((cx + 58, ground_y - 50, 1040, 500), fill=navy, width=2)
    label_box(d, (1040, 430, 1235, 565), "보호관", "연장봉 보호")
    d.line((cx + 15, 705, 1038, 676), fill=navy, width=2)
    label_box(d, (1040, 610, 1235, 745), "연장봉", "침하 전달")
    d.line((cx - 60, plate_y + 22, 285, 802), fill=navy, width=2)
    label_box(d, (105, 742, 330, 875), "침하판", "성토 하부 설치", orange)

    # Optional automatic measurement enclosure; small and secondary.
    d.line((cx - 42, ground_y - 118, 420, 502, 342, 502), fill="#7b8794", width=4)
    d.rounded_rectangle((235, 448, 342, 538), radius=8, fill="#f8fbff", outline=navy, width=3)
    centered(d, (288, 480), "로거", 19, bold=True, fill=navy)
    centered(d, (288, 512), "함체", 17, fill=gray)
    text(d, (205, 555), "자동계측 시 보조 구성", 18, fill=gray)

    # Stable reference note panel.
    d.rounded_rectangle((95, 890, 1250, 934), radius=8, fill="#f8fbff", outline="#d9e2ec", width=2)
    text(d, (125, 900), "검수 기준: 지표침하핀·프리즘·천단침하와 혼동하지 않고, 침하판-연장봉-보호관-침하 방향만 표현", 20, fill=navy)

    # Right-side rule panels.
    label_box(d, (1345, 210, 1818, 355), "1. 설치 위치", "침하판은 성토 하부 지반에 둔다.", teal)
    label_box(d, (1345, 390, 1818, 535), "2. 측정 구성", "연장봉과 보호관을 수직으로 표시한다.", teal)
    label_box(d, (1345, 570, 1818, 715), "3. 방향 표시", "침하는 아래 방향 화살표로 표시한다.", teal)
    label_box(d, (1345, 750, 1818, 895), "4. 금지", "연장봉 상단을 기준점으로 쓰지 않는다.", orange)

    # Logo-safe empty area.
    d.rounded_rectangle((1510, 930, 1818, 1015), radius=8, outline="#d9e2ec", width=1)
    centered(d, (1664, 973), "공식 로고 합성 여백", 18, fill="#829ab1")

    output.parent.mkdir(parents=True, exist_ok=True)
    img.save(output, "WEBP", lossless=True, quality=100, method=6)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output",
        default=str(ROOT / "assets/images/technology/source/IMG-032_settlement-gauge-v4.webp"),
    )
    args = parser.parse_args()
    render(Path(args.output))
    print(args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
