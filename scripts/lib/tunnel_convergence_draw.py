"""Tunnel upper-arch convergence figure helpers (IMG-008).

v8 (Phase Z): 측점 P1~P5 · 측선 · 기준 측정선 — 연속 센서 튜브/Kit 금지 (ZIP-AUD-01).
"""
from __future__ import annotations

import math
from typing import Sequence

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, _hex, draw_label, draw_legacy_logger_block_icon, load_font

W, H = 1920, 1080

# Left panel tunnel geometry
CX, FLOOR_Y = 500, 740
RX, RY = 270, 310

# Upper arch only — P1~P5 (no springline P6/P7)
ARCH_ANGLES = {
    "P1": math.pi / 2,
    "P2": 2 * math.pi / 3,
    "P3": 5 * math.pi / 6,
    "P4": math.pi / 3,
    "P5": math.pi / 6,
}
POINT_LABELS = ["P1", "P2", "P3", "P4", "P5"]
CHAIN_ORDER = ["P3", "P2", "P1", "P4", "P5"]

CLEARANCE_INSET = 58
CLEARANCE_FLOOR_Y = FLOOR_Y - 62
CLEARANCE_MARGIN = 40


def arch_point(theta: float, inset: float = 0.0) -> tuple[float, float]:
    rxi = RX - inset
    ryi = RY - inset
    return (CX + rxi * math.cos(theta), FLOOR_Y - ryi * math.sin(theta))


def arch_profile_points(inset: float = 0.0) -> list[tuple[float, float]]:
    """Upper arch from left springline to right springline (exclude flat invert)."""
    n = 48
    angles = [math.pi + i * (math.pi / n) for i in range(n + 1)]
    return [arch_point(a, inset) for a in angles]


def _stroke(draw: ImageDraw.ImageDraw, pts: Sequence[tuple[float, float]], color: str, width: int = 2) -> None:
    if len(pts) < 2:
        return
    draw.line([(int(x), int(y)) for x, y in pts], fill=_hex(color), width=width)


def _stroke_open_chain(
    draw: ImageDraw.ImageDraw,
    pts: Sequence[tuple[float, float]],
    color: str,
    width: int = 2,
) -> None:
    """Polyline only — never close back to first point (no Closed Loop)."""
    _stroke(draw, pts, color, width)


def _dashed_segment(
    draw: ImageDraw.ImageDraw,
    p1: tuple[float, float],
    p2: tuple[float, float],
    color: str,
    width: int = 2,
    dash: int = 9,
    gap: int = 7,
) -> None:
    x1, y1 = p1
    x2, y2 = p2
    length = math.hypot(x2 - x1, y2 - y1)
    if length < 1:
        return
    ux, uy = (x2 - x1) / length, (y2 - y1) / length
    pos = 0.0
    draw_on = True
    while pos < length:
        seg = dash if draw_on else gap
        seg = min(seg, length - pos)
        sx, sy = x1 + ux * pos, y1 + uy * pos
        ex, ey = x1 + ux * (pos + seg), y1 + uy * (pos + seg)
        if draw_on:
            draw.line([(int(sx), int(sy)), (int(ex), int(ey))], fill=_hex(color), width=width)
        pos += seg
        draw_on = not draw_on


def _dashed_polyline(
    draw: ImageDraw.ImageDraw,
    pts: Sequence[tuple[float, float]],
    color: str,
    width: int = 2,
) -> None:
    for i in range(len(pts) - 1):
        _dashed_segment(draw, pts[i], pts[i + 1], color, width)


