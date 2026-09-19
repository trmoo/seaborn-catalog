/*! Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요. */
// lessons.js — 「맷플롯립 ↔ 씨본」 탭과 「안내」 탭에 싣는 예제 코드
//
// ⚠ DOM 없음. tools/dump-code.mjs 가 이 파일의 코드를 전부 꺼내 tools/verify_code.py 로 실행해 본다.
//   noexec: true 인 것만 건너뛴다 (코랩 전용 명령 ! 이 들어 있는 것).
// ⚠ 그래프 안에 한글을 넣지 않는다 (코랩은 글꼴이 없어 □□□ 로 깨진다). 설명은 # 주석으로 단다.

const HEAD = 'import seaborn as sns\nimport matplotlib.pyplot as plt\n';
const load = (name) => HEAD + '\ndf = sns.load_dataset(' + "'" + name + "'" + ')\n';

/**
 * 같은 그래프를 두 방식으로.
 * data — 쓰는 데이터셋, mpl — 맷플롯립만으로, sns — 씨본으로, more — 씨본에서 한 단어 더 넣으면
 */
export const COMPARE = [
  {
    k: 'bar', e: '📊', title: '무리마다 평균을 막대로', data: 'tips',
    mpl: load('tips')
      + '# 요일마다 평균을 먼저 셈한다\n'
      + "평균 = df.groupby('day', observed=True)['total_bill'].mean()\n"
      + 'plt.bar(평균.index.astype(str), 평균.values)\n'
      + "plt.xlabel('day')\nplt.ylabel('total_bill')\nplt.show()",
    sns: load('tips')
      + "sns.barplot(data=df, x='day', y='total_bill', errorbar=None)\nplt.show()",
    more: load('tips')
      + '# 성별로 한 번 더 나누기\n'
      + "sns.barplot(data=df, x='day', y='total_bill', hue='sex')\nplt.show()",
    points: [
      '맷플롯립은 평균을 먼저 셈해(groupby) 그 결과를 그립니다. 씨본은 원래 표를 그대로 주면 평균은 알아서 셉니다.',
      '씨본 막대 끝의 검은 선은 95% 신뢰구간입니다. 맷플롯립 그림과 똑같이 보려고 errorbar=None 으로 껐습니다.',
      '신뢰구간은 표본을 여러 번 다시 뽑아 셈하기(부트스트랩) 때문에, 실행할 때마다 선의 길이가 아주 조금씩 달라질 수 있습니다.',
    ],
  },
  {
    k: 'hue', e: '🎨', title: '무리마다 색을 달리한 산점도', data: 'penguins',
    mpl: load('penguins')
      + '# 종마다 한 번씩 찍는다\n'
      + "for 종, 무리 in df.groupby('species'):\n"
      + "    plt.scatter(무리['flipper_length_mm'], 무리['body_mass_g'], label=종)\n"
      + "plt.xlabel('flipper_length_mm')\nplt.ylabel('body_mass_g')\nplt.legend(title='species')\nplt.show()",
    sns: load('penguins')
      + "sns.scatterplot(data=df, x='flipper_length_mm', y='body_mass_g', hue='species')\nplt.show()",
    more: load('penguins')
      + '# 성별은 점 모양으로\n'
      + "sns.scatterplot(data=df, x='flipper_length_mm', y='body_mass_g',\n"
      + "                hue='species', style='sex')\nplt.show()",
    points: [
      '맷플롯립은 무리마다 for 문을 돌며 한 번씩 찍고 범례도 직접 붙입니다.',
      '씨본은 hue= 한 단어로 색을 나누고 범례까지 붙입니다. style= · size= 로 모양과 크기도 나눌 수 있습니다.',
    ],
  },
  {
    k: 'hist', e: '📶', title: '무리마다 겹쳐 그린 히스토그램', data: 'penguins',
    mpl: load('penguins')
      + "for 종, 무리 in df.groupby('species'):\n"
      + "    plt.hist(무리['body_mass_g'], bins=15, alpha=0.5, label=종)\n"
      + "plt.xlabel('body_mass_g')\nplt.ylabel('Count')\nplt.legend(title='species')\nplt.show()",
    sns: load('penguins')
      + "sns.histplot(data=df, x='body_mass_g', hue='species', bins=15)\nplt.show()",
    more: load('penguins')
      + '# 밀도 곡선을 함께\n'
      + "sns.histplot(data=df, x='body_mass_g', hue='species', kde=True)\nplt.show()",
    points: [
      '겹칠 때 뒤쪽이 가려지지 않게 맷플롯립은 alpha 를 직접 정합니다. 씨본은 알아서 반투명하게 겹칩니다.',
      'kde=True 한 단어면 부드러운 밀도 곡선이 함께 그려집니다.',
    ],
  },
  {
    k: 'line', e: '📈', title: '여러 번 잰 값의 평균 선', data: 'fmri',
    mpl: load('fmri')
      + '# 시점 × 사건마다 평균을 먼저 셈해 표로 편다\n'
      + "평균 = df.groupby(['timepoint', 'event'])['signal'].mean().unstack()\n"
      + 'for 사건 in 평균.columns:\n'
      + '    plt.plot(평균.index, 평균[사건], label=사건)\n'
      + "plt.xlabel('timepoint')\nplt.ylabel('signal')\nplt.legend(title='event')\nplt.show()",
    sns: load('fmri')
      + "sns.lineplot(data=df, x='timepoint', y='signal', hue='event')\nplt.show()",
    more: load('fmri')
      + "sns.lineplot(data=df, x='timepoint', y='signal', hue='event', style='region')\nplt.show()",
    points: [
      'fmri 는 한 시점·한 사건에 값이 여러 개 있습니다(참가자 14명 × 뇌 영역 2곳). 맷플롯립은 평균표를 먼저 만들어야 합니다.',
      '씨본 lineplot 은 같은 x 에 값이 여럿이면 평균을 잇고, 둘레에 95% 신뢰구간 띠를 스스로 칠합니다.',
      '띠가 넓으면 사람마다 값이 크게 달랐다는 뜻입니다. 평균 선만 보면 놓치는 정보입니다.',
    ],
  },
  {
    k: 'facet', e: '🪟', title: '무리마다 칸을 나누어 그리기', data: 'tips',
    mpl: load('tips')
      + 'plt.figure(figsize=(10, 4))\n'
      + "for n, 때 in enumerate(['Lunch', 'Dinner'], start=1):\n"
      + '    plt.subplot(1, 2, n)   # 1줄 2칸 가운데 n 번째\n'
      + "    무리 = df[df['time'] == 때]\n"
      + "    plt.scatter(무리['total_bill'], 무리['tip'])\n"
      + '    plt.title(때)\n'
      + "    plt.xlabel('total_bill')\n    plt.ylabel('tip')\n"
      + 'plt.tight_layout()\nplt.show()',
    sns: load('tips')
      + "sns.relplot(data=df, x='total_bill', y='tip', col='time')\nplt.show()",
    more: load('tips')
      + "sns.relplot(data=df, x='total_bill', y='tip', col='time', row='smoker', hue='sex')\nplt.show()",
    points: [
      '맷플롯립은 subplot 으로 칸을 만들고 무리를 골라내 칸마다 따로 그립니다.',
      '씨본의 relplot·displot·catplot·lmplot 은 col= 하나로 칸을 나눕니다. row= 를 더하면 가로·세로로 나뉩니다.',
      '이 넷은 「그림 전체」를 만드는 함수라 plt.figure(figsize=…) 가 먹지 않습니다. 크기는 height= · aspect= 로 정합니다.',
    ],
  },
  {
    k: 'heat', e: '🟥', title: '상관계수 열지도', data: 'car_crashes',
    mpl: load('car_crashes')
      + "상관 = df[['total', 'speeding', 'alcohol', 'ins_premium']].corr()\n"
      + "plt.imshow(상관, cmap='coolwarm', vmin=-1, vmax=1)\n"
      + 'plt.colorbar()\n'
      + 'plt.xticks(range(len(상관)), 상관.columns, rotation=45)\n'
      + 'plt.yticks(range(len(상관)), 상관.columns)\n'
      + '# 칸마다 숫자 적기\n'
      + 'for i in range(len(상관)):\n'
      + '    for j in range(len(상관)):\n'
      + "        plt.text(j, i, f'{상관.iloc[i, j]:.2f}', ha='center', va='center')\n"
      + 'plt.tight_layout()\nplt.show()',
    sns: load('car_crashes')
      + "상관 = df[['total', 'speeding', 'alcohol', 'ins_premium']].corr()\n"
      + "sns.heatmap(상관, annot=True, fmt='.2f', cmap='coolwarm', vmin=-1, vmax=1)\nplt.show()",
    more: load('car_crashes')
      + '# 글자 열(주 이름)은 빼고 일곱 값 모두\n'
      + "상관 = df.drop(columns='abbrev').corr()\n"
      + "sns.clustermap(상관, annot=True, fmt='.2f', cmap='coolwarm', vmin=-1, vmax=1)\nplt.show()",
    points: [
      '맷플롯립은 칸 이름과 칸 안의 숫자를 반복문으로 하나씩 적습니다.',
      '씨본 heatmap 은 annot=True 한 단어로 숫자를 적고 칸 이름도 표에서 가져옵니다.',
      'vmin=-1, vmax=1 을 꼭 주세요. 빼면 색의 기준이 표 안의 가장 작은·큰 값에 맞춰져, 약한 상관도 진하게 보입니다.',
    ],
  },
  {
    k: 'reg', e: '📐', title: '산점도 위에 회귀선', data: 'mpg',
    mpl: HEAD + 'import numpy as np\n\ndf = sns.load_dataset(\'mpg\')\n'
      + '# 빠진 값을 먼저 빼야 한다\n'
      + "자료 = df[['horsepower', 'mpg']].dropna()\n"
      + "기울기, 절편 = np.polyfit(자료['horsepower'], 자료['mpg'], 1)\n"
      + "plt.scatter(자료['horsepower'], 자료['mpg'], alpha=0.5)\n"
      + "x = 자료['horsepower'].sort_values()\n"
      + "plt.plot(x, 기울기 * x + 절편, color='red')\n"
      + "plt.xlabel('horsepower')\nplt.ylabel('mpg')\nplt.show()",
    sns: load('mpg')
      + "sns.regplot(data=df, x='horsepower', y='mpg')\nplt.show()",
    more: load('mpg')
      + '# 생산 지역마다 선을 따로\n'
      + "sns.lmplot(data=df, x='horsepower', y='mpg', hue='origin')\nplt.show()",
    points: [
      'mpg 의 horsepower 에는 빠진 값이 있어, 맷플롯립 쪽은 dropna( ) 로 먼저 빼야 np.polyfit 이 셈을 끝냅니다.',
      '씨본 regplot 은 빠진 값을 알아서 빼고, 직선과 함께 신뢰구간 띠까지 그립니다.',
      'order=2 를 넣으면 곧은 선 대신 휘어진 곡선(2차식)으로 맞춥니다.',
    ],
  },
];

