"""Tunnel rockbolt (IMG-078) and shotcrete (IMG-079) dedicated figures."""
from __future__ import annotations

import math

from PIL import ImageDraw

from lib.datalogger_draw import C, W, _hex, draw_arrow, draw_label, draw_title, load_font, new_canvas

CX, FLOOR_Y = 520, 720
RX, RY = 220, 260


def _arch_point(theta: float, inset: float = 0.0) -> tuple[float, float]:
    rxi, ryi = RX - inset, RY - inset
    return (CX + rxi * math.cos(theta), FLOOR_Y - ryi * math.sin(theta))


def _draw_tunnel_lining(draw: ImageDraw.ImageDraw) -> None:
    n = 40
    angles = [math.pi + i * (math.pi / n) for i in range(n + 1)]
    outer = [_arch_point(a, 0) for a in angles]
    inner = [_arch_point(a, 24) for a in angles]
    left_floor = (CX - RX, FLOOR_Y)
    right_floor = (CX + RX, FLOOR_Y)
    outer_ring = [left_floor] + outer + [right_floor]
    inner_ring = [(CX - RX + 24, FLOOR_Y)] + inner + [(CX + RX - 24, FLOOR_Y)]
    draw.polygon(
        [tuple(map(int, p)) for p in outer_ring + list(reversed(inner_ring))],
        fill=_hex("#C8CDD4"),
        outline=_hex(C["navy"]),
    )
    draw.rectangle(
        [int(CX - RX + 36), int(FLOOR_Y - 6), int(CX + RX - 36), int(FLOOR_Y + 28)],
        fill=_hex("#4B5563"),
        outline=_hex(C["navy"]),
        width=2,
    )
    draw_label(draw, "굴착면", (CX, FLOOR_Y + 60), load_font(16), fill=C["gray"])


