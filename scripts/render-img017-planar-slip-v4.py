#!/usr/bin/env python3
"""Render IMG-017 planar slip surface interpretation concept to WebP."""
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
    pos = 0
    while pos < length:
        end = min(pos + dash, length)
        d.line((x0 + ux * pos, y0 + uy * pos, x0 + ux * end, y0 + uy * end), fill=color, width=width)
        pos += dash * 1.8


def ipi(d: ImageDraw.ImageDraw, x: int, top: int, bottom: int, label: str) -> None:
    navy, teal = "#082b4f", "#16817a"
    d.line((x, top, x, bottom), fill=navy, width=8)
    d.ellipse((x - 18, top - 18, x + 18, top + 18), fill="#f8fbff", outline=navy, width=3)
    for y in range(top + 80, bottom - 20, 95):
        d.ellipse((x - 14, y - 14, x + 14, y + 14), fill=teal, outline=navy, width=2)
    centered(d, (x, top - 48), "지중경사계", 17, bold=True)
    centered(d, (x, bottom + 34), label, 17, bold=True, fill=teal)


def graph_profile(d: ImageDraw.ImageDraw, box: tuple[int, int, int, int]) -> None:
    x0, y0, x1, y1 = box
    navy, teal, orange, grid = "#082b4f", "#16817a", "#d9822b", "#d9e2ec"
    d.rounded_rectangle((x0, y0, x1, y1), radius=8, outline=navy, width=2)
    centered(d, ((x0 + x1) // 2, y0 + 32), "IPI 변위 프로파일", 22, bold=True)
    gx0, gy0, gx1, gy1 = x0 + 70, y0 + 78, x1 - 52, y1 - 50
    for i in range(5):
        y = gy0 + i * (gy1 - gy0) // 4
        d.line((gx0, y, gx1, y), fill=grid, width=1)
    d.line((gx0, gy0, gx0, gy1), fill=navy, width=2)
    d.line((gx0, gy1, gx1, gy1), fill=navy, width=2)
    pts = [(gx0 + 8, gy0 + 16), (gx0 + 38, gy0 + 82), (gx0 + 82, gy0 + 150), (gx0 + 155, gy0 + 202), (gx0 + 235, gy1 - 48), (gx1 - 18, gy1 - 18)]
    d.line(pts, fill=teal, width=4)
    dashed_line(d, (gx0 + 120, gy0 + 172), (gx1 - 20, gy0 + 172), orange, 3)
    text(d, (gx0 + 145, gy0 + 146), "전단변형 집중 구간", 17, bold=True, fill=orange)
    text(d, (gx0 - 38, gy0 - 6), "깊이", 17, bold=True)
    text(d, (gx1 - 78, gy1 + 10), "변위", 17, bold=True)


def graph_time(d: ImageDraw.ImageDraw, box: tuple[int, int, int, int]) -> None:
    x0, y0, x1, y1 = box
    navy, teal, grid = "#082b4f", "#16817a", "#d9e2ec"
    d.rounded_rectangle((x0, y0, x1, y1), radius=8, outline=navy, width=2)
    centered(d, ((x0 + x1) // 2, y0 + 32), "변위-시간", 22, bold=True)
    gx0, gy0, gx1, gy1 = x0 + 64, y0 + 78, x1 - 48, y1 - 52
    for i in range(4):
        y = gy0 + i * (gy1 - gy0) // 3
        d.line((gx0, y, gx1, y), fill=grid, width=1)
    d.line((gx0, gy0, gx0, gy1), fill=navy, width=2)
    d.line((gx0, gy1, gx1, gy1), fill=navy, width=2)
    pts = [(gx0 + 8, gy1 - 24), (gx0 + 105, gy1 - 40), (gx0 + 202, gy1 - 82), (gx1 - 10, gy0 + 50)]
    d.line(pts, fill=teal, width=4)
    centered(d, ((x0 + x1) // 2, y1 - 24), "현장별 관리기준 적용", 18, bold=True, fill=teal)


def render(output: Path) -> None:
    img = Image.new("RGB", (W, H), "#ffffff")
    d = ImageDraw.Draw(img)
    navy, teal, orange, red, gray = "#082b4f", "#16817a", "#d9822b", "#a61b1b", "#52606d"

    d.rectangle((16, 16, W - 16, H - 16), outline=navy, width=3)
    text(d, (55, 42), "평면활동면 계측 해석도", 48, bold=True, fill=navy)
    text(d, (58, 106), "무한사면식과 IPI 프로파일은 병행 검토 자료이며, 활동면 확정식이 아니다", 22, fill="#334e68")

    # Slope cross-section.
    d.rounded_rectangle((60, 170, 1218, 820), radius=8, outline=navy, width=2)
    d.polygon([(90, 760), (340, 760), (520, 545), (865, 315), (1190, 315), (1190, 960), (90, 960)], fill="#ead6b8", outline="#6b4f2a")
    d.line((90, 760, 340, 760, 520, 545, 865, 315, 1190, 315), fill="#2f855a", width=6)
    text(d, (98, 772), "지표면", 20, bold=True, fill=navy)
    text(d, (905, 333), "암반 사면", 22, bold=True, fill=navy)

    # Geological discontinuities.
    for offset in (0, 75, 150):
        dashed_line(d, (245 + offset, 720), (760 + offset, 392), "#8d6e63", 3, 20)
    dashed_line(d, (462, 680), (890, 355), red, 4, 22)
    text(d, (760, 392), "단층", 18, bold=True, fill=red)
    text(d, (520, 458), "절리·층리", 18, bold=True, fill="#6b4f2a")

    # Potential planar slip surface.
    dashed_line(d, (315, 720), (1015, 376), orange, 6, 26)
    text(d, (620, 615), "추정 평면활동면", 24, bold=True, fill=orange)
    arrow(d, (790, 455), (915, 500), teal, 5)
    text(d, (925, 492), "하강 방향 변위", 20, bold=True, fill=teal)

    # Instruments.
    ipi(d, 310, 330, 780, "후방부(안정)")
    ipi(d, 610, 265, 808, "교차부(추정)")
    ipi(d, 975, 245, 800, "안정영역")
    d.line((215, 645, 1080, 545), fill="#75b5d6", width=4)
    text(d, (220, 610), "G.W.L", 19, bold=True, fill="#1c7ed6")
    d.ellipse((705, 510, 742, 548), fill="#e6fffa", outline=navy, width=2)
    text(d, (750, 512), "간극수압 U", 19, bold=True, fill=teal)
    text(d, (750, 545), "지하수 조건·배수와 병행", 17, fill=gray)
    d.rounded_rectangle((980, 410, 1080, 465), radius=8, fill="#f8fbff", outline=navy, width=2)
    centered(d, (1030, 438), "프리즘", 18, bold=True)

    # Interpretation callout.
    d.rounded_rectangle((100, 842, 1218, 932), radius=8, outline=navy, width=2)
    text(d, (130, 866), "병행 검토", 22, bold=True, fill=navy)
    text(d, (270, 866), "절리·층리·단층, G.W.L, 간극수압 U, 지표 균열·침하, 현장관찰을 함께 해석", 21)
    text(d, (270, 900), "단일 IPI 최대변위만으로 활동면을 확정하지 않는다.", 21, bold=True, fill=red)

    # Right panels.
    d.rounded_rectangle((1260, 170, 1845, 405), radius=8, outline=navy, width=2)
    d.rectangle((1260, 170, 1845, 228), fill=navy)
    centered(d, (1552, 199), "안정성 검토식", 26, bold=True, fill="#ffffff")
    centered(d, (1552, 277), "무한사면식 · 평형 검토", 23, bold=True, fill=orange)
    centered(d, (1552, 326), "계측 산정식 아님", 24, bold=True, fill=red)
    text(d, (1304, 360), "해석식 ↔ 활동면 확정 직접 연결 금지", 19, fill=gray)

    graph_profile(d, (1260, 435, 1845, 688))
    graph_time(d, (1260, 720, 1845, 932))

    d.rounded_rectangle((60, 956, 1845, 1032), radius=8, outline=navy, width=2)
    text(d, (90, 979), "검수 기준", 22, bold=True, fill=navy)
    text(d, (225, 979), "활동면은 추정선으로 표시한다. 해석식, IPI 프로파일, 수문 조건은 독립 자료로 병행 검토한다.", 21)
    text(d, (1665, 1000), "NMTI", 24, bold=True, fill="#9fb3c8")

    output.parent.mkdir(parents=True, exist_ok=True)
    img.save(output, "WEBP", lossless=True, quality=100, method=6)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default=str(ROOT / "assets/images/technology/source/IMG-017_v4-planar-slip.webp"))
    args = parser.parse_args()
    render(Path(args.output))
    print(args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