/** 씨본이 좋아하는 표 모양 — 넓은 표를 긴 표로 */
export const TIDY = {
  wide: HEAD + "\n넓은 = sns.load_dataset('anagrams')\n넓은.head()",
  melt: HEAD
    + "\n넓은 = sns.load_dataset('anagrams')\n"
    + "긴 = 넓은.melt(id_vars=['subidr', 'attnr'], value_vars=['num1', 'num2', 'num3'],\n"
    + "              var_name='solutions', value_name='score')\n"
    + "print(넓은.shape, '→', 긴.shape)\n"
    + "sns.pointplot(data=긴, x='solutions', y='score', hue='attnr')\nplt.show()",
  long: HEAD
    + "\ndf = sns.load_dataset('attention')          # 같은 실험을 처음부터 긴 표로 적은 것\n"
    + "sns.pointplot(data=df, x='solutions', y='score', hue='attention')\nplt.show()",
};

/** 안내 탭의 짧은 코드 */
export const SNIPS = {
  names: 'import seaborn as sns\n\nprint(sns.get_dataset_names())   # 쓸 수 있는 이름 22개',
  first: HEAD + "\ndf = sns.load_dataset('tips')\nprint(df.shape)\n"
    + "sns.scatterplot(data=df, x='total_bill', y='tip', hue='time')\nplt.show()",
  font: {
    noexec: true,
    code: '# 코랩에서 수업을 시작할 때 한 번만\n'
      + '!apt-get install -y -qq fonts-nanum > /dev/null 2>&1\n\n'
      + 'import matplotlib.pyplot as plt\n'
      + 'import matplotlib.font_manager as fm\n'
      + 'import seaborn as sns\n\n'
      + "fm.fontManager.addfont('/usr/share/fonts/truetype/nanum/NanumGothic.ttf')\n"
      + "sns.set_theme(font='NanumGothic')            # ★ 글꼴을 set_theme 안에 함께 적는다\n"
      + "plt.rc('axes', unicode_minus=False)          # 마이너스(-) 기호가 깨지지 않게",
  },
  themeTrap: {
    noexec: true,
    code: "plt.rc('font', family='NanumGothic')   # 한글 글꼴을 정했는데\n"
      + 'sns.set_theme()                        # ✗ 여기서 글꼴이 기본값으로 되돌아간다 → □□□',
  },
  order: HEAD + "\ndf = sns.load_dataset('tips')\n"
    + "sns.barplot(data=df, x='day', y='tip', order=['Thur', 'Fri', 'Sat', 'Sun'])   # 차례를 직접 정하기\nplt.show()",
  offline: 'import pandas as pd\nimport seaborn as sns\nimport matplotlib.pyplot as plt\n\n'
    + "df = pd.read_csv('tips.csv')                     # 미리 받아 둔 파일\n"
    + "df['day'] = pd.Categorical(df['day'], ['Thur', 'Fri', 'Sat', 'Sun'])   # 요일 차례를 직접 정한다\n"
    + "sns.barplot(data=df, x='day', y='tip')\nplt.show()",
  observed: HEAD + "\ndf = sns.load_dataset('tips')\n"
    + "평균 = df.groupby('day', observed=True)['tip'].mean()   # observed=True 를 붙인다\nprint(평균)",
  brainBad: HEAD + "\ndf = sns.load_dataset('brain_networks')        # ✗ 머리글을 한 줄로 읽는다\nprint(df.shape)\ndf.head(3)",
  brainGood: HEAD + "\ndf = sns.load_dataset('brain_networks', header=[0, 1, 2], index_col=0)\nprint(df.shape)\n"
    + "sns.clustermap(df.corr(), cmap='coolwarm', center=0)\nplt.show()",
  unnamed: HEAD + "\ndf = sns.load_dataset('exercise')\n"
    + "df = df.drop(columns='Unnamed: 0')          # 행 번호가 딸려 온 열은 버린다\ndf.head()",
  titanic: HEAD + "\ndf = sns.load_dataset('titanic')\n"
    + "print(pd.crosstab(df['survived'], df['alive']))   # 같은 정보를 두 번 적은 열",
  save: HEAD + "\ndf = sns.load_dataset('tips')\n"
    + "ax = sns.barplot(data=df, x='day', y='tip')\n"
    + "ax.set_title('Tip by day')      # 씨본 그래프도 결국 맷플롯립 그림이다\n"
    + "plt.savefig('tip_by_day.png', dpi=150, bbox_inches='tight')   # show( ) 보다 먼저\nplt.show()",
};

