#!/usr/bin/env python3
"""Measurement mode figures IMG-070~075. See docs/IMG-070_MEASUREMENT_MODES_IMAGE_PLAN.md."""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from lib.datalogger_draw import (  # noqa: E402
    C,
    W,
    _hex,
    draw_arrow,
    draw_cr1000x_front,
    draw_label,
    draw_logger_block_icon,
    draw_title,
    load_font,
    new_canvas,
)
from lib.mode_draw import (  # noqa: E402
    draw_alert_ladder,
    draw_dashed_arrow,
    draw_equipment_box,
    draw_field_record,
    draw_inclinometer_head,
    draw_local_buffer,
    draw_pyramid_layer,
    draw_schedule_chip,
    draw_zone_box,
)
from lib.power_draw import draw_solar_array  # noqa: E402

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"


def save(img: Image.Image, filename: str) -> None:
    path = OUT / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    SOURCE.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, SOURCE / filename)
    print(f"Wrote {path}")


def render_070() -> None:
    img, draw = new_canvas()
    draw_title(draw, "수동 계측 개념도", "현장 방문 · 휴대 장비 · 현장 기록")

    draw_inclinometer_head(draw, 220, 420)
    draw_equipment_box(draw, 520, 360, 150, 90, "리드아웃기", "지중경사계")
    draw_equipment_box(draw, 520, 470, 150, 90, "수준기", "침하·변위")
    draw_equipment_box(draw, 520, 580, 150, 90, "광파기", "3D 변위")
    draw_field_record(draw, 980, 380, 280, 200)

    draw_arrow(draw, 260, 420, 520, 405)
    draw_arrow(draw, 260, 420, 520, 515)
    draw_arrow(draw, 670, 450, 980, 450)
    draw_arrow(draw, 670, 515, 980, 470)
    draw_arrow(draw, 670, 625, 980, 520)

    draw.rounded_rectangle([1200, 360, 1780, 500], fill=_hex(C["white"]), outline=_hex(C["teal"]), width=2)
    draw_label(draw, "KCS 계측 빈도", (1210, 392), load_font(18, bold=True), anchor="lm")
    for i, line in enumerate(["수동계측 표 기준", "위험 시 빈도 상향", "데이터로거·서버 없음"]):
        draw_label(draw, f"• {line}", (1210, 428 + i * 32), load_font(16), anchor="lm")

    save(img, "IMG-070_수동-계측-개념도_현장방문리드아웃기록.png")


def render_071() -> None:
    img, draw = new_canvas()
    draw_title(draw, "자동 계측 개념도", "센서 · 데이터로거 · 현장 저장 · 수집 주기")

    sensors = [("지중경사계", 100, 380), ("하중계", 100, 480), ("지하수위계", 100, 580)]
    for name, sx, sy in sensors:
        draw_equipment_box(draw, sx, sy, 140, 70, name)
        draw_arrow(draw, sx + 140, sy + 35, 380, 480)

    draw_cr1000x_front(draw, 380, 400, 420, 175, font=load_font(20, bold=True))
    draw_local_buffer(draw, 900, 400, 260, 180)
    draw_schedule_chip(draw, 900, 600)
    draw_arrow(draw, 800, 490, 900, 490)

    draw_solar_array(draw, 1220, 520, cols=1, rows=1, module_w=60, module_h=38)
    draw_label(draw, "전원", (1280, 620), load_font(15), fill=C["gray"])
    draw_label(draw, "필터·경보(현장)", (520, 620), load_font(16), fill=C["teal"])

    draw_dashed_arrow(draw, 1180, 490, 1320, 490)
    draw_label(draw, "통신(선택)", (1250, 470), load_font(14), fill=C["gray"])

    draw.rounded_rectangle([1340, 380, 1780, 480], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "측정자 방문 없이", (1360, 412), load_font(17, bold=True), anchor="lm")
    draw_label(draw, "연속·주기 수집", (1360, 448), load_font(16), anchor="lm")

    save(img, "IMG-071_자동-계측-개념도_로거현장저장주기.png")


def render_072() -> None:
    img, draw = new_canvas()
    draw_title(draw, "원격 자동계측 개념도", "현장 자동 수집 + 통신 · 서버 · 원격 모니터링")

    draw_zone_box(draw, 60, 220, 820, 620, "현장")
    draw_equipment_box(draw, 120, 400, 140, 80, "센서")
    draw_cr1000x_front(draw, 300, 360, 280, 130, font=load_font(17, bold=True))
    draw_equipment_box(draw, 620, 400, 120, 80, "LTE", "통신")

    draw_arrow(draw, 260, 440, 300, 425)
    draw_arrow(draw, 580, 425, 620, 440)

    draw_zone_box(draw, 960, 220, 900, 620, "원격")
    blocks = [
        ("서버", 1020, 380, 120, 80),
        ("DB", 1160, 380, 100, 80),
        ("웹", 1300, 340, 110, 70),
        ("모바일", 1300, 430, 110, 70),
        ("경보 SMS", 1460, 380, 130, 80),
    ]
    for title, bx, by, bw, bh in blocks:
        draw_equipment_box(draw, bx, by, bw, bh, title)

    draw_arrow(draw, 880, 440, 960, 440)
    draw_arrow(draw, 1140, 420, 1160, 420)
    draw_arrow(draw, 1260, 420, 1300, 375)
    draw_arrow(draw, 1260, 420, 1300, 465)
    draw_arrow(draw, 1410, 420, 1460, 420)

    draw_label(draw, "원격 모니터링 · 가용성", (960, 680), load_font(18), fill=C["teal"])

    save(img, "IMG-072_원격-자동계측-개념도_현장통신서버모니터링.png")


