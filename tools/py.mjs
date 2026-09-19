/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */
// py.mjs — 앱 폴더의 .venv 파이썬이 있으면 그것으로, 없으면 python 으로 파이썬 파일을 돌린다.
//   node tools/py.mjs tools/verify_code.py
// ⚠ 윈도우는 .venv/Scripts/python, 리눅스(깃허브 배포 서버)는 .venv/bin/python 이라 경로가 다르다.

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const 후보 = [join(ROOT, '.venv', 'Scripts', 'python.exe'), join(ROOT, '.venv', 'bin', 'python')];
const python = 후보.find((p) => existsSync(p)) || 'python';

const r = spawnSync(python, process.argv.slice(2), {
  stdio: 'inherit', cwd: ROOT, env: { ...process.env, PYTHONUTF8: '1' },
});
process.exit(r.status ?? 1);
