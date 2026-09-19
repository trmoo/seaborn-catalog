/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */
// t3-func.js — 그리고 싶은 그래프(seaborn 함수)로 데이터셋 고르기
//
// 옆 폴더 matplotlib_pandas_practice 의 1차시(변화·비교·분포·관계)에서 한 걸음 나아간 화면이다.

import { h, paint, beginScreen } from '../lib/ui.js';
import { itemsFor, pickOf } from '../lib/store.js';
import { FAMS, FUNCS, FUNC_ORDER, sampleCode } from '../lib/code.js';
import { shapeSVG } from '../lib/shapes.js';
import { codeBox, openDetail } from '../lib/card.js';
import { go } from '../main.js';

export function render(arg) {
  beginScreen();
  const fn = (arg || '').split('/')[0];
  if (!FUNCS[fn]) return paintPick();
  return paintFn(fn);
}

function paintPick() {
  paint(
    h('div.lead', {},
      h('h2', {}, '그리고 싶은 그래프로 고르기'),
      h('p', {}, 'seaborn 의 그래프 함수 ' + FUNC_ORDER.length + '가지를 다섯 갈래로 나누었습니다. '
        + '함수를 누르면 그 함수로 그릴 수 있는 자료와, 바로 붙여 넣어 쓸 코드가 나옵니다.')),
    h('div.note.info', {},
      h('b', {}, 'ℹ 작은 그림은 「대충 이런 모양」을 보여 주는 도식입니다'),
      h('p', {}, '실제 데이터로 그린 것이 아니라 지어낸 숫자로 그린 것입니다. 진짜 그래프는 코드를 코랩에 붙여 넣어 직접 그려 보세요.')),
    FAMS.map((f) => h('section.famsec', {},
      h('h3', {}, f.e + ' ' + f.n, h('span.n', {}, f.d)),
      f.fig ? h('p.dim', {}, '이 갈래의 「여러 칸」 함수는 sns.' + f.fig + '( ) 입니다 — col= 로 무리마다 칸을 나눕니다.') : null,
      h('div.fngrid', {}, FUNC_ORDER.filter((k) => FUNCS[k].fam === f.k).map(fnCard)))));
}

function fnCard(k) {
  const F = FUNCS[k];
  const n = itemsFor(k).length;
  return h('button.fncard', { onclick: () => go('func/' + k) },
    h('div.fnshape', { html: shapeSVG(k) }),
    h('code.fnname', {}, 'sns.' + k + '( )'),
    h('div.fnko', {}, F.ko, F.fig ? h('span.figlv', { title: '그림 전체를 만드는 함수' }, '여러 칸') : null),
    h('div.fncount', {}, '자료 ' + n + '개'));
}

function paintFn(fn) {
  const F = FUNCS[fn];
  const fam = FAMS.find((f) => f.k === F.fam);
  const list = itemsFor(fn);
  const i = FUNC_ORDER.indexOf(fn);
  const prev = FUNC_ORDER[i - 1];
  const next = FUNC_ORDER[i + 1];

  paint(
    h('div.crumb', {},
      h('button.link', { onclick: () => go('func') }, '← 모든 함수'),
      h('span', {}, ' / ' + fam.e + ' ' + fam.n + ' / '),
      h('b', {}, 'sns.' + fn + '( )')),

    h('div.fnhero', {},
      h('div.fnbig', { html: shapeSVG(fn) }),
      h('div.fninfo', {},
        h('h2', {}, h('code', {}, 'sns.' + fn + '( )'), ' ' + F.ko),
        h('p', {}, F.desc),
        h('dl.fnfacts', {},
          h('dt', {}, '필요한 것'), h('dd', {}, F.need),
          h('dt', {}, '맷플롯립으로는'), h('dd', {}, F.mpl ? h('code', {}, F.mpl) : '맷플롯립 한 줄로는 어렵습니다'),
          h('dt', {}, '종류'), h('dd', {}, F.fig
            ? '그림 전체를 만드는 함수 — 크기는 height= · aspect= 로 정하고, plt.figure( ) 는 먹지 않습니다'
            : '그래프 한 칸(Axes)에 그리는 함수 — plt.figure(figsize=…) · plt.title( ) 을 함께 쓸 수 있습니다')))),

    h('h3', {}, '이 함수로 그릴 수 있는 자료 ' + list.length + '개'),
    h('p.dim', {}, '★ 는 그 자료에서 이 함수로 던져 볼 물음을 적어 둔 것입니다. 누르면 코드가 펼쳐집니다.'),
    h('div.fnlist', {}, list.map((d, n) => {
      const p = pickOf(d, fn);
      return h('details.fnitem', { open: n === 0 ? 'open' : null },
        h('summary', {},
          h('code.ds-id', {}, d.id), h('span.fi-ko', {}, d.ko),
          p ? h('span.star', {}, '★') : null),
        p ? h('div.pick-q', {}, '❓ ' + p.q) : null,
        codeBox(sampleCode(d, fn)),
        h('button.link', { onclick: () => openDetail(d, fn) }, '이 자료 자세히 보기 →'));
    })),

    h('div.pager', {},
      prev ? h('button.pagebtn', { onclick: () => go('func/' + prev) }, '← sns.' + prev + '( )') : h('span'),
      next ? h('button.pagebtn', { onclick: () => go('func/' + next) }, 'sns.' + next + '( ) →') : h('span')));
}
