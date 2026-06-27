"""Bridge expansion joint meter figure (IMG-014) — BRI-EJ-01~12.

Pillow only — docs/52 · docs/53 · INSTRUMENTATION §3.23.3
"""
from __future__ import annotations

import math

from PIL import ImageDraw, ImageFont

from .bridge_draw import draw_info_panel
from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, draw_legacy_logger_in_enclosure, load_font

METAL = "#C5CCD3"
METAL_DARK = "#8B95A1"
DECK = "#9CA3AF"
ASPHALT = "#4B5563"
GAP = 16


def _panel_box(draw: ImageDraw.ImageDraw, x0: int, y0: int, x1: int, y1: int, title: str) -> None:
    draw.rounded_rectangle([x0, y0, x1, y1], outline=_hex(C["navy"]), width=2, fill=_hex(C["white"]))
    draw_label(draw, title, ((x0 + x1) // 2, y0 + 22), load_font(15, bold=True))


def _leader(draw: ImageDraw.ImageDraw, ax: int, ay: int, lx: int, ly: int, text: str) -> None:
    draw.line([(ax, ay), (lx, ly)], fill=_hex(C["gray"]), width=1)
    draw_label(draw, text, (lx, ly), load_font(12), anchor="lm")


def _deck_blocks(draw: ImageDraw.ImageDraw, lx1: int, rx0: int, y0: int, y1: int, *, left_ext: int, right_ext: int) -> None:
    draw.rectangle([lx1 - left_ext, y0, lx1, y1], fill=_hex(DECK), outline=_hex(C["navy"]), width=2)
    draw.rectangle([rx0, y0, rx0 + right_ext, y1], fill=_hex(DECK), outline=_hex(C["navy"]), width=2)
    draw.rectangle([lx1 - left_ext, y0 - 10, lx1, y0], fill=_hex(ASPHALT))
    draw.rectangle([rx0, y0 - 10, rx0 + right_ext, y0], fill=_hex(ASPHALT))


def _draw_finger_teeth(draw: ImageDraw.ImageDraw, lx1: int, rx0: int, deck_y: int, *, tooth_w: int = 18, tooth_h: int = 14, n: int = 7) -> None:
    """Interlocking finger plates — plan or section top profile."""
    y0 = deck_y - tooth_h
    span = rx0 - lx1
    pitch = max(12, span // max(3, n - 1))
    x = lx1
    i = 0
    while x < rx0 - 4:
        if i % 2 == 0:
            draw.rectangle([x, y0, min(x + tooth_w, rx0), deck_y], fill=_hex(METAL), outline=_hex(C["navy"]), width=1)
        else:
            draw.rectangle([x, y0 + tooth_h // 2, min(x + tooth_w, rx0), deck_y], fill=_hex(METAL_DARK), outline=_hex(C["navy"]), width=1)
        x += pitch
        i += 1
    # opposing teeth from right
    x = rx0
    j = 0
    while x > lx1 + 4:
        if j % 2 == 1:
            draw.rectangle([max(lx1, x - tooth_w), y0, x, deck_y], fill=_hex(METAL), outline=_hex(C["navy"]), width=1)
        else:
            draw.rectangle([max(lx1, x - tooth_w), y0 + tooth_h // 2, x, deck_y], fill=_hex(METAL_DARK), outline=_hex(C["navy"]), width=1)
        x -= pitch
        j += 1


def _draw_meter_plan(draw: ImageDraw.ImageDraw, lx1: int, rx0: int, cy: int) -> None:
    """Plan — sensor spans gap with brackets on both decks."""
    draw.rounded_rectangle([lx1 - 52, cy - 22, rx0 + 52, cy + 22], outline=_hex(C["navy"]), width=2)
    draw.rectangle([lx1 - 18, cy - 10, lx1, cy + 10], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw.rectangle([rx0, cy - 10, rx0 + 18, cy + 10], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw.line([(lx1, cy), (rx0, cy)], fill=_hex(C["navy"]), width=3)
    draw.rounded_rectangle([lx1 + 8, cy - 12, rx0 - 8, cy + 12], fill=_hex(METAL), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "신축이음계", ((lx1 + rx0) // 2, cy - 34), load_font(12, bold=True), fill=C["teal"])
    _leader(draw, rx0 + 52, cy, rx0 + 90, cy - 30, "보호박스")
    draw_arrow(draw, lx1 - 40, cy + 38, rx0 + 40, cy + 38, color=C["teal"], width=2)
    draw_label(draw, "측정축(종방향)", ((lx1 + rx0) // 2, cy + 54), load_font(11), fill=C["teal"])


def _panel_plan(draw: ImageDraw.ImageDraw) -> None:
    x0, y0, x1, y1 = 36, 108, 900, 500
    _panel_box(draw, x0, y0, x1, y1, "① 평면도 — 신축이음부·신축이음계 배치")

    cx = (x0 + x1) // 2
    cy = y0 + 210
    lx1 = cx - GAP // 2
    rx0 = cx + GAP // 2
    plate_y0, plate_y1 = cy - 40, cy + 40

    _deck_blocks(draw, lx1, rx0, plate_y0, plate_y1, left_ext=200, right_ext=200)
    _draw_finger_teeth(draw, lx1, rx0, plate_y0, tooth_w=16, tooth_h=18, n=8)
    _draw_meter_plan(draw, lx1, rx0, cy)

    draw_label(draw, "좌측 상부구조", (cx - 210, cy - 78), load_font(13, bold=True), fill=C["navy"])
    draw_label(draw, "우측 상부구조", (cx + 210, cy - 78), load_font(13, bold=True), fill=C["navy"])
    draw_label(draw, "신축이음부", (cx, cy - 62), load_font(13, bold=True), fill=C["teal"])
    draw_label(draw, "핑거형 신축이음 장치", (cx, plate_y0 - 24), load_font(11), fill=C["gray"])


def _draw_finger_section(draw: ImageDraw.ImageDraw, lx1: int, rx0: int, deck_y: int) -> None:
    """Longitudinal section — deck, girders, interlocking finger plates at gap."""
    lw, rw = 190, 190
    _deck_blocks(draw, lx1, rx0, deck_y, deck_y + 30, left_ext=lw, right_ext=rw)
    for gx in range(lx1 - lw + 24, lx1, 38):
        draw.rectangle([gx, deck_y + 30, gx + 20, deck_y + 54], fill=_hex("#7B8490"), outline=_hex(C["navy"]), width=1)
    for gx in range(rx0 + 18, rx0 + rw, 38):
        draw.rectangle([gx, deck_y + 30, gx + 20, deck_y + 54], fill=_hex("#7B8490"), outline=_hex(C["navy"]), width=1)

    _draw_finger_teeth(draw, lx1, rx0, deck_y, tooth_w=20, tooth_h=20, n=6)
    draw.line([(lx1, deck_y - 22), (rx0, deck_y - 22)], fill=_hex(C["teal"]), width=1)
    draw_label(draw, "신축이음 장치", ((lx1 + rx0) // 2, deck_y - 36), load_font(12, bold=True), fill=C["teal"])


def _draw_joint_meter_section(draw: ImageDraw.ImageDraw, lx1: int, rx0: int, deck_y: int) -> None:
    my = deck_y - 62

    draw.rectangle([lx1 - 42, my - 6, lx1 - 10, my + 30], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "고정 지그", (lx1 - 56, my - 22), load_font(10), fill=C["gray"])
    draw.rectangle([lx1 - 14, my + 6, lx1 + 2, my + 24], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    _leader(draw, lx1 - 6, my + 14, lx1 - 78, my + 46, "고정측 브라켓")

    draw.rectangle([rx0 - 2, my + 6, rx0 + 14, my + 24], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw.rectangle([rx0 + 10, my - 6, rx0 + 42, my + 30], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)
    _leader(draw, rx0 + 12, my + 14, rx0 + 78, my + 46, "이동측 브라켓")

    draw.line([(lx1, my + 14), (rx0, my + 14)], fill=_hex(C["navy"]), width=4)
    draw.rounded_rectangle([(lx1 + rx0) // 2 - 34, my - 4, (lx1 + rx0) // 2 + 34, my + 32], fill=_hex(METAL), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "신축이음계", ((lx1 + rx0) // 2, my - 24), load_font(12, bold=True), fill=C["teal"])
    _leader(draw, (lx1 + rx0) // 2, my + 14, (lx1 + rx0) // 2, my + 50, "센서 로드 / 측정축")

    draw.rounded_rectangle([lx1 - 58, my - 18, rx0 + 58, my + 40], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "보호박스", (rx0 + 78, my + 6), load_font(10), fill=C["gray"])

    duct_x = rx0 + 72
    draw.rectangle([duct_x, my + 24, duct_x + 12, deck_y + 48], fill=_hex(C["panel"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "케이블 보호관", (duct_x + 24, deck_y + 18), load_font(10), fill=C["gray"])
    draw_legacy_logger_in_enclosure(draw, duct_x + 28, deck_y + 52, 88, 56, font=load_font(10))
    draw_label(draw, "데이터 로거", (duct_x + 72, deck_y + 118), load_font(10), fill=C["gray"])

    draw_arrow(draw, lx1 - 56, my - 34, rx0 + 56, my - 34, color=C["teal"], width=2)
    draw_label(draw, "늘음량(+)", (lx1 - 18, my - 50), load_font(11), fill=C["green"])
    draw_label(draw, "줄음량(−)", (rx0 - 10, my - 50), load_font(11), fill=C["red"])


def _panel_section(draw: ImageDraw.ImageDraw) -> None:
    x0, y0, x1, y1 = 36, 520, 900, 940
    _panel_box(draw, x0, y0, x1, y1, "② 종방향 단면도 — 핑거형 신축이음·신축이음계 설치")

    cx = (x0 + x1) // 2
    deck_y = y0 + 210
    lx1 = cx - GAP // 2
    rx0 = cx + GAP // 2
    _draw_finger_section(draw, lx1, rx0, deck_y)
    _draw_joint_meter_section(draw, lx1, rx0, deck_y)

    draw_label(draw, "좌측 상부구조", (cx - 230, deck_y + 72), load_font(12), fill=C["navy"])
    draw_label(draw, "우측 상부구조", (cx + 230, deck_y + 72), load_font(12), fill=C["navy"])


def _panel_summary(draw: ImageDraw.ImageDraw) -> None:
    draw_info_panel(
        draw,
        940,
        108,
        1884,
        400,
        "계측 항목 요약",
        [
            "신축이음부 양측 상대 신축량",
            "주계측: 종방향 신축량(mm)",
            "늘음량(+) · 줄음량(−) 표기",
            "온도 연동·계절 패턴 해석",
            "현장별 관리기준 적용",
            "교량 절대변위·3축 계측 아님",
        ],
    )


def _panel_graph(draw: ImageDraw.ImageDraw) -> None:
    x0, y0, x1, y1 = 940, 420, 1884, 940
    _panel_box(draw, x0, y0, x1, y1, "③ 신축량-시간 그래프(예시)")

    gx0, gy0, gx1, gy1 = x0 + 80, y0 + 100, x1 - 60, y1 - 80
    mid_y = (gy0 + gy1) // 2
    draw.line([(gx0, gy0), (gx0, gy1)], fill=_hex(C["navy"]), width=2)
    draw.line([(gx0, gy1), (gx1, gy1)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "신축량(mm)", (gx0 - 50, mid_y), load_font(12), anchor="mm")
    draw_label(draw, "시간", ((gx0 + gx1) // 2, gy1 + 28), load_font(12))

    draw.line([(gx0, mid_y), (gx1, mid_y)], fill=_hex(C["gray"]), width=1)
    draw_label(draw, "0", (gx0 - 16, mid_y), load_font(10), fill=C["gray"])
    draw_label(draw, "늘음량(+)", (gx0 + 20, gy0 + 16), load_font(11), fill=C["green"])
    draw_label(draw, "줄음량(−)", (gx0 + 20, gy1 - 16), load_font(11), fill=C["red"])

    pts = []
    for i, x in enumerate(range(gx0, gx1, 8)):
        t = i / max(1, (gx1 - gx0) // 8)
        y = mid_y - int(55 * math.sin(t * math.pi * 2.2))
        pts.append((x, y))
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i + 1]], fill=_hex(C["teal"]), width=2)

    draw_label(draw, "현장별 관리기준 적용", ((gx0 + gx1) // 2, y1 - 36), load_font(12), fill=C["gray"])
    draw_label(draw, "※ 온도-신축량 연동 해석 보조", ((gx0 + gx1) // 2, y1 - 14), load_font(10), fill=C["gray"])


def render_img014(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "교량 신축이음부 신축량 계측도", (W // 2, 42), font_title)
    draw_label(
        draw,
        "Expansion joint meter — relative longitudinal expansion (not 3-axis displacement)",
        (W // 2, 82),
        load_font(16),
        fill=C["gray"],
    )
    _panel_plan(draw)
    _panel_section(draw)
    _panel_summary(draw)
    _panel_graph(draw)
