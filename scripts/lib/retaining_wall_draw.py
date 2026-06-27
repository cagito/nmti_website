"""Retaining excavation cross-section figures (IMG-001, IMG-002).

Layout rule (INSTRUMENTATION §3.1 · docs/27 C0):
  [left] adjacent building ON ground surface | backfill (continuous soil BELOW surface) | wall+waler | [right] excavation ONLY

P0: building 1F + entrance threshold MUST align with SURFACE_Y (지표면). Soil strata ONLY below surface.
"""
from __future__ import annotations

import math

from PIL import ImageDraw, ImageFont

from .anchor_head_draw import draw_anchor_head_assembly
from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, draw_legacy_logger_in_enclosure, load_font

# Cross-section geometry — SURFACE_Y = 지표면 (original ground level)
SURFACE_Y = 700
GROUND_Y = SURFACE_Y  # alias for instrument positions
BOTTOM_Y = 980
WALL_X0 = 820
WALL_X1 = 880
BUILD_X0 = 110
BUILD_X1 = 300
BACK_L = 60
BACK_R = WALL_X0
EXC_L = WALL_X1
EXC_R = 1180
BUILD_TOP = SURFACE_Y - 280
SOIL_FILL = "#E8D4B8"
SOIL_SAND = "#C4A574"
SOIL_ROCK = "#9CA3AF"
LAYER_SAND = SURFACE_Y + 80
LAYER_ROCK = SURFACE_Y + 190


def _layer_rect(draw: ImageDraw.ImageDraw, x0: int, x1: int, y0: int, y1: int, fill: str, hatch: str | None = None) -> None:
    draw.rectangle([x0, y0, x1, y1], fill=_hex(fill))
    if hatch:
        for yy in range(y0 + 6, y1, 14):
            draw.line([(x0 + 4, yy), (x1 - 4, yy)], fill=_hex(hatch), width=1)


def _draw_backfill_strata(draw: ImageDraw.ImageDraw) -> None:
    """Continuous soil layers under building and backfill — ONLY below 지표면."""
    _layer_rect(draw, BACK_L, BACK_R, SURFACE_Y, LAYER_SAND, SOIL_FILL, SOIL_SAND)
    _layer_rect(draw, BACK_L, BACK_R, LAYER_SAND, LAYER_ROCK, SOIL_SAND, "#A08050")
    _layer_rect(draw, BACK_L, BACK_R, LAYER_ROCK, BOTTOM_Y, SOIL_ROCK, "#7B8490")
    # Layer boundaries — continuous in open ground, NOT through building cut (C0)
    for y in (LAYER_SAND, LAYER_ROCK):
        draw.line([(BACK_L, y), (BUILD_X0, y)], fill=_hex(C["navy"]), width=1)
        draw.line([(BUILD_X1, y), (BACK_R, y)], fill=_hex(C["navy"]), width=1)
    f11 = load_font(11)
    lx = (BUILD_X1 + BACK_R) // 2
    draw_label(draw, "매립층", (lx, SURFACE_Y + 36), f11, fill=C["gray"])
    draw_label(draw, "모래층", (lx, LAYER_SAND + 36), f11, fill=C["gray"])
    draw_label(draw, "풍화암", (lx, LAYER_ROCK + 36), f11, fill=C["gray"])


