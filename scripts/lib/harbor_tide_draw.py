"""Harbor seawall tide & groundwater (IMG-098).

HAR-01~04 · INSTRUMENTATION §3.26 — Pillow only.
"""
from __future__ import annotations

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, draw_logger_block_icon, load_font
from .sensor_install_draw import render_img030_comparison_inset

MAIN_R = 1060
PANEL_L = 1072
BOTTOM_Y = 920
BED_Y = 860

SEA_L = 56
REVET_L = 270
REVET_R = 600
BACK_R = MAIN_R - 16

HWL_Y = 448
LWL_Y = 528
GL_Y = 500

SOIL = "#E8D4B8"
SOIL2 = "#C4A574"
ROCK_SEA = "#6B7280"
FILTER_MAT = "#86EFAC"

# Curved phreatic / tidal lag line (HAR-03) — must match well & piezo heads
PHREATIC = [
    (REVET_L, LWL_Y),
    (380, 540),
    (520, 520),
    (680, 505),
    (820, 572),
    (960, 560),
]


def _panel_box(draw: ImageDraw.ImageDraw, x0: int, y0: int, x1: int, y1: int, title: str) -> None:
    draw.rounded_rectangle([x0, y0, x1, y1], outline=_hex(C["navy"]), width=2, fill=_hex(C["white"]))
    draw_label(draw, title, ((x0 + x1) // 2, y0 + 18), load_font(13, bold=True))


def _dashed_line(draw: ImageDraw.ImageDraw, pts: list[tuple[int, int]], color: str, width: int = 2) -> None:
    for i in range(len(pts) - 1):
        x1, y1 = pts[i]
        x2, y2 = pts[i + 1]
        steps = max(abs(x2 - x1), abs(y2 - y1), 1) // 5
        for s in range(steps):
            t0, t1 = s / steps, (s + 0.55) / steps
            ax = int(x1 + (x2 - x1) * t0)
            ay = int(y1 + (y2 - y1) * t0)
            bx = int(x1 + (x2 - x1) * t1)
            by = int(y1 + (y2 - y1) * t1)
            draw.line([(ax, ay), (bx, by)], fill=_hex(color), width=width)


def _screen_pipe(draw: ImageDraw.ImageDraw, wx: int, ground: int, gwl_y: int, bottom: int) -> None:
    """Observation well with perforated screen (HAR-04)."""
    f11 = load_font(11)
    draw.rounded_rectangle([wx - 26, ground - 44, wx + 26, ground - 6], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "well cap", (wx, ground - 54), f11, fill=C["navy"])
    draw.rectangle([wx - 20, ground - 6, wx + 20, bottom - 40], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    # Sealed upper (surface to above water)
    seal_bot = min(gwl_y - 8, ground + 40)
    draw.rectangle([wx - 16, ground, wx + 16, seal_bot], fill=_hex(C["light"]), outline=_hex(C["gray"]), width=1)
    # Screen zone — slits
    sy0, sy1 = gwl_y, bottom - 80
    draw.rectangle([wx - 16, sy0, wx + 16, sy1], fill=_hex("#93C5FD"), outline=_hex(C["teal"]), width=1)
    for yy in range(sy0 + 8, sy1, 12):
        draw.line([(wx - 14, yy), (wx + 14, yy)], fill=_hex(C["teal"]), width=1)
    draw_label(draw, "screen", (wx + 28, (sy0 + sy1) // 2), f11, fill=C["teal"])
    draw.rectangle([wx - 16, sy1, wx + 18, sy1 + 36], fill=_hex(SOIL2), outline=_hex(C["gray"]), width=1)
    draw_label(draw, "filter pack", (wx + 28, sy1 + 12), load_font(10), fill=C["gray"])
    # Open water column to G.W.L
    draw.rectangle([wx - 12, gwl_y, wx + 12, sy0], fill=_hex("#93C5FD"), outline=_hex(C["teal"]), width=1)
    draw.ellipse([wx - 8, gwl_y - 4, wx + 8, gwl_y + 10], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
    draw.line([(wx - 22, gwl_y), (wx + 30, gwl_y)], fill=_hex("#3B82F6"), width=2)


def _piezometer(draw: ImageDraw.ImageDraw, px: int, tip_y: int) -> None:
    top = GL_Y - 30
    draw.line([(px, top), (px, tip_y + 24)], fill=_hex(C["navy"]), width=3)
    draw.rectangle([px - 10, top, px + 10, tip_y - 16], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)
    draw.rectangle([px - 12, tip_y - 18, px + 12, tip_y + 18], fill=_hex(SOIL2), outline=_hex(C["teal"]), width=2)
    draw.ellipse([px - 7, tip_y - 2, px + 7, tip_y + 10], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw.line([(px - 18, tip_y), (px + 22, tip_y)], fill=_hex("#3B82F6"), width=2)
    draw_label(draw, "③ filter tip", (px + 26, tip_y - 8), load_font(11), fill=C["navy"])


def _main_section(draw: ImageDraw.ImageDraw) -> None:
    f13 = load_font(13)
    f11 = load_font(11)

    draw.rectangle([48, 108, MAIN_R, BOTTOM_Y], outline=_hex(C["navy"]), width=2)

    # Seabed
    draw.rectangle([SEA_L, BED_Y, BACK_R, BOTTOM_Y], fill=_hex(ROCK_SEA))
    for yy in range(BED_Y + 8, BOTTOM_Y, 12):
        draw.line([(SEA_L + 8, yy), (BACK_R - 8, yy)], fill=_hex("#4B5563"), width=1)

    # --- Left: sea (HAR-02) ---
    draw.rectangle([SEA_L, HWL_Y, REVET_L - 10, BED_Y], fill=_hex("#93C5FD"), outline=_hex(C["teal"]), width=1)
    # Wave hint
    for x in range(SEA_L + 20, REVET_L - 30, 36):
        draw.arc([x, HWL_Y + 8, x + 28, HWL_Y + 28], start=200, end=340, fill=_hex(C["teal"]), width=2)

    draw.line([(SEA_L, HWL_Y), (REVET_L - 10, HWL_Y)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "H.W.L", (SEA_L + 8, HWL_Y - 18), f11, fill=C["navy"])
    draw.line([(SEA_L, LWL_Y), (REVET_L - 10, LWL_Y)], fill=_hex(C["gray"]), width=1)
    draw_label(draw, "L.W.L", (SEA_L + 8, LWL_Y - 14), f11, fill=C["gray"])
    draw_label(draw, "외해", (140, 360), f13, fill=C["teal"])

    # --- Center: revetment (rock armor) ---
    revet = [
        (REVET_L - 10, BED_Y),
        (REVET_L, LWL_Y + 20),
        (340, GL_Y - 20),
        (REVET_R, GL_Y + 40),
        (REVET_R + 20, BED_Y),
    ]
    draw.polygon(revet, fill=_hex("#9CA3AF"), outline=_hex(C["navy"]), width=2)
    for i in range(5):
        rx = 300 + i * 55
        ry = 560 + (i % 3) * 28
        draw.ellipse([rx, ry, rx + 36, ry + 24], fill=_hex("#6B7280"), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "사석호안", (420, 600), f13, fill=C["navy"])

    # Filter mat (HAR - center boundary)
    mat = [(REVET_R, GL_Y + 20), (REVET_R + 8, GL_Y + 20), (REVET_R + 8, BED_Y), (REVET_R, BED_Y)]
    draw.polygon(mat, fill=_hex(FILTER_MAT), outline=_hex(C["teal"]), width=1)
    draw_label(draw, "필터매트", (REVET_R + 22, 640), f11, fill=C["teal"])

    # --- Right: backfill ---
    draw.rectangle([REVET_R + 8, GL_Y, BACK_R, BED_Y], fill=_hex(SOIL))
    for yy in range(GL_Y + 12, BED_Y, 16):
        draw.line([(REVET_R + 16, yy), (BACK_R - 12, yy)], fill=_hex(SOIL2), width=1)
    draw.line([(REVET_R + 8, GL_Y), (BACK_R, GL_Y - 8)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "배면 매립지", (820, GL_Y - 28), f13, fill=C["gray"])

    # ① Stilling well + tide gauge (HAR-02)
    tx = 320
    draw.rectangle([tx - 12, HWL_Y + 20, tx + 12, GL_Y + 60], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw.rectangle([tx - 8, HWL_Y + 40, tx + 8, HWL_Y + 120], fill=_hex("#93C5FD"), outline=_hex(C["teal"]), width=1)
    draw.rounded_rectangle([tx - 18, GL_Y + 40, tx + 18, GL_Y + 72], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "① 조위계", (tx + 28, GL_Y + 48), f13, fill=C["teal"])
    draw_label(draw, "(stilling well)", (tx + 28, GL_Y + 68), f11, fill=C["gray"])

    # Curved phreatic / tidal lag (HAR-03)
    _dashed_line(draw, PHREATIC, "#3B82F6", 2)
    draw_label(draw, "침윤선 (tidal lag)", (900, 430), f11, fill="#3B82F6")

    # ② Groundwater well
    wx = 760
    gwl_y = 572
    _screen_pipe(draw, wx, GL_Y, gwl_y, BED_Y)
    draw_label(draw, "② 지하수위계", (wx + 28, GL_Y - 20), f13, fill=C["teal"])

    # ③ Piezometer
    _piezometer(draw, 920, 565)

    draw_logger_block_icon(draw, 980, GL_Y - 100, 100, 58, title="로거", font=load_font(11, bold=True))


def _panel_exc03(draw: ImageDraw.ImageDraw) -> None:
    x0, y0, x1, y1 = PANEL_L, 118, PANEL_L + 792, 318
    _panel_box(draw, x0, y0, x1, y1, "지하수위계 ≠ 간극수압계 (EXC-03)")
    render_img030_comparison_inset(draw, x0 + 40, y0 + 48)


def _panel_lag(draw: ImageDraw.ImageDraw) -> None:
    x0, y0, x1, y1 = PANEL_L, 332, PANEL_L + 792, 532
    _panel_box(draw, x0, y0, x1, y1, "조석 vs 배면 G.W.L (시간차 lag)")

    gx0, gy0 = x0 + 56, y1 - 48
    gw, gh = 520, 130
    draw.line([(gx0, gy0), (gx0, gy0 - gh)], fill=_hex(C["navy"]), width=1)
    draw.line([(gx0, gy0), (gx0 + gw, gy0)], fill=_hex(C["navy"]), width=1)
    draw_label(draw, "시간", (gx0 + gw // 2, gy0 + 18), load_font(10), fill=C["gray"])

    # Tide (blue) — faster
    t_pts = [(gx0 + 40, gy0 - 40), (gx0 + 140, gy0 - 100), (gx0 + 260, gy0 - 35), (gx0 + 380, gy0 - 95), (gx0 + 480, gy0 - 42)]
    for i in range(len(t_pts) - 1):
        draw.line([t_pts[i], t_pts[i + 1]], fill=_hex(C["teal"]), width=2)
    draw_label(draw, "조위", (gx0 + gw + 12, gy0 - 70), load_font(10), fill=C["teal"])

    # G.W.L (orange) — lagged
    g_pts = [(gx0 + 40, gy0 - 55), (gx0 + 160, gy0 - 78), (gx0 + 280, gy0 - 52), (gx0 + 400, gy0 - 72), (gx0 + 480, gy0 - 50)]
    for i in range(len(g_pts) - 1):
        draw.line([g_pts[i], g_pts[i + 1]], fill=_hex(C["orange"]), width=2)
    draw_label(draw, "배면 G.W.L", (gx0 + gw + 12, gy0 - 45), load_font(10), fill=C["orange"])

    draw_label(draw, "곡선 침윤선 = 저조 후 잔류수두", ((x0 + x1) // 2, y1 - 22), load_font(10), fill=C["gray"])


def _panel_flow(draw: ImageDraw.ImageDraw) -> None:
    x0, y0, x1, y1 = PANEL_L, 548, PANEL_L + 792, 950
    _panel_box(draw, x0, y0, x1, y1, "데이터 흐름 · 범례")

    boxes = [
        (x0 + 36, y0 + 48, 96, 38, "조위계"),
        (x0 + 148, y0 + 48, 96, 38, "수위계"),
        (x0 + 260, y0 + 48, 88, 38, "로거"),
        (x0 + 364, y0 + 48, 100, 38, "LTE-M2M"),
        (x0 + 480, y0 + 48, 88, 38, "경보"),
    ]
    f10 = load_font(10)
    for i, (bx, by, bw, bh, lbl) in enumerate(boxes):
        draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=4, fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)
        draw_label(draw, lbl, (bx + bw // 2, by + bh // 2), f10)
        if i < len(boxes) - 1:
            nx = boxes[i + 1][0]
            draw_arrow(draw, bx + bw + 2, by + bh // 2, nx - 2, by + bh // 2, color=C["teal"], width=2)

    leg_y = y0 + 130
    for text in ("① 조위계 · stilling well", "② 지하수위계 · screen", "③ 간극수압계 · filter tip"):
        draw.ellipse([x0 + 44, leg_y - 5, x0 + 54, leg_y + 5], fill=_hex(C["teal"]))
        draw_label(draw, text, (x0 + 60, leg_y), load_font(11), anchor="lm")
        leg_y += 30

    draw_label(
        draw,
        "좌→우: 외해 | 사석·필터매트 | 배면 매립 — HAR-01~04",
        ((x0 + x1) // 2, y1 - 28),
        load_font(10),
        fill=C["gray"],
    )


def render_img098(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "항만 호안 조위·지하수 계측 개념도", (MAIN_R // 2, 42), font_title)
    draw_label(
        draw,
        "Harbor Seawall — Tide · Groundwater · Pore Pressure",
        (MAIN_R // 2, 82),
        load_font(17),
        fill=C["gray"],
    )
    draw.line([(PANEL_L - 8, 100), (PANEL_L - 8, 960)], fill=_hex(C["light"]), width=2)
    _main_section(draw)
    _panel_exc03(draw)
    _panel_lag(draw)
    _panel_flow(draw)
