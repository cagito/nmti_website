"""Data quality management flow (IMG-060) — ZIP-AUD-08."""
from __future__ import annotations

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, load_font


def _box(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int, text: str, *, fill: str = C["light"]) -> None:
    draw.rounded_rectangle([x, y, x + w, y + h], fill=_hex(fill), outline=_hex(C["navy"]), width=2)
    draw_label(draw, text, (x + w // 2, y + h // 2), load_font(16), anchor="mm")


def render_img060(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "데이터 품질관리 흐름도", (W // 2, 48), font_title)
    draw_label(
        draw,
        "원본 보존 · QC 플래그 · 승인 후 보정 · 보정 데이터 별도 저장",
        (W // 2, 88),
        load_font(18),
        fill=C["gray"],
    )

    bx, bw, bh, gap = 200, 260, 72, 36
    y = 200
    steps = [
        ("1. 센서·로거 수집", C["light"]),
        ("2. 원본 데이터 저장 (불변)", C["teal"]),
        ("3. QC 검증", C["light"]),
        ("4. QC 플래그 부여", C["orange"]),
        ("5. 엔지니어 검토", C["light"]),
        ("6. 승인 후 보정 (별도 저장)", C["teal"]),
        ("7. 보고서 (원본·보정·사유)", C["light"]),
    ]
    centers: list[tuple[int, int]] = []
    for i, (text, col) in enumerate(steps):
        _box(draw, bx, y, bw, bh, text, fill=col)
        centers.append((bx + bw // 2, y + bh // 2))
        if i < len(steps) - 1:
            draw_arrow(draw, bx + bw // 2, y + bh, bx + bw // 2, y + bh + gap - 8, color=C["navy"], width=2)
        y += bh + gap

    # QC outcomes branch
    qx = 560
    draw.rounded_rectangle([qx, 318, qx + 320, 520], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "QC 판정 (삭제 아님)", (qx + 160, 348), load_font(17, bold=True))
    flags = ["정상", "결측", "이상 의심", "센서 점검 필요"]
    fy = 390
    for f in flags:
        draw_label(draw, f"• {f}", (qx + 24, fy), load_font(15), anchor="lm")
        fy += 32

    draw.rounded_rectangle([qx, 560, qx + 320, 700], outline=_hex(C["red"]), width=2)
    draw_label(draw, "✗ 자동 이상치 삭제·보간", (qx + 160, 610), load_font(15, bold=True), fill=C["red"])
    draw_label(draw, "✗ 원본 덮어쓰기", (qx + 160, 640), load_font(14), fill=C["red"])

    px = 960
    draw.rounded_rectangle([px, 200, 1820, 820], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "데이터 계층", (1390, 240), load_font(22, bold=True))
    layers = [
        ("원본 RAW", "영구 보존 · 불변"),
        ("QC 메타", "플래그·검토 이력"),
        ("보정 CAL", "승인 후 별도 저장"),
        ("보고 출력", "원본값 + 보정값 + 사유"),
    ]
    ly = 300
    for title, sub in layers:
        draw.rounded_rectangle([px + 40, ly, px + 360, ly + 56], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
        draw_label(draw, title, (px + 200, ly + 18), load_font(16, bold=True))
        draw_label(draw, sub, (px + 400, ly + 28), load_font(15), anchor="lm", fill=C["gray"])
        ly += 72
