"""Dam safety monitoring system diagram (IMG-024 v3).

docs/39 · INSTRUMENTATION §3.25 v2 · DAM-01~07 — earthfill · 6 items · data flow.
"""
from __future__ import annotations

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, load_font

LEFT_R = 1180
RIGHT_L = 1190
MAIN_TOP = 118
MAIN_BOT = 818
FOOTER_Y = 828
BOTTOM_Y = 900
ROCK_Y = 780
CREST_Y = 320
WATER_Y = 400

SOIL = "#E8D4B8"
CORE = "#C4A574"
FILTER = "#D4C4A8"
DRAIN = "#D1D5DB"
ROCK = "#9CA3AF"
BLUE = "#3B82F6"

PHREATIC = [(220, WATER_Y), (340, 440), (480, 490), (620, 530), (780, 560), (920, 580), (1050, 595)]
PIEZOS = [(340, 440, "P1"), (480, 490, "P2"), (620, 530, "P3")]


def _mini_graph(draw: ImageDraw.ImageDraw, x0: int, y0: int, w: int, h: int, kind: str) -> None:
    draw.rectangle([x0, y0, x0 + w, y0 + h], outline=_hex(C["gray"]), width=1)
    ax = x0 + 8
    ay = y0 + h - 10
    draw.line([(ax, ay), (x0 + w - 8, ay)], fill=_hex(C["navy"]), width=1)
    draw.line([(ax, y0 + 8), (ax, ay)], fill=_hex(C["navy"]), width=1)
    if kind == "reservoir":
        for frac, col in ((0.72, C["teal"]), (0.55, C["green"]), (0.38, C["orange"])):
            yy = y0 + int(h * frac)
            draw.line([(ax + 4, yy), (x0 + w - 12, yy)], fill=_hex(col), width=1)
    elif kind == "pore":
        pts = [(ax + 10, ay - 8), (ax + 40, ay - 28), (ax + 70, ay - 22), (ax + w - 20, ay - 35)]
        for i in range(len(pts) - 1):
            draw.line([pts[i], pts[i + 1]], fill=_hex(C["teal"]), width=2)
    elif kind == "leakage":
        draw.line([(ax + 10, ay - 10), (x0 + w - 16, ay - 40)], fill=_hex(BLUE), width=2)
        draw.line([(ax + 8, ay - 22), (x0 + w - 12, ay - 22)], fill=_hex(C["green"]), width=1)
    elif kind == "settle":
        y20 = y0 + int(h * 0.35)
        y40 = y0 + int(h * 0.62)
        draw.rectangle([x0 + w - 28, y0 + 10, x0 + w - 8, y20], fill=_hex("#DCFCE7"))
        draw.rectangle([x0 + w - 28, y20, x0 + w - 8, y40], fill=_hex("#FEF3C7"))
        draw.rectangle([x0 + w - 28, y40, x0 + w - 8, ay], fill=_hex("#FEE2E2"))
        draw.line([(ax + 12, y0 + 14), (x0 + w - 36, ay - 6)], fill=_hex(C["teal"]), width=2)
    elif kind == "disp":
        draw.line([(ax + 20, ay - 20), (ax + 55, ay - 20)], fill=_hex(C["teal"]), width=2)
        draw.line([(ax + 38, ay - 8), (ax + 38, ay - 38)], fill=_hex(C["orange"]), width=2)
    else:
        for i, yy in enumerate((ay - 12, ay - 28, ay - 44)):
            draw.ellipse([ax + 20 + i * 18, yy - 3, ax + 26 + i * 18, yy + 3], fill=_hex(C["teal"]))


def _card(draw: ImageDraw.ImageDraw, x0: int, y0: int, x1: int, y1: int, title: str, measure: str, meaning: str, mgmt: str, graph: str) -> None:
    draw.rounded_rectangle([x0, y0, x1, y1], radius=4, outline=_hex(C["navy"]), width=1, fill=_hex(C["white"]))
    draw_label(draw, title, (x0 + 8, y0 + 14), load_font(12, bold=True), anchor="lm")
    f10 = load_font(10)
    draw_label(draw, f"측정: {measure}", (x0 + 8, y0 + 34), f10, anchor="lm", fill=C["gray"])
    draw_label(draw, f"해석: {meaning}", (x0 + 8, y0 + 50), f10, anchor="lm", fill=C["gray"])
    draw_label(draw, f"관리: {mgmt}", (x0 + 8, y0 + 66), f10, anchor="lm", fill=C["teal"])
    gw, gh = x1 - x0 - 16, y1 - y0 - 82
    _mini_graph(draw, x0 + 8, y0 + 78, gw, gh, graph)


