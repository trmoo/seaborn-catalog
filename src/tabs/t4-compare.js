/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */
// t4-compare.js — 같은 그래프를 맷플롯립과 씨본으로 나란히
//
// 옆 폴더 matplotlib_pandas_practice(맷플롯립 1차시)를 배운 학생이 다음 걸음으로 오는 자리다.
// 코드는 모두 lib/lessons.js 에 있고, npm run check:code 가 진짜 파이썬으로 실행해 확인한다.

import { h, paint, beginScreen } from '../lib/ui.js';
import { FACTS, byId } from '../lib/store.js';
import { COMPARE, TIDY, SNIPS, drawLines } from '../lib/lessons.js';
import { codeBox, openDetail } from '../lib/card.js';

export function render(arg) {
  beginScreen();
  const A = FACTS.anagrams;

  paint(
    h('div.lead', {},
      h('h2', {}, '맷플롯립으로 그리던 것을 씨본으로'),
      h('p', {}, 'seaborn 은 맷플롯립을 버리고 새로 만든 도구가 아니라, 맷플롯립 위에 지은 집입니다. '
        + '그래서 plt.title( ) · plt.xlabel( ) · plt.savefig( ) · plt.show( ) 를 그대로 함께 씁니다. '
        + '달라지는 것은 「표와 열 이름을 통째로 건네면, 셈하고 나누고 색칠하는 일을 대신해 준다」는 점입니다.')),

    h('div.ideas', {},
      idea('📋', '표를 통째로 건넨다', "data=df, x='열 이름', y='열 이름' 처럼 표와 열 이름을 줍니다. df['열'] 을 하나씩 꺼내지 않아도 됩니다."),
      idea('🧮', '셈을 대신한다', '평균·개수·신뢰구간·회귀선을 스스로 셈합니다. groupby( ) 를 먼저 하지 않아도 됩니다.'),
      idea('🎨', 'hue= 한 단어로 나눈다', '무리마다 색을 달리하고 범례까지 붙입니다. for 문이 사라집니다.'),
      idea('🪟', 'col= 로 칸을 나눈다', 'relplot · displot · catplot · lmplot 은 무리마다 칸을 나누어 그립니다.')),

    h('div.pills', {}, COMPARE.map((c) => h('a.pill', { href: '#compare/' + c.k }, c.e + ' ' + c.title))),

    COMPARE.map((c) => pairBlock(c)),

    h('section.tidy', { id: 'tidy' },
      h('h3', {}, '🧱 씨본이 좋아하는 표 모양 — 긴 표'),
      h('p', {}, 'seaborn 은 「한 행 = 한 번 잰 값, 한 열 = 한 가지 변수」로 적은 긴 표(long form)를 가장 좋아합니다. '
        + '그래야 x= · y= · hue= 에 열 이름을 넣어 무엇이든 나눌 수 있기 때문입니다. '
        + '같은 실험을 두 모양으로 적은 anagrams(넓은 표)와 attention(긴 표)으로 견주어 봅니다.'),
      h('div.twotable', {},
        shapeTable('넓은 표 — 한 행 = 참가자 한 명', ['subidr', 'attnr', 'num1', 'num2', 'num3'],
          [['1', 'divided', '●', '●', '●'], ['2', 'divided', '●', '●', '●'], ['…', '…', '…', '…', '…']]),
        h('div.arrow', {}, 'melt( ) →'),
        shapeTable('긴 표 — 한 행 = 점수 하나', ['subidr', 'attnr', 'solutions', 'score'],
          [['1', 'divided', 'num1', '●'], ['1', 'divided', 'num2', '●'], ['1', 'divided', 'num3', '●'], ['…', '…', '…', '…']])),
      h('p.dim', {}, '● 은 값이 들어가는 자리를 나타낸 것입니다 (이 앱은 데이터의 값을 담지 않습니다).'),
      h('h4', {}, '① 넓은 표 그대로 — num1·num2·num3 가 옆으로 늘어서 있다'),
      codeBox(TIDY.wide),
      h('h4', {}, '② melt( ) 로 긴 표로 편 뒤 그리기'),
      codeBox(TIDY.melt),
      h('p', {}, '실행하면 ' + A.wide.join('×') + ' 의 넓은 표가 ' + A.long.join('×') + ' 의 긴 표로 바뀝니다. '
        + '참가자 20명 × 퍼즐 3종 = 60행입니다.'),
      h('h4', {}, '③ 처음부터 긴 표로 적은 attention 으로 그리기'),
      codeBox(TIDY.long),
      A.same ? h('div.note.info', {},
        h('b', {}, 'ℹ ②와 ③은 같은 그림이 나옵니다'),
        h('p', {}, 'anagrams 를 펴서 만든 점수 60개와 attention 의 score 60개를 참가자·조건·답 개수별로 맞대어 보았더니 하나도 빠짐없이 같았습니다. '
          + '열 이름만 다를 뿐(subidr ↔ subject, attnr ↔ attention) 같은 실험입니다.')) : null,
      h('div.tidybtns', {},
        h('button.link', { onclick: () => openDetail(byId('anagrams')) }, 'anagrams 자세히 →'),
        h('button.link', { onclick: () => openDetail(byId('attention')) }, 'attention 자세히 →'))),

    h('section', {},
      h('h3', {}, '💾 씨본 그래프도 결국 맷플롯립 그림입니다'),
      h('p', {}, '그래프 한 칸에 그리는 함수(scatterplot · barplot 등)는 맷플롯립의 Axes 를 돌려줍니다. '
        + '그래서 제목을 달고 파일로 저장하는 방법이 맷플롯립과 똑같습니다.'),
      codeBox(SNIPS.save)));

  if (arg) {
    const el = document.getElementById('cmp-' + arg);
    if (el) el.scrollIntoView();
  }
}

function idea(e, t, d) {
  return h('div.idea', {}, h('div.ie', {}, e), h('b', {}, t), h('p', {}, d));
}

function pairBlock(c) {
  const m = drawLines(c.mpl);
  const s = drawLines(c.sns);
  return h('section.pair', { id: 'cmp-' + c.k },
    h('h3', {}, c.e + ' ' + c.title, h('span.n', {}, '자료: ' + c.data)),
    h('div.sidebyside', {},
      h('div.side.mpl', {},
        h('div.side-h', {}, '맷플롯립만으로', h('span.lines', {}, m + '줄')),
        codeBox(c.mpl)),
      h('div.side.sns', {},
        h('div.side-h', {}, '씨본으로', h('span.lines', {}, s + '줄')),
        codeBox(c.sns))),
    h('ul.points', {}, c.points.map((p) => h('li', {}, p))),
    h('details.more', {},
      h('summary', {}, '➕ 씨본에서 한 단어 더 넣으면'),
      codeBox(c.more)),
    h('p.dim', {}, '줄 수는 import · 불러오기 · plt.show( ) · 주석만 있는 줄을 빼고 센 「그리는 줄」입니다.'));
}

function shapeTable(title, head, rows) {
  return h('div.shapetable', {},
    h('div.st-h', {}, title),
    h('table', {},
      h('thead', {}, h('tr', {}, head.map((x) => h('th', {}, x)))),
      h('tbody', {}, rows.map((r) => h('tr', {}, r.map((x) => h('td', {}, x)))))));
}
