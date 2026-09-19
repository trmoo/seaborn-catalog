# Seaborn 데이터 도감

## ① 목적과 대상 단원
- **seaborn 의 예제 데이터 22개(`sns.load_dataset`)와 그래프 함수 21가지를 함께 찾아보는 수업용 앱.**
- 사용자 요청(2026-09-19): 「이 프로젝트(PyDataset 데이터 도감)와 유사한 기능으로 seaborn 라이브러리 버전으로도 만들어라」.
  → 「seaborn 내장 22개」 쪽으로 확정(PyDataset 757개에 seaborn 코드를 붙이는 안은 고르지 않음).
  이름은 사용자가 정했다 — **「Seaborn 데이터 도감」**. 배포와 포털 게시까지 요청받았다.
- 짝 — `pydataset-catalog/`(757개, 맷플롯립 코드) · `matplotlib_pandas_practice/`(맷플롯립 1차시).
  1차시에서 plt 로 그리던 학생이 다음 걸음으로 오는 자리라 「맷플롯립 ↔ 씨본」 탭을 따로 두었다.
- 성취기준 `[12정02-04]` · `[12데과02-02]`(시각화)와 이어진다.

## ② 화면 (탭 5)
| 탭 | 파일 | 하는 일 |
| --- | --- | --- |
| 🗂️ 주제별 보기 | `t1-topic.js` | 일곱 갈래 + 「처음이라면 이 다섯 개부터」(tips·penguins·titanic·flights·anscombe) |
| 🔎 찾기 | `t2-find.js` | 이름·제목·컬럼 이름·**컬럼 뜻**·초성 + 갈래·난이도·그릴 함수·특징·날짜·빠진 값 |
| 🎨 그래프 함수로 고르기 | `t3-func.js` | 함수 21가지 × 모양 그림(SVG) → 함수 화면(필요한 것·맷플롯립으로는·그릴 수 있는 자료와 코드) |
| 🔀 맷플롯립 ↔ 씨본 | `t4-compare.js` | 같은 그래프 7쌍 나란히 + 줄 수 + 「한 단어 더」 + 긴 표(melt) + savefig |
| 📖 안내 | `t5-help.js` | 쓰는 법 · 한글 글꼴 · 함정 8가지 · 원래 출처 표 · 이 앱에 대하여 |

주소 해시 — `#topic/lab` · `#find` · `#func/barplot` · `#compare/reg` · `#help`.

## ③ 파일
| 파일 | 하는 일 |
| --- | --- |
| `tools/catalog_ko.py` | **사람이 쓰는 원본** — 한국어 제목·설명·한 행·출처·컬럼 뜻·갈래·난이도·태그·**그래프 역할(roles)**·물음(picks). 여기를 고친다 |
| `tools/build_data.py` | seaborn 으로 22개를 실제로 불러 `src/data/catalog.js` 를 만든다. **「알아낸 것」(facts)도 여기서 실제로 확인한 값만** |
| `tools/verify_code.py` | 앱에 실린 파이썬 코드를 **진짜로 실행** — 오류·학생에게 보이는 경고가 하나라도 나면 실패 |
| `tools/dump-code.mjs` | 앱의 코드를 모두 꺼내 `tools/.codes.json` 에 적는다 (verify 가 읽는다) |
| `tools/py.mjs` | `.venv` 파이썬을 찾아 돌린다 (윈도우 `Scripts/` ↔ 리눅스 `bin/`) |
| `tools/check-syntax.mjs` | 문법 · 저작권 · 기본 대화상자 · 화면 수명 · 원문자 · **CSS 클래스 겹침** |
| `tools/requirements.txt` | seaborn 0.13.2 · pandas 2.2 · matplotlib 3.10 · scipy (코랩과 같은 줄기) |
| `src/data/catalog.js` | **생성물.** 손으로 고치지 말 것 |
| `src/lib/code.js` | **코드 만들기** — 함수 21가지(`FUNCS`) × 자료의 roles → 예제 코드. DOM 없음 |
| `src/lib/lessons.js` | 비교 7쌍(`COMPARE`) · 긴 표(`TIDY`) · 안내 조각(`SNIPS`). DOM 없음 |
| `src/lib/shapes.js` | 함수 모양 그림 SVG 21개 — **지어낸 숫자로 그린 도식**. DOM 없음 |
| `src/lib/store.js` | 자료 · 찾기 · 초성 · 함수별 목록. DOM 없음 |
| `src/lib/card.js` | 목록 카드 · 자세히 보기(컬럼 표·알림·물음·함수별 코드) |
| `src/lib/ui.js` | `pydataset-catalog` 것 그대로 (h · paint · modal · beginScreen …) |

```bash
npm test               # 85가지 (파이썬 없이)
npm run check:syntax   # 소스 22개
npm run check:code     # 코드 333개 실제 실행 (파이썬 필요, 약 1분)
npm run data           # 자료 다시 만들기 (파이썬 필요)
npm run build          # dist/index.html 한 파일 (약 124KB, 바깥 자원 0개)
```
파이썬은 앱 폴더 `.venv` 에 — `python -m venv .venv` → `.venv\Scripts\python -m pip install -r tools/requirements.txt`.
받은 CSV 는 `tools/.cache/`(깃 제외).

