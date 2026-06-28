#!/usr/bin/env python3
"""Render IMG-043 GNSS displacement monitoring concept directly to WebP."""
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
    pts = [
        p1,
        (int(p1[0] - head * math.cos(ang - 0.45)), int(p1[1] - head * math.sin(ang - 0.45))),
        (int(p1[0] - head * math.cos(ang + 0.45)), int(p1[1] - head * math.sin(ang + 0.45))),
    ]
    d.polygon(pts, fill=color)


def dashed_arc(d: ImageDraw.ImageDraw, box: tuple[int, int, int, int], start: int, end: int, color: str, width: int = 4) -> None:
    for a in range(start, end, 12):
        d.arc(box, a, min(a + 6, end), fill=color, width=width)


def antenna(d: ImageDraw.ImageDraw, x: int, y: int, *, label: str, fill: str) -> None:
    navy = "#082b4f"
    d.line((x, y + 18, x, y + 90), fill=navy, width=5)
    d.rounded_rectangle((x - 56, y - 12, x + 56, y + 20), radius=14, fill="#ffffff", outline=navy, width=3)
    d.ellipse((x - 22, y - 38, x + 22, y + 6), fill=fill, outline=navy, width=3)
    d.rounded_rectangle((x - 44, y + 90, x + 44, y + 142), radius=8, fill="#f8fbff", outline=navy, width=3)
    centered(d, (x, y + 118), "수신기", 17, bold=True)
    centered(d, (x, y + 174), label, 21, bold=True, fill=navy)


def solar_panel(d: ImageDraw.ImageDraw, x: int, y: int) -> None:
    navy = "#082b4f"
    d.polygon([(x, y), (x + 94, y - 20), (x + 118, y + 36), (x + 24, y + 58)], fill="#d9f0ff", outline=navy)
    d.line((x + 59, y + 45, x + 48, y + 118), fill=navy, width=4)
    text(d, (x - 8, y + 124), "태양광·배터리", 16, bold=True)


def satellite(d: ImageDraw.ImageDraw, cx: int, cy: int, label: str) -> None:
    navy = "#082b4f"
    d.rounded_rectangle((cx - 24, cy - 16, cx + 24, cy + 16), radius=5, fill="#eef6ff", outline=navy, width=2)
    d.rectangle((cx - 74, cy - 12, cx - 31, cy + 12), fill="#cfe8ff", outline=navy, width=2)
    d.rectangle((cx + 31, cy - 12, cx + 74, cy + 12), fill="#cfe8ff", outline=navy, width=2)
    centered(d, (cx, cy + 43), label, 15, fill="#334e68")


def displacement_triad(d: ImageDraw.ImageDraw, origin: tuple[int, int]) -> None:
    x, y = origin
    navy, teal, orange = "#082b4f", "#16817a", "#d9822b"
    arrow(d, (x, y), (x + 72, y), navy, 4)
    text(d, (x + 82, y - 17), "ΔX", 17, bold=True, fill=navy)
    arrow(d, (x, y), (x, y - 74), teal, 4)
    text(d, (x - 12, y - 108), "ΔZ", 17, bold=True, fill=teal)
    arrow(d, (x, y), (x - 55, y + 45), orange, 4)
    text(d, (x - 94, y + 42), "ΔY", 17, bold=True, fill=orange)


