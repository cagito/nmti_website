"""Platform / remote monitoring system figures (P3): IMG-045, 048, 056, 058."""
from __future__ import annotations

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, draw_legacy_datalogger_front, draw_legacy_logger_block_icon, load_font


def _box(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int, title: str, *, fill: str = C["light"]) -> None:
    draw.rounded_rectangle([x, y, x + w, y + h], fill=_hex(fill), outline=_hex(C["navy"]), width=2)
    draw_label(draw, title, (x + w // 2, y + h // 2), load_font(18, bold=True))


def draw_lte_m2m_modem(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    w: int = 170,
    h: int = 100,
) -> None:
    """Generic LTE M2M modem — no brand logo or model name."""
    draw.rounded_rectangle([x, y, x + w, y + h], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "LTE M2M", (x + w // 2, y + h // 2 - 10), load_font(15, bold=True))
    draw_label(draw, "모뎀", (x + w // 2, y + h // 2 + 14), load_font(13))
    draw.rounded_rectangle([x + 12, y + h - 26, x + 48, y + h - 10], fill=_hex(C["light"]), outline=_hex(C["gray"]), width=1)
    draw_label(draw, "SIM", (x + 30, y + h - 18), load_font(10), fill=C["gray"])
    ax, ay = x + w + 4, y + 22
    draw.line([(x + w - 6, y + 28), (ax + 18, ay + 6)], fill=_hex(C["navy"]), width=2)
    draw.line([(ax + 18, ay + 6), (ax + 18, ay - 22)], fill=_hex(C["navy"]), width=2)
    draw.ellipse([ax + 14, ay - 26, ax + 22, ay - 18], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)


def _side_panel(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int, title: str, lines: list[str]) -> None:
    draw.rounded_rectangle([x, y, x + w, y + h], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, title, (x + w // 2, y + 26), load_font(20, bold=True))
    ly = y + 54
    for line in lines:
        draw_label(draw, line, (x + 14, ly), load_font(16), anchor="lm")
        ly += 30


def render_img045(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "데이터로거 구성도", (W // 2, 48), font_title)
    draw_label(draw, "센서 입력 · 전원 · 통신 · 저장", (W // 2, 88), load_font(18), fill=C["gray"])

    lw, lh = 520, 240
    lx, ly = (W - lw) // 2, 290
    draw_legacy_datalogger_front(draw, lx, ly, lw, lh, font=load_font(22, bold=True))

    # LOGGER-SIG-01: each sensor → distinct signal path (not one shared input)
    sensors: list[tuple[str, str, str]] = [
        ("지중경사계", "RS-485", "디지털 통신"),
        ("하중계", "브리지", "mV/V · 여자"),
        ("지하수위계", "4–20 mA", "전류 루프"),
        ("변위계", "디지털", "펄스·직렬"),
    ]
    box_w, box_h = 168, 56
    sx = 72
    for i, (name, sig, hint) in enumerate(sensors):
        frac = 0.22 + i * 0.18
        sy = ly + int(lh * frac) - box_h // 2
        ty = ly + int(lh * frac)
        draw.rounded_rectangle([sx, sy, sx + box_w, sy + box_h], fill=_hex(C["white"]), outline=_hex(C["teal"]), width=2)
        draw_label(draw, name, (sx + box_w // 2, sy + 18), load_font(15, bold=True))
        draw_label(draw, sig, (sx + box_w // 2, sy + 40), load_font(13), fill=C["gray"])
        port_x = lx - 4
        draw_arrow(draw, sx + box_w, sy + box_h // 2, port_x, ty, width=2)
        draw.ellipse([port_x - 5, ty - 5, port_x + 5, ty + 5], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
        draw_label(draw, hint, (lx + 8, ty), load_font(11), anchor="lm", fill=C["gray"])

    draw_label(draw, "센서 입력 (신호 형식별)", (sx + box_w // 2, ly + lh + 36), load_font(16), fill=C["gray"])

    rx = 1340
    _side_panel(draw, rx, 210, 300, 118, "전원", ["12V 배터리", "태양광·AC", "접지·서지보호"])
    _side_panel(draw, rx, 360, 300, 118, "통신", ["Ethernet·RS-485", "USB·LTE", "로거 ≠ 서버"])
    _side_panel(draw, rx, 510, 300, 118, "저장", ["내장 메모리", "SD 카드", "샘플링·동기"])
    ty_mid = ly + lh // 2
    for ay in (265, 415, 565):
        draw_arrow(draw, lx + lw, ty_mid, rx, ay, width=2)

    draw_label(draw, "센서", (360, 820), load_font(16))
    draw_arrow(draw, 420, 840, 680, 840)
    draw_label(draw, "데이터로거", (760, 820), load_font(16))
    draw_arrow(draw, 860, 840, 1120, 840)
    draw_label(draw, "통신 → 서버", (1220, 820), load_font(16), fill=C["gray"])
    draw_label(draw, "로거 = 현장 수집 함체 · 서버 = 원격 저장·모니터링", (W // 2, 900), load_font(14), fill=C["gray"])


def render_img048(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "LTE M2M 통신 구성도", (W // 2, 48), font_title)
    draw_label(draw, "Sensor → logger → LTE M2M modem → server → web / mobile", (W // 2, 88), load_font(18), fill=C["gray"])

    y = 400
    _box(draw, 120, y, 160, 100, "계측 센서")
    draw_legacy_logger_block_icon(draw, 310, y - 10, 200, 140, font=load_font(16, bold=True))
    draw_lte_m2m_modem(draw, 540, y - 10, 170, 100)
    _box(draw, 760, y, 100, 100, "서버")
    _box(draw, 920, y - 80, 100, 100, "웹")
    _box(draw, 920, y + 40, 100, 100, "모바일")

    draw_arrow(draw, 280, y + 50, 310, y + 60)
    draw_arrow(draw, 510, y + 60, 540, y + 50)
    draw_arrow(draw, 710, y + 50, 760, y + 50)
    draw_arrow(draw, 860, y + 50, 920, y + 10)
    draw.line([(1020, y - 30), (1140, y - 30)], fill=_hex(C["teal"]), width=2)
    draw.line([(1140, y - 30), (1140, y + 170)], fill=_hex(C["teal"]), width=2)
    draw_arrow(draw, 1140, y + 170, 1020, y + 170)


def render_img056(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "웹 대시보드 구성도", (W // 2, 48), font_title)
    draw_label(draw, "Map · sensor list · charts · event log (wireframe)", (W // 2, 88), load_font(18), fill=C["gray"])

    # Outer frame
    draw.rounded_rectangle([100, 160, 1820, 900], outline=_hex(C["navy"]), width=3)
    draw_label(draw, "원격계측 웹", (160, 190), load_font(18, bold=True))

    # Map panel
    draw.rounded_rectangle([140, 220, 620, 520], fill=_hex(C["white"]), outline=_hex(C["gray"]), width=2)
    draw_label(draw, "현장·센서 지도", (380, 250), load_font(17, bold=True))
    for dx, dy in [(220, 320), (300, 380), (420, 340), (500, 420)]:
        draw.ellipse([dx - 8, dy - 8, dx + 8, dy + 8], fill=_hex(C["teal"]), outline=_hex(C["navy"]))
    draw.line([(180, 480), (580, 480)], fill=_hex(C["gray"]), width=1)
    draw.line([(180, 300), (180, 480)], fill=_hex(C["gray"]), width=1)

    # Sensor list
    draw.rounded_rectangle([660, 220, 980, 520], fill=_hex(C["white"]), outline=_hex(C["gray"]), width=2)
    draw_label(draw, "센서 목록", (820, 250), load_font(17, bold=True))
    for i, name in enumerate(["INC-01", "WL-02", "LD-03", "TS-04"]):
        yy = 290 + i * 48
        draw.line([(680, yy), (960, yy)], fill=_hex(C["light"]), width=1)
        draw_label(draw, name, (700, yy + 22), load_font(15), anchor="lm")
        draw.ellipse([920, yy + 14, 936, yy + 30], fill=_hex(C["green"]))

    # Graph
    draw.rounded_rectangle([1020, 220, 1780, 520], fill=_hex(C["white"]), outline=_hex(C["gray"]), width=2)
    draw_label(draw, "시계열 그래프", (1400, 250), load_font(17, bold=True))
    draw.line([(1060, 470), (1740, 470)], fill=_hex(C["navy"]), width=2)
    draw.line([(1060, 300), (1060, 470)], fill=_hex(C["navy"]), width=2)
    pts = [(1080, 420), (1200, 380), (1320, 400), (1440, 340), (1560, 360), (1680, 320)]
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i + 1]], fill=_hex(C["teal"]), width=3)
    draw.line([(1060, 400), (1740, 400)], fill=_hex(C["orange"]), width=1)
    draw_label(draw, "관리기준", (1700, 392), load_font(12), fill=C["orange"])

    # Event log
    draw.rounded_rectangle([140, 560, 1780, 860], fill=_hex(C["white"]), outline=_hex(C["gray"]), width=2)
    draw_label(draw, "이벤트 로그", (200, 590), load_font(17, bold=True))
    events = [("정상", C["green"]), ("주의", C["orange"]), ("경고", C["red"]), ("정상", C["green"])]
    for i, (status, col) in enumerate(events):
        yy = 640 + i * 48
        draw.ellipse([160, yy, 176, yy + 16], fill=_hex(col))
        draw_label(draw, status, (200, yy + 8), load_font(15), anchor="lm")
        draw_label(draw, f"센서 이벤트 #{i+1} — 변위·수위 검토", (280, yy + 8), load_font(14), fill=C["gray"], anchor="lm")


def render_img058(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    """INSTRUMENT_SUBGROUPS E2E — docs/36 §4.13 · left→right 5 blocks."""
    draw_label(draw, "통합 계측 플랫폼 아키텍처", (W // 2, 48), font_title)
    draw_label(
        draw,
        "sensors → datalogger → power → communication → modes (dashboard)",
        (W // 2, 88),
        load_font(18),
        fill=C["gray"],
    )

    y, bh = 380, 200
    blocks = [
        (100, 180, "① sensors", ["간극수압계", "변형률계"]),
        (400, 200, "② datalogger", ["multi-channel", "IP65 enclosure"]),
        (680, 160, "③ power", ["solar panel", "→ battery"]),
        (920, 170, "④ communication", ["LTE-M / LoRa", "telemetry modem"]),
        (1180, 220, "⑤ modes", ["server · DB", "web dashboard"]),
    ]

    for x, w, title, lines in blocks:
        _box(draw, x, y, w, bh, title.split()[1] if " " in title else title)
        ly = y + bh + 24
        for line in lines:
            draw_label(draw, line, (x + w // 2, ly), load_font(14), fill=C["gray"])
            ly += 26

    # Block detail icons
    draw.ellipse([150, y + 60, 190, y + 100], fill=_hex(C["teal"]), outline=_hex(C["navy"]))
    draw_label(draw, "P", (170, y + 80), load_font(14, bold=True))
    draw.rectangle([210, y + 55, 250, y + 105], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "SG", (230, y + 80), load_font(12))

    draw_legacy_logger_block_icon(draw, 420, y + 20, 160, 120, font=load_font(15, bold=True))

    sx, sy = 700, y + 30
    draw.rectangle([sx, sy, sx + 100, sy + 50], fill=_hex(C["navy"]), outline=_hex(C["navy"]))
    for i in range(4):
        draw.line([(sx + 10 + i * 22, sy + 50), (sx + 22 + i * 22, sy + 10)], fill=_hex(C["teal"]), width=2)
    draw.rectangle([sx + 20, sy + 120, sx + 80, sy + 160], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "Battery", (sx + 50, sy + 140), load_font(12))

    draw_lte_m2m_modem(draw, 940, y + 40, 130, 90)

    draw.rounded_rectangle([1200, y + 30, 1340, y + 100], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "Server", (1270, y + 65), load_font(14, bold=True))
    draw.rounded_rectangle([1360, y + 20, 1520, y + 110], fill=_hex(C["white"]), outline=_hex(C["teal"]), width=2)
    draw_label(draw, "Dashboard", (1440, y + 65), load_font(14, bold=True))

    flow_y = y + bh // 2 + 10
    xs = [280, 600, 840, 1090, 1180]
    for i in range(len(xs) - 1):
        draw_arrow(draw, xs[i], flow_y, xs[i + 1] - 20, flow_y, width=3)

    draw_label(draw, "End-to-End data flow →", (960, y - 40), load_font(16), fill=C["teal"])
    draw_label(draw, "≠ brain · hologram · SF UI", (960, 960), load_font(16), fill=C["gray"])
