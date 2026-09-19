/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */
// t5-help.js — 안내 · 쓰는 법 · 알아 둘 함정 · 출처
//
// ⚠ 여기에 나오는 숫자·차례는 손으로 적지 않고 catalog.js 의 facts(build_data.py 가 실제로 확인한 값)에서 가져온다.

import { h, paint, beginScreen, num } from '../lib/ui.js';
import { ITEMS, META, FACTS, byId, fnsOf, sortById } from '../lib/store.js';
import { FUNC_ORDER } from '../lib/code.js';
import { SNIPS } from '../lib/lessons.js';
import { codeBox, openDetail } from '../lib/card.js';

const REL_KO = {
  same: '같은 자료 (값·열 이름 모두 같음)',
  renamed: '값은 같고 열 이름이 다름',
  reshaped: '값은 같고 표 모양이 다름 (넓은 표 ↔ 긴 표)',
  different: '이름만 같은 다른 자료',
  '?': '확인하지 못함',
};

export function render() {
  beginScreen();
  const F = FACTS;
  const combos = ITEMS.reduce((s, d) => s + fnsOf(d).length, 0);
  const diffIds = Object.keys(F.diff).sort();
  const twins = Object.entries(F.twins).sort(([a], [b]) => a.localeCompare(b));
  const T = F.tipsDay;

  paint(
    h('div.lead', {},
      h('h2', {}, 'seaborn 의 예제 데이터란'),
      h('p', {}, 'seaborn 은 판다스 표를 받아 통계 그래프를 그려 주는 파이썬 라이브러리입니다. '
        + '설명서의 예제를 그리려고 작은 데이터 ' + ITEMS.length + '개를 따로 모아 두었는데, '
        + 'sns.load_dataset(\'이름\') 한 줄로 인터넷에서 받아 판다스 표로 돌려줍니다. 코랩에는 seaborn 이 이미 깔려 있어 설치할 것이 없습니다.')),

    h('div.stats', {},
      stat(ITEMS.length, '데이터셋'),
      stat(FUNC_ORDER.length, 'seaborn 함수'),
      stat(num(combos), '실행해 확인한 코드'),
      stat(ITEMS.filter((d) => d.level === 1).length, '입문 자료')),

    h('h3', {}, '쓰는 법'),
    h('ol.steps', {},
      step('이름 보기', '쓸 수 있는 데이터 이름을 모두 봅니다', SNIPS.names),
      step('불러와서 그리기', '코랩에 붙여 넣고 실행하면 바로 그래프가 나옵니다', SNIPS.first),
      step('그래프 안에 한글을 쓰고 싶다면', '제목·축 이름에 한글을 넣을 때만 필요합니다. 이 앱의 예제 코드는 그래프 안에 한글을 쓰지 않아 이것 없이도 그대로 돌아갑니다', SNIPS.font.code)),

    h('h3', {}, '⚠ 미리 알아 두면 좋은 것'),
    h('p', {}, '이 앱을 만들면서 seaborn ' + META.seaborn + ' 과 판다스 ' + META.pandas
      + ' 로 22개를 모두 불러 보고 찾은 것들입니다. 수업에서 학생이 부딪히면 당황하기 쉬운 대목입니다.'),

    trap('① load_dataset 은 부를 때마다 인터넷에서 받아 옵니다',
      h('p', {}, '데이터는 seaborn 을 설치할 때 함께 들어오지 않습니다. 부르는 순간 깃허브(raw.githubusercontent.com)에서 CSV 파일을 받아 옵니다. '
        + '코랩은 구글 서버에서 돌아가니 늘 되지만, 학교 컴퓨터에 직접 깐 파이썬에서는 인터넷이 끊기거나 방화벽에 막히면 오류가 납니다. '
        + '한 번 받은 파일은 그 컴퓨터에 남겨 두어 다음부터는 인터넷 없이도 불러집니다.'),
      h('p', {}, '인터넷이 없는 교실이라면 CSV 를 미리 받아 두고 pd.read_csv( ) 로 읽을 수 있습니다. 다만 ②의 차이가 생기니 차례는 직접 정해 줍니다.'),
      codeBox(SNIPS.offline)),

    trap('② load_dataset 과 pd.read_csv 는 결과가 다릅니다 — ' + diffIds.length + '개 자료',
      h('p', {}, 'load_dataset 은 파일을 읽은 뒤 몇몇 자료를 손질해서 줍니다. 범주의 차례를 정하고, 날짜 글자를 날짜로 바꾸고, 글자를 다듬습니다. '
        + '가장 눈에 띄는 것은 막대의 차례입니다. tips 의 요일(day)은'),
      h('ul.orders', {},
        h('li', {}, h('b', {}, 'CSV 파일에 나오는 차례 '), T.appear.join(' → '), ' — read_csv 로 읽어 그대로 그리면 이 차례'),
        h('li', {}, h('b', {}, 'groupby( ) 결과의 차례 '), T.groupby.join(' → '), ' — 알파벳 차례'),
        h('li', {}, h('b', {}, 'load_dataset 의 차례 '), T.load.join(' → '), ' — 사람이 기대하는 차례')),
      h('p', {}, '같은 자료인데 그리는 방법에 따라 막대 차례가 세 가지로 달라집니다. 차례를 확실히 하려면 order= 를 줍니다.'),
      codeBox(SNIPS.order),
      h('p.dim', {}, '손질을 받는 자료 — 누르면 무엇이 바뀌는지 나옵니다.'),
      chips(diffIds)),

    trap('③ 범주형 열로 groupby 하면 경고가 뜹니다',
      h('p', {}, 'load_dataset 이 범주형(category)으로 바꿔 준 열로 판다스 groupby( ) 를 하면, 판다스 2.2 에서 '
        + '「observed=False 기본값이 바뀔 예정」이라는 FutureWarning 이 빨간 글씨로 뜹니다. 오류는 아니지만 학생이 놀랍니다. '
        + 'observed=True 를 붙이면 사라집니다. seaborn 함수에 표를 그대로 넘길 때는 뜨지 않습니다.'),
      F.observedWarn && F.observedFixed ? codeBox(SNIPS.observed) : null),

    trap('④ sns.set_theme( ) 을 부르면 한글 글꼴 설정이 풀립니다',
      h('p', {}, '맷플롯립 수업에서 plt.rc(\'font\', family=\'NanumGothic\') 으로 한글 글꼴을 정해 두었어도, '
        + '그 뒤에 sns.set_theme( ) 을 부르면 글꼴이 ' + F.setTheme.before.join(', ') + ' → ' + F.setTheme.after.join(', ')
        + ' 로 되돌아가 그래프의 한글이 □□□ 로 깨집니다. set_theme 은 모양(테마)을 정하면서 글꼴까지 기본값으로 다시 적기 때문입니다.'),
      codeBox(SNIPS.themeTrap.code),
      h('p', {}, '글꼴을 set_theme 안에 함께 적으면 ' + F.setTheme.fixed.join(', ') + ' 가 그대로 남습니다 — 위 「쓰는 법」 3번 코드처럼 쓰세요.')),

    trap('⑤ brain_networks 는 그냥 부르면 표가 망가집니다',
      h('p', {}, '머리글이 세 줄이라, 그냥 부르면 둘째·셋째 머리글(' + F.brain.plainFirst.filter(Boolean).join(', ')
        + ')이 값 자리에 들어가 ' + F.brain.plain.join('행 × ') + '열이 되고 모든 열이 글자로 읽힙니다. '
        + 'header 와 index_col 을 알려 주면 ' + F.brain.fixed.join('행 × ') + '열의 숫자 표가 됩니다.'),
      codeBox(SNIPS.brainBad),
      codeBox(SNIPS.brainGood)),

    trap("⑥ 'Unnamed: 0' 이라는 이상한 열",
      h('p', {}, F.unnamed.join(' · ') + ' 에는 뜻이 없는 행 번호가 열 하나로 딸려 들어와 있습니다. '
        + '파일을 저장할 때 행 번호까지 함께 적힌 탓입니다. 상관계수나 짝 그림에 섞이지 않게 버리고 씁니다.'),
      codeBox(SNIPS.unnamed)),

    trap('⑦ PyDataset 에도 같은 이름이 ' + twins.length + '개 있는데, 같은 자료가 아닐 수 있습니다',
      h('p', {}, '옆 앱 「PyDataset 데이터 도감」의 data(\'이름\') 과 이름이 겹치는 것들입니다. 실제 파일을 열어 값을 맞대어 보았습니다.'),
      h('div.tablewrap', {}, h('table.twins', {},
        h('thead', {}, h('tr', {}, h('th', {}, '이름'), h('th', {}, 'seaborn'), h('th', {}, 'PyDataset'), h('th', {}, '견준 결과'))),
        h('tbody', {}, twins.map(([id, t]) => {
          const d = byId(id);
          return h('tr', { cls: t.rel === 'different' ? 'diffrow' : '' },
            h('td', {}, h('button.dchip', { onclick: () => openDetail(d) }, id)),
            h('td', {}, num(d.r) + '×' + d.c),
            h('td', {}, num(t.r) + '×' + t.c + ' (' + t.pkg + ')'),
            h('td', {}, REL_KO[t.rel]));
        })))),
      F.geyserFaithful ? h('p', {}, 'geyser 는 PyDataset 의 MASS/geyser(299행)와 다르고, 오히려 R 의 faithful(272행)과 값이 똑같습니다. '
        + '같은 올드 페이스풀 간헐천을 서로 다른 때에 잰 두 자료입니다.') : null),

    trap('⑧ titanic 에는 같은 뜻을 두 번 적은 열이 있습니다',
      h('p', {}, 'survived ↔ alive, pclass ↔ class, embarked ↔ embark_town 은 같은 정보를 숫자와 글자로 두 번 적은 것입니다. '
        + 'adult_male·alone 도 다른 열로 만든 것입니다. 두 열을 함께 상관계수에 넣으면 「완벽한 관계」가 나오지만 발견이 아닙니다.'),
      codeBox(SNIPS.titanic)),

    h('h3', {}, '데이터셋의 원래 출처'),
    h('p.dim', {}, 'seaborn-data 저장소의 안내문에 적힌 출처를 따랐습니다. 저장소는 스스로를 「seaborn 설명서용이지 일반 자료실이 아니며, '
      + '원래 출처에서 손본 자료도 있다」고 밝히고 있습니다.'),
    h('div.tablewrap', {}, h('table.srcs', {},
      h('thead', {}, h('tr', {}, h('th', {}, '이름'), h('th', {}, '한국어 제목'), h('th', {}, '원래 자료'))),
      h('tbody', {}, ITEMS.slice().sort(sortById).map((d) => h('tr', {},
        h('td', {}, h('button.dchip', { onclick: () => openDetail(d) }, d.id)),
        h('td', {}, d.ko),
        h('td', {}, d.src)))))),

    h('h3', {}, '이 앱에 대하여'),
    h('div.about', {},
      h('p', {}, '데이터셋의 ', h('b', {}, '값(행)은 담지 않았습니다'), '. 담은 것은 행·열 수, 컬럼 이름·종류, 범주의 이름, '
        + '숫자 열의 가장 작은·큰 값처럼 「어떤 자료인가」를 말해 주는 정보뿐입니다. 값은 코랩에서 직접 불러 보세요 — 그것이 이 앱이 바라는 쓰임입니다.'),
      h('p', {}, '한국어 제목·설명·컬럼 뜻과 주제 분류는 원문을 옮긴 것이 아니라 새로 쓴 것입니다. 분류는 수업에서 찾기 쉽게 나눈 것이지 공식 분류가 아닙니다.'),
      h('p', {}, '앱에 실린 파이썬 코드 ' + num(combos) + '개와 비교·안내용 코드는 모두 seaborn ' + META.seaborn
        + ' · 판다스 ' + META.pandas + ' · 맷플롯립 ' + META.matplotlib + ' 로 실제로 실행해, 오류와 경고가 없는 것을 확인했습니다.'),
      h('p', {}, '이 앱은 seaborn 을 만든 곳과 관계가 없습니다.'),
      h('p.copy', {}, '© 2026 티쳐무 · 모든 권리 보유')));
}

function stat(v, k) {
  return h('div.statbox', {}, h('div.sv', {}, String(v)), h('div.sk', {}, k));
}

function step(title, desc, code) {
  return h('li', {}, h('b', {}, title), h('span.sd', {}, desc), codeBox(code));
}

function trap(title, ...body) {
  return h('div.trap', {}, h('h4', {}, title), ...body);
}

function chips(ids) {
  return h('div.chipslist', {}, ids.map((id) => h('button.dchip', { onclick: () => openDetail(byId(id)) }, id)));
}
