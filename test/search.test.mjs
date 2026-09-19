/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */
// search.test.mjs — 찾기

import { search, chosung, itemsFor, allTags } from '../src/lib/store.js';
import { 묶음, 시험, 같다, 참 } from './harness.mjs';

const ids = (list) => list.map((d) => d.id).sort();

export default function () {
  묶음('찾기');

  시험('초성 만들기', () => {
    같다(chosung('펭귄'), 'ㅍㄱ');
    같다(chosung('타이타닉 a'), 'ㅌㅇㅌㄴ a');
  });

  시험('한국어 제목으로', () => 참(ids(search('펭귄')).includes('penguins')));
  시험('초성으로', () => {
    참(ids(search('ㅍㄱ')).includes('penguins'));
    참(ids(search('ㅌㅇㅌㄴ')).includes('titanic'));
  });
  시험('영어 이름으로', () => 같다(ids(search('titanic')), ['titanic']));
  시험('컬럼 이름으로', () => 참(ids(search('price')).includes('diamonds')));
  시험('컬럼 뜻(한국어)으로', () => {
    참(ids(search('나이')).includes('titanic'));
    참(ids(search('맥박')).includes('exercise'));
  });
  시험('여러 낱말은 모두 들어 있어야', () => 같다(ids(search('tips 요일')), ['tips']));
  시험('없는 것', () => 같다(search('zzzz').length, 0));

  시험('조건 — 날짜 열이 있는 것', () => 같다(ids(search('', { hasTime: true })), ['dowjones', 'seaice', 'taxis']));
  시험('조건 — 빠진 값이 있는 것', () => 같다(ids(search('', { hasNa: true })), ['mpg', 'penguins', 'planets', 'taxis', 'titanic']));
  시험('조건 — 선그래프를 그릴 수 있는 것', () => {
    같다(ids(search('', { fn: 'lineplot' })), ids(itemsFor('lineplot')));
    참(ids(search('', { fn: 'lineplot' })).includes('flights'));
  });
  시험('조건 — 갈래와 난이도를 함께', () => {
    for (const d of search('', { cat: 'lab', level: 1 })) 참(d.cat === 'lab' && d.level === 1, d.id);
  });

  시험('함수별 목록은 추천 물음이 있는 자료가 앞', () => {
    const list = itemsFor('boxplot');
    const firstNo = list.findIndex((d) => !d.picks.some((p) => p.fn === 'boxplot'));
    const lastYes = list.map((d) => d.picks.some((p) => p.fn === 'boxplot')).lastIndexOf(true);
    참(firstNo === -1 || lastYes < firstNo);
  });

  시험('특징 태그 목록', () => 참(allTags().includes('시계열') && allTags().includes('반복 측정')));
}
