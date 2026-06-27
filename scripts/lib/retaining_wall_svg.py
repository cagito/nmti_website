"""SVG source generator for retaining excavation cross-sections (IMG-002).

⛔ DEPRECATED — DO NOT USE (2026-06-25)
Policy: docs/16-기술자료-이미지-에이전트-SVG-생성-금지.md
"""
from __future__ import annotations

from pathlib import Path

from .svg_helpers import (
    C,
    H,
    W,
    arrow,
    circle,
    dashed_hline,
    defs_header,
    ellipse,
    g_close,
    g_open,
    line,
    polygon,
    polyline,
    rect,
    rounded_rect,
    sensor_marker,
    svg_close,
    svg_open,
    text,
)

# Geometry (matches validated §3.1 layout)
GROUND_Y = 720
BOTTOM_Y = 980
WALL_X0 = 820
WALL_X1 = 880
BUILD_X0 = 110
BUILD_X1 = 300
BACK_L = 60
BACK_R = WALL_X0
EXC_L = WALL_X1
EXC_R = 1180
SOIL1 = "#E8D4B8"
SOIL2 = "#C4A574"
ROCK = "#9CA3AF"
STRUT_Y = GROUND_Y - 60


def _legacy_logger_svg(x: float, y: float, w: float, h: float) -> str:
    """Industrial rack-style field logger silhouette (no brand)."""
    out = rounded_rect(x, y, w, h, 4, fill=C["enc"], stroke=C["navy"], stroke_width=2)
    hw = max(6, w / 18)
    out += rect(x + 4, y + h / 5, hw, 3 * h / 5, fill=C["enc_dark"], stroke=C["navy"], stroke_width=1)
    out += rect(x + w - 4 - hw, y + h / 5, hw, 3 * h / 5, fill=C["enc_dark"], stroke=C["navy"], stroke_width=1)
    ix, iy = x + hw + 12, y + 10
    iw, ih = w - 2 * hw - 24, h - 20
    lcd_w, lcd_h = iw * 0.35, ih * 0.28
    out += rect(ix, iy, lcd_w, lcd_h, fill=C["white"], stroke=C["navy"], stroke_width=1)
    out += line(ix + 6, iy + lcd_h - 8, ix + lcd_w - 6, iy + lcd_h - 8, stroke=C["teal"], stroke_width=2)
    cx, cy = ix + iw * 0.62, iy + lcd_h / 2
    r = min(lcd_h / 2, iw * 0.12)
    out += circle(cx, cy, r, fill="none", stroke=C["navy"], stroke_width=2)
    out += line(cx, cy, cx + r - 4, cy - 2, stroke=C["navy"], stroke_width=2)
    bx = ix + lcd_w + 8
    for i in range(4):
        by = iy + 6 + i * (lcd_h / 4)
        out += circle(bx + 5, by + 5, 5, fill=C["light"], stroke=C["navy"], stroke_width=1)
    py = y + h - max(22, h / 5)
    port_w = iw / 9
    for i in range(8):
        px = ix + i * port_w + port_w / 3
        out += circle(px + 6, py + 6, 6, fill=C["white"], stroke=C["navy"], stroke_width=1)
    return out


def _logger_enclosure(x: float, y: float, box_w: float, box_h: float) -> str:
    out = text(x + box_w / 2, y - 12, "방수 보호함", size=12, fill=C["gray"])
    out += rounded_rect(x, y, box_w, box_h, 6, fill=C["light"], stroke=C["navy"], stroke_width=2)
    out += line(x + 8, y + 14, x + box_w - 8, y + 14, stroke=C["gray"], stroke_width=1)
    lw, lh = box_w * 0.78, box_h * 0.52
    lx, ly = x + (box_w - lw) / 2, y + (box_h - lh) / 2 + 6
    out += _legacy_logger_svg(lx, ly, lw, lh)
    return out


