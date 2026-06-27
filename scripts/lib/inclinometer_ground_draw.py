"""Inclinometer installation (IMG-027) and surrounding-ground composite (IMG-096).

INSTRUMENTATION §3.3.1 · §3.19 · doc 17 · doc 18.
"""
from __future__ import annotations

import math

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, load_font

SOIL1 = "#E8D4B8"
SOIL2 = "#C4A574"
ROCK = "#9CA3AF"


def _soil_layers(draw: ImageDraw.ImageDraw, x0: int, y0: int, x1: int, y1: int, rock_y: int) -> None:
    draw.rectangle([x0, y0, x1, rock_y], fill=_hex(SOIL1))
    for yy in range(y0 + 8, rock_y, 16):
        draw.line([(x0 + 6, yy), (x1 - 6, yy)], fill=_hex(SOIL2), width=1)
    draw.rectangle([x0, rock_y, x1, y1], fill=_hex(ROCK))
    for yy in range(rock_y + 10, y1, 22):
        draw.line([(x0 + 6, yy), (x1 - 6, yy)], fill=_hex("#6B7280"), width=1)
    draw_label(draw, "풍화토", (x0 + 48, y0 + 80), load_font(14), fill=C["gray"])
    draw_label(draw, "안정층 (연암)", (x0 + 48, rock_y + 36), load_font(14), fill=C["gray"])


def _gwl_dashed(draw: ImageDraw.ImageDraw, x0: int, x1: int, y: int) -> None:
    x = x0
    while x < x1:
        draw.line([(x, y), (min(x + 12, x1), y)], fill=_hex(C["teal"]), width=2)
        x += 24
    draw_label(draw, "G.W.L", (x1 + 8, y - 10), load_font(14), fill=C["teal"])


def _draw_slip_surface(draw: ImageDraw.ImageDraw, start: tuple[int, int], end: tuple[int, int]) -> list[tuple[int, int]]:
    pts: list[tuple[int, int]] = []
    for t in range(0, 101):
        u = t / 100
        x = int(start[0] + (end[0] - start[0]) * u)
        y = int(start[1] + (end[1] - start[1]) * u + 70 * math.sin(math.pi * u))
        pts.append((x, y))
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i + 1]], fill=_hex(C["red"]), width=2)
    draw_label(draw, "활동면", (pts[55][0] + 16, pts[55][1] - 22), load_font(14, bold=True), fill=C["red"])
    return pts


