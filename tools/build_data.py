# Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요.
# build_data.py — seaborn 의 예제 데이터 22개를 실제로 불러 src/data/catalog.js 를 만든다.
#
#   npm run data        (pip install -r tools/requirements.txt 가 먼저)
#
# ⚠ 데이터의 값(행)은 담지 않는다. 담는 것은 행·열 수, 컬럼 이름·종류, 다른 값의 개수,
#   빠진 값의 개수, 범주의 이름표(12개 이하일 때), 숫자 열의 가장 작은 값·큰 값뿐이다.
# ⚠ 판다스는 2.2 로 맞춘다. 코랩이 2.2 라서, 3.x 로 만들면 dtype 이 학생 화면과 달라진다.
# ⚠ 「알아낸 것」(facts) 은 손으로 적지 않고 여기서 실제로 확인한 값만 싣는다.

import json
import os
import re
import sys
import warnings
from pathlib import Path

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

sys.path.insert(0, str(Path(__file__).parent))
from catalog_ko import CATS, ITEMS, LEVELS, ORDER  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
CACHE = Path(os.environ.get('SEABORN_DATA') or ROOT / 'tools' / '.cache')
CACHE.mkdir(parents=True, exist_ok=True)
OUT = ROOT / 'src' / 'data' / 'catalog.js'
SIBLING = ROOT.parent / 'pydataset-catalog' / 'src' / 'data' / 'catalog.js'
PYD = Path.home() / '.pydataset' / 'resources' / 'rdata' / 'csv'

HEAD = ('/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */\n'
        '// 이 파일은 tools/build_data.py 가 만든다. 손으로 고치지 말 것.\n')


def load(name, **kw):
    return sns.load_dataset(name, data_home=str(CACHE), **kw)


def raw(name, **kw):
    """load_dataset 이 손대기 전의 모습 — 같은 파일을 read_csv 로 그대로 읽는다."""
    load(name, **kw)  # 받아 두기
    return pd.read_csv(CACHE / (name + '.csv'), **kw)


def kw_of(name):
    s = ITEMS[name].get('load')
    return eval('dict(' + s + ')') if s else {}


def num(x):
    """JSON 에 넣을 숫자 — 너무 긴 소수는 줄인다."""
    if x is None or (isinstance(x, float) and np.isnan(x)):
        return None
    x = float(x)
    if x.is_integer():
        return int(x)
    return float(f'{x:.4g}')


def col_name(c):
    return ' · '.join(map(str, c)) if isinstance(c, tuple) else str(c)


def kind_of(s):
    if pd.api.types.is_bool_dtype(s):
        return 'bool'
    if pd.api.types.is_datetime64_any_dtype(s):
        return 'time'
    if isinstance(s.dtype, pd.CategoricalDtype):
        return 'cat'
    if pd.api.types.is_numeric_dtype(s):
        return 'num'
    return 'cat' if s.nunique() <= 20 else 'text'


def col_meta(df, name):
    out = []
    for c in df.columns:
        s = df[c]
        k = kind_of(s)
        m = {'n': col_name(c), 'k': k, 'u': int(s.nunique()), 'na': int(s.isna().sum()), 'dt': str(s.dtype)}
        if k in ('cat', 'bool') and m['u'] <= 12:
            if isinstance(s.dtype, pd.CategoricalDtype):
                m['lv'] = [str(x) for x in s.cat.categories]
                m['ord'] = True           # load_dataset 이 순서를 정해 준 열
            else:
                m['lv'] = sorted(str(x) for x in s.dropna().unique())
            # 무리마다 행 수가 똑같은가 — 똑같으면 개수 막대(countplot)는 볼 것이 없다
            m['bal'] = bool(s.value_counts().nunique() == 1)
        elif k == 'num':
            m['lo'], m['hi'] = num(s.min()), num(s.max())
            m['int'] = bool(pd.api.types.is_integer_dtype(s))
        elif k == 'time':
            m['lo'], m['hi'] = str(s.min())[:10], str(s.max())[:10]
        out.append(m)
    return out