def render_073() -> None:
    img, draw = new_canvas()
    draw_title(draw, "스마트 계측 개념도", "플랫폼 · 단계별 경보 · 자동 보고 · 이벤트 로그")

    draw_zone_box(draw, 80, 180, 1760, 280, "운영 플랫폼")
    draw_equipment_box(draw, 140, 260, 200, 90, "관리기준", "센서별 설정")
    draw_alert_ladder(draw, 400, 280)
    draw_equipment_box(draw, 720, 260, 180, 90, "자동 보고서", "PDF·엑셀")
    draw_equipment_box(draw, 940, 260, 180, 90, "이벤트 로그", "조치 이력")
    draw_equipment_box(draw, 1160, 260, 200, 90, "담당자 알림", "단계별")

    draw_zone_box(draw, 80, 520, 1760, 320, "데이터 파이프라인")
    draw_equipment_box(draw, 140, 620, 120, 70, "센서")
    draw_logger_block_icon(draw, 300, 600, 160, 100, font=load_font(16, bold=True))
    draw_equipment_box(draw, 500, 620, 100, 70, "LTE")
    draw_equipment_box(draw, 640, 620, 100, 70, "서버")
    draw_equipment_box(draw, 780, 620, 100, 70, "DB")
    draw_equipment_box(draw, 920, 620, 120, 70, "대시보드")

    for x1, x2 in [(260, 300), (460, 500), (600, 640), (740, 780), (880, 920)]:
        draw_arrow(draw, x1, 655, x2, 655)

    draw_label(draw, "원격 자동계측 + 운영 자동화", (960, 880), load_font(18), fill=C["gray"])

    save(img, "IMG-073_스마트-계측-개념도_플랫폼경보보고로그.png")


def render_074() -> None:
    img, draw = new_canvas()
    draw_title(draw, "AI 계측 개념도", "이상탐지 · 예측 · 품질 — 보조 의사결정 (HITL)")

    draw.rounded_rectangle([80, 340, 480, 720], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "다채널 시계열", (280, 370), load_font(18, bold=True))
    gx, gy = 120, 420
    draw.line([(gx, gy + 200), (gx + 320, gy + 200)], fill=_hex(C["gray"]), width=1)
    draw.line([(gx, gy), (gx, gy + 200)], fill=_hex(C["gray"]), width=1)
    for off, col in [(0, C["teal"]), (40, C["navy"]), (80, C["orange"])]:
        draw.line(
            [(gx, gy + 200), (gx + 60, gy + 140 + off), (gx + 200, gy + 100 + off), (gx + 320, gy + 160 + off)],
            fill=_hex(col),
            width=2,
        )

    draw.rounded_rectangle([540, 320, 1020, 740], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "분석 엔진", (780, 350), load_font(20, bold=True))
    for i, name in enumerate(["이상탐지", "추세·예측", "센서 품질", "경보 우선순위"]):
        draw_equipment_box(draw, 580, 400 + i * 82, 380, 64, name)

    draw.rounded_rectangle([1080, 340, 1840, 720], outline=_hex(C["teal"]), width=2)
    draw_label(draw, "HITL 검토", (1460, 370), load_font(18, bold=True))
    draw_equipment_box(draw, 1120, 420, 200, 80, "검토·승인", "계측책임자")
    draw_equipment_box(draw, 1360, 420, 200, 80, "경보·보고", "플랫폼 연동")
    draw_equipment_box(draw, 1600, 420, 200, 80, "현장 확인", "교차 검증")

    draw_arrow(draw, 480, 530, 540, 530)
    draw_arrow(draw, 1020, 530, 1080, 530)

    draw_label(draw, "KDS·KCS 관리기준 대체 아님 — 보조 의사결정", (960, 780), load_font(17), fill=C["red"])

    save(img, "IMG-074_AI-계측-개념도_이상탐지예측HITL.png")


def render_075() -> None:
    img, draw = new_canvas()
    draw_title(draw, "계측 방식 5단계 계층도", "하위 방식이 상위에 포함 · 능력 누적")

    cx = 560
    layers = [
        (320, "수동 계측", "+ 현장 방문·KCS 빈도", C["light"]),
        (260, "자동 계측", "+ 데이터로거·주기 수집", "#DDE8F0"),
        (200, "원격 자동계측", "+ 통신·서버·원격 모니터링", "#C5D9E8"),
        (140, "스마트 계측", "+ 경보·보고·플랫폼", "#A8C8E0"),
        (80, "AI 계측", "+ ML·예측·이상탐지", C["teal"]),
    ]
    y = 620
    for half_w, label, sub, fill in layers:
        draw_pyramid_layer(draw, cx, y - 100, half_w, 100, label, sub, fill=fill)
        y -= 100

    draw.rounded_rectangle([1100, 280, 1820, 720], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "포함 관계", (1140, 320), load_font(20, bold=True), anchor="lm")
    rows = [
        "수동 → 기준·검증·저빈도",
        "자동 → 연속 현장 수집",
        "원격 → 사무실·다현장 모니터링",
        "스마트 → 운영·경보·보고 자동화",
        "AI → 데이터 기반 보조 분석",
    ]
    for i, line in enumerate(rows):
        draw_label(draw, f"{i + 1}. {line}", (1140, 360 + i * 48), load_font(16), anchor="lm")

    save(img, "IMG-075_계측-방식-5단계-계층도_수동자동원격스마트AI.png")


RENDERERS = {
    "070": render_070,
    "071": render_071,
    "072": render_072,
    "073": render_073,
    "074": render_074,
    "075": render_075,
}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--id", choices=list(RENDERERS.keys()) + ["all"], default="all")
    args = parser.parse_args()
    ids = list(RENDERERS.keys()) if args.id == "all" else [args.id]
    for iid in ids:
        RENDERERS[iid]()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
