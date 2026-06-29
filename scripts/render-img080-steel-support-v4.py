#!/usr/bin/env python3
"""Render IMG-080 steel support stress monitoring concept directly to WebP."""
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
    d.polygon(
        [
            p1,
            (int(p1[0] - head * math.cos(ang - 0.45)), int(p1[1] - head * math.sin(ang - 0.45))),
            (int(p1[0] - head * math.cos(ang + 0.45)), int(p1[1] - head * math.sin(ang + 0.45))),
        ],
        fill=color,
    )


def sg(d: ImageDraw.ImageDraw, xy: tuple[int, int], label: str = "SG") -> None:
    x, y = xy
    d.rounded_rectangle((x - 24, y - 13, x + 24, y + 13), radius=3, fill="#2bb3aa", outline="#082b4f", width=2)
    centered(d, (x, y), label, 14, bold=True, fill="#082b4f")


def rule_panel(d: ImageDraw.ImageDraw, box: tuple[int, int, int, int], title: str, lines: list[str], accent: str = "#16817a") -> None:
    x0, y0, x1, y1 = box
    navy = "#082b4f"
    d.rounded_rectangle(box, radius=8, fill="#ffffff", outline=navy, width=2)
    d.rectangle((x0, y0, x1, y0 + 52), fill=navy)
    centered(d, ((x0 + x1) // 2, y0 + 27), title, 22, bold=True, fill="#ffffff")
    y = y0 + 74
    for line in lines:
        d.ellipse((x0 + 26, y + 5, x0 + 44, y + 23), fill=accent)
        text(d, (x0 + 58, y), line, 19, fill="#334e68")
        y += 40


def arch_points(cx: int, cy: int, rx: int, ry: int, start: int = 205, end: int = 335, step: int = 3) -> list[tuple[int, int]]:
    pts: list[tuple[int, int]] = []
    for deg in range(start, end + 1, step):
        rad = math.radians(deg)
        pts.append((int(cx + rx * math.cos(rad)), int(cy + ry * math.sin(rad))))
    return pts


def render(output: Path) -> None:
    img = Image.new("RGB", (W, H), "#ffffff")
    d = ImageDraw.Draw(img)
    navy, teal, orange, rock, shot = "#082b4f", "#16817a", "#d9822b", "#e7edf3", "#ccd6df"

    d.rectangle((16, 16, W - 16, H - 16), outline=navy, width=3)
    text(d, (55, 42), "강지보 응력 계측 개념도", 48, bold=True, fill=navy)
    text(d, (58, 106), "스틸 세트 H형강의 천단·어깨·측벽 다점 변형률계 배치", 22, fill="#334e68")

    # Main tunnel frame.
    d.rounded_rectangle((60, 168, 1238, 1000), radius=8, outline=navy, width=2)
    cx, cy, rx, ry = 640, 765, 430, 520
    outer = arch_points(cx, cy, rx + 88, ry + 70)
    middle = arch_points(cx, cy, rx + 43, ry + 35)
    inner = arch_points(cx, cy, rx, ry)
    d.line(outer, fill="#a7b3bf", width=48, joint="curve")
    d.line(middle, fill=rock, width=54, joint="curve")
    d.line(inner, fill=shot, width=42, joint="curve")
    d.line(inner, fill=navy, width=4, joint="curve")
    d.line((cx - rx, cy, cx + rx, cy), fill=navy, width=4)
    d.rectangle((cx - rx + 20, cy - 24, cx + rx - 20, cy + 24), fill="#eef2f6", outline=navy, width=3)
    centered(d, (cx, cy + 62), "굴착면", 22, bold=True, fill="#52606d")
    text(d, (170, 880), "암반", 20, bold=True, fill="#52606d")
    text(d, (235, 825), "숏크리트", 20, bold=True, fill="#52606d")

    # Steel set rib and waist member.
    rib = arch_points(cx, cy, rx - 70, ry - 78)
    d.line(rib, fill=navy, width=26, joint="curve")
    d.line(rib, fill="#0f3a63", width=14, joint="curve")
    d.rectangle((cx - 315, cy - 165, cx + 315, cy - 128), fill="#405160", outline=navy, width=3)
    centered(d, (cx, cy - 197), "허리보", 22, bold=True, fill=navy)
    centered(d, (cx - 285, 255), "H형 강지보 리브", 23, bold=True, fill=navy)

    # Multi-point strain gauges: crown, shoulders, sidewalls, waist member.
    points = [
        (cx, 313, "천단"),
        (cx - 245, 398, "좌 어깨"),
        (cx + 245, 398, "우 어깨"),
        (cx - 333, 595, "좌 측벽"),
        (cx + 333, 595, "우 측벽"),
        (cx - 150, cy - 146, "허리보"),
        (cx + 150, cy - 146, "허리보"),
    ]
    for x, y, lab in points:
        sg(d, (x, y))
        centered(d, (x, y + 34), lab, 16, fill="#334e68")

    # Compression / bending arrows.
    arrow(d, (cx - 395, 410), (cx - 315, 455), teal, 5)
    arrow(d, (cx + 395, 410), (cx + 315, 455), teal, 5)
    arrow(d, (cx, 250), (cx, 298), teal, 5)
    centered(d, (cx, 205), "압축 N · 휨 M", 24, bold=True, fill=teal)

    # H-beam inset.
    ix, iy = 805, 625
    d.rounded_rectangle((ix, iy, ix + 360, iy + 292), radius=8, fill="#ffffff", outline=navy, width=2)
    d.rectangle((ix, iy, ix + 360, iy + 48), fill=navy)
    centered(d, (ix + 180, iy + 25), "H형강 확대", 21, bold=True, fill="#ffffff")
    bx, by = ix + 180, iy + 165
    d.rectangle((bx - 110, by - 78, bx + 110, by - 46), fill="#405160", outline=navy, width=2)
    d.rectangle((bx - 23, by - 78, bx + 23, by + 78), fill="#405160", outline=navy, width=2)
    d.rectangle((bx - 110, by + 46, bx + 110, by + 78), fill="#405160", outline=navy, width=2)
    sg(d, (bx - 78, by - 62))
    sg(d, (bx + 78, by - 62))
    sg(d, (bx - 78, by + 62))
    sg(d, (bx + 78, by + 62))
    sg(d, (bx, by))
    text(d, (ix + 48, iy + 252), "플랜지 내·외측 + 웹", 19, bold=True, fill=teal)

    # Right-side rule panels.
    rule_panel(d, (1305, 205, 1825, 360), "1. 계측 위치", ["천단·어깨·측벽을 구분", "현장 조건에 따라 위치 조정"])
    rule_panel(d, (1305, 395, 1825, 550), "2. 센서 배치", ["플랜지 내측·외측 대칭", "웹 변형률계는 보조"])
    rule_panel(d, (1305, 585, 1825, 740), "3. 해석 항목", ["축력 N과 휨 M 분리", "단일 SG로 전체 응력 대표 금지"], orange)
    rule_panel(d, (1305, 775, 1825, 930), "4. 구분", ["록볼트 축력·숏크리트 응력 제외", "강지보 응력 목적만 표시"], teal)

    # Footer note and logo-safe area.
    d.rounded_rectangle((95, 940, 1205, 982), radius=8, fill="#f8fbff", outline="#d9e2ec", width=2)
    text(d, (125, 949), "검수 기준: 플랜지 1점 SG를 전체 강지보 응력으로 일반화하지 않고, 다점 계측으로 축력·휨을 분리", 19, fill=navy)
    d.rounded_rectangle((1535, 956, 1825, 1022), radius=8, outline="#d9e2ec", width=1)
    centered(d, (1680, 989), "공식 로고 합성 여백", 17, fill="#829ab1")

    output.parent.mkdir(parents=True, exist_ok=True)
    img.save(output, "WEBP", lossless=True, quality=100, method=6)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output",
        default=str(ROOT / "assets/images/technology/source/IMG-080_steel-support-v4.webp"),
    )
    args = parser.parse_args()
    render(Path(args.output))
    print(args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
