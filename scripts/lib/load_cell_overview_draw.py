"""Load cell overview (IMG-035) — strut axial vs anchor LC (STR-01).

INSTRUMENTATION §3.2 · §3.7 — strut compression at waler junction; anchor LC on excavation head.
"""
from __future__ import annotations

from PIL import ImageDraw, ImageFont

from .anchor_head_draw import draw_anchor_head_assembly
from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, draw_logger_block_icon, load_font

SOIL1 = "#E8D4B8"
SOIL2 = "#C4A574"


def _soil_block(draw: ImageDraw.ImageDraw, x0: int, y0: int, x1: int, y1: int) -> None:
    draw.rectangle([x0, y0, x1, y1], fill=_hex(SOIL1))
    for yy in range(y0 + 6, y1, 14):
        draw.line([(x0 + 4, yy), (x1 - 4, yy)], fill=_hex(SOIL2), width=1)


def render_img035(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "하중계 설치 개념도", (W // 2, 48), font_title)
    draw_label(
        draw,
        "Strut axial compression · anchor load cell — distinct roles (STR-01)",
        (W // 2, 88),
        load_font(18),
        fill=C["gray"],
    )

    # ── Panel ① Strut load cell ──
    p1x, p1y, p1w, p1h = 60, 140, 880, 780
    draw.rounded_rectangle([p1x, p1y, p1x + p1w, p1y + p1h], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "① 버팀보 하중계 — 띠장·버팀보 접합부", (p1x + p1w // 2, p1y + 28), load_font(20, bold=True))

    ground = 720
    wall_x0, wall_x1 = 180, 208
    exc_r = 760
    _soil_block(draw, p1x + 20, ground - 40, wall_x0, ground + 80)
    draw.polygon(
        [(wall_x1, ground - 40), (exc_r, ground - 40), (exc_r, ground + 80), (wall_x1 + 20, ground + 80), (wall_x1, ground)],
        fill=_hex(C["white"]),
        outline=_hex(C["navy"]),
        width=2,
    )
    draw.rectangle([wall_x0, ground - 280, wall_x1, ground + 80], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)
    draw.rectangle([wall_x1, ground - 130, wall_x1 + 24, ground - 70], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "띠장", (wall_x1 + 38, ground - 108), load_font(13))

    strut_y = ground - 90
    strut_end = exc_r - 60
    draw.rectangle([wall_x1 + 24, strut_y - 10, strut_end, strut_y + 10], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "버팀보", (strut_end - 80, strut_y - 28), load_font(14))

    # LC at waler-strut junction (NOT center)
    lc_x = wall_x1 + 24
    draw.rounded_rectangle([lc_x - 10, strut_y - 22, lc_x + 24, strut_y + 22], radius=3, fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw.line([(lc_x + 7, strut_y - 12), (lc_x + 7, strut_y + 12)], fill=_hex(C["white"]), width=2)
    draw_label(draw, "하중계", (lc_x + 7, strut_y - 38), load_font(13, bold=True), fill=C["teal"])

    # Axial compression arrows along strut axis
    draw_arrow(draw, strut_end - 40, strut_y, lc_x + 30, strut_y, color=C["teal"], width=4)
    draw_arrow(draw, lc_x + 30, strut_y, wall_x0 + 20, strut_y, color=C["teal"], width=4)
    draw_label(draw, "축압축력 P (버팀보 축방향)", (p1x + p1w // 2, strut_y + 44), load_font(15, bold=True), fill=C["teal"])

    draw_label(draw, "금지: 버팀보 정중앙·옆면 장식", (p1x + p1w // 2, strut_y + 76), load_font(14), fill=C["orange"])
    draw_label(draw, "→ IMG-003 상세", (p1x + p1w - 24, p1y + p1h - 20), load_font(12), fill=C["gray"], anchor="rm")

    draw_logger_block_icon(draw, p1x + 620, p1y + 120, 110, 64, title="로거", font=load_font(12, bold=True))
    draw.line([(lc_x + 24, strut_y - 10), (p1x + 620, p1y + 150)], fill=_hex(C["gray"]), width=2)

    # ── Panel ② Anchor load cell ──
    p2x = 980
    draw.rounded_rectangle([p2x, p1y, p2x + p1w, p1y + p1h], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "② 어스앵커 하중계 — 굴착측 노출 두부", (p2x + p1w // 2, p1y + 28), load_font(20, bold=True))

    g2 = 720
    w2x0, w2x1 = p2x + 120, p2x + 148
    _soil_block(draw, p2x + 20, g2 - 40, w2x0, g2 + 80)
    draw.polygon(
        [(w2x1, g2 - 40), (p2x + p1w - 40, g2 - 40), (p2x + p1w - 40, g2 + 80), (w2x1 + 20, g2 + 80), (w2x1, g2)],
        fill=_hex(C["white"]),
        outline=_hex(C["navy"]),
        width=2,
    )
    draw.rectangle([w2x0, g2 - 260, w2x1, g2 + 80], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)

    ah_y = g2 - 180
    draw_anchor_head_assembly(draw, w2x1, ah_y, scale=1.0, show_labels=True, show_forces=True, compact=False)

    # Tendon into backfill
    draw.line([(w2x1 + 120, ah_y), (w2x0 - 40, ah_y + 30), (p2x + 60, ah_y + 55)], fill=_hex(C["navy"]), width=3)
    draw_label(draw, "강연선 → 배면", (p2x + 200, ah_y + 70), load_font(13), fill=C["gray"])
    draw_label(draw, "인장력 T", (w2x1 + 180, ah_y - 40), load_font(14, bold=True), fill=C["teal"])

    draw_label(draw, "압축 P = 반력 (지지링·반력판)", (p2x + p1w // 2, ah_y + 100), load_font(14), fill=C["navy"])
    draw_label(draw, "금지: 정착장·지중 내부 설치", (p2x + p1w // 2, ah_y + 130), load_font(14), fill=C["orange"])
    draw_label(draw, "→ IMG-004 상세", (p2x + p1w - 24, p1y + p1h - 20), load_font(12), fill=C["gray"], anchor="rm")

    # Bottom comparison strip
    draw.rounded_rectangle([60, 940, 1860, 1020], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)
    draw_label(
        draw,
        "STR-01: 버팀보 LC = 축압축 · 앵커 LC = 굴착측 두부 인장·압축 평형 — 혼동 금지",
        (W // 2, 980),
        load_font(16, bold=True),
        fill=C["navy"],
    )
