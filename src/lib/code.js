/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */
// code.js — 데이터셋과 seaborn 함수를 받아 예제 코드를 만든다
//
// ⚠ 여기에는 DOM 을 쓰지 않는다. 시험(node)과 tools/dump-code.mjs 가 이 파일을 그대로 부른다.
// ⚠ 여기서 만든 코드는 tools/verify_code.py 가 진짜 파이썬(seaborn 0.13.2)으로 전부 실행해 본다.
//   코드를 고치면 반드시 `npm run check:code` 로 다시 돌려 볼 것.
// ⚠ 그래프 안에 한글을 넣지 않는다. 코랩은 한글 글꼴이 없어 □□□ 로 깨진다.
//   열 이름이 영어라 축 이름은 저절로 영어로 나온다. 설명은 # 주석으로만 단다.

/** 파이썬 따옴표 — 이름에 작은따옴표가 있으면 큰따옴표로 감싼다. */
export function pyq(s) {
  return String(s).includes("'") ? '"' + s + '"' : "'" + s + "'";
}

// ── 함수 목록 ─────────────────────────────────────────────────────
// fig: true 면 「그림 전체」를 만드는 함수(figure-level). 칸 나누기(col=)를 할 수 있고,
//      plt.figure( ) 로 크기를 정하지 않고 height= · aspect= 로 정한다.
export const FAMS = [
  { k: 'rel', e: '✨', n: '관계', d: '두 숫자가 함께 움직이는가', fig: 'relplot' },
  { k: 'dist', e: '📶', n: '분포', d: '값이 어디에 몰려 있는가', fig: 'displot' },
  { k: 'cat', e: '📊', n: '범주', d: '무리끼리 견주면 어떻게 다른가', fig: 'catplot' },
  { k: 'reg', e: '📈', n: '회귀', d: '관계를 직선 하나로 요약하면', fig: 'lmplot' },
  { k: 'multi', e: '🧩', n: '한눈에', d: '여러 열을 한꺼번에 훑어본다', fig: null },
];

