"""Building structural deflection monitoring (IMG-099).

DEF-01~04 · INSTRUMENTATION §3.27 — Pillow only.
"""
from __future__ import annotations

import math

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, _hex, draw_arrow, draw_label, load_font

MAIN_R = 1060
PANEL_L = 1072
BOTTOM_Y = 920

# RC frame geometry
COL_L = 180
COL_R = 260
COL_BOT = BOTTOM_Y - 40
COL_TOP = 280
BEAM_L = COL_L
BEAM_R = 820
BEAM_Y = COL_TOP
SLAB_TOP = BEAM_Y - 28
MID_X = (BEAM_L + BEAM_R) // 2

# Span L = 12 m → L/360 ≈ 33 mm, L/250 = 48 mm
SPAN_M = 12
LIM_360 = round(SPAN_M * 1000 / 360)  # 33
LIM_250 = round(SPAN_M * 1000 / 250)  # 48
MAX_DELTA = 55


def _panel_box(draw: ImageDraw.ImageDraw, x0: int, y0: int, x1: int, y1: int, title: str) -> None:
    draw.rounded_rectangle([x0, y0, x1, y1], outline=_hex(C["navy"]), width=2, fill=_hex(C["white"]))
    draw_label(draw, title, ((x0 + x1) // 2, y0 + 18), load_font(13, bold=True))


def _dashed_hline(draw: ImageDraw.ImageDraw, x0: int, x1: int, y: int, color: str, width: int = 2) -> None:
    for x in range(x0, x1, 10):
        draw.line([(x, y), (min(x + 6, x1), y)], fill=_hex(color), width=width)


def _lvdt_sensor(draw: ImageDraw.ImageDraw, x: int, beam_y: int) -> None:
    f11 = load_font(11)
    f10 = load_font(10)
    body_top = beam_y + 18
    body_bot = body_top + 52
    draw.rectangle([x - 22, body_top, x + 22, body_bot], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw.rectangle([x - 16, body_top + 8, x + 16, body_top + 22], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "LVDT", (x, body_top + 38), f10, fill=C["navy"])
    # Rod to fixed anchor below
    anchor_y = body_bot + 90
    draw.line([(x, body_bot), (x, anchor_y)], fill=_hex(C["gray"]), width=2)
    draw.rectangle([x - 28, anchor_y, x + 28, anchor_y + 14], fill=_hex(C["enc"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "고정 앵커", (x, anchor_y + 28), f10, fill=C["gray"])
    # Deflection arrow (downward δ)
    arrow_top = beam_y + 4
    arrow_bot = beam_y + 38
    draw_arrow(draw, x + 36, arrow_top, x + 36, arrow_bot, color=C["teal"], width=2)
    draw.line([(x + 30, arrow_top), (x + 42, arrow_top)], fill=_hex(C["teal"]), width=2)
    draw_label(draw, "δ", (x + 52, (arrow_top + arrow_bot) // 2), f11, fill=C["teal"])
    draw_label(draw, "① 변위계(LVDT)", (x, body_top - 16), f11, fill=C["teal"])


def _tilt_meter(draw: ImageDraw.ImageDraw, col_r: int, beam_y: int) -> None:
    f10 = load_font(10)
    tx, ty = col_r + 8, beam_y - 6
    draw.polygon([(tx, ty), (tx + 28, ty - 8), (tx + 28, ty + 8)], fill=_hex(C["orange"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "② 경사계 θ", (tx + 48, ty), f10, fill=C["orange"], anchor="lm")


def _main_section(draw: ImageDraw.ImageDraw) -> None:
    f13 = load_font(13)
    f11 = load_font(11)
    f10 = load_font(10)

    draw.rectangle([48, 108, MAIN_R, BOTTOM_Y], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "처짐계 설치 개념도", (MAIN_R // 2, 128), f13, fill=C["navy"])

    # Floor / support
    draw.rectangle([96, COL_BOT, BEAM_R + 60, COL_BOT + 24], fill=_hex("#D1D5DB"), outline=_hex(C["gray"]), width=1)
    draw_label(draw, "지지", (120, COL_BOT + 12), f10, fill=C["gray"], anchor="lm")

    # Columns
    for cx in (COL_L + 40, BEAM_R - 40):
        draw.rectangle([cx - 36, COL_TOP, cx + 36, COL_BOT], fill=_hex("#E5E7EB"), outline=_hex(C["navy"]), width=2)
        for yy in range(COL_TOP + 12, COL_BOT, 22):
            draw.line([(cx - 30, yy), (cx + 30, yy)], fill=_hex(C["gray"]), width=1)
    draw_label(draw, "RC 기둥", (COL_L + 40, COL_BOT - 18), f10, fill=C["gray"])

    # Beam (with slight sag curve)
    sag_pts = []
    for i in range(21):
        t = i / 20
        x = int(BEAM_L + (BEAM_R - BEAM_L) * t)
        sag = int(14 * math.sin(math.pi * t))
        y = BEAM_Y + sag
        sag_pts.append((x, y))
    draw.line(sag_pts, fill=_hex(C["navy"]), width=6)
    draw.line([(p[0], p[1] - 10) for p in sag_pts], fill=_hex("#9CA3AF"), width=3)
    draw_label(draw, "RC 보", (MID_X, BEAM_Y - 36), f11, fill=C["navy"])

    # Slab above beam
    draw.rectangle([BEAM_L - 8, SLAB_TOP, BEAM_R + 8, BEAM_Y - 6], fill=_hex("#F3F4F6"), outline=_hex(C["gray"]), width=1)
    draw_label(draw, "슬래브", (MID_X, SLAB_TOP - 14), f10, fill=C["gray"])

    # Formwork hint (dashed)
    _dashed_hline(draw, BEAM_L - 20, BEAM_R + 20, BEAM_Y + 56, C["gray"], 1)
    draw_label(draw, "거푸집·동바리(시공)", (BEAM_R + 30, BEAM_Y + 56), f10, fill=C["gray"], anchor="lm")

    mid_beam_y = BEAM_Y + 7
    _lvdt_sensor(draw, MID_X, mid_beam_y)
    _tilt_meter(draw, COL_R, BEAM_Y)

    # Callout box
    box_x0, box_y0 = 72, BOTTOM_Y - 118
    draw.rounded_rectangle([box_x0, box_y0, box_x0 + 420, BOTTOM_Y - 24], radius=6, outline=_hex(C["navy"]), width=1, fill=_hex(C["white"]))
    lines = [
        "변위계(LVDT): 보 중앙부 수직 처짐 δ",
        "경사계: 보-기둥 접합 기울기 θ (선택)",
        "기준: 고정 앵커 — 지반 침하계 아님",
    ]
    ly = box_y0 + 22
    for line in lines:
        draw_label(draw, f"· {line}", (box_x0 + 12, ly), f10, fill=C["navy"], anchor="lm")
        ly += 26


def _deflection_graph(draw: ImageDraw.ImageDraw) -> None:
    x0, y0, x1, y1 = PANEL_L, 108, PANEL_L + 792, 520
    _panel_box(draw, x0, y0, x1, y1, "처짐 그래프 예시")

    f11 = load_font(11)
    f10 = load_font(10)

    gx0 = x0 + 72
    gy0 = y0 + 56
    gw = x1 - gx0 - 48
    gh = y1 - gy0 - 56
    gy1 = gy0 + gh

    draw.line([(gx0, gy0), (gx0, gy1)], fill=_hex(C["navy"]), width=1)
    draw.line([(gx0, gy1), (gx0 + gw, gy1)], fill=_hex(C["navy"]), width=1)

    def y_delta(mm: float) -> int:
        return gy0 + int(gh * (mm / MAX_DELTA))

    for mm in (0, 15, 30, 45):
        yy = y_delta(mm)
        draw.line([(gx0 - 4, yy), (gx0, yy)], fill=_hex(C["navy"]), width=1)
        draw_label(draw, f"{mm}", (gx0 - 8, yy), f10, fill=C["gray"], anchor="rm")

    draw_label(draw, "처짐량 δ(mm)", (gx0 - 36, gy0 + gh // 2), f10, fill=C["gray"], anchor="rm")

    for day, frac in ((0, 0.0), (20, 0.25), (40, 0.5), (60, 0.75), (90, 1.0)):
        xx = gx0 + int(gw * frac)
        draw.line([(xx, gy1), (xx, gy1 + 4)], fill=_hex(C["navy"]), width=1)
        draw_label(draw, str(day), (xx, gy1 + 14), f10, fill=C["gray"])

    draw_label(draw, "시간(일)", (gx0 + gw // 2, gy1 + 32), f11, fill=C["navy"])

    y360 = y_delta(LIM_360)
    y250 = y_delta(LIM_250)
    _dashed_hline(draw, gx0, gx0 + gw, y360, C["orange"], 2)
    _dashed_hline(draw, gx0, gx0 + gw, y250, C["red"], 2)
    draw_label(draw, f"L/360 = {LIM_360}mm", (gx0 + gw - 8, y360 - 10), f10, fill=C["orange"], anchor="rm")
    draw_label(draw, f"L/250 = {LIM_250}mm (L={SPAN_M}m)", (gx0 + gw - 8, y250 - 10), f10, fill=C["red"], anchor="rm")

    # Measured curve — rapid then leveling (~28mm)
    meas = [
        (gx0 + int(gw * 0.0), y_delta(2)),
        (gx0 + int(gw * 0.12), y_delta(18)),
        (gx0 + int(gw * 0.28), y_delta(26)),
        (gx0 + int(gw * 0.45), y_delta(28)),
        (gx0 + int(gw * 0.62), y_delta(29)),
        (gx0 + int(gw * 0.78), y_delta(29)),
    ]
    for i in range(len(meas) - 1):
        draw.line([meas[i], meas[i + 1]], fill=_hex(C["teal"]), width=3)
    for px, py in meas[::2]:
        draw.ellipse([px - 4, py - 4, px + 4, py + 4], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)

    # Design predicted (dashed extension)
    pred = meas[-2:] + [
        (gx0 + int(gw * 0.92), y_delta(30)),
        (gx0 + gw, y_delta(31)),
    ]
    for i in range(len(pred) - 1):
        x1p, y1p = pred[i]
        x2p, y2p = pred[i + 1]
        steps = max(abs(x2p - x1p), 1) // 6
        for s in range(steps):
            t0, t1 = s / steps, (s + 0.55) / steps
            ax = int(x1p + (x2p - x1p) * t0)
            ay = int(y1p + (y2p - y1p) * t0)
            bx = int(x1p + (x2p - x1p) * t1)
            by = int(y1p + (y2p - y1p) * t1)
            draw.line([(ax, ay), (bx, by)], fill=_hex(C["navy"]), width=2)

    # Legend
    leg_x = x0 + 56
    leg_y = y1 - 78
    draw.line([(leg_x, leg_y), (leg_x + 36, leg_y)], fill=_hex(C["teal"]), width=3)
    draw_label(draw, "측정값", (leg_x + 44, leg_y), f10, anchor="lm")
    leg_y += 22
    _dashed_hline(draw, leg_x, leg_x + 36, leg_y, C["navy"], 2)
    draw_label(draw, "설계 예측 처짐", (leg_x + 44, leg_y), f10, anchor="lm")
    leg_y += 22
    _dashed_hline(draw, leg_x, leg_x + 36, leg_y, C["orange"], 2)
    draw_label(draw, "관리기준 L/360", (leg_x + 44, leg_y), f10, anchor="lm")

    draw_label(
        draw,
        f"KDS 허용 처짐 — L/250·L/360 (스팬 L={SPAN_M}m)",
        ((x0 + x1) // 2, y1 - 22),
        f10,
        fill=C["gray"],
    )


def _panel_legend(draw: ImageDraw.ImageDraw) -> None:
    x0, y0, x1, y1 = PANEL_L, 548, PANEL_L + 792, 950
    _panel_box(draw, x0, y0, x1, y1, "계측 요약 · DEF-01~04")

    f11 = load_font(11)
    f10 = load_font(10)
    items = [
        ("DEF-02", "RC 골조 — 성토·연약지반 금지", C["navy"]),
        ("DEF-03", "LVDT·레이저 처짐 — 침하계 금지", C["teal"]),
        ("DEF-04", "Y=처짐량 δ — 침하량·예측 침하 금지", C["orange"]),
        ("BLD-02", "경사 θ vs 변위 δ 라벨 분리", C["gray"]),
    ]
    ly = y0 + 52
    for tag, text, col in items:
        draw.rounded_rectangle([x0 + 40, ly - 12, x0 + 96, ly + 12], radius=4, fill=_hex(C["light"]), outline=_hex(col), width=1)
        draw_label(draw, tag, (x0 + 68, ly), f10, fill=col)
        draw_label(draw, text, (x0 + 108, ly), f11, anchor="lm")
        ly += 36

    draw_label(
        draw,
        "건축 구조물 처짐 — 거푸집 해체·프리스트레스·타설 단계별 기록",
        ((x0 + x1) // 2, y1 - 28),
        f10,
        fill=C["gray"],
    )


def render_img099(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "구조물 처짐 계측", (MAIN_R // 2, 42), font_title)
    draw_label(
        draw,
        "Building Deflection — RC Frame · LVDT · Time-δ Curve",
        (MAIN_R // 2, 82),
        load_font(17),
        fill=C["gray"],
    )
    draw.line([(PANEL_L - 8, 100), (PANEL_L - 8, 960)], fill=_hex(C["light"]), width=2)
    _main_section(draw)
    _deflection_graph(draw)
    _panel_legend(draw)