// titanic 조각은 pandas 를 쓴다
SNIPS.titanic = SNIPS.titanic.replace('import seaborn as sns\n', 'import pandas as pd\nimport seaborn as sns\n');

/** 모든 조각을 [이름, 코드, 실행해 볼까] 로 늘어놓는다 — tools/dump-code.mjs 가 쓴다 */
export function allSnippets() {
  const out = [];
  for (const c of COMPARE) {
    out.push(['compare/' + c.k + '/mpl', c.mpl, true]);
    out.push(['compare/' + c.k + '/sns', c.sns, true]);
    out.push(['compare/' + c.k + '/more', c.more, true]);
  }
  for (const [k, v] of Object.entries(TIDY)) out.push(['tidy/' + k, v, true]);
  for (const [k, v] of Object.entries(SNIPS)) {
    if (typeof v === 'string') out.push(['snip/' + k, v, true]);
    else out.push(['snip/' + k, v.code, !v.noexec]);
  }
  return out;
}

/** 두 코드의 「그리는 줄」 수 — import·불러오기·빈 줄·주석만 있는 줄·plt.show( ) 는 세지 않는다 */
export function drawLines(code) {
  return code.split('\n').filter((l) => {
    const s = l.trim();
    if (!s || s.startsWith('#')) return false;
    if (/^import |^from /.test(s)) return false;
    if (/sns\.load_dataset\(/.test(s)) return false;
    if (s === 'plt.show()') return false;
    return true;
  }).length;
}