def load_diff(name):
    """load_dataset 과 read_csv 의 결과가 어떻게 다른가."""
    kw = kw_of(name)
    a, b = load(name, **kw), raw(name, **kw)
    out = []
    for c in a.columns:
        if c not in b.columns:
            continue
        x, y = a[c], b[c]
        if isinstance(x.dtype, pd.CategoricalDtype):
            item = {'c': col_name(c), 'to': 'category', 'from': str(y.dtype),
                    'order': [str(v) for v in x.cat.categories],
                    'rawOrder': [str(v) for v in pd.unique(y.dropna())]}
            if set(map(str, y.dropna().unique())) != set(item['order']):
                item['renamed'] = True    # 값의 글자까지 바뀐 경우 (flights 의 달)
                item['rawSample'] = [str(v) for v in pd.unique(y.dropna())][:3]
            out.append(item)
        elif str(x.dtype) != str(y.dtype):
            out.append({'c': col_name(c), 'to': str(x.dtype), 'from': str(y.dtype)})
        elif x.dtype == object and not x.fillna('∅').equals(y.fillna('∅')):
            out.append({'c': col_name(c), 'to': 'object', 'from': 'object', 'renamed': True,
                        'rawSample': sorted(map(str, y.dropna().unique()))[:3],
                        'newSample': sorted(map(str, x.dropna().unique()))[:3]})
    return out


# ── 옆 앱(PyDataset 도감)과 이름이 겹치는 것 ────────────────────────
def sibling_items():
    if not SIBLING.exists():
        return {}
    txt = SIBLING.read_text(encoding='utf-8')
    body = txt[txt.index('export default') + len('export default'):].strip().rstrip(';')
    data = json.loads(body)
    return {d['id']: d for d in data['items']}


def same_values(a, b):
    """열 이름은 보지 않고 값만 자리대로 견준다.
    ⚠ 글자로 바꿔 견주면 10 과 10.0 이 달라진다 (앤스컴에서 실제로 걸렸다). 숫자는 숫자로 견준다."""
    if a.shape != b.shape:
        return False
    for i in range(a.shape[1]):
        x, y = a.iloc[:, i], b.iloc[:, i]
        if pd.api.types.is_numeric_dtype(x) and pd.api.types.is_numeric_dtype(y):
            if not np.allclose(x.to_numpy(float), y.to_numpy(float), equal_nan=True):
                return False
        elif not (x.astype(str).to_numpy() == y.astype(str).to_numpy()).all():
            return False
    return True


def twin_of(name, sib):
    d = sib.get(name)
    if not d:
        return None
    t = {'pkg': d['pkg'], 'r': d['r'], 'c': d['c'], 'ko': d['ko'],
         'cols': [c['n'] for c in d['cols']],
         'callable': (not d.get('dup')) or d.get('win') == d['pkg']}
    path = PYD / d['pkg'] / (name + '.csv')
    if not path.exists():
        t['rel'] = '?'
        return t
    p = pd.read_csv(path, index_col=0)
    s = pd.read_csv(CACHE / (name + '.csv'))
    if same_values(s, p):
        t['rel'] = 'same' if list(s.columns) == list(p.columns) else 'renamed'
    elif name == 'anscombe':
        # 넓은 표(x1..x4, y1..y4)를 긴 표로 펴면 seaborn 판과 같은가
        long = pd.concat([pd.DataFrame({'dataset': r, 'x': p['x%d' % i], 'y': p['y%d' % i]})
                          for i, r in enumerate(['I', 'II', 'III', 'IV'], 1)], ignore_index=True)
        t['rel'] = 'reshaped' if same_values(long.reset_index(drop=True), s) else 'different'
    else:
        t['rel'] = 'different'
    return t


def geyser_is_faithful():
    f = PYD / 'datasets' / 'faithful.csv'
    if not f.exists():
        return None
    p = pd.read_csv(f, index_col=0)
    s = load('geyser')
    return bool(np.allclose(p['eruptions'].to_numpy(), s['duration'].to_numpy())
                and (p['waiting'].to_numpy() == s['waiting'].to_numpy()).all())


