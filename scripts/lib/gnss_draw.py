"""GNSS displacement monitoring schematic (IMG-043) — book/GNSS.pdf."""
from __future__ import annotations

import math

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, load_font

GROUND_Y = 720


def _antenna(draw: ImageDraw.ImageDraw, x: int, y: int, label: str, *, rover: bool = False) -> None:
    h = 36 if rover else 44
    draw.line([(x, y), (x, y - h)], fill=_hex(C["navy"]), width=3)
    draw.ellipse([x - 14, y - h - 10, x + 14, y - h + 10], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, label, (x, y + 18), load_font(12 if rover else 13), anchor="mm", fill=C["navy"])


def _draw_site(draw: ImageDraw.ImageDraw) -> None:
    # Slope cross-section (monitoring site)
    draw.polygon(
        [(80, GROUND_Y), (320, 480), (680, GROUND_Y), (80, GROUND_Y)],
        fill=_hex("#E8D4B8"),
        outline=_hex(C["navy"]),
        width=2,
    )
    draw.polygon([(80, GROUND_Y), (680, GROUND_Y), (680, 920), (80, 920)], fill=_hex("#9CA3AF"), outline=_hex(C["navy"]))
    draw_label(draw, "계측 대상 (사면)", (380, GROUND_Y - 40), load_font(16), fill=C["gray"])

    # Reference station — stable ground LEFT (outside deformation)
    ref_x, ref_y = 40, GROUND_Y - 10
    draw.rectangle([20, ref_y, 120, GROUND_Y + 30], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    _antenna(draw, ref_x + 40, ref_y, "기준국", rover=False)
    draw_label(draw, "(부동·안정 지반)", (ref_x + 40, ref_y + 38), load_font(11), anchor="mm", fill=C["gray"])

    # Rovers on slope
    rovers = [(280, 560, "이동국 #1"), (420, 620, "이동국 #2"), (540, 680, "이동국 #3")]
    for rx, ry, lab in rovers:
        _antenna(draw, rx, ry, lab, rover=True)
        draw_arrow(draw, rx, ry - 50, rx + 28, ry - 70, color=C["teal"], width=2)
        draw_arrow(draw, rx, ry - 50, rx - 20, ry - 75, color=C["teal"], width=2)
        draw_arrow(draw, rx, ry - 50, rx, ry - 85, color=C["orange"], width=2)
    draw_label(draw, "ΔE·ΔN·ΔU", (600, 580), load_font(13, bold=True), fill=C["teal"])

    # Satellite signals (not line-of-sight between stations)
    sats = [(180, 140), (320, 110), (460, 150)]
    for sx, sy in sats:
        draw.ellipse([sx - 18, sy - 10, sx + 18, sy + 10], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)
        draw.line([(sx, sy + 10), (ref_x + 40, ref_y - 44)], fill=_hex(C["teal"]), width=1)
        draw.line([(sx, sy + 10), (420, 580)], fill=_hex(C["teal"]), width=1)
    draw_label(draw, "위성 신호", (340, 175), load_font(13), fill=C["teal"])

    # Correction data link (not optical sight)
    draw.rounded_rectangle([140, 440, 300, 490], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "보정정보 통신", (220, 465), load_font(13, bold=True))
    draw.line([(220, 490), (420, 600)], fill=_hex(C["orange"]), width=2)
    draw.line([(220, 450), (ref_x + 40, ref_y - 20)], fill=_hex(C["orange"]), width=2)
    draw_label(draw, "RTK·네트워크 보정", (220, 510), load_font(11), fill=C["gray"])


def _draw_block_diagram(draw: ImageDraw.ImageDraw) -> None:
    px = 1080
    draw.rounded_rectangle([px, 140, 1860, 880], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "GNSS 모니터링 시스템", (1470, 175), load_font(22, bold=True))

    boxes = [
        (px + 40, 240, "GNSS 안테나"),
        (px + 40, 340, "GNSS 수신기"),
        (px + 40, 440, "무선 통신 (LTE)"),
        (px + 40, 540, "중앙 서버"),
        (px + 40, 640, "데이터 수집·분석"),
        (px + 40, 740, "3D 변위 산출"),
    ]
    bw = 320
    for x, y, text in boxes:
        draw.rounded_rectangle([x, y, x + bw, y + 56], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
        draw_label(draw, text, (x + bw // 2, y + 28), load_font(17), anchor="mm")

    for i in range(len(boxes) - 1):
        y0 = boxes[i][1] + 56
        y1 = boxes[i + 1][1]
        draw_arrow(draw, px + 40 + bw // 2, y0 + 4, px + 40 + bw // 2, y1 - 4, color=C["navy"], width=2)

    # Solar + battery optional
    draw.rounded_rectangle([px + 400, 300, px + 520, 380], fill=_hex(C["white"]), outline=_hex(C["orange"]), width=2)
    draw_label(draw, "태양광", (px + 460, 325), load_font(14), anchor="mm")
    draw_label(draw, "배터리", (px + 460, 355), load_font(14), anchor="mm")
    draw.line([(px + 400, 340), (px + 360, 268)], fill=_hex(C["orange"]), width=2)


def render_img043(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "GNSS 변위 계측 개념도", (W // 2, 48), font_title)
    draw_label(draw, "위성 신호 · 보정정보 통신 · ΔE·ΔN·ΔU (시준선 아님)", (W // 2, 88), load_font(18), fill=C["gray"])
    _draw_site(draw)
    _draw_block_diagram(draw)