def _phreatic_dashed(draw: ImageDraw.ImageDraw) -> None:
    pts = PHREATIC
    for i in range(len(pts) - 1):
        x1, y1 = pts[i]
        x2, y2 = pts[i + 1]
        steps = max(abs(x2 - x1), abs(y2 - y1), 1) // 5
        for s in range(steps):
            t0, t1 = s / steps, min((s + 0.55) / steps, 1.0)
            draw.line(
                [(int(x1 + (x2 - x1) * t0), int(y1 + (y2 - y1) * t0)), (int(x1 + (x2 - x1) * t1), int(y1 + (y2 - y1) * t1))],
                fill=_hex(BLUE),
                width=2,
            )
    draw_label(draw, "해석 침윤선", (980, 600), load_font(11), fill=BLUE)
    draw_label(draw, "(피에조 수두 기반)", (980, 616), load_font(9), fill=C["gray"])


def _piezometer(draw: ImageDraw.ImageDraw, px: int, tip_y: int, tag: str) -> None:
    top_y = CREST_Y - 10
    draw.line([(px, top_y), (px, tip_y + 20)], fill=_hex(C["navy"]), width=2)
    draw.rectangle([px - 8, top_y, px + 8, tip_y - 14], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)
    draw.rectangle([px - 10, tip_y - 16, px + 10, tip_y + 16], fill=_hex(FILTER), outline=_hex(C["teal"]), width=2)
    draw.ellipse([px - 6, tip_y - 2, px + 6, tip_y + 10], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
    draw.line([(px - 14, tip_y), (px + 18, tip_y)], fill=_hex(BLUE), width=2)
    draw_label(draw, f"②{tag}", (px + 22, top_y + 4), load_font(10), fill=C["teal"])


def _earthfill_section(draw: ImageDraw.ImageDraw) -> None:
    f11 = load_font(11)
    f10 = load_font(10)
    draw.rectangle([48, MAIN_TOP, LEFT_R, MAIN_BOT], outline=_hex(C["navy"]), width=2)

    draw.rectangle([60, ROCK_Y, LEFT_R - 12, BOTTOM_Y], fill=_hex(ROCK))
    draw_label(draw, "기반암", (140, ROCK_Y + 28), f10, fill=C["gray"])

    draw.rectangle([60, WATER_Y, 240, BOTTOM_Y], fill=_hex("#93C5FD"), outline=_hex(C["teal"]), width=1)
    x = 60
    while x < 240:
        draw.line([(x, WATER_Y), (min(x + 10, 240), WATER_Y)], fill=_hex(C["teal"]), width=2)
        x += 16
    draw_label(draw, "상류 저수지", (150, WATER_Y - 18), f11, fill=C["teal"])
    draw.rounded_rectangle([190, WATER_Y + 40, 230, WATER_Y + 70], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "①수위계", (210, WATER_Y + 55), load_font(10, bold=True))

    dam = [(240, BOTTOM_Y), (260, WATER_Y), (520, CREST_Y), (780, 480), (920, BOTTOM_Y)]
    draw.polygon(dam, fill=_hex(SOIL), outline=_hex(C["navy"]), width=2)
    core = [(320, BOTTOM_Y), (360, WATER_Y + 30), (500, CREST_Y + 20), (640, 500), (700, BOTTOM_Y)]
    draw.polygon(core, fill=_hex(CORE), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "코어", (480, 560), f10, fill=C["gray"])
    filt = [(700, BOTTOM_Y), (760, 520), (820, 480), (880, BOTTOM_Y)]
    draw.polygon(filt, fill=_hex(FILTER), outline=_hex(C["gray"]), width=1)
    draw_label(draw, "필터존", (800, 620), f10, fill=C["gray"])

    draw.polygon([(780, 480), (920, BOTTOM_Y), (LEFT_R - 12, BOTTOM_Y), (LEFT_R - 12, 500), (840, 460)], fill=_hex("#F3F4F6"))
    draw.line([(800, 680), (860, 720), (920, 760)], fill=_hex(DRAIN), width=4)
    draw_label(draw, "하류드레인", (900, 640), f10, fill=C["gray"])
    draw_label(draw, "toe drain", (900, 656), f9 := load_font(9), fill=C["gray"])

    sump_x, sump_y = 960, 740
    draw.rectangle([sump_x, sump_y, sump_x + 50, sump_y + 40], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)
    draw.polygon([(sump_x + 25, sump_y - 18), (sump_x + 10, sump_y), (sump_x + 40, sump_y)], fill=_hex(BLUE), outline=_hex(C["navy"]))
    draw_label(draw, "③V-notch", (sump_x + 25, sump_y + 52), f10, fill=BLUE)
    draw_label(draw, "누수·탁도", (sump_x + 25, sump_y + 66), f9, fill=C["gray"])

    _phreatic_dashed(draw)
    for px, tip_y, tag in PIEZOS:
        _piezometer(draw, px, tip_y, tag)

    cx, cy = 520, CREST_Y
    draw.line([(cx, cy + 8), (cx, cy + 36)], fill=_hex(C["red"]), width=2)
    draw_label(draw, "④침하", (cx + 14, cy + 18), f10, fill=C["red"])
    draw_arrow(draw, cx - 40, cy, cx - 72, cy, color=C["teal"], width=2)
    draw.line([(cx + 60, cy - 20), (cx + 60, cy + 20)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "⑤GNSS", (cx + 74, cy), f10, fill=C["teal"])
    draw_label(draw, "경사계", (cx + 74, cy + 14), f9, fill=C["gray"])

    draw.line([(1100, CREST_Y + 30), (1100, CREST_Y + 60)], fill=_hex(C["navy"]), width=1)
    draw.ellipse([1092, CREST_Y + 18, 1108, CREST_Y + 34], fill=_hex(C["light"]), outline=_hex(C["navy"]))
    draw_label(draw, "⑥강우", (1120, CREST_Y + 24), f9, fill=C["gray"])


def _monitoring_cards(draw: ImageDraw.ImageDraw) -> None:
    cw, ch, gap = 340, 218, 10
    x1, x2 = RIGHT_L, RIGHT_L + cw
    x3, x4 = RIGHT_L + cw + gap, RIGHT_L + 2 * cw + gap
    cards = [
        (x1, MAIN_TOP, x2, MAIN_TOP + ch, "① 저수위", "EL.m", "외력·응답 기준", "운영·홍수수위", "reservoir"),
        (x3, MAIN_TOP, x4, MAIN_TOP + ch, "② 간극수압", "u, h", "침투·안정", "설계수두·급상승", "pore"),
        (x1, MAIN_TOP + ch + gap, x2, MAIN_TOP + 2 * ch + gap, "③ 누수·탁도", "L/s, NTU", "누수 경로", "정상범위·급증", "leakage"),
        (x3, MAIN_TOP + ch + gap, x4, MAIN_TOP + 2 * ch + gap, "④ 침하", "mm", "누적·속도", "예측곡선·잔류", "settle"),
        (x1, MAIN_TOP + 2 * (ch + gap), x2, MAIN_TOP + 3 * ch + 2 * gap, "⑤ 수평변위", "mm", "누적·방향", "변위속도", "disp"),
        (x3, MAIN_TOP + 2 * (ch + gap), x4, MAIN_TOP + 3 * ch + 2 * gap, "⑥ 보조계측", "mm/s, °C", "강우·지진·온도", "이벤트 연계", "aux"),
    ]
    for args in cards:
        _card(draw, *args)


def _data_flow_footer(draw: ImageDraw.ImageDraw) -> None:
    draw.line([(48, FOOTER_Y - 4), (1872, FOOTER_Y - 4)], fill=_hex(C["light"]), width=2)
    steps = [
        "계측 센서",
        "로거/RTU",
        "서버 DB",
        "품질검증",
        "계측해석",
        "기준비교",
        "경보·조치",
    ]
    f10 = load_font(10)
    x = 70
    bw = 118
    for i, lbl in enumerate(steps):
        draw.rounded_rectangle([x, FOOTER_Y + 8, x + bw, FOOTER_Y + 44], radius=3, fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)
        draw_label(draw, lbl, (x + bw // 2, FOOTER_Y + 26), f10)
        if i < len(steps) - 1:
            draw_arrow(draw, x + bw + 2, FOOTER_Y + 26, x + bw + 22, FOOTER_Y + 26, color=C["teal"], width=2)
        x += bw + 28
    draw_label(
        draw,
        "데이터 피드백: 외력 조건과 구조물 응답 상관분석 → 유지관리 의사결정",
        (960, FOOTER_Y + 68),
        load_font(11),
        fill=C["gray"],
    )
    draw_label(draw, "정상 · 주의 · 경계 · 위험", (960, FOOTER_Y + 88), load_font(10), fill=C["teal"])


def render_img024(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "댐 안전관리 계측 체계도", (W // 2, 36), font_title)
    draw_label(
        draw,
        "저수위 변화 → 제체·기초 응답 → 이상징후 판단 → 경보 및 조치 (필댐·석괴댐)",
        (W // 2, 78),
        load_font(16),
        fill=C["gray"],
    )
    draw.line([(LEFT_R + 4, MAIN_TOP), (LEFT_R + 4, MAIN_BOT)], fill=_hex(C["light"]), width=2)
    _earthfill_section(draw)
    _monitoring_cards(draw)
    _data_flow_footer(draw)
