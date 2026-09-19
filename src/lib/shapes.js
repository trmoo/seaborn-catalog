/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */
// shapes.js — seaborn 함수마다 「대충 이런 모양」을 보여 주는 작은 그림 (SVG 글자)
//
// ⚠ 실제 데이터가 아니다. 모양을 보여 주려고 지어낸 숫자로 그린 도식이다.
//   데이터의 값을 담지 않는다는 이 앱의 방침을 지키려는 것이기도 하다.
// ⚠ DOM 없음 — 글자(SVG)만 만든다. 시험이 21개 모두를 그려 본다.
// 색은 CSS 의 .shape .c0 ~ .c2 로 칠한다 (seaborn 기본 색 「deep」 을 닮게).

const R1 = (n) => Math.round(n * 10) / 10;

/** 늘 같은 순서로 나오는 난수 — 그림이 새로 그릴 때마다 바뀌지 않게 */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const normal = (r) => (r() + r() + r() - 1.5) * 1.2;   // 대충 종 모양 (표준편차 약 0.6)

const AXIS = '<path class="ax" d="M16 8V88H154"/>';
const dot = (x, y, c, r) => `<circle class="c${c}" cx="${R1(x)}" cy="${R1(y)}" r="${r || 2.4}"/>`;
const rect = (x, y, w, h, c, extra) =>
  `<rect class="c${c}${extra || ''}" x="${R1(x)}" y="${R1(y)}" width="${R1(w)}" height="${R1(h)}"/>`;
const line = (pts, c, cls) => `<polyline class="${cls || 'l'}${c}" points="${pts.map((p) => R1(p[0]) + ',' + R1(p[1])).join(' ')}"/>`;
const area = (pts, c) => `<polygon class="b${c}" points="${pts.map((p) => R1(p[0]) + ',' + R1(p[1])).join(' ')}"/>`;

function scatterPts(r, cx, cy, sx, sy, n, c, rad) {
  let s = '';
  for (let i = 0; i < n; i += 1) s += dot(cx + normal(r) * sx, cy + normal(r) * sy, c, rad);
  return s;
}

const gauss = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s));

function curve(x0, x1, base, hgt, m, s, c, filled) {
  const pts = [];
  for (let x = x0; x <= x1; x += 3) pts.push([x, base - hgt * gauss(x, m, s)]);
  if (filled) return area([[x0, base], ...pts, [x1, base]], c) + line(pts, c);
  return line(pts, c);
}

function hist(x0, x1, base, hgt, m, s, n, c) {
  const w = (x1 - x0) / n;
  let out = '';
  for (let i = 0; i < n; i += 1) {
    const h = hgt * gauss(x0 + w * (i + 0.5), m, s);
    if (h > 1) out += rect(x0 + w * i + 0.5, base - h, w - 1, h, c);
  }
  return out;
}

function box(cx, base, q1, med, q3, lo, hi, w, c) {
  return `<line class="wk" x1="${cx}" y1="${base - hi}" x2="${cx}" y2="${base - q3}"/>`
    + `<line class="wk" x1="${cx}" y1="${base - q1}" x2="${cx}" y2="${base - lo}"/>`
    + rect(cx - w / 2, base - q3, w, q3 - q1, c)
    + `<line class="md" x1="${cx - w / 2}" y1="${base - med}" x2="${cx + w / 2}" y2="${base - med}"/>`;
}

function violin(cx, base, m, s, top, w, c) {
  const L = [];
  const Rt = [];
  for (let y = 0; y <= top; y += 3) {
    const half = (w / 2) * (0.15 + 0.85 * gauss(y, m, s));
    L.push([cx - half, base - y]);
    Rt.unshift([cx + half, base - y]);
  }
  return area([...L, ...Rt], c).replace('class="b', 'class="v');
}

const panel = (x0, x1) => `<path class="ax" d="M${x0} 14V88H${x1}"/>`;

