/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */
// t2-find.js — 이름·제목·컬럼 이름·초성으로 찾기 + 조건으로 좁히기

import { h, paint, beginScreen } from '../lib/ui.js';
import { CATS, LEVELS, search, allTags, sortById } from '../lib/store.js';
import { FUNCS, FUNC_ORDER } from '../lib/code.js';
import { datasetCard } from '../lib/card.js';

// 탭을 옮겼다 와도 찾던 것이 남아 있게 한다
const S = { q: '', cat: '', level: '', fn: '', tag: '', hasTime: false, hasNa: false };

export function render(arg) {
  beginScreen();
  if (arg) S.q = decodeURIComponent(arg);

  const box = h('input.search', {
    type: 'search', value: S.q, placeholder: '이름 · 제목 · 컬럼 이름 · 초성 (예: tips, 펭귄, ㅍㄱ, price, 나이)',
    'aria-label': '데이터셋 찾기',
  });
  box.addEventListener('input', () => { S.q = box.value; refresh(); });

  const results = h('div.results');

  paint(
    h('div.lead', {},
      h('h2', {}, '데이터셋 찾기'),
      h('p', {}, '영어 이름뿐 아니라 한국어 제목, 컬럼 이름, 컬럼의 뜻(예: 「나이」·「요금」)까지 함께 뒤집니다. '
        + '「ㅍㄱ」처럼 초성만 넣어도 찾습니다.')),
    h('div.searchrow', {}, box,
      h('button.clear', { onclick: () => { S.q = ''; box.value = ''; box.focus(); refresh(); } }, '지우기')),
    h('div.filters', {},
      picker('갈래', S.cat, [['', '모든 갈래']].concat(CATS.map((c) => [c.k, c.e + ' ' + c.n])), (v) => { S.cat = v; }),
      picker('난이도', S.level, [['', '모든 난이도']].concat(Object.entries(LEVELS)), (v) => { S.level = v; }),
      picker('그릴 함수', S.fn, [['', '아무 함수']].concat(FUNC_ORDER.map((k) => [k, k + ' — ' + FUNCS[k].ko])),
        (v) => { S.fn = v; }),
      picker('특징', S.tag, [['', '아무 특징']].concat(allTags().map((t) => [t, t])), (v) => { S.tag = v; }),
      check('날짜 열이 있는 것', 'hasTime'),
      check('빠진 값이 있는 것', 'hasNa'),
      h('button.reset', {
        onclick: () => {
          Object.assign(S, { q: '', cat: '', level: '', fn: '', tag: '', hasTime: false, hasNa: false });
          render();
        },
      }, '조건 모두 지우기')),
    results);

  refresh();

  function refresh() {
    const list = search(S.q, {
      cat: S.cat || null, level: S.level || null, fn: S.fn || null, tag: S.tag || null,
      hasTime: S.hasTime, hasNa: S.hasNa,
    }).sort(sortById);
    results.textContent = '';
    results.appendChild(h('p.count', {},
      list.length ? list.length + '개를 찾았습니다.' : '조건에 맞는 데이터셋이 없습니다.'));
    if (!list.length) {
      results.appendChild(h('p.dim', {}, '검색어를 줄이거나 조건을 지워 보세요. seaborn 의 예제 데이터는 모두 22개뿐입니다 — '
        + '더 많은 자료가 필요하면 PyDataset 데이터 도감(757개)을 함께 보세요.'));
      return;
    }
    results.appendChild(h('div.grid', {}, list.map((d) => datasetCard(d))));
  }

  function picker(label, value, opts, set) {
    const sel = h('select', { 'aria-label': label },
      opts.map(([v, t]) => h('option', { value: v, selected: String(v) === String(value) ? 'selected' : null }, t)));
    sel.addEventListener('change', () => { set(sel.value); refresh(); });
    return h('label.pick', {}, h('span', {}, label), sel);
  }

  function check(label, key) {
    return h('label.check', {},
      h('input', {
        type: 'checkbox', checked: S[key] ? 'checked' : null,
        onchange: (e) => { S[key] = e.target.checked; refresh(); },
      }),
      h('span', {}, label));
  }
}
