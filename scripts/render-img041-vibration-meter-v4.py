#!/usr/bin/env python3
"""Render IMG-041 vibration meter installation concept directly to WebP."""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
W, H = 1920, 1080


def f(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf" if bold else "C:/Windows/Fonts/malgun.ttf", size)


def txt(d: ImageDraw.ImageDraw, xy: tuple[int, int], s: str, size: int, *, bold: bool = False, fill: str = "#102a43") -> None:
    d.text(xy, s, font=f(size, bold), fill=fill)


def ctr(d: ImageDraw.ImageDraw, xy: tuple[int, int], s: str, size: int, *, bold: bool = False, fill: str = "#102a43") -> None:
    ft = f(size, bold)
    box = d.textbbox((0, 0), s, font=ft)
    d.text((xy[0] - (box[2] - box[0]) / 2, xy[1] - (box[3] - box[1]) / 2), s, font=ft, fill=fill)


def waveform(d: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    x0, y0, x1, y1 = box
    mid = (y0 + y1) // 2
    pts = []
    for i, x in enumerate(range(x0, x1, 10)):
        amp = 24 if i % 2 else 10
        y = mid + (amp if i % 4 in (1, 2) else -amp)
        pts.append((x, y))
    d.line(pts, fill=color, width=3)
    d.line((x0, mid, x1, mid), fill="#d9e2ec", width=1)


def triad(d: ImageDraw.ImageDraw, origin: tuple[int, int]) -> None:
    x, y = origin
    navy, teal, orange = "#082b4f", "#16817a", "#d9822b"
    d.line((x, y, x + 70, y), fill=navy, width=4)
    d.polygon([(x + 70, y), (x + 55, y - 8), (x + 55, y + 8)], fill=navy)
    txt(d, (x + 78, y - 13), "X", 18, bold=True, fill=navy)
    d.line((x, y, x, y - 70), fill=teal, width=4)
    d.polygon([(x, y - 70), (x - 8, y - 55), (x + 8, y - 55)], fill=teal)
    txt(d, (x - 8, y - 102), "Z", 18, bold=True, fill=teal)
    d.line((x, y, x - 48, y + 48), fill=orange, width=4)
    d.polygon([(x - 48, y + 48), (x - 28, y + 43), (x - 43, y + 28)], fill=orange)
    txt(d, (x - 77, y + 47), "Y", 18, bold=True, fill=orange)


def sensor(d: ImageDraw.ImageDraw, cx: int, cy: int, label: str) -> None:
    d.rounded_rectangle((cx - 42, cy - 28, cx + 42, cy + 28), radius=8, fill="#e9f6ff", outline="#082b4f", width=3)
    d.ellipse((cx - 12, cy - 12, cx + 12, cy + 12), fill="#16817a", outline="#082b4f", width=2)
    ctr(d, (cx, cy + 54), label, 18, bold=True)


def render(output: Path) -> None:
    img = Image.new("RGB", (W, H), "#ffffff")
    d = ImageDraw.Draw(img)
    navy, teal, orange, gray = "#082b4f", "#16817a", "#d9822b", "#596a7a"
    d.rectangle((16, 16, W - 16, H - 16), outline=navy, width=3)
    txt(d, (55, 42), "진동계 설치 개념도", 48, bold=True, fill=navy)
    txt(d, (58, 106), "구조물 고정형과 지반 매설형을 분리하고, 3축 방향과 단위를 명확히 표시", 22, fill="#334e68")

    # Structure installation.
    d.rounded_rectangle((60, 170, 870, 610), radius=8, outline=navy, width=2)
    ctr(d, (465, 212), "구조물 진동계", 28, bold=True)
    d.rectangle((130, 420, 790, 500), fill="#d6dde3", outline=navy, width=3)
    d.rectangle((170, 500, 235, 575), fill="#b8c2cc", outline=navy, width=2)
    d.rectangle((685, 500, 750, 575), fill="#b8c2cc", outline=navy, width=2)
    sensor(d, 360, 390, "볼트 고정")
    d.line((360, 418, 360, 420), fill=navy, width=5)
    triad(d, (500, 382))
    txt(d, (585, 338), "측정축 X/Y/Z", 20, bold=True, fill=navy)
    txt(d, (150, 535), "콘크리트 슬래브·보·기초", 20, fill="#334e68")

    # Ground installation.
    d.rounded_rectangle((60, 640, 870, 920), radius=8, outline=navy, width=2)
    ctr(d, (465, 682), "지반 진동계", 28, bold=True)
    d.rectangle((130, 780, 790, 890), fill="#ead6b8", outline="#6b4f2a", width=2)
    d.line((130, 780, 790, 780), fill="#6b4f2a", width=3)
    sensor(d, 360, 760, "지표 고정")
    d.line((360, 788, 360, 820), fill=navy, width=5)
    d.rounded_rectangle((610, 730, 710, 800), radius=12, fill="#f8fbff", outline=navy, width=3)
    txt(d, (575, 812), "보호함·케이블", 18, bold=True)
    triad(d, (505, 760))

    # Unit separation panel.
    px = 930
    d.rounded_rectangle((px, 170, 1845, 555), radius=8, outline=navy, width=2)
    d.rectangle((px, 170, 1845, 230), fill=navy)
    ctr(d, (px + 457, 204), "단위·항목 분리", 26, bold=True, fill="#ffffff")
    items = [
        ("가속도계", "m/s² · gal · g"),
        ("진동속도 / PPV", "mm/s"),
        ("그래프 축", "가속도 또는 PPV 중 하나만"),
        ("설치 조건", "고정면·측정축·케이블 보호"),
    ]
    y = 270
    for head, body in items:
        d.ellipse((px + 35, y + 4, px + 53, y + 22), fill=teal)
        txt(d, (px + 70, y - 4), head, 22, bold=True)
        txt(d, (px + 260, y - 1), body, 21, fill="#334e68")
        y += 62

    # Waveform insets, separated.
    d.rounded_rectangle((px, 590, 1375, 920), radius=8, outline=navy, width=2)
    ctr(d, (1152, 628), "가속도 예시", 24, bold=True)
    txt(d, (985, 670), "단위: m/s²", 20, bold=True, fill=teal)
    waveform(d, (990, 735, 1328, 845), teal)
    d.rounded_rectangle((1400, 590, 1845, 920), radius=8, outline=navy, width=2)
    ctr(d, (1622, 628), "PPV 예시", 24, bold=True)
    txt(d, (1455, 670), "단위: mm/s", 20, bold=True, fill=orange)
    waveform(d, (1460, 735, 1798, 845), orange)

    d.rounded_rectangle((60, 945, 1845, 1032), radius=8, outline=navy, width=2)
    txt(d, (90, 968), "비고", 23, bold=True, fill=navy)
    txt(d, (90, 1000), "- 가속도 단위에 mm/s를 쓰지 않는다. PPV·진동속도는 별도 항목과 별도 축으로 표기한다.", 21)

    output.parent.mkdir(parents=True, exist_ok=True)
    img.save(output, "WEBP", lossless=True, quality=100, method=6)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default=str(ROOT / "assets/images/technology/source/IMG-041_v4-vibration-meter.webp"))
    args = parser.parse_args()
    render(Path(args.output))
    print(args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