def _ground_layer() -> str:
    out = g_open("ground")
    # Continuous backfill — no void under building
    out += rect(BACK_L, GROUND_Y, BACK_R - BACK_L, BOTTOM_Y - GROUND_Y, fill=SOIL1)
    for yy in range(int(GROUND_Y + 6), BOTTOM_Y, 14):
        out += line(BACK_L + 4, yy, BACK_R - 4, yy, stroke=SOIL2, stroke_width=1)
    out += rect(BACK_L, GROUND_Y + 120, BACK_R - BACK_L, BOTTOM_Y - GROUND_Y - 120, fill=ROCK, opacity=0.55)
    for yy in range(int(GROUND_Y + 126), BOTTOM_Y, 12):
        out += line(BACK_L + 4, yy, BACK_R - 4, yy, stroke="#7B8490", stroke_width=1)

    # Excavation cavity — right of wall only
    exc_pts = [
        (EXC_L, GROUND_Y),
        (EXC_R, GROUND_Y),
        (EXC_R, BOTTOM_Y),
        (EXC_L + 40, BOTTOM_Y),
        (EXC_L, GROUND_Y + 80),
    ]
    out += polygon(exc_pts, fill=C["white"], stroke=C["navy"], stroke_width=2)
    for i, dy in enumerate([40, 100, 180]):
        y = GROUND_Y + dy
        out += line(EXC_L + 20 + i * 15, y, EXC_R - 20, y, stroke=C["gray"], stroke_width=1)
    out += text(1080, BOTTOM_Y - 24, "굴착저", size=14, fill=C["gray"])

    # Ground surface line
    out += line(BACK_L, GROUND_Y, EXC_R, GROUND_Y, stroke=C["navy"], stroke_width=2)
    out += g_close()
    return out


def _structures_layer() -> str:
    out = g_open("structures")
    # Retaining wall + waler
    out += rect(WALL_X0, GROUND_Y - 280, WALL_X1 - WALL_X0, BOTTOM_Y - GROUND_Y + 280, fill=C["light"], stroke=C["navy"], stroke_width=3)
    out += rect(WALL_X1, GROUND_Y - 120, 28, 80, fill=C["gray"], stroke=C["navy"], stroke_width=2)
    out += text(WALL_X1 + 56, GROUND_Y - 82, "띠장", size=14)

    # Strut on excavation side
    out += rect(WALL_X1 + 28, STRUT_Y - 10, EXC_R - 80 - WALL_X1 - 28, 20, fill=C["gray"], stroke=C["navy"], stroke_width=2)
    out += text(980, STRUT_Y - 28, "버팀보", size=14)

    # Building on backfill
    top = GROUND_Y - 300
    out += rect(BUILD_X0, top, BUILD_X1 - BUILD_X0, GROUND_Y - top, fill="#D1D5DB", stroke=C["navy"], stroke_width=2)
    out += rect(BUILD_X0 + 20, GROUND_Y, BUILD_X1 - BUILD_X0 - 40, 50, fill=C["gray"], stroke=C["navy"], stroke_width=1)
    out += text(205, top - 18, "인접 건물", size=18, weight="bold")

    # Zone labels
    out += text(200, GROUND_Y - 200, "인접 건물", size=16, fill=C["gray"])
    out += text(520, GROUND_Y - 180, "배면 지반", size=16, fill=C["gray"])
    out += text(850, GROUND_Y - 200, "흙막이 벽체·띠장", size=16, fill=C["gray"])
    out += text(1020, GROUND_Y - 200, "굴착측", size=16, fill=C["gray"])
    out += g_close()
    return out


