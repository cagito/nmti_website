"""Field datalogger drawing helpers (Pillow). Legacy industrial style is default."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1920, 1080

C = {
    "navy": "#0B1F3A",
    "gray": "#6B7280",
    "light": "#E5E7EB",
    "teal": "#00A6A6",
    "white": "#FFFFFF",
    "green": "#16A34A",
    "orange": "#F59E0B",
    "red": "#DC2626",
    "enc": "#B8BFC6",
    "enc_dark": "#9AA3AD",
    "panel": "#D1D5DB",
}


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        Path(r"C:\Windows\Fonts\malgunbd.ttf" if bold else r"C:\Windows\Fonts\malgun.ttf"),
        Path("/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf" if bold else "/usr/share/fonts/truetype/nanum/NanumGothic.ttf"),
    ]
    for path in candidates:
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def _hex(c: str) -> tuple[int, int, int]:
    c = c.lstrip("#")
    return tuple(int(c[i : i + 2], 16) for i in (0, 2, 4))


def draw_arrow(
    draw: ImageDraw.ImageDraw,
    x1: int,
    y1: int,
    x2: int,
    y2: int,
    color: str = C["teal"],
    width: int = 3,
) -> None:
    draw.line([(x1, y1), (x2, y2)], fill=_hex(color), width=width)
    import math

    ang = math.atan2(y2 - y1, x2 - x1)
    size = 12
    p1 = (x2 - size * math.cos(ang - 0.4), y2 - size * math.sin(ang - 0.4))
    p2 = (x2 - size * math.cos(ang + 0.4), y2 - size * math.sin(ang + 0.4))
    draw.polygon([(x2, y2), p1, p2], fill=_hex(color))


def draw_label(
    draw: ImageDraw.ImageDraw,
    text: str,
    xy: tuple[int, int],
    font: ImageFont.ImageFont,
    fill: str = C["navy"],
    anchor: str = "mm",
) -> None:
    draw.text(xy, text, fill=_hex(fill), font=font, anchor=anchor)


def draw_cr1000x_front(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    w: int,
    h: int,
    *,
    label: str = "데이터로거",
    font: ImageFont.ImageFont | None = None,
    show_label: bool = True,
) -> tuple[int, int, int, int]:
    """Draw CR1000X-style wiring panel. Returns bbox."""
    font = font or load_font(18)
    draw.rounded_rectangle([x, y, x + w, y + h], radius=6, fill=_hex(C["enc"]), outline=_hex(C["navy"]), width=2)
    pad = max(6, w // 30)
    px, py = x + pad, y + pad
    pw, ph = w - 2 * pad, h - 2 * pad
    draw.rectangle([px, py, px + pw, py + ph], fill=_hex(C["panel"]), outline=_hex(C["gray"]), width=1)

    # 12V power port
    pr = max(8, h // 12)
    draw.ellipse([px + 4, py + ph // 2 - pr, px + 4 + 2 * pr, py + ph // 2 + pr], fill=_hex(C["green"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "12V", (px + 4 + pr, py + ph // 2 + pr + 14), load_font(max(10, h // 18)), anchor="mm")
    draw_label(draw, "POWER", (px + 4 + pr, py + ph // 2 - pr - 10), load_font(max(9, h // 20)), anchor="mm", fill=C["gray"])

    # Status LED
    draw.ellipse([px + pw - 20, py + 8, px + pw - 8, py + 20], fill=_hex(C["teal"]), outline=_hex(C["navy"]), width=1)
    draw_label(draw, "STAT", (px + pw - 14, py + 28), load_font(max(8, h // 22)), anchor="mm", fill=C["gray"])

    # Terminal blocks (3 rows x 8 cols)
    tx0 = px + 2 * pr + 16
    ty0 = py + 10
    tw = (px + pw - tx0 - 8) // 8
    th = (ph - 24) // 3
    for row in range(3):
        for col in range(8):
            bx = tx0 + col * tw
            by = ty0 + row * th
            draw.rectangle([bx + 2, by + 2, bx + tw - 2, by + th - 4], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=1)
            ch = row * 8 + col + 1
            if tw > 18:
                draw_label(draw, str(ch), (bx + tw // 2, by + th // 2 - 2), load_font(max(9, th // 3)), anchor="mm")

    # Row labels (H/L/GND hint)
    draw_label(draw, "H", (tx0 - 10, ty0 + th // 2), load_font(max(9, th // 3)), anchor="rm", fill=C["gray"])
    draw_label(draw, "L", (tx0 - 10, ty0 + th + th // 2), load_font(max(9, th // 3)), anchor="rm", fill=C["gray"])
    draw_label(draw, "GND", (tx0 - 10, ty0 + 2 * th + th // 2), load_font(max(9, th // 3)), anchor="rm", fill=C["gray"])

    if show_label:
        draw_label(draw, label, (x + w // 2, y + h + 18), font, anchor="mm")

    return (x, y, x + w, y + h)


def draw_legacy_datalogger_front(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    w: int,
    h: int,
    *,
    label: str = "데이터로거",
    font: ImageFont.ImageFont | None = None,
    show_label: bool = True,
) -> tuple[int, int, int, int]:
    """Industrial rack-style field logger (pre-CR1000X Figure style)."""
    font = font or load_font(18)
    body = _hex(C["enc"])
    draw.rounded_rectangle([x, y, x + w, y + h], radius=4, fill=body, outline=_hex(C["navy"]), width=2)

    # Side handles
    hw = max(6, w // 18)
    draw.rectangle([x + 4, y + h // 5, x + 4 + hw, y + 4 * h // 5], fill=_hex(C["enc_dark"]), outline=_hex(C["navy"]), width=1)
    draw.rectangle([x + w - 4 - hw, y + h // 5, x + w - 4, y + 4 * h // 5], fill=_hex(C["enc_dark"]), outline=_hex(C["navy"]), width=1)

    ix = x + hw + 12
    iw = w - 2 * hw - 24
    iy = y + 10
    ih = h - 20

    # LCD
    lcd_w, lcd_h = int(iw * 0.35), int(ih * 0.28)
    draw.rectangle([ix, iy, ix + lcd_w, iy + lcd_h], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=1)
    draw.line([(ix + 6, iy + lcd_h - 8), (ix + lcd_w - 6, iy + lcd_h - 8)], fill=_hex(C["teal"]), width=2)

    # Dial
    cx, cy = ix + int(iw * 0.62), iy + lcd_h // 2
    r = min(lcd_h // 2, int(iw * 0.12))
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=_hex(C["navy"]), width=2)
    draw.line([(cx, cy), (cx + r - 4, cy - 2)], fill=_hex(C["navy"]), width=2)

    # Buttons
    bx = ix + lcd_w + 8
    for i in range(4):
        by = iy + 6 + i * (lcd_h // 4)
        draw.ellipse([bx, by, bx + 10, by + 10], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=1)

    # Bottom ports (8)
    py = y + h - max(22, h // 5)
    port_w = iw // 9
    for i in range(8):
        px = ix + i * port_w + port_w // 3
        draw.ellipse([px, py, px + 12, py + 12], fill=_hex(C["white"]), outline=_hex(C["navy"]), width=1)

    if show_label:
        draw_label(draw, label, (x + w // 2, y + h + 16), font, anchor="mm")

    return (x, y, x + w, y + h)


def draw_legacy_logger_in_enclosure(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    box_w: int,
    box_h: int,
    *,
    font: ImageFont.ImageFont | None = None,
    show_callout: bool = True,
) -> None:
    """Weatherproof enclosure with legacy industrial logger inside."""
    font = font or load_font(16)
    draw.rounded_rectangle([x, y, x + box_w, y + box_h], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw.line([(x + 8, y + 14), (x + box_w - 8, y + 14)], fill=_hex(C["gray"]), width=1)
    lw = int(box_w * 0.78)
    lh = int(box_h * 0.52)
    lx = x + (box_w - lw) // 2
    ly = y + (box_h - lh) // 2 + 6
    draw_legacy_datalogger_front(draw, lx, ly, lw, lh, show_label=False, font=load_font(max(12, lh // 8)))
    if show_callout:
        draw_label(draw, "방수 보호함", (x + box_w // 2, y - 12), font, anchor="mm")


def draw_legacy_logger_block_icon(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    w: int,
    h: int,
    *,
    title: str = "데이터로거",
    font: ImageFont.ImageFont | None = None,
) -> None:
    font = font or load_font(20, bold=True)
    draw.rounded_rectangle([x, y, x + w, y + h], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    inner_w = int(w * 0.62)
    inner_h = int(h * 0.48)
    draw_legacy_datalogger_front(
        draw,
        x + (w - inner_w) // 2,
        y + 14,
        inner_w,
        inner_h,
        show_label=False,
        font=load_font(max(10, inner_h // 6)),
    )
    draw_label(draw, title, (x + w // 2, y + h - 22), font, anchor="mm")


def draw_logger_in_enclosure(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    box_w: int,
    box_h: int,
    *,
    font: ImageFont.ImageFont | None = None,
) -> None:
    """Weatherproof field box with legacy industrial logger visible."""
    draw_legacy_logger_in_enclosure(draw, x, y, box_w, box_h, font=font)


def _draw_logger_in_enclosure_cr1000x(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    box_w: int,
    box_h: int,
    *,
    font: ImageFont.ImageFont | None = None,
) -> None:
    """Deprecated CR1000X enclosure — do not use for new figures."""
    font = font or load_font(16)
    draw.rounded_rectangle([x, y, x + box_w, y + box_h], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    draw.line([(x, y + 12), (x + box_w, y + 12)], fill=_hex(C["gray"]), width=1)
    lw = int(box_w * 0.72)
    lh = int(box_h * 0.55)
    lx = x + (box_w - lw) // 2
    ly = y + (box_h - lh) // 2 + 4
    draw_cr1000x_front(draw, lx, ly, lw, lh, font=load_font(max(12, lh // 8)))
    draw_label(draw, "방수 보호함", (x + box_w // 2, y - 12), font, anchor="mm")


def draw_logger_block_icon(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    w: int,
    h: int,
    *,
    title: str = "데이터로거",
    font: ImageFont.ImageFont | None = None,
) -> None:
    """Compact block for flow / architecture diagrams."""
    draw_legacy_logger_block_icon(draw, x, y, w, h, title=title, font=font)


def _draw_logger_block_icon_cr1000x(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    w: int,
    h: int,
    *,
    title: str = "데이터로거",
    font: ImageFont.ImageFont | None = None,
) -> None:
    """Deprecated CR1000X block icon."""
    font = font or load_font(20, bold=True)
    draw.rounded_rectangle([x, y, x + w, y + h], fill=_hex(C["light"]), outline=_hex(C["navy"]), width=2)
    inner_w = int(w * 0.55)
    inner_h = int(h * 0.45)
    draw_cr1000x_front(
        draw,
        x + (w - inner_w) // 2,
        y + 12,
        inner_w,
        inner_h,
        show_label=False,
        font=load_font(max(10, inner_h // 6)),
    )
    draw_label(draw, title, (x + w // 2, y + h - 22), font, anchor="mm")


def draw_title(draw: ImageDraw.ImageDraw, title: str, subtitle: str = "") -> None:
    draw_label(draw, title, (W // 2, 48), load_font(36, bold=True))
    if subtitle:
        draw_label(draw, subtitle, (W // 2, 88), load_font(20), fill=C["gray"])


def new_canvas() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = Image.new("RGB", (W, H), _hex(C["white"]))
    return img, ImageDraw.Draw(img)
