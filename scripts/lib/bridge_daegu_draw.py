"""Bridge deflection, cable tension, strain, wind figures (IMG-103~109)."""
from __future__ import annotations

import math

from PIL import ImageDraw

from lib.bridge_draw import (
    draw_acc_node,
    draw_bridge_span,
    draw_info_panel,
    draw_prism,
    draw_tiltmeter_bracket,
)
from lib.datalogger_draw import C, _hex, draw_arrow, draw_label, draw_title, load_font, new_canvas


def _deflection_sag_pts(x0: int, x1: int, deck_y: int, sag: int = 28) -> list[tuple[int, int]]:
    pts = []
    for i in range(21):
        t = i / 20
        x = int(x0 + (x1 - x0) * t)
        y = deck_y + int(sag * math.sin(math.pi * t))
        pts.append((x, y))
    return pts


def _draw_deflection_graph(draw: ImageDraw.ImageDraw, x0: int, y0: int, x1: int, y1: int) -> None:
    draw.rounded_rectangle([x0, y0, x1, y1], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "시간–처짐량 δ", ((x0 + x1) // 2, y0 + 28), load_font(16, bold=True))
    gx0, gy0 = x0 + 48, y0 + 72
    gx1, gy1 = x1 - 48, y1 - 48
    draw.line([(gx0, gy1), (gx1, gy1)], fill=_hex(C["gray"]), width=2)
    draw.line([(gx0, gy1), (gx0, gy0)], fill=_hex(C["gray"]), width=2)
    draw_label(draw, "δ (mm)", (gx0 - 8, gy0 - 8), load_font(12), anchor="rm")
    draw_label(draw, "t", (gx1 + 8, gy1), load_font(12), anchor="lm")
    pts = []
    for i in range(40):
        t = i / 39
        x = int(gx0 + (gx1 - gx0) * t)
        y = int(gy1 - (gy1 - gy0) * 0.65 * (1 - math.exp(-t * 4)))
        pts.append((x, y))
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i + 1]], fill=_hex(C["teal"]), width=3)
    lim_y = int(gy1 - (gy1 - gy0) * 0.55)
    draw.line([(gx0, lim_y), (gx1, lim_y)], fill=_hex(C["orange"]), width=2)
    draw_label(draw, "L/600 (예)", (gx1 - 8, lim_y - 10), load_font(11), fill=C["orange"], anchor="rm")


