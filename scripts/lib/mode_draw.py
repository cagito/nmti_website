"""Measurement mode figure helpers. See docs/IMG-070_MEASUREMENT_MODES_IMAGE_PLAN.md."""
from __future__ import annotations

from PIL import ImageDraw, ImageFont

from lib.datalogger_draw import C, _hex, draw_arrow, draw_label, load_font


def draw_zone_box(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    w: int,
    h: int,
    title: str,
    *,
    dashed: bool = False,
) -> None:
    if dashed:
        for i in range(x, x + w, 12):
            draw.line([(i, y), (min(i + 6, x + w), y)], fill=_hex(C["gray"]), width=2)
            draw.line([(i, y + h), (min(i + 6, x + w), y + h)], fill=_hex(C["gray"]), width=2)
        for j in range(y, y + h, 12):
            draw.line([(x, j), (x, min(j + 6, y + h))], fill=_hex(C["gray"]), width=2)
            draw.line([(x + w, j), (x + w, min(j + 6, y + h))], fill=_hex(C["gray"]), width=2)
    else:
        draw.rounded_rectangle([x, y, x + w, y + h], outline=_hex(C["navy"]), width=2)
    draw_label(draw, title, (x + 24, y + 28), load_font(20, bold=True), anchor="lm")


def draw_equipment_box(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    w: int,
    h: int,
    title: str,
    subtitle: str = "",
) -> None:
    draw.rounded_rectangle([x, y, x + w, y + h], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, title, (x + w // 2, y + h // 2 - (8 if subtitle else 0)), load_font(17, bold=True))
    if subtitle:
        draw_label(draw, subtitle, (x + w // 2, y + h // 2 + 18), load_font(14), fill=C["gray"])


def draw_inclinometer_head(draw: ImageDraw.ImageDraw, cx: int, cy: int) -> None:
    draw.rectangle([cx - 40, cy - 30, cx + 40, cy + 30], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw.ellipse([cx - 12, cy - 12, cx + 12, cy + 12], outline=_hex(C["teal"]), width=2)
    draw_label(draw, "지중경사계", (cx, cy + 48), load_font(16, bold=True))
    draw_label(draw, "측점", (cx, cy + 72), load_font(14), fill=C["gray"])


def draw_field_record(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int) -> None:
    draw.rounded_rectangle([x, y, x + w, y + h], fill=_hex(C["white"]), outline=_hex(C["teal"]), width=2)
    draw_label(draw, "현장 기록", (x + w // 2, y + 28), load_font(18, bold=True))
    for i, line in enumerate(["측정일지", "엑셀·양식", "A·B축·초기치"]):
        draw_label(draw, f"• {line}", (x + 16, y + 58 + i * 28), load_font(15), anchor="lm")


def draw_local_buffer(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int) -> None:
    draw.rounded_rectangle([x, y, x + w, y + h], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "현장 저장", (x + w // 2, y + 24), load_font(17, bold=True))
    draw_label(draw, "SD · 메모리", (x + w // 2, y + 52), load_font(14), fill=C["gray"])
    # mini chart
    gx, gy = x + 20, y + 78
    draw.line([(gx, gy + 60), (gx + w - 40, gy + 60)], fill=_hex(C["gray"]), width=1)
    draw.line([(gx, gy), (gx, gy + 60)], fill=_hex(C["gray"]), width=1)
    draw.line([(gx, gy + 60), (gx + 80, gy + 20), (gx + 160, gy + 40)], fill=_hex(C["teal"]), width=2)
    draw_label(draw, "시계열", (x + w // 2, y + h - 18), load_font(13), fill=C["gray"])


def draw_schedule_chip(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    draw.rounded_rectangle([x, y, x + 130, y + 44], fill=_hex(C["white"]), outline=_hex(C["teal"]), width=2)
    draw_label(draw, "수집 주기", (x + 65, y + 22), load_font(15, bold=True))


def draw_alert_ladder(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    stages = [
        ("정상", C["green"]),
        ("주의", C["orange"]),
        ("경고", C["orange"]),
        ("위험", C["red"]),
    ]
    for i, (name, color) in enumerate(stages):
        bx = x + i * 72
        draw.rounded_rectangle([bx, y, bx + 64, y + 36], fill=_hex(color), outline=_hex(C["navy"]), width=1)
        draw_label(draw, name, (bx + 32, y + 18), load_font(14, bold=True), fill=C["white"] if color != C["orange"] else C["navy"])
        if i < 3:
            draw_arrow(draw, bx + 64, y + 18, bx + 72, y + 18, width=2)


def draw_pyramid_layer(
    draw: ImageDraw.ImageDraw,
    cx: int,
    y: int,
    half_w: int,
    h: int,
    label: str,
    sub: str,
    *,
    fill: str = C["light"],
) -> None:
    pts = [(cx - half_w, y + h), (cx + half_w, y + h), (cx + half_w - 20, y), (cx - half_w + 20, y)]
    draw.polygon(pts, fill=_hex(fill), outline=_hex(C["navy"]), width=2)
    draw_label(draw, label, (cx, y + h // 2 - 6), load_font(16, bold=True))
    draw_label(draw, sub, (cx, y + h // 2 + 16), load_font(13), fill=C["gray"])


def draw_dashed_arrow(draw: ImageDraw.ImageDraw, x1: int, y1: int, x2: int, y2: int) -> None:
    import math

    length = math.hypot(x2 - x1, y2 - y1)
    if length < 1:
        return
    steps = int(length / 10)
    for i in range(0, steps, 2):
        t0 = i / steps
        t1 = min((i + 1) / steps, 1)
        draw.line(
            [(x1 + (x2 - x1) * t0, y1 + (y2 - y1) * t0), (x1 + (x2 - x1) * t1, y1 + (y2 - y1) * t1)],
            fill=_hex(C["gray"]),
            width=2,
        )
    draw_arrow(draw, x1, y1, x2, y2, color=C["gray"], width=2)
