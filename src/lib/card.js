/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */
// card.js — 데이터셋 하나를 목록 카드와 자세히 보기로 그린다
//
// ⚠ 코드를 만드는 부분은 lib/code.js 에 있다 (시험이 그 파일을 node 로 그대로 부른다).

import { h, modal, copy, num } from './ui.js';
import { cat, fnsOf, pickOf, FACTS, LEVELS, naTotal } from './store.js';
import { FUNCS, FAMS, sampleCode, loadCode } from './code.js';

const KIND = {
  num: { ko: '숫자', cls: 'k-num' },
  cat: { ko: '범주', cls: 'k-cat' },
  text: { ko: '글자', cls: 'k-text' },
  bool: { ko: '참거짓', cls: 'k-bool' },
  time: { ko: '날짜', cls: 'k-time' },
};

const level = (d) => h('span.lv.lv' + d.level, { title: '난이도' }, LEVELS[d.level]);

/** 목록에 늘어놓는 카드 하나 */
export function datasetCard(d, opt) {
  const o = opt || {};
  const c = cat(d.cat);
  return h('button.ds', { onclick: () => openDetail(d), title: d.ko },
    h('div.ds-top', {},
      h('code.ds-id', {}, d.id),
      h('span.ds-size', {}, num(d.r) + '행 × ' + d.c + '열')),
    h('div.ds-ko', {}, d.ko),
    o.q ? h('div.ds-q', {}, '❓ ' + o.q) : null,
    h('div.ds-bot', {},
      o.showCat === false ? null : h('span.tag', {}, c.e + ' ' + c.n),
      level(d),
      d.tags.map((t) => h('span.ttag', {}, t)),
      h('span.nfn', { title: '그릴 수 있는 seaborn 함수 수' }, '🎨 ' + fnsOf(d).length)));
}

/** 코드 상자 — 복사 단추가 붙는다 */
export function codeBox(code, what) {
  return h('div.codebox', {},
    h('pre', {}, code),
    h('button.copy', { onclick: () => copy(code, what || '코드') }, '복사'));
}

/** 이 자료에 붙는 알림 — build_data.py 가 실제로 확인한 사실만 쓴다 */
export function notesOf(d) {
  const out = [];
  const F = FACTS;

  if (d.id === 'brain_networks') {
    out.push(note('bad', "그냥 부르면 표가 망가집니다 — header=[0, 1, 2], index_col=0 을 꼭 붙이세요",
      '머리글이 세 줄이라, 그냥 부르면 둘째·셋째 머리글이 값 자리에 들어가 ' + F.brain.plain.join('행 × ') + '열이 되고 '
      + '숫자 열이 ' + F.brain.plainNumeric + '개가 됩니다(모두 글자로 읽힘). 머리글을 세 줄로 알려 주면 '
      + F.brain.fixed.join('행 × ') + '열의 숫자 표가 됩니다.'));
  }
  if (F.unnamed.includes(d.id)) {
    out.push(note('warn', "'Unnamed: 0' 열은 쓰지 마세요",
      '원래 파일을 저장할 때 행 번호가 함께 적혀, 그것이 열 하나로 딸려 들어왔습니다. 뜻이 없는 번호이므로 '
      + "df.drop(columns='Unnamed: 0') 으로 버리고 쓰는 편이 깔끔합니다."));
  }
  const diff = F.diff[d.id];
  if (diff) {
    out.push(note('info', 'sns.load_dataset( ) 은 이 자료를 조금 손질해서 줍니다',
      '같은 CSV 파일을 pd.read_csv( ) 로 읽으면 아래가 다릅니다. 코랩에서 load_dataset 으로 부르면 신경 쓰지 않아도 됩니다.',
      h('ul.difflist', {}, diff.map(diffLine))));
  }
  const tw = F.twins[d.id];
  if (tw) out.push(twinNote(d, tw));
  if (d.id === 'titanic') {
    out.push(note('warn', '같은 뜻을 두 번 적은 열이 있습니다',
      'survived ↔ alive, pclass ↔ class, embarked ↔ embark_town 은 적는 방식만 다른 같은 정보이고, '
      + 'adult_male 은 who 가 man 인지, alone 은 sibsp + parch 가 0 인지로 만든 열입니다 (891명 모두 확인). '
      + '상관계수나 짝 그림에 두 열을 함께 넣으면 「완벽한 관계」가 나오는데, 발견이 아니라 같은 열을 두 번 넣은 것입니다. '
      + 'deck 은 ' + F.titanic.rows + '명 가운데 ' + F.titanic.deckNa + '명이 비어 있습니다.'));
  }
  if (d.id === 'anagrams' || d.id === 'attention') {
    out.push(note('info', 'anagrams 와 attention 은 같은 실험입니다',
      'anagrams(넓은 표 ' + F.anagrams.wide.join('×') + ')를 melt( ) 로 펴면 ' + F.anagrams.long.join('×')
      + ' 의 긴 표가 되는데, 그 점수 60개가 attention 의 score 와 하나도 빠짐없이 같습니다. '
      + '「맷플롯립 ↔ 씨본」 탭의 「씨본이 좋아하는 표 모양」에서 직접 바꿔 볼 수 있습니다.'));
  }
  if (d.id === 'diamonds') {
    out.push(note('warn', '크기가 0 으로 적힌 다이아몬드가 ' + F.diamondsZero + '개 있습니다',
      '길이(x)·너비(y)·높이(z) 가운데 하나가 0 인 행입니다. 크기가 0 인 다이아몬드는 있을 수 없으니 잘못 적힌 값입니다. '
      + '이상치를 찾는 연습에 쓰기 좋습니다.'));
  }
  if (d.id === 'geyser') {
    const g = F.geyser;
    out.push(note('info', 'kind 는 기다린 시간으로 나눈 것입니다',
      'short 는 기다린 시간이 ' + g.shortMaxWait + '분 이하, long 은 ' + g.longMinWait + '분 이상인 분출입니다. '
      + '분출 시간(duration)으로는 두 무리가 겹칩니다 (short 가운데 가장 긴 분출 ' + g.shortMaxDur
      + '분 > long 가운데 가장 짧은 분출 ' + g.longMinDur + '분).'));
  }
  if (d.id === 'anscombe') {
    const a = F.anscombe.I;
    out.push(note('info', '네 묶음의 요약 통계가 거의 같습니다',
      '네 묶음 모두 x 평균 ' + a.mx + ', y 평균 ' + a.my + ', 상관계수 약 ' + a.r + ', 회귀선 y = ' + a.icpt + ' + '
      + a.slope + 'x 입니다. 숫자는 같은데 그림은 전혀 다릅니다 — lmplot 으로 네 칸을 나란히 그려 보세요.'));
  }
  if (d.r > 5000) {
    out.push(note('info', '행이 ' + num(d.r) + '개라 조금 무겁습니다',
      '점을 모두 찍으면 뭉개지므로 예제 코드는 점을 작고 흐리게(s=8, alpha=0.3) 그립니다. '
      + '벌떼 점·회귀선처럼 느려지는 그래프는 목록에서 뺐습니다.'));
  }
  return out;
}

