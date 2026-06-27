"""Sprint 0 pending figures IMG-089~095, 102 — engineering line-art (Pillow)."""
from __future__ import annotations

import math

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, W, H, _hex, draw_arrow, draw_label, draw_legacy_logger_block_icon, load_font
from .modes_draw import _flow_box
from .platform_draw import _box, draw_lte_m2m_modem


def _hatch_rect(draw: ImageDraw.ImageDraw, x0: int, y0: int, x1: int, y1: int, style: str) -> None:
    draw.rectangle([x0, y0, x1, y1], fill=_hex(C["white"]), outline=_hex(C["gray"]), width=1)
    if style == "dots":
        for yy in range(y0 + 8, y1, 14):
            for xx in range(x0 + 8, x1, 14):
                draw.ellipse([xx - 2, yy - 2, xx + 2, yy + 2], fill=_hex(C["gray"]))
    elif style == "dash":
        for yy in range(y0 + 6, y1, 12):
            draw.line([(x0 + 4, yy), (x1 - 4, yy)], fill=_hex(C["gray"]), width=1)
    elif style == "cross":
        step = 10
        for yy in range(y0, y1, step):
            draw.line([(x0, yy), (x1, yy + step)], fill=_hex(C["light"]), width=1)


def render_img089(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "사면 지표경사 계측 개념도", (W // 2, 48), font_title)
    draw_label(draw, "지표 pad 경사계 · 사면 질량 θ — ≠ 센서형 다단식 지중경사계", (W // 2, 88), load_font(18), fill=C["gray"])

    gl_y = 820
    draw.line([(100, gl_y), (1340, gl_y)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "지표면 (GL)", (160, gl_y - 18), load_font(14, bold=True))

    crest = (280, 520)
    toe = (1180, gl_y)
    draw.polygon([(100, gl_y), crest, toe, (1340, gl_y)], fill=_hex("#E8D4B8"), outline=_hex(C["navy"]), width=2)
    _hatch_rect(draw, 100, gl_y, 1340, 960, "cross")
    draw_label(draw, "기반암", (700, 900), load_font(16), fill=C["gray"])

    pad_x, pad_y = 620, 700
    draw.rectangle([pad_x - 48, pad_y, pad_x + 48, pad_y + 14], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "콘크리트 pad", (pad_x, pad_y + 32), load_font(13), fill=C["gray"])
    draw.rounded_rectangle([pad_x - 32, pad_y - 40, pad_x + 32, pad_y], fill=_hex(C["white"]), outline=_hex(C["teal"]), width=2)
    draw_label(draw, "지표경사계", (pad_x, pad_y - 20), load_font(15, bold=True))
    draw.line([(pad_x - 22, pad_y - 10), (pad_x + 18, pad_y - 32)], fill=_hex(C["red"]), width=2)
    draw_label(draw, "θ", (pad_x + 28, pad_y - 34), load_font(17, bold=True), fill=C["red"])

    draw_arrow(draw, 460, 580, 540, 660, color=C["orange"], width=3)
    draw_label(draw, "질량 하방·회전", (400, 540), load_font(15), fill=C["orange"])

    draw_legacy_logger_block_icon(draw, 1080, 620, 200, 120, font=load_font(14, bold=True))
    draw_arrow(draw, pad_x + 40, pad_y - 20, 1080, 680, width=2)
    draw_label(draw, "4–20 mA · RS-485", (860, 640), load_font(13), fill=C["teal"])

    draw_label(draw, "≠ 보링 casing · ≠ 구조물경사계(벽 부착)", (W // 2, 960), load_font(16), fill=C["gray"])


def render_img090(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "사면 구조물 변위 계측 개념도", (W // 2, 48), font_title)
    draw_label(draw, "옹벽·낙석방지 — 프리즘 측점 · ATS 부동점 · Δ 변위", (W // 2, 88), load_font(18), fill=C["gray"])

    gl_y = 860
    draw.line([(80, gl_y), (1400, gl_y)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "지표면", (120, gl_y - 16), load_font(14, bold=True))

    wall_x = 480
    draw.rectangle([wall_x, 340, wall_x + 90, gl_y], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)
    draw_label(draw, "옹벽·낙석방지", (wall_x + 45, 310), load_font(16, bold=True))

    prism_y = [460, 540, 620, 700, 780]
    for i, py in enumerate(prism_y):
        px = wall_x + 105
        draw.polygon([(px, py - 8), (px - 12, py + 8), (px + 12, py + 8)], fill=_hex(C["orange"]), outline=_hex(C["navy"]))
        draw_label(draw, f"P{i + 1}", (px + 28, py), load_font(12, bold=True), anchor="lm")

    ats_x, ats_y = 1240, gl_y - 40
    draw.rounded_rectangle([ats_x, ats_y - 55, ats_x + 90, ats_y + 5], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "자동광파기", (ats_x + 45, ats_y - 28), load_font(14, bold=True))
    draw_label(draw, "부동점(안정 지반)", (ats_x + 45, ats_y + 28), load_font(12), fill=C["gray"])
    for py in prism_y:
        px = wall_x + 105
        draw.line([(ats_x, ats_y - 25), (px, py)], fill=_hex(C["teal"]), width=1)
    draw_label(draw, "시준선 · ΔX·ΔY·ΔZ", (900, 380), load_font(15), fill=C["teal"])

    draw_label(draw, "≠ 지표경사계 pad · ≠ 단일 변위계만", (W // 2, 940), load_font(15), fill=C["gray"])


def render_img091(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "다점지중변위계 (MPBX) 설치 개념도", (W // 2, 48), font_title)
    draw_label(draw, "보링 앵커 로드 · 수직 침하·신장 — ≠ 센서형 다단식 지중경사계", (W // 2, 88), load_font(18), fill=C["gray"])

    gl_y = 260
    draw.line([(200, gl_y), (1320, gl_y)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "지표면 (GL)", (240, gl_y - 18), load_font(14, bold=True))
    draw.rounded_rectangle([720, gl_y - 28, 800, gl_y + 8], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "well cap", (760, gl_y - 10), load_font(12))

    bx = 760
    draw.rectangle([bx - 40, gl_y, bx + 40, 900], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=3)
    draw.rectangle([bx - 32, gl_y, bx + 32, gl_y + 36], fill=_hex(C["navy"]))
    draw_label(draw, "보링 casing", (bx + 70, gl_y + 18), load_font(14))

    rod_y = [340, 440, 540, 640, 740]
    for i, ry in enumerate(rod_y):
        draw.line([(bx - 90, ry), (bx + 90, ry)], fill=_hex(C["teal"]), width=3)
        draw.ellipse([bx - 98, ry - 8, bx - 78, ry + 8], fill=_hex(C["orange"]), outline=_hex(C["navy"]), width=2)
        draw_label(draw, f"앵커 {i + 1}", (bx + 110, ry), load_font(13, bold=True), anchor="lm")
        draw_label(draw, f"z={i + 1}0m", (bx - 130, ry), load_font(12), anchor="rm", fill=C["gray"])

    draw.line([(bx, gl_y + 36), (bx, 880)], fill=_hex(C["gray"]), width=2)
    draw_label(draw, "강봉·연장 로드", (bx - 140, 520), load_font(14), fill=C["gray"])

    draw_legacy_logger_block_icon(draw, 1080, 520, 220, 130, font=load_font(14, bold=True))
    draw_arrow(draw, bx + 40, gl_y + 10, 1080, 580, width=2)

    _hatch_rect(draw, 200, 900, 1320, 960, "dash")
    draw_label(draw, "수직 변위·신장 — 수평 프로파일(지중경사) 아님", (W // 2, 940), load_font(16), fill=C["gray"])


def render_img092(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "말뚝 축력·변형률 지중 단면도", (W // 2, 48), font_title)
    draw_label(draw, "CIP pile · rebar cage · sister-bar strain gauges · bedrock toe", (W // 2, 88), load_font(18), fill=C["gray"])

    gl_y = 280
    draw.line([(140, gl_y), (1780, gl_y)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "GL", (160, gl_y - 16), load_font(14, bold=True))

    layers = [
        (280, 480, "dots", "느슨한 모래·실트"),
        (480, 680, "dash", "연약 점토"),
        (680, 880, "cross", "풍화암·기반암"),
    ]
    for y0, y1, style, lab in layers:
        _hatch_rect(draw, 200, y0, 620, y1, style)
        draw_label(draw, lab, (640, (y0 + y1) // 2), load_font(14), anchor="lm", fill=C["gray"])

    px = 960
    draw.rectangle([px - 55, gl_y, px + 55, 860], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)
    draw_label(draw, "CIP 말뚝", (px, 300), load_font(16, bold=True))
    for ry in range(int(gl_y) + 80, 820, 70):
        draw.line([(px - 40, ry), (px + 40, ry)], fill=_hex(C["navy"]), width=2)
        draw.line([(px - 40, ry), (px - 40, ry + 50)], fill=_hex(C["navy"]), width=2)
        draw.line([(px + 40, ry), (px + 40, ry + 50)], fill=_hex(C["navy"]), width=2)
        draw.ellipse([px - 8, ry + 20, px + 8, ry + 36], fill=_hex(C["teal"]), outline=_hex(C["navy"]))
    draw_label(draw, "변형률계", (px + 80, 520), load_font(14), fill=C["teal"])

    draw_label(draw, "말단 지지층(기반암)", (px + 90, 840), load_font(14), fill=C["gray"])

    for _ in range(3):
        draw_arrow(draw, px, gl_y + 20, px, gl_y + 100, color=C["red"], width=4)
    draw_label(draw, "축하중", (px + 70, gl_y + 50), load_font(15), fill=C["red"])


def render_img093(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "환경 소음·분진 경계 계측주", (W // 2, 48), font_title)
    draw_label(draw, "공사 경계 펜스 · 소음·PM 센서주 · 데이터로거 · 원격 전송", (W // 2, 88), load_font(18), fill=C["gray"])

    gl_y = 760
    draw.line([(160, gl_y), (1720, gl_y)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "공사 경계 펜스", (960, gl_y - 28), load_font(16, bold=True))

    for fx in range(240, 1640, 100):
        draw.line([(fx, gl_y), (fx, gl_y - 70)], fill=_hex(C["gray"]), width=2)

    pole_x = 480
    draw.line([(pole_x, gl_y), (pole_x, 400)], fill=_hex(C["navy"]), width=4)
    draw.rounded_rectangle([pole_x - 55, 380, pole_x + 55, 440], fill=_hex(C["white"]), outline=_hex(C["teal"]), width=2)
    draw_label(draw, "소음계", (pole_x, 410), load_font(14, bold=True))
    draw.rounded_rectangle([pole_x - 45, 450, pole_x + 45, 500], fill=_hex(C["white"]), outline=_hex(C["teal"]), width=2)
    draw_label(draw, "PM10·PM2.5", (pole_x, 475), load_font(12))

    draw_legacy_logger_block_icon(draw, 200, 820, 180, 110, font=load_font(13, bold=True))
    draw.line([(pole_x, 500), (290, 860)], fill=_hex(C["teal"]), width=2)
    draw_lte_m2m_modem(draw, 420, 830, 140, 80)
    draw_arrow(draw, 380, 875, 420, 870, width=2)

    draw.rounded_rectangle([1180, 580, 1520, 740], fill=_hex(C["light"]), outline=_hex(C["orange"]), width=2)
    draw_label(draw, "민가·민원 구역", (1350, 630), load_font(18, bold=True))
    draw_label(draw, "← 경계 모니터링", (900, 600), load_font(15), fill=C["orange"])

    draw.rounded_rectangle([1240, 300, 1680, 480], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "서버·대시보드", (1460, 340), load_font(18, bold=True))
    draw_label(draw, "Leq · PM 농도 이력", (1460, 380), load_font(14), fill=C["gray"])
    draw_arrow(draw, 560, 870, 1240, 390, width=2)

    draw_label(draw, "기상 그래프만 단독 표현 금지 — 현장 센서주 필수", (W // 2, 920), load_font(15), fill=C["gray"])


def render_img094(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "상시 계측 모드 흐름도", (W // 2, 48), font_title)
    draw_label(draw, "등간격 트리거 · 현장 수집 · 서버 저장 · stable trend", (W // 2, 88), load_font(18), fill=C["gray"])

    # Sensors
    sensors = ["지중경사계", "지하수위계", "하중계", "침하계"]
    sx, sy = 80, 280
    for i, name in enumerate(sensors):
        yy = sy + i * 88
        draw.rounded_rectangle([sx, yy, sx + 168, yy + 64], fill=_hex(C["white"]), outline=_hex(C["teal"]), width=2)
        draw_label(draw, name, (sx + 84, yy + 32), load_font(15, bold=True))
        draw_arrow(draw, sx + 168, yy + 32, 300, 320 + i * 28, width=2)

    draw_legacy_logger_block_icon(draw, 300, 300, 240, 150, font=load_font(16, bold=True))
    draw_label(draw, "스케줄·트리거", (420, 470), load_font(16), fill=C["teal"])
    for i, lab in enumerate(["10분", "30분", "1시간", "4시간"]):
        bx = 310 + i * 52
        draw.rounded_rectangle([bx, 488, bx + 44, 524], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)
        draw_label(draw, lab, (bx + 22, 506), load_font(12))

    draw_arrow(draw, 540, 375, 600, 375, width=3)
    draw.rounded_rectangle([600, 300, 860, 460], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "서버·DB", (730, 340), load_font(20, bold=True))
    draw_label(draw, "시계열 저장", (730, 380), load_font(15), fill=C["gray"])
    draw_label(draw, "품질·결측 플래그", (730, 410), load_font(14), fill=C["gray"])

    draw_arrow(draw, 860, 375, 920, 375, width=3)
    cx, cy = 920, 280
    cw, ch = 480, 280
    draw.rounded_rectangle([cx, cy, cx + cw, cy + ch], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "대시보드 · stable trend", (cx + cw // 2, cy + 28), load_font(18, bold=True))
    gx, gy = cx + 40, cy + 70
    draw.line([(gx, gy + 160), (gx + cw - 80, gy + 160)], fill=_hex(C["navy"]), width=2)
    draw.line([(gx, gy + 20), (gx, gy + 160)], fill=_hex(C["navy"]), width=2)
    pts = []
    for i in range(cw - 100):
        t = i / max(cw - 101, 1)
        v = 0.15 * math.sin(t * 12) + 0.08 * t
        pts.append((gx + i, gy + 140 - int(v * 100)))
    if len(pts) > 1:
        draw.line(pts, fill=_hex(C["teal"]), width=2)
    draw_label(draw, "Δ 느린 변화 · 관리기준 이내", (cx + cw // 2, cy + ch - 24), load_font(14), fill=C["green"])

    draw_label(draw, "이벤트·kHz 파형 아님 — 상시·정기 모니터링", (W // 2, 620), load_font(16), fill=C["gray"])
    for i, line in enumerate(["센서 → 로거(주기 스캔) → 서버 → 트렌드", "제조사·모델명 인쇄 금지"]):
        draw_label(draw, f"· {line}", (W // 2, 880 + i * 32), load_font(15), fill=C["gray"])


def render_img095(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "실시간·이벤트 계측 모드 토폴로지", (W // 2, 48), font_title)
    draw_label(draw, "트리거 이벤트 · 고속 DAQ · Pre/Post 버퍼 · impulse 파형", (W // 2, 88), load_font(18), fill=C["gray"])

    triggers = [("발파·진동", "임계 초과"), ("교통·충격", "PPV"), ("지진·이벤트", "외부 트리거")]
    ty = 260
    for i, (t1, t2) in enumerate(triggers):
        yy = ty + i * 100
        draw.rounded_rectangle([80, yy, 280, yy + 72], fill=_hex(C["white"]), outline=_hex(C["orange"]), width=2)
        draw_label(draw, t1, (180, yy + 24), load_font(15, bold=True))
        draw_label(draw, t2, (180, yy + 48), load_font(13), fill=C["gray"])
        draw_arrow(draw, 280, yy + 36, 340, 380, width=2)

    draw.rounded_rectangle([340, 300, 620, 480], fill=_hex("#EDF3FF"), outline=_hex(C["teal"]), width=3)
    draw_label(draw, "동적 DAQ", (480, 340), load_font(22, bold=True))
    draw_label(draw, "kHz · 동시 샘플링", (480, 378), load_font(16), fill=C["teal"])
    draw_label(draw, "IEPE · 트리거 DI", (480, 410), load_font(14), fill=C["gray"])

    draw_arrow(draw, 620, 390, 680, 390, width=3)
    draw.rounded_rectangle([680, 330, 880, 450], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "Pre/Post 버퍼", (780, 370), load_font(17, bold=True))
    draw_label(draw, "이더넷 스트림", (780, 400), load_font(14), fill=C["gray"])

    draw_arrow(draw, 880, 390, 940, 390, width=3)
    wx, wy = 940, 280
    draw.rounded_rectangle([wx, wy, wx + 420, wy + 260], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "impulse 파형 · FFT · PPV", (wx + 210, wy + 28), load_font(18, bold=True))
    gx, gy = wx + 30, wy + 60
    draw.line([(gx, gy + 150), (gx + 360, gy + 150)], fill=_hex(C["navy"]), width=2)
    pts = [(gx, gy + 100)]
    for i in range(1, 50):
        t = i / 49
        x = gx + int(360 * t)
        y = gy + 100 - int(90 * math.exp(-((t - 0.12) ** 2) / 0.0015))
        pts.append((x, y))
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i + 1]], fill=_hex(C["red"]), width=3)
    draw_label(draw, "PC·NAS 저장", (wx + 210, wy + 230), load_font(14), fill=C["gray"])

    draw_label(draw, "상시(분~시간) 스캔과 구분 — 이벤트 중심 고속 취득", (W // 2, 600), load_font(16), fill=C["orange"])
    draw_label(draw, "· 정적 로거 주기 스캔 ≠ 실시간 파형", (W // 2, 880), load_font(15), fill=C["gray"])


def render_img102(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "경보·알림 상태 제어 흐름도", (W // 2, 48), font_title)
    draw_label(draw, "Caution · Warning · Action → 경광등 · SMS · 담당자", (W // 2, 88), load_font(18), fill=C["gray"])

    # Status ladder
    for i, (name, col) in enumerate([("정상", C["green"]), ("주의", C["orange"]), ("경고", C["orange"]), ("위험", C["red"])]):
        bx = 100 + i * 100
        draw.rounded_rectangle([bx, 200, bx + 80, 236], fill=_hex(col), outline=_hex(C["navy"]), width=1)
        fc = C["white"] if col != C["orange"] else C["navy"]
        draw_label(draw, name, (bx + 40, 218), load_font(14, bold=True), fill=fc)

    cx, cy, cw, ch = 120, 300, 560, 320
    draw.rounded_rectangle([cx, cy, cx + cw, cy + ch], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "시계열 · 관리기준 대비", (cx + cw // 2, cy + 24), load_font(18, bold=True))
    gx, gy = cx + 40, cy + 60
    draw.line([(gx, gy + 200), (gx + cw - 80, gy + 200)], fill=_hex(C["navy"]), width=2)
    draw.line([(gx, gy + 20), (gx, gy + 200)], fill=_hex(C["navy"]), width=2)

    thresholds = [
        (gy + 160, C["green"], "Caution"),
        (gy + 120, C["orange"], "Warning"),
        (gy + 80, C["red"], "Action"),
    ]
    for y, col, lab in thresholds:
        draw.line([(gx, y), (gx + cw - 80, y)], fill=_hex(col), width=2)
        draw_label(draw, lab, (gx + cw - 50, y), load_font(12, bold=True), fill=col, anchor="lm")

    pts = [(gx + 10, gy + 170)]
    for i in range(1, 40):
        t = i / 39
        x = gx + 10 + int((cw - 100) * t)
        y = gy + 170 - int(100 * (t**1.8))
        pts.append((x, y))
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i + 1]], fill=_hex(C["navy"]), width=2)

    draw_arrow(draw, cx + cw, cy + 120, 760, 340, width=3)
    draw.rounded_rectangle([760, 280, 1020, 400], fill=_hex(C["light"]), outline=_hex(C["red"]), width=2)
    draw_label(draw, "현장 경광등·사이렌", (890, 330), load_font(18, bold=True))
    draw_label(draw, "Action 단계 연동", (890, 360), load_font(14), fill=C["red"])

    draw_arrow(draw, cx + cw, cy + 220, 760, 500, width=3)
    _flow_box(draw, 760, 440, 320, 150, "SMS · Push · 이메일", ["서버 알림", "담당자·감독 통보", "이벤트 로그"])

    draw.rounded_rectangle([1120, 300, 1780, 560], outline=_hex(C["teal"]), width=2)
    draw_label(draw, "운영 정책", (1450, 340), load_font(20, bold=True))
    for i, line in enumerate(["임계값 = 설계·관리계획서", "Ack·해제·재발 방지", "경보 ≠ 자동 공정 중단"]):
        draw_label(draw, f"· {line}", (1140, 390 + i * 40), load_font(16), anchor="lm", fill=C["gray"])
