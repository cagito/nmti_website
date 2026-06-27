"""SVG source generator for IMG-005 adjacent building crack & tilt monitoring.

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
    defs_header,
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

# Cross-section geometry (building left, excavation right — same as IMG-002)
GROUND_Y = 680
BOTTOM_Y = 980
BUILD_X0 = 70
BUILD_X1 = 250
WALL_X0 = 620
WALL_X1 = 670
BACK_L = BUILD_X1
BACK_R = WALL_X0
EXC_L = WALL_X1
EXC_R = 1040
STRUT_Y = GROUND_Y - 50
SOIL1 = "#E8D4B8"
SOIL2 = "#C4A574"
ROCK = "#9CA3AF"
BUILD_TOP = GROUND_Y - 310

PANEL_X = 1100


def _soil_layers(x0: float, x1: float, y0: float, y1: float) -> str:
    out = rect(x0, y0, x1 - x0, y1 - y0, fill=SOIL1)
    for yy in range(int(y0 + 6), int(y1), 14):
        out += line(x0 + 4, yy, x1 - 4, yy, stroke=SOIL2, stroke_width=1)
    mid = y0 + (y1 - y0) * 0.45
    out += rect(x0, mid, x1 - x0, y1 - mid, fill=ROCK, opacity=0.45)
    for yy in range(int(mid + 6), int(y1), 12):
        out += line(x0 + 4, yy, x1 - 4, yy, stroke="#7B8490", stroke_width=1)
    return out


def _cross_section() -> str:
    out = g_open("cross-section")

    # Continuous backfill under building and to wall (full width from building foot to wall)
    out += _soil_layers(BUILD_X0, BACK_R, GROUND_Y, BOTTOM_Y)

    # Excavation — right of wall only
    exc = [(EXC_L, GROUND_Y), (EXC_R, GROUND_Y), (EXC_R, BOTTOM_Y), (EXC_L + 35, BOTTOM_Y), (EXC_L, GROUND_Y + 70)]
    out += polygon(exc, fill=C["white"], stroke=C["navy"], stroke_width=2)
    for i, dy in enumerate([35, 90, 160]):
        y = GROUND_Y + dy
        out += line(EXC_L + 15 + i * 12, y, EXC_R - 15, y, stroke=C["gray"], stroke_width=1)
    out += text(EXC_R - 50, BOTTOM_Y - 20, "굴착저", size=13, fill=C["gray"], anchor="end")
    out += line(BUILD_X0, GROUND_Y, EXC_R, GROUND_Y, stroke=C["navy"], stroke_width=2)

    # Retaining wall + waler + strut
    out += rect(WALL_X0, GROUND_Y - 260, WALL_X1 - WALL_X0, BOTTOM_Y - GROUND_Y + 260, fill=C["light"], stroke=C["navy"], stroke_width=3)
    out += rect(WALL_X1, GROUND_Y - 110, 24, 70, fill=C["gray"], stroke=C["navy"], stroke_width=2)
    out += rect(WALL_X1 + 24, STRUT_Y - 8, EXC_R - 70 - WALL_X1 - 24, 16, fill=C["gray"], stroke=C["navy"], stroke_width=2)
    out += text(WALL_X1 + 80, STRUT_Y - 22, "버팀보", size=12, fill=C["gray"], anchor="start")

    # Building on original ground
    out += rect(BUILD_X0, BUILD_TOP, BUILD_X1 - BUILD_X0, GROUND_Y - BUILD_TOP, fill="#D1D5DB", stroke=C["navy"], stroke_width=2)
    out += rect(BUILD_X0 + 18, GROUND_Y, BUILD_X1 - BUILD_X0 - 36, 45, fill=C["gray"], stroke=C["navy"], stroke_width=1)
    for fy in (BUILD_TOP + 70, BUILD_TOP + 150, BUILD_TOP + 230):
        out += line(BUILD_X0 + 8, fy, BUILD_X1 - 8, fy, stroke=C["gray"], stroke_width=1)
    out += text((BUILD_X0 + BUILD_X1) / 2, BUILD_TOP - 16, "주변건물", size=16, weight="bold")

    # Zone labels
    out += text(160, BUILD_TOP + 20, "주변건물", size=13, fill=C["gray"])
    out += text(430, GROUND_Y - 120, "배면 지반", size=13, fill=C["gray"])
    out += text(645, BUILD_TOP + 30, "흙막이", size=13, fill=C["gray"])
    out += text(880, GROUND_Y - 130, "굴착측", size=13, fill=C["gray"])

    # Soil layer callouts (continuous under building)
    out += text(400, GROUND_Y + 50, "매립층", size=11, fill=C["gray"])
    out += text(400, GROUND_Y + 130, "모래층", size=11, fill=C["gray"])
    out += text(400, GROUND_Y + 210, "자갈층", size=11, fill=C["gray"])
    out += text(400, BOTTOM_Y - 40, "연암층", size=11, fill=C["gray"])

    # 이격거리 L on SOIL (not void)
    ly = GROUND_Y - 28
    out += line(BUILD_X1 + 8, ly, WALL_X0 - 8, ly, stroke=C["navy"], stroke_width=1)
    out += line(BUILD_X1 + 8, ly - 6, BUILD_X1 + 8, ly + 6, stroke=C["navy"], stroke_width=1)
    out += line(WALL_X0 - 8, ly - 6, WALL_X0 - 8, ly + 6, stroke=C["navy"], stroke_width=1)
    out += text((BUILD_X1 + WALL_X0) / 2, ly - 14, "이격거리 (L) 5.0 m", size=12, fill=C["navy"])

    # Settlement hint in backfill (causal link)
    out += arrow(380, GROUND_Y - 8, 420, GROUND_Y - 8, width=2)
    out += text(430, GROUND_Y - 22, "배면 침하·변위", size=11, fill=C["teal"], anchor="start")

    out += g_close()
    return out


def _building_sensors() -> str:
    out = g_open("building-sensors")

    # ① Crack gauge — perpendicular to crack on exterior wall
    crack_x = BUILD_X1 - 2
    crack_y = GROUND_Y - 195
    out += line(crack_x, crack_y - 28, crack_x, crack_y + 28, stroke=C["red"], stroke_width=2)
    out += line(crack_x - 26, crack_y, crack_x + 10, crack_y, stroke=C["navy"], stroke_width=2)
    out += circle(crack_x - 22, crack_y, 4, fill=C["teal"], stroke=C["navy"], stroke_width=1)
    out += circle(crack_x + 6, crack_y, 4, fill=C["teal"], stroke=C["navy"], stroke_width=1)
    out += sensor_marker(crack_x + 24, crack_y, "①")
    out += text(crack_x + 38, crack_y, "균열계", size=12, fill=C["teal"], anchor="start")

    # ② Structure tiltmeter — surface mount on 1st floor wall
    tx, ty = BUILD_X1 - 2, GROUND_Y - 95
    out += rounded_rect(tx - 2, ty - 18, 26, 32, 3, fill=C["teal"], stroke=C["navy"], stroke_width=2)
    out += line(tx + 11, ty + 14, tx + 11, ty + 28, stroke=C["navy"], stroke_width=2)
    out += circle(tx + 11, ty + 32, 5, fill=C["white"], stroke=C["navy"], stroke_width=1)
    out += sensor_marker(tx + 11, ty - 32, "②")
    out += text(tx + 38, ty + 2, "구조물경사계", size=12, fill=C["teal"], anchor="start")

    # ③ Prism on roof
    px = (BUILD_X0 + BUILD_X1) / 2 + 30
    py = BUILD_TOP - 6
    out += polygon([(px, py - 14), (px - 10, py), (px + 10, py)], fill=C["orange"], stroke=C["navy"], stroke_width=1)
    out += sensor_marker(px, py - 28, "③")
    out += text(px, py - 42, "변위 타깃 프리즘", size=11)

    # ATS outside deformation zone — on ground surface (not buried)
    ats_x, ats_y = 42, GROUND_Y - 22
    out += rounded_rect(ats_x, ats_y - 42, 52, 40, 4, fill=C["light"], stroke=C["navy"], stroke_width=2)
    out += circle(ats_x + 26, ats_y - 24, 9, fill=C["white"], stroke=C["navy"], stroke_width=1)
    out += text(ats_x + 26, ats_y - 52, "자동광파기", size=11, fill=C["gray"])
    out += text(ats_x + 26, ats_y + 22, "(부동점)", size=10, fill=C["gray"])
    out += line(ats_x + 48, ats_y - 24, px, py - 10, stroke=C["gray"], stroke_width=1, dash="8 5")
    out += text(180, BUILD_TOP - 40, "시준선", size=10, fill=C["gray"])

    out += g_close()
    return out


def _right_panels() -> str:
    out = g_open("right-panels")
    px = PANEL_X

    # Panel 1 — crack gauge principle
    out += rounded_rect(px, 110, 780, 200, 6, fill=C["white"], stroke=C["navy"], stroke_width=2)
    out += text(px + 390, 135, "균열계 설치 원리", size=15, weight="bold")
    ix, iy = px + 80, 175
    out += line(ix + 40, iy, ix + 40, iy + 90, stroke=C["red"], stroke_width=2)
    out += line(ix, iy + 45, ix + 80, iy + 45, stroke=C["navy"], stroke_width=2)
    out += rect(ix + 28, iy + 38, 24, 14, fill=C["teal"], stroke=C["navy"], stroke_width=1)
    out += circle(ix + 8, iy + 45, 5, fill=C["teal"], stroke=C["navy"], stroke_width=1)
    out += circle(ix + 72, iy + 45, 5, fill=C["teal"], stroke=C["navy"], stroke_width=1)
    out += text(ix + 40, iy + 108, "앵커", size=11, fill=C["gray"])
    out += arrow(ix + 52, iy + 45, ix + 68, iy + 45, width=2)
    out += text(ix + 55, iy + 32, "변위", size=11, fill=C["teal"])
    out += text(px + 420, iy + 50, "균열폭 Δ", size=12, anchor="start")

    # Panel 2 — data flow
    out += rounded_rect(px, 330, 780, 175, 6, fill=C["white"], stroke=C["navy"], stroke_width=2)
    out += text(px + 390, 355, "구조물경사계 · 데이터 흐름", size=15, weight="bold")
    boxes = [
        (px + 40, 380, 130, 44, "구조물\n경사계", C["teal"]),
        (px + 210, 380, 120, 44, "데이터\n로거", C["light"]),
        (px + 370, 380, 120, 44, "관리기준", C["light"]),
        (px + 530, 380, 100, 44, "경보", C["light"]),
    ]
    for i, (bx, by, bw, bh, lbl, col) in enumerate(boxes):
        out += rounded_rect(bx, by, bw, bh, 4, fill=col, stroke=C["navy"], stroke_width=1)
        parts = lbl.split("\n")
        out += text(bx + bw / 2, by + bh / 2 - (6 if len(parts) > 1 else 0), parts[0], size=11)
        if len(parts) > 1:
            out += text(bx + bw / 2, by + bh / 2 + 12, parts[1], size=11)
        if i < len(boxes) - 1:
            nx = boxes[i + 1][0]
            out += arrow(bx + bw + 4, by + bh / 2, nx - 4, by + bh / 2, width=2)
    out += circle(px + 580, 402, 8, fill=C["green"], stroke=C["navy"], stroke_width=1)
    out += text(px + 600, 392, "주의", size=10, fill=C["green"], anchor="start")
    out += circle(px + 580, 422, 8, fill=C["orange"], stroke=C["navy"], stroke_width=1)
    out += text(px + 600, 412, "경계", size=10, fill=C["orange"], anchor="start")
    out += circle(px + 680, 402, 8, fill=C["red"], stroke=C["navy"], stroke_width=1)
    out += text(px + 700, 392, "위험", size=10, fill=C["red"], anchor="start")

    # Panel 3 — crack width trend (example)
    out += rounded_rect(px, 525, 780, 280, 6, fill=C["white"], stroke=C["navy"], stroke_width=2)
    out += text(px + 390, 550, "균열폭 추세 (예시)", size=15, weight="bold")
    gx0, gy0 = px + 70, 760
    gw, gh = 640, 160
    out += line(gx0, gy0, gx0, gy0 - gh, stroke=C["navy"], stroke_width=1)
    out += line(gx0, gy0, gx0 + gw, gy0, stroke=C["navy"], stroke_width=1)
    out += text(gx0 - 8, gy0 - gh / 2, "mm", size=10, anchor="end", fill=C["gray"])
    out += text(gx0 + gw / 2, gy0 + 18, "경과", size=10, fill=C["gray"])
    # thresholds
    for val, col, yoff in [(0.3, C["green"], 0.75), (0.6, C["orange"], 0.5), (0.9, C["red"], 0.25)]:
        ty = gy0 - gh * yoff
        out += line(gx0, ty, gx0 + gw, ty, stroke=col, stroke_width=1, dash="6 4")
        out += text(gx0 + gw + 8, ty, f"{val}", size=9, fill=col, anchor="start")
    # trend line
    pts = [(gx0 + 40, gy0 - 30), (gx0 + 180, gy0 - 55), (gx0 + 320, gy0 - 85), (gx0 + 460, gy0 - 110), (gx0 + 600, gy0 - 130)]
    out += polyline(pts, fill="none", stroke=C["teal"], stroke_width=2)
    for i, (x, y) in enumerate(pts):
        out += circle(x, y, 4, fill=C["teal"], stroke=C["navy"], stroke_width=1)

    # Legend bottom
    out += rounded_rect(px, 830, 780, 120, 6, fill=C["light"], stroke=C["navy"], stroke_width=1)
    out += text(px + 390, 855, "범례", size=14, weight="bold")
    leg = ["① 균열계", "② 구조물경사계", "③ 변위 타깃 프리즘"]
    lx = px + 50
    for item in leg:
        out += circle(lx, 890, 5, fill=C["teal"])
        out += text(lx + 14, 890, item, size=13, anchor="start")
        lx += 220
    out += text(px + 390, 920, "좌→우: 주변건물 | 배면(연속 토사) | 벽체 | 굴착측", size=12, fill=C["gray"])

    out += g_close()
    return out


def build_img005_svg() -> str:
    parts = [
        svg_open(),
        defs_header(),
        rect(0, 0, W, H, fill=C["white"]),
        g_open("title"),
        text(W / 2, 44, "주변건물 균열·경사 계측도", size=32, weight="bold"),
        text(W / 2, 78, "Adjacent Building Crack & Tilt Monitoring Layout", size=18, fill=C["gray"]),
        g_close(),
        # divider
        line(PANEL_X - 12, 100, PANEL_X - 12, 960, stroke=C["light"], stroke_width=2),
        _cross_section(),
        _building_sensors(),
        _right_panels(),
        svg_close(),
    ]
    return "".join(parts)


def write_img005_svg(dest: Path | None = None) -> Path:
    if dest is None:
        dest = (
            Path(__file__).resolve().parents[2]
            / "assets"
            / "images"
            / "technology"
            / "svg"
            / "IMG-005_주변건물-균열-경사-계측도_굴착주변건물배치.svg"
        )
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(build_img005_svg(), encoding="utf-8")
    return dest
