"""Settlement plate / gauge installation (IMG-032) — SETTLE-01 · ZIP-AUD-04."""
from __future__ import annotations

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, draw_logger_block_icon, load_font

GROUND_Y = 720
INFLUENCE_X = 680


def render_img032(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "침하판·침하계 설치 개념도", (W // 2, 48), font_title)
    draw_label(
        draw,
        "측정점(연장봉 상단) vs 안정 기준점 분리 — 영향권 밖 BM",
        (W // 2, 88),
        load_font(18),
        fill=C["gray"],
    )

    # Ground profile — fill zone vs stable zone
    draw.rectangle([80, GROUND_Y, INFLUENCE_X, 920], fill=_hex("#E8D4B8"), outline=_hex(C["navy"]), width=2)
    draw.rectangle([INFLUENCE_X, GROUND_Y, 1000, 920], fill=_hex("#D1D5DB"), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "성토·굴착 영향권", (380, GROUND_Y + 48), load_font(15), fill=C["gray"])
    draw_label(draw, "안정 지반 (영향권 밖)", (820, GROUND_Y + 48), load_font(15), fill=C["gray"])

    # Settlement plate assembly
    plate_x = 420
    draw.rectangle([plate_x - 36, GROUND_Y - 6, plate_x + 36, GROUND_Y + 6], fill=_hex(C["navy"]), outline=_hex(C["navy"]))
    draw_label(draw, "침하판", (plate_x, GROUND_Y + 28), load_font(14), fill=C["navy"])

    rod_top = GROUND_Y - 180
    draw.rectangle([plate_x - 4, rod_top, plate_x + 4, GROUND_Y - 6], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
    draw.rectangle([plate_x - 10, rod_top - 8, plate_x + 10, rod_top + 8], fill=_hex(C["orange"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "연장봉 상단 측정점", (plate_x + 120, rod_top), load_font(14, bold=True), fill=C["orange"])
    draw_label(draw, "(침하판과 함께 이동)", (plate_x + 120, rod_top + 22), load_font(12), fill=C["gray"])

    draw.rectangle([plate_x - 14, GROUND_Y - 6, plate_x + 14, GROUND_Y + 120], fill=_hex("#9CA3AF"), outline=_hex(C["gray"]), width=1)
    draw_label(draw, "보호관", (plate_x + 80, GROUND_Y + 60), load_font(13), fill=C["gray"])

    # Stable benchmark (outside influence)
    bm_x = 860
    draw.line([(bm_x, GROUND_Y - 140), (bm_x, GROUND_Y)], fill=_hex(C["navy"]), width=3)
    draw.rectangle([bm_x - 14, GROUND_Y - 150, bm_x + 14, GROUND_Y - 130], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "안정 기준점 (BM)", (bm_x, GROUND_Y - 168), load_font(14, bold=True), fill=C["teal"])
    draw_label(draw, "영향권 밖", (bm_x, GROUND_Y + 24), load_font(12), fill=C["gray"])

    # Leveling / rod reading
    draw.line([(plate_x, rod_top), (bm_x, GROUND_Y - 140)], fill=_hex(C["gray"]), width=1)
    draw_label(draw, "침하량 = BM 대비 측정점 표고 변화", (540, 560), load_font(16, bold=True), fill=C["navy"])

    draw_arrow(draw, plate_x, rod_top + 40, plate_x, rod_top + 90, color=C["orange"], width=2)
    draw_label(draw, "침하 ↓", (plate_x + 50, rod_top + 70), load_font(13), fill=C["orange"])

    draw_logger_block_icon(draw, 180, GROUND_Y - 120, 110, 64, title="로거", font=load_font(12, bold=True))

    px = 1080
    draw.rounded_rectangle([px, 160, 1840, 860], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "구분 · 금지", (1460, 200), load_font(22, bold=True))
    bullets = [
        "연장봉 상단 = 측정점 (기준점 아님)",
        "안정 기준점은 영향권 밖 별도 설치",
        "침하량 = 안정 BM 대비 표고 변화",
        "침하판·연장봉·보호관·측정점·BM 분리 표기",
    ]
    y = 280
    for line in bullets:
        draw.ellipse([px + 28, y - 6, px + 40, y + 6], fill=_hex(C["teal"]))
        draw_label(draw, line, (px + 52, y), load_font(17), anchor="lm")
        y += 48

    draw.rounded_rectangle([px + 40, 520, px + 380, 640], outline=_hex(C["red"]), width=2)
    draw_label(draw, "✗ 연장봉 상단 = 기준점", (px + 210, 560), load_font(15, bold=True), fill=C["red"])
    draw.rounded_rectangle([px + 420, 520, px + 760, 640], outline=_hex(C["teal"]), width=2)
    draw_label(draw, "✓ BM + 측정점 분리", (px + 590, 560), load_font(15, bold=True), fill=C["teal"])
