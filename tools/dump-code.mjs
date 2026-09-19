/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */
// dump-code.mjs — 앱이 보여 주는 파이썬 코드를 모두 꺼내 tools/.codes.json 에 적는다.
// 그다음 tools/verify_code.py 가 그 코드를 진짜 파이썬으로 실행해 본다.  (npm run check:code)

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import raw from '../src/data/catalog.js';
import { FUNC_ORDER, sampleCode, loadCode } from '../src/lib/code.js';
import { allSnippets } from '../src/lib/lessons.js';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const out = [];

for (const d of raw.items) {
  out.push({ key: 'load/' + d.id, code: loadCode(d), run: true });
  for (const fn of FUNC_ORDER) {
    const code = sampleCode(d, fn);
    if (code) out.push({ key: d.id + '/' + fn, code, run: true });
  }
}
for (const [key, code, run] of allSnippets()) out.push({ key, code, run });

writeFileSync(join(ROOT, 'tools', '.codes.json'), JSON.stringify(out, null, 1), 'utf8');
console.log('코드 ' + out.length + '개를 tools/.codes.json 에 적었습니다 (실행할 것 '
  + out.filter((x) => x.run).length + '개).');