def render_img103() -> object:
    """교량 상부구조 처짐 — fields/bridge/deflection hero."""
    img, draw = new_canvas()
    draw_title(draw, "교량 상부구조 처짐 계측도", "거더·PSC 박스 연직변위 δ · 처짐계·광파")

    deck_y, ground_y = 400, 700
    x0, x1 = 100, 920
    pier_xs = [360, 660]
    draw_bridge_span(draw, x0, x1, deck_y, ground_y, pier_xs=pier_xs, water_y=ground_y + 10)

    sag_pts = _deflection_sag_pts(x0 + 40, x1 - 40, deck_y + 14, 32)
    for i in range(len(sag_pts) - 1):
        draw.line([sag_pts[i], sag_pts[i + 1]], fill=_hex(C["teal"]), width=4)

    mid_x = (x0 + x1) // 2
    mid_y = deck_y + 46
    draw_arrow(draw, mid_x, deck_y - 20, mid_x, mid_y, color=C["teal"], width=3)
    draw_label(draw, "δ", (mid_x + 24, (deck_y + mid_y) // 2), load_font(18, bold=True), fill=C["teal"])

    for px in [280, mid_x, 780]:
        draw.rounded_rectangle([px - 18, deck_y + 52, px + 18, deck_y + 88], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
        draw_label(draw, "처짐계", (px, deck_y + 70), load_font(10, bold=True))

    draw_prism(draw, 200, deck_y - 6)
    draw_label(draw, "자동광파기", (200, ground_y - 60), load_font(12))

    _draw_deflection_graph(draw, 1040, 220, 1840, 520)
    draw_info_panel(
        draw, 1040, 540, 1840, 820, "교량 처짐",
        ["거더·교면 휨 연직변위", "침하계(지반)와 구분", "온도·재하·크리프 연계", "정적·동적 병행"],
    )
    return img


def render_img104() -> object:
    """처짐계 설치 개념도 — sensors/deflection-gauge."""
    img, draw = new_canvas()
    draw_title(draw, "처짐계 설치·측정 개념도", "LVDT·와이어·링타입 — 구조 처짐 전용")

    deck_y, ground_y = 380, 680
    x0, x1 = 140, 900
    draw_bridge_span(draw, x0, x1, deck_y, ground_y, pier_xs=[420, 700])

    sx = 520
    body_top, body_bot = deck_y + 36, deck_y + 88
    draw.rectangle([sx - 24, body_top, sx + 24, body_bot], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "LVDT", (sx, body_top + 28), load_font(12, bold=True))
    anchor_y = body_bot + 70
    draw.line([(sx, body_bot), (sx, anchor_y)], fill=_hex(C["gray"]), width=2)
    draw.rectangle([sx - 30, anchor_y, sx + 30, anchor_y + 12], fill=_hex(C["enc"]), outline=_hex(C["navy"]), width=2)
    draw_arrow(draw, sx + 40, deck_y + 8, sx + 40, deck_y + 42, color=C["teal"], width=2)
    draw_label(draw, "δ", (sx + 54, deck_y + 26), load_font(14, bold=True), fill=C["teal"])

    draw_label(draw, "① 처짐계", (sx, body_top - 18), load_font(13, bold=True), fill=C["teal"])
    draw_label(draw, "≠ 침하계(지반)", (sx, anchor_y + 36), load_font(13), fill=C["red"])

    draw_info_panel(
        draw, 1020, 200, 1840, 720, "처짐계 적용",
        ["PSC·강재 거더 mid-span", "와이어·레이저 대체 가능", "건축 보 처짐과 교차 링크", "지표침하·기초침하 별도"],
    )
    return img


def _draw_cable_stayed(draw: ImageDraw.ImageDraw, tower_x: int, deck_y: int, ground_y: int) -> None:
    draw.rectangle([tower_x - 22, deck_y - 180, tower_x + 22, ground_y], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)
    draw_label(draw, "주탑", (tower_x, deck_y - 200), load_font(16, bold=True))
    for cx in (tower_x - 200, tower_x - 120, tower_x + 120, tower_x + 200):
        draw.line([(tower_x, deck_y - 160), (cx, deck_y + 8)], fill=_hex(C["gray"]), width=2)
        draw.ellipse([cx - 8, deck_y, cx + 8, deck_y + 16], fill=_hex(C["navy"]))


def render_img105() -> object:
    """케이블 장력 계측도 — fields/bridge/cable-tension hero."""
    img, draw = new_canvas()
    draw_title(draw, "교량 케이블 장력 계측도", "사장교·현수교 주케이블 · 주파수법")

    deck_y, ground_y = 420, 720
    draw.rectangle([80, ground_y, 980, ground_y + 60], fill=_hex("#E8D4B8"))
    draw.rectangle([80, deck_y, 980, deck_y + 24], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)
    _draw_cable_stayed(draw, 520, deck_y, ground_y)

    cx = 620
    draw.rounded_rectangle([cx - 20, deck_y - 80, cx + 20, deck_y - 40], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "장력계", (cx, deck_y - 60), load_font(11, bold=True))
    draw_label(draw, "f → T", (cx + 50, deck_y - 60), load_font(14), fill=C["teal"])

    # frequency waveform inset
    wx0, wy0 = 1100, 260
    draw.rounded_rectangle([wx0, wy0, 1820, 480], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "주파수 분석 → 장력 T", (wx0 + 360, wy0 + 28), load_font(16, bold=True))
    px, py = wx0 + 40, wy0 + 120
    for i in range(120):
        x = wx0 + 40 + i * 6
        y = wy0 + 120 + int(30 * math.sin(i / 6))
        draw.line([(px, py), (x, y)], fill=_hex(C["teal"]), width=2)
        px, py = x, y

    draw_info_panel(
        draw, 1100, 500, 1840, 800, "케이블 장력",
        ["현수·사장·아치 케이블", "하중계(앵커)와 구분", "온도·진동 보조 계측", "유지관리 기준선"],
    )
    return img


def render_img106() -> object:
    """케이블장력계 설치 개념도 — sensors/cable-tension-meter."""
    img, draw = new_canvas()
    draw_title(draw, "케이블장력계(주파수법) 설치 개념도", "노출 케이블 · 가속·주파수 측정")

    deck_y = 400
    cy = 280
    draw.line([(200, deck_y), (900, deck_y)], fill=_hex(C["navy"]), width=4)
    draw.line([(520, deck_y), (520, 120)], fill=_hex(C["navy"]), width=3)
    draw.line([(520, 120), (320, deck_y)], fill=_hex(C["gray"]), width=2)
    draw.line([(520, 120), (720, deck_y)], fill=_hex(C["gray"]), width=2)

    sx, sy = 400, 250
    draw.rounded_rectangle([sx - 24, sy - 16, sx + 24, sy + 16], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "ACC", (sx, sy), load_font(11, bold=True))
    draw_label(draw, "케이블장력계", (sx, sy - 32), load_font(13, bold=True), fill=C["teal"])

    draw_label(draw, "≠ 로드셀(앵커)", (640, 180), load_font(14), fill=C["red"])

    draw_info_panel(
        draw, 1040, 200, 1840, 720, "측정 원리",
        ["고유진동수 f와 장력 T", "부분 장력계(현장별)", "긴장·조정 단계 기록", "대구 3호선 유지관리 사례"],
    )
    return img


def render_img107() -> object:
    """교량 변형률·응력 — fields/bridge/strain-stress hero."""
    img, draw = new_canvas()
    draw_title(draw, "교량 변형률·응력 계측도", "PSC·강재 휨응력 · 전단변형률 보조")

    deck_y, ground_y = 400, 700
    draw_bridge_span(draw, 120, 940, deck_y, ground_y, pier_xs=[380, 680])

    for gx in [260, 520, 780]:
        draw.rounded_rectangle([gx - 16, deck_y + 32, gx + 16, deck_y + 56], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
        draw_label(draw, "SG", (gx, deck_y + 44), load_font(11, bold=True))

    draw.rounded_rectangle([420, deck_y + 58, 460, deck_y + 78], fill=_hex(C["orange"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "전단 SG", (490, deck_y + 68), load_font(12), fill=C["orange"])

    draw_info_panel(
        draw, 1040, 200, 1840, 720, "변형률·응력",
        ["휨·축력 응력 환산", "온도·무응력계 보정", "사하중 제외 초기치", "KCS 24 99 05 유지관리"],
    )
    return img


def render_img108() -> object:
    """무응력계 설치 개념도 — sensors/stress-free-strain-gauge."""
    img, draw = new_canvas()
    draw_title(draw, "무응력계 설치 개념도", "건조수축·크리프 변형률 — 응력 0 보정")

    # Concrete block cross-section
    draw.rectangle([280, 280, 720, 680], fill=_hex("#E5E7EB"), outline=_hex(C["navy"]), width=3)
    draw_label(draw, "동일 콘크리트 매립", (500, 260), load_font(16, bold=True))

    draw.rounded_rectangle([460, 420, 540, 460], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "무응력계", (500, 440), load_font(11, bold=True))
    draw_label(draw, "ε₀ (응력 0)", (500, 500), load_font(14), fill=C["teal"])

    draw.rounded_rectangle([320, 360, 380, 400], fill=_hex(C["orange"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "일반 SG", (350, 380), load_font(10, bold=True))
    draw_label(draw, "σ+ε", (350, 420), load_font(12), fill=C["orange"])

    draw_info_panel(
        draw, 1040, 200, 1840, 720, "보정 관계",
        ["크리프·건조수축 분리", "변형률계 보정값", "별도 임계치 없음", "금호강교 유지관리 사례"],
    )
    return img


def render_img109() -> object:
    """교량 풍하중 계측도 — fields/bridge/wind hero."""
    img, draw = new_canvas()
    draw_title(draw, "교량 풍향·풍속 계측도", "주탑·교면 RM Young · 동적 거동 연계")

    deck_y, ground_y = 420, 720
    draw_bridge_span(draw, 100, 900, deck_y, ground_y, pier_xs=[400, 700])
    draw.rectangle([520 - 18, deck_y - 200, 520 + 18, ground_y], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "주탑", (520, deck_y - 220), load_font(16, bold=True))

    draw.rounded_rectangle([500, deck_y - 240, 540, deck_y - 200], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "풍속", (580, deck_y - 220), load_font(13, bold=True), fill=C["teal"])
    draw_arrow(draw, 620, deck_y - 220, 720, deck_y - 220, color=C["teal"], width=3)
    draw_label(draw, "풍향", (760, deck_y - 220), load_font(13))

    draw_acc_node(draw, 300, deck_y + 10)
    draw_label(draw, "진동계 연계", (300, deck_y + 40), load_font(12))

    draw_info_panel(
        draw, 1040, 200, 1840, 720, "풍하동",
        ["동적 처짐·진동 평가", "기상계측기와 역할 분리", "사면 강우용 hero 금지", "대구 3호선 사장교"],
    )
    return img


def render_img110() -> object:
    """교량 받침부 변위 — fields/bridge/bearing-displacement hero (BRI-BRG)."""
    img, draw = new_canvas()
    draw_title(draw, "교량 받침부 변위 계측도", "받침 슬라이드·회전 — ≠신축이음·GNSS 3축")

    deck_y, ground_y = 360, 680
    pier_x = 520
    girder_x0, girder_x1 = 120, 900

    draw.rectangle([pier_x - 80, ground_y - 120, pier_x + 80, ground_y], fill=_hex("#E5E7EB"), outline=_hex(C["navy"]), width=3)
    draw_label(draw, "교각", (pier_x, ground_y - 140), load_font(14, bold=True))

    bearing_y = deck_y + 36
    draw.rectangle([pier_x - 56, bearing_y, pier_x + 56, bearing_y + 18], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "받침", (pier_x, bearing_y + 9), load_font(11, bold=True))

    draw.rectangle([girder_x0, deck_y, girder_x1, deck_y + 32], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "거더", ((girder_x0 + girder_x1) // 2, deck_y - 18), load_font(14, bold=True))

    sx = pier_x + 70
    draw.rounded_rectangle([sx - 14, bearing_y - 8, sx + 14, bearing_y + 26], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "변위계", (sx + 36, bearing_y + 10), load_font(12, bold=True), fill=C["teal"])
    draw_arrow(draw, pier_x + 58, bearing_y + 10, pier_x + 98, bearing_y + 10, color=C["teal"], width=3)
    draw_label(draw, "슬라이드(mm)", (pier_x + 130, bearing_y + 10), load_font(12), fill=C["teal"])

    draw.line([(pier_x, bearing_y + 18), (pier_x, bearing_y + 50)], fill=_hex(C["orange"]), width=2)
    draw_label(draw, "회전(보조)", (pier_x + 50, bearing_y + 44), load_font(11), fill=C["orange"])

    draw_info_panel(
        draw, 1040, 200, 1840, 720, "받침부 변위",
        ["받침 상·하부 상대 이동", "신축이음량·절대좌표와 구분", "이동·고정 받침 구분", "온도·침하 교차 해석"],
    )
    return img