def _draw_rockbolt(draw: ImageDraw.ImageDraw, x: int, y: int, length: int, angle_deg: float, *, instrumented: bool = False) -> None:
    rad = math.radians(angle_deg)
    ex = x + int(length * math.cos(rad))
    ey = y - int(length * math.sin(rad))
    draw.line([(x, y), (ex, ey)], fill=_hex(C["navy"]), width=5)
    draw.ellipse([ex - 8, ey - 8, ex + 8, ey + 8], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    if instrumented:
        draw.rectangle([x - 14, y - 10, x + 14, y + 6], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
        draw_label(draw, "두부 LC", (x, y - 22), load_font(12, bold=True))
    else:
        mid_x = (x + ex) // 2
        mid_y = (y + ey) // 2
        draw.rounded_rectangle([mid_x - 12, mid_y - 8, mid_x + 12, mid_y + 8], fill=_hex(C["orange"]), outline=_hex(C["navy"]), width=1)
        draw_label(draw, "SG", (mid_x, mid_y), load_font(10, bold=True))


def render_img078() -> object:
    img, draw = new_canvas()
    draw_title(draw, "록볼트 축력 계측 개념도", "두부 하중 · 축력분포(변형률계) 구분")

    _draw_tunnel_lining(draw)

    bolts = [
        (CX - 80, int(FLOOR_Y - RY * 0.85), 140, 72, True),
        (CX + 40, int(FLOOR_Y - RY * 0.95), 150, 108, False),
        (CX - 160, int(FLOOR_Y - RY * 0.55), 120, 55, False),
    ]
    for bx, by, length, ang, inst in bolts:
        _draw_rockbolt(draw, bx, by, length, ang, instrumented=inst)

    # Bond zones on instrumented bolt
    bx, by, length, ang, _ = bolts[0]
    rad = math.radians(ang)
    ex = bx + int(length * math.cos(rad))
    ey = by - int(length * math.sin(rad))
    draw_label(draw, "자유장", (bx - 40, by + 20), load_font(12), fill=C["gray"])
    draw_label(draw, "부착구간", ((bx + ex) // 2, (by + ey) // 2 - 24), load_font(12), fill=C["teal"])
    draw_label(draw, "정착장", (ex + 12, ey), load_font(12), fill=C["gray"])

    draw_label(draw, "록볼트 두부 하중 (반력)", (CX, 200), load_font(18, bold=True))
    draw_label(draw, "≠ 전체 축력분포", (CX, 228), load_font(14), fill=C["red"])
    draw_label(draw, "변형률계 부착 록볼트 → 축력분포 추정", (CX + 180, int(FLOOR_Y - RY * 0.7)), load_font(13), fill=C["orange"])

    px = 1180
    draw.rounded_rectangle([px, 200, 1840, 720], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "측정·해석", (1510, 240), load_font(22, bold=True))
    items = [
        "두부 하중계 = 두부 반력·축력 변화",
        "축력분포 = SG 부착 록볼트·계측용 앵커",
        "자유장·부착·정착 구간 구분",
        "천단침하·내공변위와 시간 연동",
    ]
    iy = 310
    for item in items:
        draw.ellipse([px + 24, iy - 6, px + 36, iy + 6], fill=_hex(C["teal"]))
        draw_label(draw, item, (px + 48, iy), load_font(18), anchor="lm")
        iy += 48

    draw_label(draw, "두부 반력 · 지반-그라우트 부착", (W // 2, 820), load_font(18), fill=C["gray"])
    return img


def render_img079() -> object:
    img, draw = new_canvas()
    draw_title(draw, "숏크리트 응력·변형 계측 개념도", "변형률계 매립 — 라이닝 부담·균열 전 조기 포착")

    _draw_tunnel_lining(draw)
    draw_label(draw, "숏크리트 라이닝", (CX - 180, int(FLOOR_Y - RY * 0.7)), load_font(17), fill=C["navy"])

    gauges = [
        (CX - 30, int(FLOOR_Y - RY * 0.92)),
        (CX + 90, int(FLOOR_Y - RY * 0.75)),
        (CX - 120, int(FLOOR_Y - RY * 0.55)),
        (CX + 50, int(FLOOR_Y - RY * 0.45)),
    ]
    for gx, gy in gauges:
        draw.rounded_rectangle([gx - 18, gy - 10, gx + 18, gy + 10], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
        draw_label(draw, "SG", (gx, gy), load_font(12, bold=True))
        draw.line([(gx, gy + 12), (gx, gy + 40)], fill=_hex(C["teal"]), width=2)

    draw_label(draw, "변형률계(SG)", (CX, 200), load_font(20, bold=True))

    px = 1180
    draw.rounded_rectangle([px, 200, 1840, 720], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "응력·변형 해석", (1510, 240), load_font(22, bold=True))
    items = [
        "시공 시 라이닝 내부·표면 매립",
        "양생·재령에 따른 응력 발현",
        "추가 굴착 시 부담 재상승",
        "천단침하·내공변위와 통합 검토",
    ]
    iy = 310
    for item in items:
        draw.ellipse([px + 24, iy - 6, px + 36, iy + 6], fill=_hex(C["teal"]))
        draw_label(draw, item, (px + 48, iy), load_font(18), anchor="lm")
        iy += 48

    draw_label(draw, "압축 막부재 — 굴착면 이완 제한", (W // 2, 820), load_font(18), fill=C["gray"])
    return img


def render_img009() -> object:
    """록볼트·숏크리트 통합 배치 — all sensors on members (ZIP-AUD-02)."""
    img, draw = new_canvas()
    draw_title(draw, "록볼트 축력·숏크리트 응력 계측도", "부재 부착·매립 — 공중 부유 센서 금지")

    _draw_tunnel_lining(draw)
    draw.rectangle([CX - RX + 24, int(FLOOR_Y - RY * 0.95), CX + RX - 24, int(FLOOR_Y - RY * 0.35)], fill=_hex("#B8BFC6"), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "숏크리트 라이닝", (CX - 200, int(FLOOR_Y - RY * 0.7)), load_font(16), fill=C["navy"])

    # Rockbolt with head LC
    _draw_rockbolt(draw, CX - 60, int(FLOOR_Y - RY * 0.88), 130, 75, instrumented=True)

    # Shotcrete SG embedded in lining (surface + buried)
    for gx, gy, note in [
        (CX - 20, int(FLOOR_Y - RY * 0.9), "표면 부착 SG"),
        (CX + 80, int(FLOOR_Y - RY * 0.72), "내부 매립 SG"),
        (CX - 100, int(FLOOR_Y - RY * 0.55), "표면 SG"),
    ]:
        draw.rounded_rectangle([gx - 16, gy - 10, gx + 16, gy + 10], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
        draw_label(draw, "SG", (gx, gy), load_font(11, bold=True))
        draw.line([(gx, gy + 12), (gx, gy + 28)], fill=_hex(C["navy"]), width=1)
        draw_label(draw, note, (gx + 40, gy), load_font(11), fill=C["gray"])

    px = 1180
    draw.rounded_rectangle([px, 200, 1840, 680], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "설치 위치", (1510, 240), load_font(22, bold=True))
    for i, t in enumerate([
        "록볼트 두부 축력계(LC)",
        "숏크리트 내부·표면 변형률계",
        "부재별 SG 구분 (숏크리트·록볼트)",
        "공중 부유 아이콘 금지",
    ]):
        draw_label(draw, f"• {t}", (px + 32, 300 + i * 44), load_font(18), anchor="lm")
    return img
