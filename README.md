# Seaborn 데이터 도감

파이썬 그래프 라이브러리 **seaborn** 에 들어 있는 예제 데이터 **22개**와
그래프 함수 **21가지**를 함께 찾아보는 수업용 웹앱입니다.

> 「`sns.load_dataset('tips')` 말고 또 무슨 자료가 있어요?」
> 「바이올린 그래프를 그려 보고 싶은데 어느 자료가 알맞아요?」
> 「맷플롯립으로 네 줄 걸리던 걸 씨본으로는 어떻게 써요?」
> — 이럴 때 씁니다.

짝이 되는 앱 — [PyDataset 데이터 도감](https://trmoo.github.io/pydataset-catalog/) (연습용 데이터 757개),
맷플롯립 1차시 노트북(`matplotlib_pandas_practice`).

## 학생·교사가 쓰는 법

1. 주소 https://trmoo.github.io/seaborn-catalog/ 를 열거나, `dist/index.html` 파일 하나를 **더블클릭**합니다.
   앱 자체는 인터넷 없이도 열립니다.
2. 위쪽 탭 다섯 개 — 🗂️ 주제별 보기 / 🔎 찾기 / 🎨 그래프 함수로 고르기 / 🔀 맷플롯립 ↔ 씨본 / 📖 안내
3. 카드나 코드 상자의 **[복사]** 를 눌러 코랩에 붙여 넣고 실행하면 바로 그래프가 나옵니다.

```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')
sns.scatterplot(data=df, x='total_bill', y='tip', hue='time')
plt.show()
```

코랩에는 seaborn 이 이미 깔려 있어 설치할 것이 없습니다. 단, `load_dataset` 은 부를 때마다
**인터넷(깃허브)에서 데이터를 받아 옵니다** — 코랩에서는 늘 되지만, 학교 PC 에 직접 깐 파이썬에서는
방화벽에 막힐 수 있습니다.

## 화면 다섯

| 탭 | 하는 일 |
| --- | --- |
| 🗂️ 주제별 보기 | 일곱 갈래(생활·서비스 / 생물·자연 / 사회·역사 / 경제·산업 / 지구·우주 / 실험·측정 기록 / 통계·인공지능)와 「처음이라면 이 다섯 개부터」 |
| 🔎 찾기 | 이름·한국어 제목·**컬럼 이름과 그 뜻**(「나이」·「요금」)·**초성**(`ㅍㄱ`→펭귄)으로 찾고, 갈래·난이도·그릴 함수·특징으로 좁힌다 |
| 🎨 그래프 함수로 고르기 | seaborn 함수 21가지를 다섯 갈래(관계·분포·범주·회귀·한눈에)로. 함수마다 **모양 그림**, 필요한 열, 맷플롯립으로는 무엇인지, 그 함수로 그릴 수 있는 자료와 코드 |
| 🔀 맷플롯립 ↔ 씨본 | 같은 그래프 일곱 가지를 **맷플롯립만으로 / 씨본으로** 나란히 — 줄 수 비교, 한 단어 더 넣으면(`hue=`·`col=`), 그리고 **씨본이 좋아하는 긴 표**(`melt`) |
| 📖 안내 | 쓰는 법, 한글 글꼴, **미리 알아 둘 함정 여덟 가지**, 데이터셋의 원래 출처 |

## 데이터셋 하나를 누르면

* 한국어 제목과 설명, 「한 행 = 무엇」
* 행 × 열, 숫자·범주·날짜 열 개수, 빠진 값
* **컬럼 표** — 이름 · **한국어 뜻** · 종류 · 다른 값의 개수 · 빠진 값 · 범위나 범주 이름
  (`load_dataset` 이 차례를 정해 준 열에는 「차례 있음」 표시)
* **이 자료로 던져 볼 물음**과 그 그래프 코드 (「객실 등급과 성별에 따라 살아남은 비율이 달랐을까?」)
* 그릴 수 있는 seaborn 함수 전부와 코드
* 알림 — 불러올 때 손질되는 열, PyDataset 에 같은 이름이 있는지, 겹치는 열, 잘못 적힌 값 등

## 코드는 모두 실제로 실행해 확인했습니다

앱에 실린 파이썬 코드 **333개**(자료 × 함수 277개 + 불러오기·비교·안내용)를
seaborn 0.13.2 · 판다스 2.2 · 맷플롯립 3.10(코랩과 같은 줄기)으로 **진짜로 실행**해,
오류와 학생 화면에 뜨는 경고(FutureWarning·UserWarning)가 하나도 없는 것을 확인했습니다.
배포할 때마다 깃허브에서 다시 돌립니다(`npm run check:code`).

## ⚠ 수업 전에 알아 두면 좋은 것

22개를 모두 불러 보고 찾은 것들입니다. 「안내」 탭에 코드와 함께 자세히 적어 두었습니다.

1. **`load_dataset` 은 부를 때마다 인터넷에서 받아 온다** — 코랩은 되지만 교실 PC 파이썬은 막힐 수 있다.
2. **`load_dataset` 과 `pd.read_csv` 는 결과가 다르다 (9개 자료)** — 범주의 차례를 정하고 날짜를 바꾼다.
   tips 의 요일은 CSV 차례 `Sun→Sat→Thur→Fri`, groupby 차례 `Fri→Sat→Sun→Thur`,
   load_dataset 차례 `Thur→Fri→Sat→Sun` — 같은 자료인데 막대 차례가 세 가지다.
   flights 의 달은 `January` 가 `Jan` 으로 글자까지 바뀐다.
3. **범주형 열로 `groupby` 하면 FutureWarning 이 뜬다** (판다스 2.2) — `observed=True` 로 막는다.
4. **`sns.set_theme()` 을 부르면 한글 글꼴 설정이 풀린다** — `sns.set_theme(font='NanumGothic')` 처럼 함께 적는다.
5. **`brain_networks` 는 그냥 부르면 표가 망가진다** — 머리글이 세 줄이라 `header=[0, 1, 2], index_col=0` 이 필요하다.
6. **`attention`·`exercise` 에는 `Unnamed: 0` 열**이 딸려 들어와 있다 (뜻 없는 행 번호).
7. **PyDataset 에도 같은 이름이 8개 있는데 같은 자료가 아닐 수 있다** — `mpg`(398×9 ↔ 234×11),
   `titanic`(891×15 ↔ 1316×4), `geyser`·`planets` 는 이름만 같은 다른 자료다.
   `iris` 는 값은 같고 열 이름이 다르며(`sepal_length` ↔ `Sepal.Length`), `anscombe` 는 표 모양이 다르다.
8. **`titanic` 에는 같은 뜻을 두 번 적은 열**이 있다 (`survived`↔`alive`, `pclass`↔`class` …).

## 개발

```bash
npm install            # 의존성 설치
npm start              # 개발 서버
npm run build          # dist/index.html 한 파일로 빌드
npm test               # 시험 (파이썬 없이)
npm run check:syntax   # 문법 · 저작권 · 대화상자 · 화면 수명 · 클래스 겹침
npm run check:code     # 앱에 실린 파이썬 코드 333개를 진짜로 실행 (파이썬 필요)
npm run data           # 자료 다시 만들기 (파이썬 필요)
```

파이썬 도구는 앱 폴더의 `.venv` 에 설치해 씁니다(저장소에는 올리지 않습니다).

```bash
python -m venv .venv
.venv\Scripts\python -m pip install -r tools/requirements.txt
```

`tools/catalog_ko.py` 가 사람이 쓰는 원본(한국어 제목·설명·컬럼 뜻·분류·그래프 역할·물음)이고,
`tools/build_data.py` 가 seaborn 으로 22개를 실제로 불러 `src/data/catalog.js` 를 만듭니다.

## 저작권

**© 2026 티쳐무 · 모든 권리 보유** — 학교 수업 목적으로만 이용해 주세요.

이 앱은 **데이터의 값(행)을 담고 있지 않습니다.** 담은 것은 행·열 수, 컬럼 이름·종류,
범주의 이름, 숫자 열의 가장 작은·큰 값처럼 「어떤 자료인가」를 말해 주는 정보뿐입니다.
데이터셋은 seaborn-data 저장소에 실린 것이고 원래 출처가 각각 따로 있습니다.
한국어 제목·설명·컬럼 뜻과 주제 분류는 원문을 옮긴 것이 아니라 새로 쓴 것입니다.
자세한 것은 [LICENSE](LICENSE) 를 보세요.
