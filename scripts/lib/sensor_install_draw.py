"""Sensor installation concept figures (P2): IMG-030, 031, 037, 038, 042."""
from __future__ import annotations

import math

from PIL import ImageDraw, ImageFont

from .anchor_head_draw import draw_anchor_head_assembly
from .bridge_draw import draw_ground_line, draw_tiltmeter_bracket
from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, draw_legacy_logger_in_enclosure, draw_logger_block_icon, load_font

SOIL1 = "#E8D4B8"
SOIL2 = "#C4A574"
ROCK = "#9CA3AF"


def _soil_block(draw: ImageDraw.ImageDraw, x0: int, y0: int, x1: int, y1: int) -> None:
    draw.rectangle([x0, y0, x1, y1], fill=_hex(SOIL1))
    for yy in range(y0 + 6, y1, 14):
        draw.line([(x0 + 4, yy), (x1 - 4, yy)], fill=_hex(SOIL2), width=1)


def _gwl_dashed(draw: ImageDraw.ImageDraw, x0: int, x1: int, y: int) -> None:
    x = x0
    while x < x1:
        draw.line([(x, y), (min(x + 12, x1), y)], fill=_hex(C["teal"]), width=2)
        x += 24
    draw_label(draw, "G.W.L", (x1 + 8, y - 8), load_font(14), fill=C["teal"])


