#!/usr/bin/env python3
"""Render IMG-096 surrounding ground instrumentation section to WebP."""
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


def dashed_line(d: ImageDraw.ImageDraw, p0: tuple[int, int], p1: tuple[int, int], color: str, width: int = 3, dash: int = 18) -> None:
    x0, y0 = p0
    x1, y1 = p1
    length = math.hypot(x1 - x0, y1 - y0)
    if length <= 0:
        return
    ux, uy = (x1 - x0) / length, (y1 - y0) / length
    pos = 0
    while pos < length:
        end = min(pos + dash, length)
        d.line((x0 + ux * pos, y0 + uy * pos, x0 + ux * end, y0 + uy * end), fill=color, width=width)
        pos += dash * 1.8


def borehole_cap(d: ImageDraw.ImageDraw, x: int, gl: int, label: str, color: str) -> None:
    navy = "#082b4f"
    d.rounded_rectangle((x - 32, gl - 24, x + 32, gl + 8), radius=8, fill="#ffffff", outline=navy, width=2)
    d.ellipse((x - 18, gl - 36, x + 18, gl), fill=color, outline=navy, width=2)
    centered(d, (x, gl - 62), label, 17, bold=True, fill=navy)


def ipi(d: ImageDraw.ImageDraw, x: int, gl: int, bottom: int) -> None:
    navy, teal = "#082b4f", "#16817a"
    borehole_cap(d, x, gl, "지중경사계", teal)
    d.line((x, gl + 8, x, bottom), fill=navy, width=7)
    for y in range(gl + 86, bottom - 30, 95):
        d.ellipse((x - 13, y - 13, x + 13, y + 13), fill=teal, outline=navy, width=2)
    arrow(d, (x + 34, gl + 200), (x + 130, gl + 200), teal, 5)
    text(d, (x + 142, gl + 184), "굴착측 방향 수평변위", 18, bold=True, fill=teal)
    text(d, (x - 58, bottom + 10), "안정층 근입", 17, bold=True, fill=teal)


def piezometer(d: ImageDraw.ImageDraw, x: int, gl: int, bottom: int) -> None:
    navy, orange = "#082b4f", "#d9822b"
    d.line((x, gl + 16, x, bottom), fill=navy, width=5)
    d.rounded_rectangle((x - 22, bottom - 76, x + 22, bottom - 20), radius=8, fill="#fff8e6", outline=orange, width=3)
    d.rectangle((x - 28, bottom - 104, x + 28, bottom - 80), fill="#d6dde3", outline=navy, width=2)
    d.rectangle((x - 28, bottom - 16, x + 28, bottom + 8), fill="#d6dde3", outline=navy, width=2)
    centered(d, (x, bottom - 49), "P", 18, bold=True, fill=orange)
    text(d, (x + 35, bottom - 72), "간극수압계", 18, bold=True, fill=orange)
    text(d, (x + 35, bottom - 42), "특정 심도 센서", 16, fill="#334e68")


def groundwater_well(d: ImageDraw.ImageDraw, x: int, gl: int, bottom: int) -> None:
    navy, blue = "#082b4f", "#1c7ed6"
    borehole_cap(d, x, gl, "지하수위계", "#d9f0ff")
    d.line((x, gl + 8, x, bottom), fill=navy, width=7)
    d.line((x - 11, gl + 140, x - 11, bottom - 30), fill=blue, width=3)
    d.line((x + 11, gl + 140, x + 11, bottom - 30), fill=blue, width=3)
    for y in range(bottom - 160, bottom - 44, 22):
        d.line((x - 18, y, x + 18, y), fill=blue, width=2)
    text(d, (x + 35, gl + 140), "관측공·스크린", 17, bold=True, fill=blue)


def settlement_pin(d: ImageDraw.ImageDraw, x: int, gl: int, label: str) -> None:
    navy, teal = "#082b4f", "#16817a"
    d.line((x, gl - 48, x, gl + 10), fill=navy, width=4)
    d.polygon([(x - 20, gl - 48), (x + 20, gl - 48), (x, gl - 74)], fill=teal, outline=navy)
    centered(d, (x, gl - 100), label, 17, bold=True, fill=navy)