// ── 함수마다 ──────────────────────────────────────────────────────
const DRAW = {
  scatterplot() {
    const r = rng(1);
    return AXIS + scatterPts(r, 48, 64, 12, 8, 14, 0) + scatterPts(r, 88, 46, 12, 8, 14, 1)
      + scatterPts(r, 126, 26, 10, 7, 12, 2);
  },
  lineplot() {
    const up = []; const dn = []; const mid = []; const mid2 = [];
    for (let x = 20; x <= 150; x += 6) {
      const y = 70 - 40 * gauss(x, 70, 22);
      const w = 5 + 4 * gauss(x, 70, 25);
      up.push([x, y - w]); dn.unshift([x, y + w]); mid.push([x, y]);
      mid2.push([x, 76 - 18 * gauss(x, 95, 26)]);
    }
    return AXIS + area([...up, ...dn], 0) + line(mid, 0) + line(mid2, 1);
  },
  relplot() {
    const r = rng(3);
    return panel(16, 80) + panel(90, 154)
      + scatterPts(r, 38, 64, 8, 7, 12, 0) + scatterPts(r, 60, 42, 7, 6, 8, 1)
      + scatterPts(r, 112, 56, 8, 8, 12, 0) + scatterPts(r, 134, 34, 7, 6, 8, 1);
  },
  histplot() { return AXIS + hist(20, 150, 88, 70, 76, 24, 13, 0); },
  kdeplot() { return AXIS + curve(18, 152, 88, 62, 60, 16, 0, true) + curve(18, 152, 88, 44, 106, 20, 1, true); },
  ecdfplot() {
    const r = rng(5);
    const steps = (m, c) => {
      const xs = Array.from({ length: 16 }, () => m + normal(r) * 30).sort((a, b) => a - b);
      const pts = [[18, 88]];
      xs.forEach((x, i) => { pts.push([x, pts[pts.length - 1][1]]); pts.push([x, 88 - ((i + 1) / 16) * 74]); });
      pts.push([152, 14]);
      return line(pts, c);
    };
    return AXIS + steps(64, 0) + steps(104, 1);
  },
  displot() {
    return panel(16, 80) + panel(90, 154)
      + hist(20, 78, 88, 60, 44, 12, 8, 0) + hist(94, 152, 88, 56, 126, 13, 8, 1);
  },
  countplot() { return AXIS + rect(26, 30, 22, 58, 0) + rect(60, 52, 22, 36, 0) + rect(94, 18, 22, 70, 0) + rect(128, 64, 22, 24, 0); },
  barplot() {
    const bars = [[26, 44], [62, 62], [98, 34]];
    return AXIS + bars.map(([x, h], i) => rect(x, 88 - h, 28, h, i)
      + `<line class="wk" x1="${x + 14}" y1="${88 - h - 9}" x2="${x + 14}" y2="${88 - h + 9}"/>`).join('');
  },
  boxplot() {
    return AXIS + box(40, 88, 22, 34, 46, 8, 66, 22, 0) + box(84, 88, 36, 44, 58, 20, 74, 22, 1)
      + box(128, 88, 16, 24, 32, 6, 48, 22, 2) + dot(128, 26, 2, 2) + dot(128, 20, 2, 2);
  },
  violinplot() {
    return AXIS + violin(40, 88, 30, 12, 72, 28, 0) + violin(84, 88, 46, 16, 76, 28, 1) + violin(128, 88, 20, 9, 60, 28, 2);
  },
  stripplot() {
    const r = rng(8);
    let s = AXIS;
    [[40, 32, 14, 0], [84, 46, 18, 1], [128, 24, 10, 2]].forEach(([cx, m, sd, c]) => {
      for (let i = 0; i < 18; i += 1) s += dot(cx + (r() - 0.5) * 18, 88 - m - normal(r) * sd, c, 2);
    });
    return s;
  },
  swarmplot() {
    let s = AXIS;
    [[40, [1, 2, 4, 5, 3, 2, 1], 0], [84, [1, 3, 5, 4, 2, 1], 1], [128, [2, 4, 3, 1], 2]].forEach(([cx, rows, c]) => {
      rows.forEach((n, i) => {
        for (let k = 0; k < n; k += 1) s += dot(cx + (k - (n - 1) / 2) * 5, 82 - i * 6 - (c === 1 ? 10 : 0), c, 2.2);
      });
    });
    return s;
  },
  pointplot() {
    const xs = [34, 84, 134];
    const a = [60, 44, 26]; const b = [64, 58, 52];
    const err = (x, y, c) => `<line class="e${c}" x1="${x}" y1="${88 - y - 7}" x2="${x}" y2="${88 - y + 7}"/>`;
    return AXIS + line(xs.map((x, i) => [x, 88 - a[i]]), 0) + line(xs.map((x, i) => [x, 88 - b[i]]), 1)
      + xs.map((x, i) => dot(x, 88 - a[i], 0, 3.2) + err(x, a[i], 0) + dot(x, 88 - b[i], 1, 3.2) + err(x, b[i], 1)).join('');
  },
  catplot() {
    return panel(16, 80) + panel(90, 154)
      + box(36, 88, 18, 28, 38, 6, 56, 16, 0) + box(62, 88, 28, 38, 48, 14, 62, 16, 1)
      + box(110, 88, 26, 36, 50, 12, 66, 16, 0) + box(136, 88, 12, 20, 30, 4, 44, 16, 1);
  },
  regplot() {
    const r = rng(12);
    let s = AXIS + area([[20, 70], [150, 18], [150, 30], [20, 80]], 0);
    for (let i = 0; i < 26; i += 1) {
      const x = 22 + r() * 126;
      s += dot(x, 80 - (x - 20) * 0.45 + normal(r) * 9, 0, 2.2);
    }
    return s + line([[20, 75], [150, 24]], 0, 'rl');
  },
  lmplot() {
    const r = rng(13);
    let s = AXIS + area([[20, 74], [150, 30], [150, 42], [20, 84]], 0) + area([[20, 58], [150, 54], [150, 66], [20, 68]], 1);
    for (let i = 0; i < 14; i += 1) {
      const x = 22 + r() * 126;
      s += dot(x, 79 - (x - 20) * 0.34 + normal(r) * 7, 0, 2.1) + dot(x, 63 - (x - 20) * 0.03 + normal(r) * 7, 1, 2.1);
    }
    return s + line([[20, 79], [150, 36]], 0, 'rl') + line([[20, 63], [150, 60]], 1, 'rl');
  },
  heatmap() { return grid(22, 10, 24, 5, 5, 16); },
  clustermap() {
    // 위쪽 나무는 칸(열)을, 왼쪽 나무는 줄(행)을 비슷한 것끼리 묶은 모양
    const tree = '<path class="tr" d="'
      + 'M67 17V12H91V17 M115 17V10H139V17 M79 12V4H127V10 '
      + 'M55 26H48V42H55 M55 57H50V73H55 M48 34H42V65H50"/>';
    return tree + grid(56, 18, 24, 4, 4, 17);
  },
  pairplot() {
    const r = rng(15);
    let s = '';
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        const x0 = 22 + j * 44; const y0 = 4 + i * 31;
        s += `<rect class="fr" x="${x0}" y="${y0}" width="40" height="28"/>`;
        if (i === j) s += hist(x0 + 3, x0 + 37, y0 + 27, 22, x0 + 20, 7, 7, 0);
        else {
          for (let k = 0; k < 9; k += 1) {
            const t = r();
            s += dot(x0 + 5 + t * 30, y0 + 24 - t * (i < j ? 18 : 10) - r() * 6, k % 3, 1.5);
          }
        }
      }
    }
    return s;
  },
  jointplot() {
    const r = rng(16);
    let s = '<path class="ax" d="M30 26V92H122"/>';
    for (let i = 0; i < 30; i += 1) {
      const t = normal(r);
      s += dot(76 + t * 22, 60 - t * 14 + normal(r) * 5, 0, 2);
    }
    s += hist(32, 120, 22, 18, 76, 20, 11, 0);
    // 오른쪽 가장자리 — 옆으로 누운 막대
    for (let i = 0; i < 9; i += 1) {
      const y = 30 + i * 7; const w = 20 * gauss(y, 60, 13);
      if (w > 1) s += rect(126, y, w, 6, 0);
    }
    return s;
  },
};

/** 값에 따라 색을 칠한 격자 — 파랑(음)에서 빨강(양)으로 */
function grid(x0, y0, cell, nx, ny, seed) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < ny; i += 1) {
    for (let j = 0; j < nx; j += 1) {
      const v = i === j ? 1 : (r() * 2 - 1) * 0.9;
      s += `<rect x="${x0 + j * cell}" y="${y0 + i * (cell * 0.66)}" width="${cell - 1}" height="${R1(cell * 0.66 - 1)}" fill="${heat(v)}"/>`;
    }
  }
  return s;
}

function heat(v) {
  // -1 → 파랑, 0 → 흰색, +1 → 빨강
  const t = Math.abs(v);
  const [r, g, b] = v < 0 ? [59, 111, 182] : [196, 78, 82];
  const mix = (c) => Math.round(255 + (c - 255) * t);
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}

/** 함수 이름을 받아 SVG 글자를 돌려준다 */
export function shapeSVG(fn) {
  const body = DRAW[fn] ? DRAW[fn]() : '';
  return `<svg class="shape" viewBox="0 0 160 100" role="img" aria-label="${fn} 모양">${body}</svg>`;
}

export const SHAPE_FNS = Object.keys(DRAW);
