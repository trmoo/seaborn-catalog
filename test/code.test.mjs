/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */
// code.test.mjs — 만든 코드가 성한가
//
// 코드가 실제로 돌아가는지는 npm run check:code(진짜 파이썬)가 본다.
// 여기서는 파이썬 없이 잡을 수 있는 것 — 없는 열, 그래프 안의 한글, 빠진 plt.show( ) 등을 본다.

import { ITEMS, byId, fnsOf, itemsFor } from '../src/lib/store.js';
import { FUNCS, FUNC_ORDER, FAMS, sampleCode, canDraw, HEAD, loadLine } from '../src/lib/code.js';
import { 묶음, 시험, 같다, 참, 거짓 } from './harness.mjs';

const HANGUL = /[가-힣]/;

/** 파이썬 코드에서 따옴표 속 글자를 모두 꺼낸다 (주석은 빼고) */
export function quoted(code) {
  const out = [];
  for (const raw of code.split('\n')) {
    const line = raw.replace(/\s#.*$/, '');
    for (const m of line.matchAll(/'([^']*)'|"([^"]*)"/g)) out.push(m[1] ?? m[2]);
  }
  return out;
}

// 열 이름이 아닌데 따옴표 속에 나오는 것들
const OK_WORDS = new Set(['log', 'YlGnBu', 'coolwarm', '.2f', '.1f', 'd', 'hex', 'line', 'box', 'bar', 'point', 'sharex']);

export default function () {
  묶음('함수 목록');

  시험('함수는 21가지, 모두 다섯 갈래 가운데 하나', () => {
    같다(FUNC_ORDER.length, 21);
    for (const k of FUNC_ORDER) 참(FAMS.some((f) => f.k === FUNCS[k].fam), k);
  });

  시험('함수마다 그릴 수 있는 자료가 다섯 개 이상', () => {
    for (const k of FUNC_ORDER) 참(itemsFor(k).length >= 5, k + ' — ' + itemsFor(k).length + '개');
  });

  시험('자료마다 그릴 수 있는 함수가 둘 이상', () => {
    for (const d of ITEMS) 참(fnsOf(d).length >= 2, d.id);
  });

  시험('추천 물음에 쓴 함수는 모두 실제로 그릴 수 있다', () => {
    for (const d of ITEMS) for (const p of d.picks) 참(canDraw(d, p.fn), d.id + ' / ' + p.fn);
  });

  시험('자료마다 추천 물음이 하나 이상', () => {
    for (const d of ITEMS) 참(d.picks.length >= 1, d.id);
  });

  시험('없는 함수는 null', () => {
    같다(sampleCode(byId('tips'), 'plot'), null);
    같다(sampleCode(byId('tips'), 'boxenplot'), null);
  });

  묶음('코드의 모양');

  const all = [];
  for (const d of ITEMS) for (const fn of fnsOf(d)) all.push([d, fn, sampleCode(d, fn)]);

  시험('만든 코드는 ' + all.length + '개 — 모두 import 로 시작해 plt.show( ) 로 끝난다', () => {
    참(all.length > 250);
    for (const [d, fn, c] of all) {
      참(c.startsWith(HEAD), d.id + '/' + fn);
      참(c.includes(loadLine(d)), d.id + '/' + fn + ' 불러오기');
      참(c.endsWith('plt.show()'), d.id + '/' + fn + ' 끝');
    }
  });

  시험('그래프 안에 한글이 들어가지 않는다 (코랩은 □□□ 로 깨진다)', () => {
    for (const [d, fn, c] of all) {
      for (const s of quoted(c)) 거짓(HANGUL.test(s.replace(/\{[^}]*\}/g, '')), d.id + '/' + fn + ' 의 ' + s);
    }
  });

  시험('따옴표 속 이름은 모두 실제 열 이름이다', () => {
    for (const [d, fn, c] of all) {
      const names = new Set(d.cols.map((x) => x.n).concat([d.id]));
      for (const s of quoted(c)) 참(names.has(s) || OK_WORDS.has(s), d.id + '/' + fn + ' 의 ' + s);
    }
  });

  시험('한 줄이 90자를 넘지 않는다', () => {
    for (const [d, fn, c] of all) {
      for (const l of c.split('\n')) 참(l.length <= 90, d.id + '/' + fn + ' — ' + l.length + '자');
    }
  });

  시험('그림 전체를 만드는 함수(relplot 등)에는 plt.figure( ) 를 쓰지 않는다 — 먹지 않는다', () => {
    for (const [d, fn, c] of all) if (FUNCS[fn].fig) 거짓(c.includes('plt.figure('), d.id + '/' + fn);
  });

  시험('brain_networks 는 언제나 머리글 세 줄로 부른다', () => {
    for (const fn of fnsOf(byId('brain_networks'))) {
      참(sampleCode(byId('brain_networks'), fn).includes('header=[0, 1, 2], index_col=0'), fn);
    }
  });

  묶음('자료에 맞춘 판단');

  시험('큰 자료(5천 행 넘음)는 점을 작고 흐리게, 느린 그래프는 빼다', () => {
    for (const d of ITEMS.filter((x) => x.r > 5000)) {
      for (const fn of ['swarmplot', 'regplot', 'lmplot', 'pairplot']) 거짓(canDraw(d, fn), d.id + '/' + fn);
      if (canDraw(d, 'scatterplot')) 참(sampleCode(d, 'scatterplot').includes('alpha=0.3'), d.id);
      if (canDraw(d, 'jointplot')) 참(sampleCode(d, 'jointplot').includes("kind='hex'"), d.id);
    }
  });

  시험('벌떼 점은 400행 이하에서만', () => {
    for (const d of itemsFor('swarmplot')) 참(d.r <= 400, d.id);
  });

  시험('planets 는 로그 눈금으로, 로그 자리에는 회귀선을 긋지 않는다', () => {
    const p = byId('planets');
    참(sampleCode(p, 'scatterplot').includes("plt.xscale('log')"));
    참(sampleCode(p, 'boxplot').includes('log_scale=True'));
    거짓(canDraw(p, 'regplot'));
    거짓(canDraw(p, 'jointplot'));
  });

  시험('앤스컴은 lmplot 으로 네 칸 (2×2)', () => {
    const c = sampleCode(byId('anscombe'), 'lmplot');
    참(c.includes("col='dataset'") && c.includes('col_wrap=2'), c);
  });

  시험('titanic 의 평균 막대는 survived — 막대 높이가 곧 생존 비율', () => {
    참(sampleCode(byId('titanic'), 'barplot').includes("y='survived'"));
    참(sampleCode(byId('titanic'), 'boxplot').includes("y='age'"), '상자그림은 0·1 이 아니라 나이로');
  });

  시험('무리마다 행 수가 같은 범주는 개수 막대를 그리지 않는다', () => {
    for (const id of ['flights', 'glue', 'anscombe', 'exercise']) 거짓(canDraw(byId(id), 'countplot'), id);
  });

  시험('car_crashes 막대는 큰 것부터 정렬해 주(州)마다 하나씩', () => {
    const c = sampleCode(byId('car_crashes'), 'barplot');
    참(c.includes('sort_values') && c.includes("y='abbrev'") && c.includes('figsize'), c);
  });

  시험('anagrams(넓은 표)는 df[[…]] 로 넘긴다', () => {
    참(sampleCode(byId('anagrams'), 'boxplot').includes("data=df[['num1', 'num2', 'num3']]"));
  });

  시험('flights 열지도는 pivot 한 표로, 정수라 fmt=d', () => {
    const c = sampleCode(byId('flights'), 'heatmap');
    참(c.includes("df.pivot(index='month', columns='year', values='passengers')") && c.includes("fmt='d'"), c);
  });

  시험('상관 열지도는 -1 ~ 1 로 색 기준을 못 박는다', () => {
    for (const d of itemsFor('heatmap')) {
      const c = sampleCode(d, 'heatmap');
      if (c.includes('.corr()') && c.includes('annot=True')) 참(c.includes('vmin=-1') && c.includes('vmax=1'), d.id);
    }
  });

  시험('hue 와 칸(col) 에 같은 열을 겹쳐 쓰지 않는다 (앤스컴 lmplot 만 일부러)', () => {
    for (const [d, fn, c] of all) {
      const hue = (c.match(/hue='([^']+)'/) || [])[1];
      const colN = (c.match(/col='([^']+)'/) || [])[1];
      const x = (c.match(/\bx='([^']+)'/) || [])[1];
      if (hue && colN && !(d.id === 'anscombe' && fn === 'lmplot')) 참(hue !== colN, d.id + '/' + fn);
      if (hue && x && FUNCS[fn].fam === 'cat') 참(hue !== x, d.id + '/' + fn + ' x 와 hue 가 같음');
    }
  });
}
