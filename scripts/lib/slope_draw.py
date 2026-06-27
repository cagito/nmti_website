"""Slope monitoring cross-section (IMG-015) — INSTRUMENTATION §3.12."""
from __future__ import annotations

import math

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, draw_legacy_logger_in_enclosure, load_font

GROUND_Y = 780
VALLEY_X = 1200


def _draw_slope_section(draw: ImageDraw.ImageDraw) -> None:
    # Strata
    crest_x = 280
    toe_x = VALLEY_X
    crest_y = 420
    toe_y = GROUND_Y

    # Slope surface
    slope_pts = [(120, GROUND_Y), (crest_x, crest_y), (toe_x, toe_y), (1320, GROUND_Y), (120, GROUND_Y)]
    draw.polygon(slope_pts, fill=_hex("#E8D4B8"), outline=_hex(C["navy"]), width=2)

    # Bedrock layer
    draw.polygon(
        [(120, GROUND_Y), (1320, GROUND_Y), (1320, 960), (120, 960)],
        fill=_hex("#9CA3AF"),
        outline=_hex(C["navy"]),
    )
    draw_label(draw, "연암 (기반암)", (700, 900), load_font(16), fill=C["gray"])

    # Slip surface — potential / estimated only (dashed)
    slip = []
    for t in range(0, 101):
        u = t / 100
        x = crest_x + (toe_x - crest_x) * u
        y = crest_y + (toe_y - crest_y) * u + 80 * math.sin(math.pi * u)
        slip.append((int(x), int(y)))
    for i in range(len(slip) - 1):
        x1, y1 = slip[i]
        x2, y2 = slip[i + 1]
        if i % 3 == 0:
            draw.line([(x1, y1), (x2, y2)], fill=_hex(C["red"]), width=2)
    draw_label(draw, "잠재 활동면(추정)", (slip[50][0] + 20, slip[50][1] - 28), load_font(14, bold=True), fill=C["red"])

    # G.W.L
    gwl_y = 680
    x = 140
    while x < 1100:
        draw.line([(x, gwl_y), (min(x + 12, 1100), gwl_y)], fill=_hex(C["teal"]), width=2)
        x += 24
    draw_label(draw, "G.W.L", (1110, gwl_y - 10), load_font(14), fill=C["teal"])