def _sensors_layer() -> str:
    out = g_open("sensors")
    gwl_y = 640
    out += dashed_hline(BACK_L + 20, BACK_R - 20, gwl_y)
    out += text(BACK_R - 30, gwl_y - 18, "지하수위선 (G.W.L)", size=12, fill=C["teal"], anchor="end")

    # ① Inclinometer
    ix = 680
    out += line(ix, GROUND_Y - 20, ix, BOTTOM_Y - 40, stroke=C["teal"], stroke_width=5)
    for gy in range(GROUND_Y, BOTTOM_Y - 50, 28):
        out += line(ix - 6, gy, ix + 6, gy, stroke=C["navy"], stroke_width=1)
    out += sensor_marker(ix - 18, GROUND_Y - 50, "①")
    out += arrow(ix + 20, GROUND_Y - 80, ix + 70, GROUND_Y - 80)
    out += text(ix + 75, GROUND_Y - 92, "지중경사계", size=13, fill=C["teal"], anchor="start")
    out += text(ix + 75, GROUND_Y - 72, "수평변위 →", size=12, fill=C["gray"], anchor="start")
    out += text(ix + 20, BOTTOM_Y - 70, "안정층", size=12, fill=C["gray"], anchor="start")

    # ② Water level meter
    wx = 380
    out += line(wx, GROUND_Y - 30, wx, BOTTOM_Y - 80, stroke=C["gray"], stroke_width=4)
    out += rect(wx - 14, gwl_y - 30, 28, 40, fill=C["water"], stroke=C["navy"], stroke_width=1)
    out += sensor_marker(wx - 22, GROUND_Y - 115, "②")
    out += text(wx + 24, GROUND_Y - 100, "지하수위계", size=13, anchor="start")
    out += text(wx + 24, GROUND_Y - 82, "(관측공)", size=12, fill=C["gray"], anchor="start")

    # ③ Piezometer
    px = 520
    out += line(px, GROUND_Y - 10, px, GROUND_Y + 140, stroke=C["navy"], stroke_width=3)
    out += ellipse(px, GROUND_Y + 130, 10, 10, fill=C["teal"], stroke=C["navy"], stroke_width=2)
    out += rect(px - 6, GROUND_Y + 60, 12, 60, fill=C["light"], stroke=C["gray"], stroke_width=1)
    out += sensor_marker(px - 20, GROUND_Y + 20, "③")
    out += text(px + 22, GROUND_Y + 40, "간극수압계", size=13, anchor="start")

    # ④ Earth pressure cell
    ep_y = GROUND_Y - 160
    out += rounded_rect(WALL_X0 - 22, ep_y - 16, 20, 32, 2, fill=C["teal"], stroke=C["navy"], stroke_width=2)
    out += arrow(WALL_X0 - 50, ep_y, WALL_X0 - 24, ep_y)
    out += sensor_marker(WALL_X0 - 48, ep_y - 28, "④")
    out += text(WALL_X0 - 100, ep_y - 28, "토압계", size=13, fill=C["teal"], anchor="end")
    out += text(WALL_X0 - 100, ep_y - 8, "토압→", size=12, fill=C["gray"], anchor="end")

    # ⑤ Strut load cell at waler-strut junction
    lc_x = WALL_X1 + 28
    out += rounded_rect(lc_x - 8, STRUT_Y - 18, 30, 36, 3, fill=C["teal"], stroke=C["navy"], stroke_width=2)
    out += arrow(WALL_X0, STRUT_Y, lc_x - 10, STRUT_Y, width=3)
    out += sensor_marker(lc_x + 8, STRUT_Y - 36, "⑤")
    out += text(lc_x + 50, STRUT_Y - 36, "버팀보 하중계", size=13, fill=C["teal"], anchor="start")
    out += text(lc_x + 50, STRUT_Y - 16, "축압축력", size=12, fill=C["gray"], anchor="start")

    # ⑥ Anchor load cell — exposed on excavation side
    ah_y = GROUND_Y - 200
    ax = WALL_X1 + 30
    out += polygon(
        [(ax, ah_y), (ax + 50, ah_y - 20), (ax + 50, ah_y + 20)],
        fill=C["gray"],
        stroke=C["navy"],
        stroke_width=2,
    )
    out += rounded_rect(ax + 50, ah_y - 14, 28, 28, 3, fill=C["teal"], stroke=C["navy"], stroke_width=2)
    out += rounded_rect(ax + 78, ah_y - 10, 22, 20, 2, fill=C["light"], stroke=C["navy"], stroke_width=1)
    bx = WALL_X0 - 20
    out += line(ax + 90, ah_y, bx, ah_y + 40, stroke=C["navy"], stroke_width=3)
    out += arrow(ax + 30, ah_y, bx - 30, ah_y + 35, width=2)
    out += sensor_marker(ax + 8, ah_y - 38, "⑥")
    out += text(ax + 110, ah_y - 36, "어스앵커 하중계", size=13, fill=C["teal"], anchor="start")
    out += text(ax + 110, ah_y - 16, "인장력 T →", size=12, fill=C["gray"], anchor="start")
    out += text(ax + 52, ah_y + 28, "강연선", size=11, fill=C["gray"], anchor="start")

    # ⑦ Surface settlement
    for sx in (420, 480, 540):
        out += line(sx, GROUND_Y, sx, GROUND_Y + 16, stroke=C["teal"], stroke_width=3)
        out += circle(sx, GROUND_Y - 2, 4, fill=C["teal"], stroke=C["navy"], stroke_width=1)
    out += sensor_marker(500, GROUND_Y - 52, "⑦")
    out += text(500, GROUND_Y - 36, "지표침하계", size=13, fill=C["teal"])

    # ⑧ Tiltmeter — surface mount
    tx, ty = BUILD_X1 - 4, GROUND_Y - 120
    out += rounded_rect(tx, ty, 28, 36, 3, fill=C["teal"], stroke=C["navy"], stroke_width=2)
    out += line(tx + 14, ty + 36, tx + 14, ty + 52, stroke=C["navy"], stroke_width=2)
    out += circle(tx + 14, ty + 56, 6, fill=C["white"], stroke=C["navy"], stroke_width=1)
    out += sensor_marker(tx + 14, ty - 18, "⑧")
    out += text(tx + 40, ty + 18, "구조물경사계", size=12, fill=C["teal"], anchor="start")

    # ⑨ Crack gauge
    cy = GROUND_Y - 200
    out += line(BUILD_X1 - 2, cy - 20, BUILD_X1 - 2, cy + 20, stroke=C["red"], stroke_width=2)
    out += line(BUILD_X1 - 30, cy, BUILD_X1 + 8, cy, stroke=C["navy"], stroke_width=2)
    out += sensor_marker(BUILD_X1 + 22, cy, "⑨")
    out += text(BUILD_X1 + 36, cy, "균열계", size=12, anchor="start")

    # Prism on roof
    px_center = (BUILD_X0 + BUILD_X1) / 2
    py_roof = top = GROUND_Y - 300 - 8
    out += polygon(
        [(px_center, py_roof - 16), (px_center - 12, py_roof), (px_center + 12, py_roof)],
        fill=C["orange"],
        stroke=C["navy"],
        stroke_width=1,
    )
    out += text(px_center, py_roof - 28, "변위 타깃 프리즘", size=11)

    # ⑩ Strain gauge on waler
    out += rounded_rect(WALL_X1 + 32, GROUND_Y - 115, 20, 20, 2, fill=C["teal"], stroke=C["navy"], stroke_width=1)
    out += sensor_marker(WALL_X1 + 42, GROUND_Y - 130, "⑩")
    out += text(WALL_X1 + 58, GROUND_Y - 118, "변형률계", size=12, fill=C["teal"], anchor="start")

    # ⑪ Datalogger
    log_x, log_y, log_w, log_h = 600, GROUND_Y - 115, 150, 95
    out += _logger_enclosure(log_x, log_y, log_w, log_h)
    out += sensor_marker(log_x + log_w / 2, log_y - 22, "⑪")
    out += text(675, GROUND_Y - 128, "데이터로거", size=13)

    # Cable hints to logger
    for cx in (680, 380, 520):
        out += polyline(
            [(cx, GROUND_Y - 30), (640, GROUND_Y - 50), (log_x + 20, log_y + 10)],
            fill="none",
            stroke=C["gray"],
            stroke_width=1,
            dash="6 4",
        )

    # ATS on stable ground outside
    ats_x, ats_y = 40, GROUND_Y + 40
    out += rounded_rect(ats_x, ats_y, 56, 44, 4, fill=C["light"], stroke=C["navy"], stroke_width=2)
    out += circle(ats_x + 28, ats_y + 20, 10, fill=C["white"], stroke=C["navy"], stroke_width=1)
    out += text(ats_x + 28, ats_y - 12, "자동광파기", size=12, fill=C["gray"])
    out += text(ats_x + 28, ats_y + 58, "(부동점)", size=11, fill=C["gray"])
    prism_x = (BUILD_X0 + BUILD_X1) / 2
    prism_y = GROUND_Y - 308
    out += line(ats_x + 50, ats_y + 20, prism_x, prism_y, stroke=C["gray"], stroke_width=1, dash="8 6")
    out += text(320, GROUND_Y - 260, "시준선", size=11, fill=C["gray"])

    out += g_close()
    return out


