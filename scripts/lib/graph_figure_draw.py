"""FT-C graph / process figures IMG-049~055, 057, 059 (Pillow)."""
from __future__ import annotations

import math

from PIL import ImageDraw, ImageFont

from .datalogger_draw import C, W, _hex, draw_arrow, draw_label, load_font
from .mode_draw import draw_alert_ladder, draw_dashed_arrow


def _chart_axes(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    w: int,
    h: int,
    *,
    xlabel: str,
    ylabel: str,
) -> tuple[int, int, int, int]:
    """Return inner plot area (x0, y0, x1, y1)."""
    draw.rounded_rectangle([x, y, x + w, y + h], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    ix, iy = x + 56, y + 36
    iw, ih = w - 80, h - 72
    draw.line([(ix, iy + ih), (ix + iw, iy + ih)], fill=_hex(C["navy"]), width=2)
    draw.line([(ix, iy), (ix, iy + ih)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, xlabel, (ix + iw // 2, y + h - 18), load_font(14), fill=C["gray"])
    draw_label(draw, ylabel, (x + 18, iy + ih // 2), load_font(14), fill=C["gray"], anchor="lm")
    return ix, iy, ix + iw, iy + ih


def _hline(draw: ImageDraw.ImageDraw, x0: int, x1: int, y: int, color: str, label: str) -> None:
    draw.line([(x0, y), (x1, y)], fill=_hex(color), width=2)
    draw_label(draw, label, (x1 + 8, y), load_font(12, bold=True), fill=color, anchor="lm")


def render_img049(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "변위 그래프 예시", (W // 2, 48), font_title)
    draw_label(draw, "시계열 · 방향·상대변위 · 관리기준 · 변위속도", (W // 2, 88), load_font(18), fill=C["gray"])

    x0, y0, x1, y1 = _chart_axes(draw, 120, 160, 980, 520, xlabel="경과 시간 (일)", ylabel="변위 (mm)")
    _hline(draw, x0, x1, y0 + 120, C["green"], "Caution")
    _hline(draw, x0, x1, y0 + 80, C["orange"], "Warning")
    _hline(draw, x0, x1, y0 + 40, C["red"], "Action")

    pts = []
    for i in range(x1 - x0):
        t = i / max(x1 - x0 - 1, 1)
        v = 0.12 * t + 0.04 * math.sin(t * 14)
        pts.append((x0 + i, y1 - int(v * (y1 - y0))))
    if len(pts) > 1:
        draw.line(pts, fill=_hex(C["teal"]), width=3)

    draw.rounded_rectangle([1160, 200, 1780, 480], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "해석 포인트", (1470, 240), load_font(20, bold=True))
    for i, line in enumerate(
        ["기준점·부동점 안정성", "ΔX·ΔY·ΔZ 분리", "속도·가속도 추세", "현장별 관리기준 적용"]
    ):
        draw_label(draw, f"· {line}", (1180, 290 + i * 40), load_font(16), anchor="lm", fill=C["gray"])


def render_img050(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "침하 그래프 예시", (W // 2, 48), font_title)
    draw_label(draw, "시간–침하 · 측정·예측 분리 · 성토단계 · 잔류침하", (W // 2, 88), load_font(18), fill=C["gray"])

    x0, y0, x1, y1 = _chart_axes(draw, 120, 160, 980, 520, xlabel="시간 (log t)", ylabel="침하 S (mm)")
    pts = []
    for i in range(x1 - x0):
        t = (i + 1) / max(x1 - x0, 1)
        s = 80 * (1 - math.exp(-3.5 * t))
        pts.append((x0 + i, y1 - int(s * (y1 - y0) / 90)))
    if len(pts) > 1:
        draw.line(pts, fill=_hex(C["teal"]), width=3)

    # predicted dashed extension
    draw_dashed_arrow(draw, pts[-1][0], pts[-1][1], x1 - 20, y1 - int(0.92 * (y1 - y0)), )
    draw_label(draw, "예측(해석)", (x1 - 100, y0 + 30), load_font(14), fill=C["gray"])

    for i, lab in enumerate(["1차 성토", "2차 성토", "잔류"]):
        vx = x0 + 120 + i * 220
        draw.line([(vx, y0), (vx, y1)], fill=_hex(C["light"]), width=1)
        draw_label(draw, lab, (vx, y0 - 8), load_font(12), fill=C["orange"])

    draw_label(draw, "침하판·연장봉 ≠ 기준점", (W // 2, 720), load_font(16), fill=C["orange"])


def render_img051(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "간극수압 소산 그래프", (W // 2, 48), font_title)
    draw_label(draw, "Δu · 초기 정수압 · 성토단계별 소산", (W // 2, 88), load_font(18), fill=C["gray"])

    x0, y0, x1, y1 = _chart_axes(draw, 120, 160, 900, 520, xlabel="경과 시간 (일)", ylabel="간극수압 u (kPa)")
    colors = [C["teal"], C["navy"], C["orange"]]
    for si, col in enumerate(colors):
        pts = []
        u0 = 0.75 - si * 0.12
        for i in range(x1 - x0):
            t = i / max(x1 - x0 - 1, 1)
            u = u0 * math.exp(-2.2 * t * (1 + si * 0.3))
            pts.append((x0 + i, y1 - int(u * (y1 - y0))))
        if len(pts) > 1:
            draw.line(pts, fill=_hex(col), width=2)
        draw_label(draw, f"성토 {si + 1}단", (x1 + 20, y0 + 40 + si * 36), load_font(14), fill=col, anchor="lm")

    draw.rounded_rectangle([1100, 200, 1780, 500], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "u₀ 정수압 · Δu 구분", (1440, 240), load_font(18, bold=True))
    draw_label(draw, "소산 곡선만으로 압밀 완료 단정 금지", (1440, 400), load_font(15), fill=C["gray"])


def render_img052(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "하중 변화 그래프", (W // 2, 48), font_title)
    draw_label(draw, "버팀보 축력 · 단계별 설계값 · 프리로드", (W // 2, 88), load_font(18), fill=C["gray"])

    x0, y0, x1, y1 = _chart_axes(draw, 120, 160, 980, 520, xlabel="굴착 단계", ylabel="축력 (kN)")
    stages = [0.2, 0.35, 0.55, 0.72, 0.88]
    design = [0.65, 0.7, 0.78, 0.85, 0.92]
    px = [x0 + int((x1 - x0) * s) for s in stages]
    py = [y1 - int(0.55 * (y1 - y0)), y1 - int(0.62 * (y1 - y0)), y1 - int(0.7 * (y1 - y0)), y1 - int(0.78 * (y1 - y0)), y1 - int(0.82 * (y1 - y0))]
    for i in range(len(px) - 1):
        draw.line([(px[i], py[i]), (px[i + 1], py[i + 1])], fill=_hex(C["teal"]), width=3)
    for i, s in enumerate(stages):
        dy = y1 - int(design[i] * (y1 - y0))
        draw.line([(x0, dy), (x1, dy)], fill=_hex(C["orange"]), width=1)
    draw_label(draw, "설계 축력(단계별)", (x1 - 40, y0 + 20), load_font(12), fill=C["orange"])
    _hline(draw, x0, x1, y0 + 50, C["red"], "경보")


def render_img053(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "진동 계측 그래프", (W // 2, 48), font_title)
    draw_label(draw, "PPV · 3축 · 이벤트 시간축 · 기준선", (W // 2, 88), load_font(18), fill=C["gray"])

    x0, y0, x1, y1 = _chart_axes(draw, 120, 160, 780, 420, xlabel="시간 (s)", ylabel="PPV (mm/s)")
    _hline(draw, x0, x1, y0 + 60, C["orange"], "주의")
    _hline(draw, x0, x1, y0 + 30, C["red"], "제한")

    pts = [(x0, y1 - 80)]
    for i in range(1, 120):
        t = i / 119
        v = math.exp(-((t - 0.25) ** 2) / 0.002) * 0.9 + 0.05 * math.sin(t * 40)
        pts.append((x0 + int((x1 - x0) * t), y1 - 80 - int(v * (y1 - y0 - 100))))
    draw.line(pts, fill=_hex(C["teal"]), width=2)

    draw.rounded_rectangle([980, 180, 1780, 520], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "이벤트 메타", (1380, 220), load_font(20, bold=True))
    for i, line in enumerate(["Z·Radial·Transverse", "지속시간·주파수", "가속도≠속도 단위 혼동 금지"]):
        draw_label(draw, f"· {line}", (1000, 280 + i * 44), load_font(16), anchor="lm", fill=C["gray"])


def render_img054(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "경보 단계 프로세스", (W // 2, 48), font_title)
    draw_label(draw, "QC 선행 · 결측·센서이상 구분 · 현장 확인 · 해제", (W // 2, 88), load_font(18), fill=C["gray"])

    draw_alert_ladder(draw, 200, 220)
    steps = [
        (520, 240, "데이터 QC", "결측·이상 플래그"),
        (820, 240, "관리기준 비교", "주의·경고·위험"),
        (1120, 240, "현장 확인", "엔지니어 Ack"),
        (1420, 240, "조치·해제", "로그·재발 방지"),
    ]
    for x, y, title, sub in steps:
        draw.rounded_rectangle([x, y, x + 240, y + 100], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
        draw_label(draw, title, (x + 120, y + 36), load_font(17, bold=True))
        draw_label(draw, sub, (x + 120, y + 68), load_font(14), fill=C["gray"])
    for i in range(len(steps) - 1):
        draw_arrow(draw, steps[i][0] + 240, steps[i][1] + 50, steps[i + 1][0], steps[i + 1][1] + 50, width=3)

    draw.rounded_rectangle([520, 420, 1660, 560], outline=_hex(C["red"]), width=2)
    draw_label(draw, "금지: 위험 → 자동 조치완료 · 결측=초과 혼동", (1090, 490), load_font(16), fill=C["red"])


def render_img055(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "모바일 경보 알림 화면", (W // 2, 48), font_title)
    draw_label(draw, "상태 · 지속 · 추세 · 조치 로그", (W // 2, 88), load_font(18), fill=C["gray"])

    px, py, pw, ph = 720, 200, 480, 720
    draw.rounded_rectangle([px, py, px + pw, py + ph], fill=_hex(C["navy"]), width=8)
    draw.rounded_rectangle([px + 24, py + 80, px + pw - 24, py + ph - 24], fill=_hex(C["white"]), outline=_hex(C["gray"]), width=1)

    draw.rounded_rectangle([px + 48, py + 120, px + pw - 48, py + 280], fill=_hex("#FFF4F4"), outline=_hex(C["red"]), width=2)
    draw_label(draw, "경고 — STR-03", (px + pw // 2, py + 160), load_font(20, bold=True), fill=C["red"])
    draw_label(draw, "버팀보 축력 92% (설계 대비)", (px + pw // 2, py + 200), load_font(15))
    draw_label(draw, "지속 2.5h · 상승 추세", (px + pw // 2, py + 232), load_font(14), fill=C["gray"])

    draw.rounded_rectangle([px + 48, py + 300, px + pw - 48, py + 420], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "조치 이력", (px + pw // 2, py + 328), load_font(16, bold=True))
    draw_label(draw, "14:20 현장 확인 요청", (px + 72, py + 360), load_font(14), anchor="lm")
    draw_label(draw, "통신: 정상 · 센서: OK", (px + 72, py + 388), load_font(13), anchor="lm", fill=C["green"])

    draw_label(draw, "색상만으로 조치 완료 암시 금지", (W // 2, 960), load_font(15), fill=C["gray"])


def render_img057(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "자동 보고서 생성 흐름도", (W // 2, 48), font_title)
    draw_label(draw, "계측 DB · QC · 템플릿 · PDF · 배포", (W // 2, 88), load_font(18), fill=C["gray"])

    boxes = [
        (120, 360, "계측 DB", "시계열·이벤트"),
        (400, 360, "QC·플래그", "결측·이상"),
        (680, 360, "보고 템플릿", "그래프·표"),
        (960, 360, "PDF 생성", "일·주·월"),
        (1240, 360, "배포", "이메일·포털"),
    ]
    for i, (bx, by, t, s) in enumerate(boxes):
        draw.rounded_rectangle([bx, by, bx + 220, by + 110], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
        draw_label(draw, t, (bx + 110, by + 40), load_font(18, bold=True))
        draw_label(draw, s, (bx + 110, by + 72), load_font(14), fill=C["gray"])
        if i < len(boxes) - 1:
            draw_arrow(draw, bx + 220, by + 55, boxes[i + 1][0], by + 55, width=3)

    draw.rounded_rectangle([1400, 280, 1820, 560], outline=_hex(C["teal"]), width=2)
    draw_label(draw, "포함 항목", (1610, 320), load_font(18, bold=True))
    for i, line in enumerate(["원본·보정 구분", "관리기준 대비", "경보·조치 로그"]):
        draw_label(draw, f"· {line}", (1420, 370 + i * 40), load_font(15), anchor="lm", fill=C["gray"])


def render_img059(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "관리기준 설정 개념도", (W // 2, 48), font_title)
    draw_label(draw, "센서별 임계 · 단계 · 출처 · 경보 조건", (W // 2, 88), load_font(18), fill=C["gray"])

    draw.rounded_rectangle([140, 200, 720, 780], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "센서 목록", (430, 240), load_font(20, bold=True))
    sensors = ["INC-01 지중경사", "STR-03 버팀보", "WL-02 지하수위", "LD-04 침하"]
    for i, name in enumerate(sensors):
        yy = 300 + i * 90
        fill = C["teal"] if i == 1 else C["light"]
        draw.rounded_rectangle([180, yy, 680, yy + 64], fill=_hex(fill), outline=_hex(C["navy"]), width=1)
        draw_label(draw, name, (430, yy + 32), load_font(16, bold=True))

    draw.rounded_rectangle([800, 200, 1780, 780], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "STR-03 축력 기준 (예)", (1290, 240), load_font(20, bold=True))
    rows = [
        ("정상", "< 70% 설계", C["green"]),
        ("주의", "70~85%", C["orange"]),
        ("경고", "85~95%", C["orange"]),
        ("위험", "≥ 95%", C["red"]),
    ]
    for i, (stage, val, col) in enumerate(rows):
        yy = 310 + i * 90
        draw.rounded_rectangle([860, yy, 1040, yy + 56], fill=_hex(col), outline=_hex(C["navy"]), width=1)
        fc = C["white"] if col != C["orange"] else C["navy"]
        draw_label(draw, stage, (950, yy + 28), load_font(16, bold=True), fill=fc)
        draw_label(draw, val, (1100, yy + 28), load_font(16), anchor="lm")
        draw_label(draw, "출처: 설계·관리계획서", (1400, yy + 28), load_font(14), fill=C["gray"], anchor="lm")

    draw_label(draw, "모든 센서 동일 로직·임의 수치 금지", (W // 2, 860), load_font(16), fill=C["orange"])


def render_img018(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "강우-지하수위-변위 상관도", (W // 2, 48), font_title)
    draw_label(draw, "시계열 병렬 비교 · 지연·상관은 현장별 해석", (W // 2, 88), load_font(18), fill=C["gray"])

    panels = [
        (120, 160, "강우량 (mm/h)", C["teal"], "bar"),
        (120, 400, "지하수위 GL (m)", C["navy"], "level"),
        (120, 640, "변위 (mm)", C["orange"], "disp"),
    ]
    for x, y, title, col, kind in panels:
        x0, y0, x1, y1 = _chart_axes(draw, x, y, 1040, 200, xlabel="시간 (일)", ylabel="")
        draw_label(draw, title, (x + 20, y + 12), load_font(16, bold=True), anchor="lm", fill=col)
        if kind == "bar":
            for i in range(0, x1 - x0, 28):
                h = int(40 + 30 * math.sin(i / 40))
                draw.rectangle([x0 + i, y1 - h, x0 + i + 18, y1], fill=_hex(col))
        elif kind == "level":
            pts = []
            for i in range(x1 - x0):
                t = i / max(x1 - x0 - 1, 1)
                v = 0.3 + 0.25 * (1 - math.exp(-t * 3))
                pts.append((x0 + i, y1 - int(v * (y1 - y0))))
            draw.line(pts, fill=_hex(col), width=3)
        else:
            pts = []
            for i in range(x1 - x0):
                t = i / max(x1 - x0 - 1, 1)
                v = 0.08 * t + 0.03 * max(0, t - 0.35)
                pts.append((x0 + i, y1 - int(v * (y1 - y0))))
            draw.line(pts, fill=_hex(col), width=3)

    draw.rounded_rectangle([1200, 200, 1820, 720], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "해석 주의", (1510, 240), load_font(20, bold=True))
    notes = [
        "상관계수·시차는 참고 지표",
        "고정 지연(예: 24h) 일반화 금지",
        "강우→수위→변위 단일 인과 단정 금지",
        "배수·투수·구조 재하 병행 검토",
    ]
    for i, line in enumerate(notes):
        draw_label(draw, f"· {line}", (1220, 300 + i * 48), load_font(16), anchor="lm", fill=C["gray"])


def render_img029(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "센서형 다단식 지중경사계 데이터 해석도", (W // 2, 48), font_title)
    draw_label(draw, "Incremental / Cumulative · 활동면은 해석 추정", (W // 2, 88), load_font(18), fill=C["gray"])

    # depth profile (horizontal bars)
    draw.rounded_rectangle([120, 160, 880, 780], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "심도별 누적 변위 (Cumulative)", (500, 200), load_font(18, bold=True))
    depths = [2, 4, 6, 8, 10, 12, 14, 16]
    cum = [2, 5, 9, 14, 18, 20, 21, 21]
    for i, (d, v) in enumerate(zip(depths, cum)):
        yy = 260 + i * 58
        draw_label(draw, f"−{d}m", (150, yy + 18), load_font(13), anchor="lm", fill=C["gray"])
        draw.rectangle([200, yy, 200 + int(v * 22), yy + 32], fill=_hex(C["teal"]))
        draw_label(draw, f"{v} mm", (200 + int(v * 22) + 12, yy + 16), load_font(12), anchor="lm")

    # activity zone — not at max bar
    act_y = 260 + 4 * 58
    draw.rectangle([680, act_y - 8, 840, act_y + 40], outline=_hex(C["orange"]), width=2)
    draw_label(draw, "활동면\n(해석)", (760, act_y + 16), load_font(13, bold=True), fill=C["orange"])

    draw.rounded_rectangle([960, 160, 1780, 780], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "심도별 증분 변위 (Incremental)", (1370, 200), load_font(18, bold=True))
    inc = [1, 2, 3, 4, 3, 2, 1, 0]
    for i, (d, v) in enumerate(zip(depths, inc)):
        yy = 260 + i * 58
        draw.rectangle([1040, yy, 1040 + int(v * 28), yy + 32], fill=_hex(C["navy"]))
        draw_label(draw, f"Δ {v} mm", (1040 + int(v * 28) + 12, yy + 16), load_font(12), anchor="lm")

    draw_label(draw, "최대 변위 심도 ≠ 활동면 자동 확정", (W // 2, 860), load_font(16), fill=C["orange"])


def render_img044(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    draw_label(draw, "기상계측기 구성도", (W // 2, 48), font_title)
    draw_label(draw, "설치 높이·이격 · 강우·풍·온습도·기압", (W // 2, 88), load_font(18), fill=C["gray"])

    mast_x, ground_y = 520, 720
    draw.line([(mast_x, ground_y), (mast_x, 180)], fill=_hex(C["navy"]), width=6)
    draw.line([(mast_x - 120, ground_y), (mast_x + 120, ground_y)], fill=_hex(C["gray"]), width=3)
    draw_label(draw, "지표면 (GL)", (mast_x + 140, ground_y), load_font(14), anchor="lm")

    sensors = [
        (220, "강우량계", "+0.5 m", C["teal"]),
        (300, "풍향·풍속계", "+2.0 m (이격)", C["navy"]),
        (420, "온·습도 (방사보호)", "+1.2 m", C["orange"]),
        (520, "기압계 (함체 내)", "+1.0 m", C["gray"]),
    ]
    for y, name, hlab, col in sensors:
        draw.ellipse([mast_x - 28, y - 14, mast_x + 28, y + 14], fill=_hex(C["light"]), outline=_hex(col), width=2)
        draw.line([(mast_x + 32, y), (mast_x + 100, y)], fill=_hex(col), width=2)
        draw_label(draw, name, (mast_x + 108, y - 8), load_font(15, bold=True), anchor="lm", fill=col)
        draw_label(draw, hlab, (mast_x + 108, y + 14), load_font(13), anchor="lm", fill=C["gray"])

    draw.rounded_rectangle([980, 200, 1780, 760], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "설치·연계", (1380, 240), load_font(20, bold=True))
    for i, line in enumerate(
        [
            "장애물·굴착면 이격 확보",
            "데이터로거 함체에 기록",
            "기상-변위 상관은 참고 (인과 단정 금지)",
            "KDS·관리계획서 설치 기준 준수",
        ]
    ):
        draw_label(draw, f"· {line}", (1000, 300 + i * 52), load_font(16), anchor="lm", fill=C["gray"])


def render_img046(draw: ImageDraw.ImageDraw, font_title: ImageFont.ImageFont) -> None:
    from .datalogger_draw import draw_legacy_logger_block_icon

    draw_label(draw, "IoT 게이트웨이 구성도", (W // 2, 48), font_title)
    draw_label(draw, "센서 → 로거(저장) → GW(중계·버퍼) → 서버", (W // 2, 88), load_font(18), fill=C["gray"])

    draw.rounded_rectangle([100, 360, 280, 480], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "현장\n센서", (190, 420), load_font(16, bold=True))
    draw_legacy_logger_block_icon(draw, 360, 320, 200, 140, font=load_font(14, bold=True))
    draw_label(draw, "데이터로거\n(현장 저장·QC)", (460, 480), load_font(14), fill=C["navy"])

    draw.rounded_rectangle([640, 340, 860, 500], fill=_hex(C["light"]), outline=_hex(C["teal"]), width=3)
    draw_label(draw, "IoT\n게이트웨이", (750, 400), load_font(18, bold=True), fill=C["teal"])
    draw_label(draw, "통신 중계·버퍼", (750, 530), load_font(14), fill=C["gray"])

    draw.rounded_rectangle([980, 320, 1200, 520], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "LTE / M2M", (1090, 400), load_font(16, bold=True))
    draw.rounded_rectangle([1320, 300, 1560, 540], fill=_hex(C["navy"]))
    draw_label(draw, "서버·\n모니터링", (1440, 420), load_font(18, bold=True), fill=C["white"])

    for x1, x2 in [(280, 360), (560, 640), (860, 980), (1200, 1320)]:
        draw_arrow(draw, x1, 420, x2, 420, width=3)

    draw.rounded_rectangle([1320, 600, 1780, 820], outline=_hex(C["red"]), width=2)
    draw_label(draw, "GW ≠ 로거 · GW가 관리기준·경보 판정 담당 아님", (1550, 660), load_font(16), fill=C["red"])
    draw_label(draw, "로거: 시계열 저장 / GW: 전송 버퍼·프로토콜 변환", (1550, 720), load_font(15), fill=C["gray"])