function diffLine(x) {
  if (x.to === 'category') {
    return h('li', {}, h('code', {}, x.c), ' — 범주형(category)으로 바뀌고 차례가 ',
      h('b', {}, x.order.join(' → ')), ' 로 정해집니다.',
      x.renamed ? h('span', {}, ' 글자도 바뀝니다: ' + x.rawSample.join(', ') + ' … → ' + x.order.slice(0, 3).join(', ') + ' …') : null);
  }
  if (x.to.startsWith('datetime')) {
    return h('li', {}, h('code', {}, x.c), ' — 글자에서 날짜(datetime)로 바뀝니다. 선그래프의 가로축이 날짜 눈금이 됩니다.');
  }
  if (x.renamed) {
    return h('li', {}, h('code', {}, x.c), ' — 값의 글자가 바뀝니다: ' + x.rawSample.join(', ') + ' → ' + x.newSample.join(', '));
  }
  return h('li', {}, h('code', {}, x.c), ' — ' + x.from + ' → ' + x.to);
}

const TWIN_REL = {
  same: '값과 열 이름까지 똑같은 자료입니다.',
  renamed: '값은 똑같은데 열 이름이 다릅니다.',
  reshaped: '값은 같은데 표 모양이 다릅니다.',
  different: '이름만 같고 전혀 다른 자료입니다.',
  '?': '같은 자료인지 확인하지 못했습니다.',
};

function twinNote(d, t) {
  const kind = t.rel === 'same' ? 'info' : 'warn';
  let extra = '';
  if (t.rel === 'renamed') extra = ' PyDataset 쪽은 ' + t.cols.slice(0, 3).join(', ') + ' … 처럼 R 식 이름을 씁니다.';
  if (t.rel === 'reshaped') extra = ' PyDataset 쪽은 ' + t.cols.join(', ') + ' 로 옆으로 늘어선 넓은 표이고, seaborn 쪽은 dataset·x·y 세 열의 긴 표입니다.';
  if (d.id === 'geyser' && FACTS.geyserFaithful) {
    extra = ' seaborn 의 geyser 는 오히려 R 의 faithful 자료(272행)와 값이 똑같습니다 — 확인해 보았습니다.';
  }
  return note(kind, "PyDataset 의 data('" + d.id + "') 와 견주면 — " + TWIN_REL[t.rel],
    'PyDataset 에도 같은 이름의 자료가 있습니다 (R ' + t.pkg + ' 패키지, ' + num(t.r) + '행 × ' + t.c + '열, 「' + t.ko + '」). '
    + 'seaborn 쪽은 ' + num(d.r) + '행 × ' + d.c + '열입니다.' + extra
    + ' 이름만 보고 같은 자료라고 여기면 안 됩니다.');
}