# ── 알아낸 것 ─────────────────────────────────────────────────────
def facts(sib):
    F = {}

    # ① load_dataset 과 read_csv 의 차이
    F['diff'] = {n: load_diff(n) for n in ORDER}
    F['diff'] = {k: v for k, v in F['diff'].items() if v}

    # ② tips 의 요일 차례 — 막대 순서가 달라진다
    r = raw('tips')
    F['tipsDay'] = {
        'appear': [str(x) for x in pd.unique(r['day'])],
        'groupby': [str(x) for x in r.groupby('day')['tip'].mean().index],
        'load': [str(x) for x in load('tips')['day'].cat.categories],
    }

    # ③ 범주형 열로 groupby 하면 경고가 나온다 (판다스 2.2)
    with warnings.catch_warnings(record=True) as w:
        warnings.simplefilter('always')
        load('tips').groupby('day')['tip'].mean()
    F['observedWarn'] = any('observed' in str(x.message) for x in w)
    with warnings.catch_warnings(record=True) as w:
        warnings.simplefilter('always')
        load('tips').groupby('day', observed=True)['tip'].mean()
    F['observedFixed'] = not any('observed' in str(x.message) for x in w)

    # ④ brain_networks 의 머리글 세 줄
    b0 = load('brain_networks')
    b1 = load('brain_networks', header=[0, 1, 2], index_col=0)
    F['brain'] = {
        'plain': list(b0.shape), 'fixed': list(b1.shape),
        'plainFirst': [None if pd.isna(x) else str(x) for x in b0.iloc[:3, 0]],
        'plainNumeric': int(sum(pd.api.types.is_numeric_dtype(b0[c]) for c in b0.columns)),
        'networks': int(b1.columns.get_level_values(0).nunique()),
    }

    # ⑤ 행 번호가 열로 딸려 온 것
    F['unnamed'] = [n for n in ORDER if 'Unnamed: 0' in load(n, **kw_of(n)).columns]

    # ⑥ PyDataset 과 이름이 같은 것
    F['twins'] = {n: t for n in ORDER if (t := twin_of(n, sib))}
    F['geyserFaithful'] = geyser_is_faithful()

    # ⑦ sns.set_theme( ) 이 한글 글꼴을 풀어 버린다
    plt.rcdefaults()
    plt.rc('font', family='NanumGothic')
    before = list(plt.rcParams['font.family'])
    sns.set_theme()
    F['setTheme'] = {'before': before, 'after': list(plt.rcParams['font.family'])}
    sns.set_theme(font='NanumGothic')
    F['setTheme']['fixed'] = list(plt.rcParams['font.family'])
    plt.rcdefaults()

    # ⑧ titanic 에서 같은 뜻을 두 번 적은 열
    t = load('titanic')
    F['titanic'] = {
        'survived=alive': bool((t['survived'] == (t['alive'] == 'yes').astype(int)).all()),
        'pclass=class': bool((t['pclass'].map({1: 'First', 2: 'Second', 3: 'Third'}) == t['class'].astype(str)).all()),
        'embarked=embark_town': bool(
            t[['embarked', 'embark_town']].dropna().drop_duplicates().shape[0] == t['embarked'].nunique()),
        'adult_male=who': bool((t['adult_male'] == (t['who'] == 'man')).all()),
        'alone=sibsp+parch': bool((t['alone'] == ((t['sibsp'] + t['parch']) == 0)).all()),
        'deckNa': int(t['deck'].isna().sum()), 'rows': int(len(t)),
    }

    # ⑨ anagrams(넓은 표) 와 attention(긴 표) 는 같은 실험인가
    a = load('anagrams')
    long = a.melt(id_vars=['subidr', 'attnr'], value_vars=['num1', 'num2', 'num3'],
                  var_name='solutions', value_name='score')
    long['solutions'] = long['solutions'].str[-1].astype(int)
    at = load('attention')
    m = at.merge(long, left_on=['subject', 'attention', 'solutions'],
                 right_on=['subidr', 'attnr', 'solutions'], suffixes=('', '_w'))
    F['anagrams'] = {
        'wide': list(a.shape), 'long': [len(long), 4], 'attention': list(at.shape),
        'same': bool(len(m) == len(at) and np.allclose(m['score'], m['score_w'])),
    }

    # ⑩ 앤스컴 네 묶음의 요약 통계 — 거의 같다
    an = load('anscombe')
    F['anscombe'] = {}
    for k, g in an.groupby('dataset'):
        slope, icpt = np.polyfit(g['x'], g['y'], 1)
        F['anscombe'][k] = {
            'mx': round(g['x'].mean(), 2), 'my': round(g['y'].mean(), 2),
            'vx': round(g['x'].var(), 2), 'vy': round(g['y'].var(), 2),
            'r': round(g['x'].corr(g['y']), 3), 'slope': round(slope, 3), 'icpt': round(icpt, 2), 'n': len(g),
        }

    # ⑪ 다이아몬드 치수가 0 인 것 — 잘못 적힌 값
    d = load('diamonds')
    F['diamondsZero'] = int(((d['x'] == 0) | (d['y'] == 0) | (d['z'] == 0)).sum())

    # ⑫ 간헐천의 kind 는 무엇으로 나눴나
    g = load('geyser')
    F['geyser'] = {
        'shortMaxWait': num(g.loc[g['kind'] == 'short', 'waiting'].max()),
        'longMinWait': num(g.loc[g['kind'] == 'long', 'waiting'].min()),
        'shortMaxDur': num(g.loc[g['kind'] == 'short', 'duration'].max()),
        'longMinDur': num(g.loc[g['kind'] == 'long', 'duration'].min()),
    }

    # ⑬ 맷플롯립 plt.hist 는 빠진 값이 있으면 멈춘다 — seaborn 은 알아서 뺀다
    p = load('penguins')
    try:
        plt.figure()
        plt.hist(p['body_mass_g'])
        F['histNaN'] = 'ok'
    except Exception as e:  # noqa: BLE001
        F['histNaN'] = type(e).__name__
    plt.close('all')

    # ⑭ np.polyfit 은 빠진 값이 섞이면 셈을 끝내지 못한다 — 「맷플롯립 ↔ 씨본」 회귀 짝의 근거
    m = load('mpg')
    try:
        with warnings.catch_warnings():
            warnings.simplefilter('ignore')
            r = np.polyfit(m['horsepower'], m['mpg'], 1)
        F['polyfitNaN'] = 'nan' if np.isnan(r).any() else 'ok'
    except Exception as e:  # noqa: BLE001
        F['polyfitNaN'] = type(e).__name__
    F['mpgHorsepowerNa'] = int(m['horsepower'].isna().sum())

    # ⑮ fmri 는 한 시점·한 사건에 값이 몇 개인가 — lineplot 이 평균을 내는 까닭
    f = load('fmri')
    per = f.groupby(['timepoint', 'event']).size()
    F['fmri'] = {'perPoint': int(per.iloc[0]), 'allSame': bool(per.nunique() == 1),
                 'subjects': int(f['subject'].nunique()), 'regions': int(f['region'].nunique())}

    # ⑯ 기타 확인
    F['carDC'] = 'DC' in set(load('car_crashes')['abbrev'])
    for n, pv in (('flights', ITEMS['flights']['roles']['pivot']), ('glue', ITEMS['glue']['roles']['pivot'])):
        df = load(n)
        F.setdefault('pivotUnique', {})[n] = bool(not df.duplicated([pv['index'], pv['columns']]).any())
    return F


