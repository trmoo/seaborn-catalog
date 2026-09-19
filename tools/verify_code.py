# Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요.
# verify_code.py — 앱이 보여 주는 파이썬 코드를 진짜로 실행해 본다.  npm run check:code
#
# tools/dump-code.mjs 가 먼저 tools/.codes.json 을 만들어 두어야 한다.
# 오류는 물론, 경고(FutureWarning·UserWarning 등)가 하나라도 나오면 실패로 본다.
# 학생이 코랩에서 붙여 넣었을 때 빨간 글씨가 뜨면 안 되기 때문이다.
#
# ⚠ 판다스 2.2 · seaborn 0.13.2 로 돌린다 (코랩과 같게). 앱 폴더의 .venv 를 쓴다.

import contextlib
import io
import json
import os
import sys
import time
import warnings
from pathlib import Path

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
CACHE = Path(os.environ.get('SEABORN_DATA') or ROOT / 'tools' / '.cache')
CACHE.mkdir(parents=True, exist_ok=True)
os.environ['SEABORN_DATA'] = str(CACHE)       # sns.load_dataset 이 받아 둔 파일을 쓰게 한다

import seaborn as sns  # noqa: E402

# 비대화형 백엔드에서 plt.show( ) 가 내는 알림은 학생 화면과 상관이 없다
IGNORE = ('FigureCanvasAgg is non-interactive',)


def shown(w, key):
    """학생 화면(코랩)에 실제로 뜨는 경고인가.
    파이썬·IPython 은 DeprecationWarning 을 「내 코드가 직접 일으켰을 때」만 보여 주고,
    PendingDeprecationWarning 은 아예 숨긴다. 라이브러리 속에서 난 것은 학생에게 보이지 않는다.
    ⚠ 그래서 simplefilter('always') 로 모두 모은 뒤 여기서 걸러 낸다 — 걸러 내지 않으면
      seaborn 0.13.2 가 속에서 부르는 boxplot(vert=…) 때문에 상자그림이 모두 실패로 나온다."""
    if any(s in str(w.message) for s in IGNORE):
        return False
    if issubclass(w.category, PendingDeprecationWarning):
        return False
    if issubclass(w.category, DeprecationWarning):
        return w.filename == key
    return True


def run(key, code):
    g = {'__name__': '__main__'}
    t0 = time.time()
    with warnings.catch_warnings(record=True) as w, contextlib.redirect_stdout(io.StringIO()):
        warnings.simplefilter('always')
        try:
            exec(compile(code, key, 'exec'), g)
            err = None
        except Exception as e:  # noqa: BLE001
            err = f'{type(e).__name__}: {e}'
    plt.close('all')
    sns.reset_defaults()
    ws = [f'{x.category.__name__}: {x.message}' for x in w if shown(x, key)]
    return err, ws, time.time() - t0


def main():
    codes = json.loads((ROOT / 'tools' / '.codes.json').read_text(encoding='utf-8'))
    only = sys.argv[1] if len(sys.argv) > 1 else ''
    os.chdir(CACHE)   # read_csv('tips.csv') 같은 조각이 받아 둔 파일을 찾게
    bad, slow, n = [], [], 0
    for c in codes:
        if not c['run'] or only not in c['key']:
            continue
        n += 1
        err, ws, sec = run(c['key'], c['code'])
        if err or ws:
            bad.append((c['key'], err, ws))
            print(f'  ✗ {c["key"]}  {err or ""}')
            for x in ws[:3]:
                print(f'      ⚠ {x[:160]}')
        if sec > 8:
            slow.append((c['key'], sec))
    print(f'\n실행한 코드 {n}개 · 실패 {len(bad)}개 · 8초 넘게 걸린 것 {len(slow)}개')
    for k, s in slow:
        print(f'  🐢 {k}  {s:.1f}초')
    if bad:
        sys.exit(1)
    print('✓ 앱에 실린 코드가 모두 오류·경고 없이 실행됩니다')


if __name__ == '__main__':
    main()