def render_img030(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "지하수위계 설치 개념도", (W // 2, 48), font_title)
    draw_label(draw, "Automatic observation well — open G.W.L · well cap · screen · seal", (W // 2, 88), load_font(18), fill=C["gray"])

    ground = 680
    _soil_block(draw, 80, ground, 900, ground + 100)
    draw.rectangle([80, ground + 100, 900, 920], fill=_hex(ROCK))
    draw.line([(80, ground), (900, ground)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "GL", (60, ground - 8), load_font(14), fill=C["gray"], anchor="rm")

    wx = 400
    # Well cap (AUTO-01 — not generic "방수보호함")
    draw.rounded_rectangle([wx - 28, ground - 48, wx + 28, ground - 8], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "well cap", (wx, ground - 58), load_font(13, bold=True))
    draw.rectangle([wx - 22, ground - 40, wx + 22, ground + 220], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=3)
    # Screen + filter pack zone
    draw.rectangle([wx - 18, ground + 80, wx + 18, ground + 200], fill=_hex("#93C5FD"), outline=_hex(C["teal"]), width=1)
    draw_label(draw, "screen·filter pack", (wx + 36, ground + 140), load_font(12), fill=C["teal"])
    draw.rectangle([wx - 18, ground + 200, wx + 18, ground + 240], fill=_hex(SOIL2), outline=_hex(C["gray"]), width=1)
    draw_label(draw, "bentonite seal", (wx + 36, ground + 220), load_font(12), fill=C["gray"])

    gwl_y = 600
    _gwl_dashed(draw, 120, 880, gwl_y)
    draw.rectangle([wx - 16, gwl_y, wx + 16, ground + 300], fill=_hex("#93C5FD"), outline=_hex(C["teal"]), width=1)
    draw_label(draw, "개방 수면", (wx + 40, gwl_y + 30), load_font(14), fill=C["teal"])

    draw.ellipse([wx - 10, gwl_y + 50, wx + 10, gwl_y + 70], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw.line([(wx, gwl_y + 70), (wx, ground - 36)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "submersible logger", (wx + 36, gwl_y + 58), load_font(13))

    draw_logger_block_icon(draw, 640, ground - 120, 130, 72, title="데이터로거", font=load_font(13, bold=True))
    draw.line([(wx + 22, ground - 28), (640, ground - 80)], fill=_hex(C["gray"]), width=2)
    draw_label(draw, "vented cable", (520, ground - 100), load_font(12), fill=C["gray"])

    # Retaining wall silhouette (backside well — not wall-mounted)
    draw.rectangle([780, ground - 180, 800, ground], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "벽체 (부착 금지)", (840, ground - 120), load_font(13), fill=C["orange"])

    px = 1080
    draw.rounded_rectangle([px, 200, 1820, 560], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "지하수위계 ≠ 간극수압계", (1450, 235), load_font(22, bold=True))
    draw.rounded_rectangle([px + 40, 300, px + 380, 500], outline=_hex(C["teal"]), width=2)
    draw_label(draw, "지하수위계", (px + 210, 325), load_font(16, bold=True))
    draw_label(draw, "개방 수면·G.W.L", (px + 210, 355), load_font(13), fill=C["gray"])
    draw.rectangle([px + 170, 380, px + 250, 470], fill=_hex("#93C5FD"), outline=_hex(C["navy"]))
    draw.rounded_rectangle([px + 420, 300, px + 760, 500], outline=_hex(C["gray"]), width=2)
    draw_label(draw, "간극수압계", (px + 590, 325), load_font(16, bold=True))
    draw.line([(px + 590, 360), (px + 590, 460)], fill=_hex(C["navy"]), width=3)
    draw.ellipse([px + 578, 450, px + 602, 474], fill=_hex(C["teal"]), outline=_hex(C["navy"]))

    draw_label(draw, "배면 지반 관측공 (벽체 부착 금지)", (450, ground - 70), load_font(15), fill=C["navy"])


def render_img031(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "간극수압계 설치도", (W // 2, 48), font_title)
    draw_label(draw, "Piezometer — filter zone & grout seals at target depth", (W // 2, 88), load_font(18), fill=C["gray"])

    ground = 200
    bottom = 900
    _soil_block(draw, 80, ground, 820, bottom)
    draw.rectangle([80, 520, 820, bottom], fill=_hex(ROCK))
    draw_label(draw, "풍화토", (200, 400), load_font(15), fill=C["gray"])
    draw_label(draw, "연암", (200, 700), load_font(15), fill=C["gray"])

    bx = 400
    target_y = 580
    draw.line([(bx, ground + 40), (bx, bottom - 40)], fill=_hex(C["gray"]), width=4)
    # Grout seals
    draw.rectangle([bx - 16, ground + 40, bx + 16, target_y - 50], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)
    draw.rectangle([bx - 16, target_y + 50, bx + 16, bottom - 40], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)
    # Sand filter zone
    draw.rectangle([bx - 20, target_y - 40, bx + 20, target_y + 40], fill=_hex(SOIL2), outline=_hex(C["teal"]), width=2)
    draw.ellipse([bx - 12, target_y - 8, bx + 12, target_y + 16], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "필터", (bx + 32, target_y), load_font(14), fill=C["teal"])
    draw_label(draw, "그라우트·차수", (bx + 32, ground + 120), load_font(13), fill=C["gray"])
    draw_label(draw, "목적 지층", (bx + 32, target_y + 60), load_font(13))

    draw.line([(bx, ground + 40), (bx, ground - 60)], fill=_hex(C["navy"]), width=2)
    draw.rounded_rectangle([bx - 24, ground - 90, bx + 24, ground - 50], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "junction box", (bx + 32, ground - 70), load_font(12))
    draw_logger_block_icon(draw, bx + 80, ground - 100, 110, 64, title="로거", font=load_font(12, bold=True))

    draw_label(draw, "간극수압 ≠ 개방 수면", (520, 440), load_font(15), fill=C["orange"])
    px = 920
    draw.rounded_rectangle([px, 180, 1820, 880], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "지하수위계 vs 간극수압계", (1370, 215), load_font(22, bold=True))
    render_img030_comparison_inset(draw, px + 80, 300)
    draw_label(draw, "간극수압 →", (1370, 760), load_font(18), fill=C["teal"])
    draw_arrow(draw, 1200, 780, 1400, 780, color=C["teal"], width=3)


def render_img030_comparison_inset(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    """Small water level vs piezo for IMG-031 right panel."""
    draw.rounded_rectangle([x, y, x + 340, y + 200], outline=_hex(C["teal"]), width=2)
    draw_label(draw, "지하수위계", (x + 170, y + 24), load_font(16, bold=True))
    draw.rectangle([x + 140, y + 50, x + 200, y + 170], fill=_hex("#93C5FD"), outline=_hex(C["navy"]))

    draw.rounded_rectangle([x + 400, y, x + 740, y + 200], outline=_hex(C["gray"]), width=2)
    draw_label(draw, "간극수압계", (x + 570, y + 24), load_font(16, bold=True))
    draw.line([(x + 570, y + 60), (x + 570, y + 160)], fill=_hex(C["navy"]), width=3)
    draw.ellipse([x + 558, y + 130, x + 582, y + 154], fill=_hex(C["teal"]), outline=_hex(C["navy"]))


def render_img037(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "균열계 설치 개념도", (W // 2, 48), font_title)
    draw_label(draw, "Crack gauge — anchors across crack, displacement measurement", (W // 2, 88), load_font(18), fill=C["gray"])

    # Concrete wall
    draw.rectangle([200, 220, 700, 820], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)
    draw_label(draw, "콘크리트 벽체", (450, 200), load_font(18), fill=C["gray"])

    crack_x = 450
    draw.line([(crack_x, 280), (crack_x, 760)], fill=_hex(C["red"]), width=3)
    draw_label(draw, "균열", (crack_x + 20, 500), load_font(16), fill=C["red"])

    # Gauge across crack
    ay = 520
    draw.line([(crack_x - 80, ay), (crack_x + 80, ay)], fill=_hex(C["navy"]), width=4)
    draw.ellipse([crack_x - 90, ay - 12, crack_x - 66, ay + 12], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw.ellipse([crack_x + 66, ay - 12, crack_x + 90, ay + 12], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw.rounded_rectangle([crack_x - 30, ay - 18, crack_x + 30, ay + 18], fill=_hex(C["white"]), outline=_hex(C["teal"]), width=2)
    draw_label(draw, "균열계", (crack_x, ay - 36), load_font(16, bold=True), fill=C["teal"])

    draw_arrow(draw, crack_x - 50, ay + 40, crack_x - 20, ay + 40, color=C["teal"])
    draw_arrow(draw, crack_x + 50, ay + 40, crack_x + 20, ay + 40, color=C["teal"])
    draw_label(draw, "변위 측정 →", (crack_x, ay + 58), load_font(14), fill=C["teal"])
    draw_label(draw, "앵커", (crack_x - 78, ay - 28), load_font(13))
    draw_label(draw, "앵커", (crack_x + 78, ay - 28), load_font(13), anchor="rm")

    # Right panel
    px = 900
    draw.rounded_rectangle([px, 240, 1780, 780], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "설치 원칙", (1340, 280), load_font(22, bold=True))
    for i, line in enumerate(
        [
            "균열선을 가로지름 (평행 설치 금지)",
            "양측 고정 앵커",
            "균열폭 변화 = 변위",
            "데이터로거 연결",
        ]
    ):
        draw.ellipse([px + 36, 340 + i * 52 - 6, px + 48, 340 + i * 52 + 6], fill=_hex(C["teal"]))
        draw_label(draw, line, (px + 60, 340 + i * 52), load_font(17), anchor="lm")


def render_img038(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    """교량 교대·교각 구조물경사계 — surface tiltmeter (NOT inclinometer). BRI-02."""
    draw_label(draw, "교량 교대·교각 경사계 설치도", (W // 2, 48), font_title)
    draw_label(
        draw,
        "구조물경사계 — 표면 부착 · 지중경사계와 구분 (fields/bridge/abutment)",
        (W // 2, 88),
        load_font(18),
        fill=C["gray"],
    )

    ground_y = 760
    deck_y = 340
    abut_x0, abut_x1 = 140, 260

    # Backfill behind abutment
    _soil_block(draw, 80, ground_y - 180, abut_x0, ground_y)
    draw_label(draw, "성토·배면", (110, ground_y - 220), load_font(14), fill=C["gray"])

    # Abutment wall + wing
    draw.rectangle([abut_x0, deck_y + 60, abut_x1, ground_y], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)
    draw.polygon(
        [(abut_x1, deck_y + 60), (abut_x1 + 80, deck_y + 100), (abut_x1 + 80, ground_y), (abut_x1, ground_y)],
        fill=_hex("#D1D5DB"),
        outline=_hex(C["navy"]),
        width=2,
    )
    draw_label(draw, "교대(날개벽)", (200, deck_y + 30), load_font(16, bold=True))

    # Deck segment on abutment
    draw.rectangle([abut_x0 - 20, deck_y, abut_x1 + 200, deck_y + 36], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=3)
    draw_label(draw, "교면", (abut_x1 + 60, deck_y - 16), load_font(14))

    draw_ground_line(draw, 80, 420, ground_y)

    # Tiltmeter on abutment face
    draw_tiltmeter_bracket(draw, abut_x1, ground_y - 220, side="right", label="구조물경사계")
    draw_label(draw, "앵커·브래킷", (abut_x1 + 90, ground_y - 180), load_font(13), fill=C["teal"])

    # Earth pressure in backfill (abutment context)
    draw.rounded_rectangle([100, ground_y - 120, 130, ground_y - 80], fill=_hex(C["orange"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "토압계", (160, ground_y - 100), load_font(13), fill=C["orange"])
    draw_arrow(draw, 130, ground_y - 100, abut_x0 - 4, ground_y - 140, width=2, color=C["orange"])

    # Pier inset
    pier_x = 520
    draw.rectangle([pier_x, deck_y + 36, pier_x + 36, ground_y], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw.rectangle([pier_x - 60, deck_y, pier_x + 96, deck_y + 36], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "교각", (pier_x + 18, ground_y + 22), load_font(14))
    draw_tiltmeter_bracket(draw, pier_x + 36, deck_y + 180, side="right", label="경사계")

    # Right — vs inclinometer
    px = 780
    draw.rounded_rectangle([px, 180, 1820, 860], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "지중경사계와 구분", (1300, 220), load_font(22, bold=True))
    draw.rounded_rectangle([px + 40, 280, px + 420, 520], outline=_hex(C["teal"]), width=2)
    draw_label(draw, "구조물경사계", (px + 230, 310), load_font(16, bold=True))
    draw_label(draw, "교대·교각 표면 부착", (px + 230, 340), load_font(14), fill=C["gray"])
    draw_label(draw, "기울기 θ 측정", (px + 230, 370), load_font(14), fill=C["gray"])
    draw.rounded_rectangle([px + 460, 280, px + 820, 520], outline=_hex(C["gray"]), width=2)
    draw_label(draw, "지중경사계", (px + 640, 310), load_font(16, bold=True))
    draw.line([(px + 640, 360), (px + 640, 480)], fill=_hex(C["navy"]), width=5)
    draw_label(draw, "지중 수평변위 (굴착·사면)", (px + 640, 500), load_font(14), fill=C["gray"])

    draw_label(draw, "금지: 지반 속·말뚝 형태", (1300, 580), load_font(17), fill=C["orange"])
    draw_label(draw, "필수: 앵커·브래킷 표면 고정", (1300, 620), load_font(17), fill=C["teal"])
    draw_label(draw, "금지: 흙막이·굴착 단면을 교대 hero로 사용", (1300, 680), load_font(16), fill=C["orange"])


def render_img042(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "자동광파기 계측 개념도", (W // 2, 48), font_title)
    draw_label(draw, "Total Station — control point, sight lines, prisms, coordinate displacement", (W // 2, 88), load_font(18), fill=C["gray"])

    # Excavation context (simplified)
    ground = 720
    draw.rectangle([80, ground, 700, 900], fill=_hex(SOIL1), outline=_hex(C["navy"]))
    draw.rectangle([400, ground - 200, 480, ground], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "굴착·구조물", (440, ground - 220), load_font(15), fill=C["gray"])

    # Control point (backsight)
    cx, cy = 200, ground - 40
    draw.ellipse([cx - 10, cy - 10, cx + 10, cy + 10], fill=_hex(C["orange"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "기준점", (cx, cy - 28), load_font(15, bold=True))

    # Total station on tripod (NOT camera)
    ts_x, ts_y = 320, ground - 20
    draw.line([(ts_x, ts_y), (ts_x, ts_y + 50)], fill=_hex(C["navy"]), width=3)
    draw.polygon([(ts_x - 25, ts_y + 50), (ts_x + 25, ts_y + 50), (ts_x, ts_y + 70)], fill=_hex(C["gray"]), outline=_hex(C["navy"]))
    draw.rounded_rectangle([ts_x - 28, ts_y - 35, ts_x + 28, ts_y + 5], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw.ellipse([ts_x - 12, ts_y - 28, ts_x + 12, ts_y - 8], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "Total Station", (ts_x, ts_y - 52), load_font(15, bold=True))
    draw_label(draw, "(자동광파기)", (ts_x, ts_y + 88), load_font(13), fill=C["gray"])

    # Backsight dashed
    draw.line([(ts_x - 10, ts_y - 15), (cx, cy)], fill=_hex(C["gray"]), width=1)
    draw_label(draw, "시준선", (260, ts_y - 50), load_font(13), fill=C["gray"])

    # Prisms on structure
    prisms = [(480, ground - 280), (560, ground - 180), (620, ground - 120)]
    for i, (px, py) in enumerate(prisms):
        draw.polygon([(px, py - 14), (px - 12, py), (px + 12, py)], fill=_hex(C["orange"]), outline=_hex(C["navy"]))
        draw.line([(ts_x, ts_y - 20), (px, py)], fill=_hex(C["gray"]), width=1)
        draw_label(draw, f"프리즘 P{i+1}", (px, py - 28), load_font(12))

    # Displacement vector at P1
    p1x, p1y = prisms[0]
    draw_arrow(draw, p1x, p1y, p1x + 35, p1y - 25, color=C["teal"], width=3)
    draw_arrow(draw, p1x, p1y, p1x + 20, p1y + 30, color=C["teal"], width=3)
    draw_label(draw, "ΔX", (p1x + 50, p1y - 20), load_font(14), fill=C["teal"])
    draw_label(draw, "ΔY", (p1x + 35, p1y + 40), load_font(14), fill=C["teal"])

    # Right panel
    rx = 900
    draw.rounded_rectangle([rx, 200, 1820, 820], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "계측 구성", (1360, 240), load_font(22, bold=True))
    items = [
        "기준점 (고정)",
        "Total Station — 삼각대 (CCTV 금지)",
        "시준선 → 프리즘 측점",
        "좌표 변위 ΔX·ΔY",
        "부동점 설치 (변형권 밖)",
    ]
    y = 300
    for item in items:
        draw.ellipse([rx + 36, y - 6, rx + 48, y + 6], fill=_hex(C["teal"]))
        draw_label(draw, item, (rx + 60, y), load_font(17), anchor="lm")
        y += 48

    draw_label(draw, "금지: 프리즘·시준선 없음, 레이저스캐너", (1360, 720), load_font(16), fill=C["orange"])