export const FUNCS = {
  scatterplot: {
    fam: 'rel', ko: '산점도', need: '숫자 x · 숫자 y', mpl: 'plt.scatter( )',
    desc: '두 숫자 열을 점으로 찍습니다. hue= 를 넣으면 무리마다 색이 달라지고 범례가 저절로 붙습니다.',
  },
  lineplot: {
    fam: 'rel', ko: '선그래프', need: '순서 있는 x (시간) · 숫자 y', mpl: 'plt.plot( )',
    desc: '시간에 따른 변화를 선으로 잇습니다. 같은 x 에 값이 여럿이면 평균을 잇고, 그 둘레에 95% 신뢰구간 띠를 스스로 칠합니다.',
  },
  relplot: {
    fam: 'rel', ko: '관계 그래프 여러 칸', fig: true, need: '산점도·선그래프 + 칸을 나눌 범주', mpl: null,
    desc: 'scatterplot·lineplot 을 col= 로 여러 칸에 나누어 그립니다. kind=\'line\' 이면 선그래프가 됩니다.',
  },
  histplot: {
    fam: 'dist', ko: '히스토그램', need: '숫자 하나', mpl: 'plt.hist( )',
    desc: '값을 구간으로 나누어 몇 개씩 들어 있는지 막대로 셉니다. 빠진 값은 알아서 빼고 셉니다.',
  },
  kdeplot: {
    fam: 'dist', ko: '밀도 곡선', need: '숫자 하나', mpl: null,
    desc: '히스토그램을 부드러운 곡선으로 바꾼 것입니다. 무리가 여럿일 때 겹쳐 견주기 좋습니다.',
  },
  ecdfplot: {
    fam: 'dist', ko: '누적 분포', need: '숫자 하나', mpl: null,
    desc: '「이 값보다 작은 것이 몇 %인가」를 계단처럼 그립니다. 구간을 나누지 않아 모양이 흔들리지 않습니다.',
  },
  displot: {
    fam: 'dist', ko: '분포 여러 칸', fig: true, need: '숫자 하나 + 칸을 나눌 범주', mpl: null,
    desc: 'histplot·kdeplot·ecdfplot 을 col= 로 여러 칸에 나누어 그립니다.',
  },
  countplot: {
    fam: 'cat', ko: '개수 막대', need: '범주 하나', mpl: 'value_counts( ) + plt.bar( )',
    desc: '범주마다 행이 몇 개인지 세어 막대로 세웁니다. 세는 일까지 seaborn 이 합니다.',
  },
  barplot: {
    fam: 'cat', ko: '평균 막대', need: '범주 x · 숫자 y', mpl: 'groupby( ).mean( ) + plt.bar( )',
    desc: '범주마다 평균을 막대로 세웁니다. 막대 끝의 검은 선은 95% 신뢰구간이며 errorbar=None 으로 끌 수 있습니다.',
  },
  boxplot: {
    fam: 'cat', ko: '상자그림', need: '범주 x · 숫자 y', mpl: 'plt.boxplot( )',
    desc: '사분위수로 상자를 그리고 울타리 밖의 값을 점으로 찍습니다. 무리마다 퍼진 모양을 견주기 좋습니다.',
  },
  violinplot: {
    fam: 'cat', ko: '바이올린', need: '범주 x · 숫자 y', mpl: null,
    desc: '상자그림에 밀도 곡선을 좌우로 붙인 모양입니다. 봉우리가 두 개인지까지 보입니다.',
  },
  stripplot: {
    fam: 'cat', ko: '점 늘어놓기', need: '범주 x · 숫자 y', mpl: null,
    desc: '값 하나하나를 점으로 찍고 옆으로 살짝 흔들어 겹치지 않게 합니다.',
  },
  swarmplot: {
    fam: 'cat', ko: '벌떼 점', need: '범주 x · 숫자 y (행이 적을 때)', mpl: null,
    desc: '점이 겹치지 않도록 벌떼처럼 옆으로 쌓습니다. 행이 많으면 느려지고 자리가 모자라니 몇백 개까지만 씁니다.',
  },
  pointplot: {
    fam: 'cat', ko: '점과 선 (평균)', need: '범주 x · 숫자 y', mpl: null,
    desc: '범주마다 평균을 점으로 찍고 선으로 잇습니다. 조건에 따라 평균이 어떻게 바뀌는지 볼 때 씁니다.',
  },
  catplot: {
    fam: 'cat', ko: '범주 그래프 여러 칸', fig: true, need: '범주 그래프 + 칸을 나눌 범주', mpl: null,
    desc: '범주 그래프를 col= 로 여러 칸에 나누어 그립니다. kind= 로 box·bar·point 등을 고릅니다.',
  },
  regplot: {
    fam: 'reg', ko: '회귀선 산점도', need: '숫자 x · 숫자 y', mpl: 'np.polyfit( ) + plt.plot( )',
    desc: '산점도 위에 가장 잘 맞는 직선과 그 신뢰구간 띠를 그립니다.',
  },
  lmplot: {
    fam: 'reg', ko: '회귀선 여러 칸', fig: true, need: '숫자 x · 숫자 y + 무리', mpl: null,
    desc: 'regplot 을 hue= 나 col= 로 무리마다 따로 그립니다.',
  },
  heatmap: {
    fam: 'multi', ko: '열지도', need: '표 (상관계수표나 pivot 한 표)', mpl: 'plt.imshow( )',
    desc: '표의 칸을 값에 따라 색칠합니다. annot=True 면 칸 안에 숫자를 적습니다.',
  },
  clustermap: {
    fam: 'multi', ko: '묶음 열지도', fig: true, need: '표 (여러 줄·여러 칸)', mpl: null,
    desc: '열지도의 줄과 칸을 비슷한 것끼리 가까이 옮겨 붙이고, 옆에 묶인 모양(나무 그림)을 그립니다.',
  },
  pairplot: {
    fam: 'multi', ko: '짝 그림', fig: true, need: '숫자 열 여럿', mpl: null,
    desc: '숫자 열을 둘씩 짝지어 산점도를 모두 그리고, 가운데 대각선에는 각 열의 분포를 그립니다.',
  },
  jointplot: {
    fam: 'multi', ko: '결합 그림', fig: true, need: '숫자 x · 숫자 y', mpl: null,
    desc: '가운데 산점도, 위와 오른쪽 가장자리에 각 열의 분포를 함께 그립니다.',
  },
};

export const FUNC_ORDER = Object.keys(FUNCS);

// ── 도우미 ────────────────────────────────────────────────────────
const BIG = 5000;       // 이보다 행이 많으면 점을 작고 흐리게, 느린 그래프는 빼기
const SWARM_MAX = 400;  // 벌떼 점은 몇백 개까지만
const STRIP_MAX = 3000;
const PAIR_MAX = 2000;
const HUE_MAX = 6;      // 색으로 나누기에 알맞은 무리 수 (산점도는 10까지)

export const colOf = (d, n) => d.cols.find((c) => c.n === n);
const levels = (d, n) => (colOf(d, n) ? colOf(d, n).u : 0);
const isBig = (d) => d.r > BIG;
const isLog = (R, n) => !!(R.log && R.log.includes(n));

