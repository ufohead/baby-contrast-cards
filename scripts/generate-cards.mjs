// 產生 168 張原創黑白卡 SVG + 網站用的 manifest
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEMES } from './lib-cards.mjs';
import { SIZE } from './lib-draw.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public');

const AGE_LABEL = { '0-2': '0-2 個月', '2-4': '2-4 個月', '3-6': '3-6 個月' };

const ageOf = (i) => (i < 4 ? '0-2' : i < 8 ? '2-4' : '3-6');

function svgDoc(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" role="img">
  <rect width="${SIZE}" height="${SIZE}" fill="#ffffff"/>
  ${body}
</svg>
`;
}

const cards = [];
let n = 0;

for (const theme of THEMES) {
  const dir = path.join(OUT, 'cards', theme.slug);
  fs.mkdirSync(dir, { recursive: true });

  theme.cards.forEach((card, i) => {
    const id = `${theme.slug}-${String(i + 1).padStart(2, '0')}`;
    const age = ageOf(i);
    const body = card.draw();
    fs.writeFileSync(path.join(dir, `${id}.svg`), svgDoc(body), 'utf8');
    n++;
    cards.push({
      id,
      theme: theme.slug,
      themeLabel: theme.label,
      themeDesc: theme.desc,
      ageNote: theme.ageNote,
      title: `${card.title}卡`,
      motif: card.title,
      desc: `${card.title}高對比黑白圖卡，適合${AGE_LABEL[age]}寶寶短時間觀看，做視覺刺激與注視練習。`,
      age,
      ageLabel: AGE_LABEL[age],
      svg: `cards/${theme.slug}/${id}.svg`,
      png: `cards/${theme.slug}/${id}.png`,
      thumb: `thumbs/${theme.slug}/${id}.png`,
      order: n,
    });
  });
}

fs.mkdirSync(path.join(OUT, 'data'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'data', 'cards.json'), JSON.stringify({ generated: new Date().toISOString(), total: cards.length, themes: THEMES.map((t) => ({ slug: t.slug, label: t.label, desc: t.desc, ageNote: t.ageNote, count: t.cards.length })), cards }, null, 0), 'utf8');

console.log(`✅ 產生 ${cards.length} 張 SVG → public/cards/`);
console.log(`📄 manifest → public/data/cards.json`);