def main():
    sib = sibling_items()
    names = sns.get_dataset_names()
    missing = sorted(set(names) ^ set(ORDER))
    if missing:
        sys.exit('catalog_ko.py 와 seaborn 의 목록이 다릅니다: ' + ', '.join(missing))

    items = []
    for n in ORDER:
        info = ITEMS[n]
        df = load(n, **kw_of(n))
        cols = col_meta(df, n)
        names_in = {c['n'] for c in cols}
        for k in info['colko']:
            if k not in names_in:
                sys.exit(f'{n}: 컬럼 뜻을 적은 {k!r} 가 실제로 없습니다')
        item = {
            'id': n, 'ko': info['ko'], 'desc': info['desc'], 'row': info['row'], 'src': info['src'],
            'cat': info['cat'], 'level': info['level'], 'tags': info['tags'],
            'r': int(df.shape[0]), 'c': int(df.shape[1]), 'cols': cols,
            'colko': info['colko'], 'roles': info['roles'],
            'picks': [{'fn': f, 'q': q} for f, q in info['picks']],
        }
        if info.get('load'):
            item['load'] = info['load']
        items.append(item)
        print(f'  {n:16s} {df.shape[0]:>6}행 × {df.shape[1]:>3}열')

    meta = {
        'cats': CATS, 'levels': LEVELS,
        'seaborn': sns.__version__, 'pandas': pd.__version__, 'matplotlib': matplotlib.__version__,
        'facts': facts(sib),
    }
    body = json.dumps({'meta': meta, 'items': items}, ensure_ascii=False, separators=(',', ':'))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(HEAD + 'export default ' + body + ';\n', encoding='utf-8')
    print(f'\n✓ {OUT.relative_to(ROOT)} — 데이터셋 {len(items)}개, {len(body):,}자')


if __name__ == '__main__':
    main()
