"""IMG-006 v3 — excavation phase monitoring flow (docs/58 · 114 ANC-7시)."""
from __future__ import annotations

import math

from PIL import ImageDraw

from lib.datalogger_draw import C, _hex, draw_arrow, draw_label, draw_title, load_font, new_canvas

SOIL = "#E8D4B8"
SOIL2 = "#C4A574"


def _draw_ipi(draw: ImageDraw.ImageDraw, x: int, gl: int, base_y: int) -> None:
    draw.line([(x, gl), (x, base_y)], fill=_hex(C["navy"]), width=3)
    for ny in range(gl + 24, base_y - 8, 22):
        draw.ellipse([x - 5, ny - 4, x + 5, ny + 4], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
    draw.rectangle([x - 8, gl - 6, x + 8, gl + 4], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "IPI", (x + 14, gl + 20), load_font(9, bold=True), fill=C["teal"])


def _draw_well(draw: ImageDraw.ImageDraw, x: int, gl: int, bottom: int) -> None:
    draw.line([(x, gl), (x, bottom)], fill=_hex(C["gray"]), width=2)
    draw.rectangle([x - 7, gl - 5, x + 7, gl + 3], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "G.W.L", (x + 12, gl - 2), load_font(8), fill=C["teal"])


def _draw_anchor_7h(
    draw: ImageDraw.ImageDraw,
    wall_x: int,
    head_y: int,
    bond_x: int,
    bond_y: int,
    *,
    scale: float = 1.0,
) -> None:
    """7 o'clock anchor axis — LC collinear with tendon (docs/58 §3)."""
    ax0, ay0 = wall_x, head_y
    ax1, ay1 = bond_x, bond_y
    draw.line([(ax0, ay0), (ax1, ay1)], fill=_hex(C["navy"]), width=int(3 * scale))

    ang = math.atan2(ay1 - ay0, ax1 - ax0)
    perp = ang + math.pi / 2
    cx, cy = ax0 + 8 * math.cos(ang), ay0 + 8 * math.sin(ang)

    # Bearing plate (perpendicular to axis)
    pw, ph = int(14 * scale), int(6 * scale)
    pts = []
    for dx, dy in [(-pw, -ph), (pw, -ph), (pw, ph), (-pw, ph)]:
        rx = cx + dx * math.cos(perp) - dy * math.cos(ang)
        ry = cy + dx * math.sin(perp) - dy * math.sin(ang)
        pts.append((int(rx), int(ry)))
    draw.polygon(pts, fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=1)

    # Load cell on axis
    lc_x = cx + 22 * math.cos(ang)
    lc_y = cy + 22 * math.sin(ang)
    lw, lh = int(16 * scale), int(8 * scale)
    lc_pts = []
    for dx, dy in [(-lw, -lh), (lw, -lh), (lw, lh), (-lw, lh)]:
        rx = lc_x + dx * math.cos(ang) - dy * math.cos(perp)
        ry = lc_y + dx * math.sin(ang) - dy * math.sin(perp)
        lc_pts.append((int(rx), int(ry)))
    draw.polygon(lc_pts, fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)

    draw_label(draw, "어스앵커 LC", (int(lc_x + 18 * math.cos(perp)), int(lc_y + 18 * math.sin(perp))), load_font(8, bold=True), fill=C["teal"])


def _draw_stage_panel(
    draw: ImageDraw.ImageDraw,
    x0: int,
    y0: int,
    x1: int,
    y1: int,
    *,
    stage_label: str,
    bottom_label: str,
    excav_depth: float,
    with_anchor: bool,
) -> None:
    draw.rounded_rectangle([x0, y0, x1, y1], outline=_hex(C["navy"]), width=2)
    draw_label(draw, stage_label, (x0 + 12, y0 + 14), load_font(12, bold=True), anchor="lm")

    gl = y0 + 36
    panel_h = y1 - y0 - 44
    by = y0 + 36 + int(panel_h * excav_depth)

    back_l, wall_x, exc_r = x0 + 28, x0 + 118, x1 - 28

    draw.rectangle([back_l, gl, wall_x, y1 - 12], fill=_hex(SOIL))
    for yy in range(gl + 6, y1 - 12, 10):
        draw.line([(back_l, yy), (wall_x, yy)], fill=_hex(SOIL2), width=1)
    draw.line([(back_l, gl), (exc_r, gl)], fill=_hex(C["navy"]), width=2)
    draw.rectangle([wall_x, gl - 8, wall_x + 10, y1 - 12], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)

    exc_poly = [(wall_x + 10, gl), (exc_r, gl), (exc_r, y1 - 12), (wall_x + 18, y1 - 12), (wall_x + 10, by)]
    draw.polygon(exc_poly, fill=_hex(C["white"]), outline=_hex(C["navy"]), width=1)
    draw.line([(wall_x + 18, by), (exc_r - 8, by)], fill=_hex(C["orange"]), width=2)
    draw_label(draw, bottom_label, (exc_r - 10, by + 4), load_font(9), fill=C["orange"], anchor="rm")

    _draw_ipi(draw, back_l + 22, gl, y1 - 20)
    _draw_well(draw, back_l + 52, gl, y1 - 20)

    if with_anchor:
        head_y = gl + int((by - gl) * 0.45)
        _draw_anchor_7h(draw, wall_x + 10, head_y, back_l + 18, by - 8, scale=0.85)

    draw_label(draw, "배면", (back_l + 30, y1 - 8), load_font(8), fill=C["gray"])
    draw_label(draw, "굴착측", (exc_r - 36, gl + 10), load_font(8), fill=C["gray"])


def _draw_operation_loop(draw: ImageDraw.ImageDraw) -> None:
    x0, y0, x1, y1 = 1080, 140, 1860, 520
    draw.rounded_rectangle([x0, y0, x1, y1], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "계측 운영 루프", ((x0 + x1) // 2, y0 + 28), load_font(16, bold=True))
    steps = ["굴착", "계측", "데이터 수집", "관리기준 비교", "경보 판정", "다음 단계 굴착"]
    cy = y0 + 100
    gap = (x1 - x0 - 80) // (len(steps) + 1)
    for i, text in enumerate(steps):
        cx = x0 + 40 + gap * (i + 1)
        draw.rounded_rectangle([cx - 56, cy - 22, cx + 56, cy + 22], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)
        draw_label(draw, text, (cx, cy), load_font(11, bold=True))
        if i < len(steps) - 1:
            nx = x0 + 40 + gap * (i + 2)
            draw_arrow(draw, cx + 58, cy, nx - 58, cy, color=C["teal"], width=2)


def _draw_legend(draw: ImageDraw.ImageDraw) -> None:
    items = [
        "지중경사계",
        "지하수위계",
        "어스앵커 하중계",
        "굴착저면",
        "어스앵커 축선(7시)",
    ]
    x = 100
    for i, lab in enumerate(items):
        draw.rounded_rectangle([x, 900, x + 14, 914], fill=_hex(C["teal"] if "앵커" in lab else C["light"]), outline=_hex(C["navy"]), width=1)
        draw_label(draw, lab, (x + 20, 907), load_font(11), anchor="lm")
        x += 160


def render_img006() -> object:
    """굴착 단계별 계측 흐름도 v3 — fields/retaining-excavation installation."""
    img, draw = new_canvas()
    draw_title(draw, "굴착 단계별 계측 흐름도", "4단계 굴착저면 · IPI·G.W.L · 어스앵커 LC(3·4단계)")

    panels = [
        (60, 120, 520, 280, "① 1단계", "굴착저면(1단계)", 0.28, False),
        (540, 120, 1000, 280, "② 2단계", "굴착저면(2단계)", 0.48, False),
        (60, 300, 520, 460, "③ 3단계", "굴착저면(3단계)", 0.68, True),
        (540, 300, 1000, 460, "④ 최종", "최종 굴착저면", 0.88, True),
    ]
    for x0, y0, x1, y1, stage_label, bottom_label, excav_depth, with_anchor in panels:
        _draw_stage_panel(
            draw,
            x0,
            y0,
            x1,
            y1,
            stage_label=stage_label,
            bottom_label=bottom_label,
            excav_depth=excav_depth,
            with_anchor=with_anchor,
        )

    _draw_operation_loop(draw)
    _draw_legend(draw)

    draw_label(
        draw,
        "좌→우: 배면 지반 | 흙막이 벽체 | 굴착측  ·  어스앵커 = 7시(1~7시) 관통 · 버팀보 LC 없음",
        (960, 960),
        load_font(12),
        fill=C["gray"],
    )
    return img
