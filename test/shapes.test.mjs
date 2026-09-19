/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */
// shapes.test.mjs — 설명 그림

import { shapeSVG, SHAPE_FNS } from '../src/lib/shapes.js';
import { FUNC_ORDER } from '../src/lib/code.js';
import { 묶음, 시험, 같다, 참, 거짓 } from './harness.mjs';

export default function () {
  묶음('설명 그림');

  시험('함수 21가지 모두 그림이 있다', () => 같다(SHAPE_FNS.slice().sort(), FUNC_ORDER.slice().sort()));

  시험('그림이 성하다 — 숫자가 망가지지 않고, 모양이 셋 이상', () => {
    for (const fn of FUNC_ORDER) {
      const s = shapeSVG(fn);
      참(s.startsWith('<svg') && s.endsWith('</svg>'), fn);
      거짓(/NaN|undefined|Infinity/.test(s), fn);
      참((s.match(/<(rect|circle|polyline|polygon|path|line)\b/g) || []).length >= 3, fn);
    }
  });

  시험('그릴 때마다 같은 그림', () => {
    for (const fn of FUNC_ORDER) 같다(shapeSVG(fn), shapeSVG(fn), fn);
  });
}