def render(output: Path) -> None:
    img = Image.new("RGB", (W, H), "#ffffff")
    d = ImageDraw.Draw(img)
    navy, teal, orange, gray = "#082b4f", "#16817a", "#d9822b", "#596a7a"

    d.rectangle((16, 16, W - 16, H - 16), outline=navy, width=3)
    text(d, (55, 42), "GNSS 변위 계측 개념도", 48, bold=True, fill=navy)
    text(d, (58, 106), "기준국·이동국·RTK/차분·무선 통신·중앙 서버를 분리한 자동 계측 구성", 22, fill="#334e68")

    satellite(d, 318, 176, "GPS")
    satellite(d, 560, 146, "GLONASS")
    satellite(d, 820, 182, "BeiDou")
    centered(d, (570, 236), "위성 신호 도식", 18, bold=True, fill=gray)

    d.line((70, 795, 520, 795, 655, 640, 850, 566, 1120, 725, 1240, 725), fill="#6b4f2a", width=6)
    d.polygon([(70, 795), (520, 795), (655, 640), (850, 566), (1120, 725), (1240, 725), (1240, 975), (70, 975)], fill="#ead6b8", outline="#6b4f2a")
    d.line((70, 795, 520, 795), fill="#2f855a", width=6)
    d.line((655, 640, 850, 566, 1120, 725), fill="#2f855a", width=6)
    text(d, (95, 812), "안정 지반·암반", 22, bold=True, fill=navy)
    d.rounded_rectangle((775, 650, 1015, 694), radius=8, fill="#fffaf0", outline="#6b4f2a", width=2)
    centered(d, (895, 673), "계측 대상 사면", 21, bold=True, fill=navy)
    d.rounded_rectangle((82, 842, 438, 902), radius=8, fill="#fff8e6", outline=orange, width=2)
    centered(d, (260, 872), "변형 영향권 밖", 20, bold=True, fill=orange)
    d.line((520, 800, 625, 645), fill="#a61b1b", width=3)
    text(d, (526, 812), "영향권 경계", 18, bold=True, fill="#a61b1b")

    antenna(d, 300, 535, label="기준국", fill="#9fb3c8")
    antenna(d, 748, 455, label="이동국 #1", fill=teal)
    antenna(d, 1005, 606, label="이동국 #2", fill=teal)
    solar_panel(d, 1130, 702)

    dashed_arc(d, (210, 250, 570, 650), 205, 330, "#b8d7f2", 3)
    dashed_arc(d, (610, 245, 990, 640), 210, 330, "#b8d7f2", 3)
    dashed_arc(d, (775, 312, 1190, 760), 205, 325, "#b8d7f2", 3)
    dashed_arc(d, (255, 330, 835, 690), 200, 345, orange, 5)
    dashed_arc(d, (274, 388, 1075, 794), 198, 346, orange, 5)
    centered(d, (603, 384), "RTK·차분 보정", 21, bold=True, fill=orange)

    displacement_triad(d, (820, 490))
    centered(d, (848, 410), "3D 변위", 20, bold=True, fill=navy)
    displacement_triad(d, (1075, 638))
    centered(d, (1104, 558), "3D 변위", 20, bold=True, fill=navy)

    px = 1285
    d.rounded_rectangle((px, 172, 1846, 922), radius=8, outline=navy, width=2)
    d.rectangle((px, 172, 1846, 236), fill=navy)
    centered(d, (px + 280, 206), "데이터·통신 흐름", 27, bold=True, fill="#ffffff")
    d.rounded_rectangle((px + 58, 285, px + 508, 388), radius=10, fill="#f8fbff", outline=navy, width=3)
    centered(d, (px + 283, 318), "현장 GNSS 수신기", 23, bold=True, fill=navy)
    centered(d, (px + 283, 357), "기준국 + 이동국 #1·#2", 19, fill="#334e68")
    d.rounded_rectangle((px + 96, 505, px + 470, 616), radius=10, fill="#e6fffa", outline=teal, width=3)
    centered(d, (px + 283, 540), "무선 통신", 24, bold=True, fill=teal)
    centered(d, (px + 283, 580), "LTE · 무선망", 20, fill="#334e68")
    d.rounded_rectangle((px + 80, 735, px + 486, 852), radius=10, fill="#fff8e6", outline=orange, width=3)
    centered(d, (px + 283, 770), "중앙 서버", 25, bold=True, fill=orange)
    centered(d, (px + 283, 812), "데이터 수집·분석·경보", 20, fill="#334e68")
    arrow(d, (px + 283, 390), (px + 283, 505), teal, 5)
    arrow(d, (px + 283, 616), (px + 283, 735), teal, 5)
    centered(d, (px + 410, 452), "변위 데이터", 18, bold=True, fill=teal)
    centered(d, (px + 413, 678), "실시간 전송", 18, bold=True, fill=teal)
    arrow(d, (1148, 505), (1285, 442), teal, 5)
    arrow(d, (1180, 725), (1285, 588), teal, 5)
    text(d, (1115, 468), "무선 통신", 18, bold=True, fill=teal)

    d.rounded_rectangle((60, 946, 1846, 1032), radius=8, outline=navy, width=2)
    text(d, (90, 970), "검수 기준", 22, bold=True, fill=navy)
    text(d, (230, 970), "기준국은 안정 지반, 이동국은 계측 대상 2점 이상. 광학식 측량 요소와 제조사 표기는 사용하지 않는다.", 21)
    text(d, (1665, 998), "NMTI", 24, bold=True, fill="#9fb3c8")

    output.parent.mkdir(parents=True, exist_ok=True)
    img.save(output, "WEBP", lossless=True, quality=100, method=6)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default=str(ROOT / "assets/images/technology/source/IMG-043_v4-gnss.webp"))
    args = parser.parse_args()
    render(Path(args.output))
    print(args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
