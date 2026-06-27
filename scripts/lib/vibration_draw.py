"""Vibration meter installation (IMG-041) — ZIP-AUD-06 unit separation."""
from __future__ import annotations

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, draw_logger_block_icon, load_font


def _accel_node(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    draw.rounded_rectangle([x - 22, y - 14, x + 22, y + 14], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "가속도계", (x, y), load_font(12, bold=True))


def render_img041(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "진동계 설치 개념도", (W // 2, 48), font_title)
    draw_label(
        draw,
        "가속도(m/s²·gal) vs 진동속도 PPV(mm/s) 분리",
        (W // 2, 88),
        load_font(18),
        fill=C["gray"],
    )

    # Structure floor
    deck_y = 520
    draw.rectangle([120, deck_y, 720, deck_y + 28], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "구조물 바닥 (볼트 고정)", (420, deck_y - 24), load_font(15), fill=C["navy"])
    _accel_node(draw, 280, deck_y - 8)
    draw_label(draw, "Z축 (수직)", (280, deck_y - 42), load_font(12), fill=C["teal"])
    draw_arrow(draw, 280, deck_y - 50, 280, deck_y - 70, color=C["teal"], width=2)

    # Ground
    ground_y = 680
    draw.rectangle([120, ground_y, 720, ground_y + 80], fill=_hex("#E8D4B8"), outline=_hex(C["navy"]))
    _accel_node(draw, 520, ground_y - 8)
    draw_label(draw, "지반 진동계 (매설·표면)", (520, ground_y - 36), load_font(13), fill=C["gray"])

    # Chart panels
    cx1, cy1, cw, ch = 140, 760, 280, 140
    draw.rounded_rectangle([cx1, cy1, cx1 + cw, cy1 + ch], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "가속도", (cx1 + cw // 2, cy1 + 24), load_font(16, bold=True))
    draw_label(draw, "단위: m/s² · gal", (cx1 + cw // 2, cy1 + 48), load_font(13), fill=C["teal"])
    draw.line([(cx1 + 30, cy1 + 100), (cx1 + cw - 30, cy1 + 70)], fill=_hex(C["teal"]), width=2)

    cx2 = 460
    draw.rounded_rectangle([cx2, cy1, cx2 + cw, cy1 + ch], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "진동속도 (PPV)", (cx2 + cw // 2, cy1 + 24), load_font(16, bold=True))
    draw_label(draw, "단위: mm/s", (cx2 + cw // 2, cy1 + 48), load_font(13), fill=C["orange"])
    draw.line([(cx2 + 30, cy1 + 90), (cx2 + cw - 30, cy1 + 90)], fill=_hex(C["orange"]), width=2)

    draw_logger_block_icon(draw, 600, 600, 100, 60, title="로거", font=load_font(12, bold=True))

    px = 880
    draw.rounded_rectangle([px, 160, 1840, 880], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "단위 · 구분", (1360, 200), load_font(22, bold=True))
    items = [
        "가속도계 — m/s², gal 또는 g",
        "진동속도·PPV — mm/s (속도 단위)",
        "그래프 축은 항목별 하나로 통일",
        "구조물·지반 — 고정면·측정축 구분",
    ]
    y = 280
    for t in items:
        draw.ellipse([px + 28, y - 6, px + 40, y + 6], fill=_hex(C["teal"]))
        draw_label(draw, t, (px + 52, y), load_font(17), anchor="lm")
        y += 44

    draw.rounded_rectangle([px + 40, 520, px + 420, 620], outline=_hex(C["red"]), width=2)
    draw_label(draw, "✗ 가속도(m/s² 또는 mm/s)", (px + 230, 570), load_font(14, bold=True), fill=C["red"])