def _draw_ground_surface(draw: ImageDraw.ImageDraw) -> None:
    """Prominent 지표면 — building 1F sits on this line."""
    y = SURFACE_Y
    draw.line([(BACK_L, y - 2), (BACK_R, y - 2)], fill=_hex("#8B4513"), width=2)
    draw.line([(BACK_L, y), (BACK_R, y)], fill=_hex(C["navy"]), width=4)
    draw.line([(EXC_L, y), (EXC_R, y)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "지표면 (원 지반)", (380, y - 22), load_font(13, bold=True), fill=C["navy"])
    draw_label(draw, "← 1F·출입구 = 지표면", (BUILD_X1 + 12, y - 18), load_font(11), fill=C["teal"])


def _soil_rect(draw: ImageDraw.ImageDraw, x0: int, y0: int, x1: int, y1: int, base: str = SOIL_FILL, hatch: str = SOIL_SAND) -> None:
    _layer_rect(draw, x0, x1, y0, y1, base, hatch)


def _dashed_hline(draw: ImageDraw.ImageDraw, x0: int, x1: int, y: int, color: str = C["teal"], step: int = 14) -> None:
    x = x0
    while x < x1:
        draw.line([(x, y), (min(x + step, x1), y)], fill=_hex(color), width=2)
        x += step * 2


def _zone_labels(draw: ImageDraw.ImageDraw) -> None:
    f = load_font(16)
    draw_label(draw, "인접 건물", (200, BUILD_TOP - 24), f, fill=C["gray"])
    draw_label(draw, "배면 지반", (520, SURFACE_Y + 50), f, fill=C["gray"])
    draw_label(draw, "흙막이 벽체·띠장", (850, SURFACE_Y - 200), f, fill=C["gray"])
    draw_label(draw, "굴착측", (1020, SURFACE_Y - 200), f, fill=C["gray"])


def _draw_ground_profile(draw: ImageDraw.ImageDraw) -> None:
    """Continuous backfill strata below surface + excavation cavity on far right only."""
    # Above-ground zone — pure white (no soil-tone — C0)
    draw.rectangle([BACK_L, 100, BACK_R, SURFACE_Y], fill=_hex(C["white"]))
    _draw_backfill_strata(draw)
    _draw_ground_surface(draw)

    # Excavation cavity (right of wall only) — below surface
    exc_poly = [
        (EXC_L, SURFACE_Y),
        (EXC_R, SURFACE_Y),
        (EXC_R, BOTTOM_Y),
        (EXC_L + 40, BOTTOM_Y),
        (EXC_L, SURFACE_Y + 80),
    ]
    draw.polygon(exc_poly, fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    for i, dy in enumerate([40, 100, 180]):
        y = SURFACE_Y + dy
        draw.line([(EXC_L + 20 + i * 15, y), (EXC_R - 20, y)], fill=_hex(C["gray"]), width=1)
    draw_label(draw, "굴착저", (1080, BOTTOM_Y - 24), load_font(14), fill=C["gray"])

    # Retaining wall + waler
    draw.rectangle([WALL_X0, SURFACE_Y - 280, WALL_X1, BOTTOM_Y], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)
    draw.rectangle([WALL_X1, SURFACE_Y - 120, WALL_X1 + 28, SURFACE_Y - 40], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "띠장", (WALL_X1 + 42, SURFACE_Y - 82), load_font(14))

    strut_y = SURFACE_Y - 60
    draw.rectangle([WALL_X1 + 28, strut_y - 10, EXC_R - 80, strut_y + 10], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "버팀보", (980, strut_y - 28), load_font(14))

    lc_x = WALL_X1 + 28
    draw.rounded_rectangle([lc_x - 8, strut_y - 18, lc_x + 22, strut_y + 18], radius=3, fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_arrow(draw, WALL_X0, strut_y, lc_x - 10, strut_y, color=C["teal"], width=3)
    draw_label(draw, "⑤ 버팀보 하중계", (lc_x + 50, strut_y - 36), load_font(13), fill=C["teal"])
    draw_label(draw, "축압축력", (lc_x + 50, strut_y - 16), load_font(12), fill=C["gray"])

    _zone_labels(draw)


def _draw_building(draw: ImageDraw.ImageDraw) -> None:
    """Building ON 지표면 — 1F·출입구 at SURFACE_Y; foundation only below."""
    f12 = load_font(12)
    f13 = load_font(13)

    # Clear soil hatch above surface in building footprint (C0 visual)
    draw.rectangle([BUILD_X0 - 4, 100, BUILD_X1 + 4, SURFACE_Y], fill=_hex(C["white"]))

    # Main structure — entirely above surface
    draw.rectangle([BUILD_X0, BUILD_TOP, BUILD_X1, SURFACE_Y], fill=_hex("#D1D5DB"), outline=_hex(C["navy"]), width=2)
    for fy in (BUILD_TOP + 70, BUILD_TOP + 150, BUILD_TOP + 230):
        draw.line([(BUILD_X0 + 8, fy), (BUILD_X1 - 8, fy)], fill=_hex(C["gray"]), width=1)

    # 1F floor slab = 지표면
    draw.line([(BUILD_X0, SURFACE_Y), (BUILD_X1, SURFACE_Y)], fill=_hex(C["navy"]), width=3)

    # Entrance at ground level (threshold = SURFACE_Y)
    door_l, door_r = BUILD_X1 - 38, BUILD_X1 - 6
    door_t = SURFACE_Y - 78
    draw.rectangle([door_l, door_t, door_r, SURFACE_Y], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw.line([(door_l + 16, door_t + 8), (door_l + 16, SURFACE_Y - 4)], fill=_hex(C["gray"]), width=1)
    f11 = load_font(11)
    draw_label(draw, "출입구 (1F)", (door_l - 6, door_t - 8), f11, fill=C["navy"], anchor="rm")

    # Shallow foundation below surface only — opaque block (soil not visible through cut)
    draw.rectangle([BUILD_X0, SURFACE_Y, BUILD_X1, SURFACE_Y + 52], fill=_hex("#9CA3AF"), outline=_hex(C["navy"]), width=1)
    draw.rectangle([BUILD_X0 + 24, SURFACE_Y + 8, BUILD_X1 - 24, SURFACE_Y + 44], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "얕은 기초", ((BUILD_X0 + BUILD_X1) // 2, SURFACE_Y + 26), f11, fill=C["white"])

    draw_label(draw, "인접 건물", (205, BUILD_TOP - 18), load_font(18, bold=True))
    draw_label(draw, "지표면 위", (205, BUILD_TOP + 8), f11, fill=C["teal"])

    # Tiltmeter — 1F exterior wall above surface
    tx = BUILD_X1 - 4
    ty = SURFACE_Y - 95
    draw.rounded_rectangle([tx, ty, tx + 28, ty + 36], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw.line([(tx + 14, ty + 36), (tx + 14, ty + 52)], fill=_hex(C["navy"]), width=2)
    draw.ellipse([tx + 8, ty + 50, tx + 20, ty + 62], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "⑧ 구조물경사계 (θ)", (tx + 40, ty + 18), f12, fill=C["teal"])

    cy = SURFACE_Y - 175
    draw.line([(BUILD_X1 - 2, cy - 20), (BUILD_X1 - 2, cy + 20)], fill=_hex(C["red"]), width=2)
    draw.line([(BUILD_X1 - 30, cy), (BUILD_X1 + 8, cy)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "⑨ 균열계", (BUILD_X1 + 12, cy), f12, anchor="lm")

    px, py = (BUILD_X0 + BUILD_X1) // 2, BUILD_TOP - 8
    draw.polygon([(px, py - 16), (px - 12, py), (px + 12, py)], fill=_hex(C["orange"]), outline=_hex(C["navy"]))
    draw_label(draw, "변위 타깃 프리즘", (px, py - 28), load_font(11), fill=C["navy"])


def _draw_ats_sightline(draw: ImageDraw.ImageDraw) -> None:
    """Total station on stable ground at 지표면 (not buried in soil)."""
    ats_x, ats_y = 36, SURFACE_Y - 48
    draw.line([(ats_x + 28, ats_y + 44), (ats_x + 28, SURFACE_Y)], fill=_hex(C["navy"]), width=2)
    draw.rounded_rectangle([ats_x, ats_y, ats_x + 56, ats_y + 44], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw.ellipse([ats_x + 18, ats_y + 10, ats_x + 38, ats_y + 30], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "자동광파기", (ats_x + 28, ats_y - 12), load_font(12), anchor="mm", fill=C["gray"])
    draw_label(draw, "(부동점·지표면)", (ats_x + 28, SURFACE_Y + 18), load_font(11), anchor="mm", fill=C["gray"])
    prism_x = (BUILD_X0 + BUILD_X1) // 2
    prism_y = BUILD_TOP - 8
    draw.line([(ats_x + 50, ats_y + 20), (prism_x, prism_y)], fill=_hex(C["gray"]), width=1)
    draw_label(draw, "시준선", (320, BUILD_TOP + 20), load_font(11), fill=C["gray"])


def _leader(
    draw: ImageDraw.ImageDraw,
    ax: int,
    ay: int,
    lx: int,
    ly: int,
    title: str,
    *,
    sub: str = "",
    color: str = C["navy"],
    font_title=None,
    font_sub=None,
) -> None:
    """Thin leader line to a label — avoids overlapping callouts on the figure."""
    font_title = font_title or load_font(13)
    font_sub = font_sub or load_font(11)
    draw.line([(ax, ay), (lx, ly)], fill=_hex(C["gray"]), width=1)
    draw.ellipse([ax - 3, ay - 3, ax + 3, ay + 3], fill=_hex(color), outline=_hex(C["navy"]), width=1)
    draw_label(draw, title, (lx, ly), font_title, fill=color, anchor="lm")
    if sub:
        draw_label(draw, sub, (lx, ly + 18), font_sub, fill=C["gray"], anchor="lm")


def _draw_overview_profile(draw: ImageDraw.ImageDraw) -> None:
    """Cross-section for IMG-001 — same geometry, fewer on-diagram labels."""
    draw.rectangle([BACK_L, 100, BACK_R, SURFACE_Y], fill=_hex(C["white"]))
    _draw_backfill_strata(draw)
    _draw_ground_surface(draw)

    exc_poly = [
        (EXC_L, SURFACE_Y),
        (EXC_R, SURFACE_Y),
        (EXC_R, BOTTOM_Y),
        (EXC_L + 40, BOTTOM_Y),
        (EXC_L, SURFACE_Y + 80),
    ]
    draw.polygon(exc_poly, fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    for i, dy in enumerate([40, 100, 180]):
        y = SURFACE_Y + dy
        draw.line([(EXC_L + 20 + i * 15, y), (EXC_R - 20, y)], fill=_hex(C["gray"]), width=1)
    draw_label(draw, "굴착저", (1080, BOTTOM_Y - 24), load_font(14), fill=C["gray"])

    draw.rectangle([WALL_X0, SURFACE_Y - 280, WALL_X1, BOTTOM_Y], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)
    draw.rectangle([WALL_X1, SURFACE_Y - 120, WALL_X1 + 28, SURFACE_Y - 40], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)

    strut_y = SURFACE_Y - 60
    draw.rectangle([WALL_X1 + 28, strut_y - 10, EXC_R - 80, strut_y + 10], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)

    lc_x = WALL_X1 + 28
    draw.rounded_rectangle([lc_x - 8, strut_y - 18, lc_x + 22, strut_y + 18], radius=3, fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    _leader(draw, lc_x + 7, strut_y, lc_x + 7, strut_y + 42, "버팀보 하중계", sub="띠장 접합부(끝단)", color=C["teal"])

    f16 = load_font(16)
    draw_label(draw, "인접 건물", (200, BUILD_TOP - 36), f16, fill=C["gray"])
    draw_label(draw, "배면 지반", (500, SURFACE_Y + 28), f16, fill=C["gray"])
    draw_label(draw, "흙막이 벽체·띠장", (WALL_X0 + 30, SURFACE_Y - 248), f16, fill=C["gray"])
    draw_label(draw, "굴착측", (1040, SURFACE_Y - 248), f16, fill=C["gray"])


def _draw_overview_building(draw: ImageDraw.ImageDraw) -> None:
    """Building + adjacent-structure sensors — compact labels on exterior only."""
    f11 = load_font(11)
    f12 = load_font(12)

    draw.rectangle([BUILD_X0 - 4, 100, BUILD_X1 + 4, SURFACE_Y], fill=_hex(C["white"]))
    draw.rectangle([BUILD_X0, BUILD_TOP, BUILD_X1, SURFACE_Y], fill=_hex("#D1D5DB"), outline=_hex(C["navy"]), width=2)
    for fy in (BUILD_TOP + 70, BUILD_TOP + 150, BUILD_TOP + 230):
        draw.line([(BUILD_X0 + 8, fy), (BUILD_X1 - 8, fy)], fill=_hex(C["gray"]), width=1)
    draw.line([(BUILD_X0, SURFACE_Y), (BUILD_X1, SURFACE_Y)], fill=_hex(C["navy"]), width=3)

    door_l, door_r = BUILD_X1 - 38, BUILD_X1 - 6
    door_t = SURFACE_Y - 78
    draw.rectangle([door_l, door_t, door_r, SURFACE_Y], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw.line([(door_l + 16, door_t + 8), (door_l + 16, SURFACE_Y - 4)], fill=_hex(C["gray"]), width=1)

    draw.rectangle([BUILD_X0, SURFACE_Y, BUILD_X1, SURFACE_Y + 52], fill=_hex("#9CA3AF"), outline=_hex(C["navy"]), width=1)
    draw.rectangle([BUILD_X0 + 24, SURFACE_Y + 8, BUILD_X1 - 24, SURFACE_Y + 44], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=1)

    tx = BUILD_X1 - 4
    ty = SURFACE_Y - 95
    draw.rounded_rectangle([tx, ty, tx + 28, ty + 36], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw.line([(tx + 14, ty + 36), (tx + 14, ty + 52)], fill=_hex(C["navy"]), width=2)
    draw.ellipse([tx + 8, ty + 50, tx + 20, ty + 62], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=1)
    _leader(draw, tx + 14, ty + 18, tx + 44, ty + 6, "구조물경사계", color=C["teal"])

    cy = SURFACE_Y - 175
    draw.line([(BUILD_X1 - 2, cy - 20), (BUILD_X1 - 2, cy + 20)], fill=_hex(C["red"]), width=2)
    draw.line([(BUILD_X1 - 30, cy), (BUILD_X1 + 8, cy)], fill=_hex(C["navy"]), width=2)
    _leader(draw, BUILD_X1 - 2, cy, BUILD_X1 + 14, cy - 4, "균열계", color=C["red"])

    px, py = (BUILD_X0 + BUILD_X1) // 2, BUILD_TOP - 8
    draw.polygon([(px, py - 16), (px - 12, py), (px + 12, py)], fill=_hex(C["orange"]), outline=_hex(C["navy"]))
    draw_label(draw, "변위 타깃 프리즘", (px, py - 30), f11, fill=C["navy"])


def _draw_overview_ats(draw: ImageDraw.ImageDraw) -> None:
    ats_x, ats_y = 28, SURFACE_Y - 52
    draw.line([(ats_x + 24, ats_y + 40), (ats_x + 24, SURFACE_Y)], fill=_hex(C["navy"]), width=2)
    draw.rounded_rectangle([ats_x, ats_y, ats_x + 48, ats_y + 40], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw.ellipse([ats_x + 16, ats_y + 10, ats_x + 32, ats_y + 26], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=1)
    prism_x = (BUILD_X0 + BUILD_X1) // 2
    prism_y = BUILD_TOP - 8
    draw.line([(ats_x + 46, ats_y + 18), (prism_x, prism_y)], fill=_hex("#CBD5E1"), width=1)
    _leader(draw, ats_x + 24, ats_y + 20, ats_x + 24, ats_y - 10, "자동광파기", sub="(부동점)", color=C["gray"])


def _draw_overview_sensors(draw: ImageDraw.ImageDraw) -> None:
    """IMG-001 overview sensors — icons only, labels via leaders into clear margins."""
    gwl_y = SURFACE_Y + 120
    _dashed_hline(draw, BACK_L + 20, BACK_R - 20, gwl_y)
    draw_label(draw, "G.W.L", (BACK_R - 16, gwl_y - 14), load_font(11), anchor="rm", fill=C["teal"])

    # Inclinometer — right side of backfill
    ix = 740
    draw.line([(ix, SURFACE_Y + 20), (ix, BOTTOM_Y - 50)], fill=_hex(C["teal"]), width=4)
    for gy in range(SURFACE_Y + 30, BOTTOM_Y - 55, 32):
        draw.line([(ix - 5, gy), (ix + 5, gy)], fill=_hex(C["navy"]), width=1)
    _leader(
        draw,
        ix,
        SURFACE_Y + 80,
        ix + 28,
        SURFACE_Y + 50,
        "센서형 다단식 지중경사계",
        sub="수평변위",
        color=C["teal"],
    )

    # Open standpipe — left of backfill center
    wx = 360
    draw.line([(wx, SURFACE_Y - 10), (wx, BOTTOM_Y - 90)], fill=_hex(C["gray"]), width=3)
    draw.rectangle([wx - 14, SURFACE_Y - 22, wx + 14, SURFACE_Y + 6], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw.rectangle([wx - 10, gwl_y - 22, wx + 10, gwl_y + 8], fill=_hex("#93C5FD"), outline=_hex(C["navy"]), width=1)
    _leader(draw, wx, SURFACE_Y - 16, wx - 8, SURFACE_Y - 48, "지하수위계", sub="개방형 관측공")

    # Piezometer — distinct borehole
    px = 500
    draw.line([(px, SURFACE_Y + 10), (px, SURFACE_Y + 150)], fill=_hex(C["navy"]), width=2)
    draw.ellipse([px - 10, SURFACE_Y + 130, px + 10, SURFACE_Y + 150], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    _leader(draw, px, SURFACE_Y + 140, px + 16, SURFACE_Y + 168, "간극수압계", sub="필터·밀폐")

    # Earth pressure on wall back face
    ep_y = SURFACE_Y - 150
    draw.rounded_rectangle([WALL_X0 - 18, ep_y - 14, WALL_X0 - 2, ep_y + 14], radius=2, fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    _leader(draw, WALL_X0 - 10, ep_y, WALL_X0 - 90, ep_y - 6, "토압계", sub="배면→벽체", color=C["teal"])

    # Anchor head — excavation side, compact
    ah_y = SURFACE_Y - 195
    ax = WALL_X1 + 24
    draw_anchor_head_assembly(draw, ax, ah_y, scale=0.5, show_labels=False, show_forces=False, compact=True)
    _leader(draw, ax + 55, ah_y, ax + 55, ah_y + 48, "어스앵커 하중계", sub="굴착측 노출 두부", color=C["teal"])

    # Surface settlement pins
    for sx in (440, 580):
        draw.line([(sx, SURFACE_Y - 10), (sx, SURFACE_Y + 2)], fill=_hex(C["teal"]), width=3)
        draw.ellipse([sx - 4, SURFACE_Y - 12, sx + 4, SURFACE_Y - 4], fill=_hex(C["teal"]), outline=_hex(C["navy"]))
    _leader(draw, 510, SURFACE_Y - 8, 510, SURFACE_Y - 38, "지표침하계")

    # Compact datalogger — no cable spaghetti
    from .datalogger_draw import draw_cr1000x_front

    lx, ly, lw, lh = 600, SURFACE_Y - 118, 118, 72
    draw.rounded_rectangle([lx - 6, ly - 6, lx + lw + 6, ly + lh + 6], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_cr1000x_front(draw, lx, ly, lw, lh, show_label=False, font=load_font(10))
    _leader(draw, lx + lw // 2, ly - 8, lx + lw // 2, ly - 32, "데이터로거", sub="자동수집")

    _draw_overview_ats(draw)


def _draw_instruments(draw: ImageDraw.ImageDraw, *, detailed: bool) -> None:
  f12 = load_font(12)
  f13 = load_font(13)
  gwl_y = 640
  _dashed_hline(draw, BACK_L + 20, BACK_R - 20, gwl_y)
  draw_label(draw, "지하수위선 (G.W.L)", (BACK_R - 30, gwl_y - 18), f12, anchor="rm", fill=C["teal"])

  # ① Inclinometer
  ix = 680
  draw.line([(ix, GROUND_Y - 20), (ix, BOTTOM_Y - 40)], fill=_hex(C["teal"]), width=5)
  for gy in range(GROUND_Y, BOTTOM_Y - 50, 28):
      draw.line([(ix - 6, gy), (ix + 6, gy)], fill=_hex(C["navy"]), width=1)
  draw_arrow(draw, ix + 20, GROUND_Y - 80, ix + 70, GROUND_Y - 80, color=C["teal"])
  draw_label(draw, "① 센서형 다단식 지중경사계", (ix + 75, GROUND_Y - 92), f13, fill=C["teal"])
  draw_label(draw, "수평변위 →", (ix + 75, GROUND_Y - 72), f12, fill=C["gray"])
  draw_label(draw, "안정층", (ix + 20, BOTTOM_Y - 70), f12, fill=C["gray"])

  # ② Water level meter — open observation well (개방형 관측공)
  wx = 380
  draw.line([(wx, GROUND_Y - 30), (wx, BOTTOM_Y - 80)], fill=_hex(C["gray"]), width=4)
  draw.rectangle([wx - 18, GROUND_Y - 40, wx + 18, GROUND_Y + 8], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
  draw.rectangle([wx - 14, gwl_y - 30, wx + 14, gwl_y + 10], fill=_hex("#93C5FD"), outline=_hex(C["navy"]), width=1)
  draw.line([(wx - 14, gwl_y), (wx + 14, gwl_y)], fill=_hex(C["teal"]), width=2)
  draw_label(draw, "② 지하수위계", (wx + 28, GROUND_Y - 100), f13, fill=C["navy"])
  draw_label(draw, "(개방형 관측공)", (wx + 28, GROUND_Y - 80), f12, fill=C["gray"])

  # ③ Piezometer — sealed filter tip (밀폐·필터)
  px = 520
  draw.line([(px, GROUND_Y - 10), (px, GROUND_Y + 160)], fill=_hex(C["navy"]), width=3)
  draw.rectangle([px - 8, GROUND_Y + 20, px + 8, GROUND_Y + 70], fill=_hex(C["light"]), outline=_hex(C["gray"]), width=1)
  draw_label(draw, "밀토·벤토", (px + 22, GROUND_Y + 30), load_font(10), fill=C["gray"])
  draw.ellipse([px - 12, GROUND_Y + 130, px + 12, GROUND_Y + 154], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
  draw_label(draw, "필터", (px + 22, GROUND_Y + 136), f12, fill=C["teal"])
  draw_label(draw, "③ 간극수압계", (px + 22, GROUND_Y + 40), f13, fill=C["navy"])
  draw_label(draw, "(밀폐·필터)", (px + 22, GROUND_Y + 58), f12, fill=C["gray"])

  # ④ Earth pressure cell — sensing face toward wall
  ep_y = GROUND_Y - 160
  draw.rounded_rectangle([WALL_X0 - 22, ep_y - 16, WALL_X0 - 2, ep_y + 16], radius=2, fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
  draw.line([(WALL_X0 - 12, ep_y - 10), (WALL_X0 - 12, ep_y + 10)], fill=_hex(C["white"]), width=2)
  draw_label(draw, "감지면", (WALL_X0 - 12, ep_y + 28), load_font(10), fill=C["teal"])
  draw_arrow(draw, WALL_X0 - 70, ep_y, WALL_X0 - 24, ep_y, color=C["teal"], width=3)
  draw_label(draw, "④ 토압계", (WALL_X0 - 100, ep_y - 28), f13, fill=C["teal"], anchor="rm")
  draw_label(draw, "토압 (배면→벽체)", (WALL_X0 - 100, ep_y - 8), f12, fill=C["gray"], anchor="rm")

  # ⑥ Anchor head on excavation side (simplified in section)
  ah_y = GROUND_Y - 200
  ax = WALL_X1 + 30
  draw_anchor_head_assembly(draw, ax, ah_y, scale=0.55, show_labels=False, show_forces=False, compact=True)
  draw_label(draw, "⑥ 어스앵커 하중계", (ax + 110, ah_y - 36), f13, fill=C["teal"])
  draw_label(draw, "인장력 T → (배면)", (ax + 110, ah_y - 16), f12, fill=C["gray"])

  # ⑦ Surface settlement — on 지표면
  for sx in (420, 480, 540):
      draw.line([(sx, SURFACE_Y - 12), (sx, SURFACE_Y + 2)], fill=_hex(C["teal"]), width=3)
      draw.ellipse([sx - 4, SURFACE_Y - 14, sx + 4, SURFACE_Y - 6], fill=_hex(C["teal"]), outline=_hex(C["navy"]))
  draw_label(draw, "⑦ 지표침하계", (500, SURFACE_Y - 36), f13, fill=C["teal"])

  # ⑩ Strain gauge on waler
  draw.rounded_rectangle([WALL_X1 + 32, GROUND_Y - 115, WALL_X1 + 52, GROUND_Y - 95], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
  draw_label(draw, "⑩ 변형률계", (WALL_X1 + 58, GROUND_Y - 118), f12, fill=C["teal"])

  # ⑪ Datalogger
  draw_legacy_logger_in_enclosure(draw, 600, GROUND_Y - 115, 150, 95, font=load_font(12))
  draw_label(draw, "⑪ 데이터로거", (675, GROUND_Y - 128), f13, fill=C["navy"])

  _draw_ats_sightline(draw)


def _anchor_inset_panel(draw: ImageDraw.ImageDraw) -> None:
    """E4 — anchor head detail inset (matches IMG-004 assembly)."""
    ix, iy, iw, ih = 980, 720, 360, 240
    draw.rounded_rectangle([ix, iy, ix + iw, iy + ih], outline=_hex(C["navy"]), width=2, fill=_hex(C["white"]))
    draw_label(draw, "⑥ 앵커 두부 (확대)", (ix + iw // 2, iy + 18), load_font(13, bold=True))
    draw_anchor_head_assembly(draw, ix + 40, iy + ih // 2 + 10, scale=0.7, show_labels=True, show_forces=True, compact=True)
    draw_label(draw, "→ IMG-004 상세", (ix + iw - 12, iy + ih - 14), load_font(10), fill=C["gray"], anchor="rm")


def _legend_panel(draw: ImageDraw.ImageDraw, *, detailed: bool) -> None:
    px = 1320 if not detailed else 1380
    panel_w = 560 if not detailed else 480
    draw.rounded_rectangle([px, 120, px + panel_w, 700], outline=_hex(C["navy"]), width=2)
    title = "계측기 범례 ①~⑪" if detailed else "가시설 계측 항목"
    cx = px + panel_w // 2
    draw_label(draw, title, (cx, 155), load_font(20, bold=True))

    if detailed:
        items = [
            "① 센서형 다단식 지중경사계 (천공·수평변위)",
            "② 지하수위계 (개방형 관측공)",
            "③ 간극수압계 (밀폐·필터)",
            "④ 토압계 (배면→벽체)",
            "⑤ 버팀보 하중계",
            "⑥ 어스앵커 하중계",
            "⑦ 지표침하계",
            "⑧ 구조물경사계 (건물·θ)",
            "⑨ 균열계",
            "⑩ 변형률계",
            "⑪ 데이터로거",
        ]
    else:
        items = [
            "센서형 다단식 지중경사계·수평변위",
            "지하수위·간극수압",
            "토압·지보재 하중",
            "지표침하·층별침하",
            "인접구조물 경사·균열",
            "변위 타깃 프리즘",
            "자동광파기 (부동점)",
            "데이터로거 (자동수집)",
        ]

    y = 200
    for item in items:
        draw.ellipse([px + 24, y - 6, px + 36, y + 6], fill=_hex(C["teal"]))
        draw_label(draw, item, (px + 48, y), load_font(16 if detailed else 17), anchor="lm")
        y += 48 if detailed else 52

    draw_label(draw, "좌→우: 인접건물|배면|벽체|굴착측", (cx, 680), load_font(14), fill=C["gray"])


def render_img002(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "흙막이 계측 설치 대표 단면도", (W // 2, 48), font_title)
    draw_label(draw, "Earth Retaining Wall Instrumentation Layout", (W // 2, 88), load_font(20), fill=C["gray"])
    _draw_ground_profile(draw)
    _draw_building(draw)
    _draw_instruments(draw, detailed=True)
    _legend_panel(draw, detailed=True)
    _anchor_inset_panel(draw)


def render_img001(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    """IMG-001 overview — simpler than IMG-002; no ①~⑪ clutter or wiring."""
    draw_label(draw, "가시설 계측 전체 개념도", (640, 48), font_title)
    draw_label(draw, "Temporary Excavation Support Monitoring Overview", (640, 88), load_font(18), fill=C["gray"])
    # Divider before legend panel
    draw.line([(1288, 108), (1288, 1020)], fill=_hex(C["light"]), width=2)
    _draw_overview_profile(draw)
    _draw_overview_building(draw)
    _draw_overview_sensors(draw)
    _legend_panel(draw, detailed=False)
