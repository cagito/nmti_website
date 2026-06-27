"""IMG-011 v2 — bridge monitoring overview (BRI-01, Daegu 10-sensor callouts)."""
from __future__ import annotations

from PIL import ImageDraw

from lib.bridge_draw import (
    draw_acc_node,
    draw_bridge_span,
    draw_expansion_joint,
    draw_info_panel,
    draw_prism,
    draw_tiltmeter_bracket,
)
from lib.bridge_daegu_draw import _draw_cable_stayed
from lib.datalogger_draw import C, _hex, draw_arrow, draw_label, draw_title, load_font, new_canvas


def _callout(
    draw: ImageDraw.ImageDraw,
    bx: int,
    by: int,
    tx: int,
    ty: int,
    text: str,
    *,
    num: str | None = None,
) -> None:
    draw.line([(bx, by), (tx, ty)], fill=_hex(C["teal"]), width=2)
    label = f"{num} {text}" if num else text
    tw = max(72, len(label) * 11)
    draw.rounded_rectangle(
        [bx - tw // 2, by - 14, bx + tw // 2, by + 14],
        fill=_hex(C["white"]),
        outline=_hex(C["navy"]),
        width=2,
    )
    draw_label(draw, label, (bx, by), load_font(12, bold=True), fill=C["teal"])


def render_img011() -> object:
    """교량 계측 전체 개념도 v2 — fields/bridge category hero."""
    img, draw = new_canvas()
    draw_title(draw, "교량 계측 전체 개념도", "상부구조·교각·교대·기초 — 10종 계측 callout")

    deck_y, ground_y = 400, 700
    x0, x1 = 80, 960
    pier_xs = [280, 780]
    draw_bridge_span(draw, x0, x1, deck_y, ground_y, pier_xs=pier_xs, water_y=ground_y + 8)
    _draw_cable_stayed(draw, 520, deck_y, ground_y)

    jx = 860
    draw_expansion_joint(draw, jx, deck_y)
    draw_label(draw, "교대", (x0 - 10, deck_y + 110), load_font(14), fill=C["gray"])
    draw_label(draw, "상부구조", (520, deck_y - 36), load_font(15, bold=True))

    # ① 변형률계
    _callout(draw, 420, 300, 360, deck_y + 42, "변형률계", num="①")
    draw.rounded_rectangle([350, deck_y + 36, 370, deck_y + 52], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)

    # ② 온도계
    _callout(draw, 640, 290, 620, deck_y + 10, "온도계", num="②")
    draw.ellipse([612, deck_y + 2, 628, deck_y + 18], fill=_hex(C["orange"]), outline=_hex(C["navy"]), width=2)

    # ③ 가속도계
    draw_acc_node(draw, 200, deck_y + 6)
    _callout(draw, 160, 310, 200, deck_y + 6, "가속도계", num="③")

    # ④ 처짐계
    mid_x = 520
    draw_arrow(draw, mid_x, deck_y - 18, mid_x, deck_y + 38, color=C["teal"], width=3)
    draw_label(draw, "δ", (mid_x + 20, deck_y + 8), load_font(14, bold=True), fill=C["teal"])
    _callout(draw, mid_x, 280, mid_x, deck_y + 70, "처짐계", num="④")

    # ⑤ 신축이음계
    _callout(draw, 920, 340, jx, deck_y - 8, "신축이음계", num="⑤")

    # ⑥ 케이블장력계
    _callout(draw, 680, 200, 600, deck_y - 40, "케이블장력계", num="⑥")

    # ⑦ 풍향풍속계
    draw.line([(520, deck_y - 180), (520, deck_y - 210)], fill=_hex(C["navy"]), width=2)
    draw.ellipse([508, deck_y - 228, 532, deck_y - 204], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
    _callout(draw, 620, 150, 520, deck_y - 218, "풍향풍속계", num="⑦")

    # ⑧ 무응력계
    _callout(draw, 300, 250, 320, deck_y + 40, "무응력계", num="⑧")
    draw.rounded_rectangle([312, deck_y + 34, 328, deck_y + 50], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)

    # ⑨ 구조물경사계
    draw_tiltmeter_bracket(draw, 780, deck_y + 120, side="right", label="")
    _callout(draw, 900, 480, 820, deck_y + 130, "구조물경사계", num="⑨")

    # ⑩ 기초침하 + 받침
    draw_prism(draw, 280, ground_y - 8)
    _callout(draw, 180, 560, 280, ground_y - 8, "기초침하·광파", num="⑩")
    draw_label(draw, "받침부 변위", (780, deck_y + 96), load_font(12), fill=C["orange"])

    draw_info_panel(
        draw,
        1020,
        160,
        1840,
        860,
        "교량 계측 10종 (정적·동적)",
        [
            "① 변형률계 — 휨·응력",
            "② 온도계 · ③ 가속도계(동적)",
            "④ 처짐계 δ · ⑤ 신축이음계",
            "⑥ 케이블장력계 · ⑦ 풍향풍속계",
            "⑧ 무응력계(크리프 보정)",
            "⑨ 구조물경사계 · ⑩ 기초침하",
            "받침·GNSS·진동·지진 연계",
            "≠ 흙막이·굴착 단면 (BRI-01)",
        ],
    )
    return img
