#!/usr/bin/env python3
"""把 SVG 轉成 1024px PNG + 320px 縮圖，並產生一張總覽圖方便檢查品質。"""
import io
import json
import os
import sys
from concurrent.futures import ThreadPoolExecutor

import cairosvg
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "public")
manifest = json.load(open(os.path.join(PUB, "data", "cards.json"), encoding="utf-8"))
cards = manifest["cards"]


def render(card):
    svg_path = os.path.join(PUB, card["svg"])
    png_path = os.path.join(PUB, card["png"])
    thumb_path = os.path.join(PUB, card["thumb"])
    os.makedirs(os.path.dirname(png_path), exist_ok=True)
    os.makedirs(os.path.dirname(thumb_path), exist_ok=True)

    cairosvg.svg2png(url=svg_path, write_to=png_path, output_width=1024, output_height=1024,
                     background_color="#ffffff")
    cairosvg.svg2png(url=svg_path, write_to=thumb_path, output_width=320, output_height=320,
                     background_color="#ffffff")
    return card["id"]


with ThreadPoolExecutor(max_workers=8) as ex:
    list(ex.map(render, cards))

# 總覽 contact sheet：每列一個主題
COLS, CELL, PAD = 12, 150, 8
themes = []
for c in cards:
    if c["theme"] not in themes:
        themes.append(c["theme"])
rows = len(themes)
sheet = Image.new("RGB", (COLS * (CELL + PAD) + PAD, rows * (CELL + PAD + 26) + PAD), "#f4f4f5")
draw = ImageDraw.Draw(sheet)
for r, theme in enumerate(themes):
    y = PAD + r * (CELL + PAD + 26)
    draw.text((PAD, y), theme, fill="#111")
    subset = [c for c in cards if c["theme"] == theme]
    for i, c in enumerate(subset[:COLS]):
        im = Image.open(os.path.join(PUB, c["thumb"])).convert("RGB").resize((CELL, CELL))
        sheet.paste(im, (PAD + i * (CELL + PAD), y + 22))
sheet.save(os.path.join(ROOT, "contact-sheet.png"))
print(f"✅ PNG 轉換完成：{len(cards)} 張 1024px + 320px 縮圖")
print(f"🖼  總覽圖 → {os.path.join(ROOT, 'contact-sheet.png')}")
