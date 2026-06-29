#!/usr/bin/env python3
"""DEPRECATED — Pillow datalogger overlays. Prefer AI Figure assets from source/.

Restore pre-CR1000X PNGs: python scripts/restore-pre-datalogger-pngs.py
Fix IMG-002 logger: python scripts/fix-img002-legacy-logger.py
"""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from lib.render_guard import enforce_render_policy, enforce_composite_policy  # noqa: E402
from lib.datalogger_draw import (  # noqa: E402
    C,
    W,
    H,
    _hex,
    draw_arrow,
    draw_cr1000x_front,
    draw_label,
    draw_logger_block_icon,
    draw_logger_in_enclosure,
    draw_title,
    load_font,
    new_canvas,
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


def _side_box(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int, title: str, lines: list[str]) -> None:
    draw.rounded_rectangle([x, y, x + w, y + h], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, title, (x + w // 2, y + 28), load_font(22, bold=True))
    fy = y + 56
    for line in lines:
        draw_label(draw, line, (x + 16, fy), load_font(18), anchor="lm")
        fy += 32


def render_045() -> None:
    """IMG-045 — CR1000X-type front wiring panel (see docs/IMG-045_DATALOGGER_CR1000X_PLAN.md)."""
    img, draw = new_canvas()
    draw_title(draw, "데이터로거 구성도", "센서 입력 · 전원 · 통신 · 저장")

    # Center — CR1000X-style wiring panel (~2.4:1)
    lw, lh = 600, 250
    lx, ly = (W - lw) // 2, 300
    draw_cr1000x_front(draw, lx, ly, lw, lh, font=load_font(22, bold=True))

    # Left — sensors → input terminals
    draw_label(draw, "계측 센서", (280, 180), load_font(24, bold=True))
    sensors = [
        ("지중경사계", 100, 240),
        ("하중계", 100, 320),
        ("지하수위계", 100, 400),
        ("변위계", 100, 480),
        ("균열계", 100, 560),
    ]
    term_y = ly + lh // 2
    for name, sx, sy in sensors:
        draw.rounded_rectangle([sx, sy, sx + 150, sy + 44], fill=_hex(C["white"]), outline=_hex(C["teal"]), width=2)
        draw_label(draw, name, (sx + 75, sy + 22), load_font(17))
        draw_arrow(draw, sx + 150, sy + 22, lx, term_y, width=2)
    draw_label(draw, "센서 입력", (280, 640), load_font(20), fill=C["gray"])
    draw_label(draw, "아날로그 · 디지털 채널", (280, 672), load_font(17), fill=C["gray"])

    # Right — power / comm / storage
    rx = 1310
    _side_box(
        draw,
        rx,
        200,
        290,
        120,
        "전원",
        ["12V 배터리", "태양광 충전", "AC 어댑터"],
    )
    _side_box(
        draw,
        rx,
        360,
        290,
        120,
        "통신",
        ["Ethernet / RS-485", "USB", "LTE 모뎀"],
    )
    _side_box(
        draw,
        rx,
        520,
        290,
        120,
        "저장",
        ["내장 메모리", "SD 카드 슬롯"],
    )
    mid_r = ly + lh // 2
    draw_arrow(draw, lx + lw, mid_r - 30, rx, 260, width=2)
    draw_arrow(draw, lx + lw, mid_r, rx, 420, width=2)
    draw_arrow(draw, lx + lw, mid_r + 30, rx, 580, width=2)
    draw_label(draw, "계측 데이터", (rx + 145, 680), load_font(20), fill=C["gray"])

    # Bottom — simple flow (no dashboard UI)
    draw_label(draw, "센서", (360, 800), load_font(18))
    draw_arrow(draw, 420, 820, 720, 820)
    draw_label(draw, "데이터로거", (820, 800), load_font(18))
    draw_arrow(draw, 920, 820, 1180, 820)
    draw_label(draw, "통신", (1240, 800), load_font(18))
    draw_arrow(draw, 1280, 820, 1480, 820)
    draw_label(draw, "서버", (1520, 800), load_font(18))

    save(img, "IMG-045_데이터로거-구성도_센서입력전원통신저장.png")


def render_058() -> None:
    img, draw = new_canvas()
    draw_title(draw, "통합 계측 플랫폼 아키텍처")

    # Field site box
    draw.rounded_rectangle([80, 200, 900, 880], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "현장", (120, 230), load_font(20, bold=True))

    # Cloud box
    draw.rounded_rectangle([1000, 200, 1840, 880], outline=_hex(C["gray"]), width=2)
    draw_label(draw, "서버 · 클라우드", (1040, 230), load_font(20, bold=True))

    blocks = [
        ("센서", 140, 420, 160, 140),
        ("데이터로거", 360, 400, 200, 160),
        ("통신\n(LTE)", 620, 420, 160, 140),
        ("서버", 1040, 420, 140, 120),
        ("DB", 1240, 420, 120, 120),
        ("웹", 1440, 380, 120, 100),
        ("모바일", 1440, 520, 120, 100),
    ]
    for title, bx, by, bw, bh in blocks:
        if title == "데이터로거":
            draw_logger_block_icon(draw, bx, by, bw, bh, title="데이터로거", font=load_font(18, bold=True))
        else:
            draw.rounded_rectangle([bx, by, bx + bw, by + bh], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
            draw_label(draw, title.replace("\n", " "), (bx + bw // 2, by + bh // 2), load_font(18, bold=True))

    for (x1, y1, x2, y2) in [
        (300, 490, 360, 490),
        (560, 490, 620, 490),
        (780, 490, 1040, 490),
        (1180, 490, 1240, 490),
        (1360, 430, 1440, 430),
        (1360, 570, 1440, 570),
    ]:
        draw_arrow(draw, x1, y1, x2, y2)

    save(img, "IMG-058_통합-계측-플랫폼-아키텍처_센서로거서버DB웹모바일.png")


def render_047() -> None:
    """태양광 DC 전원 — see scripts/render-power-figures.py."""
    import importlib.util

    path = ROOT / "scripts" / "render-power-figures.py"
    spec = importlib.util.spec_from_file_location("render_power_figures", path)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(mod)
    mod.render_047()


def render_048() -> None:
    from lib.platform_draw import render_img048

    img, draw = new_canvas()
    render_img048(draw, load_font(34, bold=True))
    save(img, "IMG-048_LTE-M2M-통신-구성도_센서로거모뎀서버웹모바일.png")


def render_006() -> None:
    """굴착 단계별 계측 흐름도 v3 — docs/58."""
    from lib.excavation_flow_draw import render_img006

    save(render_img006(), "IMG-006_굴착-단계별-계측-흐름도_1단계최종굴착계측.png")


def render_064() -> None:
    """Harbor & revetment monitoring overview (KDS 4.1.8)."""
    img, draw = new_canvas()
    draw_title(draw, "항만·호안 계측 전체 개념도", "Harbor structure and surrounding ground monitoring (KDS 4.1.8)")

    sea_blue = "#BEE3F8"
    soil1, soil2 = "#E8D4B8", "#C4A574"

    # Ground / seabed baseline
    ground_y = 720
    draw.rectangle([60, ground_y, 1340, 900], fill=_hex(soil1))
    draw.rectangle([60, ground_y + 80, 1340, 900], fill=_hex(soil2))

    # Sea (right)
    draw.rectangle([980, 480, 1340, ground_y], fill=_hex(sea_blue))
    draw.polygon([(980, ground_y), (1340, ground_y), (1340, 900), (1100, 900), (980, ground_y)], fill=_hex(sea_blue))

    # Rubble mound (사석마운드)
    draw.polygon([(980, ground_y), (1180, ground_y), (1050, 620), (980, 650)], fill=_hex(C["gray"]), outline=_hex(C["navy"]))

    # Caisson / quay wall (center)
    draw.rectangle([620, 380, 980, ground_y], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)
    draw_label(draw, "케이슨·안벽", (800, 360), load_font(20, bold=True))

    # Land fill (left)
    draw.polygon([(60, ground_y), (620, ground_y), (620, 380), (200, 420), (60, ground_y)], fill=_hex(soil1), outline=_hex(C["navy"]))
    draw_label(draw, "육측 (뒤채움)", (280, 500), load_font(18), fill=C["gray"])
    draw_label(draw, "해측 (바다)", (1150, 520), load_font(18), fill=C["navy"])

    # G.W.L & tide lines
    gwl_y = 580
    draw.line([(120, gwl_y), (600, gwl_y)], fill=_hex(C["teal"]), width=1)
    for gx in range(120, 600, 16):
        draw.line([(gx, gwl_y), (gx + 8, gwl_y)], fill=_hex(C["teal"]), width=2)
    draw_label(draw, "G.W.L", (610, gwl_y - 12), load_font(14), anchor="rm")

    tide_y = 520
    draw.line([(980, tide_y), (1320, tide_y)], fill=_hex(C["navy"]), width=2)
    for tx in range(980, 1320, 16):
        draw.line([(tx, tide_y), (tx + 8, tide_y)], fill=_hex(C["navy"]), width=2)
    draw_label(draw, "조위선", (1320, tide_y - 12), load_font(14), anchor="rm")

    # Sensors — land side
    draw.line([(180, ground_y), (180, 620)], fill=_hex(C["teal"]), width=4)
    draw_label(draw, "지중경사계", (180, 600), load_font(15), fill=C["teal"])
    draw.ellipse([160, ground_y - 12, 184, ground_y + 12], fill=_hex(C["teal"]), outline=_hex(C["navy"]))
    draw_label(draw, "지표침하계", (200, ground_y - 24), load_font(14))

    draw.line([(320, ground_y), (320, 640)], fill=_hex(C["gray"]), width=3)
    draw.ellipse([308, 640, 332, 664], fill=_hex(C["white"]), outline=_hex(C["navy"]))
    draw_label(draw, "지하수위계", (340, 650), load_font(14))

    draw.line([(420, ground_y), (420, 660)], fill=_hex(C["gray"]), width=3)
    draw_label(draw, "간극수압계", (440, 670), load_font(14))

    # Structure sensors
    draw.rounded_rectangle([700, 420, 740, 460], fill=_hex(C["teal"]), outline=_hex(C["navy"]))
    draw_label(draw, "변위계", (770, 440), load_font(14))
    draw.rounded_rectangle([650, 400, 670, 480], fill=_hex(C["teal"]), outline=_hex(C["navy"]))
    draw_label(draw, "구조물경사계", (560, 430), load_font(13), anchor="rm")
    draw.rounded_rectangle([720, ground_y - 20, 760, ground_y], fill=_hex(C["teal"]), outline=_hex(C["navy"]))
    draw_label(draw, "반력계", (780, ground_y - 10), load_font(14))

    # Seaward inclinometer
    draw.line([(1200, ground_y), (1200, 680)], fill=_hex(C["teal"]), width=4)
    draw_label(draw, "해측 지중경사계", (1220, 700), load_font(14))

    # Tide gauge
    draw.line([(1280, tide_y), (1280, ground_y - 40)], fill=_hex(C["navy"]), width=2)
    draw.rectangle([1268, tide_y - 8, 1292, tide_y + 8], fill=_hex(C["teal"]), outline=_hex(C["navy"]))
    draw_label(draw, "조위계", (1290, tide_y - 24), load_font(14))

    # CR1000X datalogger — land surface
    draw_logger_in_enclosure(draw, 450, ground_y - 120, 170, 105, font=load_font(14))

    # Right panel
    px = 1420
    draw.rounded_rectangle([px, 160, 1860, 880], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "항만·호안 계측 항목", (1640, 200), load_font(22, bold=True))
    items = [
        "구조물 변위·경사·반력",
        "육측·해측 지반 침하",
        "지중경사·층별침하",
        "조위·지하수·간극수압",
        "데이터로거 (자동수집)",
    ]
    iy = 260
    for item in items:
        draw.ellipse([px + 24, iy - 6, px + 36, iy + 6], fill=_hex(C["teal"]))
        draw_label(draw, item, (px + 48, iy), load_font(18), anchor="lm")
        iy += 48

    save(img, "IMG-064_항만-호안-계측-전체-개념도_케이슨옹벽주변지반.png")


def _patch_and_draw_logger(
    draw: ImageDraw.ImageDraw,
    img: Image.Image,
    px: int,
    py: int,
    pw: int,
    ph: int,
    *,
    enclosure: bool = True,
) -> None:
    from lib.datalogger_draw import draw_legacy_datalogger_front, draw_legacy_logger_in_enclosure

    draw.rectangle([px - 15, py - 25, px + pw + 25, py + ph + 35], fill=_hex(C["white"]))
    font = load_font(max(12, img.height // 80))
    if enclosure:
        draw_legacy_logger_in_enclosure(draw, px, py, pw, ph, font=font)
    else:
        draw_legacy_datalogger_front(draw, px, py, pw, ph, font=font)


def composite_image(src_name: str, px_ratio: float, py_ratio: float, pw_ratio: float, ph_ratio: float, *, enclosure: bool = True, force: bool = False) -> None:
    enforce_composite_policy(src_name, force=force)
    path = OUT / src_name
    if not path.exists():
        raise FileNotFoundError(path)
    img = Image.open(path).convert("RGB")
    draw = ImageDraw.Draw(img)
    w, h = img.size
    px, py = int(w * px_ratio), int(h * py_ratio)
    pw, ph = int(w * pw_ratio), int(h * ph_ratio)
    _patch_and_draw_logger(draw, img, px, py, pw, ph, enclosure=enclosure)
    save(img, src_name)


def composite_002(*, force: bool = False) -> None:
    composite_image("IMG-002_흙막이-계측-설치-대표-단면도.png", 0.48, 0.52, 0.11, 0.14, force=force)


def composite_001(*, force: bool = False) -> None:
    composite_image("IMG-001_가시설-계측-전체-개념도_굴착단면계측항목.png", 0.44, 0.55, 0.10, 0.12, force=force)


def composite_025(*, force: bool = False) -> None:
    composite_image("IMG-025_지중경사계-시스템-구성도_ProbeCableReadoutCasing.png", 0.20, 0.14, 0.12, 0.11, force=force)


def composite_008(*, force: bool = False) -> None:
    composite_image("IMG-008_터널-전단면-내공변위-측정시스템_상부아치내공변위.png", 0.56, 0.68, 0.10, 0.08, enclosure=False, force=force)


def composite_003(*, force: bool = False) -> None:
    composite_image("IMG-003_버팀보-하중계-설치-개념도_띠장접합부축압축.png", 0.78, 0.22, 0.09, 0.07, enclosure=False, force=force)


COMPOSITES = {
    "001": composite_001,
    "002": composite_002,
    "003": composite_003,
    "025": composite_025,
    "008": composite_008,
}


RENDERERS = {
    "045": render_045,
    "047": render_047,
    "048": render_048,
    "058": render_058,
    "006": render_006,
    "064": render_064,
}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--id", choices=list(RENDERERS.keys()) + ["all"], default="all")
    parser.add_argument("--composite", choices=list(COMPOSITES.keys()) + ["all"])
    parser.add_argument("--composite-002", action="store_true", help=argparse.SUPPRESS)
    parser.add_argument("--force-legacy-pillow", action="store_true", help="Override FT-A/B pillow block (emergency)")
    args = parser.parse_args()

    if args.composite_002:
        enforce_render_policy(["002"], force=args.force_legacy_pillow)
        composite_002(force=args.force_legacy_pillow)
        return 0

    if args.composite:
        ids = list(COMPOSITES.keys()) if args.composite == "all" else [args.composite]
        enforce_render_policy(ids, force=args.force_legacy_pillow)
        for iid in ids:
            COMPOSITES[iid](force=args.force_legacy_pillow)
        return 0

    ids = list(RENDERERS.keys()) if args.id == "all" else [args.id]
    enforce_render_policy(ids, force=args.force_legacy_pillow)
    for iid in ids:
        RENDERERS[iid]()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
