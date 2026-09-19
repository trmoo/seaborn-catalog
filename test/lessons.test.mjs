/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */
// lessons.test.mjs — 「맷플롯립 ↔ 씨본」 과 「안내」 의 코드·글이 사실과 맞는가

import { byId, FACTS } from '../src/lib/store.js';
import { COMPARE, TIDY, SNIPS, allSnippets, drawLines } from '../src/lib/lessons.js';
import { quoted } from './code.test.mjs';
import { 묶음, 시험, 같다, 참, 거짓 } from './harness.mjs';

const HANGUL = /[가-힣]/;

export default function () {
  묶음('맷플롯립 ↔ 씨본');

  시험('짝은 7개, 자료가 실제로 있고 세 코드 모두 그 자료를 부른다', () => {
    같다(COMPARE.length, 7);
    for (const c of COMPARE) {
      참(byId(c.data), c.k);
      for (const k of ['mpl', 'sns', 'more']) 참(c[k].includes("sns.load_dataset('" + c.data + "')"), c.k + '/' + k);
      참(c.points.length >= 2, c.k);
    }
  });

  시험('씨본 쪽이 언제나 더 짧다', () => {
    for (const c of COMPARE) 참(drawLines(c.sns) < drawLines(c.mpl), c.k + ' ' + drawLines(c.sns) + ' vs ' + drawLines(c.mpl));
  });

  시험('그리는 줄 세기 — import·불러오기·show·주석은 세지 않는다', () => {
    같다(drawLines("import seaborn as sns\n\ndf = sns.load_dataset('tips')\n# 주석\nsns.barplot(data=df)\nplt.show()"), 1);
  });

  시험('그래프 안에 한글이 들어가지 않는다', () => {
    for (const [key, code] of allSnippets()) {
      if (key === 'snip/font' || key === 'snip/themeTrap') continue;   // 글꼴 이름·설정만 있는 조각
      for (const s of quoted(code)) 거짓(HANGUL.test(s.replace(/\{[^}]*\}/g, '')), key + ' 의 ' + s);
    }
  });

  시험('fmri 짝의 「참가자 14명 × 뇌 영역 2곳」 이 사실과 맞다', () => {
    const c = COMPARE.find((x) => x.k === 'line');
    참(c.points[0].includes('14명') && c.points[0].includes('2곳'));
    같다(FACTS.fmri.subjects * FACTS.fmri.regions, FACTS.fmri.perPoint);
  });

  시험('회귀 짝의 「dropna 해야 polyfit 이 셈을 끝낸다」 가 사실과 맞다', () => {
    const c = COMPARE.find((x) => x.k === 'reg');
    참(c.mpl.includes('.dropna()'));
    참(FACTS.polyfitNaN !== 'ok' && FACTS.mpgHorsepowerNa > 0);
  });

  시험('막대 짝의 맷플롯립 쪽은 observed=True 로 경고를 막는다', () => {
    참(COMPARE.find((x) => x.k === 'bar').mpl.includes('observed=True'));
  });

  시험('칸 나누기 짝의 맷플롯립 쪽은 1차시에서 배운 plt.subplot(숫자) 방식', () => {
    const c = COMPARE.find((x) => x.k === 'facet').mpl;
    참(c.includes('plt.subplot(1, 2, n)'));
    거짓(c.includes('plt.subplots('));
  });

  묶음('안내 탭의 조각');

  시험('실행하지 않는 조각은 코랩 전용 둘뿐', () => {
    같다(allSnippets().filter(([, , run]) => !run).map(([k]) => k), ['snip/font', 'snip/themeTrap']);
  });

  시험('order= 와 오프라인 조각의 요일 차례가 load_dataset 과 같다', () => {
    const want = "['" + FACTS.tipsDay.load.join("', '") + "']";
    참(SNIPS.order.includes(want));
    참(SNIPS.offline.includes(want));
  });

  시험('글꼴 조각은 set_theme 안에 글꼴을 함께 적는다', () => {
    참(SNIPS.font.code.includes("sns.set_theme(font='NanumGothic')"));
    참(SNIPS.themeTrap.code.includes('sns.set_theme()'));
  });

  시험('savefig 는 show 보다 먼저', () => {
    참(SNIPS.save.indexOf('plt.savefig') < SNIPS.save.indexOf('plt.show'));
  });

  시험('melt 조각이 쓰는 열이 anagrams 에 있다', () => {
    const names = byId('anagrams').cols.map((c) => c.n);
    for (const n of ['subidr', 'attnr', 'num1', 'num2', 'num3']) 참(names.includes(n), n);
    참(TIDY.melt.includes('.melt('));
  });
}