def _draw_inclinometer_borehole(
    draw: ImageDraw.ImageDraw,
    ix: int,
    top_y: int,
    base_y: int,
    rock_y: int,
    *,
    show_embed_dim: bool = True,
) -> None:
    f12 = load_font(12)
    f13 = load_font(13)
    f14 = load_font(14, bold=True)

    draw.line([(ix - 28, top_y), (ix + 28, top_y)], fill=_hex(C["navy"]), width=2)
    draw.rounded_rectangle([ix - 24, top_y - 36, ix + 24, top_y], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "보호함", (ix, top_y - 48), f12, fill=C["gray"])

    draw.line([(ix - 34, top_y), (ix - 34, base_y + 40)], fill=_hex(C["gray"]), width=1)
    draw.line([(ix + 34, top_y), (ix + 34, base_y + 40)], fill=_hex(C["gray"]), width=1)
    draw.line([(ix - 34, top_y), (ix + 34, top_y)], fill=_hex(C["gray"]), width=1)
    draw_label(draw, "보링공", (ix + 44, top_y + 20), f12, fill=C["gray"])

    draw.rectangle([ix - 10, top_y, ix + 10, base_y + 40], fill=_hex("#D1FAE5"), outline=_hex(C["teal"]), width=1)
    draw.rectangle([ix - 14, top_y, ix + 14, base_y + 40], outline=_hex(C["gray"]), width=1)
    draw_label(draw, "그라우트", (ix + 28, top_y + 60), f11 := load_font(11), fill=C["gray"])

    draw.rectangle([ix - 8, top_y + 8, ix + 8, base_y + 32], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    for sy in range(top_y + 36, base_y, 42):
        draw.ellipse([ix - 5, sy - 5, ix + 5, sy + 5], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
        draw.line([(ix + 5, sy), (ix + 5, sy + 18)], fill=_hex(C["navy"]), width=1)

    draw.line([(ix, base_y + 32), (ix, base_y + 40)], fill=_hex(C["navy"]), width=3)
    draw_label(draw, "Base (절대 고정단)", (ix + 24, base_y + 8), f12, fill=C["navy"])

    if show_embed_dim:
        embed_top = base_y - 80
        draw.line([(ix + 36, embed_top), (ix + 36, base_y + 40)], fill=_hex(C["navy"]), width=1)
        draw.line([(ix + 32, embed_top), (ix + 40, embed_top)], fill=_hex(C["navy"]), width=1)
        draw.line([(ix + 32, base_y + 40), (ix + 40, base_y + 40)], fill=_hex(C["navy"]), width=1)
        draw_label(draw, "근입 4 m", (ix + 52, (embed_top + base_y + 40) // 2), f12, fill=C["navy"], anchor="lm")

    draw_label(draw, "센서형 다단식 지중경사계", (ix, top_y + 120), f14, fill=C["teal"], anchor="mm")
    draw_label(draw, "(케이싱·다점 센서)", (ix, top_y + 142), f12, fill=C["gray"], anchor="mm")


def render_img027(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "지중경사계 설치 단면도", (W // 2, 48), font_title)
    draw_label(
        draw,
        "Inclinometer installation — sensor-type multi-stage · slip surface · stable-layer embedment",
        (W // 2, 88),
        load_font(18),
        fill=C["gray"],
    )

    ground_y = 720
    rock_y = 860
    _soil_layers(draw, 80, 420, 1180, 960, rock_y)

    crest_x, crest_y = 980, 460
    toe_x, toe_y = 1320, ground_y
    draw.polygon(
        [(80, ground_y), (crest_x, crest_y), (toe_x, toe_y), (1380, ground_y), (80, ground_y)],
        fill=_hex(SOIL1),
        outline=_hex(C["navy"]),
        width=2,
    )
    draw_label(draw, "절토·사면", (1150, 580), load_font(15), fill=C["gray"])

    _draw_slip_surface(draw, (520, 500), (toe_x - 40, toe_y - 20))

    ix = 640
    base_y = rock_y + 8
    _draw_inclinometer_borehole(draw, ix, 440, base_y, rock_y)

    draw_arrow(draw, ix + 40, 580, ix + 120, 640, color=C["teal"], width=4)
    draw_label(draw, "수평변위 →", (ix + 130, 600), load_font(15, bold=True), fill=C["teal"])

    px = 1420
    draw.rounded_rectangle([px, 160, 1860, 860], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "설치 단면 검수", (1640, 200), load_font(20, bold=True))
    checks = [
        "활동면 외향 (→) — 역방향 금지",
        "Base 안정층 1~3 m+ 근입",
        "센서형 다단식 (관 내부 노드)",
        "보링·그라우트·보호함",
    ]
    y = 270
    for line in checks:
        draw.ellipse([px + 24, y - 6, px + 36, y + 6], fill=_hex(C["teal"]))
        draw_label(draw, line, (px + 48, y), load_font(16), anchor="lm")
        y += 52


def _draw_settlement_gauge(draw: ImageDraw.ImageDraw, sx: int, ground_y: int) -> None:
    """SETTLE-01: 지표침하계 센서 — 침하핀(T자) 금지."""
    f12 = load_font(12)
    f13 = load_font(13, bold=True)
    # Settlement plate at surface
    draw.rounded_rectangle([sx - 22, ground_y - 10, sx + 22, ground_y + 6], radius=3, fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    # Protective rod into ground
    draw.line([(sx, ground_y + 6), (sx, ground_y + 48)], fill=_hex(C["navy"]), width=3)
    draw.rectangle([sx - 6, ground_y + 20, sx + 6, ground_y + 52], fill=_hex("#F3F4F6"), outline=_hex(C["gray"]), width=1)
    # Sensor head
    draw.rounded_rectangle([sx - 14, ground_y - 28, sx + 14, ground_y - 10], radius=2, fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_arrow(draw, sx, ground_y - 36, sx, ground_y - 72, color=C["orange"], width=3)
    draw_label(draw, "② 지표침하계", (sx + 28, ground_y - 68), f13, fill=C["orange"])
    draw_label(draw, "침하 ↓", (sx + 28, ground_y - 46), f12, fill=C["gray"])
    # Cable to logger hint
    draw.line([(sx + 14, ground_y - 18), (sx + 80, ground_y - 50)], fill=_hex(C["navy"]), width=1)
    draw.rounded_rectangle([sx + 72, ground_y - 68, sx + 130, ground_y - 38], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "로거", (sx + 101, ground_y - 52), load_font(10), fill=C["gray"], anchor="mm")


def _draw_piezometer(draw: ImageDraw.ImageDraw, px: int, top_y: int, tip_y: int) -> None:
    draw.line([(px, top_y), (px, tip_y + 30)], fill=_hex(C["navy"]), width=3)
    draw.rectangle([px - 14, top_y, px + 14, tip_y - 40], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)
    draw.rectangle([px - 18, tip_y - 36, px + 18, tip_y + 36], fill=_hex(SOIL2), outline=_hex(C["teal"]), width=2)
    draw.ellipse([px - 10, tip_y - 6, px + 10, tip_y + 14], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "③ 간극수압계", (px + 24, tip_y - 20), load_font(13, bold=True), fill=C["navy"])
    draw_label(draw, "(밀폐·필터)", (px + 24, tip_y + 2), load_font(11), fill=C["gray"])


def _draw_water_level_well(draw: ImageDraw.ImageDraw, wx: int, top_y: int, bottom_y: int, gwl_y: int) -> None:
    draw.line([(wx, top_y), (wx, bottom_y)], fill=_hex(C["gray"]), width=4)
    draw.rectangle([wx - 16, top_y - 8, wx + 16, top_y + 4], fill=_hex(C["navy"]), outline=_hex(C["navy"]))
    draw.rectangle([wx - 14, gwl_y, wx + 14, bottom_y], fill=_hex("#93C5FD"), outline=_hex(C["teal"]), width=1)
    draw_label(draw, "④ 지하수위계", (wx + 22, top_y + 8), load_font(13, bold=True), fill=C["teal"])
    draw_label(draw, "(개방 관측공)", (wx + 22, top_y + 28), load_font(11), fill=C["gray"])


def render_img096(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "주변지반 계측 설치 대표 단면도", (W // 2, 48), font_title)
    draw_label(
        draw,
        "Surrounding Ground Instrumentation — excavation influence zone (4 instruments on one section)",
        (W // 2, 88),
        load_font(18),
        fill=C["gray"],
    )

    ground_y = 700
    rock_y = 880
    exc_x = 1180
    wall_x = 1080

    _soil_layers(draw, 80, 380, exc_x - 20, 960, rock_y)

    draw.polygon(
        [(exc_x, ground_y), (exc_x, 960), (1380, 960), (1380, ground_y + 80), (exc_x, ground_y)],
        fill=_hex("#F3F4F6"),
        outline=_hex(C["navy"]),
        width=2,
    )
    draw.line([(exc_x, ground_y), (1380, ground_y + 80)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "굴착 공동", (1280, 780), load_font(16), fill=C["gray"])
    draw_label(draw, "굴착선", (exc_x + 20, ground_y - 18), load_font(13), fill=C["orange"])

    draw.rectangle([wall_x - 8, 420, wall_x + 8, ground_y], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "흙막이 (실루엣)", (wall_x, 400), load_font(13), fill=C["gray"], anchor="mm")

    gwl_y = 620
    _gwl_dashed(draw, 120, exc_x - 40, gwl_y)

    _draw_slip_surface(draw, (420, 480), (exc_x - 60, ground_y - 10))

    ix = 720
    _draw_inclinometer_borehole(draw, ix, 420, rock_y + 6, rock_y, show_embed_dim=True)
    draw_label(draw, "①", (ix - 28, 460), load_font(14, bold=True), fill=C["teal"])
    draw_arrow(draw, ix + 36, 560, ix + 100, 600, color=C["teal"], width=3)
    draw_label(draw, "수평변위 →", (ix + 108, 578), load_font(13, bold=True), fill=C["teal"])

    _draw_settlement_gauge(draw, 520, ground_y)
    _draw_piezometer(draw, 860, 460, 740)
    _draw_water_level_well(draw, 960, 460, 820, gwl_y)

    draw.line([(exc_x, ground_y), (860, ground_y)], fill=_hex(C["orange"]), width=1)
    draw.line([(860, ground_y - 8), (860, ground_y + 8)], fill=_hex(C["orange"]), width=1)
    draw.line([(exc_x, ground_y - 8), (exc_x, ground_y + 8)], fill=_hex(C["orange"]), width=1)
    draw_label(draw, "H", (920, ground_y + 22), load_font(14, bold=True), fill=C["orange"])
    draw.line([(exc_x, ground_y), (520, ground_y)], fill=_hex(C["orange"]), width=1)
    draw.line([(520, ground_y - 8), (520, ground_y + 8)], fill=_hex(C["orange"]), width=1)
    draw_label(draw, "2H", (700, ground_y + 22), load_font(14, bold=True), fill=C["orange"])

    px = 1420
    draw.rounded_rectangle([px, 160, 1860, 860], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "동일 단면 4종", (1640, 200), load_font(20, bold=True))
    items = [
        "① 센서형 다단식 지중경사계 — 수평 →",
        "② 지표침하계 — 수직 ↓ (센서)",
        "③ 간극수압 ≠ ④ 지하수위",
        "G.W.L 점선 공통",
    ]
    y = 270
    for item in items:
        draw.ellipse([px + 24, y - 6, px + 36, y + 6], fill=_hex(C["teal"]))
        draw_label(draw, item, (px + 48, y), load_font(16), anchor="lm")
        y += 52
