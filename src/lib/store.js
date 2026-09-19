/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */
// store.js — 자료를 담아 두고 찾아 주는 곳
//
// ⚠ DOM 없음 — 시험(node)이 그대로 부른다.

import raw from '../data/catalog.js';
import { drawable } from './code.js';

export const META = raw.meta;
export const FACTS = raw.meta.facts;
export const ITEMS = raw.items;
export const CATS = META.cats;
export const LEVELS = META.levels;

const BY_ID = Object.fromEntries(ITEMS.map((d) => [d.id, d]));
export const byId = (id) => BY_ID[id];

const CAT_BY_KEY = Object.fromEntries(CATS.map((c) => [c.k, c]));
export const cat = (k) => CAT_BY_KEY[k] || { k, e: '❓', n: k, d: '' };

// 그릴 수 있는 함수는 한 번만 셈해 둔다
const DRAW = new Map(ITEMS.map((d) => [d.id, drawable(d)]));
export const fnsOf = (d) => DRAW.get(d.id) || [];

/** 이 함수로 그릴 수 있는 자료 — 추천(picks)에 넣은 것을 앞으로 */
export function itemsFor(fn) {
  const list = ITEMS.filter((d) => fnsOf(d).includes(fn));
  const picked = (d) => (d.picks.some((p) => p.fn === fn) ? 0 : 1);
  return list.sort((a, b) => picked(a) - picked(b) || a.level - b.level || a.id.localeCompare(b.id));
}

/** 이 자료에서 그 함수에 붙인 물음 */
export const pickOf = (d, fn) => d.picks.find((p) => p.fn === fn) || null;

// ── 초성 찾기 ─────────────────────────────────────────────────────
// 「ㅍㄱ」로 「펭귄」을 찾을 수 있게 한다.
const CHO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

export function chosung(s) {
  let out = '';
  for (const ch of String(s)) {
    const c = ch.charCodeAt(0) - 0xac00;
    out += (c >= 0 && c <= 11171) ? CHO[Math.floor(c / 588)] : ch;
  }
  return out;
}

const isChosungQuery = (q) => /^[ㄱ-ㅎ]+$/.test(q.replace(/\s/g, ''));

// 찾기에 쓰려고 미리 만들어 두는 글자 뭉치 — 이름·제목·설명·컬럼 이름과 뜻·태그
const HAY = new Map();
for (const d of ITEMS) {
  const cols = d.cols.map((c) => c.n).join(' ');
  const colko = Object.values(d.colko).join(' ');
  const plain = [d.id, d.ko, d.desc, cols, colko, cat(d.cat).n, d.tags.join(' ')].join(' ');
  HAY.set(d.id, { low: plain.toLowerCase(), cho: chosung(d.ko + ' ' + colko).replace(/\s/g, '') });
}

/**
 * 찾기.  q 는 이름·제목·컬럼 이름·초성 무엇이든 된다.
 * f 는 좁히기 조건 — {cat, level, fn, tag, hasTime, hasNa}
 */
export function search(q, f) {
  const opt = f || {};
  const query = String(q || '').trim();
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const cho = isChosungQuery(query) ? query.replace(/\s/g, '') : null;

  return ITEMS.filter((d) => {
    if (opt.cat && d.cat !== opt.cat) return false;
    if (opt.level && d.level !== Number(opt.level)) return false;
    if (opt.fn && !fnsOf(d).includes(opt.fn)) return false;
    if (opt.tag && !d.tags.includes(opt.tag)) return false;
    if (opt.hasTime && !d.cols.some((c) => c.k === 'time')) return false;
    if (opt.hasNa && !d.cols.some((c) => c.na > 0)) return false;
    if (!query) return true;
    const hay = HAY.get(d.id);
    if (cho) return hay.cho.includes(cho);
    return words.every((w) => hay.low.includes(w));
  });
}

export const allTags = () => [...new Set(ITEMS.flatMap((d) => d.tags))].sort();

/** 빠진 값이 있는 칸 수 */
export const naTotal = (d) => d.cols.reduce((s, c) => s + c.na, 0);

export const sortById = (a, b) => a.id.localeCompare(b.id);
