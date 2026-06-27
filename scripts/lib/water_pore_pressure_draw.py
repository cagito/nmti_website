"""Groundwater & pore pressure monitoring (IMG-062).

EXC-03 · INSTRUMENTATION §3.4·§3.5 — IMG-002 ②③ 이형 상세.
Linked to earth-retaining-wall principle·data sections.
"""
from __future__ import annotations

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, draw_logger_block_icon, load_font
from .inclinometer_ground_draw import _gwl_dashed, _soil_layers

SOIL1 = "#E8D4B8"
SOIL2 = "#C4A574"


def render_img062(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "지하수위·간극수압 계측도", (W // 2, 48), font_title)
    draw_label(
        draw,
        "Groundwater & pore pressure — observation well vs sealed piezometer (IMG-002 ②③)",
        (W // 2, 88),
        load_font(18),
        fill=C["gray"],
    )

    ground_y = 700
    rock_y = 880
    wall_x0, wall_x1 = 140, 168
    back_r = 1000

    _soil_layers(draw, 80, 380, back_r, 960, rock_y)
    draw.line([(80, ground_y), (back_r, ground_y)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "GL", (64, ground_y - 8), load_font(14), fill=C["gray"], anchor="rm")

    # Retaining wall — reference only (no sensors on wall)
    draw.rectangle([wall_x0, 420, wall_x1, ground_y], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)
    draw_label(draw, "흙막이 벽체", (wall_x1 + 8, 440), load_font(14, bold=True))
    draw_label(draw, "(참고·부착 금지)", (wall_x1 + 8, 462), load_font(12), fill=C["orange"])

    # Excavation cavity hint (right)
    exc_x = 1080
    draw.polygon(
        [(exc_x, ground_y), (exc_x, 960), (1320, 960), (1320, ground_y + 60), (exc_x, ground_y)],
        fill=_hex("#F3F4F6"),
        outline=_hex(C["navy"]),
        width=2,
    )
    draw.line([(exc_x, ground_y), (1320, ground_y + 60)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "굴착측", (1200, 780), load_font(15), fill=C["gray"])
    draw_label(draw, "굴착 깊이", (exc_x + 20, ground_y + 80), load_font(13), fill=C["orange"])

    gwl_y = 580
    _gwl_dashed(draw, 200, back_r - 20, gwl_y)
    draw_label(draw, "지하수위선", (back_r + 8, gwl_y - 28), load_font(13), fill=C["teal"])

    # Excavation influence depth
    infl_y = 780
    x = 200
    while x < back_r - 20:
        draw.line([(x, infl_y), (min(x + 10, back_r - 20), infl_y)], fill=_hex(C["orange"]), width=1)
        x += 20
    draw_label(draw, "굴착영향선", (back_r - 40, infl_y + 20), load_font(13), fill=C["orange"])

    # ① Observation well — open G.W.L (distinct from piezo)
    wx = 420
    draw.line([(wx, 400), (wx, 820)], fill=_hex(C["gray"]), width=4)
    draw.rounded_rectangle([wx - 22, 388, wx + 22, 408], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "well cap", (wx, 376), load_font(11), fill=C["gray"])
    draw.rectangle([wx - 14, gwl_y, wx + 14, 800], fill=_hex("#93C5FD"), outline=_hex(C["teal"]), width=1)
    draw.polygon([(wx - 8, gwl_y + 4), (wx + 8, gwl_y + 4), (wx, gwl_y + 16)], fill=_hex(C["teal"]))
    draw_label(draw, "① 지하수위계", (wx + 28, 420), load_font(14, bold=True), fill=C["teal"])
    draw_label(draw, "(관측공·개방 수면)", (wx + 28, 442), load_font(12), fill=C["gray"])

    # ② Piezometer — sealed filter at target depth (≠ standpipe)
    px = 640
    tip_y = infl_y - 20
    draw.line([(px, 400), (px, tip_y + 30)], fill=_hex(C["navy"]), width=3)
    draw.rectangle([px - 14, 400, px + 14, tip_y - 50], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)
    draw.rectangle([px - 18, tip_y - 36, px + 18, tip_y + 36], fill=_hex(SOIL2), outline=_hex(C["teal"]), width=2)
    draw.ellipse([px - 10, tip_y - 6, px + 10, tip_y + 14], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "② 간극수압계", (px + 28, tip_y - 40), load_font(14, bold=True), fill=C["navy"])
    draw_label(draw, "(밀폐·필터·차수)", (px + 28, tip_y - 18), load_font(12), fill=C["gray"])

    draw_label(draw, "배면 지반", (300, ground_y - 40), load_font(16, bold=True), fill=C["navy"])

    # Surface junction + logger (AUTO-01)
    jx, jy = 780, 400
    draw.rounded_rectangle([jx, jy, jx + 48, jy + 36], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "접속함", (jx + 24, jy - 14), load_font(12))
    draw.line([(wx + 16, 400), (jx, jy + 18)], fill=_hex(C["gray"]), width=2)
    draw.line([(px + 16, 400), (jx + 24, jy + 36)], fill=_hex(C["gray"]), width=2)
    draw_logger_block_icon(draw, jx + 70, jy - 10, 110, 64, title="로거", font=load_font(12, bold=True))

    # Right — ②③ contrast panel (EXC-03 E2)
    rx = 1360
    draw.rounded_rectangle([rx, 160, 1860, 900], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "②③ 이형 (IMG-002 연계)", (1610, 200), load_font(20, bold=True))

    cy = 300
    draw.rounded_rectangle([rx + 30, cy, rx + 420, cy + 200], outline=_hex(C["teal"]), width=2)
    draw_label(draw, "① 지하수위계", (rx + 225, cy + 24), load_font(16, bold=True), fill=C["teal"])
    draw.rectangle([rx + 190, cy + 56, rx + 260, cy + 170], fill=_hex("#93C5FD"), outline=_hex(C["navy"]))
    draw_label(draw, "관측공·개방 수면", (rx + 225, cy + 182), load_font(13), fill=C["gray"])

    draw.rounded_rectangle([rx + 450, cy, rx + 840, cy + 200], outline=_hex(C["gray"]), width=2)
    draw_label(draw, "② 간극수압계", (rx + 645, cy + 24), load_font(16, bold=True))
    draw.line([(rx + 645, cy + 56), (rx + 645, cy + 150)], fill=_hex(C["navy"]), width=4)
    draw.rectangle([rx + 633, cy + 100, rx + 657, cy + 140], fill=_hex(SOIL1), outline=_hex(C["teal"]), width=2)
    draw.ellipse([rx + 633, cy + 130, rx + 657, cy + 154], fill=_hex(C["teal"]), outline=_hex(C["navy"]))

    draw_label(draw, "동일 관 형태 금지", (1610, cy + 230), load_font(16), fill=C["orange"])

    bullets = [
        "G.W.L 점선 — 공통 참조",
        "수위계 = 개방 관측공",
        "수압계 = 밀폐·필터·목적 심도",
        "벽체 부착·굴착저만 설치 금지",
    ]
    y = 560
    for line in bullets:
        draw.ellipse([rx + 24, y - 6, rx + 36, y + 6], fill=_hex(C["teal"]))
        draw_label(draw, line, (rx + 48, y), load_font(16), anchor="lm")
        y += 48

    draw_arrow(draw, wx + 40, gwl_y + 30, px - 40, tip_y, color=C["gray"], width=2)
    draw_label(draw, "≠", ((wx + px) // 2, (gwl_y + tip_y) // 2), load_font(18, bold=True), fill=C["orange"])
