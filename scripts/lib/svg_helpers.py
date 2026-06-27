"""Minimal SVG XML helpers for technology figure generation."""
from __future__ import annotations

import html
import math
from typing import Iterable

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
    "water": "#93C5FD",
}

FONT = "'Malgun Gothic','Noto Sans KR',sans-serif"


def esc(text: str) -> str:
    return html.escape(text, quote=True)


def svg_open(*, view_box: str = f"0 0 {W} {H}", width: int = W, height: int = H) -> str:
    return (
        f'<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="{view_box}" width="{width}" height="{height}" '
        f'font-family="{FONT}">\n'
    )


def svg_close() -> str:
    return "</svg>\n"


def g_open(id_: str | None = None, transform: str | None = None) -> str:
    attrs = []
    if id_:
        attrs.append(f'id="{esc(id_)}"')
    if transform:
        attrs.append(f'transform="{transform}"')
    return f"<g {' '.join(attrs)}>\n" if attrs else "<g>\n"


def g_close() -> str:
    return "</g>\n"


def rect(x: float, y: float, w: float, h: float, **kw) -> str:
    return _tag("rect", x=x, y=y, width=w, height=h, **kw)


def line(x1: float, y1: float, x2: float, y2: float, **kw) -> str:
    return _tag("line", x1=x1, y1=y1, x2=x2, y2=y2, **kw)


def polyline(points: Iterable[tuple[float, float]], **kw) -> str:
    pts = " ".join(f"{x},{y}" for x, y in points)
    return _tag("polyline", points=pts, **kw)


def polygon(points: Iterable[tuple[float, float]], **kw) -> str:
    pts = " ".join(f"{x},{y}" for x, y in points)
    return _tag("polygon", points=pts, **kw)


def circle(cx: float, cy: float, r: float, **kw) -> str:
    return _tag("circle", cx=cx, cy=cy, r=r, **kw)


def ellipse(cx: float, cy: float, rx: float, ry: float, **kw) -> str:
    return _tag("ellipse", cx=cx, cy=cy, rx=rx, ry=ry, **kw)


def text(
    x: float,
    y: float,
    content: str,
    *,
    size: float = 14,
    fill: str = C["navy"],
    anchor: str = "middle",
    weight: str | None = None,
) -> str:
    style = f"font-size:{size}px"
    if weight:
        style += f";font-weight:{weight}"
    return (
        f'<text x="{x}" y="{y}" fill="{fill}" text-anchor="{anchor}" '
        f'dominant-baseline="middle" style="{style}">{esc(content)}</text>\n'
    )


def rounded_rect(x: float, y: float, w: float, h: float, r: float = 4, **kw) -> str:
    return _tag("rect", x=x, y=y, width=w, height=h, rx=r, ry=r, **kw)


def dashed_hline(x0: float, x1: float, y: float, color: str = C["teal"], width: float = 2) -> str:
    return line(x0, y, x1, y, stroke=color, stroke_width=width, dash="14 14")


def arrow(
    x1: float,
    y1: float,
    x2: float,
    y2: float,
    *,
    color: str = C["teal"],
    width: float = 2.5,
    marker: str = "arrowTeal",
) -> str:
    return line(x1, y1, x2, y2, stroke=color, stroke_width=width, marker_end=f"url(#{marker})")


def defs_header() -> str:
    return (
        "<defs>\n"
        f'<marker id="arrowTeal" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">\n'
        f'<path d="M0,0 L9,3 L0,6 Z" fill="{C["teal"]}"/>\n'
        "</marker>\n"
        f'<marker id="arrowNavy" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">\n'
        f'<path d="M0,0 L9,3 L0,6 Z" fill="{C["navy"]}"/>\n'
        "</marker>\n"
        '<pattern id="soilHatch" patternUnits="userSpaceOnUse" width="14" height="14">\n'
        f'<rect width="14" height="14" fill="{C["white"]}"/>\n'
        f'<line x1="0" y1="7" x2="14" y2="7" stroke="#C4A574" stroke-width="1"/>\n'
        "</pattern>\n"
        '<pattern id="rockHatch" patternUnits="userSpaceOnUse" width="12" height="12">\n'
        f'<rect width="12" height="12" fill="#9CA3AF"/>\n'
        f'<line x1="0" y1="6" x2="12" y2="6" stroke="#7B8490" stroke-width="1"/>\n'
        "</pattern>\n"
        "</defs>\n"
    )


def _tag(name: str, **attrs) -> str:
    parts = []
    for key, val in attrs.items():
        if val is None:
            continue
        key = key.replace("_", "-")
        if key == "dash":
            parts.append(f'stroke-dasharray="{val}"')
        elif key == "marker-end":
            parts.append(f'marker-end="{val}"')
        elif key == "stroke-width":
            parts.append(f'stroke-width="{val}"')
        elif key == "fill":
            parts.append(f'fill="{val}"')
        elif key == "stroke":
            parts.append(f'stroke="{val}"')
        elif key == "opacity":
            parts.append(f'opacity="{val}"')
        else:
            parts.append(f'{key}="{val}"')
    return f"<{name} {' '.join(parts)}/>\n"


def sensor_marker(cx: float, cy: float, num: str, r: float = 11) -> str:
    """Numbered circle symbol for legend reference."""
    out = circle(cx, cy, r, fill=C["white"], stroke=C["teal"], stroke_width=2)
    out += text(cx, cy, num, size=13, fill=C["navy"], weight="bold")
    return out
