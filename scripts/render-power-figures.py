#!/usr/bin/env python3
"""Power system figures — IMG-047, IMG-065~069. See docs/IMG-047_POWER_SYSTEM_PLAN.md."""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from lib.datalogger_draw import (  # noqa: E402
    C,
    W,
    _hex,
    draw_arrow,
    draw_label,
    draw_legacy_logger_block_icon,
    draw_title,
    load_font,
    new_canvas,
)
from lib.mode_draw import draw_dashed_arrow, draw_zone_box  # noqa: E402
from lib.power_draw import (  # noqa: E402
    draw_ac_panel,
    draw_avr_unit,
    draw_battery_12v,
    draw_charge_controller,
    draw_fuse_dc,
    draw_ground_symbol,
    draw_load_block,
    draw_solar_array,
    draw_wind_turbine,
)

OUT = ROOT / "assets" / "images" / "technology"
SOURCE = OUT / "source"


def save(img: Image.Image, filename: str) -> None:
    path = OUT / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    SOURCE.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, SOURCE / filename)
    print(f"Wrote {path}")


def render_047() -> None:
    """태양광 DC 전원 단선도 — legacy industrial datalogger."""
    img, draw = new_canvas()
    draw_title(draw, "태양광 전원 시스템 구성도", "패널 · 충전제어 · 배터리 · DC 분배")

    draw_solar_array(draw, 80, 340, cols=2, rows=2)

    cc_x, cc_y = 520, 400
    draw_charge_controller(draw, cc_x, cc_y)

    bat_x, bat_y = 740, 395
    draw_battery_12v(draw, bat_x, bat_y)

    fuse_x, fuse_y = 900, 418
    draw_fuse_dc(draw, fuse_x, fuse_y)

    lx, ly, lw, lh = 1020, 380, 300, 140
    draw_legacy_logger_block_icon(draw, lx, ly, lw, lh, font=load_font(18, bold=True))

    # PV → controller → battery → fuse → logger
    draw_arrow(draw, 400, 450, cc_x, 455)
    draw_arrow(draw, cc_x + 160, 455, bat_x, 445)
    draw_arrow(draw, bat_x + 120, 445, fuse_x, 440)
    draw_arrow(draw, fuse_x + 70, 440, lx, ly + lh // 2)

    # DC loads below logger (no overlap)
    load_y = 580
    draw_load_block(draw, 1020, load_y, 200, 110, "부하", ["통신 모뎀", "센서 Excitation"], font_title=load_font(17, bold=True))
    draw_load_block(draw, 1260, load_y, 200, 110, "모니터링", ["배터리 전압", "PV 전압"], font_title=load_font(17, bold=True))
    draw.line([(lx + lw // 2, ly + lh), (lx + lw // 2, load_y)], fill=_hex(C["teal"]), width=2)
    draw_arrow(draw, lx + lw // 2, load_y, 1120, load_y + 20)
    draw_arrow(draw, lx + lw // 2, load_y, 1360, load_y + 20)

    draw_ground_symbol(draw, 680, 560)
    draw.line([(bat_x + 60, bat_y + 100), (bat_x + 60, 576), (688, 576)], fill=_hex(C["gray"]), width=1)

    # Design callout
    draw.rounded_rectangle([1480, 360, 1860, 560], fill=_hex(C["white"]), outline=_hex(C["teal"]), width=2)
    draw_label(draw, "설계 포인트", (1670, 392), load_font(20, bold=True))
    for i, line in enumerate(["일사량·흐림일 여유", "배터리 Ah·DoD", "과방전 보호(LOAD)"]):
        draw_label(draw, f"• {line}", (1500, 430 + i * 36), load_font(16), anchor="lm")

    draw_label(draw, "+  −  GND  12V DC", (960, 720), load_font(16), fill=C["gray"])

    save(img, "IMG-047_태양광-전원-시스템-구성도_패널컨트롤러배터리로거.png")


def render_065() -> None:
    """현장 계측 전원 통합 구성도 v2 — 주·백업·보조 경로 분리."""
    img, draw = new_canvas()
    draw_title(draw, "현장 계측 전원 통합 구성도", "무인 구간 · AC 구간 · 공용 배터리")

    # --- 무인 구간 ---
    draw_zone_box(draw, 48, 168, 700, 400, "무인 구간")
    draw_solar_array(draw, 72, 228, cols=2, rows=1, module_w=68, module_h=40)

    cc_x, cc_y = 400, 268
    draw_charge_controller(draw, cc_x, cc_y, 155, 105)
    draw_arrow(draw, 330, 318, cc_x, 318)
    draw_label(draw, "주(태양광)", (365, 292), load_font(14, bold=True), fill=C["green"])

    remote_bat_x, remote_bat_y = 600, 278
    draw_battery_12v(draw, remote_bat_x, remote_bat_y, 105, 88)
    draw_arrow(draw, cc_x + 155, 318, remote_bat_x, 322)
    draw_label(draw, "무인 배터리", (652, 392), load_font(14), fill=C["gray"])

    draw_wind_turbine(draw, 180, 430, 0.8)
    draw_dashed_arrow(draw, 230, 500, cc_x + 40, cc_y + 105)
    draw_label(draw, "보조(선택)", (260, 478), load_font(14), fill=C["gray"])

    # --- AC 구간 ---
    draw_zone_box(draw, 780, 168, 620, 300, "AC 구간")
    ac_x, ac_y = 820, 238
    draw_ac_panel(draw, ac_x, ac_y, 165, 108)
    draw_arrow(draw, ac_x + 165, ac_y + 54, ac_x + 215, ac_y + 54)
    draw_label(draw, "백업(AC)", (ac_x + 190, ac_y + 28), load_font(14, bold=True), fill=C["orange"])

    avr_x = ac_x + 215
    draw_avr_unit(draw, avr_x, ac_y + 4, 155, 100)
    draw_arrow(draw, avr_x + 155, ac_y + 54, avr_x + 200, ac_y + 54)

    ups_x = avr_x + 200
    draw.rounded_rectangle(
        [ups_x, ac_y + 22, ups_x + 128, ac_y + 92],
        fill=_hex(C["light"]),
        outline=_hex(C["navy"]),
        width=2,
    )
    draw_label(draw, "UPS/정류", (ups_x + 64, ac_y + 48), load_font(15, bold=True))
    draw_label(draw, "12V 충전", (ups_x + 64, ac_y + 72), load_font(13), fill=C["gray"])

    # --- 공용 배터리 · DC 분배 ---
    shared_x, shared_y = 760, 520
    draw_battery_12v(draw, shared_x, shared_y, 145, 115)
    draw_label(draw, "공용 배터리", (shared_x + 72, shared_y + 138), load_font(20, bold=True))

    draw_arrow(draw, remote_bat_x + 52, remote_bat_y + 88, shared_x + 36, shared_y)
    draw_label(draw, "DC 병행", (680, 460), load_font(13), fill=C["gray"])
    draw_arrow(draw, ups_x + 64, ac_y + 92, shared_x + 108, shared_y)

    fuse_x = shared_x + 200
    draw_fuse_dc(draw, fuse_x, shared_y + 38)
    dc_x = fuse_x + 88
    draw.rounded_rectangle(
        [dc_x, shared_y + 18, dc_x + 130, shared_y + 98],
        fill=_hex(C["white"]),
        outline=_hex(C["navy"]),
        width=2,
    )
    draw_label(draw, "DC 분배", (dc_x + 65, shared_y + 42), load_font(16, bold=True))
    draw_label(draw, "LVD · SPD", (dc_x + 65, shared_y + 68), load_font(13), fill=C["gray"])

    draw_arrow(draw, shared_x + 145, shared_y + 58, fuse_x, shared_y + 58)
    draw_arrow(draw, fuse_x + 70, shared_y + 58, dc_x, shared_y + 58)

    log_x = dc_x + 168
    draw_legacy_logger_block_icon(draw, log_x, shared_y - 28, 290, 155, font=load_font(18, bold=True))
    draw_arrow(draw, dc_x + 130, shared_y + 58, log_x, shared_y + 50)

    load_x = log_x + 320
    draw_load_block(
        draw,
        load_x,
        shared_y - 18,
        230,
        145,
        "DC 부하",
        ["데이터로거", "LTE 모뎀", "센서·여자"],
        font_title=load_font(17, bold=True),
    )
    draw_arrow(draw, log_x + 290, shared_y + 50, load_x, shared_y + 52)

    draw_ground_symbol(draw, shared_x + 72, shared_y + 175)
    draw.line(
        [(shared_x + 72, shared_y + 115), (shared_x + 72, shared_y + 175)],
        fill=_hex(C["navy"]),
        width=1,
    )

    draw_label(draw, "점선 = 선택 구성 (풍력·AC 병용)", (120, 600), load_font(15), fill=C["gray"])
    notes = [
        "주·백업·보조 전원 병행 — 무인 태양광 + (선택) 풍력 + 관리동 AC",
        "공용 배터리 → DC 분배·과방전 보호 → 데이터로거·통신·센서",
        "제조사·모델명 인쇄 금지 (범용 산업용 표현)",
    ]
    for i, line in enumerate(notes):
        draw_label(draw, f"· {line}", (W // 2, 900 + i * 34), load_font(15), fill=C["gray"])

    save(img, "IMG-065_현장-계측-전원-통합-구성도_태양광풍력AC배터리.png")


def render_066() -> None:
    img, draw = new_canvas()
    draw_title(draw, "상시 전원 (AC 인입)", "관리동 · 터널 전기실 · 임시 배전")

    draw_ac_panel(draw, 120, 360, 240, 160)
    draw_label(draw, "상시 전원", (240, 300), load_font(24, bold=True))
    draw_label(draw, "220V / 380V", (240, 540), load_font(18), fill=C["orange"])

    steps = [
        ("Surge 보호", 440, 380, 150, 80),
        ("누전차단", 640, 380, 150, 80),
        ("AC-DC 전원", 840, 360, 180, 100),
    ]
    for title, bx, by, bw, bh in steps:
        draw.rounded_rectangle([bx, by, bx + bw, by + bh], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
        draw_label(draw, title, (bx + bw // 2, by + bh // 2), load_font(16, bold=True))

    draw_arrow(draw, 360, 440, 440, 420)
    draw_arrow(draw, 590, 420, 640, 420)
    draw_arrow(draw, 790, 420, 840, 410)

    draw_legacy_logger_block_icon(draw, 1080, 350, 300, 145, font=load_font(18, bold=True))
    draw_arrow(draw, 1020, 410, 1100, 415)
    draw_label(draw, "12V DC", (1060, 390), load_font(15), fill=C["green"])

    draw_load_block(draw, 1100, 530, 360, 100, "적용", ["굴착 관리동", "터널 구간 AC", "AC 병용 시 안정성↑"], font_title=load_font(17, bold=True))
    draw_ground_symbol(draw, 520, 560)

    save(img, "IMG-066_상시-전원-AC-인입_배전반차단기정류.png")


def render_067() -> None:
    img, draw = new_canvas()
    draw_title(draw, "AVR 자동전압조정기", "불안정 AC → 정격 전압 안정화")

    draw.rounded_rectangle([100, 380, 280, 500], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "입력", (190, 410), load_font(18, bold=True))
    draw_label(draw, "발전기·약전압", (190, 450), load_font(15))
    draw_label(draw, "±20~30% 변동", (190, 480), load_font(14), fill=C["orange"])

    draw_arrow(draw, 280, 440, 360, 440)
    draw_avr_unit(draw, 360, 390, 200, 130)
    draw_arrow(draw, 560, 440, 640, 440)

    draw.rounded_rectangle([640, 380, 820, 500], fill=_hex(C["white"]), outline=_hex(C["green"]), width=2)
    draw_label(draw, "출력", (730, 410), load_font(18, bold=True))
    draw_label(draw, "220V ±3%", (730, 450), load_font(16), fill=C["green"])

    draw_arrow(draw, 820, 440, 900, 440)
    draw.rounded_rectangle([900, 390, 1080, 490], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "계측 함체", (990, 440), load_font(17, bold=True))

    draw_label(draw, "선택: AVR → 절연변압기 → UPS", (1300, 420), load_font(17), fill=C["gray"])
    draw_load_block(draw, 1200, 500, 320, 120, "적용", ["디젤 발전기 현장", "임시 배전", "민감 로거·통신 전단"], font_title=load_font(17, bold=True))

    save(img, "IMG-067_AVR-자동전압조정기_입력출력안정화.png")


def render_068() -> None:
    img, draw = new_canvas()
    draw_title(draw, "풍력 하이브리드 전원", "태양광 보조 · 공용 배터리")

    draw_solar_array(draw, 80, 320, cols=2, rows=1, module_w=75, module_h=45)
    draw_wind_turbine(draw, 400, 360, 1.1)
    draw_label(draw, "풍력충전제어", (560, 340), load_font(16, bold=True))
    draw_charge_controller(draw, 520, 360, 150, 100)
    draw_battery_12v(draw, 720, 355, 115, 95)
    draw_label(draw, "공용 배터리", (778, 480), load_font(17, bold=True))

    draw_arrow(draw, 350, 400, 520, 410)
    draw_arrow(draw, 450, 430, 520, 420)
    draw_arrow(draw, 670, 405, 720, 402)

    draw_legacy_logger_block_icon(draw, 900, 350, 290, 140, font=load_font(18, bold=True))
    draw_arrow(draw, 835, 402, 900, 410)

    draw_load_block(
        draw,
        1280,
        340,
        280,
        150,
        "운영 유의",
        ["지역 풍속 조사 선행", "야간·우천 보완", "마스트·견고 기초"],
        font_title=load_font(17, bold=True),
    )

    save(img, "IMG-068_풍력-하이브리드-전원_태양광풍력배터리.png")


def render_069() -> None:
    img, draw = new_canvas()
    draw_title(draw, "배터리·축전 시스템", "용량 산정 · 방전 깊이 · 종류")

    draw_battery_12v(draw, 200, 380, 160, 130)
    draw_label(draw, "AGM / Gel", (280, 530), load_font(16))

    draw_battery_12v(draw, 450, 380, 160, 130)
    draw_label(draw, "LiFePO₄", (530, 530), load_font(16), fill=C["teal"])

    draw.rounded_rectangle([720, 360, 1100, 560], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "용량 산정", (910, 390), load_font(20, bold=True))
    rows = [
        ("Ah = (자립일수 × 일일Ah) ÷ DoD", 430),
        ("동절기 여유 1.3~1.5배", 470),
        ("과방전·역극성 보호", 510),
    ]
    for text, yy in rows:
        draw_label(draw, f"• {text}", (740, yy), load_font(16), anchor="lm")

    draw_load_block(
        draw,
        1180,
        360,
        300,
        200,
        "원격 모니터링",
        ["전압·SOC", "충전 상태", "교체 주기"],
        font_title=load_font(17, bold=True),
    )

    draw_ground_symbol(draw, 280, 600)

    save(img, "IMG-069_배터리-축전-시스템_용량종류모니터링.png")


RENDERERS = {
    "047": render_047,
    "065": render_065,
    "066": render_066,
    "067": render_067,
    "068": render_068,
    "069": render_069,
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
