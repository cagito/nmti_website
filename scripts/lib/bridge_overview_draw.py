"""IMG-011 v3 — cable-stayed bridge monitoring overview (BRI-OV, 10 callouts)."""
from __future__ import annotations

import math

from PIL import ImageDraw

from lib.bridge_draw import draw_acc_node, draw_expansion_joint, draw_prism, draw_tiltmeter_bracket
from lib.datalogger_draw import C, _hex, draw_arrow, draw_label, draw_title, load_font, new_canvas

SOIL = "#E8D4B8"


def _callout_line(
    draw: ImageDraw.ImageDraw,
    sx: int,
    sy: int,
    ex: int,
    ey: int,
    label: str,
    *,
    num: str,
) -> None:
    draw.line([(ex, ey), (sx, sy)], fill=_hex(C["teal"]), width=2)
    tw = max(80, len(label) * 10 + 28)
    draw.rounded_rectangle(
        [sx - tw // 2, sy - 16, sx + tw // 2, sy + 16],
        fill=_hex(C["white"]),
        outline=_hex(C["navy"]),
        width=2,
    )
    draw_label(draw, f"{num} {label}", (sx, sy), load_font(11, bold=True), fill=C["teal"])


def _draw_cable_stayed_bridge(
    draw: ImageDraw.ImageDraw,
    *,
    x0: int,
    x1: int,
    deck_y: int,
    ground_y: int,
    tower_x: int,
) -> None:
    """Single cable-stayed form — no mixed girder bridge."""
    draw.rectangle([x0 - 40, ground_y, x1 + 40, ground_y + 70], fill=_hex(SOIL), outline=_hex(C["navy"]), width=2)
    draw.line([(x0 - 40, ground_y), (x1 + 40, ground_y)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "지표면", (x1 + 20, ground_y - 10), load_font(11), fill=C["gray"], anchor="rm")

    # Foundations
    for fx, lab in ((x0 + 30, "교대·기초"), (tower_x, "교각·기초"), (x1 - 30, "교대·기초")):
        draw.rectangle([fx - 36, ground_y - 8, fx + 36, ground_y + 28], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
        draw_label(draw, lab, (fx, ground_y + 44), load_font(10), fill=C["gray"])

    # Pylon / tower
    draw.rectangle([tower_x - 20, deck_y - 200, tower_x + 20, ground_y], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)
    draw_label(draw, "주탑", (tower_x, deck_y - 218), load_font(13, bold=True))

    # Abutments
    for ax in (x0, x1):
        draw.rectangle([ax - 22, deck_y + 24, ax + 22, ground_y], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "교대", (x0, deck_y + 108), load_font(12))
    draw_label(draw, "교대", (x1, deck_y + 108), load_font(12))

    # Deck / superstructure
    draw.rectangle([x0, deck_y, x1, deck_y + 26], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=3)
    for gx in range(x0 + 50, x1, 70):
        draw.rectangle([gx, deck_y + 26, gx + 20, deck_y + 50], fill=_hex("#9CA3AF"), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "상부구조(교면·거더)", (tower_x, deck_y - 34), load_font(13, bold=True))

    # Bearings
    for bx in (x0 + 28, tower_x, x1 - 28):
        draw.rectangle([bx - 9, deck_y + 48, bx + 9, deck_y + 62], fill=_hex(C["orange"]), outline=_hex(C["navy"]), width=1)
        draw_label(draw, "받침", (bx, deck_y + 76), load_font(10), fill=C["gray"])

    # Stay cables
    cable_anchors = [x0 + 120, x0 + 220, x1 - 220, x1 - 120]
    tower_top = deck_y - 188
    for cx in cable_anchors:
        draw.line([(tower_x, tower_top), (cx, deck_y + 4)], fill=_hex(C["navy"]), width=2)
        draw.ellipse([cx - 6, deck_y - 2, cx + 6, deck_y + 10], fill=_hex(C["navy"]))


def _draw_right_panel(draw: ImageDraw.ImageDraw) -> None:
    x0, y0, x1, y1 = 1460, 140, 1880, 900
    draw.rounded_rectangle([x0, y0, x1, y1], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "교량 계측 10종", ((x0 + x1) // 2, y0 + 36), load_font(20, bold=True))
    items = [
        "① 변형률계 — 거더 변형률",
        "② 온도계 — 부재 온도",
        "③ 가속도계 — 동적 진동",
        "④ 처짐계 — 주경간 δ",
        "⑤ 신축이음계 — 이음부 개폐량",
        "⑥ 케이블장력계 — 케이블 장력 T",
        "⑦ 풍향풍속계 — 주탑 상부 풍환경",
        "⑧ 무응력계 — 크리프 보정",
        "⑨ 구조물경사계 — 교각/주탑 기울기 θ",
        "⑩ 기초침하·광파 — 기초 침하·프리즘 변위",
    ]
    for i, line in enumerate(items):
        draw_label(draw, line, (x0 + 24, y0 + 88 + i * 72), load_font(15), anchor="lm")


def render_img011() -> object:
    """교량 계측 전체 개념도 v3 — fields/bridge category hero."""
    img, draw = new_canvas()
    draw_title(draw, "교량 계측 전체 개념도", "사장교형 — 구조 계층 + 10종 계측기 설치·측정 물리량")

    deck_y, ground_y = 420, 720
    x0, x1, tower_x = 120, 1120, 620
    mid_x = (x0 + x1) // 2

    _draw_cable_stayed_bridge(draw, x0=x0, x1=x1, deck_y=deck_y, ground_y=ground_y, tower_x=tower_x)

    # ① 변형률계 — gauge plate on girder
    gx1 = 380
    draw.rounded_rectangle([gx1 - 14, deck_y + 30, gx1 + 14, deck_y + 48], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw.line([(gx1 + 14, deck_y + 39), (gx1 + 36, deck_y + 39)], fill=_hex(C["teal"]), width=2)
    _callout_line(draw, 300, 300, gx1, deck_y + 39, "변형률계", num="①")

    # ② 온도계 — on member
    tx = 820
    draw.ellipse([tx - 8, deck_y + 6, tx + 8, deck_y + 22], fill=_hex(C["orange"]), outline=_hex(C["navy"]), width=2)
    draw.line([(tx, deck_y + 22), (tx, deck_y + 32)], fill=_hex(C["navy"]), width=2)
    _callout_line(draw, 900, 290, tx, deck_y + 14, "온도계", num="②")

    # ③ 가속도계
    ax = 220
    draw_acc_node(draw, ax, deck_y + 8)
    _callout_line(draw, 160, 310, ax, deck_y + 8, "가속도계", num="③")

    # ④ 처짐계 — midspan δ downward
    ref_y = deck_y - 24
    draw.line([(mid_x - 30, ref_y), (mid_x + 30, ref_y)], fill=_hex(C["gray"]), width=2)
    draw_arrow(draw, mid_x, ref_y, mid_x, deck_y + 8, color=C["teal"], width=3)
    draw_label(draw, "δ", (mid_x + 18, deck_y - 8), load_font(15, bold=True), fill=C["teal"])
    _callout_line(draw, mid_x, 250, mid_x, deck_y + 20, "처짐계", num="④")

    # ⑤ 신축이음계 — abutment joint
    jx = x1 - 18
    draw_expansion_joint(draw, jx, deck_y)
    draw_arrow(draw, jx - 28, deck_y - 10, jx + 28, deck_y - 10, color=C["teal"], width=2)
    draw_label(draw, "↔", (jx, deck_y - 28), load_font(14, bold=True), fill=C["teal"])
    _callout_line(draw, 1040, 340, jx, deck_y - 6, "신축이음계", num="⑤")

    # ⑥ 케이블장력계 — clamp on cable + T along axis
    cx, cy = 740, deck_y - 60
    tx_top, ty_top = tower_x, deck_y - 188
    draw.line([(tx_top, ty_top), (cx, deck_y + 4)], fill=_hex(C["navy"]), width=2)
    # clamp on cable (~60% along segment)
    t = 0.55
    px = int(tx_top + (cx - tx_top) * t)
    py = int(ty_top + (deck_y + 4 - ty_top) * t)
    draw.rounded_rectangle([px - 16, py - 10, px + 16, py + 10], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    angle = math.atan2(deck_y + 4 - ty_top, cx - tx_top)
    ex = int(px + 40 * math.cos(angle))
    ey = int(py + 40 * math.sin(angle))
    draw_arrow(draw, px, py, ex, ey, color=C["teal"], width=2)
    draw_label(draw, "T", (ex + 12, ey), load_font(13, bold=True), fill=C["teal"])
    _callout_line(draw, 880, 180, px, py, "케이블장력계", num="⑥")

    # ⑦ 풍향풍속계 — pylon top
    wy = deck_y - 210
    draw.line([(tower_x, deck_y - 200), (tower_x, wy - 20)], fill=_hex(C["navy"]), width=2)
    draw.ellipse([tower_x - 14, wy - 32, tower_x + 14, wy - 4], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_arrow(draw, tower_x + 40, wy - 18, tower_x + 90, wy - 18, color=C["teal"], width=2)
    draw_label(draw, "풍", (tower_x + 100, wy - 18), load_font(12), fill=C["teal"])
    _callout_line(draw, 760, 130, tower_x, wy - 18, "풍향풍속계", num="⑦")

    # ⑧ 무응력계 — distinct from strain gauge
    ux = 480
    draw.rounded_rectangle([ux - 10, deck_y + 32, ux + 10, deck_y + 48], fill=_hex(C["light"]), outline=_hex(C["orange"]), width=2)
    draw_label(draw, "D", (ux, deck_y + 40), load_font(9, bold=True), fill=C["orange"])
    _callout_line(draw, 420, 270, ux, deck_y + 40, "무응력계", num="⑧")

    # ⑨ 구조물경사계 — pier surface plate + θ
    pier_x = tower_x
    draw_tiltmeter_bracket(draw, pier_x + 20, deck_y + 140, side="right", label="")
    draw_label(draw, "θ", (pier_x + 88, deck_y + 132), load_font(14, bold=True), fill=C["teal"])
    _callout_line(draw, 980, 500, pier_x + 50, deck_y + 140, "구조물경사계", num="⑨")

    # ⑩-A 기초침하 측점
    fx = x0 + 30
    draw.line([(fx, ground_y - 8), (fx, ground_y - 38)], fill=_hex(C["teal"]), width=2)
    draw_arrow(draw, fx, ground_y - 38, fx, ground_y - 58, color=C["teal"], width=2)
    draw_label(draw, "↓침하", (fx + 36, ground_y - 48), load_font(11), fill=C["teal"])
    _callout_line(draw, 200, 580, fx, ground_y - 20, "기초침하", num="⑩-A")

    # ⑩-B 프리즘 + ATS LoS
    prx = x1 - 80
    draw_prism(draw, prx, ground_y - 6)
    ats_x = x1 + 60
    draw.rounded_rectangle([ats_x - 18, ground_y - 50, ats_x + 18, ground_y - 14], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "ATS", (ats_x, ground_y - 32), load_font(10, bold=True))
    for i in range(0, 80, 12):
        draw.line([(prx + i, ground_y - 20), (ats_x - 18, ground_y - 32)], fill=_hex(C["orange"]), width=1)
    _callout_line(draw, 1180, 600, prx, ground_y - 10, "프리즘·광파", num="⑩-B")

    _draw_right_panel(draw)

    # Bottom legend band
    draw.line([(100, 940), (1400, 940)], fill=_hex(C["gray"]), width=1)
    draw_label(
        draw,
        "상부구조 → 받침 → 교각/주탑/교대 → 기초  |  사장교 단일 형식  |  계측기 = 해당 부재 설치",
        (750, 970),
        load_font(13),
        fill=C["gray"],
    )

    return img
