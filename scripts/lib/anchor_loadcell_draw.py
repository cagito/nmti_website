"""Earth anchor load cell installation concept (IMG-004).

Pillow only — doc 26 · INSTRUMENTATION §3.2 · 5-panel layout.
"""
from __future__ import annotations

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, draw_legacy_logger_in_enclosure, load_font

SOIL1 = "#E8D4B8"
SOIL2 = "#C4A574"
ROCK = "#9CA3AF"


def _panel_box(draw: ImageDraw.ImageDraw, x0: int, y0: int, x1: int, y1: int, title: str) -> None:
    draw.rounded_rectangle([x0, y0, x1, y1], outline=_hex(C["navy"]), width=2, fill=_hex(C["white"]))
    draw_label(draw, title, ((x0 + x1) // 2, y0 + 22), load_font(15, bold=True))


def _soil_block(draw: ImageDraw.ImageDraw, x0: int, y0: int, x1: int, y1: int, base: str = SOIL1, hatch: str = SOIL2) -> None:
    draw.rectangle([x0, y0, x1, y1], fill=_hex(base))
    for yy in range(y0 + 8, y1, 16):
        draw.line([(x0 + 6, yy), (x1 - 6, yy)], fill=_hex(hatch), width=1)


def _leader(draw: ImageDraw.ImageDraw, ax: int, ay: int, lx: int, ly: int, text: str, *, sub: str = "", color: str = C["navy"]) -> None:
    f12 = load_font(12)
    f10 = load_font(10)
    draw.line([(ax, ay), (lx, ly)], fill=_hex(C["gray"]), width=1)
    draw_label(draw, text, (lx, ly), f12, fill=color, anchor="lm")
    if sub:
        draw_label(draw, sub, (lx, ly + 16), f10, fill=C["gray"], anchor="lm")


def _panel1_section(draw: ImageDraw.ImageDraw) -> None:
    x0, y0, x1, y1 = 36, 108, 900, 500
    _panel_box(draw, x0, y0, x1, y1, "① 설치 단면도 (개념)")

    gy = 340
    by = y1 - 36
    wx, ww = 560, 22
    ex0 = wx + ww

    _soil_block(draw, x0 + 24, gy, wx, by)
    _soil_block(draw, x0 + 24, gy + 90, wx, by, ROCK, "#7B8490")
    draw.line([(x0 + 24, gy), (wx, gy)], fill=_hex(C["navy"]), width=3)
    draw_label(draw, "배면 지반", (300, gy - 22), load_font(13), fill=C["gray"])

    exc = [(ex0, gy), (x1 - 40, gy), (x1 - 40, by), (ex0 + 28, by), (ex0, gy + 50)]
    draw.polygon(exc, fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "굴착측", (x1 - 100, gy - 22), load_font(13), fill=C["gray"])
    draw_label(draw, "굴착저", (x1 - 110, by - 20), load_font(12), fill=C["gray"])

    draw.rectangle([wx, gy - 160, wx + ww, by], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)
    draw.rectangle([wx + ww, gy - 70, wx + ww + 18, gy - 18], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "흙막이 벽체·띠장", (wx + ww + 50, gy - 52), load_font(11), fill=C["gray"])

    # Head on excavation face
    hx = wx + ww + 18
    hy = gy - 118
    _draw_head_compact(draw, hx, hy, scale=1.0)

    # Tendon into backfill at ~18°
    tx0, ty0 = hx + 95, hy + 4
    tx1, ty1 = x0 + 120, by - 70
    draw.line([(tx0, ty0), (tx1, ty1)], fill=_hex(C["navy"]), width=3)
    mid_f = ((tx0 + wx + 40) // 2, (ty0 + gy) // 2)
    mid_b = ((tx1 + wx) // 2, (ty1 + by) // 2)
    _leader(draw, mid_f[0], mid_f[1], mid_f[0] - 60, mid_f[1] - 28, "자유장", sub="Free length")
    _leader(draw, mid_b[0], mid_b[1], mid_b[0] - 50, mid_b[1] + 10, "정착장", sub="Bond length")

    gx, gy2 = tx1 - 8, ty1 + 8
    draw.ellipse([gx - 22, gy2 - 16, gx + 8, gy2 + 16], fill=_hex("#D1D5DB"), outline=_hex(C["gray"]), width=2)
    draw_label(draw, "그라우트", (gx - 8, gy2 + 28), load_font(11), fill=C["gray"])

    draw_arrow(draw, gx - 30, gy2, gx - 70, gy2 + 8, color=C["teal"], width=2)
    draw_label(draw, "인장력 T →", (gx - 68, gy2 - 22), load_font(12), fill=C["teal"])

    draw_label(
        draw,
        "※ 하중계 = 굴착측 노출 두부만 (정착장·그라우트 내부 금지)",
        ((x0 + x1) // 2, y1 - 18),
        load_font(11),
        fill=C["red"],
    )


def _draw_head_compact(draw: ImageDraw.ImageDraw, wall_x: int, cy: int, *, scale: float = 1.0) -> None:
    """Compact head assembly for section view — minimal labels."""
    s = scale
    wh = int(32 * s)
    draw.rectangle([wall_x - int(12 * s), cy - wh, wall_x, cy + wh], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    x = wall_x
    bw, bh = int(20 * s), int(26 * s)
    draw.polygon([(x, cy - bh), (x + bw, cy - bh // 2), (x + bw, cy + bh // 2), (x, cy + bh)], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)
    x += bw
    lp = int(8 * s)
    draw.rectangle([x, cy - int(14 * s), x + lp, cy + int(14 * s)], fill=_hex(C["panel"]), outline=_hex(C["navy"]), width=1)
    x += lp
    lcw = int(26 * s)
    draw.rounded_rectangle([x, cy - int(16 * s), x + lcw, cy + int(16 * s)], radius=3, fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    x += lcw
    draw.rectangle([x, cy - int(14 * s), x + lp, cy + int(14 * s)], fill=_hex(C["panel"]), outline=_hex(C["navy"]), width=1)
    x += lp
    ahw = int(16 * s)
    draw.rounded_rectangle([x, cy - int(12 * s), x + ahw, cy + int(12 * s)], radius=2, fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    _leader(draw, x + lcw // 2 + bw + lp, cy - int(20 * s), x + lcw + bw + lp + 20, cy - int(36 * s), "하중계 (LC)", color=C["teal"])


def _draw_head_detail_horizontal(draw: ImageDraw.ImageDraw, x0: int, y0: int, x1: int, y1: int) -> None:
    """Panel ② — clean horizontal assembly with spaced parts and labels above/below."""
    cx = (x0 + x1) // 2
    cy = (y0 + y1) // 2 + 20
    f11 = load_font(11)
    f12 = load_font(12)
    f13 = load_font(13, bold=True)
    wall_x = x0 + 70
    draw.line([(wall_x, y0 + 60), (wall_x, y1 - 80)], fill=_hex(C["navy"]), width=4)
    draw_label(draw, "벽체", (wall_x, y0 + 52), f11, fill=C["gray"])

    x = wall_x + 8
    gap = 6

    # Bearing plate
    bw, bh = 28, 36
    draw.polygon([(x, cy - bh), (x + bw, cy - bh // 2), (x + bw, cy + bh // 2), (x, cy + bh)], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "지지링·반력판", (x + bw // 2, cy - bh - 14), f12)
    draw_label(draw, "BEARING PLATE", (x + bw // 2, cy - bh + 2), f11, fill=C["gray"])
    x += bw + gap

    # Lower plate
    lpw, lph = 12, 32
    draw.rectangle([x, cy - lph // 2, x + lpw, cy + lph // 2], fill=_hex(C["panel"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "하부 플레이트", (x + lpw // 2, cy + lph // 2 + 18), f11)
    x += lpw + gap

    # Load cell
    lcw, lch = 36, 40
    draw.rounded_rectangle([x, cy - lch // 2, x + lcw, cy + lch // 2], radius=4, fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw.line([(x + lcw // 2, cy - lch // 4), (x + lcw // 2, cy + lch // 4)], fill=_hex(C["white"]), width=2)
    draw_label(draw, "하중계 (로드셀)", (x + lcw // 2, cy - lch // 2 - 16), f13, fill=C["teal"])
    draw_label(draw, "LOAD CELL", (x + lcw // 2, cy - lch // 2 - 2), f11, fill=C["gray"])
    lc_cx = x + lcw // 2
    x += lcw + gap

    # Upper plate
    draw.rectangle([x, cy - lph // 2, x + lpw, cy + lph // 2], fill=_hex(C["panel"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "상부 플레이트", (x + lpw // 2, cy + lph // 2 + 18), f11)
    x += lpw + gap

    # Anchor head + wedge
    ahw = 22
    draw.rounded_rectangle([x, cy - 18, x + ahw, cy + 18], radius=2, fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw.polygon([(x + ahw, cy - 10), (x + ahw + 14, cy), (x + ahw, cy + 10)], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "앵커헤드", (x + ahw // 2, cy - 36), f12)
    draw_label(draw, "ANCHOR HEAD", (x + ahw // 2, cy - 22), f11, fill=C["gray"])
    tend_x = x + ahw + 14

    # Tendon through center
    draw.line([(wall_x, cy), (tend_x + 120, cy)], fill=_hex(C["navy"]), width=3)
    draw_label(draw, "강연선 (PC WIRE)", (tend_x + 50, cy + 22), f12)

    # Read cable
    draw.line([(lc_cx, cy + lch // 2), (lc_cx, cy + lch // 2 + 36)], fill=_hex(C["gray"]), width=2)
    draw_label(draw, "READ CABLE", (lc_cx + 8, cy + lch // 2 + 20), f11, fill=C["gray"], anchor="lm")

    # Forces
    draw_arrow(draw, tend_x + 40, cy + 6, tend_x + 100, cy + 6, color=C["teal"], width=3)
    draw_label(draw, "인장력 T", (tend_x + 72, cy + 24), f12, fill=C["teal"])

    draw_arrow(draw, wall_x + bw + 8, cy, wall_x - 6, cy, color=C["orange"], width=3)
    draw_label(draw, "압축력 P", (wall_x + 20, cy - 28), f12, fill=C["orange"])

    draw_label(draw, "P = T (평형)", (x1 - 90, y1 - 70), load_font(14, bold=True), fill=C["teal"])


def _panel2_head_detail(draw: ImageDraw.ImageDraw) -> None:
    x0, y0, x1, y1 = 920, 108, 1884, 500
    _panel_box(draw, x0, y0, x1, y1, "② 앵커 두부 상세도")
    _draw_head_detail_horizontal(draw, x0, y0, x1, y1)


def _panel3_force(draw: ImageDraw.ImageDraw) -> None:
    x0, y0, x1, y1 = 36, 520, 620, 930
    _panel_box(draw, x0, y0, x1, y1, "③ 하중 전달 원리")

    cx, cy = (x0 + x1) // 2, (y0 + y1) // 2 + 10
    draw.rounded_rectangle([cx - 56, cy - 34, cx + 56, cy + 34], radius=4, fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "LC", (cx, cy), load_font(16, bold=True))

    draw.rectangle([cx - 110, cy - 40, cx - 72, cy + 40], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "반력판", (cx - 91, cy + 58), load_font(11), fill=C["gray"])

    draw_arrow(draw, cx - 70, cy, cx - 58, cy, color=C["orange"], width=4)
    draw_label(draw, "P (압축)", (cx - 90, cy - 58), load_font(13), fill=C["orange"])

    draw_arrow(draw, cx + 58, cy, cx + 130, cy + 30, color=C["teal"], width=4)
    draw_label(draw, "T (인장)", (cx + 95, cy - 8), load_font(13), fill=C["teal"])
    draw_label(draw, "강연선 / 지반", (cx + 95, cy + 16), load_font(11), fill=C["gray"])

    draw_label(draw, "P = T", (cx, cy + 90), load_font(22, bold=True), fill=C["navy"])


def _panel4_anchor_anatomy(draw: ImageDraw.ImageDraw) -> None:
    x0, y0, x1, y1 = 640, 520, 1240, 930
    _panel_box(draw, x0, y0, x1, y1, "④ 앵커 구성 (전체)")

    wall_x = x0 + 80
    base_y = y1 - 80
    top_y = y0 + 90
    draw.rectangle([wall_x, top_y, wall_x + 18, base_y], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)

    hx = wall_x + 18
    hy = top_y + 80
    _draw_head_compact(draw, hx, hy, scale=0.9)
    draw_label(draw, "두부 = 굴착측 노출", (hx + 50, hy - 50), load_font(12), fill=C["teal"])

    # Schematic tendon
    draw.line([(hx + 80, hy), (x1 - 60, base_y - 40)], fill=_hex(C["navy"]), width=3)

    # Zones
    zx0 = hx + 40
    zx1 = x0 + 340
    zx2 = x1 - 100
    draw.line([(zx0, base_y), (zx2, base_y)], fill=_hex(C["navy"]), width=2)
    _soil_block(draw, zx0, base_y - 60, zx2, base_y, SOIL1, SOIL2)

    draw.line([(zx1, base_y - 70), (zx1, base_y + 10)], fill=_hex(C["gray"]), width=1)
    draw_label(draw, "자유장", ((zx0 + zx1) // 2, base_y - 88), load_font(13))
    draw_label(draw, "정착장", ((zx1 + zx2) // 2, base_y - 88), load_font(13))

    bulb_x = zx2 - 40
    draw.ellipse([bulb_x - 20, base_y - 50, bulb_x + 10, base_y - 10], fill=_hex("#D1D5DB"), outline=_hex(C["gray"]), width=2)
    draw_label(draw, "그라우트·정착", (bulb_x - 6, base_y - 62), load_font(11), fill=C["gray"])


def _panel5_data_flow(draw: ImageDraw.ImageDraw) -> None:
    x0, y0, x1, y1 = 1260, 520, 1884, 930
    _panel_box(draw, x0, y0, x1, y1, "⑤ 데이터 흐름")

    f12 = load_font(12)
    y = y0 + 80
    steps = ["하중계", "로거", "모뎀", "서버"]
    bx = x0 + 40
    bw = 130
    gap = 24
    for i, lbl in enumerate(steps):
        x = bx + i * (bw + gap)
        draw.rounded_rectangle([x, y, x + bw, y + 48], radius=4, fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
        draw_label(draw, lbl, (x + bw // 2, y + 24), f12)
        if i < len(steps) - 1:
            nx = x + bw + 4
            draw_arrow(draw, x + bw + 2, y + 24, nx + gap - 8, y + 24, color=C["teal"], width=2)

    lx = x0 + (x1 - x0) // 2 - 70
    draw_legacy_logger_in_enclosure(draw, lx, y + 90, 140, 88, font=f12)
    draw_label(draw, "현장 데이터로거", (lx + 70, y + 200), load_font(11), fill=C["gray"])
    draw_label(draw, "방수 보호함", (lx + 70, y + 78), load_font(10), fill=C["gray"])


def _footer_precautions(draw: ImageDraw.ImageDraw) -> None:
    draw.rounded_rectangle([36, 948, 1884, 1008], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)
    draw_label(
        draw,
        "유의: 관측단 강성 · 동심(앵커–LC 축 일치) · 충격보호 · 영점·초기치 점검",
        (W // 2, 978),
        load_font(13),
        fill=C["gray"],
    )


def render_img004(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "어스앵커 하중계 설치 개념도", (W // 2, 42), font_title)
    draw_label(
        draw,
        "Earth Anchor Load Cell Installation — excavation-side head assembly",
        (W // 2, 82),
        load_font(17),
        fill=C["gray"],
    )
    _panel1_section(draw)
    _panel2_head_detail(draw)
    _panel3_force(draw)
    _panel4_anchor_anatomy(draw)
    _panel5_data_flow(draw)
    _footer_precautions(draw)
