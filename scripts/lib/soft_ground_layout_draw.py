"""IMG-019 v3 — soft ground embankment instrumentation layout (docs/109 SOFT-LAYOUT-01)."""
from __future__ import annotations

from PIL import ImageDraw

from lib.datalogger_draw import C, _hex, draw_arrow, draw_label, draw_title, load_font, new_canvas

FILL = "#E8D4B8"
SOFT = "#D4C4A8"
ROCK = "#9CA3AF"
SAND = "#F5E6C8"


def _leader(draw: ImageDraw.ImageDraw, sx: int, sy: int, lx: int, ly: int, text: str, *, sub: str = "") -> None:
    draw.line([(sx, sy), (lx, ly)], fill=_hex(C["gray"]), width=1)
    draw_label(draw, text, (lx, ly), load_font(12, bold=True), fill=C["navy"], anchor="lm")
    if sub:
        draw_label(draw, sub, (lx, ly + 16), load_font(10), fill=C["gray"], anchor="lm")


def _draw_ipi(draw: ImageDraw.ImageDraw, ix: int, gl: int, rock_y: int, base_y: int) -> None:
    draw.rounded_rectangle([ix - 20, gl - 28, ix + 20, gl], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw.line([(ix - 30, gl), (ix + 30, gl)], fill=_hex(C["navy"]), width=2)
    draw.rectangle([ix - 9, gl, ix + 9, base_y], fill=_hex("#D1FAE5"), outline=_hex(C["teal"]), width=2)
    for sy in range(gl + 32, base_y - 20, 36):
        draw.ellipse([ix - 5, sy - 5, ix + 5, sy + 5], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
    draw.line([(ix + 28, rock_y), (ix + 28, base_y)], fill=_hex(C["navy"]), width=1)
    draw.line([(ix + 24, rock_y), (ix + 32, rock_y)], fill=_hex(C["navy"]), width=1)
    draw.line([(ix + 24, base_y), (ix + 32, base_y)], fill=_hex(C["navy"]), width=1)
    draw_label(draw, "2.00", (ix + 40, (rock_y + base_y) // 2), load_font(11), fill=C["navy"], anchor="lm")
    _leader(draw, ix + 12, gl + 60, ix + 80, gl + 20, "센서형 다단식", sub="지중경사계")


def _draw_piezo_tip(draw: ImageDraw.ImageDraw, px: int, py: int) -> None:
    draw.line([(px, py - 40), (px, py)], fill=_hex(C["gray"]), width=2)
    draw.polygon([(px, py + 14), (px - 10, py - 4), (px + 10, py - 4)], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    _leader(draw, px + 8, py - 8, px + 70, py - 30, "간극수압계", sub="filter tip")


def _draw_borehole_settlement(draw: ImageDraw.ImageDraw, cx: int, gl: int, bottom: int) -> None:
    draw.line([(cx, gl), (cx, bottom)], fill=_hex(C["navy"]), width=3)
    for ry in range(gl + 40, bottom - 20, 48):
        draw.rectangle([cx - 12, ry - 4, cx + 12, ry + 4], fill=_hex(C["orange"]), outline=_hex(C["navy"]), width=1)
    draw.line([(cx + 22, bottom - 30), (cx + 22, bottom)], fill=_hex(C["navy"]), width=1)
    draw.line([(cx + 18, bottom - 30), (cx + 26, bottom - 30)], fill=_hex(C["navy"]), width=1)
    draw.line([(cx + 18, bottom), (cx + 26, bottom)], fill=_hex(C["navy"]), width=1)
    draw_label(draw, "1.00", (cx + 34, bottom - 16), load_font(11), fill=C["navy"], anchor="lm")
    _leader(draw, cx + 14, gl + 80, cx + 90, gl + 40, "지중침하계")


def _draw_water_standpipe(draw: ImageDraw.ImageDraw, wx: int, gl: int, bottom: int, wl_y: int) -> None:
    draw.rounded_rectangle([wx - 16, gl - 24, wx + 16, gl], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw.rectangle([wx - 8, gl, wx + 8, bottom], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw.rectangle([wx - 7, wl_y, wx + 7, bottom], fill=_hex("#BEE3F8"))
    draw.line([(wx - 20, wl_y), (wx + 20, wl_y)], fill=_hex(C["teal"]), width=2)
    _leader(draw, wx + 10, wl_y - 20, wx + 72, wl_y - 50, "지하수위계", sub="수위선")


def _draw_epc(draw: ImageDraw.ImageDraw, ex: int, ey: int) -> None:
    draw.rounded_rectangle([ex - 18, ey - 10, ex + 18, ey + 10], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_arrow(draw, ex + 20, ey, ex + 52, ey, color=C["orange"], width=2)
    draw_label(draw, "q", (ex + 58, ey), load_font(12, bold=True), fill=C["orange"])
    _leader(draw, ex, ey - 16, ex - 60, ey - 44, "토압계", sub="감지면")


def _draw_settlement_points(draw: ImageDraw.ImageDraw, gl: int) -> None:
    px, py = 340, gl
    draw.rectangle([px - 22, py - 4, px + 22, py + 2], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=1)
    _leader(draw, px, py - 6, px - 80, py - 36, "지표침하판")
    pin_x = 420
    draw.line([(pin_x, py), (pin_x, py - 18)], fill=_hex(C["navy"]), width=2)
    draw.ellipse([pin_x - 4, py - 22, pin_x + 4, py - 14], fill=_hex(C["orange"]), outline=_hex(C["navy"]), width=1)
    _leader(draw, pin_x + 6, py - 12, pin_x + 70, py - 40, "지표침하핀", sub="측점 표식")


def render_img019() -> object:
    """연약지반 성토부 계측기 설치 배치도 — fields/soft-ground hero."""
    img, draw = new_canvas()
    draw_title(draw, "연약지반 성토부 계측기 설치 배치도", "성토·연약지층 — 계측관리계획서 스타일 2D 설치 배치")

    gl = 340
    rock_y = 720
    bottom = 860
    x0, x1 = 180, 1680

    # Embankment slope + fill
    draw.polygon([(x0, gl), (x0 + 200, gl - 120), (x1 - 200, gl - 40), (x1, gl), (x1, bottom), (x0, bottom)], fill=_hex(FILL))
    draw.rectangle([x0, gl, x1, gl + 8], fill=_hex(SAND), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "Sand Mat", (x0 + 120, gl - 8), load_font(11), fill=C["gray"])
    draw.line([(x0, gl), (x1, gl)], fill=_hex(C["navy"]), width=3)
    draw_label(draw, "지표면", (x1 - 60, gl - 18), load_font(12, bold=True), fill=C["navy"])

    draw.rectangle([x0, gl + 8, x1, rock_y], fill=_hex(SOFT))
    for yy in range(gl + 24, rock_y, 18):
        draw.line([(x0 + 8, yy), (x1 - 8, yy)], fill=_hex("#C4A574"), width=1)
    draw.rectangle([x0, rock_y, x1, bottom], fill=_hex(ROCK))

    # Layer labels (left)
    draw_label(draw, "성\n토", (x0 + 28, gl + 80), load_font(14, bold=True), anchor="mm")
    draw_label(draw, "연약\n지층", (x0 + 28, (gl + rock_y) // 2), load_font(14, bold=True), anchor="mm")
    draw_label(draw, "지지\n층", (x0 + 28, (rock_y + bottom) // 2), load_font(14, bold=True), anchor="mm")

    _draw_settlement_points(draw, gl)
    _draw_ipi(draw, 520, gl, rock_y, bottom - 20)
    _draw_epc(draw, 680, gl + 24)
    _draw_borehole_settlement(draw, 900, gl, rock_y - 40)
    _draw_piezo_tip(draw, 1080, gl + 180)
    _draw_ipi(draw, 1280, gl, rock_y, bottom - 20)
    _draw_water_standpipe(draw, 1480, gl, bottom - 40, gl + 220)

    # Width dimension (example)
    draw.line([(400, gl - 80), (1400, gl - 80)], fill=_hex(C["gray"]), width=1)
    draw.line([(400, gl - 76), (400, gl - 84)], fill=_hex(C["gray"]), width=1)
    draw.line([(1400, gl - 76), (1400, gl - 84)], fill=_hex(C["gray"]), width=1)
    draw_label(draw, "성토 폭 (예시)", (900, gl - 96), load_font(11), fill=C["gray"])

    # Small note only (not flowchart hero)
    draw.rounded_rectangle([1240, 120, 1820, 200], outline=_hex(C["gray"]), width=1)
    draw_label(draw, "성토 → 압밀·u 소산 → 침하 (해석은 별도 Figure)", (1260, 148), load_font(11), fill=C["gray"], anchor="lm")
    draw_label(draw, "본도 = 설치 배치도", (1260, 172), load_font(11), fill=C["gray"], anchor="lm")

    draw_label(draw, "[ 계측기 설치 배치도 ]", (960, 1000), load_font(16, bold=True), fill=C["navy"])
    return img
