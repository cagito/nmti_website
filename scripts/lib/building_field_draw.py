"""Building construction monitoring figures (IMG-100~101, 081~082).

BLD-H-01~03 · INSTRUMENTATION §3.27~28 — Pillow only (no SVG).
"""
from __future__ import annotations

import math

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, _hex, draw_arrow, draw_label, load_font

MAIN_R = 1060
PANEL_L = 1072
BOTTOM_Y = 920


def _panel_box(draw: ImageDraw.ImageDraw, x0: int, y0: int, x1: int, y1: int, title: str) -> None:
    draw.rounded_rectangle([x0, y0, x1, y1], outline=_hex(C["navy"]), width=2, fill=_hex(C["white"]))
    draw_label(draw, title, ((x0 + x1) // 2, y0 + 18), load_font(13, bold=True))


def _rc_tower(draw: ImageDraw.ImageDraw, x0: int, ground: int, floors: int = 8) -> tuple[int, int]:
    """Simple RC tower — returns (center_x, top_y)."""
    w = 140
    cx = x0 + w // 2
    top = ground - floors * 52
    draw.rectangle([x0, top, x0 + w, ground], fill=_hex("#E5E7EB"), outline=_hex(C["navy"]), width=2)
    for f in range(floors + 1):
        fy = ground - f * 52
        draw.line([(x0, fy), (x0 + w, fy)], fill=_hex(C["gray"]), width=1)
    return cx, top


def render_img100(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    """건축공사 계측 전체 개념도 — KCS 3.9."""
    draw_label(draw, "건축공사 계측 개념도", (MAIN_R // 2, 42), font_title)
    draw_label(draw, "KCS 3.9 — Deflection · Shortening · Crack · Adjacent · Stress", (MAIN_R // 2, 82), load_font(17), fill=C["gray"])
    draw.line([(PANEL_L - 8, 100), (PANEL_L - 8, 960)], fill=_hex(C["light"]), width=2)

    f11 = load_font(11)
    f10 = load_font(10)
    ground = BOTTOM_Y - 48
    draw.rectangle([72, 108, MAIN_R, BOTTOM_Y], outline=_hex(C["navy"]), width=2)

    cx, top = _rc_tower(draw, 200, ground, 9)
    draw_label(draw, "시공 중 건축물", (cx, top - 24), f11, fill=C["navy"])

    # ① LVDT on floor slab edge
    beam_y = ground - 3 * 52
    draw.rectangle([cx - 90, beam_y - 8, cx + 90, beam_y], fill=_hex("#9CA3AF"), outline=_hex(C["navy"]), width=1)
    draw.rounded_rectangle([cx - 18, beam_y + 6, cx + 18, beam_y + 34], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "① LVDT", (cx, beam_y + 48), f10, fill=C["teal"])

    # ② SG on column
    col_x = cx - 50
    sg_y = ground - 5 * 52
    draw.rounded_rectangle([col_x - 12, sg_y, col_x + 12, sg_y + 20], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "② SG", (col_x, sg_y - 14), f10, fill=C["teal"])

    # ③ crack on facade
    crack_x = cx + 62
    draw.line([(crack_x, ground - 6 * 52), (crack_x, ground - 2 * 52)], fill=_hex(C["red"]), width=2)
    draw.line([(crack_x - 30, ground - 4 * 52), (crack_x + 30, ground - 4 * 52)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "③ 균열계", (crack_x + 36, ground - 4 * 52), f10, fill=C["red"], anchor="lm")

    # Adjacent low building
    adj_x0 = 520
    draw.rectangle([adj_x0, ground - 120, adj_x0 + 100, ground], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "인접 건물", (adj_x0 + 50, ground - 140), f10, fill=C["gray"])
    draw.polygon([(adj_x0 + 110, ground - 100), (adj_x0 + 130, ground - 108), (adj_x0 + 130, ground - 92)], fill=_hex(C["orange"]))
    draw_label(draw, "④ 경사 θ", (adj_x0 + 145, ground - 100), f10, fill=C["orange"], anchor="lm")

    # ATS
    ts_x, ts_y = 780, ground - 200
    draw.rectangle([ts_x, ts_y, ts_x + 36, ts_y + 28], fill=_hex(C["navy"]), outline=_hex(C["navy"]), width=1)
    draw.line([(ts_x + 18, ts_y + 28), (adj_x0 + 50, ground - 130)], fill=_hex(C["teal"]), width=1)
    draw.ellipse([adj_x0 + 44, ground - 136, adj_x0 + 56, ground - 124], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "⑤ ATS", (ts_x + 18, ts_y - 12), f10, fill=C["navy"])

    # ⑥ Load cell on critical member inset
    draw.rounded_rectangle([cx - 30, ground - 7 * 52, cx + 30, ground - 7 * 52 + 22], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "⑥ LC", (cx, ground - 7 * 52 - 12), f10, fill=C["teal"])

    # Right panel — five KCS items
    x0, y0, x1, y1 = PANEL_L, 108, PANEL_L + 792, 520
    _panel_box(draw, x0, y0, x1, y1, "KCS 3.9 계측 항목")
    items = [
        ("처짐", "LVDT·레이저·ATS", C["teal"]),
        ("기둥 축소", "변형률계·층별 누적", C["navy"]),
        ("균열", "균열계·폭 추세", C["red"]),
        ("주변건물", "균열·경사·ATS", C["orange"]),
        ("응력·변형률", "하중계·SG", C["gray"]),
    ]
    ly = y0 + 52
    for title, sub, col in items:
        draw.ellipse([x0 + 44, ly - 6, x0 + 56, ly + 6], fill=_hex(col))
        draw_label(draw, title, (x0 + 68, ly), f11, anchor="lm", fill=col)
        draw_label(draw, sub, (x0 + 200, ly), f10, anchor="lm", fill=C["gray"])
        ly += 36

    x0, y0, x1, y1 = PANEL_L, 548, PANEL_L + 792, 950
    _panel_box(draw, x0, y0, x1, y1, "금지 · BLD-H-01")
    for i, t in enumerate(
        [
            "구조물 안전계측(IMG-022) hero 재사용 금지",
            "침하계·성토 Figure — 처짐 hero 금지 (DEF-01)",
            "토목 연약지반 단면 — RC 골조 중심",
        ]
    ):
        draw_label(draw, f"· {t}", (x0 + 40, y0 + 52 + i * 32), f11, anchor="lm")


def render_img101(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    """건축공사 주변건물 — 신축 현장 + 인접 건물 (굴착 흙막이 주 배경 금지)."""
    draw_label(draw, "건축공사 주변건물 계측", (MAIN_R // 2, 42), font_title)
    draw_label(draw, "Adjacent Buildings — Crack · Tilt · ATS (Building Context)", (MAIN_R // 2, 82), load_font(17), fill=C["gray"])
    draw.line([(PANEL_L - 8, 100), (PANEL_L - 8, 960)], fill=_hex(C["light"]), width=2)

    f11 = load_font(11)
    f10 = load_font(10)
    ground = BOTTOM_Y - 48
    draw.rectangle([72, 108, MAIN_R, BOTTOM_Y], outline=_hex(C["navy"]), width=2)
    draw.line([(72, ground), (MAIN_R - 16, ground)], fill=_hex(C["navy"]), width=2)

    # New building under construction (left)
    cx, top = _rc_tower(draw, 120, ground, 7)
    draw_label(draw, "신축 건축현장", (cx, top - 22), f11, fill=C["navy"])
    # Crane hint
    draw.line([(cx + 80, top - 60), (cx + 80, top - 10)], fill=_hex(C["gray"]), width=3)
    draw.line([(cx + 80, top - 60), (cx + 30, top - 40)], fill=_hex(C["gray"]), width=2)

    # Adjacent existing buildings (right)
    for i, ax in enumerate((480, 620, 760)):
        h = 100 + i * 20
        draw.rectangle([ax, ground - h, ax + 90, ground], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
        draw_label(draw, f"인접{i + 1}", (ax + 45, ground - h - 16), f10, fill=C["gray"])
        # Crack meter on facade
        crack_x = ax + 45
        draw.line([(crack_x, ground - h + 20), (crack_x, ground - 40)], fill=_hex(C["red"]), width=2)
        draw.line([(crack_x - 22, ground - h // 2), (crack_x + 22, ground - h // 2)], fill=_hex(C["navy"]), width=2)
        # Tilt on wall
        draw.polygon([(ax + 92, ground - h + 30), (ax + 112, ground - h + 22), (ax + 112, ground - h + 38)], fill=_hex(C["orange"]))

    draw_label(draw, "① 균열계", (540, ground - 70), f10, fill=C["red"])
    draw_label(draw, "② 구조물경사계 θ", (680, ground - 90), f10, fill=C["orange"])

    # ATS network
    ts_x, ts_y = 340, ground - 280
    draw.rectangle([ts_x, ts_y, ts_x + 32, ts_y + 24], fill=_hex(C["navy"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "TS", (ts_x + 16, ts_y + 12), load_font(9, bold=True), fill=C["white"])
    for px, py in [(525, ground - 130), (665, ground - 150), (805, ground - 170)]:
        draw.line([(ts_x + 16, ts_y + 24), (px, py)], fill=_hex(C["teal"]), width=1)
        draw.ellipse([px - 6, py - 6, px + 6, py + 6], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "③ ATS·프리즘", (ts_x + 16, ts_y - 14), f10, fill=C["navy"])

    # Right panels
    x0, y0, x1, y1 = PANEL_L, 108, PANEL_L + 792, 400
    _panel_box(draw, x0, y0, x1, y1, "계측 원칙")
    for i, t in enumerate(
        [
            "사전·공사 중·종료 후 3단계 기록",
            "굴착·발파·타설 일지 시간 동기화",
            "균열·경사·변위 동시 변화 우선 검토",
        ]
    ):
        draw_label(draw, f"· {t}", (x0 + 36, y0 + 48 + i * 30), f11, anchor="lm")

    x0, y0, x1, y1 = PANEL_L, 420, PANEL_L + 792, 950
    _panel_box(draw, x0, y0, x1, y1, "BLD-ADJ-01 · IMG-005와 구분")
    draw_label(draw, "건축 hero: 신축+인접 건물 중심", (x0 + 40, y0 + 48), f11, anchor="lm")
    draw_label(draw, "굴착 흙막이·버팀보 주 배경 금지", (x0 + 40, y0 + 80), f11, anchor="lm", fill=C["red"])
    draw_label(draw, "가시설 주변건물 → IMG-005 유지", (x0 + 40, y0 + 112), f10, anchor="lm", fill=C["gray"])


def render_img081(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    """기둥 축소량 — v2 split panel."""
    draw_label(draw, "기둥 축소량 계측", (MAIN_R // 2, 42), font_title)
    draw_label(draw, "Column Shortening — Strain Gauge · Cumulative per Floor", (MAIN_R // 2, 82), load_font(17), fill=C["gray"])
    draw.line([(PANEL_L - 8, 100), (PANEL_L - 8, 960)], fill=_hex(C["light"]), width=2)

    f11 = load_font(11)
    f10 = load_font(10)
    ground = BOTTOM_Y - 56
    draw.rectangle([56, 108, MAIN_R, BOTTOM_Y], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "기둥 축소량 설치 개념도", (MAIN_R // 2, 128), f11)

    cols = [280, 480, 680]
    for col_x in cols:
        draw.rectangle([col_x - 32, 260, col_x + 32, ground], fill=_hex("#E5E7EB"), outline=_hex(C["navy"]), width=2)
        for fy in [340, 440, 540, 640]:
            draw.rectangle([col_x - 160, fy, col_x + 160, fy + 14], fill=_hex("#9CA3AF"), outline=_hex(C["gray"]), width=1)
        for gy in [300, 400, 500, 600, 700]:
            draw.rounded_rectangle([col_x - 14, gy, col_x + 14, gy + 22], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
            draw_label(draw, "SG", (col_x, gy + 11), load_font(9, bold=True))
        draw_arrow(draw, col_x, 250, col_x, 280, color=C["red"], width=2)
        draw_label(draw, "축방향 ε", (col_x + 24, 265), f10, fill=C["red"])

    draw.line([(200, ground), (820, ground)], fill=_hex(C["navy"]), width=3)
    draw_label(draw, "기초", (500, ground + 20), f11)

    # Cumulative chart
    x0, y0, x1, y1 = PANEL_L, 108, PANEL_L + 792, 520
    _panel_box(draw, x0, y0, x1, y1, "층별 축소 누적 예시")
    gx0, gy0, gw, gh = x0 + 64, y0 + 56, 280, y1 - y0 - 100
    draw.line([(gx0, gy0), (gx0, gy0 + gh)], fill=_hex(C["navy"]), width=1)
    draw.line([(gx0, gy0 + gh), (gx0 + gw, gy0 + gh)], fill=_hex(C["navy"]), width=1)
    for fl, mm in enumerate([0, 2, 5, 9, 14, 20]):
        yy = gy0 + gh - int(gh * mm / 22)
        xx = gx0 + int(gw * fl / 5)
        draw.ellipse([xx - 4, yy - 4, xx + 4, yy + 4], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
        if fl > 0:
            px = gx0 + int(gw * (fl - 1) / 5)
            py = gy0 + gh - int(gh * [0, 2, 5, 9, 14, 20][fl - 1] / 22)
            draw.line([(px, py), (xx, yy)], fill=_hex(C["teal"]), width=2)
        draw_label(draw, f"{fl}F", (xx, gy0 + gh + 12), f10, fill=C["gray"])
    draw_label(draw, "누적 축소(mm)", (gx0 - 8, gy0 + gh // 2), f10, fill=C["gray"], anchor="rm")

    bx = gx0 + gw + 48
    for i, t in enumerate(["수화열·크리프", "층 승장 시 측정", "비대칭 축소 → 슬래브 영향"]):
        draw_label(draw, f"· {t}", (bx, y0 + 72 + i * 28), f11, anchor="lm")

    x0, y0, x1, y1 = PANEL_L, 548, PANEL_L + 792, 950
    _panel_box(draw, x0, y0, x1, y1, "KCS 3.9.1.1② 요약")
    for i, t in enumerate(
        [
            "주요 기둥·코아벽체 축방향 중심",
            "매 층 승장 시 최소 1회",
            "온도·강도 시험 연동",
            "슬래브 처짐·기둥 단축 연계 해석",
        ]
    ):
        draw_label(draw, f"· {t}", (x0 + 40, y0 + 52 + i * 36), f11, anchor="lm")


def render_img082(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    """응력·변형률 — v2."""
    draw_label(draw, "응력·변형률 계측", (MAIN_R // 2, 42), font_title)
    draw_label(draw, "Stress & Strain — Load Cell · SG on Critical Members", (MAIN_R // 2, 82), load_font(17), fill=C["gray"])
    draw.line([(PANEL_L - 8, 100), (PANEL_L - 8, 960)], fill=_hex(C["light"]), width=2)

    f11 = load_font(11)
    f10 = load_font(10)
    draw.rectangle([56, 108, MAIN_R, BOTTOM_Y], outline=_hex(C["navy"]), width=2)

    # Transfer girder / critical beam
    draw.rectangle([220, 380, 860, 720], fill=_hex("#E5E7EB"), outline=_hex(C["navy"]), width=3)
    draw_label(draw, "중대 부재 (전이보)", (540, 360), f11, fill=C["navy"])

    draw.rounded_rectangle([520, 480, 560, 520], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "① LC", (540, 540), f10, fill=C["teal"])
    draw_arrow(draw, 540, 350, 540, 380, color=C["red"], width=3)
    draw_label(draw, "축력 P", (570, 365), f11, fill=C["red"])

    for sx in [300, 420, 660, 780]:
        draw.rounded_rectangle([sx - 16, 500, sx + 16, 524], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
        draw_label(draw, "SG", (sx, 512), load_font(9, bold=True))

    # Right — stress vs strain panel
    x0, y0, x1, y1 = PANEL_L, 108, PANEL_L + 792, 520
    _panel_box(draw, x0, y0, x1, y1, "하중-변형 관계 예시")
    gx0, gy0, gw, gh = x0 + 72, y0 + 56, 320, y1 - y0 - 88
    draw.line([(gx0, gy0), (gx0, gy0 + gh)], fill=_hex(C["navy"]), width=1)
    draw.line([(gx0, gy0 + gh), (gx0 + gw, gy0 + gh)], fill=_hex(C["navy"]), width=1)
    draw_label(draw, "ε", (gx0 - 10, gy0 + 8), f10, fill=C["gray"], anchor="rm")
    draw_label(draw, "단계", (gx0 + gw // 2, gy0 + gh + 16), f10, fill=C["gray"])
    pts = [(0, 0.1), (0.25, 0.35), (0.5, 0.55), (0.75, 0.72), (1.0, 0.85)]
    for i in range(len(pts) - 1):
        x1p = gx0 + int(gw * pts[i][0])
        y1p = gy0 + gh - int(gh * pts[i][1])
        x2p = gx0 + int(gw * pts[i + 1][0])
        y2p = gy0 + gh - int(gh * pts[i + 1][1])
        draw.line([(x1p, y1p), (x2p, y2p)], fill=_hex(C["teal"]), width=2)

    bx = gx0 + gw + 40
    draw_label(draw, "· 하중계: 축력·지점반력", (bx, y0 + 72), f11, anchor="lm")
    draw_label(draw, "· SG: 부재 변형률", (bx, y0 + 104), f11, anchor="lm")
    draw_label(draw, "· 시공~준공 측정", (bx, y0 + 136), f11, anchor="lm")

    x0, y0, x1, y1 = PANEL_L, 548, PANEL_L + 792, 950
    _panel_box(draw, x0, y0, x1, y1, "KCS 3.9.1.1⑤⑥")
    for i, t in enumerate(
        [
            "매우 중대 부재 응력",
            "주요 건축물 변형률",
            "프리스트레스·재하 순서 연동",
            "설계 대비 응력 수준 검토",
        ]
    ):
        draw_label(draw, f"· {t}", (x0 + 40, y0 + 52 + i * 36), f11, anchor="lm")