def _draw_instruments(draw: ImageDraw.ImageDraw) -> None:
    f13 = load_font(13)
    f12 = load_font(12)

    # ① Inclinometer through slip into bedrock
    ix = 520
    draw.line([(ix, 400), (ix, 920)], fill=_hex(C["teal"]), width=6)
    for gy in range(440, 900, 30):
        draw.line([(ix - 7, gy), (ix + 7, gy)], fill=_hex(C["navy"]), width=1)
    draw_arrow(draw, ix + 30, 560, ix + 90, 620, color=C["teal"], width=3)
    draw_label(draw, "① 센서형 다단식 지중경사계", (ix + 95, 540), f13, fill=C["teal"])
    draw_label(draw, "수평변위 →", (ix + 95, 562), f12, fill=C["gray"])
    draw_label(draw, "Base (기반암 근입)", (ix + 20, 880), f12, fill=C["gray"])
    draw_label(draw, "근입 깊이: 설계·지반조사 결과", (ix + 20, 900), f11 := load_font(11), fill=C["gray"])

    # ③ Piezometer below GWL
    px = 640
    py_tip = 740
    draw.line([(px, 500), (px, py_tip)], fill=_hex(C["navy"]), width=3)
    draw.ellipse([px - 12, py_tip - 12, px + 12, py_tip + 12], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "④ 간극수압계 (보조)", (px + 22, py_tip - 30), f13, fill=C["navy"])
    draw_label(draw, "(G.W.L 아래)", (px + 22, py_tip - 10), f12, fill=C["gray"])

    # ② Water level well — cap, open water column, gravel filter (§3.12 C5)
    wx = 380
    well_top, well_bottom = 460, 780
    draw.line([(wx, well_top), (wx, well_bottom)], fill=_hex(C["gray"]), width=4)
    draw.rectangle([wx - 18, well_top - 8, wx + 18, well_top + 4], fill=_hex(C["navy"]), outline=_hex(C["navy"]))
    draw_label(draw, "Cap", (wx + 28, well_top - 4), f12, fill=C["gray"])
    draw.rectangle([wx - 16, 660, wx + 16, 700], fill=_hex("#93C5FD"), outline=_hex(C["navy"]), width=1)
    draw.ellipse([wx - 22, well_bottom - 10, wx + 22, well_bottom + 10], fill=_hex("#D1D5DB"), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "필터·자갈", (wx + 28, well_bottom - 6), f12, fill=C["gray"])
    draw_label(draw, "② 지하수위계 (보조)", (wx + 28, 500), f13)
    draw_label(draw, "강우·u — 원인 분석 보조", (wx + 28, 522), f11, fill=C["gray"])

    # Downslope displacement arrows (valley direction →) — C5 single direction
    slope_arrows = [
        ((320, 455), (375, 490)),
        ((420, 520), (485, 565)),
        ((520, 590), (595, 645)),
    ]
    for (x1, y1), (x2, y2) in slope_arrows:
        draw_arrow(draw, x1, y1, x2, y2, color=C["orange"], width=2)
    draw_label(draw, "수평변위 →", (400, 430), f12, fill=C["orange"])

    # Prism on slope — NOT ATS
    for px2, py2 in [(360, 480), (480, 540), (600, 620)]:
        draw.polygon([(px2, py2 - 12), (px2 - 10, py2), (px2 + 10, py2)], fill=_hex(C["orange"]), outline=_hex(C["navy"]))
    draw_label(draw, "프리즘 타깃", (420, 450), f13, fill=C["navy"])

    # Rain gauge on crest
    draw.line([(280, 400), (280, 360)], fill=_hex(C["navy"]), width=2)
    draw.ellipse([268, 340, 292, 364], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "강우량계", (300, 350), f12)

    # ATS outside slope (stable ground right)
    ats_x, ats_y = 1280, GROUND_Y - 20
    draw.rounded_rectangle([ats_x, ats_y, ats_x + 64, ats_y + 48], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw.ellipse([ats_x + 20, ats_y + 12, ats_x + 44, ats_y + 36], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "자동광파기", (ats_x + 32, ats_y - 14), f13, anchor="mm", fill=C["navy"])
    draw_label(draw, "(부동점)", (ats_x + 32, ats_y + 62), f11 := load_font(11), anchor="mm", fill=C["gray"])

    for tx, ty in [(360, 468), (480, 528), (600, 608)]:
        draw.line([(ats_x + 10, ats_y + 24), (tx, ty)], fill=_hex(C["gray"]), width=1)
    draw_label(draw, "시준선", (900, 380), f12, fill=C["gray"])

    draw_legacy_logger_in_enclosure(draw, 180, GROUND_Y - 100, 140, 88, font=load_font(12))
    draw_label(draw, "데이터로거", (250, GROUND_Y - 112), f13)


def _right_panel(draw: ImageDraw.ImageDraw) -> None:
    px = 1420
    draw.rounded_rectangle([px, 140, 1860, 880], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "사면 계측 항목", (1640, 175), load_font(20, bold=True))
    draw_label(draw, "기준점은 부동 · 측점은 사면", (1640, 210), load_font(15), fill=C["gray"])
    items = [
        "센서형 다단식 지중경사계·수평변위",
        "지표·층별 침하",
        "지하수위·간극수압",
        "프리즘 (사면 측점)",
        "자동광파기 (사면 외부)",
        "강우량·데이터로거",
    ]
    y = 270
    for item in items:
        draw.ellipse([px + 24, y - 6, px + 36, y + 6], fill=_hex(C["teal"]))
        draw_label(draw, item, (px + 48, y), load_font(17), anchor="lm")
        y += 52


def render_img015(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "사면 계측 전체 개념도", (W // 2, 48), font_title)
    draw_label(draw, "추정 활동면 · 지중경사계 · 보조 수문 계측", (W // 2, 88), load_font(18), fill=C["gray"])
    _draw_slope_section(draw)
    _draw_instruments(draw)
    _right_panel(draw)
