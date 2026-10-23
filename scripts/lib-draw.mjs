// 原創高對比黑白卡繪圖工具（純 SVG，無文字、無濾鏡，確保任何環境都一致）
export const SIZE = 1024;
export const K = '#000';

const attrs = (o = {}) =>
  Object.entries(o)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');

export const circle = (cx, cy, r, o = {}) =>
  `<circle ${attrs({ cx, cy, r, fill: o.fill ?? 'none', stroke: o.stroke ?? K, 'stroke-width': o.sw ?? 30, transform: o.transform })}/>`;

export const ellipse = (cx, cy, rx, ry, o = {}) =>
  `<ellipse ${attrs({ cx, cy, rx, ry, fill: o.fill ?? 'none', stroke: o.stroke ?? K, 'stroke-width': o.sw ?? 30, transform: o.transform })}/>`;

export const rect = (x, y, w, h, o = {}) =>
  `<rect ${attrs({ x, y, width: w, height: h, rx: o.rx, ry: o.ry, fill: o.fill ?? 'none', stroke: o.stroke ?? K, 'stroke-width': o.sw ?? 30, transform: o.transform })}/>`;

export const line = (x1, y1, x2, y2, o = {}) =>
  `<line ${attrs({ x1, y1, x2, y2, stroke: o.stroke ?? K, 'stroke-width': o.sw ?? 30, 'stroke-linecap': o.cap ?? 'round' })}/>`;

export const path = (d, o = {}) =>
  `<path ${attrs({ d, fill: o.fill ?? 'none', stroke: o.stroke ?? K, 'stroke-width': o.sw ?? 30, 'stroke-linecap': o.cap ?? 'round', 'stroke-linejoin': 'round' })}/>`;

export const poly = (pts, o = {}) =>
  `<polygon ${attrs({ points: pts.map((p) => p.join(',')).join(' '), fill: o.fill ?? 'none', stroke: o.stroke ?? K, 'stroke-width': o.sw ?? 30, 'stroke-linejoin': 'round' })}/>`;

export const g = (body, o = {}) =>
  `<g ${attrs({ transform: o.transform, fill: o.fill, stroke: o.stroke, 'stroke-width': o.sw })}>${body}</g>`;

export const dot = (cx, cy, r = 26, fill = K) => circle(cx, cy, r, { fill, sw: 0, stroke: 'none' });

/** 正多邊形/星形點座標 */
export function starPoints(cx, cy, outer, inner, points = 5, rot = -90) {
  const out = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = ((rot + (i * 180) / points) * Math.PI) / 180;
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return out;
}

/** 貝茲曲線取點 */
export function bezier(p0, p1, p2, p3, steps = 24) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    pts.push([
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ]);
  }
  return pts;
}

export const toPath = (pts, close = false) =>
  `M ${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ')}${close ? ' Z' : ''}`;

/** 正 n 邊形 */
export function ngon(cx, cy, r, n, rot = -90) {
  return Array.from({ length: n }, (_, i) => {
    const a = ((rot + (360 / n) * i) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
}

/** 正弦波路徑 */
export function sinePath(x0, x1, y, amp, cycles, steps = 60) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push([x0 + (x1 - x0) * t, y + amp * Math.sin(2 * Math.PI * cycles * t)]);
  }
  return toPath(pts);
}

/** 阿基米德螺旋 */
export function spiralPath(cx, cy, r0, r1, turns, steps = 160) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * turns * 2 * Math.PI;
    const r = r0 + (r1 - r0) * t;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return toPath(pts);
}

/** 圓弧（SVG A 指令） */
export function arcPath(cx, cy, r, a0, a1) {
  const rad = (a) => (a * Math.PI) / 180;
  const x0 = cx + r * Math.cos(rad(a0));
  const y0 = cy + r * Math.sin(rad(a0));
  const x1 = cx + r * Math.cos(rad(a1));
  const y1 = cy + r * Math.sin(rad(a1));
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const sweep = a1 > a0 ? 1 : 0;
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} ${sweep} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

/** 圓周等分點 */
export function ring(cx, cy, r, n, startDeg = -90) {
  return Array.from({ length: n }, (_, i) => {
    const a = ((startDeg + (360 / n) * i) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
}

/** 笑臉/眼睛等小部件 */
export const smile = (cx, cy, r, sw = 30) => path(arcPath(cx, cy, r, 25, 155), { sw });
export const eye = (cx, cy, r = 34, fill = K) => circle(cx, cy, r, { fill, sw: 0, stroke: 'none' });
export const eyeOpen = (cx, cy, r = 46) =>
  circle(cx, cy, r, { fill: '#fff', sw: 24 }) + dot(cx, cy, r * 0.42);
export const eyeClosed = (cx, cy, r = 52, up = true) =>
  path(arcPath(cx, cy, r, up ? 200 : 340, up ? 340 : 20), { sw: 26 });