/** 색으로 나눌 열 — 무리가 너무 많거나, 이미 x·칸에 쓴 열이면 빼다 */
function hueFor(d, max, ...not) {
  const h = d.roles.hue;
  if (!h || not.includes(h)) return null;
  return levels(d, h) <= (max || HUE_MAX) ? h : null;
}

/** 칸(col) 이 넷 이상이면 줄을 바꿔 늘어놓는다 */
function colWrap(d, col) {
  const n = levels(d, col);
  if (n === 4) return 'col_wrap=2';
  if (n > 4) return 'col_wrap=3';
  return null;
}

const A = (k, v) => (v === null || v === undefined ? null : k + '=' + pyq(v));
const list = (arr) => '[' + arr.map(pyq).join(', ') + ']';

/** 열 이름 목록이 길면 「열 = [...]」 로 따로 떼고, 그래도 길면 줄을 바꾼다 */
function listVar(name, arr) {
  const one = name + ' = ' + list(arr);
  if (one.length <= 78) return one;
  const pad = ' '.repeat(name.length + 4);
  const lines = [];
  let cur = name + ' = [';
  arr.forEach((a, i) => {
    const piece = pyq(a) + (i < arr.length - 1 ? ', ' : ']');
    if ((cur + piece).trimEnd().length > 76) { lines.push(cur.trimEnd()); cur = pad; }
    cur += piece;
  });
  lines.push(cur);
  return lines.join('\n');
}

/** df[[...]].corr( ) — 열이 많으면 목록을 먼저 떼어 둔다 */
function corrLines(cols, note) {
  const inline = '상관 = df[' + list(cols) + '].corr()' + (note ? '   # ' + note : '');
  if (inline.length <= 78) return [inline];
  return [listVar('열', cols), '상관 = df[열].corr()' + (note ? '   # ' + note : '')];
}

/** sns.함수(인자, …) 한 줄 — 너무 길면 인자를 다음 줄로 넘긴다 */
function call(fn, ...args) {
  const as = args.filter(Boolean);
  const one = fn + '(' + as.join(', ') + ')';
  if (one.length <= 78) return one;
  const lines = [];
  let cur = '    ';
  for (const a of as) {
    if (cur.trim() && (cur + a).length > 74) { lines.push(cur.trimEnd()); cur = '    '; }
    cur += a + ', ';
  }
  lines.push(cur.trimEnd());
  return fn + '(\n' + lines.join('\n') + '\n)';
}
const sns = (fn, ...args) => call('sns.' + fn, ...args);

/** 막대·상자 등의 x 에 놓을 범주 — 칸(col)으로 쓰는 열은 피한다 */
function firstCat(d, not) {
  return (d.roles.cat || []).find((c) => c !== not && colOf(d, c)) || null;
}

/** 범주 그래프의 x·y — 범주 이름이 길면 가로로 눕힌다 */
function catXY(d, C, Y) {
  return d.roles.horiz ? [A('x', Y), A('y', C)] : [A('x', C), A('y', Y)];
}

