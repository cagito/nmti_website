"""Field power system drawing helpers (Pillow). See docs/IMG-047_POWER_SYSTEM_PLAN.md."""
from __future__ import annotations

import math

from PIL import ImageDraw, ImageFont

from lib.datalogger_draw import C, _hex, draw_arrow, draw_cr1000x_front, draw_label, load_font


def draw_solar_array(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    *,
    cols: int = 2,
    rows: int = 2,
    module_w: int = 90,
    module_h: int = 55,
    gap: int = 6,
    tilt_deg: float = 25.0,
) -> tuple[int, int, int, int]:
    """PV modules on aluminum rack. Returns bounding box (x0,y0,x1,y1)."""
    rad = math.radians(tilt_deg)
    dx = int(module_h * math.sin(rad) * 0.35)
    dy = int(module_h * math.cos(rad) * 0.15)

    total_w = cols * module_w + (cols - 1) * gap
    total_h = rows * module_h + (rows - 1) * gap + dy + 20

    # Rack legs
    rack_y = y + total_h - 12
    draw.line([(x, rack_y), (x + total_w + 20, rack_y)], fill=_hex(C["navy"]), width=3)
    draw.line([(x + 8, rack_y), (x + 8, rack_y + 28)], fill=_hex(C["gray"]), width=2)
    draw.line([(x + total_w + 12, rack_y), (x + total_w + 12, rack_y + 28)], fill=_hex(C["gray"]), width=2)

    for row in range(rows):
        for col in range(cols):
            mx = x + col * (module_w + gap) + row * dx // 2
            my = y + row * (module_h + gap) - row * dy // 3
            pts = [
                (mx, my + dy),
                (mx + module_w, my + dy),
                (mx + module_w - dx, my + module_h + dy),
                (mx - dx, my + module_h + dy),
            ]
            draw.polygon(pts, fill=_hex("#1E3A5F"), outline=_hex(C["navy"]), width=2)
            # cell grid
            for i in range(1, 4):
                lx = mx + i * module_w // 4
                draw.line([(lx, my + dy), (lx - dx // 4, my + module_h + dy)], fill=_hex(C["teal"]), width=1)

    draw_label(draw, "태양광 패널", (x + total_w // 2, y + total_h + 24), load_font(20, bold=True))
    draw_label(draw, "PV 케이블", (x + total_w + 36, y + total_h // 2), load_font(15), fill=C["gray"])
    return x, y, x + total_w + 40, y + total_h + 40


def draw_charge_controller(draw: ImageDraw.ImageDraw, x: int, y: int, w: int = 160, h: int = 110) -> None:
    draw.rounded_rectangle([x, y, x + w, y + h], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "충전제어기", (x + w // 2, y + 22), load_font(17, bold=True))
    draw_label(draw, "MPPT / PWM", (x + w // 2, y + 48), load_font(14), fill=C["gray"])
    for i, term in enumerate(["PV", "BAT", "LOAD"]):
        tx = x + 28 + i * 48
        ty = y + h - 28
        draw.rectangle([tx - 14, ty - 10, tx + 14, ty + 10], outline=_hex(C["navy"]), width=1)
        draw_label(draw, term, (tx, ty + 22), load_font(12))


def draw_battery_12v(draw: ImageDraw.ImageDraw, x: int, y: int, w: int = 120, h: int = 100) -> None:
    draw.rounded_rectangle([x, y, x + w, y + h], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw.rectangle([x + w - 18, y + 20, x + w - 6, y + 36], fill=_hex(C["navy"]))
    draw_label(draw, "배터리", (x + w // 2 - 8, y + 38), load_font(18, bold=True))
    draw_label(draw, "12V DC", (x + w // 2 - 8, y + 64), load_font(15), fill=C["green"])
    draw_label(draw, "+", (x + 18, y + 82), load_font(16, bold=True), fill=C["red"])
    draw_label(draw, "−", (x + w - 24, y + 82), load_font(16, bold=True), fill=C["navy"])


def draw_fuse_dc(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    draw.rounded_rectangle([x, y, x + 70, y + 44], fill=_hex(C["white"]), outline=_hex(C["orange"]), width=2)
    draw_label(draw, "퓨즈", (x + 35, y + 14), load_font(14, bold=True))
    draw_label(draw, "DC", (x + 35, y + 32), load_font(12), fill=C["gray"])


def draw_load_block(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    w: int,
    h: int,
    title: str,
    items: list[str],
    *,
    font_title: ImageFont.ImageFont | None = None,
) -> None:
    ft = font_title or load_font(18, bold=True)
    draw.rounded_rectangle([x, y, x + w, y + h], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, title, (x + w // 2, y + 24), ft)
    fy = y + 52
    for line in items:
        draw_label(draw, f"• {line}", (x + 14, fy), load_font(16), anchor="lm")
        fy += 30


def draw_ac_panel(draw: ImageDraw.ImageDraw, x: int, y: int, w: int = 200, h: int = 140) -> None:
    draw.rounded_rectangle([x, y, x + w, y + h], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "배전반", (x + w // 2, y + 24), load_font(18, bold=True))
    draw_label(draw, "220V AC", (x + w // 2, y + 52), load_font(16), fill=C["orange"])
    for i in range(3):
        draw.rectangle([x + 24 + i * 52, y + 72, x + 56 + i * 52, y + 110], outline=_hex(C["navy"]), width=2)
        draw_label(draw, "차단", (x + 40 + i * 52, y + 124), load_font(11))


def draw_avr_unit(draw: ImageDraw.ImageDraw, x: int, y: int, w: int = 180, h: int = 120) -> None:
    draw.rounded_rectangle([x, y, x + w, y + h], fill=_hex(C["enc"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "AVR", (x + w // 2, y + 28), load_font(22, bold=True))
    draw_label(draw, "자동전압조정기", (x + w // 2, y + 56), load_font(15))
    draw_label(draw, "220V ±3%", (x + w // 2, y + 84), load_font(14), fill=C["green"])


def draw_wind_turbine(draw: ImageDraw.ImageDraw, cx: int, cy: int, scale: float = 1.0) -> None:
    """Simple HAWT silhouette."""
    r = int(18 * scale)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    for ang in (90, 210, 330):
        rad = math.radians(ang)
        x2 = cx + int(55 * scale * math.cos(rad))
        y2 = cy - int(55 * scale * math.sin(rad))
        draw.line([(cx, cy), (x2, y2)], fill=_hex(C["navy"]), width=int(4 * scale))
    draw.rectangle(
        [cx - int(6 * scale), cy + r, cx + int(6 * scale), cy + r + int(70 * scale)],
        fill=_hex(C["gray"]),
    )
    draw_label(draw, "풍력터빈", (cx, cy + r + int(95 * scale)), load_font(18, bold=True))


def draw_ground_symbol(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    draw.line([(x, y), (x, y + 16)], fill=_hex(C["navy"]), width=2)
    draw.line([(x - 18, y + 16), (x + 18, y + 16)], fill=_hex(C["navy"]), width=2)
    draw.line([(x - 12, y + 22), (x + 12, y + 22)], fill=_hex(C["navy"]), width=2)
    draw.line([(x - 6, y + 28), (x + 6, y + 28)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "접지", (x, y + 44), load_font(14))