def _draw_clearance_envelope(draw: ImageDraw.ImageDraw) -> None:
    """Dashed vehicle / train clearance envelope inside lining."""
    arch = arch_profile_points(CLEARANCE_INSET)
    left_spring = arch[0]
    right_spring = arch[-1]
    left_x = int(CX - RX + CLEARANCE_INSET + 18)
    right_x = int(CX + RX - CLEARANCE_INSET - 18)
    floor_y = int(CLEARANCE_FLOOR_Y)

    _dashed_polyline(draw, arch, C["orange"], 2)
    _dashed_segment(draw, left_spring, (left_x, floor_y), C["orange"], 2)
    _dashed_segment(draw, right_spring, (right_x, floor_y), C["orange"], 2)
    _dashed_segment(draw, (left_x, floor_y), (right_x, floor_y), C["orange"], 2)

    draw_label(
        draw,
        "건축한계 — 통행·궤도 (미계측)",
        (int(CX), int(CLEARANCE_FLOOR_Y - 88)),
        load_font(14, bold=True),
        fill=C["orange"],
    )
    draw_label(
        draw,
        "측점·프리즘 — 라이닝 표면",
        (int(CX), int(CLEARANCE_FLOOR_Y - 68)),
        load_font(12),
        fill=C["gray"],
    )