def render(output: Path) -> None:
    img = Image.new("RGB", (W, H), "#ffffff")
    d = ImageDraw.Draw(img)
    navy, teal, orange, blue, red, gray = "#082b4f", "#16817a", "#d9822b", "#1c7ed6", "#a61b1b", "#52606d"

    d.rectangle((16, 16, W - 16, H - 16), outline=navy, width=3)
    text(d, (55, 42), "가시설 주변지반 계측 설치 대표 단면도", 44, bold=True, fill=navy)
    text(d, (58, 104), "흙막이 굴착 배면 지반의 수평변위·지표침하·지하수위·간극수압 배치", 22, fill="#334e68")

    # Main section.
    d.rounded_rectangle((60, 160, 1260, 920), radius=8, outline=navy, width=2)
    gl = 300
    bottom = 845
    wall_x = 1010
    d.rectangle((95, gl, wall_x, bottom), fill="#ead6b8", outline="#6b4f2a", width=2)
    d.rectangle((wall_x, gl, wall_x + 74, bottom), fill="#c6d0d9", outline=navy, width=3)
    d.rectangle((wall_x + 74, gl + 180, 1225, bottom), fill="#ffffff", outline=navy, width=3)
    d.line((95, gl, wall_x + 74, gl), fill="#2f855a", width=6)
    text(d, (112, gl + 14), "배면 지반", 22, bold=True, fill=navy)
    centered(d, (wall_x + 37, gl - 30), "흙막이 벽체", 20, bold=True)
    centered(d, (1148, gl + 156), "굴착측", 22, bold=True, fill=navy)

    # H dimension.
    d.line((1115, gl, 1115, bottom), fill=red, width=4)
    d.line((1096, gl, 1134, gl), fill=red, width=4)
    d.line((1096, bottom, 1134, bottom), fill=red, width=4)
    centered(d, (1160, (gl + bottom) // 2), "H = 굴착깊이", 20, bold=True, fill=red)

    # Influence range.
    dashed_line(d, (wall_x - 260, gl - 20), (wall_x - 260, bottom), orange, 3)
    dashed_line(d, (wall_x - 520, gl - 20), (wall_x - 520, bottom), orange, 3)
    centered(d, (wall_x - 390, gl - 48), "1H~2H 계측 배치 검토 범위 예시", 18, bold=True, fill=orange)

    # Instruments.
    ipi(d, 400, gl, bottom - 35)
    piezometer(d, 610, gl, 650)
    groundwater_well(d, 790, gl, bottom - 65)
    for x, lab in [(185, "지표침하 측점"), (290, "지표침하 측점"), (525, "지표침하 측점")]:
        settlement_pin(d, x, gl, lab)
    d.line((140, 382, 920, 325), fill=blue, width=3)
    text(d, (825, 302), "G.W.L", 18, bold=True, fill=blue)
    d.rectangle((95, bottom - 35, wall_x, bottom), fill="#c9b18a", outline="#6b4f2a", width=2)
    text(d, (120, bottom - 28), "하부 안정층", 18, bold=True, fill="#6b4f2a")

    # Optional building, clearly secondary.
    d.rectangle((115, 200, 220, gl), fill="#d6dde3", outline=navy, width=2)
    d.rectangle((135, 248, 164, 275), fill="#ffffff", outline=navy, width=1)
    text(d, (95, 170), "인접 구조물(선택)", 17, fill=gray)

    d.rounded_rectangle((92, 862, 1232, 905), radius=8, fill="#fffaf0", outline=orange, width=2)
    centered(d, (662, 883), "옹벽·Sand Mat·침하판·잠재 슬립면 없이, 흙막이 굴착 배면 계측만 표현", 20, bold=True, fill=orange)

    # Right panels.
    d.rounded_rectangle((1290, 160, 1845, 515), radius=8, outline=navy, width=2)
    d.rectangle((1290, 160, 1845, 222), fill=navy)
    centered(d, (1568, 192), "필수 4종 구분", 25, bold=True, fill="#ffffff")
    items = [
        ("① 지중경사계", "GL 천공·수평변위"),
        ("② 지표침하 측점", "침하핀·측량 대상"),
        ("③ 간극수압계", "특정 심도 센서"),
        ("④ 지하수위계", "관측공·G.W.L"),
    ]
    y = 252
    for head, body in items:
        d.ellipse((1328, y + 5, 1346, y + 23), fill=teal)
        text(d, (1362, y - 2), head, 20, bold=True, fill=navy)
        text(d, (1540, y), body, 19, fill="#334e68")
        y += 58

    d.rounded_rectangle((1290, 550, 1845, 920), radius=8, outline=navy, width=2)
    centered(d, (1568, 590), "금지 대조", 24, bold=True)
    checks = [
        "지표침하계 라벨 금지",
        "벽체/CIP 내부 매설 금지",
        "간극수압계 ≠ 관측공",
        "H = 굴착깊이 명시",
        "성토부·사면 주제 혼입 금지",
    ]
    y = 640
    for item in checks:
        d.ellipse((1328, y + 5, 1346, y + 23), fill=orange)
        text(d, (1362, y - 2), item, 20, fill="#334e68")
        y += 52

    d.rounded_rectangle((60, 956, 1845, 1032), radius=8, outline=navy, width=2)
    text(d, (90, 979), "검수 기준", 22, bold=True, fill=navy)
    text(d, (225, 979), "주변지반 = 흙막이 굴착 배면. 지중경사계·지하수위는 GL 천공, 지표침하는 측점/핀으로 표기한다.", 21)
    text(d, (1665, 1000), "NMTI", 24, bold=True, fill="#9fb3c8")

    output.parent.mkdir(parents=True, exist_ok=True)
    img.save(output, "WEBP", lossless=True, quality=100, method=6)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default=str(ROOT / "assets/images/technology/source/IMG-096_v4-surrounding-ground.webp"))
    args = parser.parse_args()
    render(Path(args.output))
    print(args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