## ④ 검증값 (고치면 시험도 함께 고칠 것)
| 값 | 검증값 |
| --- | --- |
| 데이터셋 · 갈래 · 함수 | **22** · **7** · **21** (관계 3 · 분포 4 · 범주 8 · 회귀 2 · 한눈에 4) |
| 자료 × 함수 코드 | **277개** (+ 불러오기 22 · 비교 21 · 긴 표 3 · 안내 조각 10 = 실행 **333개**) |
| 함수별 자료 수 | hist·kde·ecdf 21 · bar 19 · box·violin·point 18 · strip 16 · heatmap 13 · scatter·swarm 12 · count·joint 11 · rel·dis·reg·lm 9 · line·clustermap 8 · cat·pair 7 |
| load_dataset 이 손질하는 자료 | **9개** — diamonds·dowjones·exercise·flights·penguins·seaice·taxis·tips·titanic |
| tips 요일 차례 | CSV `Sun Sat Thur Fri` / groupby `Fri Sat Sun Thur` / load `Thur Fri Sat Sun` |
| brain_networks | 그냥 부르면 **923×63**(숫자 열 0개) / `header=[0,1,2], index_col=0` 이면 **920×62** · 연결망 17 |
| PyDataset 과 같은 이름 | **8개** — same: tips·diamonds / renamed: iris / reshaped: anscombe / different: geyser·mpg·planets·titanic |
| geyser | **R 의 faithful 과 값이 같다**. kind 는 **기다린 시간** 67/68분에서 갈린다 (분출 시간으로는 겹침) |
| titanic | 겹치는 열 5쌍 모두 891명에서 맞음 · deck 빈칸 688 |
| anagrams ↔ attention | melt 하면 60개 점수가 **하나도 빠짐없이 같다** |
| anscombe | 네 묶음 x평균 9 · y평균 7.5 · r≈0.816 · y = 3 + 0.5x |
| 그 밖 | diamonds 크기 0 **20개** · fmri 한 점 **28개**(14명×2영역) · mpg horsepower 빈칸 **6** · polyfit 은 빈칸이 있으면 `LinAlgError` |
| sns.set_theme( ) | 글꼴 `NanumGothic` → **`sans-serif`** 로 되돌림 / `font=` 를 주면 남는다 |

## ⑤ 만들며 알아낸 것 — 이 앱의 알맹이 (「안내」 탭에 그대로 실었다)
1. `load_dataset` 은 **부를 때마다 깃허브에서 받아 온다**(설치할 때 데이터가 안 들어온다). 코랩은 되고 교실 PC 파이썬은 막힐 수 있다.
2. `load_dataset` ≠ `read_csv` — 범주 차례를 정하고(tips·titanic·diamonds·exercise), 날짜로 바꾸고(dowjones·seaice·taxis),
   글자를 바꾼다(flights `January→Jan`, penguins `MALE→Male`). **막대 차례가 세 가지로 갈린다.**
3. 범주형 열로 `groupby` 하면 판다스 2.2 가 `observed` FutureWarning 을 낸다 → `observed=True`.
   seaborn 함수에 표를 그대로 넘길 때는 뜨지 않는다(검증기로 확인).
4. `sns.set_theme()` 이 한글 글꼴을 풀어 버린다 — 맷플롯립 1차시에서 글꼴을 맞춘 뒤 씨본으로 넘어오면 바로 걸린다.
5. `brain_networks` 머리글 3줄 · 6. `Unnamed: 0`(attention·exercise) · 7. PyDataset 과 같은 이름 8개 · 8. titanic 겹치는 열.

## ⑥ 만들며 걸린 것 (다음에 또 걸리지 않도록)
- ⚠ **geyser 의 kind 를 처음에 「분출 길이」라고 적었다 — 틀렸다.** build_data 가 실제로 재 보니 **기다린 시간**으로 나눈 것이었다.
  설명을 추측으로 쓰지 말고, 사실은 `facts` 로 재서 싣고 시험이 지키게 할 것.
- ⚠ **값을 글자로 바꿔 견주면 `10` 과 `10.0` 이 달라진다** — anscombe 가 PyDataset 과 「다른 자료」로 잘못 판정됐다. 숫자는 `np.allclose` 로.
- ⚠ **CSS 클래스 이름 겹침** — 추천 물음 상자를 `.pick` 으로 지었다가, `pydataset-catalog` 에서 가져온 찾기 필터의
  `.pick{display:flex}` 를 물려받아 물음·코드가 한 줄로 늘어서 넘쳤다. `.qpick` 으로 바꾸고 `check-syntax` ⑦ 을 넣었다.