def _legend_layer() -> str:
    out = g_open("legend")
    px = 1380
    out += rounded_rect(px, 120, 480, 800, 8, fill=C["white"], stroke=C["navy"], stroke_width=2)
    out += text(1620, 155, "계측기 범례 ①~⑪", size=20, weight="bold")
    items = [
        "① 지중경사계",
        "② 지하수위계 (관측공)",
        "③ 간극수압계",
        "④ 토압계",
        "⑤ 버팀보 하중계",
        "⑥ 어스앵커 하중계",
        "⑦ 지표침하계",
        "⑧ 구조물경사계",
        "⑨ 균열계",
        "⑩ 변형률계",
        "⑪ 데이터로거",
    ]
    y = 200
    for item in items:
        num = item[0]
        out += circle(px + 30, y, 6, fill=C["teal"])
        out += text(px + 48, y, item, size=16, anchor="start")
        y += 48
    out += text(1620, 880, "좌→우: 인접건물|배면|벽체|굴착측", size=14, fill=C["gray"])
    out += g_close()
    return out


def build_img002_svg() -> str:
    parts = [
        svg_open(),
        defs_header(),
        rect(0, 0, W, H, fill=C["white"]),
        g_open("title"),
        text(W / 2, 48, "흙막이 계측 설치 대표 단면도", size=34, weight="bold"),
        text(W / 2, 88, "Earth Retaining Wall Instrumentation Layout", size=20, fill=C["gray"]),
        g_close(),
        _ground_layer(),
        _structures_layer(),
        _sensors_layer(),
        _legend_layer(),
        svg_close(),
    ]
    return "".join(parts)


def write_img002_svg(dest: Path | None = None) -> Path:
    if dest is None:
        dest = (
            Path(__file__).resolve().parents[2]
            / "assets"
            / "images"
            / "technology"
            / "svg"
            / "IMG-002_흙막이-계측-설치-대표-단면도.svg"
        )
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(build_img002_svg(), encoding="utf-8")
    return dest
