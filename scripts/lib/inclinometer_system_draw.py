"""Inclinometer system diagram (IMG-025) — AUTO-01 IPI + datalogger chain.

EXC-02 · AUTO-01 · INSTRUMENTATION §3.3.
"""
from __future__ import annotations

import math

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, draw_logger_block_icon, load_font

SOIL1 = "#E8D4B8"
SOIL2 = "#C4A574"
ROCK = "#9CA3AF"


def _dashed_line(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], *, fill: str, width: int = 2, dash: int = 8, gap: int = 6) -> None:
    """Draw a dashed polyline using Pillow primitive line segments."""
    for (x1, y1), (x2, y2) in zip(points, points[1:]):
        dx = x2 - x1
        dy = y2 - y1
        length = math.hypot(dx, dy)
        if length == 0:
            continue
        ux = dx / length
        uy = dy / length
        pos = 0.0
        while pos < length:
            end = min(pos + dash, length)
            sx = int(round(x1 + ux * pos))
            sy = int(round(y1 + uy * pos))
            ex = int(round(x1 + ux * end))
            ey = int(round(y1 + uy * end))
            draw.line([(sx, sy), (ex, ey)], fill=fill, width=width)
            pos += dash + gap


def render_img025(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "센서형 다단식 지중경사계 시스템 구성도", (W // 2, 48), font_title)
    draw_label(
        draw,
        "IPI · casing 4-groove · stable layer · automatic datalogger chain",
        (W // 2, 88),
        load_font(18),
        fill=C["gray"],
    )

    ground = 680
    rock_y = 820
    draw.rectangle([100, 360, 780, rock_y], fill=_hex(SOIL1))
    for yy in range(370, rock_y, 14):
        draw.line([(110, yy), (770, yy)], fill=_hex(SOIL2), width=1)
    draw.rectangle([100, rock_y, 780, 920], fill=_hex(ROCK))
    draw_label(draw, "매립·풍화토", (160, 420), load_font(14), fill=C["gray"])
    draw_label(draw, "안정층 (연암)", (160, rock_y + 30), load_font(14), fill=C["gray"])

    ix = 420
    top_y = 400
    base_y = rock_y + 20
    draw.rectangle([ix - 12, top_y, ix + 12, base_y], fill=_hex("#D1FAE5"), outline=_hex(C["teal"]), width=1)
    draw.rectangle([ix - 10, top_y + 8, ix + 10, base_y - 8], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    for sy in range(top_y + 40, base_y - 40, 48):
        draw.ellipse([ix - 6, sy - 6, ix + 6, sy + 6], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
        draw.line([(ix + 6, sy), (ix + 6, sy + 20)], fill=_hex(C["navy"]), width=1)
    draw.line([(ix, base_y - 8), (ix, base_y + 8)], fill=_hex(C["navy"]), width=3)
    draw_label(draw, "Base", (ix + 24, base_y - 4), load_font(13, bold=True))

    draw.rounded_rectangle([ix - 20, top_y - 32, ix + 20, top_y], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "well head", (ix, top_y - 44), load_font(12), fill=C["gray"])

    # Slip surface + horizontal displacement
    pts = [(280, 480), (520, 560), (680, 640)]
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i + 1]], fill=_hex(C["red"]), width=2)
    draw_label(draw, "활동면", (540, 520), load_font(14, bold=True), fill=C["red"])
    draw_arrow(draw, ix + 24, 560, ix + 100, 600, color=C["teal"], width=4)
    draw_label(draw, "수평변위 →", (ix + 108, 578), load_font(14, bold=True), fill=C["teal"])

    # Casing 4-groove inset
    cx, cy = 620, 260
    draw.rounded_rectangle([520, 180, 760, 360], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "케이싱 (4홈)", (640, 200), load_font(16, bold=True))
    draw.ellipse([cx - 40, cy - 40, cx + 40, cy + 40], outline=_hex(C["navy"]), width=2)
    for ang in (0, 90, 180, 270):
        rad = math.radians(ang)
        x1 = cx + int(38 * math.cos(rad))
        y1 = cy + int(38 * math.sin(rad))
        x2 = cx + int(22 * math.cos(rad))
        y2 = cy + int(22 * math.sin(rad))
        draw.line([(x1, y1), (x2, y2)], fill=_hex(C["teal"]), width=3)
    draw_label(draw, "가이드 홈 ×4", (640, cy + 56), load_font(13), fill=C["gray"])

    # AUTO data flow (primary)
    fx0, fy0 = 860, 180
    draw.rounded_rectangle([fx0, fy0, 1820, 520], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "자동계측 데이터 흐름 (AUTO-01)", (1340, fy0 + 32), load_font(22, bold=True))
    steps = [
        (960, 300, "IPI\n센서 노드"),
        (1120, 300, "케이블"),
        (1280, 300, "접속함"),
    ]
    for sx, sy, lab in steps:
        draw.rounded_rectangle([sx - 50, sy - 36, sx + 50, sy + 36], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
        draw_label(draw, lab, (sx, sy), load_font(13, bold=True))
    draw_logger_block_icon(draw, 1460, 264, 120, 72, title="데이터로거", font=load_font(14, bold=True))
    draw.rounded_rectangle([1620, 264, 1760, 336], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "서버·경보", (1690, 300), load_font(14, bold=True))
    for i in range(3):
        x1, x2 = steps[i][0] + 50, steps[i + 1][0] - 50 if i < 2 else 1280 + 50
        if i == 2:
            draw_arrow(draw, 1330, 300, 1400, 300, width=3)
            draw_arrow(draw, 1580, 300, 1620, 300, width=3)
        else:
            draw_arrow(draw, x1, 300, x2, 300, width=3)

    # Manual compare inset (not hero)
    draw.rounded_rectangle([860, 540, 1200, 680], outline=_hex(C["gray"]), width=1)
    draw_label(draw, "비교용: 수동 프로브·리드아웃", (1030, 560), load_font(13), fill=C["gray"])
    draw.rounded_rectangle([920, 590, 980, 640], fill=_hex(C["light"]), outline=_hex(C["gray"]), width=1)
    draw_label(draw, "Probe", (950, 615), load_font(11))
    draw_label(draw, "(운영 hero 아님)", (1030, 640), load_font(12), fill=C["orange"])

    # Depth vs displacement mini graph — stable base is 0 mm by definition for this concept figure.
    gx0, gy0 = 1240, 540
    draw.rounded_rectangle([gx0, gy0, 1820, 900], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "하단 기준 누적 상대변위 vs 깊이", (1530, gy0 + 26), load_font(18, bold=True))

    chart_x = gx0 + 105
    chart_y = gy0 + 70
    chart_w = 390
    chart_h = 230
    max_disp = 50
    max_depth = 50

    # Grid and axes
    for d in range(0, 51, 10):
        y = chart_y + int(chart_h * d / max_depth)
        draw.line([(chart_x, y), (chart_x + chart_w, y)], fill=_hex("#D1D5DB"), width=1)
        draw_label(draw, f"{d}", (chart_x - 24, y), load_font(11), fill=C["gray"])
    for v in range(0, 51, 10):
        x = chart_x + int(chart_w * v / max_disp)
        draw.line([(x, chart_y), (x, chart_y + chart_h)], fill=_hex("#E5E7EB"), width=1)
        draw_label(draw, f"{v}", (x, chart_y - 14), load_font(11), fill=C["gray"])
    draw.line([(chart_x, chart_y), (chart_x, chart_y + chart_h)], fill=_hex(C["navy"]), width=2)
    draw.line([(chart_x, chart_y), (chart_x + chart_w, chart_y)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "누적 상대변위(mm)", (chart_x + chart_w // 2, chart_y - 36), load_font(13, bold=True), fill=C["teal"])
    draw_label(draw, "깊이(m)", (chart_x - 56, chart_y + chart_h // 2), load_font(13, bold=True), fill=C["navy"])

    def map_point(depth: int, disp: float) -> tuple[int, int]:
        x = chart_x + int(chart_w * disp / max_disp)
        y = chart_y + int(chart_h * depth / max_depth)
        return x, y

    depths = [50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0]
    a_disp = [0, 3, 5, 8, 12, 17, 22, 27, 32, 36, 38]
    b_disp = [0, 4, 8, 13, 18, 24, 30, 35, 38, 42, 44]
    pts_a = [map_point(d, v) for d, v in zip(depths, a_disp)]
    pts_b = [map_point(d, v) for d, v in zip(depths, b_disp)]
    for p1, p2 in zip(pts_a, pts_a[1:]):
        draw.line([p1, p2], fill=_hex(C["teal"]), width=3)
    _dashed_line(draw, pts_b, fill=_hex(C["navy"]), width=3)
    for x, y in pts_a[::2]:
        draw.ellipse([x - 3, y - 3, x + 3, y + 3], fill=_hex(C["teal"]))
    for x, y in pts_b[::2]:
        draw.ellipse([x - 3, y - 3, x + 3, y + 3], fill=_hex(C["navy"]))

    base_y_graph = map_point(50, 0)[1]
    draw_label(draw, "안정층 기준점: 0 mm", (chart_x + 110, base_y_graph + 18), load_font(12, bold=True), fill=C["navy"])
    draw_label(draw, "A축 예시", (gx0 + 560, gy0 + 134), load_font(12), fill=C["teal"])
    draw_label(draw, "B축 예시", (gx0 + 560, gy0 + 162), load_font(12), fill=C["navy"])
    draw_label(draw, "※ 최대 위치는 지반·하중·시공조건별 상이", (1530, gy0 + 332), load_font(12), fill=C["gray"])