- ⚠ **matplotlib 3.11 에서는 seaborn 0.13.2 의 상자그림이 `vert` 경고를 낸다** — seaborn 속에서 나는
  (Pending)DeprecationWarning 은 코랩 학생 화면에 안 보이므로 `verify_code.py` 의 `shown()` 이 거른다.
  **FutureWarning·UserWarning 과 내 코드가 직접 낸 DeprecationWarning 은 그대로 실패로 본다.**
- ⚠ `clustermap` 은 **scipy** 가 있어야 한다(코랩에는 있다). requirements 에 넣었다.
- ⚠ **그래프 안에 한글을 넣지 않는다** — 코랩은 글꼴이 없어 □□□. 설명은 `#` 주석으로만. 시험이 따옴표 속 한글을 막는다.
- ⚠ **그림 전체를 만드는 함수(relplot·catplot·lmplot·pairplot…)에는 `plt.figure()` 가 먹지 않는다** — 시험이 막는다.
- ⚠ **벌떼 점은 400행 이하, 5천 행 넘는 자료는 회귀·짝 그림·벌떼를 빼고 점을 흐리게** — 느리고 경고가 난다.
- ⚠ **무리마다 행 수가 똑같은 범주(flights 의 달 등)는 개수 막대를 만들지 않는다** — 모든 막대가 같아 볼 것이 없다(`bal`).
- ⚠ 대화상자 머리말이 `top:0` 이면 바깥 여백 24px 만큼 내용이 위로 비친다 → `top:-24px`.
- ⚠ 좁은 화면에서 탭 다섯이 세 줄로 접혀 붙박이 머리말이 화면 1/3 을 덮었다 → 760px 아래에서는 붙박지 않고 탭을 한 줄 가로 스크롤.
- ⚠ Bash 히어독 안의 파이썬 `"""…\"""` 는 따옴표가 꼬인다. 긴 치환은 편집 도구로.

## ⑦ 현재 상태와 다음 할 일
- **완료 (2026-09-19)** — 탭 5 · 데이터셋 22 · 함수 21 · 비교 7쌍 · 함정 8가지.
  `npm test` 85가지 · `check:syntax` · `check:code` 333개 모두 통과. 빌드 `dist/index.html` 약 124KB, 바깥 자원 0개.
  브라우저에서 탭 5개 · 함수 화면 21개 · 자세히 보기 22개를 모두 열어 오류가 없는 것,
  휴대폰 너비(375px)에서 가로 넘침이 0 인 것을 확인했다.
- **배포 완료 (2026-09-19)** — https://github.com/trmoo/seaborn-catalog (Pages: https://trmoo.github.io/seaborn-catalog/)
  저장소는 사용자가 **미리 빈 저장소로 만들어 두었고 Pages 가 이미 「GitHub Actions」(`build_type: workflow`)** 였다.
  그래서 첫 푸시 한 번에 우리 워크플로 하나만 돌았다(Jekyll 잡 없음). build 잡의 **코드 333개 실제 실행** 단계도
  깃허브 서버(리눅스, 파이썬 3.12)에서 통과했다.
  배포본 **123,742바이트**, MD5 `b2a17c7a53ad35462f3380f7db55cce4` 가 로컬 `dist/index.html` 과 같다.
  ⚠ 배포 확인은 Actions 의 「성공」만 보지 말고 `curl -s <주소> -o x -w "%{size_download}"` 로 크기와 해시를 잴 것.
  포털 `comedu_portal/` 「[데이터] 학습 자료」의 PyDataset 데이터 도감 바로 아래에 🌊 로 올렸다.
  ⚠ 저장소 설명(description)이 한글이 깨진 채로 만들어져 있다(원래 글을 되살릴 수 없어 손대지 않았다).
- **다음으로 미룬 것**
  - 실제 그래프 미리보기 그림 (값에서 나온 그림이라 방침상 보류 — 지금은 지어낸 숫자의 도식)
  - seaborn 0.12 이후의 `objects` 인터페이스(`so.Plot`) 소개
  - 코랩 노트북으로 바로 열기 · 학습지(.docx)

## ⑧ 저작권
- **© 2026 티쳐무 · 모든 권리 보유** — `LICENSE` · `README.md` · 이 파일 · `package.json`(UNLICENSED) ·
  `index.html` 주석 · 소스마다 `/*!` 머리 주석 · **화면 푸터** · `vite.config.js` 배너 · 워크플로·파이썬 도구 머리 주석.
- `grep -o 티쳐무 dist/index.html | wc -l` 이 **18**(줄로는 5). 배포 워크플로는 10 이상이면 통과.
- ⚠ **데이터의 값(행)은 담지 않는다** — 범주 이름(12개 이하)과 숫자 열의 최소·최대, 확인한 사실만. **이 방침을 바꾸지 말 것.**
- ⚠ 함수 모양 그림은 **지어낸 숫자**로 그린 것이라고 화면·LICENSE 양쪽에 밝혔다.
- ⚠ 한국어 제목·설명·컬럼 뜻·분류·물음은 새로 쓴 것이고 분류는 공식이 아니다 (화면·LICENSE).
