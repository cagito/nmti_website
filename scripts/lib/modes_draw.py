"""Measurement mode concept figures (IMG-070~075)."""
from __future__ import annotations

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, draw_legacy_logger_block_icon, load_font
from .platform_draw import draw_lte_m2m_modem


def _flow_box(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int, title: str, lines: list[str]) -> None:
    draw.rounded_rectangle([x, y, x + w, y + h], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, title, (x + w // 2, y + 28), load_font(20, bold=True))
    ly = y + 58
    for line in lines:
        draw_label(draw, line, (x + w // 2, ly), load_font(15), fill=C["gray"])
        ly += 28


def render_img070(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "수동 계측 개념도", (W // 2, 48), font_title)
    draw_label(draw, "Field visit · handheld readout · field log", (W // 2, 88), load_font(18), fill=C["gray"])
    _flow_box(draw, 120, 280, 280, 200, "현장 방문", ["측정원", "정기·수시 점검"])
    _flow_box(draw, 480, 280, 300, 200, "휴대 리드아웃", ["지중경사계", "수위·하중 직접 판독"])
    _flow_box(draw, 860, 280, 280, 200, "현장 기록", ["측정일지", "수기·엑셀"])
    draw_arrow(draw, 400, 380, 480, 380)
    draw_arrow(draw, 780, 380, 860, 380)
    draw_label(draw, "데이터로거 없음 · 통신 없음", (W // 2, 560), load_font(18), fill=C["orange"])


def render_img071(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "자동 계측 개념도", (W // 2, 48), font_title)
    draw_label(draw, "Datalogger · scheduled sampling · on-site storage", (W // 2, 88), load_font(18), fill=C["gray"])
    draw_legacy_logger_block_icon(draw, 200, 300, 200, 140, font=load_font(18, bold=True))
    _flow_box(draw, 480, 280, 320, 200, "센서", ["VW·SDI-12·RS-485", "현장 배선"])
    _flow_box(draw, 880, 280, 320, 200, "현장 저장", ["주기 수집", "메모리·SD카드"])
    draw_arrow(draw, 400, 370, 480, 370)
    draw_arrow(draw, 800, 370, 880, 370)
    draw_label(draw, "원격 전송 없음 (현장 회수)", (W // 2, 560), load_font(18), fill=C["gray"])


def render_img072(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "원격 자동계측 개념도", (W // 2, 48), font_title)
    draw_label(draw, "Field · LTE M2M modem · server · web monitoring & alerts", (W // 2, 88), load_font(18), fill=C["gray"])
    draw_legacy_logger_block_icon(draw, 140, 320, 180, 120)
    draw_lte_m2m_modem(draw, 390, 330, 160, 90)
    draw.rounded_rectangle([620, 300, 900, 460], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "중앙 서버", (760, 340), load_font(20, bold=True))
    draw_label(draw, "수집·저장", (760, 380), load_font(15), fill=C["gray"])
    draw.rounded_rectangle([980, 300, 1280, 460], fill=_hex(C["white"]), outline=_hex(C["teal"]), width=2)
    draw_label(draw, "웹 대시보드", (1130, 340), load_font(20, bold=True))
    draw_label(draw, "경보·이력", (1130, 390), load_font(15), fill=C["teal"])
    draw_arrow(draw, 320, 380, 390, 375)
    draw_arrow(draw, 550, 375, 620, 380)
    draw_arrow(draw, 900, 380, 980, 380)


def render_img073(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "스마트 계측 개념도", (W // 2, 48), font_title)
    draw_label(draw, "Platform · staged alerts · reports · event log", (W // 2, 88), load_font(18), fill=C["gray"])
    px = 200
    items = [
        ("데이터 수집", ["다중 현장", "품질 검증"]),
        ("관리기준 비교", ["1·2·3단계", "주의·경고"]),
        ("보고·이벤트", ["PDF·엑셀", "감사 로그"]),
    ]
    x = px
    for title, lines in items:
        _flow_box(draw, x, 300, 300, 220, title, lines)
        if x < 900:
            draw_arrow(draw, x + 300, 410, x + 380, 410)
        x += 380
    # Alert colors
    for i, (lab, col) in enumerate([("정상", C["green"]), ("주의", C["orange"]), ("경고", C["red"])]):
        draw.ellipse([1400 + i * 120, 360, 1420 + i * 120, 380], fill=_hex(col))
        draw_label(draw, lab, (1460 + i * 120, 370), load_font(16))


def render_img074(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "AI 계측 개념도", (W // 2, 48), font_title)
    draw_label(draw, "Anomaly detection · prediction · human-in-the-loop", (W // 2, 88), load_font(18), fill=C["gray"])
    _flow_box(draw, 160, 300, 300, 200, "시계열 데이터", ["다변량", "이력 DB"])
    draw.rounded_rectangle([520, 280, 820, 480], fill=_hex("#EDF3FF"), outline=_hex(C["teal"]), width=2)
    draw_label(draw, "AI 분석 엔진", (670, 330), load_font(22, bold=True))
    draw_label(draw, "이상탐지 · 예측", (670, 370), load_font(16), fill=C["teal"])
    draw_label(draw, "HITL 검토", (670, 410), load_font(16), fill=C["gray"])
    _flow_box(draw, 900, 300, 320, 200, "보조 의사결정", ["권고 알림", "엔지니어 확인"])
    draw_arrow(draw, 460, 390, 520, 390)
    draw_arrow(draw, 820, 390, 900, 390)
    draw_label(draw, "브랜드·제품명 금지", (W // 2, 560), load_font(16), fill=C["gray"])


def render_img075(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "계측 방식 5단계 계층도", (W // 2, 48), font_title)
    draw_label(draw, "Manual ⊂ Automatic ⊂ Remote ⊂ Smart ⊂ AI-assisted", (W // 2, 88), load_font(18), fill=C["gray"])
    levels = [
        ("1 수동 계측", "현장 방문·리드아웃", 1100, C["gray"]),
        ("2 자동 계측", "+ 데이터로거·주기 수집", 980, C["light"]),
        ("3 원격 자동계측", "+ 통신·서버·웹", 860, C["white"]),
        ("4 스마트 계측", "+ 경보·보고·플랫폼", 740, C["light"]),
        ("5 AI 계측", "+ 이상탐지·예측·HITL", 620, C["teal"]),
    ]
    cx = 700
    for i, (title, sub, w, fill) in enumerate(levels):
        y = 200 + i * 110
        x0 = cx - w // 2
        draw.rounded_rectangle([x0, y, x0 + w, y + 90], fill=_hex(fill), outline=_hex(C["navy"]), width=2)
        draw_label(draw, title, (cx, y + 32), load_font(20, bold=True))
        draw_label(draw, sub, (cx, y + 62), load_font(15), fill=C["gray"])
    draw_label(draw, "하위 단계 포함 · 능력 누적", (cx, 780), load_font(18), fill=C["navy"])
    # Side legend
    draw.rounded_rectangle([1280, 240, 1780, 720], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "포함 관계", (1530, 280), load_font(22, bold=True))
    for i, (title, _, _, _) in enumerate(levels):
        draw_label(draw, f"• {title}", (1320, 340 + i * 48), load_font(17), anchor="lm")
