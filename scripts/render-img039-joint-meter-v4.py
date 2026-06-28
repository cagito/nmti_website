#!/usr/bin/env python3
"""Render IMG-039 structure joint meter concept directly to WebP."""
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


def dimension(d: ImageDraw.ImageDraw, x0: int, x1: int, y: int, label: str) -> None:
    navy = "#082b4f"
    d.line((x0, y, x1, y), fill=navy, width=3)
    d.line((x0, y - 16, x0, y + 16), fill=navy, width=3)
    d.line((x1, y - 16, x1, y + 16), fill=navy, width=3)
    arrow(d, (x0 + 8, y), (x0 + 86, y), "#16817a", 4)
    arrow(d, (x1 - 8, y), (x1 - 86, y), "#16817a", 4)
    centered(d, ((x0 + x1) // 2, y - 34), label, 23, bold=True, fill="#16817a")


def graph(d: ImageDraw.ImageDraw, box: tuple[int, int, int, int]) -> None:
    x0, y0, x1, y1 = box
    navy, teal, grid = "#082b4f", "#16817a", "#d9e2ec"
    d.rounded_rectangle((x0, y0, x1, y1), radius=8, outline=navy, width=2)
    centered(d, ((x0 + x1) // 2, y0 + 34), "상대변위-시간", 22, bold=True)
    gx0, gy0, gx1, gy1 = x0 + 60, y0 + 82, x1 - 45, y1 - 50
    for i in range(5):
        y = gy0 + i * (gy1 - gy0) // 4
        d.line((gx0, y, gx1, y), fill=grid, width=1)
    d.line((gx0, gy0, gx0, gy1), fill=navy, width=2)
    d.line((gx0, gy1, gx1, gy1), fill=navy, width=2)
    pts = [(gx0 + 10, gy1 - 18), (gx0 + 95, gy1 - 42), (gx0 + 190, gy1 - 35), (gx0 + 290, gy0 + 62), (gx1 - 12, gy0 + 36)]
    d.line(pts, fill=teal, width=4)
    text(d, (gx0 - 42, gy0 - 10), "ΔL", 18, bold=True, fill=teal)
    text(d, (gx1 - 18, gy1 + 10), "t", 18, bold=True)
    text(d, (x0 + 50, y1 - 36), "ΔL = L1 - L0", 20, bold=True, fill=teal)


def render(output: Path) -> None:
    img = Image.new("RGB", (W, H), "#ffffff")
    d = ImageDraw.Draw(img)
    navy, teal, orange, gray = "#082b4f", "#16817a", "#d9822b", "#52606d"

    d.rectangle((16, 16, W - 16, H - 16), outline=navy, width=3)
    text(d, (55, 42), "구조물 신축계 설치 개념도", 48, bold=True, fill=navy)
    text(d, (58, 106), "두 고정점 사이 상대변위 ΔL을 한 축으로 측정하는 설치 개념", 22, fill="#334e68")

    # Main structure blocks and joint.
    d.rounded_rectangle((70, 210, 1240, 760), radius=8, outline=navy, width=2)
    d.rectangle((130, 470, 640, 620), fill="#d6dde3", outline=navy, width=3)
    d.rectangle((700, 470, 1165, 620), fill="#d6dde3", outline=navy, width=3)
    d.rectangle((640, 450, 700, 650), fill="#ffffff", outline=orange, width=3)
    centered(d, (670, 690), "조인트 / 이격부", 22, bold=True, fill=orange)
    text(d, (160, 632), "고정측 구조부재", 20, bold=True)
    text(d, (918, 632), "이동측 구조부재", 20, bold=True)

    # Brackets.
    d.rectangle((430, 365, 500, 470), fill="#eef6ff", outline=navy, width=3)
    d.rectangle((840, 365, 910, 470), fill="#eef6ff", outline=navy, width=3)
    centered(d, (465, 340), "고정측 브라켓", 19, bold=True)
    centered(d, (875, 340), "이동측 브라켓", 19, bold=True)
    for x in (452, 478, 862, 888):
        d.ellipse((x - 6, 418, x + 6, 430), fill=navy)

    # Joint meter body and measuring wire/rod.
    d.rounded_rectangle((505, 395, 645, 445), radius=12, fill="#fff8e6", outline=orange, width=3)
    centered(d, (575, 420), "신축계 본체", 19, bold=True, fill=orange)
    d.line((645, 420, 840, 420), fill=teal, width=6)
    d.ellipse((833, 413, 847, 427), fill=teal, outline=navy, width=1)
    centered(d, (742, 388), "측정축", 20, bold=True, fill=teal)
    arrow(d, (710, 315), (865, 315), teal, 5)
    centered(d, (790, 285), "ΔL 상대변위", 24, bold=True, fill=teal)
    dimension(d, 465, 875, 250, "기준길이 L0 → 현재길이 L1")

    # Cable and logger.
    d.line((575, 445, 575, 520, 1040, 520, 1040, 452), fill="#7b8794", width=4)
    d.rounded_rectangle((980, 342, 1140, 452), radius=10, fill="#f8fbff", outline=navy, width=3)
    centered(d, (1060, 380), "데이터로거", 21, bold=True)
    centered(d, (1060, 416), "함체", 18, fill=gray)
    text(d, (995, 468), "보조 배치", 17, fill=gray)

    # Inset panels: single purpose and bridge case separation.
    d.rounded_rectangle((95, 790, 610, 930), radius=8, outline=navy, width=2)
    centered(d, (352, 825), "적용 예시", 22, bold=True)
    text(d, (130, 860), "조인트·이격부 양측에 브라켓 고정", 20)
    text(d, (130, 895), "측정값: 한 축 상대변위 ΔL", 20, fill=teal, bold=True)

    d.rounded_rectangle((650, 790, 1240, 930), radius=8, outline=navy, width=2)
    centered(d, (945, 825), "구분", 22, bold=True)
    text(d, (690, 860), "신축계는 3축 변위계가 아니다.", 20, fill=navy)
    text(d, (690, 895), "교량 신축이음계 사례는 이음부 전용으로 분리한다.", 20, fill=orange)

    # Right panel.
    graph(d, (1290, 210, 1845, 570))
    d.rounded_rectangle((1290, 610, 1845, 930), radius=8, outline=navy, width=2)
    centered(d, (1568, 650), "검수 포인트", 24, bold=True)
    checks = [
        "측정 목적: 상대변위 ΔL 하나",
        "고정점-이동점과 측정축 표시",
        "수평·수직 전방위 동시 측정 금지",
        "균열계·LVDT 동일 범례 혼합 금지",
    ]
    y = 700
    for item in checks:
        d.ellipse((1328, y + 5, 1345, y + 22), fill=teal)
        text(d, (1360, y - 2), item, 19)
        y += 50

    d.rounded_rectangle((60, 956, 1845, 1032), radius=8, outline=navy, width=2)
    text(d, (90, 979), "각주", 22, bold=True, fill=navy)
    text(d, (185, 979), "설계·관리기준은 현장별 계측관리계획서에 따른다. 온도 영향은 보조 인자로 함께 검토한다.", 21)
    text(d, (1665, 1000), "NMTI", 24, bold=True, fill="#9fb3c8")

    output.parent.mkdir(parents=True, exist_ok=True)
    img.save(output, "WEBP", lossless=True, quality=100, method=6)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default=str(ROOT / "assets/images/technology/source/IMG-039_v4-joint-meter.webp"))
    args = parser.parse_args()
    render(Path(args.output))
    print(args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
