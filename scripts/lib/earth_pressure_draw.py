"""Earth pressure cell installation concept (IMG-034).

INSTRUMENTATION §3.6 — sensing face toward structure, backfill side burial.
"""
from __future__ import annotations

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, draw_logger_block_icon, load_font

SOIL1 = "#E8D4B8"
SOIL2 = "#C4A574"
ROCK = "#9CA3AF"


def _soil_block(draw: ImageDraw.ImageDraw, x0: int, y0: int, x1: int, y1: int) -> None:
    draw.rectangle([x0, y0, x1, y1], fill=_hex(SOIL1))
    for yy in range(y0 + 6, y1, 14):
        draw.line([(x0 + 4, yy), (x1 - 4, yy)], fill=_hex(SOIL2), width=1)


def render_img034(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "토압계 설치 개념도", (W // 2, 48), font_title)
    draw_label(
        draw,
        "Earth pressure cell — backfill burial · sensing face → structure",
        (W // 2, 88),
        load_font(18),
        fill=C["gray"],
    )

    ground = 220
    bottom = 900
    wall_x0, wall_x1 = 520, 548
    exc_r = 820

    # Backfill soil (left)
    _soil_block(draw, 80, ground, wall_x0, bottom)
    draw.rectangle([80, 560, wall_x0, bottom], fill=_hex(ROCK))
    draw_label(draw, "성토·배면 지반", (200, ground + 40), load_font(15), fill=C["gray"])
    draw_label(draw, "풍화토·연암", (200, 640), load_font(14), fill=C["gray"])

    # Excavation cavity (right)
    exc = [
        (wall_x1, ground),
        (exc_r, ground),
        (exc_r, bottom),
        (wall_x1 + 24, bottom),
        (wall_x1, ground + 48),
    ]
    draw.polygon(exc, fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "굴착측", (exc_r - 60, ground - 24), load_font(14), fill=C["gray"])

    # Surcharge (vertical) — NOT earth pressure cell reading
    draw_arrow(draw, 200, ground - 40, 200, ground + 20, color=C["gray"], width=3)
    draw_label(draw, "상재하중 q", (200, ground - 52), load_font(14, bold=True), fill=C["gray"])

    # Retaining wall + waler
    draw.rectangle([wall_x0, ground - 200, wall_x1, bottom], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)
    draw.rectangle([wall_x1, ground - 90, wall_x1 + 22, ground - 30], fill=_hex(C["gray"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "흙막이·띠장", (wall_x1 + 36, ground - 70), load_font(14))

    # Earth pressure cell — backfill side, sensing face toward wall
    ep_y = ground + 120
    cell_w, cell_h = 20, 32
    draw.rounded_rectangle(
        [wall_x0 - cell_w - 2, ep_y - cell_h // 2, wall_x0 - 2, ep_y + cell_h // 2],
        radius=2,
        fill=_hex(C["teal"]),
        outline=_hex(C["navy"]),
        width=2,
    )
    # Sensing face stripe (toward wall)
    draw.line([(wall_x0 - 12, ep_y - 10), (wall_x0 - 12, ep_y + 10)], fill=_hex(C["white"]), width=3)
    draw_label(draw, "감지면 →", (wall_x0 - 12, ep_y + 28), load_font(12, bold=True), fill=C["teal"])

    draw_arrow(draw, wall_x0 - 90, ep_y, wall_x0 - cell_w - 6, ep_y, color=C["teal"], width=4)
    draw_label(draw, "수평토압 σh", (wall_x0 - 96, ep_y - 36), load_font(14, bold=True), fill=C["teal"], anchor="rm")
    draw_label(draw, "토압계 (EPC)", (wall_x0 - 96, ep_y - 14), load_font(13), fill=C["gray"], anchor="rm")

    # Sand/compaction around cell
    draw.rectangle([wall_x0 - 36, ep_y - 40, wall_x0 - 2, ep_y + 40], fill=_hex(SOIL2), outline=_hex(C["gray"]), width=1)
    draw_label(draw, "매립·다짐", (wall_x0 - 96, ep_y + 56), load_font(12), fill=C["gray"], anchor="rm")

    # Cable to logger
    draw.line([(wall_x0 - 24, ep_y), (wall_x0 - 60, ep_y - 80), (280, ep_y - 80), (280, ground - 40)], fill=_hex(C["gray"]), width=2)
    draw_logger_block_icon(draw, 200, ground - 100, 120, 64, title="로거", font=load_font(12, bold=True))

    # Right panel — principles + prohibited
    px = 880
    draw.rounded_rectangle([px, 180, 1820, 880], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "설치 원칙 · 금지", (1350, 220), load_font(22, bold=True))

    # Correct vs wrong mini diagrams
    # Correct
    cy = 340
    draw.rounded_rectangle([px + 40, cy - 80, px + 420, cy + 120], outline=_hex(C["teal"]), width=2)
    draw_label(draw, "✓ 배면 매립", (px + 230, cy - 58), load_font(16, bold=True), fill=C["teal"])
    mini_wall = px + 300
    draw.rectangle([mini_wall, cy - 20, mini_wall + 12, cy + 60], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw.rounded_rectangle([mini_wall - 18, cy + 10, mini_wall - 2, cy + 34], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
    draw_arrow(draw, mini_wall - 50, cy + 22, mini_wall - 20, cy + 22, color=C["teal"], width=2)
    draw_label(draw, "감지면→벽체", (px + 230, cy + 90), load_font(13), fill=C["gray"])

    # Wrong — excavation face
    draw.rounded_rectangle([px + 460, cy - 80, px + 840, cy + 120], outline=_hex(C["orange"]), width=2)
    draw_label(draw, "✗ 굴착측 앞면 부착", (px + 650, cy - 58), load_font(16, bold=True), fill=C["orange"])
    mw2 = px + 720
    draw.rectangle([mw2, cy - 20, mw2 + 12, cy + 60], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw.rounded_rectangle([mw2 + 14, cy + 10, mw2 + 30, cy + 34], fill=_hex(C["orange"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "금지", (px + 650, cy + 90), load_font(14), fill=C["orange"])

    # Wrong — standpipe
    draw.rounded_rectangle([px + 40, cy + 160, px + 420, cy + 360], outline=_hex(C["orange"]), width=2)
    draw_label(draw, "✗ 관측공 내부", (px + 230, cy + 182), load_font(16, bold=True), fill=C["orange"])
    draw.line([(px + 230, cy + 220), (px + 230, cy + 320)], fill=_hex(C["gray"]), width=4)
    draw.ellipse([px + 218, cy + 300, px + 242, cy + 324], fill=_hex(C["orange"]), outline=_hex(C["navy"]))
    draw_label(draw, "간극수압·관측공과 구분", (px + 230, cy + 340), load_font(13), fill=C["gray"])

    # Wrong — icon only
    draw.rounded_rectangle([px + 460, cy + 160, px + 840, cy + 360], outline=_hex(C["orange"]), width=2)
    draw_label(draw, "✗ 방향 없는 원형 아이콘", (px + 650, cy + 182), load_font(16, bold=True), fill=C["orange"])
    draw.ellipse([px + 640, cy + 240, px + 680, cy + 280], fill=_hex(C["orange"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "감지면·토압 방향 필수", (px + 650, cy + 340), load_font(13), fill=C["gray"])

    bullets = [
        "설계 깊이·위치에 배면 매립",
        "감지면이 구조물(벽체)을 향함",
        "초기 접촉·영점 기록",
        "간극수압계·지하수위계와 구분",
    ]
    y = 620
    for line in bullets:
        draw.ellipse([px + 36, y - 6, px + 48, y + 6], fill=_hex(C["teal"]))
        draw_label(draw, line, (px + 60, y), load_font(17), anchor="lm")
        y += 48
