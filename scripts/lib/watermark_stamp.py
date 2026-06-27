"""WATERMARK-01 — NMTI logo stamp for engineering figures."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
BRAND_DIR = ROOT / "assets" / "images" / "brand"
WATERMARK_PNG = BRAND_DIR / "nmti-watermark.png"
WATERMARK_SVG = BRAND_DIR / "nmti-watermark.svg"

_C = {
    "blue": "#3078BC",
    "white": "#FFFFFF",
    "orange": "#F08220",
    "purple": "#6E5BAA",
    "red": "#E32636",
}


def _hex(color: str) -> tuple[int, int, int]:
    color = color.lstrip("#")
    return tuple(int(color[i : i + 2], 16) for i in (0, 2, 4))


def _font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
    ]
    for path in candidates:
        if Path(path).is_file():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def render_watermark_logo(target_width: int = 200) -> Image.Image:
    """Raster logo pill (RGBA) for overlay / asset export."""
    scale = max(1.0, target_width / 200.0)
    w = max(80, int(200 * scale))
    h = max(20, int(48 * scale))
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    pad = int(4 * scale)
    draw.rounded_rectangle([0, pad, w - 1, h - 1], radius=int(8 * scale), fill=(255, 255, 255, 184))

    cx = int(28 * scale)
    cy = int(24 * scale)
    r = int(18 * scale)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=_hex(_C["blue"]) + (255,))
    draw.ellipse(
        [cx - int(14.5 * scale), cy - int(14.5 * scale), cx + int(14.5 * scale), cy + int(14.5 * scale)],
        outline=_hex(_C["white"]) + (255,),
        width=max(1, int(2 * scale)),
    )
    n_font = _font(max(12, int(20 * scale)), bold=True)
    draw.text((cx, cy), "N", fill=_hex(_C["white"]) + (255,), font=n_font, anchor="mm")

    mt_font = _font(max(14, int(24 * scale)), bold=True)
    x = int(58 * scale)
    y = int(24 * scale)
    for ch, color in [("M", _C["orange"]), ("T", _C["orange"]), ("i", _C["purple"])]:
        bbox = draw.textbbox((0, 0), ch, font=mt_font)
        cw = bbox[2] - bbox[0]
        draw.text((x, y), ch, fill=_hex(color) + (255,), font=mt_font, anchor="lm")
        x += cw - int(2 * scale)

    dot_r = int(4.5 * scale)
    dx = int(118 * scale)
    dy = int(12 * scale)
    draw.ellipse([dx - dot_r, dy - dot_r, dx + dot_r, dy + dot_r], fill=_hex(_C["red"]) + (255,))
    return img


def ensure_watermark_asset(path: Path | None = None) -> Path:
    path = path or WATERMARK_PNG
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.is_file():
        render_watermark_logo(200).save(path, "PNG")
    return path


def stamp_watermark(
    pil_image: Image.Image,
    logo: Image.Image | None = None,
    margin_ratio: float = 0.02,
    width_ratio: float = 0.12,
    max_logo_width: int = 180,
    opacity: float = 0.78,
) -> Image.Image:
    """Return a copy with NMTI watermark at bottom-right."""
    base = pil_image.convert("RGBA")
    w, h = base.size
    if min(w, h) < 400:
        return pil_image.copy()

    margin = max(24, int(min(w, h) * margin_ratio))
    target_w = min(int(w * width_ratio), max_logo_width)

    if logo is None:
        logo = render_watermark_logo(target_w)
    else:
        ratio = target_w / logo.width
        target_h = max(1, int(logo.height * ratio))
        logo = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)

    if logo.mode != "RGBA":
        logo = logo.convert("RGBA")

    alpha = logo.split()[3]
    alpha = alpha.point(lambda p: int(p * opacity))
    logo = Image.merge("RGBA", (*logo.split()[:3], alpha))

    x = w - logo.width - margin
    y = h - logo.height - margin
    out = base.copy()
    out.alpha_composite(logo, (x, y))
    if pil_image.mode == "RGBA":
        return out
    return out.convert(pil_image.mode)


def stamp_file(path: Path, force: bool = False, manifest: dict | None = None) -> bool:
    """Stamp PNG in place. Returns True if modified."""
    import hashlib
    import json

    data = path.read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    key = str(path.relative_to(ROOT)).replace("\\", "/")

    if manifest is not None and not force:
        entry = manifest.get(key)
        if entry and entry.get("sha256") == digest and entry.get("watermarked"):
            return False

    with Image.open(path) as im:
        stamped = stamp_watermark(im)
        stamped.save(path, "PNG", optimize=True)

    if manifest is not None:
        manifest[key] = {
            "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            "watermarked": True,
        }
    return True
