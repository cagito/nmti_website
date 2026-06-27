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

    # Depth vs displacement mini graph
    gx0, gy0 = 1240, 540
    draw.rounded_rectangle([gx0, gy0, 1820, 900], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "누적 수평변위 vs 깊이 (예시)", (1530, gy0 + 28), load_font(18, bold=True))
    draw.line([(gx0 + 40, gy0 + 320), (gx0 + 520, gy0 + 320)], fill=_hex(C["gray"]), width=1)
    draw.line([(gx0 + 120, gy0 + 60), (gx0 + 120, gy0 + 320)], fill=_hex(C["gray"]), width=1)
    draw_label(draw, "깊이", (1530, gy0 + 340), load_font(14), fill=C["gray"])
    draw_label(draw, "변위", (gx0 + 50, gy0 + 200), load_font(14), fill=C["gray"], anchor="mm")
    pts_g = [(gx0 + 120 + i * 18, gy0 + 200 - int(80 * math.sin(i / 4))) for i in range(22)]
    for i in range(len(pts_g) - 1):
        draw.line([pts_g[i], pts_g[i + 1]], fill=_hex(C["teal"]), width=3)