// ── 함수마다 코드 만들기 — 그릴 수 없으면 null ──────────────────────
const GEN = {
  scatterplot(d, R) {
    if (!R.xy) return null;
    const [x, y] = R.xy;
    const out = [sns('scatterplot', 'data=df', A('x', x), A('y', y), A('hue', hueFor(d, 10)),
      isBig(d) && 's=8', isBig(d) && 'alpha=0.3')];
    if (isLog(R, x)) out.push("plt.xscale('log')");
    if (isLog(R, y)) out.push("plt.yscale('log')");
    return out;
  },

  lineplot(d, R) {
    if (!R.line) return null;
    const L = R.line;
    return [sns('lineplot', 'data=df', A('x', L.x), A('y', L.y), A('hue', L.hue))];
  },

  relplot(d, R) {
    if (!R.col) return null;
    if (R.xy) {
      const [x, y] = R.xy;
      const g = sns('relplot', 'data=df', A('x', x), A('y', y), A('hue', hueFor(d, 10, R.col)),
        A('col', R.col), colWrap(d, R.col), isBig(d) && 's=8', isBig(d) && 'alpha=0.3');
      const logs = [isLog(R, x) && "xscale='log'", isLog(R, y) && "yscale='log'"].filter(Boolean);
      return logs.length ? ['g = ' + g, 'g.set(' + logs.join(', ') + ')'] : [g];
    }
    if (R.line) {
      const L = R.line;
      return [sns('relplot', 'data=df', A('x', L.x), A('y', L.y),
        A('hue', L.hue !== R.col ? L.hue : null), A('col', R.col), "kind='line'",
        colWrap(d, R.col), R.facet)];
    }
    return null;
  },

  histplot(d, R) {
    if (R.wide) return [sns('histplot', 'data=df[' + list(R.wide) + ']')];
    if (!R.v) return null;
    return [sns('histplot', 'data=df', A('x', R.v), A('hue', hueFor(d, 5)),
      isLog(R, R.v) && 'log_scale=True')];
  },

  kdeplot(d, R) {
    if (R.wide) return [sns('kdeplot', 'data=df[' + list(R.wide) + ']', 'fill=True')];
    if (!R.v) return null;
    return [sns('kdeplot', 'data=df', A('x', R.v), A('hue', hueFor(d, 5)), 'fill=True',
      isLog(R, R.v) && 'log_scale=True')];
  },

  ecdfplot(d, R) {
    if (R.wide) return [sns('ecdfplot', 'data=df[' + list(R.wide) + ']')];
    if (!R.v) return null;
    return [sns('ecdfplot', 'data=df', A('x', R.v), A('hue', hueFor(d, 5)),
      isLog(R, R.v) && 'log_scale=True')];
  },

  displot(d, R) {
    if (!R.v || !R.col) return null;
    return [sns('displot', 'data=df', A('x', R.v), A('hue', hueFor(d, 5, R.col)), A('col', R.col),
      colWrap(d, R.col), isLog(R, R.v) && 'log_scale=True')];
  },

  countplot(d, R) {
    const C = firstCat(d);
    if (!C) return null;
    const c = colOf(d, C);
    if (c.bal) return null;         // 무리마다 개수가 같으면 볼 것이 없다
    return [sns('countplot', 'data=df', A(R.horiz ? 'y' : 'x', C), A('hue', hueFor(d, 5, C)))];
  },

  barplot(d, R) {
    if (R.label && R.v) {
      return [
        '순서 = df.sort_values(' + pyq(R.v) + ', ascending=False)   # 큰 것부터 늘어놓기',
        'plt.figure(figsize=(6, 10))',
        sns('barplot', 'data=순서', A('x', R.v), A('y', R.label)),
      ];
    }
    if (R.wide) return [sns('barplot', 'data=df[' + list(R.wide) + ']')];
    const C = firstCat(d);
    const Y = R.rate || R.v;
    if (!C || !Y) return null;
    return [sns('barplot', 'data=df', ...catXY(d, C, Y), A('hue', hueFor(d, 5, C)),
      isLog(R, Y) && 'log_scale=True')];
  },

  boxplot: (d, R) => spread('boxplot', d, R),
  violinplot: (d, R) => spread('violinplot', d, R),
  stripplot: (d, R) => (d.r > STRIP_MAX ? null : spread('stripplot', d, R, d.r > 300 && 'alpha=0.5')),
  swarmplot: (d, R) => (d.r > SWARM_MAX ? null : spread('swarmplot', d, R, 's=4')),

  pointplot(d, R) {
    if (R.wide) return [sns('pointplot', 'data=df[' + list(R.wide) + ']')];
    const C = firstCat(d);
    const Y = R.rate || R.v;
    if (!C || !Y) return null;
    return [sns('pointplot', 'data=df', ...catXY(d, C, Y), A('hue', hueFor(d, 5, C)),
      isLog(R, Y) && 'log_scale=True')];
  },

  catplot(d, R) {
    if (!R.col) return null;
    const C = firstCat(d, R.col);
    const Y = R.rate || R.v;
    if (!C || !Y) return null;
    const kind = R.rate ? 'bar' : (d.tags.includes('반복 측정') ? 'point' : 'box');
    return [sns('catplot', 'data=df', ...catXY(d, C, Y), A('hue', hueFor(d, 5, C, R.col)),
      A('col', R.col), "kind='" + kind + "'", colWrap(d, R.col), isLog(R, Y) && 'log_scale=True')];
  },

  regplot(d, R) {
    if (!R.xy || isBig(d) || R.xy.some((c) => isLog(R, c))) return null;
    const [x, y] = R.xy;
    return [sns('regplot', 'data=df', A('x', x), A('y', y))];
  },

  lmplot(d, R) {
    if (!R.xy || isBig(d) || R.xy.some((c) => isLog(R, c))) return null;
    const [x, y] = R.xy;
    if (R.lmcol) {   // 앤스컴처럼 무리마다 칸을 따로 두는 것이 알맹이인 자료
      return [sns('lmplot', 'data=df', A('x', x), A('y', y), A('hue', R.hue), A('col', R.col),
        colWrap(d, R.col))];
    }
    return [sns('lmplot', 'data=df', A('x', x), A('y', y), A('hue', hueFor(d, 5)))];
  },

  heatmap(d, R) {
    if (R.pivot) {
      return [
        pivotLine(R),
        'plt.figure(figsize=(9, 6))',
        sns('heatmap', '표', 'annot=True', fmtOf(d, R), "cmap='YlGnBu'"),
      ];
    }
    if (R.corrAll) {
      return ['상관 = df.corr()   # 모든 열끼리의 상관계수표', sns('heatmap', '상관', "cmap='coolwarm'", 'center=0')];
    }
    if (R.num && R.num.length >= 3) {
      return [
        ...corrLines(R.num, '상관계수표'),
        sns('heatmap', '상관', 'annot=True', "fmt='.2f'", "cmap='coolwarm'", 'vmin=-1', 'vmax=1'),
      ];
    }
    return null;
  },

  clustermap(d, R) {
    if (R.corrAll) {
      return ['상관 = df.corr()', sns('clustermap', '상관', "cmap='coolwarm'", 'center=0')];
    }
    if (R.pivot && R.clusterPivot) {
      return [pivotLine(R), sns('clustermap', '표', "cmap='YlGnBu'", 'annot=True', fmtOf(d, R))];
    }
    if (R.num && R.num.length >= 5) {
      return [
        ...corrLines(R.num),
        sns('clustermap', '상관', 'annot=True', "fmt='.2f'", "cmap='coolwarm'", 'vmin=-1', 'vmax=1'),
      ];
    }
    return null;
  },

  pairplot(d, R) {
    const vars = R.pair || (R.num || []).slice(0, 4);
    if (vars.length < 2 || d.r > PAIR_MAX) return null;
    return [call('sns.pairplot', 'df', 'vars=' + list(vars), A('hue', hueFor(d, 5)))];
  },

  jointplot(d, R) {
    if (!R.xy || R.xy.some((c) => isLog(R, c))) return null;
    const [x, y] = R.xy;
    if (isBig(d)) return [sns('jointplot', 'data=df', A('x', x), A('y', y), "kind='hex'")];
    return [sns('jointplot', 'data=df', A('x', x), A('y', y), A('hue', hueFor(d, 5)))];
  },
};

