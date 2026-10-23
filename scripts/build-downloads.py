#!/usr/bin/env python3
"""預先打包下載檔：每主題 ZIP、全站 ZIP、A4 列印 PDF。"""
import json
import os
import zipfile
from concurrent.futures import ThreadPoolExecutor

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "docs")
DL = os.path.join(PUB, "downloads")
os.makedirs(DL, exist_ok=True)

manifest = json.load(open(os.path.join(PUB, "data", "cards.json"), encoding="utf-8"))
cards = manifest["cards"]
by_theme = {}
for c in cards:
    by_theme.setdefault(c["theme"], []).append(c)

THEME_LABEL = {t["slug"]: t["label"] for t in manifest["themes"]}

README = """嬰兒黑白視覺刺激卡（{label}）共 {n} 張
========================================
檔案說明
  png/  1024 x 1024 白底 PNG，可直接列印或插入文件
  svg/  向量原始檔，可自行放大、調整線條粗細或改配色

列印建議
  1. 列印縮放請選「實際大小 / 100%」，不要勾選「縮放以符合紙張大小」
  2. 紙張選 A4 或 Letter 皆可，啞光紙或稍厚卡紙效果最好（減少反光）
  3. 列印後沿裁切線裁開，一次拿 2-3 張輪替使用即可

使用提醒
  黑白卡是親子互動的可選素材，不是視力檢查或發展篩檢工具。
  請在寶寶清醒、平靜且有人看護時使用，轉頭或疲倦時就停止。

授權
  本頁面所有圖案皆為原創創作，開放自由使用、列印與分享（CC0）。
"""


def build_theme_zip(slug, items):
    path = os.path.join(DL, f"{slug}.zip")
    label = THEME_LABEL.get(slug, slug)
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for c in items:
            z.write(os.path.join(PUB, c["png"]), f"png/{c['id']}.png")
            z.write(os.path.join(PUB, c["svg"]), f"svg/{c['id']}.svg")
        z.writestr("說明.txt", README.format(label=label, n=len(items)))
    return path


def build_all_zip(items, name, with_svg=True):
    path = os.path.join(DL, name)
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for c in items:
            z.write(os.path.join(PUB, c["png"]), f"{c['theme']}/png/{c['id']}.png")
            if with_svg:
                z.write(os.path.join(PUB, c["svg"]), f"{c['theme']}/svg/{c['id']}.svg")
        z.writestr("說明.txt", README.format(label="全部 14 個主題", n=len(items)))
    return path


# ---------------------------------------------------------------- A4 PDF
DPI = 150
A4 = (int(8.27 * DPI), int(11.69 * DPI))
LETTER = (int(8.5 * DPI), int(11 * DPI))


def dashed_rect(draw, box, dash=18, gap=12, width=2):
    x0, y0, x1, y1 = box
    for (ax, ay, bx, by) in ((x0, y0, x1, y0), (x0, y1, x1, y1), (x0, y0, x0, y1), (x1, y0, x1, y1)):
        length = abs(bx - ax) + abs(by - ay)
        if length == 0:
            continue
        dx, dy = (bx - ax) / length, (by - ay) / length
        pos = 0.0
        while pos < length:
            end = min(pos + dash, length)
            draw.line([(ax + dx * pos, ay + dy * pos), (ax + dx * end, ay + dy * end)], fill=(190, 190, 190), width=width)
            pos = end + gap


def build_pdf(items, out_path, cols=2, rows=3, paper=A4, cutlines=True, label=""):
    page_w, page_h = paper
    margin = 46
    gap = 14
    cell_w = (page_w - margin * 2 - gap * (cols - 1)) // cols
    cell_h = (page_h - margin * 2 - gap * (rows - 1)) // rows
    pages = []
    per_page = cols * rows

    for start in range(0, len(items), per_page):
        chunk = items[start:start + per_page]
        page = Image.new("RGB", paper, "white")
        draw = ImageDraw.Draw(page)
        for i, c in enumerate(chunk):
            col, row = i % cols, i // cols
            x = margin + col * (cell_w + gap)
            y = margin + row * (cell_h + gap)
            with Image.open(os.path.join(PUB, c["png"])) as im:
                im = im.convert("RGB")
                ratio = min((cell_w - 24) / im.width, (cell_h - 24) / im.height)
                size = (int(im.width * ratio), int(im.height * ratio))
                im = im.resize(size, Image.LANCZOS)
                page.paste(im, (x + (cell_w - size[0]) // 2, y + (cell_h - size[1]) // 2))
            if cutlines:
                dashed_rect(draw, (x, y, x + cell_w, y + cell_h))
        draw.text((margin, page_h - 30), f"{label}  {start // per_page + 1} / {(len(items) + per_page - 1) // per_page}", fill=(120, 120, 120))
        pages.append(page)

    pages[0].save(out_path, "PDF", resolution=DPI, save_all=True, append_images=pages[1:])
    return out_path


jobs = []
with ThreadPoolExecutor(max_workers=6) as ex:
    for slug, items in by_theme.items():
        jobs.append(ex.submit(build_theme_zip, slug, items))
        jobs.append(ex.submit(build_pdf, items, os.path.join(DL, f"{slug}-A4.pdf"), 2, 3, A4, True, THEME_LABEL.get(slug, slug)))
    jobs.append(ex.submit(build_all_zip, cards, "all-png-svg.zip", True))
    jobs.append(ex.submit(build_pdf, cards, os.path.join(DL, "all-A4.pdf"), 2, 3, A4, True, "全部主題"))

for j in jobs:
    j.result()

total = 0
for f in sorted(os.listdir(DL)):
    total += os.path.getsize(os.path.join(DL, f))
print(f"✅ 下載包完成：{len(os.listdir(DL))} 個檔案，共 {total / 1024 / 1024:.1f} MB → docs/downloads/")
for f in sorted(os.listdir(DL)):
    print(f"   - {f}  ({os.path.getsize(os.path.join(DL, f)) / 1024 / 1024:.2f} MB)")
