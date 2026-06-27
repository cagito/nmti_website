"""Shared earth-anchor head assembly (IMG-004 · IMG-002 inset).

Assembly order (INSTRUMENTATION §3.2):
  wall → bearing plate → lower plate → load cell → upper plate → anchor head → wedge → tendon
"""
from __future__ import annotations

from PIL import ImageDraw

from .datalogger_draw import C, _hex, draw_arrow, draw_label, load_font


def draw_anchor_head_assembly(
    draw: ImageDraw.ImageDraw,
    wall_x: int,
    cy: int,
    *,
    scale: float = 1.0,
    show_labels: bool = True,
    show_forces: bool = True,
    compact: bool = False,
) -> None:
    """Draw anchor head on excavation side of wall. Tendon extends left into backfill."""
    s = scale
    f11 = load_font(11)
    f12 = load_font(12)
    f13 = load_font(13)

    # Wall segment
    wh = int(36 * s)
    draw.rectangle([wall_x - int(14 * s), cy - wh, wall_x, cy + wh], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    if show_labels and not compact:
        draw_label(draw, "벽체·띠장", (wall_x - int(7 * s), cy - wh - 14), f11, fill=C["gray"])

    x = wall_x
    parts: list[tuple[int, int, str, str]] = []

    # Bearing plate (wedge bracket)
    bw, bh = int(22 * s), int(28 * s)
    draw.polygon(
        [(x, cy - bh), (x + bw, cy - bh // 2), (x + bw, cy + bh // 2), (x, cy + bh)],
        fill=_hex(C["gray"]),
        outline=_hex(C["navy"]),
        width=2,
    )
    parts.append((x + bw // 2, cy - bh - 8, "지지링·반력판", "BEARING PLATE"))
    x += bw

    # Lower plate
    lp_w = int(10 * s)
    draw.rectangle([x, cy - int(16 * s), x + lp_w, cy + int(16 * s)], fill=_hex(C["panel"]), outline=_hex(C["navy"]), width=1)
    parts.append((x + lp_w // 2, cy + int(22 * s), "하부 플레이트", ""))
    x += lp_w

    # Load cell (cylinder)
    lc_w = int(28 * s)
    draw.rounded_rectangle(
        [x, cy - int(18 * s), x + lc_w, cy + int(18 * s)],
        radius=int(4 * s),
        fill=_hex(C["teal"]),
        outline=_hex(C["navy"]),
        width=2,
    )
    draw.line([(x + lc_w // 2, cy - int(10 * s)), (x + lc_w // 2, cy + int(10 * s))], fill=_hex(C["white"]), width=2)
    parts.append((x + lc_w // 2, cy - int(28 * s), "하중계 (LC)", "LOAD CELL"))
    x += lc_w

    # Upper plate
    draw.rectangle([x, cy - int(16 * s), x + lp_w, cy + int(16 * s)], fill=_hex(C["panel"]), outline=_hex(C["navy"]), width=1)
    parts.append((x + lp_w // 2, cy + int(22 * s), "상부 플레이트", ""))
    x += lp_w

    # Anchor head
    ah_w = int(18 * s)
    draw.rounded_rectangle([x, cy - int(14 * s), x + ah_w, cy + int(14 * s)], radius=2, fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    parts.append((x + ah_w // 2, cy - int(24 * s), "앵커헤드", "ANCHOR HEAD"))
    x += ah_w

    # Wedge
    wd = int(12 * s)
    draw.polygon([(x, cy - int(8 * s)), (x + wd, cy), (x, cy + int(8 * s))], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=1)
    parts.append((x + wd // 2, cy + int(18 * s), "웨지", ""))
    x += wd

    # Tendon through center + into backfill
    tend_x0 = x
    tend_back = wall_x - int(120 * s)
    draw.line([(tend_x0, cy), (tend_back, cy + int(30 * s))], fill=_hex(C["navy"]), width=int(3 * s))
    if show_labels:
        draw_label(draw, "강연선 (PC WIRE)", (tend_x0 + int(40 * s), cy - int(18 * s)), f11, fill=C["navy"])

    # Read cable from load cell bottom
    lc_mid = wall_x + bw + lp_w + lc_w // 2
    draw.line([(lc_mid, cy + int(18 * s)), (lc_mid, cy + int(48 * s))], fill=_hex(C["gray"]), width=2)
    draw_label(draw, "READ CABLE", (lc_mid + int(8 * s), cy + int(34 * s)), f11, fill=C["gray"], anchor="lm")

    if show_labels:
        for px, py, ko, en in parts:
            draw_label(draw, ko, (px, py), f12 if not compact else f11, fill=C["navy"])
            if en and not compact:
                draw_label(draw, en, (px, py + 14), f11, fill=C["gray"])

    if show_forces:
        # T — tension along tendon toward backfill
        draw_arrow(draw, tend_x0 - int(20 * s), cy + int(8 * s), tend_back + int(20 * s), cy + int(26 * s), color=C["teal"], width=2)
        draw_label(draw, "인장력 T", (tend_back + int(50 * s), cy + int(10 * s)), f13, fill=C["teal"])
        # P — compression at bearing plate (wallward)
        draw_arrow(draw, wall_x + bw + int(4 * s), cy, wall_x - int(4 * s), cy, color=C["orange"], width=2)
        draw_label(draw, "압축 P", (wall_x - int(28 * s), cy - int(16 * s)), f12, fill=C["orange"])