/** 상자·바이올린·점 늘어놓기처럼 「퍼진 모양」을 보는 범주 그래프 */
function spread(fn, d, R, extra) {
  if (R.wide) return [sns(fn, 'data=df[' + list(R.wide) + ']', extra)];
  const C = firstCat(d);
  if (!C || !R.v) return null;
  return [sns(fn, 'data=df', ...catXY(d, C, R.v), A('hue', hueFor(d, 5, C)), extra,
    isLog(R, R.v) && 'log_scale=True')];
}

function pivotLine(R) {
  const P = R.pivot;
  return '표 = df.pivot(' + ['index', 'columns', 'values'].map((k) => A(k, P[k])).join(', ')
    + ')   # 긴 표를 가로·세로 표로 펴기';
}

function fmtOf(d, R) {
  const c = colOf(d, R.pivot.values);
  return c && c.int ? "fmt='d'" : "fmt='.1f'";
}

// ── 밖에서 쓰는 것 ────────────────────────────────────────────────
export function loadLine(d) {
  return 'df = sns.load_dataset(' + pyq(d.id) + (d.load ? ', ' + d.load : '') + ')';
}

export const HEAD = 'import seaborn as sns\nimport matplotlib.pyplot as plt\n';

/** 그냥 불러오기만 하는 코드 */
export const loadCode = (d) => HEAD + '\n' + loadLine(d) + '\nprint(df.shape)\ndf.head()';

/** 이 함수로 이 자료를 그릴 수 있는가 */
export const canDraw = (d, fn) => !!(GEN[fn] && GEN[fn](d, d.roles));

/** 이 자료로 이 함수를 그리는 코드 — 그릴 수 없으면 null */
export function sampleCode(d, fn) {
  const body = GEN[fn] && GEN[fn](d, d.roles);
  if (!body) return null;
  return HEAD + '\n' + loadLine(d) + '\n' + body.join('\n') + '\nplt.show()';
}

/** 이 자료로 그릴 수 있는 함수 목록 (FUNC_ORDER 차례) */
export const drawable = (d) => FUNC_ORDER.filter((fn) => canDraw(d, fn));