function note(kind, title, body, more) {
  const icon = { bad: '⚠ ', warn: '⚠ ', info: 'ℹ ' }[kind];
  return h('div.note.' + kind, {}, h('b', {}, icon + title), h('p', {}, body), more || null);
}

function fact(k, v) {
  return h('div.fact', {}, h('div.fk', {}, k), h('div.fv', {}, String(v)));
}

/** 컬럼의 범위나 범주 이름 */
function rangeOf(c) {
  if (c.lv) {
    return h('span', {}, c.lv.join(' · '), c.ord ? h('span.ord', { title: 'load_dataset 이 차례를 정해 준 열' }, ' 차례 있음') : null);
  }
  if (c.k === 'num' || c.k === 'time') return c.lo + ' ~ ' + c.hi;
  return c.u > 12 ? '(' + num(c.u) + '가지)' : '';
}

function colTable(d) {
  const rows = d.cols.map((x) => h('tr', {},
    h('td', {}, h('code', {}, x.n)),
    h('td.ko', {}, d.colko[x.n] || ''),
    h('td', {}, h('span.kind.' + KIND[x.k].cls, {}, KIND[x.k].ko)),
    h('td.r', {}, num(x.u)),
    h('td.r', { cls: x.na ? 'na' : '' }, x.na ? num(x.na) : '—'),
    h('td.rg', {}, rangeOf(x))));
  const table = h('div.tablewrap', {}, h('table.cols', {},
    h('thead', {}, h('tr', {},
      h('th', {}, '이름'), h('th', {}, '뜻'), h('th', {}, '종류'), h('th', {}, '다른 값'),
      h('th', {}, '빠진 값'), h('th', {}, '범위 · 범주'))),
    h('tbody', {}, rows)));
  if (d.cols.length > 20) {
    return h('details.more', {}, h('summary', {}, '컬럼 ' + d.c + '개 모두 보기 (이름은 「연결망 · 노드 · 반구」)'), table);
  }
  return table;
}

/** 데이터셋 하나를 자세히 — 대화상자로 연다. fn 을 주면 그 함수의 코드를 맨 위에 펼친다 */
export function openDetail(d, fn) {
  const c = cat(d.cat);
  const fns = fnsOf(d);
  const notes = notesOf(d);

  modal(d.ko,
    h('div.dt-head', {},
      h('code.dt-id', {}, d.id),
      h('span.tag', {}, c.e + ' ' + c.n),
      level(d),
      d.tags.map((t) => h('span.ttag', {}, t))),
    h('p.dt-desc', {}, d.desc),
    h('p.dt-row', {}, h('b', {}, '한 행 = '), d.row),

    h('div.dt-facts', {},
      fact('행', num(d.r)),
      fact('열', d.c),
      fact('숫자 열', d.cols.filter((x) => x.k === 'num').length),
      fact('범주 열', d.cols.filter((x) => x.k === 'cat' || x.k === 'bool').length),
      fact('날짜 열', d.cols.filter((x) => x.k === 'time').length),
      fact('빠진 값', num(naTotal(d)))),

    notes.length ? h('div.notes', {}, notes) : null,

    h('h4', {}, '불러오기'),
    codeBox(loadCode(d)),

    h('h4', {}, '컬럼 ' + d.c + '개'),
    colTable(d),

    d.picks.length ? h('div', {},
      h('h4', {}, '이 자료로 던져 볼 물음'),
      d.picks.map((p) => h('div.qpick', {},
        h('div.pick-q', {}, '❓ ' + p.q),
        h('div.pick-fn', {}, FUNCS[p.fn].ko + ' — sns.' + p.fn + '( )'),
        codeBox(sampleCode(d, p.fn))))) : null,

    h('h4', {}, '그릴 수 있는 seaborn 함수 ' + fns.length + '가지'),
    h('p.dim', {}, '누르면 코드가 펼쳐집니다. 코드는 모두 seaborn 0.13.2 로 실제로 실행해 확인했습니다.'),
    FAMS.map((f) => {
      const mine = fns.filter((k) => FUNCS[k].fam === f.k);
      if (!mine.length) return null;
      return h('div.famblock', {},
        h('div.famname', {}, f.e + ' ' + f.n),
        mine.map((k) => h('details.fn', { open: k === fn ? 'open' : null },
          h('summary', {}, h('code', {}, 'sns.' + k + '( )'), ' ' + FUNCS[k].ko,
            pickOf(d, k) ? h('span.star', { title: '이 자료의 추천 물음에 쓴 함수' }, '★') : null),
          codeBox(sampleCode(d, k)))));
    }),

    h('h4', {}, '원래 자료'),
    h('p.src', {}, d.src),
    h('p.dim', {}, '한국어 제목·설명·컬럼 뜻은 원문을 옮긴 것이 아니라 새로 쓴 것입니다. 데이터의 값은 이 앱에 들어 있지 않습니다 — 코랩에서 직접 불러 보세요.'));
}
