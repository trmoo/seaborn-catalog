/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */
// t1-topic.js — 주제별 보기. 자료가 22개뿐이라 갈래마다 카드를 바로 늘어놓는다.

import { h, paint, beginScreen, num } from '../lib/ui.js';
import { CATS, ITEMS, sortById } from '../lib/store.js';
import { datasetCard } from '../lib/card.js';
import { go } from '../main.js';

// 처음 오는 학생에게 먼저 권하는 다섯
const FIRST = ['tips', 'penguins', 'titanic', 'flights', 'anscombe'];

export function render(arg) {
  beginScreen();
  const only = (arg || '').split('/')[0];
  const cats = CATS.filter((c) => !only || c.k === only);
  const count = (k) => ITEMS.filter((d) => d.cat === k).length;

  paint(
    h('div.lead', {},
      h('h2', {}, '주제로 찾아보기'),
      h('p', {}, 'seaborn 에는 설명서에 쓰려고 담아 둔 예제 데이터가 ' + num(ITEMS.length) + '개 있습니다. '
        + '코랩에서 sns.load_dataset(\'이름\') 한 줄이면 불러집니다. 카드를 누르면 컬럼의 뜻과 바로 쓸 수 있는 그래프 코드가 나옵니다.')),

    only ? null : h('section.first', {},
      h('h3', {}, '🚀 처음이라면 이 다섯 개부터'),
      h('p.dim', {}, '크기가 알맞고 열의 뜻이 쉬워 거의 모든 그래프를 연습할 수 있는 자료입니다.'),
      h('div.grid', {}, FIRST.map((id) => datasetCard(ITEMS.find((d) => d.id === id))))),

    h('div.pills', {},
      h('button.pill' + (only ? '' : '.on'), { onclick: () => go('topic') }, '모든 갈래 ' + ITEMS.length),
      CATS.map((c) => h('button.pill' + (c.k === only ? '.on' : ''), {
        onclick: () => go('topic/' + c.k), title: c.d,
      }, c.e + ' ' + c.n + ' ' + count(c.k)))),

    cats.map((c) => h('section.catsec', {},
      h('h3', {}, c.e + ' ' + c.n, h('span.n', {}, count(c.k) + '개')),
      h('p.dim', {}, c.d),
      h('div.grid', {}, ITEMS.filter((d) => d.cat === c.k).sort(sortById)
        .map((d) => datasetCard(d, { showCat: false }))))));
}
