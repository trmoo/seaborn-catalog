/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */
// run.mjs — 시험을 모아 돌린다.  npm test
//
// ⚠ 시험은 DOM 을 쓰지 않는 파일만 부른다 (store.js · code.js · lessons.js · shapes.js).
//   화면 파일(tabs/·lib/ui.js·lib/card.js·main.js)의 문법은 npm run check:syntax 가 본다.
// ⚠ 코드가 진짜로 돌아가는지는 npm run check:code 가 본다 (파이썬 필요).

import data from './data.test.mjs';
import code from './code.test.mjs';
import lessons from './lessons.test.mjs';
import search from './search.test.mjs';
import shapes from './shapes.test.mjs';
import { 결과 } from './harness.mjs';

console.log('Seaborn 데이터 도감 — 시험');

data();
code();
lessons();
search();
shapes();

process.exit(결과() ? 1 : 0);
