/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */
// main.js — 탭을 그리고 주소(해시)에 맞는 화면을 부른다

import './style.css';
import { h, closeModal } from './lib/ui.js';
import { ITEMS } from './lib/store.js';
import { FUNC_ORDER } from './lib/code.js';
import * as topic from './tabs/t1-topic.js';
import * as find from './tabs/t2-find.js';
import * as func from './tabs/t3-func.js';
import * as compare from './tabs/t4-compare.js';
import * as help from './tabs/t5-help.js';

const TABS = [
  { k: 'topic', e: '🗂️', n: '주제별 보기', mod: topic },
  { k: 'find', e: '🔎', n: '찾기', mod: find },
  { k: 'func', e: '🎨', n: '그래프 함수로 고르기', mod: func },
  { k: 'compare', e: '🔀', n: '맷플롯립 ↔ 씨본', mod: compare },
  { k: 'help', e: '📖', n: '안내', mod: help },
];

/** 화면 옮기기 — go('func/barplot') */
export function go(hash) {
  window.location.hash = '#' + hash;
}

function route() {
  closeModal();
  const raw = decodeURI(window.location.hash.replace(/^#/, ''));
  const [key, ...rest] = raw.split('/');
  const tab = TABS.find((t) => t.k === key) || TABS[0];
  document.querySelectorAll('.tab').forEach((b) => {
    b.classList.toggle('on', b.dataset.k === tab.k);
  });
  tab.mod.render(rest.join('/'));
}

/** 머리말(탭 막대 포함)이 화면 위에 붙어 있으므로, 그 높이만큼 제목이 가려지지 않게 알려 준다 */
function syncTopHeight() {
  const top = document.querySelector('.top');
  if (!top) return;
  // 좁은 화면에서는 머리말이 붙박이가 아니므로(style.css) 가릴 것이 없다
  const h = getComputedStyle(top).position === 'sticky' ? top.offsetHeight : 0;
  document.documentElement.style.setProperty('--top-h', h + 'px');
}

function boot() {
  const app = document.getElementById('app');
  app.appendChild(h('header.top', {},
    h('div.brand', {},
      h('button.logo', { onclick: () => go('topic'), title: '처음으로' }, '🌊'),
      h('div', {},
        h('h1', {}, 'Seaborn 데이터 도감'),
        h('p', {}, 'sns.load_dataset( ) 한 줄로 부르는 예제 데이터 ' + ITEMS.length
          + '개와 그래프 함수 ' + FUNC_ORDER.length + '가지'))),
    h('nav.tabs', {}, TABS.map((t) => h('button.tab', {
      'data-k': t.k, onclick: () => go(t.k),
    }, t.e + ' ' + t.n)))));

  app.appendChild(h('main', { id: 'screen' }));

  app.appendChild(h('footer.foot', {},
    h('p', {}, '© 2026 티쳐무 · 모든 권리 보유 — 학교 수업 목적으로만 이용해 주세요.'),
    h('p.dim', {}, '데이터셋은 seaborn-data 저장소에 실린 것이며 원래 출처가 각각 따로 있습니다. '
      + '이 앱은 값이 아니라 「어떤 자료인가」만 담고 있습니다.')));

  window.addEventListener('hashchange', route);
  window.addEventListener('resize', syncTopHeight);
  syncTopHeight();
  route();
}

boot();
