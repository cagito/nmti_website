"""Shared bridge structure drawing helpers — BRI-01·02·03 (INSTRUMENTATION §3.23)."""
from __future__ import annotations

import math

from PIL import ImageDraw

from lib.datalogger_draw import C, W, _hex, draw_arrow, draw_label, load_font

SOIL = "#E8D4B8"
SOIL2 = "#C4A574"
WATER = "#BEE3F8"


def draw_ground_line(draw: ImageDraw.ImageDraw, x0: int, x1: int, y: int) -> None:
    draw.line([(x0, y), (x1, y)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "지표면", (x1 - 40, y - 18), load_font(13), fill=C["gray"], anchor="rm")


def draw_tiltmeter_bracket(
    draw: ImageDraw.ImageDraw,
    wall_x: int,
    cy: int,
    *,
    side: str = "right",
    label: str = "구조물경사계",
) -> None:
    """Surface-mounted tiltmeter with anchor bracket (NOT inclinometer)."""
    bracket_w = 36 if side == "right" else -36
    bx = wall_x + (4 if side == "right" else -4)
    draw.polygon(
        [(bx, cy - 22), (bx + bracket_w, cy), (bx, cy + 22)],
        fill=_hex(C["gray"]),
        outline=_hex(C["navy"]),
    )
    tx0 = bx + (6 if side == "right" else -42)
    draw.rounded_rectangle(
        [tx0, cy - 18, tx0 + 36, cy + 18],
        fill=_hex(C["teal"]),
        outline=_hex(C["navy"]),
        width=2,
    )
    ox = tx0 + 18
    draw.line([(ox, cy), (ox + (40 if side == "right" else -40), cy)], fill=_hex(C["navy"]), width=2)
    draw.line([(ox, cy), (ox, cy - 40)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "θ", (ox + (48 if side == "right" else -48), cy + 4), load_font(14, bold=True), fill=C["teal"])
    lx = wall_x + (70 if side == "right" else -70)
    draw_label(draw, label, (lx, cy - 36), load_font(14, bold=True), fill=C["teal"], anchor="mm")


def draw_acc_node(draw: ImageDraw.ImageDraw, cx: int, cy: int, *, r: int = 14) -> None:
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "ACC", (cx, cy), load_font(10, bold=True))


def draw_prism(draw: ImageDraw.ImageDraw, cx: int, cy: int) -> None:
    draw.polygon(
        [(cx, cy - 12), (cx + 10, cy + 8), (cx - 10, cy + 8)],
        fill=_hex(C["orange"]),
        outline=_hex(C["navy"]),
        width=2,
    )
    draw_label(draw, "프리즘", (cx, cy + 24), load_font(12), fill=C["orange"])


def draw_total_station(draw: ImageDraw.ImageDraw, cx: int, ground_y: int) -> None:
    ty = ground_y - 8
    draw.line([(cx, ty), (cx, ty + 48)], fill=_hex(C["navy"]), width=3)
    draw.polygon([(cx - 22, ty + 48), (cx + 22, ty + 48), (cx, ty + 66)], fill=_hex(C["gray"]), outline=_hex(C["navy"]))
    draw.rounded_rectangle([cx - 24, ty - 32, cx + 24, ty + 4], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "자동광파기", (cx, ty - 44), load_font(13, bold=True))


def draw_bridge_span(
    draw: ImageDraw.ImageDraw,
    x0: int,
    x1: int,
    deck_y: int,
    ground_y: int,
    *,
    pier_xs: list[int] | None = None,
    show_bearings: bool = True,
    water_y: int | None = None,
) -> None:
    """Side-view bridge: deck, girders, piers, optional water."""
    pier_xs = pier_xs or []
    if water_y is not None:
        draw.rectangle([x0, water_y, x1, ground_y + 40], fill=_hex(WATER))
        draw.line([(x0, water_y), (x1, water_y)], fill=_hex(C["teal"]), width=2)
        draw_label(draw, "하천수위", (x0 + 60, water_y - 16), load_font(13), fill=C["teal"])

    draw.rectangle([x0 - 30, ground_y, x1 + 30, ground_y + 80], fill=_hex(SOIL))
    for yy in range(ground_y + 8, ground_y + 72, 12):
        draw.line([(x0, yy), (x1, yy)], fill=_hex(SOIL2), width=1)
    draw_ground_line(draw, x0 - 30, x1 + 30, ground_y)

    # Abutment ends
    for ax in (x0 - 20, x1 + 20):
        draw.rectangle([ax - 18, deck_y + 20, ax + 18, ground_y], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)

    # Deck slab
    draw.rectangle([x0, deck_y, x1, deck_y + 28], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=3)
    # Girders
    for gx in range(x0 + 40, x1, 80):
        draw.rectangle([gx, deck_y + 28, gx + 24, deck_y + 56], fill=_hex("#9CA3AF"), outline=_hex(C["navy"]), width=1)

    for px in pier_xs:
        draw.rectangle([px - 16, deck_y + 56, px + 16, ground_y], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
        draw_label(draw, "교각", (px, ground_y + 22), load_font(14))

    if show_bearings:
        for bx in [x0 + 30] + pier_xs + [x1 - 30]:
            draw.rectangle([bx - 10, deck_y + 54, bx + 10, deck_y + 68], fill=_hex(C["orange"]), outline=_hex(C["navy"]), width=1)
            draw_label(draw, "받침", (bx, deck_y + 82), load_font(11), fill=C["gray"])


def draw_expansion_joint(draw: ImageDraw.ImageDraw, x: int, deck_y: int) -> None:
    draw.line([(x, deck_y - 4), (x, deck_y + 32)], fill=_hex(C["navy"]), width=3)
    draw.rounded_rectangle([x - 28, deck_y - 18, x + 28, deck_y + 10], outline=_hex(C["teal"]), width=2)
    draw_label(draw, "신축이음", (x, deck_y - 28), load_font(14, bold=True), fill=C["teal"])


def draw_info_panel(
    draw: ImageDraw.ImageDraw,
    x0: int,
    y0: int,
    x1: int,
    y1: int,
    title: str,
    bullets: list[str],
) -> None:
    draw.rounded_rectangle([x0, y0, x1, y1], outline=_hex(C["navy"]), width=2)
    draw_label(draw, title, ((x0 + x1) // 2, y0 + 40), load_font(22, bold=True))
    for i, t in enumerate(bullets):
        draw_label(draw, f"• {t}", (x0 + 32, y0 + 100 + i * 44), load_font(18), anchor="lm")


def draw_seismic_wave(draw: ImageDraw.ImageDraw, x0: int, x1: int, y: int) -> None:
    pts = [(x, y + int(18 * math.sin(x / 18))) for x in range(x0, x1, 6)]
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i + 1]], fill=_hex(C["orange"]), width=2)
    draw_label(draw, "지반 운동", ((x0 + x1) // 2, y + 36), load_font(16), fill=C["orange"])
