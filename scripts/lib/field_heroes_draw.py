"""Field-specific hero figures (IMG-080~088) — split shared sensor diagrams."""
from __future__ import annotations

import math

from PIL import ImageDraw

from lib.bridge_draw import (
    draw_acc_node,
    draw_bridge_span,
    draw_expansion_joint,
    draw_info_panel,
    draw_prism,
    draw_seismic_wave,
    draw_total_station,
)
from lib.datalogger_draw import C, W, _hex, draw_arrow, draw_label, draw_title, load_font, new_canvas
from lib.tunnel_support_draw import _draw_tunnel_lining


def render_img080() -> object:
    """강지보(스틸 세트) 응력 — multi-point strain for axial + bending."""
    img, draw = new_canvas()
    draw_title(draw, "강지보 응력 계측 개념도", "천단·어깨·측벽 — 내외측·플랜지/웹 다점 계측")

    _draw_tunnel_lining(draw)

    # Single steel set rib with multiple SG locations
    x = 520
    draw.rectangle([x - 12, 380, x + 12, 680], fill=_hex(C["navy"]), outline=_hex(C["navy"]))
    draw.rectangle([x - 40, 420, x + 40, 440], fill=_hex(C["gray"]), outline=_hex(C["navy"]))
    draw.rectangle([x - 40, 620, x + 40, 640], fill=_hex(C["gray"]), outline=_hex(C["navy"]))
    draw_label(draw, "상부 플랜지", (x + 70, 430), load_font(12))
    draw_label(draw, "하부 플랜지", (x + 70, 630), load_font(12))
    draw_label(draw, "웹", (x + 70, 540), load_font(12))

    sg_points = [
        (x - 28, 430, "SG·외측"),
        (x + 28, 430, "SG·내측"),
        (x - 28, 630, "SG·외측"),
        (x + 28, 630, "SG·내측"),
        (x, 500, "천단"),
        (x, 580, "측벽"),
    ]
    for sx, sy, lab in sg_points:
        draw.rounded_rectangle([sx - 14, sy - 8, sx + 14, sy + 8], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
        draw_label(draw, "SG", (sx, sy), load_font(10, bold=True))
        if "천단" in lab or "측벽" in lab:
            draw_label(draw, lab, (sx + 50, sy), load_font(11), fill=C["gray"])

    draw_label(draw, "스틸 세트", (520, 340), load_font(22, bold=True))
    draw_label(draw, "2점/4점 → 축력·휨 분리 해석", (520, 365), load_font(14), fill=C["teal"])

    px = 1180
    draw.rounded_rectangle([px, 220, 1840, 720], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "강지보 계측", (1510, 260), load_font(22, bold=True))
    for i, t in enumerate([
        "천단·어깨·측벽 위치 구분",
        "플랜지 내측/외측 대칭 계측",
        "웹·플랜지 부위 명시",
        "단일 플랜지 ≠ 전체 응력",
    ]):
        draw_label(draw, f"• {t}", (px + 32, 320 + i * 44), load_font(18), anchor="lm")
    return img


def render_img081() -> object:
    """기둥 축소량 — building column shortening."""
    img, draw = new_canvas()
    draw_title(draw, "기둥 축소량 계측 개념도", "수직 변형률계·층별 축소량")

    # Building frame simplified
    for col_x in [400, 620, 840]:
        draw.rectangle([col_x - 25, 280, col_x + 25, 720], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)
        for fy in [360, 480, 600]:
            draw.rectangle([col_x - 200, fy, col_x + 200, fy + 18], fill=_hex(C["gray"]), outline=_hex(C["navy"]))
        for gy in [320, 440, 560, 680]:
            draw.rounded_rectangle([col_x - 14, gy, col_x + 14, gy + 22], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
            draw_label(draw, "SG", (col_x, gy + 11), load_font(11, bold=True))

    draw_label(draw, "슬래브", (620, 250), load_font(18), fill=C["gray"])
    draw.line([(350, 720), (910, 720)], fill=_hex(C["navy"]), width=4)
    draw_label(draw, "기초", (620, 750), load_font(18))

    px = 1100
    draw.rounded_rectangle([px, 240, 1840, 700], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "축소량 해석", (1470, 280), load_font(22, bold=True))
    for i, t in enumerate(["콘크리트 수화열·크리프", "층별 누적 축소량", "슬래브 처짐·기둥 단축 연계", "시공 단계별 재하 이력"]):
        draw_label(draw, f"• {t}", (px + 32, 340 + i * 44), load_font(18), anchor="lm")
    return img


def render_img082() -> object:
    """건축 응력·변형률 — building stress-strain."""
    img, draw = new_canvas()
    draw_title(draw, "응력·변형률 계측 개념도", "중대 부재·하중계·변형률계")

    draw.rectangle([500, 300, 900, 720], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)
    draw_label(draw, "중대 부재", (700, 280), load_font(20, bold=True))
    draw.rounded_rectangle([680, 400, 720, 440], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "LC", (700, 420), load_font(14, bold=True))
    draw_label(draw, "하중계", (760, 420), load_font(16))

    for gy in [360, 500, 640]:
        draw.rounded_rectangle([540, gy, 580, gy + 24], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
        draw_label(draw, "SG", (560, gy + 12), load_font(12, bold=True))

    draw_arrow(draw, 700, 300, 700, 260, width=3)
    draw_label(draw, "축력 P", (730, 270), load_font(16))

    px = 1100
    draw.rounded_rectangle([px, 220, 1840, 680], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "KCS 3.9 적용", (1470, 260), load_font(22, bold=True))
    for i, t in enumerate(["시공 중 설치·준공까지", "프리스트레스·재하 순서 연동", "온도·수화열 보정", "설계 대비 응력 수준"]):
        draw_label(draw, f"• {t}", (px + 32, 320 + i * 44), load_font(18), anchor="lm")
    return img


def render_img083() -> object:
    """댐 변형률 — dam strain."""
    img, draw = new_canvas()
    draw_title(draw, "댐 변형률 계측 개념도", "제체·기초 매립 변형률계")

    # Dam cross-section (trapezoid)
    draw.polygon([(200, 720), (500, 400), (900, 400), (1100, 720)], fill=_hex("#E8D4B8"), outline=_hex(C["navy"]), width=3)
    draw.line([(200, 720), (1100, 720)], fill=_hex(C["teal"]), width=2)
    draw_label(draw, "수위", (150, 600), load_font(16), fill=C["teal"])

    for sx, sy in [(420, 520), (550, 480), (700, 500), (820, 560)]:
        draw.rounded_rectangle([sx - 16, sy - 10, sx + 16, sy + 10], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
        draw_label(draw, "SG", (sx, sy), load_font(11, bold=True))

    draw_label(draw, "제체", (650, 380), load_font(20, bold=True))

    px = 1200
    draw.rounded_rectangle([px, 240, 1840, 700], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "댐 변형 모니터링", (1520, 280), load_font(22, bold=True))
    for i, t in enumerate(["수위 상승 시 제체 변형", "간극수압·변위 연계", "장기 크리프 추세", "균열·누수 징후 보조"]):
        draw_label(draw, f"• {t}", (px + 32, 340 + i * 44), load_font(18), anchor="lm")
    return img


def render_img084() -> object:
    """항만구조물 변위 — harbor structure."""
    img, draw = new_canvas()
    draw_title(draw, "항만구조물 변위 계측 개념도", "케이슨·안벽 변위계·경사계")

    ground_y = 700
    draw.rectangle([120, ground_y, 1000, 820], fill=_hex("#E8D4B8"))
    draw.rectangle([700, 480, 1000, ground_y], fill=_hex("#BEE3F8"))
    draw.rectangle([700, 380, 1000, ground_y], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)
    draw_label(draw, "케이슨·안벽", (850, 360), load_font(20, bold=True))

    draw.rounded_rectangle([780, 420, 820, 460], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "변위계", (860, 440), load_font(14))
    draw.rounded_rectangle([720, ground_y - 30, 760, ground_y], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "반력계", (780, ground_y - 15), load_font(14))

    px = 1120
    draw.rounded_rectangle([px, 220, 1840, 680], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "해측·육측 연계", (1480, 260), load_font(22, bold=True))
    for i, t in enumerate(["조위·지반 반응", "구조물 변위·경사", "뒤채움 침하", "장기 유지관리"]):
        draw_label(draw, f"• {t}", (px + 32, 320 + i * 44), load_font(18), anchor="lm")
    return img


def render_img085() -> object:
    """교량 종·횡변위 — bridge deck displacement (BRI-02·03)."""
    img, draw = new_canvas()
    draw_title(draw, "교량 종·횡변위 계측 개념도", "신축이음·상부구조 변위계 · 자동광파기·프리즘")

    deck_y, ground_y = 380, 680
    x0, x1 = 120, 980
    pier_xs = [420, 720]
    draw_bridge_span(draw, x0, x1, deck_y, ground_y, pier_xs=pier_xs, water_y=ground_y + 20)

    jx = 860
    draw_expansion_joint(draw, jx, deck_y)
    draw.rounded_rectangle([jx - 50, deck_y - 52, jx + 50, deck_y - 18], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "변위계(LVDT)", (jx, deck_y - 35), load_font(12, bold=True))

    draw_arrow(draw, jx - 80, deck_y - 60, jx - 20, deck_y - 60, width=3)
    draw_label(draw, "종방향(X)", (jx - 50, deck_y - 82), load_font(14), fill=C["teal"])
    draw_arrow(draw, jx, deck_y - 70, jx, deck_y - 110, width=3)
    draw_label(draw, "횡방향(Y)", (jx + 50, deck_y - 90), load_font(14), fill=C["teal"])

    for px in [280, 580, 880]:
        draw_prism(draw, px, deck_y - 8)
    draw_total_station(draw, 200, ground_y)
    for tx, ty in [(280, deck_y - 8), (580, deck_y - 8), (880, deck_y - 8)]:
        draw.line([(200, ground_y - 40), (tx, ty)], fill=_hex(C["teal"]), width=1)

    draw_label(draw, "교대", (x0 - 20, deck_y + 100), load_font(14), fill=C["gray"])
    draw_info_panel(
        draw,
        1060,
        200,
        1840,
        720,
        "교량 변위 계측",
        [
            "신축이음 LVDT — 3축 변위",
            "프리즘 + 자동광파기(토탈스테이션)",
            "온도·재하·지진 후 거동",
            "교각·교대·상부구조 연계",
        ],
    )
    return img


def render_img086() -> object:
    """교량 진동 — bridge vibration (BRI-02·03)."""
    img, draw = new_canvas()
    draw_title(draw, "교량 진동 계측 개념도", "거더·교면 가속도계 · 통행·지진 동적 응답")

    deck_y, ground_y = 360, 680
    x0, x1 = 100, 960
    pier_xs = [380, 680]
    draw_bridge_span(draw, x0, x1, deck_y, ground_y, pier_xs=pier_xs)

    acc_xs = [200, 340, 480, 620, 760, 900]
    for ax in acc_xs:
        draw_acc_node(draw, ax, deck_y + 14)

    # Traffic load schematic
    draw.rounded_rectangle([520, deck_y - 70, 620, deck_y - 30], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)
    draw.ellipse([535, deck_y - 28, 555, deck_y - 8], fill=_hex(C["navy"]))
    draw.ellipse([585, deck_y - 28, 605, deck_y - 8], fill=_hex(C["navy"]))
    draw_label(draw, "통행 하중", (570, deck_y - 88), load_font(14, bold=True))
    draw_arrow(draw, 570, deck_y - 24, 570, deck_y + 2, width=3)

    draw_label(draw, "거더", (480, deck_y + 48), load_font(13), fill=C["gray"])
    draw_info_panel(
        draw,
        1040,
        200,
        1840,
        720,
        "동적 응답",
        [
            "교면·거더 ACC 다점 배치",
            "통행·지진 이벤트 식별",
            "모드·고유진동 추정",
            "동적 DAQ · 피로·내구 평가",
        ],
    )
    return img


def render_img087() -> object:
    """교량 지진 계측 — bridge seismic (BRI-02·03)."""
    img, draw = new_canvas()
    draw_title(draw, "교량 지진·진동 계측 개념도", "교각·상부구조 강진동계 · 응답 스펙트럼")

    deck_y, ground_y = 320, 680
    x0, x1 = 280, 820
    pier_xs = [550]
    draw_bridge_span(draw, x0, x1, deck_y, ground_y, pier_xs=pier_xs, show_bearings=True)

    for sy in [deck_y + 40, deck_y + 120, deck_y + 200]:
        draw_acc_node(draw, pier_xs[0] + 36, sy)
        draw_arrow(draw, pier_xs[0] + 16, sy, pier_xs[0] + 22, sy, width=2)
    draw_acc_node(draw, 420, deck_y + 14)
    draw_acc_node(draw, 680, deck_y + 14)

    draw_seismic_wave(draw, 120, 360, ground_y + 30)
    draw_label(draw, "설계 지진", (140, ground_y + 60), load_font(14), fill=C["orange"])

    # Mini response spectrum
    gx0, gy0 = 880, 420
    draw.rounded_rectangle([gx0, 280, gx0 + 420, 720], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "응답 스펙트럼 (예시)", (gx0 + 210, 310), load_font(18, bold=True))
    draw.line([(gx0 + 40, 680), (gx0 + 380, 680)], fill=_hex(C["gray"]), width=1)
    draw.line([(gx0 + 40, 360), (gx0 + 40, 680)], fill=_hex(C["gray"]), width=1)
    pts = [(gx0 + 40 + i * 16, 680 - int(280 * math.exp(-i / 8))) for i in range(22)]
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i + 1]], fill=_hex(C["teal"]), width=3)
    draw_label(draw, "주기 T", (gx0 + 210, 700), load_font(14), fill=C["gray"])
    draw_label(draw, "Sa", (gx0 + 20, 520), load_font(14), fill=C["gray"], anchor="mm")

    draw_info_panel(
        draw,
        1340,
        200,
        1840,
        720,
        "지진·내진",
        [
            "교각·거더 ACC 다층",
            "기준·설계 지진 대비",
            "PPV·스펙트럼 분석",
            "사후 손상·운행 제한",
        ],
    )
    return img


def render_img088() -> object:
    """교량 온도 계측 — bridge deck temperature (BRI-02·03)."""
    img, draw = new_canvas()
    draw_title(draw, "교량 온도 계측 개념도", "교면·거더 매립 온도계 · 수화열·계절 변동")

    # Deck cross-section (concrete + steel girder)
    cx0, cy0, cx1, cy1 = 180, 280, 720, 760
    draw.rectangle([cx0, cy0 + 80, cx1, cy1], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)
    draw.rectangle([cx0 + 40, cy0 + 80, cx1 - 40, cy0 + 160], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "교면 슬래브", ((cx0 + cx1) // 2, cy0 + 50), load_font(18, bold=True))
    draw.rectangle([cx0 + 120, cy0 + 160, cx0 + 180, cy1 - 40], fill=_hex("#9CA3AF"), outline=_hex(C["navy"]), width=2)
    draw.rectangle([cx0 + 380, cy0 + 160, cx0 + 440, cy1 - 40], fill=_hex("#9CA3AF"), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "거더(강재)", (cx0 + 150, cy1 - 10), load_font(14), fill=C["gray"])

    for ty in [cy0 + 120, cy0 + 220, cy0 + 340, cy0 + 460, cy0 + 580]:
        draw.ellipse([cx0 - 28, ty - 8, cx0 - 4, ty + 8], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
        draw.line([(cx0 - 16, ty), (cx0, ty)], fill=_hex(C["teal"]), width=2)
        draw_label(draw, "T", (cx0 - 44, ty), load_font(13, bold=True), anchor="rm")

    draw_label(draw, "일조·외기", (cx0 + 20, cy0 + 100), load_font(13), fill=C["orange"])
    draw_arrow(draw, cx0 + 60, cy0 + 60, cx0 + 60, cy0 + 90, width=2, color=C["orange"])

    gx0 = 820
    draw.rounded_rectangle([gx0, 280, gx0 + 480, 760], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "온도 이력 (예시)", (gx0 + 240, 310), load_font(20, bold=True))
    draw.line([(gx0 + 40, 690), (gx0 + 440, 690)], fill=_hex(C["gray"]), width=1)
    draw.line([(gx0 + 40, 360), (gx0 + 40, 690)], fill=_hex(C["gray"]), width=1)
    pts = [(gx0 + 40 + i * 18, 520 - int(90 * math.sin(i / 3))) for i in range(22)]
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i + 1]], fill=_hex(C["teal"]), width=3)
    draw_label(draw, "계절·일교차", (gx0 + 240, 720), load_font(16), fill=C["gray"])

    draw_info_panel(
        draw,
        1340,
        200,
        1840,
        720,
        "온도·열응력",
        [
            "슬래브·거더 다층 온도계",
            "수화열·크리프 보정",
            "신축이음·변위 연계",
            "한랭·고온 운행 관리",
        ],
    )
    return img
