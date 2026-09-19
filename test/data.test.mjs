/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */
// data.test.mjs — 자료(catalog.js)가 성한가, 화면 글과 실제 값이 맞는가

import { ITEMS, CATS, FACTS, META, byId } from '../src/lib/store.js';
import { 묶음, 시험, 같다, 참 } from './harness.mjs';

const col = (id, n) => byId(id).cols.find((c) => c.n === n);

export default function () {
  묶음('자료의 틀');

  시험('데이터셋은 22개이고 이름 차례대로 놓여 있다', () => {
    같다(ITEMS.length, 22);
    같다(ITEMS.map((d) => d.id), ITEMS.map((d) => d.id).slice().sort());
  });

  시험('갈래는 7개이고 갈래마다 자료가 둘 이상 있다', () => {
    같다(CATS.length, 7);
    for (const c of CATS) 참(ITEMS.filter((d) => d.cat === c.k).length >= 2, c.k + ' 에 자료가 모자람');
    for (const d of ITEMS) 참(CATS.some((c) => c.k === d.cat), d.id + ' 의 갈래가 없음');
  });

  시험('난이도는 1·2·3 가운데 하나', () => {
    for (const d of ITEMS) 참([1, 2, 3].includes(d.level), d.id);
  });

  시험('잘 아는 자료의 크기', () => {
    const want = {
      tips: [244, 7], iris: [150, 5], titanic: [891, 15], penguins: [344, 7], diamonds: [53940, 10],
      brain_networks: [920, 62], taxis: [6433, 14], mpg: [398, 9], flights: [144, 3], anscombe: [44, 3],
    };
    for (const [id, rc] of Object.entries(want)) 같다([byId(id).r, byId(id).c], rc, id);
  });

  시험('모든 컬럼에 한국어 뜻이 붙어 있다 (brain_networks 는 62개라 빼고)', () => {
    for (const d of ITEMS) {
      if (d.id === 'brain_networks') continue;
      for (const c of d.cols) 참(d.colko[c.n], d.id + ' 의 ' + c.n + ' 에 뜻이 없음');
    }
  });

  시험('한국어 제목·설명·한 행·출처가 모두 채워져 있다', () => {
    for (const d of ITEMS) {
      참(d.ko && d.desc.length > 40 && d.row && d.src, d.id);
    }
  });

  시험('값(행)을 담지 않는다 — 범주 이름은 12개 이하일 때만, 자료 전체가 작다', () => {
    for (const d of ITEMS) {
      for (const c of d.cols) if (c.lv) 참(c.lv.length <= 12, d.id + '/' + c.n);
      for (const k of ['rows', 'head', 'data', 'values']) 참(!(k in d), d.id + ' 에 ' + k + ' 가 있음');
    }
    참(JSON.stringify(ITEMS).length < 60000, '자료가 너무 큽니다 — 값이 섞였는지 보세요');
  });

  묶음('역할(roles) 이 가리키는 열');

  시험('역할에 적은 열이 모두 실제로 있다', () => {
    for (const d of ITEMS) {
      const R = d.roles;
      const names = [];
      for (const k of ['v', 'rate', 'hue', 'col', 'label']) if (R[k]) names.push(R[k]);
      for (const k of ['xy', 'cat', 'num', 'pair', 'wide', 'log']) if (R[k]) names.push(...R[k]);
      if (R.line) names.push(R.line.x, R.line.y, ...(R.line.hue ? [R.line.hue] : []));
      if (R.pivot) names.push(R.pivot.index, R.pivot.columns, R.pivot.values);
      for (const n of names) 참(d.cols.some((c) => c.n === n), d.id + ' 에 ' + n + ' 열이 없음');
    }
  });

  시험('숫자 자리(xy·v·num·wide)에는 숫자 열만', () => {
    for (const d of ITEMS) {
      const R = d.roles;
      const nums = [...(R.xy || []), ...(R.num || []), ...(R.wide || []), ...(R.v ? [R.v] : [])];
      for (const n of nums) 같다(d.cols.find((c) => c.n === n).k, 'num', d.id + '/' + n);
    }
  });

  시험('색·칸으로 나눌 열(hue·col)은 범주이고 무리가 12개 이하', () => {
    for (const d of ITEMS) {
      for (const k of ['hue', 'col']) {
        const n = d.roles[k];
        if (!n) continue;
        const c = d.cols.find((x) => x.n === n);
        참(c.k === 'cat' || c.k === 'bool', d.id + '/' + n + ' 가 범주가 아님');
        참(c.u <= 12, d.id + '/' + n + ' 무리가 너무 많음');
      }
    }
  });

  시험('rate(비율) 열은 0·1 로만 되어 있다', () => {
    for (const d of ITEMS) {
      if (!d.roles.rate) continue;
      const c = d.cols.find((x) => x.n === d.roles.rate);
      같다([c.lo, c.hi, c.u], [0, 1, 2], d.id);
    }
  });

  시험('pivot 표의 칸이 겹치지 않는다 (df.pivot 이 오류 없이 된다)', () => {
    같다(FACTS.pivotUnique, { flights: true, glue: true });
  });

  묶음('build_data.py 가 확인한 사실');

  시험('load_dataset 이 손질하는 자료는 9개', () => {
    같다(Object.keys(FACTS.diff).sort(),
      ['diamonds', 'dowjones', 'exercise', 'flights', 'penguins', 'seaice', 'taxis', 'tips', 'titanic']);
  });

  시험('tips 요일 차례 세 가지', () => {
    같다(FACTS.tipsDay.appear, ['Sun', 'Sat', 'Thur', 'Fri']);
    같다(FACTS.tipsDay.groupby, ['Fri', 'Sat', 'Sun', 'Thur']);
    같다(FACTS.tipsDay.load, ['Thur', 'Fri', 'Sat', 'Sun']);
  });

  시험('flights 의 달 이름이 January → Jan 으로 바뀐다', () => {
    const m = FACTS.diff.flights.find((x) => x.c === 'month');
    참(m.renamed);
    같다(m.rawSample[0], 'January');
    같다(m.order[0], 'Jan');
  });

  시험('penguins 의 성별 글자가 MALE → Male 로 바뀐다', () => {
    const s = FACTS.diff.penguins.find((x) => x.c === 'sex');
    같다([s.rawSample, s.newSample], [['FEMALE', 'MALE'], ['Female', 'Male']]);
  });

  시험('범주형 groupby 경고가 나고 observed=True 로 사라진다', () => {
    참(FACTS.observedWarn);
    참(FACTS.observedFixed);
  });

  시험('brain_networks — 그냥 부르면 923×63 글자 표, 머리글 3줄이면 920×62', () => {
    같다(FACTS.brain.plain, [923, 63]);
    같다(FACTS.brain.fixed, [920, 62]);
    같다(FACTS.brain.plainNumeric, 0);
    같다(FACTS.brain.plainFirst, ['node', 'hemi', null]);
    같다(FACTS.brain.networks, 17);
  });

  시험("'Unnamed: 0' 은 attention·exercise 에만", () => {
    같다(FACTS.unnamed, ['attention', 'exercise']);
  });

  시험('PyDataset 과 이름이 같은 8개와 견준 결과', () => {
    const rel = Object.fromEntries(Object.entries(FACTS.twins).map(([k, t]) => [k, t.rel]));
    같다(rel, {
      anscombe: 'reshaped', diamonds: 'same', geyser: 'different', iris: 'renamed',
      mpg: 'different', planets: 'different', tips: 'same', titanic: 'different',
    });
    참(FACTS.geyserFaithful, 'geyser 가 faithful 과 같다는 확인');
  });

  시험('sns.set_theme( ) 이 한글 글꼴을 되돌리고, font= 를 주면 남는다', () => {
    같다(FACTS.setTheme, { before: ['NanumGothic'], after: ['sans-serif'], fixed: ['NanumGothic'] });
  });

  시험('titanic 의 겹치는 열 다섯 쌍이 모두 891명에서 맞는다', () => {
    const t = FACTS.titanic;
    for (const k of ['survived=alive', 'pclass=class', 'embarked=embark_town', 'adult_male=who', 'alone=sibsp+parch']) {
      참(t[k], k);
    }
    같다([t.rows, t.deckNa], [891, 688]);
  });

  시험('anagrams 를 펴면 attention 과 같다', () => {
    같다(FACTS.anagrams, { wide: [20, 5], long: [60, 4], attention: [60, 5], same: true });
  });

  시험('앤스컴 네 묶음의 평균·상관이 거의 같다', () => {
    for (const k of ['I', 'II', 'III', 'IV']) {
      const a = FACTS.anscombe[k];
      같다([a.mx, a.my, a.n], [9, 7.5, 11], k);
      참(Math.abs(a.r - 0.816) < 0.002, k + ' 상관 ' + a.r);
    }
  });

  시험('다이아몬드 크기 0 은 20개', () => 같다(FACTS.diamondsZero, 20));

  시험('geyser 의 kind 는 기다린 시간 67/68분에서 갈린다 (분출 시간으로는 겹친다)', () => {
    const g = FACTS.geyser;
    같다([g.shortMaxWait, g.longMinWait], [67, 68]);
    참(g.shortMaxDur > g.longMinDur);
  });

  시험('np.polyfit 은 빠진 값이 있으면 셈을 끝내지 못한다', () => {
    참(FACTS.polyfitNaN !== 'ok');
    같다(FACTS.mpgHorsepowerNa, 6);
  });

  시험('fmri 한 점에 28개 = 참가자 14명 × 영역 2곳', () => {
    같다(FACTS.fmri, { perPoint: 28, allSame: true, subjects: 14, regions: 2 });
  });

  묶음('화면에 적은 글이 실제 값과 맞는가');

  시험('설명 속 숫자', () => {
    참(byId('titanic').desc.includes('891명') && byId('titanic').r === 891);
    참(byId('iris').desc.includes('50송이씩') && byId('iris').r === 150 && col('iris', 'species').u === 3);
    참(byId('fmri').desc.includes('14명') && FACTS.fmri.subjects === 14);
    참(byId('car_crashes').desc.includes('워싱턴 D.C.') && byId('car_crashes').r === 51 && FACTS.carDC);
    참(byId('exercise').desc.includes('30명') && col('exercise', 'id').u === 30);
    참(byId('attention').desc.includes('20명') && col('attention', 'subject').u === 20);
    참(byId('glue').desc.includes('모델 8개') && col('glue', 'Model').u === 8 && col('glue', 'Task').u === 8);
    참(byId('healthexp').desc.includes('여섯 나라') && col('healthexp', 'Country').u === 6);
    참(byId('brain_networks').desc.includes('62개') && byId('brain_networks').c === 62);
    참(byId('brain_networks').desc.includes('920줄') && byId('brain_networks').r === 920);
    참(byId('brain_networks').desc.includes('17개 연결망') && FACTS.brain.networks === 17);
    참(byId('diamonds').desc.includes('5만 4천') && Math.round(byId('diamonds').r / 1000) === 54);
    참(byId('taxis').desc.includes('6천 개') && Math.floor(byId('taxis').r / 1000) === 6);
  });

  시험('설명 속 기간', () => {
    const yr = (id, n) => [col(id, n).lo, col(id, n).hi];
    같다(yr('flights', 'year'), [1949, 1960]);
    참(byId('flights').desc.includes('1949년부터 1960년까지'));
    같다(yr('healthexp', 'Year'), [1970, 2020]);
    참(byId('healthexp').desc.includes('1970년부터 2020년까지'));
    같다(yr('mpg', 'model_year'), [70, 82]);
    참(byId('mpg').desc.includes('1970년부터 1982년까지'));
    같다(yr('dowjones', 'Date'), ['1914-12-01', '1968-12-01']);
    참(byId('dowjones').desc.includes('1914년 12월부터 1968년 12월까지'));
    같다([col('seaice', 'Date').lo.slice(0, 4), col('seaice', 'Date').hi.slice(0, 4)], ['1980', '2019']);
    참(byId('seaice').desc.includes('1980년부터 2019년까지'));
  });

  시험('geyser 의 kind 뜻이 「기다린 시간」으로 적혀 있다 (분출 길이가 아니다)', () => {
    참(byId('geyser').colko.kind.includes('기다린 시간'));
    참(!byId('geyser').desc.includes('분출이 긴지'));
  });

  시험('버전이 코랩과 같은 줄기다 (seaborn 0.13 · 판다스 2.2)', () => {
    참(META.seaborn.startsWith('0.13'), META.seaborn);
    참(META.pandas.startsWith('2.2'), META.pandas);
  });
}
