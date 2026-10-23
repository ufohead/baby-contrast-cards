# 黑白卡圖庫 · Baby Contrast Cards

168 張**原創**高對比嬰兒黑白視覺卡，免費下載 PNG / SVG / A4 列印 PDF。
純靜態網站（HTML + CSS + 原生 JS），沒有框架、沒有後端、沒有外部依賴。

線上版本：**<https://ufohead.github.io/baby-contrast-cards/>**

參考 <https://www.blackwhitecards.top/zh-TW/cards> 的使用情境（依月齡篩選、主題瀏覽、
線上預覽、列印版面），但**所有圖案皆為本專案原創重畫**，並把原本付費的 PDF 套裝
改為完全免費。

## 特色

| 功能 | 說明 |
|---|---|
| 168 張卡片 | 14 主題 × 12 張，1024×1024 PNG + 對應 SVG 向量檔 |
| 月齡篩選 | 全部 / 0-2 / 2-4 / 3-6 個月，每張卡都有建議月齡 |
| 主題篩選 + 搜尋 | 14 個主題 chip，支援關鍵字搜尋卡名 |
| 放大檢視 | 點圖片開啟大卡模式，← → 切換、Esc 關閉 |
| 列印版面 | 4 / 6 / 9 版、裁切線、A4 / Letter，預覽後直接列印或另存 PDF |
| 勾選列印 | 卡片上「+ 列印」加入清單，底部工具列可隨時排版 |
| 打包下載 | 「下載篩選結果」在瀏覽器端即時打包 ZIP（原生實作，無外部套件） |
| 預先打包 | 14 個主題 ZIP、14 個主題 A4 PDF、完整 A4 PDF（28 頁）、全站 ZIP |
| 離線可用 | 純前端、無 analytics、無字型依賴、無追蹤 |

## 14 個主題

幾何圖形・追視線條・動物輪廓・表情臉孔・生活用品・交通工具・水果食物・
天氣自然・海洋世界・農場動物・太空世界・數量點數・對稱花紋・身體部位

## 目錄結構

```
baby-contrast-cards/
├── docs/                ← 網站根目錄（GitHub Pages 來源：main 分支 /docs）
│   ├── index.html
│   ├── assets/{style.css, app.js}
│   ├── cards/<theme>/*.svg *.png      168 張 1024px PNG + 向量原始檔
│   ├── thumbs/<theme>/*.png           320px 網格縮圖
│   ├── data/cards.json                卡片 metadata
│   └── downloads/                     ZIP + A4 PDF（30 個檔案）
├── scripts/             ← 圖卡產生器（純程式化繪圖，無外部素材）
│   ├── lib-draw.mjs      SVG 繪圖工具（幾何、弧線、螺旋、正弦波…）
│   ├── lib-cards.mjs     168 張圖案的定義（14 主題）
│   ├── generate-cards.mjs 產生 SVG + docs/data/cards.json
│   ├── svg-to-png.py     SVG → 1024px PNG + 320px 縮圖 + 總覽圖
│   └── build-downloads.py 打包 ZIP 與 A4 PDF
├── LICENSE
└── README.md
```

## 重新產生內容

```bash
node scripts/generate-cards.mjs      # 產生 SVG + manifest
python3 scripts/svg-to-png.py        # 轉 PNG / 縮圖 / 總覽圖
python3 scripts/build-downloads.py   # 打包 ZIP + PDF
```

依賴：`node`（僅產生階段）、`python3` + `cairosvg` + `Pillow`（轉檔與打包階段）。
網站本身不需要任何執行環境。

## 本機預覽

```bash
cd docs && python3 -m http.server 8765
# 開 http://127.0.0.1:8765/
```

> 直接雙擊 `docs/index.html` 也能開啟頁面與瀏覽卡片，但「打包下載篩選結果」需要
> 透過 http(s) 伺服器才能運作（瀏覽器的同源限制）。

## GitHub Pages

網站透過 `main` 分支的 `/docs` 目錄發佈（Settings → Pages → Source: Deploy from a
branch → `main` / `/docs`）。`.nojekyll` 用來跳過 Jekyll 處理，直接以靜態檔案發佈。
更新網站只要重新產生內容並 push，GitHub 會自動重新部署。

## 授權與聲明

- 卡片圖案由本專案原創創作，以 **CC0** 釋出，可自由列印、使用、改作與分享（含商業用途）。
- 網站內容僅供親子互動參考，**不是醫療器材**，不能用來判斷嬰幼兒的視力或發展狀況。
