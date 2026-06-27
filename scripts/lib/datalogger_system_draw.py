"""Dynamic DAQ (IMG-076) and MUX (IMG-077) concept figures."""
from __future__ import annotations

from PIL import ImageDraw

from lib.datalogger_draw import (
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


def _draw_modular_daq_chassis(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int) -> list[tuple[int, int]]:
    """Rack-style modular DAQ — distinct from field static logger. Returns slot center points."""
    draw.rounded_rectangle([x, y, x + w, y + h], fill=_hex(C["enc_dark"]), outline=_hex(C["navy"]), width=3)
    slot_w = (w - 40) // 3
    centers: list[tuple[int, int]] = []
    labels = ["AI 모듈", "DI 모듈", "COM"]
    sublabels = ["kHz·동시", "트리거", "스트림"]
    for i in range(3):
        sx = x + 20 + i * slot_w
        sw = slot_w - 12
        draw.rectangle([sx, y + 16, sx + sw, y + h - 16], fill=_hex(C["panel"]), outline=_hex(C["navy"]), width=2)
        cx = sx + sw // 2
        cy = y + h // 2
        centers.append((cx, cy))
        draw_label(draw, labels[i], (cx, cy - 14), load_font(16, bold=True))
        draw_label(draw, sublabels[i], (cx, cy + 16), load_font(13), fill=C["gray"])
        for j in range(4):
            py = y + 36 + j * ((h - 72) // 4)
            draw.ellipse([sx + 8, py, sx + 18, py + 10], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "동기 샘플링 클럭", (x + w // 2, y + h + 20), load_font(16), fill=C["gray"])
    return centers


def _draw_mini_waveform(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int) -> None:
    draw.rectangle([x, y, x + w, y + h], fill=_hex(C["white"]), outline=_hex(C["gray"]), width=1)
    pts = []
    import math

    for i in range(w - 8):
        t = i / max(w - 9, 1)
        v = math.sin(t * 18) * (0.35 + 0.55 * math.exp(-((t - 0.55) ** 2) / 0.02))
        pts.append((x + 4 + i, y + h // 2 - int(v * (h // 2 - 6))))
    if len(pts) > 1:
        draw.line(pts, fill=_hex(C["teal"]), width=2)


def render_img076() -> Image.Image:
    img, draw = new_canvas()
    draw_title(draw, "동적 데이터로거 구성도", "모듈형 DAQ · 고속 동시 샘플링 · IEPE 입력")

    daq_x, daq_y, daq_w, daq_h = 420, 290, 520, 250
    slot_centers = _draw_modular_daq_chassis(draw, daq_x, daq_y, daq_w, daq_h)
    draw_label(draw, "모듈형 DAQ", (daq_x + daq_w // 2, daq_y - 28), load_font(22, bold=True))

    ai_x = daq_x + 20 + (daq_w - 40) // 6
    di_x = slot_centers[1][0]
    sensors = [
        ("IEPE 가속도계", "CH1–2", "IEPE", 268, ai_x, daq_y + 70),
        ("IEPE 가속도계", "CH3–4", "IEPE", 368, ai_x, daq_y + 120),
        ("변형률계(동적)", "CH5–6", "브리지", 468, ai_x, daq_y + 170),
        ("마이크로폰", "CH7", "IEPE", 568, ai_x, daq_y + 220),
    ]
    sx = 88
    box_w = 210
    for name, ch, sig, sy, tx, ty in sensors:
        draw.rounded_rectangle([sx, sy, sx + box_w, sy + 58], fill=_hex(C["white"]), outline=_hex(C["teal"]), width=2)
        draw_label(draw, name, (sx + box_w // 2, sy + 18), load_font(16, bold=True))
        draw_label(draw, f"{sig} · {ch}", (sx + box_w // 2, sy + 42), load_font(13), fill=C["gray"])
        draw_arrow(draw, sx + box_w, sy + 29, tx - 24, ty, width=2)
        draw.ellipse([tx - 28, ty - 5, tx - 18, ty + 5], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)

    # External trigger → DI
    trig_y = 660
    draw.rounded_rectangle([sx, trig_y, sx + box_w, trig_y + 48], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "외부 트리거", (sx + box_w // 2, trig_y + 16), load_font(15, bold=True))
    draw_label(draw, "발파·임계", (sx + box_w // 2, trig_y + 34), load_font(12), fill=C["gray"])
    draw_arrow(draw, sx + box_w, trig_y + 24, daq_x, slot_centers[1][1], width=2)

    # COM → Ethernet
    eth_x, eth_y, eth_w, eth_h = 1020, 255, 280, 150
    draw.rounded_rectangle([eth_x, eth_y, eth_x + eth_w, eth_y + eth_h], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "이더넷", (eth_x + eth_w // 2, eth_y + 36), load_font(20, bold=True))
    draw_label(draw, "고속 LAN · 스트리밍", (eth_x + eth_w // 2, eth_y + 68), load_font(15), fill=C["gray"])
    draw_label(draw, "Pre/Post 버퍼", (eth_x + eth_w // 2, eth_y + 98), load_font(14), fill=C["gray"])
    draw_arrow(draw, daq_x + daq_w, slot_centers[2][1], eth_x, eth_y + eth_h // 2, width=3)

    pc_x, pc_y, pc_w, pc_h = 1360, 230, 340, 200
    draw.rounded_rectangle([pc_x, pc_y, pc_x + pc_w, pc_y + pc_h], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw_label(draw, "PC · NAS", (pc_x + pc_w // 2, pc_y + 32), load_font(20, bold=True))
    draw_label(draw, "원시 파형 저장", (pc_x + pc_w // 2, pc_y + 62), load_font(15), fill=C["gray"])
    draw_label(draw, "FFT · PPV · 이벤트", (pc_x + pc_w // 2, pc_y + 88), load_font(15), fill=C["gray"])
    _draw_mini_waveform(draw, pc_x + 40, pc_y + 108, pc_w - 80, 72)
    draw_arrow(draw, eth_x + eth_w, eth_y + eth_h // 2, pc_x, pc_y + pc_h // 2, width=3)

    notes = [
        "kHz급 연속 샘플링 — 정적 로거(분~시간 스캔)와 구분",
        "모든 채널 동기 — 발파·교통·지진 이벤트 분석",
        "제조사·모델명 인쇄 금지 (범용 모듈형 표현)",
    ]
    ny = 760
    for note in notes:
        draw_label(draw, "· " + note, (W // 2, ny), load_font(17), fill=C["gray"])
        ny += 34

    return img


def render_img077() -> Image.Image:
    img, draw = new_canvas()
    draw_title(draw, "멀티플렉서(MUX) 구성도", "체인 센서 · 순차 스캔 · 정적 로거 채널 확장")

    # Sensor chain (left)
    chain_x = 180
    draw_label(draw, "지중경사계 체인", (chain_x, 200), load_font(20, bold=True))
    draw_label(draw, "(깊이별 소자)", (chain_x, 232), load_font(16), fill=C["gray"])
    depths = ["10m", "15m", "20m", "25m", "30m"]
    y0 = 280
    for i, d in enumerate(depths):
        cy = y0 + i * 72
        draw.ellipse([chain_x - 10, cy - 8, chain_x + 10, cy + 8], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=2)
        draw.line([(chain_x, cy), (chain_x, cy + 56)], fill=_hex(C["teal"]), width=3)
        draw_label(draw, d, (chain_x - 50, cy), load_font(15), anchor="rm")
    draw.line([(chain_x, y0 - 20), (chain_x, y0 + len(depths) * 72)], fill=_hex(C["gray"]), width=1)
    draw_arrow(draw, chain_x + 12, y0 + 140, 520, 420)

    # VW / piezometer branch
    draw_label(draw, "VW 간극수압계 체인", (180, 640), load_font(18, bold=True))
    for i in range(3):
        cx = 160 + i * 80
        draw.rounded_rectangle([cx, 680, cx + 56, 720], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=1)
        draw_label(draw, f"P{i + 1}", (cx + 28, 700), load_font(14))
    draw_arrow(draw, 320, 700, 520, 500)

    # MUX center
    mux_x, mux_y, mux_w, mux_h = 520, 360, 200, 120
    draw.rounded_rectangle([mux_x, mux_y, mux_x + mux_w, mux_y + mux_h], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=3)
    draw_label(draw, "MUX", (mux_x + mux_w // 2, mux_y + 36), load_font(28, bold=True))
    draw_label(draw, "채널 스위치", (mux_x + mux_w // 2, mux_y + 72), load_font(16))
    draw_label(draw, "Excitation", (mux_x + mux_w // 2, mux_y + 100), load_font(15), fill=C["gray"])

    # Logger right
    lw, lh = 340, 150
    lx, ly = 900, 380
    draw_legacy_logger_block_icon(draw, lx, ly, lw, lh, font=load_font(16, bold=True))
    draw_label(draw, "정적 데이터로거", (lx + lw // 2, ly - 20), load_font(18, bold=True))
    draw_arrow(draw, mux_x + mux_w, mux_y + mux_h // 2, lx, ly + lh // 2, width=3)

    # Right panel — scan timing
    px = 1320
    draw.rounded_rectangle([px, 260, 1840, 620], outline=_hex(C["navy"]), width=2)
    draw_label(draw, "순차 스캔 설계", (1580, 300), load_font(22, bold=True))
    items = [
        "스캔 주기 = 채널 수 × 읽기 시간",
        "안정화(settling) 시간 반영",
        "Excitation · 센서 전원 순환",
        "체인 토폴로지 (허브 별선 지양)",
    ]
    iy = 360
    for item in items:
        draw.ellipse([px + 24, iy - 6, px + 36, iy + 6], fill=_hex(C["teal"]))
        draw_label(draw, item, (px + 48, iy), load_font(18), anchor="lm")
        iy += 48

    draw_label(draw, "센서 체인 → MUX → 로거", (W // 2, 820), load_font(20), fill=C["gray"])

    return img