def _draw_prism(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    draw.polygon([(x, y - 10), (x - 8, y + 4), (x + 8, y + 4)], fill=_hex(C["orange"]), outline=_hex(C["navy"]), width=1)


def draw_tunnel_section(draw: ImageDraw.ImageDraw) -> list[tuple[int, int]]:
    """Horseshoe lining — measurement points P1~P5, chord survey lines."""
    outer = arch_profile_points(0)
    inner = arch_profile_points(28)
    left_floor = (CX - RX, FLOOR_Y)
    right_floor = (CX + RX, FLOOR_Y)
    outer_ring = [left_floor] + outer + [right_floor]
    inner_ring = [(CX - RX + 28, FLOOR_Y)] + inner + [(CX + RX - 28, FLOOR_Y)]

    draw.polygon(
        [(int(x), int(y)) for x, y in outer_ring + list(reversed(inner_ring))],
        fill=_hex("#C8CDD4"),
        outline=_hex(C["navy"]),
    )

    draw.rectangle(
        [int(CX - RX + 40), int(FLOOR_Y - 22), int(CX + RX - 40), int(FLOOR_Y - 8)],
        fill=_hex("#9CA3AF"),
        outline=_hex(C["navy"]),
        width=1,
    )
    draw.rectangle(
        [int(CX - RX + 40), int(FLOOR_Y - 8), int(CX + RX - 40), int(FLOOR_Y + 36)],
        fill=_hex("#4B5563"),
        outline=_hex(C["navy"]),
        width=2,
    )
    draw.line(
        [(int(CX - RX + 60), int(FLOOR_Y + 14)), (int(CX + RX - 60), int(FLOOR_Y + 14))],
        fill=_hex("#FCD34D"),
        width=3,
    )
    draw_label(draw, "노반 (도로·철도)", (CX, FLOOR_Y + 58), load_font(18), fill=C["navy"])
    draw_label(draw, "내공변위 미계측 · Open", (CX, FLOOR_Y - 38), load_font(15), fill=C["gray"])

    _draw_clearance_envelope(draw)

    anchors: dict[str, tuple[int, int]] = {}
    f14 = load_font(14)
    f16b = load_font(16, bold=True)
    for lab in POINT_LABELS:
        x, y = arch_point(ARCH_ANGLES[lab], 32)
        xi, yi = int(x), int(y)
        anchors[lab] = (xi, yi)
        _draw_prism(draw, xi, yi)
        draw.ellipse([xi - 10, yi - 10, xi + 10, yi + 10], outline=_hex(C["navy"]), width=2)
        draw_label(draw, lab, (xi, yi - 22), f16b, fill=C["navy"])

    # Baseline survey chords (initial) — dashed
    for i in range(len(CHAIN_ORDER) - 1):
        a, b = CHAIN_ORDER[i], CHAIN_ORDER[i + 1]
        _dashed_segment(draw, anchors[a], anchors[b], C["gray"], 2)
    draw_label(draw, "기준 측정선 (초기)", (int(CX - 200), int(FLOOR_Y - 145)), load_font(13), fill=C["gray"])

    # Current chord deformation
    for i in range(len(CHAIN_ORDER) - 1):
        a, b = CHAIN_ORDER[i], CHAIN_ORDER[i + 1]
        x1, y1 = anchors[a]
        x2, y2 = anchors[b]
        mx, my = (x1 + x2) // 2, (y1 + y2) // 2
        draw.line([(x1, y1), (x2, y2)], fill=_hex(C["teal"]), width=2)
        if a == "P2" and b == "P1":
            draw_label(draw, "내공변위 측선", (mx, my - 14), f14, anchor="mm", fill=C["teal"])

    init = [arch_point(ARCH_ANGLES[lab], 50) for lab in CHAIN_ORDER]
    curr = [(x, y + (5 if j % 2 == 0 else 8)) for j, (x, y) in enumerate(init)]
    _stroke_open_chain(draw, init, C["gray"], 2)
    _stroke_open_chain(draw, curr, C["teal"], 3)
    draw_label(draw, "초기 형상 (개방)", (int(CX - 130), int(FLOOR_Y - 118)), load_font(15), fill=C["gray"])
    draw_label(draw, "현재 형상 (개방)", (int(CX - 130), int(FLOOR_Y - 93)), load_font(15), fill=C["teal"])

    # ATS sight lines (not sensor tube)
    ats_x, ats_y = int(CX + RX + 80), int(FLOOR_Y - 200)
    draw.rounded_rectangle([ats_x, ats_y, ats_x + 70, ats_y + 50], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw.ellipse([ats_x + 22, ats_y + 12, ats_x + 48, ats_y + 38], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "자동광파기", (ats_x + 35, ats_y - 16), load_font(13), anchor="mm", fill=C["navy"])
    for lab in ("P1", "P4", "P5"):
        tx, ty = anchors[lab]
        draw.line([(ats_x + 10, ats_y + 28), (tx, ty)], fill=_hex(C["gray"]), width=1)
    draw_label(draw, "시준·거리 측정", (ats_x + 90, ats_y + 28), load_font(12), fill=C["gray"])

    draw_legacy_logger_block_icon(draw, ats_x + 100, ats_y + 60, 118, 76, font=load_font(14, bold=True))

    draw_label(draw, "터널 내공", (int(CX), int(FLOOR_Y - RY - 30)), load_font(18), fill=C["gray"])
    draw_label(draw, "라이닝", (int(CX + RX - 60), int(FLOOR_Y - 180)), load_font(16), fill=C["navy"])

    return list(anchors.values())


def _arch_chart_y(lab: str, base_y: float, span: float) -> float:
    """Map crown P1 to highest point on chart."""
    ang = ARCH_ANGLES[lab]
    rel = math.sin(ang)
    return base_y - rel * span


def _draw_arc_profile_chart(draw: ImageDraw.ImageDraw, px: int, py: int, pw: int, ph: int) -> None:
    """Horizontal arc-length profile — no invert / no radar closure."""
    draw_label(draw, "아치형 거동 프로파일", (px + pw // 2, py + 22), load_font(18, bold=True))
    draw_label(draw, "(상부 아치 P1~P5 · 개방 체인)", (px + pw // 2, py + 46), load_font(13), fill=C["gray"])

    chart_l, chart_r = px + 28, px + pw - 28
    chart_t, chart_b = py + 72, py + ph - 52
    chart_w = chart_r - chart_l
    n = len(CHAIN_ORDER)
    xs = [chart_l + chart_w * i / (n - 1) for i in range(n)]
    span = chart_b - chart_t - 36
    base_y = chart_b - 8

    draw.rectangle([chart_l, base_y - 4, chart_r, chart_b], fill=_hex("#E5E7EB"), outline=_hex(C["gray"]), width=1)
    draw_label(draw, "노반 Open · 미계측", (px + pw // 2, base_y + 14), load_font(13, bold=True), fill=C["gray"])

    def chain_xy(j: int, lab: str, offset: float = 0.0) -> tuple[float, float]:
        return (xs[j], _arch_chart_y(lab, base_y - 8, span) - offset)

    init_p = [chain_xy(j, lab) for j, lab in enumerate(CHAIN_ORDER)]
    curr_p = [(x, y - 10) for x, y in init_p]
    _stroke_open_chain(draw, init_p, C["gray"], 2)
    _stroke_open_chain(draw, curr_p, C["teal"], 3)

    f11 = load_font(11, bold=True)
    for j, lab in enumerate(CHAIN_ORDER):
        x, y = init_p[j]
        draw.ellipse([int(x) - 4, int(y) - 4, int(x) + 4, int(y) + 4], fill=_hex(C["navy"]))
        draw_label(draw, lab, (int(x), int(y) - 12), f11)

    p3x, _ = init_p[0]
    p5x, _ = init_p[-1]
    _dashed_segment(draw, (p3x, chart_t), (p3x, base_y - 4), C["gray"], 1)
    _dashed_segment(draw, (p5x, chart_t), (p5x, base_y - 4), C["gray"], 1)
    draw_label(draw, "← 개방", (int(p3x - 22), int(chart_t + 18)), load_font(11), fill=C["gray"])
    draw_label(draw, "개방 →", (int(p5x + 22), int(chart_t + 18)), load_font(11), fill=C["gray"])

    draw.line([(chart_l, chart_b), (chart_r, chart_b)], fill=_hex(C["navy"]), width=1)
    draw_label(draw, "측점 거리", (chart_l - 6, chart_b + 2), load_font(10), anchor="rm", fill=C["gray"])


def draw_right_panels(draw: ImageDraw.ImageDraw) -> None:
    px = 1180

    draw.rounded_rectangle([px, 120, px + 320, 300], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "측정 방식", (px + 160, 148), load_font(20, bold=True))
    for i, t in enumerate(["측점 P1~P5 (프리즘·타깃)", "측점 간 거리·좌표 변화", "자동광파기·테이프 익스텐소미터", "천단침하와 구분"]):
        draw_label(draw, f"• {t}", (px + 24, 188 + i * 28), load_font(14), anchor="lm")

    draw.rounded_rectangle([px, 330, px + 320, 500], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "변위 성분", (px + 160, 358), load_font(18, bold=True))
    draw_label(draw, "수평·사선 내공변위", (px + 160, 386), load_font(13), fill=C["gray"])
    wx, wy = px + 80, 430
    draw.line([(wx, wy + 60), (wx + 140, wy + 60)], fill=_hex(C["navy"]), width=2)
    draw.line([(wx, wy + 60), (wx, wy)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "ΔX (반경)", (wx + 70, wy + 78), load_font(14))
    draw_label(draw, "ΔY (접선)", (wx - 8, wy + 20), load_font(14), anchor="rm")

    draw.rounded_rectangle([px, 530, px + 320, 820], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    _draw_arc_profile_chart(draw, px + 8, 538, 304, 274)

    draw.rounded_rectangle([px + 340, 120, px + 700, 280], outline=_hex(C["red"]), width=2)
    draw_label(draw, "금지", (px + 520, 148), load_font(18, bold=True), fill=C["red"])
    for i, t in enumerate(["라이닝 연속 센서 튜브", "Kit 전체 프로파일 자동 산정", "건축한계 내부 센서"]):
        draw_label(draw, f"✗ {t}", (px + 360, 188 + i * 32), load_font(14), fill=C["red"])


def assert_clearance_compliance() -> None:
    """CI assert — all measurement points above clearance envelope floor."""
    for lab in POINT_LABELS:
        _, y = arch_point(ARCH_ANGLES[lab], 32)
        if y >= CLEARANCE_FLOOR_Y - CLEARANCE_MARGIN:
            raise AssertionError(f"{lab} Y={y:.0f} violates Envelope margin (floor={CLEARANCE_FLOOR_Y - CLEARANCE_MARGIN})")


def render_img008(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    assert_clearance_compliance()
    draw_label(draw, "터널 전단면 내공변위 측정시스템", (W // 2, 48), font_title)
    draw_label(
        draw,
        "상부 아치 P1~P5 측점 · 측선 · 기준 측정선 · 노반 Open 미계측",
        (W // 2, 88),
        load_font(20),
        fill=C["gray"],
    )
    draw_tunnel_section(draw)
    draw_right_panels(draw)
