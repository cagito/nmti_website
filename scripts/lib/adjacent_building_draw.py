"""Adjacent building crack & tilt monitoring (IMG-005 v4).

Pillow only — doc 15 BLD-01~05 · INSTRUMENTATION §3.18.
"""
from __future__ import annotations

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, load_font

SOIL1 = "#E8D4B8"
SOIL2 = "#C4A574"
ROCK = "#9CA3AF"

# Main diagram zone (left ~62%)
MAIN_R = 1080
PANEL_L = 1092

GROUND_Y = 660
BOTTOM_Y = 960
BUILD_X0 = 100
BUILD_X1 = 280
WALL_X0 = 700
WALL_X1 = 748
EXC_R = 1020
BUILD_TOP = GROUND_Y - 300


def _panel_box(draw: ImageDraw.ImageDraw, x0: int, y0: int, x1: int, y1: int, title: str) -> None:
    draw.rounded_rectangle([x0, y0, x1, y1], outline=_hex(C["navy"]), width=2, fill=_hex(C["white"]))
    draw_label(draw, title, ((x0 + x1) // 2, y0 + 20), load_font(14, bold=True))


def _leader(
    draw: ImageDraw.ImageDraw,
    ax: int,
    ay: int,
    lx: int,
    ly: int,
    text: str,
    *,
    sub: str = "",
    color: str = C["navy"],
) -> None:
    draw.line([(ax, ay), (lx, ly)], fill=_hex(C["gray"]), width=1)
    draw.ellipse([ax - 3, ay - 3, ax + 3, ay + 3], fill=_hex(color), outline=_hex(C["navy"]), width=1)
    draw_label(draw, text, (lx, ly), load_font(12), fill=color, anchor="lm")
    if sub:
        draw_label(draw, sub, (lx, ly + 16), load_font(10), fill=C["gray"], anchor="lm")


def _soil_layers(draw: ImageDraw.ImageDraw, x0: int, x1: int, y0: int, y1: int) -> None:
    draw.rectangle([x0, y0, x1, y1], fill=_hex(SOIL1))
    for yy in range(y0 + 8, y1, 16):
        draw.line([(x0 + 6, yy), (x1 - 6, yy)], fill=_hex(SOIL2), width=1)
    mid = y0 + int((y1 - y0) * 0.42)
    draw.rectangle([x0, mid, x1, y1], fill=_hex(ROCK))
    for yy in range(mid + 8, y1, 14):
        draw.line([(x0 + 6, yy), (x1 - 6, yy)], fill=_hex("#7B8490"), width=1)


def _main_cross_section(draw: ImageDraw.ImageDraw) -> None:
    f13 = load_font(13)
    f11 = load_font(11)

    draw.rectangle([36, 108, MAIN_R, 960], outline=_hex(C["navy"]), width=2)

    # Continuous backfill soil (C1 — no void under L)
    _soil_layers(draw, BUILD_X0, WALL_X0, GROUND_Y, BOTTOM_Y)
    draw.line([(BUILD_X0, GROUND_Y), (WALL_X0, GROUND_Y)], fill=_hex(C["navy"]), width=3)
    draw_label(draw, "지표면 (원 지반)", (400, GROUND_Y - 20), f13, fill=C["navy"])

    # Excavation (right only)
    exc = [(WALL_X1, GROUND_Y), (EXC_R, GROUND_Y), (EXC_R, BOTTOM_Y), (WALL_X1 + 32, BOTTOM_Y), (WALL_X1, GROUND_Y + 55)]
    draw.polygon(exc, fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "굴착측", (900, GROUND_Y - 36), f13, fill=C["gray"])
    draw_label(draw, "굴착저", (940, BOTTOM_Y - 22), f11, fill=C["gray"])

    # Wall + strut (compact — B4)
    draw.rectangle([WALL_X0, GROUND_Y - 220, WALL_X1, BOTTOM_Y], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)
    draw.rectangle([WALL_X1, GROUND_Y - 90, WALL_X1 + 20, GROUND_Y - 35], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)
    sy = GROUND_Y - 48
    draw.rectangle([WALL_X1 + 20, sy - 7, EXC_R - 60, sy + 7], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)

    # Building on surface (C1b)
    draw.rectangle([BUILD_X0, 120, BUILD_X1, GROUND_Y], fill=_hex(C["white"]))
    draw.rectangle([BUILD_X0, BUILD_TOP, BUILD_X1, GROUND_Y], fill=_hex("#D1D5DB"), outline=_hex(C["navy"]), width=2)
    draw.rectangle([BUILD_X0 + 16, GROUND_Y, BUILD_X1 - 16, GROUND_Y + 42], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=1)
    for fy in (BUILD_TOP + 65, BUILD_TOP + 140, BUILD_TOP + 215):
        draw.line([(BUILD_X0 + 8, fy), (BUILD_X1 - 8, fy)], fill=_hex(C["gray"]), width=1)

    draw_label(draw, "주변건물", ((BUILD_X0 + BUILD_X1) // 2, BUILD_TOP - 28), load_font(17, bold=True))
    draw_label(draw, "배면 지반", (480, GROUND_Y + 36), f13, fill=C["gray"])
    draw_label(draw, "흙막이·띠장", (WALL_X0 + 24, GROUND_Y - 200), f13, fill=C["gray"])

    # Separation L on filled soil
    ly = GROUND_Y - 18
    draw.line([(BUILD_X1 + 6, ly), (WALL_X0 - 6, ly)], fill=_hex(C["navy"]), width=1)
    for x in (BUILD_X1 + 6, WALL_X0 - 6):
        draw.line([(x, ly - 5), (x, ly + 5)], fill=_hex(C["navy"]), width=1)
    draw_label(draw, "이격거리 (L)", ((BUILD_X1 + WALL_X0) // 2, ly - 18), f12 := load_font(12), fill=C["navy"])

    # Influence zone hint (C3)
    draw.rounded_rectangle([BUILD_X1 + 24, GROUND_Y + 4, WALL_X0 - 24, GROUND_Y + 38], outline=_hex(C["teal"]), width=1)
    draw_label(draw, "영향권 — 배면 침하·변위", (480, GROUND_Y + 58), f11, fill=C["teal"])


def _main_sensors(draw: ImageDraw.ImageDraw) -> None:
    # B1 — crack gauge crossing crack
    cx, cy = BUILD_X1 - 2, GROUND_Y - 185
    draw.line([(cx, cy - 26), (cx, cy + 26)], fill=_hex(C["red"]), width=2)
    draw.line([(cx - 22, cy), (cx + 8, cy)], fill=_hex(C["navy"]), width=2)
    draw.ellipse([cx - 20, cy - 4, cx - 12, cy + 4], fill=_hex(C["teal"]), outline=_hex(C["navy"]))
    draw.ellipse([cx + 2, cy - 4, cx + 10, cy + 4], fill=_hex(C["teal"]), outline=_hex(C["navy"]))
    _leader(draw, cx, cy, cx + 36, cy - 8, "① 균열계", sub="균열 교차·양측 앵커", color=C["teal"])

    # B2 — tiltmeter on exterior wall
    tx, ty = BUILD_X1 - 2, GROUND_Y - 88
    draw.rounded_rectangle([tx - 2, ty - 16, tx + 24, ty + 12], radius=3, fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw.line([(tx + 11, ty + 12), (tx + 11, ty + 26)], fill=_hex(C["navy"]), width=2)
    draw.ellipse([tx + 5, ty + 24, tx + 17, ty + 36], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=1)
    draw.arc([tx - 6, ty - 6, tx + 28, ty + 28], start=200, end=268, fill=_hex(C["orange"]), width=2)
    draw_label(draw, "θ", (tx + 30, ty - 2), load_font(12), fill=C["orange"])
    _leader(draw, tx + 12, ty, tx + 38, ty - 6, "② 구조물경사계", sub="기울기 θ (변위 아님)", color=C["teal"])

    # B3 — prisms on roof (not labeled as ATS)
    prisms = [(BUILD_X0 + 48, BUILD_TOP - 8), ((BUILD_X0 + BUILD_X1) // 2, BUILD_TOP - 12), (BUILD_X1 - 44, BUILD_TOP - 10)]
    for i, (px, py) in enumerate(prisms):
        draw.polygon([(px, py - 12), (px - 9, py), (px + 9, py)], fill=_hex(C["orange"]), outline=_hex(C["navy"]))
    _leader(draw, prisms[1][0], prisms[1][1] - 14, prisms[1][0], BUILD_TOP - 48, "③ 변위 타깃 프리즘", sub="복수 측점", color=C["orange"])

    # ATS + BM — stable ground left of building
    ats_x, ats_y = 44, GROUND_Y - 36
    draw.line([(ats_x + 22, ats_y + 38), (ats_x + 22, GROUND_Y)], fill=_hex(C["navy"]), width=2)
    draw.rounded_rectangle([ats_x, ats_y, ats_x + 44, ats_y + 36], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw.ellipse([ats_x + 14, ats_y + 10, ats_x + 30, ats_y + 26], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=1)
    _leader(draw, ats_x + 22, ats_y + 18, ats_x + 22, ats_y - 12, "자동광파기 (ATS)", sub="부동점", color=C["gray"])

    bm_x, bm_y = 44, GROUND_Y + 8
    draw.polygon([(bm_x, bm_y - 14), (bm_x - 8, bm_y), (bm_x + 8, bm_y)], fill=_hex(C["green"]), outline=_hex(C["navy"]))
    draw_label(draw, "기준점 (BM)", (bm_x, bm_y + 16), load_font(10), fill=C["green"])

    # LoS — thin lines only, no per-line labels
    for px, py in prisms:
        draw.line([(ats_x + 42, ats_y + 16), (px, py)], fill=_hex("#CBD5E1"), width=1)
    draw_label(draw, "시준선 (복수)", (220, BUILD_TOP - 58), load_font(11), fill=C["gray"])


def _panel_ats_network(draw: ImageDraw.ImageDraw) -> None:
    x0, y0, x1, y1 = PANEL_L, 108, 1884, 228
    _panel_box(draw, x0, y0, x1, y1, "자동광파기(ATS) 네트워크")

    net_x = x0 + 50
    cy = y0 + 78
    draw_label(draw, "BM", (net_x - 18, cy), load_font(11), fill=C["green"])
    draw.rounded_rectangle([net_x, cy - 18, net_x + 64, cy + 18], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "ATS", (net_x + 32, cy), load_font(12))
    for i, dx in enumerate([100, 200, 300, 400]):
        tx = net_x + 64 + dx
        draw.polygon([(tx, cy - 10), (tx - 8, cy + 8), (tx + 8, cy + 8)], fill=_hex(C["orange"]), outline=_hex(C["navy"]))
        draw.line([(net_x + 64, cy), (tx - 8, cy)], fill=_hex(C["gray"]), width=1)
        draw_label(draw, f"P{i + 1}", (tx, cy + 22), load_font(10), fill=C["gray"])
    draw_label(draw, "기준점 → ATS → 복수 프리즘 시준", ((x0 + x1) // 2, y1 - 22), load_font(11), fill=C["gray"])


def _panel_principles(draw: ImageDraw.ImageDraw) -> None:
    px = PANEL_L
    # Crack
    x0, y0, x1, y1 = px, 240, px + 380, 390
    _panel_box(draw, x0, y0, x1, y1, "균열계 원리")
    ix, iy = x0 + 50, y0 + 70
    draw.line([(ix + 36, iy), (ix + 36, iy + 60)], fill=_hex(C["red"]), width=2)
    draw.line([(ix, iy + 30), (ix + 72, iy + 30)], fill=_hex(C["navy"]), width=2)
    draw.rounded_rectangle([ix + 26, iy + 24, ix + 46, iy + 36], radius=2, fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
    draw_arrow(draw, ix + 48, iy + 30, ix + 66, iy + 30, color=C["teal"], width=2)
    draw_label(draw, "Δ (균열폭)", ((x0 + x1) // 2, y1 - 28), load_font(12))

    # Tilt
    x0, y0, x1, y1 = px + 392, 240, px + 792, 390
    _panel_box(draw, x0, y0, x1, y1, "구조물경사계 — 기울기 θ")
    bx, by = x0 + 70, y0 + 100
    draw.rectangle([bx, by - 44, bx + 18, by + 44], fill=_hex("#D1D5DB"), outline=_hex(C["navy"]), width=2)
    draw.rounded_rectangle([bx + 16, by - 16, bx + 40, by + 8], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw.arc([bx - 8, by - 24, bx + 48, by + 32], start=88, end=108, fill=_hex(C["orange"]), width=2)
    draw_label(draw, "θ", (bx + 50, by - 8), load_font(13), fill=C["orange"])
    draw_label(draw, "경사·회전 (변위 아님)", ((x0 + x1) // 2, y1 - 28), load_font(11), fill=C["gray"])


def _panel_trend(draw: ImageDraw.ImageDraw) -> None:
    x0, y0, x1, y1 = PANEL_L, 402, 1884, 640
    _panel_box(draw, x0, y0, x1, y1, "균열폭 추세 (예시 · 현장별 관리기준)")

    gx0, gy0 = x0 + 60, y1 - 50
    gw, gh = 720, 140
    draw.line([(gx0, gy0), (gx0, gy0 - gh)], fill=_hex(C["navy"]), width=1)
    draw.line([(gx0, gy0), (gx0 + gw, gy0)], fill=_hex(C["navy"]), width=1)
    draw_label(draw, "mm", (gx0 - 10, gy0 - gh // 2), load_font(11), fill=C["gray"], anchor="rm")
    draw_label(draw, "경과", (gx0 + gw // 2, gy0 + 18), load_font(11), fill=C["gray"])

    thresholds = [
        (0.78, C["green"], "1차(주의)"),
        (0.52, C["orange"], "2차(경보)"),
        (0.28, C["red"], "3차(위험)"),
    ]
    for frac, col, lbl in thresholds:
        ty = gy0 - int(gh * frac)
        x = gx0
        while x < gx0 + gw:
            draw.line([(x, ty), (min(x + 8, gx0 + gw), ty)], fill=_hex(col), width=1)
            x += 14
        draw_label(draw, lbl, (gx0 + gw + 10, ty), load_font(10), fill=col, anchor="lm")

    pts = [(gx0 + 50, gy0 - 28), (gx0 + 200, gy0 - 52), (gx0 + 380, gy0 - 78), (gx0 + 560, gy0 - 98), (gx0 + 680, gy0 - 118)]
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i + 1]], fill=_hex(C["teal"]), width=2)
    for p in pts:
        draw.ellipse([p[0] - 4, p[1] - 4, p[0] + 4, p[1] + 4], fill=_hex(C["teal"]), outline=_hex(C["navy"]))


def _panel_flow_legend(draw: ImageDraw.ImageDraw) -> None:
    x0, y0, x1, y1 = PANEL_L, 652, 1884, 950
    _panel_box(draw, x0, y0, x1, y1, "데이터 흐름 · 범례")

    f11 = load_font(11)
    boxes = [
        (x0 + 36, y0 + 52, 128, 42, "균열계/경사계"),
        (x0 + 188, y0 + 52, 100, 42, "로거"),
        (x0 + 312, y0 + 52, 108, 42, "관리기준"),
        (x0 + 444, y0 + 52, 88, 42, "경보"),
    ]
    for i, (bx, by, bw, bh, lbl) in enumerate(boxes):
        draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=4, fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)
        draw_label(draw, lbl, (bx + bw // 2, by + bh // 2), f11)
        if i < len(boxes) - 1:
            nx = boxes[i + 1][0]
            draw_arrow(draw, bx + bw + 3, by + bh // 2, nx - 3, by + bh // 2, color=C["teal"], width=2)

    leg_y = y0 + 140
    for item, lx in [("① 균열계", x0 + 44), ("② 구조물경사계 (θ)", x0 + 200), ("③ 프리즘 (복수)", x0 + 420)]:
        draw.ellipse([lx, leg_y - 5, lx + 10, leg_y + 5], fill=_hex(C["teal"]))
        draw_label(draw, item, (lx + 16, leg_y), load_font(12), anchor="lm")

    draw_label(
        draw,
        "좌→우: 주변건물 | 배면(연속 토사) | 흙막이 | 굴착측",
        ((x0 + x1) // 2, y1 - 28),
        load_font(12),
        fill=C["gray"],
    )


def render_img005(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "주변건물 균열·경사 계측도", (MAIN_R // 2 + 18, 42), font_title)
    draw_label(
        draw,
        "Adjacent Building Crack & Tilt Monitoring",
        (MAIN_R // 2 + 18, 82),
        load_font(17),
        fill=C["gray"],
    )
    draw.line([(PANEL_L - 8, 100), (PANEL_L - 8, 960)], fill=_hex(C["light"]), width=2)
    _main_cross_section(draw)
    _main_sensors(draw)
    _panel_ats_network(draw)
    _panel_principles(draw)
    _panel_trend(draw)
    _panel_flow_legend(draw)
