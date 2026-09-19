# Seaborn 데이터 도감 — (C) 2026 티쳐무 · 모든 권리 보유. 학교 수업 목적으로만 이용해 주세요.
# catalog_ko.py — 사람이 손으로 쓰는 원본. 여기를 고친다.
#
# 한국어 제목·설명·컬럼 뜻·주제 분류는 원문을 옮긴 것이 아니라 우리가 새로 쓴 것이다.
# 분류도 공식 분류가 아니라 수업에서 찾기 쉽게 나눈 것이다.
#
# roles — 그래프 코드를 만들 때 어느 열을 어느 자리에 넣을지 정해 둔다 (src/lib/code.js 가 읽는다).
#   xy    : 산점도·회귀에 쓸 두 숫자 열 [x, y]
#   v     : 분포·범주 그래프에서 잴 숫자 열 하나
#   rate  : 0/1 로 된 열 — 막대의 평균이 곧 「비율」이 된다 (titanic 의 survived)
#   cat   : x 축에 놓을 범주 열 (앞의 것부터 쓴다)
#   hue   : 색으로 나눌 범주 열
#   col   : 칸(패싯)으로 나눌 범주 열
#   line  : 선그래프 {x, y, hue}
#   num   : 상관·짝 그림에 쓸 숫자 열 (번호·아이디 열은 넣지 않는다)
#   pair  : 짝 그림(pairplot)에만 따로 쓸 열 — 없으면 num 의 앞 넷. [] 이면 짝 그림을 만들지 않는다
#   pivot : 열지도로 펼 표 {index, columns, values}
#   label : 한 행이 하나의 이름인 열 (car_crashes 의 주 이름) — 막대를 하나씩 세운다
#   wide  : 넓은 표의 값 열들 — data=df[[...]] 로 그린다
#   log   : 로그 눈금이 필요한 열
#   horiz : 범주 이름이 길어 가로로 눕혀 그린다
#   corrAll: 모든 열이 숫자라 df.corr( ) 를 그대로 쓴다
#   facet : relplot 에 덧붙일 인자 (그대로 붙는다)
#   clusterPivot: pivot 표로 묶음 열지도를 그려도 뜻이 있다
#   lmcol : lmplot 을 무리마다 칸을 나누어 그린다 (앤스컴처럼 칸을 나란히 보는 것이 알맹이인 자료)

CATS = [
    {'k': 'life', 'e': '🍽️', 'n': '생활·서비스', 'd': '식당 계산서·택시 요금처럼 일상에서 생기는 기록'},
    {'k': 'bio', 'e': '🌿', 'n': '생물·자연', 'd': '꽃·펭귄의 몸 치수, 간헐천의 분출'},
    {'k': 'soc', 'e': '🚢', 'n': '사회·역사', 'd': '타이타닉 승객, 나라별 의료비, 주별 교통사고'},
    {'k': 'econ', 'e': '💰', 'n': '경제·산업', 'd': '다이아몬드 값, 자동차 연비, 주가, 항공 승객'},
    {'k': 'earth', 'e': '🌍', 'n': '지구·우주', 'd': '북극 바다 얼음, 다른 별의 행성'},
    {'k': 'lab', 'e': '🧪', 'n': '실험·측정 기록', 'd': '뇌 신호·신경세포·주의·운동 실험 — 같은 사람을 여러 번 잰 자료'},
    {'k': 'stat', 'e': '🤖', 'n': '통계·인공지능', 'd': '통계 수업의 고전 예제와 언어 AI 성적표'},
]

LEVELS = {1: '입문', 2: '보통', 3: '도전'}

# 원자료 출처는 seaborn-data 저장소 README 의 목록을 따른다.
ITEMS = {
    # ── 생활·서비스 ────────────────────────────────────────────────
    'tips': {
        'cat': 'life', 'level': 1,
        'ko': '식당 손님의 팁 기록',
        'desc': '한 식당에서 손님 테이블마다 계산 금액과 팁, 손님의 성별·흡연 여부·요일·식사 시간·인원을 적은 기록입니다. '
                'seaborn 설명서에서 가장 많이 쓰이는 자료라, 거의 모든 그래프를 이 자료로 연습할 수 있습니다.',
        'row': '손님 한 테이블',
        'src': 'R reshape2 패키지의 tips (Bryant & Smith 의 식당 팁 조사)',
        'tags': ['수업 단골'],
        'colko': {
            'total_bill': '계산 금액 (달러)', 'tip': '팁 (달러)', 'sex': '계산한 사람의 성별',
            'smoker': '흡연석 여부', 'day': '요일 (목·금·토·일)', 'time': '점심·저녁', 'size': '함께 온 인원',
        },
        'roles': {
            'xy': ['total_bill', 'tip'], 'v': 'total_bill', 'cat': ['day', 'time', 'sex', 'smoker'],
            'hue': 'sex', 'col': 'time', 'num': ['total_bill', 'tip', 'size'],
        },
        'picks': [
            ['scatterplot', '계산 금액이 클수록 팁도 많이 줄까?'],
            ['barplot', '요일마다 평균 계산 금액이 다를까? 성별로 나누어 보면?'],
            ['histplot', '계산 금액은 얼마쯤에 가장 많이 몰려 있을까?'],
            ['relplot', '점심과 저녁을 따로 그리면 팁을 주는 모습이 달라질까?'],
        ],
    },
    'taxis': {
        'cat': 'life', 'level': 3,
        'ko': '뉴욕 택시 운행 기록 (2019년 3월)',
        'desc': '뉴욕시에서 한 달 동안 택시가 손님을 태운 기록 가운데 일부입니다. 탄 시각·내린 시각, 거리, 요금·팁·통행료, '
                '택시 색(노란색·초록색), 결제 방법, 탄 곳과 내린 곳이 들어 있습니다. 행이 6천 개가 넘어 조금 무겁습니다.',
        'row': '택시 한 번 운행',
        'src': '뉴욕시 택시·리무진 위원회(TLC) 운행 기록',
        'tags': ['날짜·시각'],
        'colko': {
            'pickup': '손님을 태운 시각', 'dropoff': '손님이 내린 시각', 'passengers': '손님 수',
            'distance': '달린 거리 (마일)', 'fare': '요금 (달러)', 'tip': '팁 (달러)', 'tolls': '통행료 (달러)',
            'total': '모두 합한 금액 (달러)', 'color': '택시 색 (yellow·green)', 'payment': '결제 방법 (현금·카드)',
            'pickup_zone': '태운 동네', 'dropoff_zone': '내린 동네',
            'pickup_borough': '태운 자치구', 'dropoff_borough': '내린 자치구',
        },
        'roles': {
            'xy': ['distance', 'fare'], 'v': 'fare', 'cat': ['pickup_borough', 'payment', 'color'],
            'hue': 'color', 'col': 'payment',
            'num': ['passengers', 'distance', 'fare', 'tip', 'tolls', 'total'],
        },
        'picks': [
            ['histplot', '택시 요금은 얼마쯤이 가장 흔할까?'],
            ['scatterplot', '멀리 갈수록 요금이 비쌀까? 노란 택시와 초록 택시는 다를까?'],
            ['countplot', '어느 자치구에서 택시를 가장 많이 탔을까?'],
        ],
    },

    # ── 생물·자연 ──────────────────────────────────────────────────
    'iris': {
        'cat': 'bio', 'level': 1,
        'ko': '붓꽃 세 품종의 꽃 치수',
        'desc': '붓꽃 세 품종을 50송이씩 골라 꽃받침과 꽃잎의 길이·너비를 잰 자료입니다. '
                '통계와 머신러닝 수업에서 가장 오래 쓰여 온 연습 자료 가운데 하나입니다.',
        'row': '붓꽃 한 송이',
        'src': 'UCI 머신러닝 저장소의 Iris 자료 (Fisher, 1936)',
        'tags': ['수업 단골'],
        'colko': {
            'sepal_length': '꽃받침 길이 (cm)', 'sepal_width': '꽃받침 너비 (cm)',
            'petal_length': '꽃잎 길이 (cm)', 'petal_width': '꽃잎 너비 (cm)', 'species': '품종',
        },
        'roles': {
            'xy': ['petal_length', 'petal_width'], 'v': 'petal_length', 'cat': ['species'],
            'hue': 'species', 'col': 'species',
            'num': ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'],
        },
        'picks': [
            ['pairplot', '네 가지 치수 가운데 세 품종을 가장 잘 가르는 것은 무엇일까?'],
            ['scatterplot', '꽃잎이 길면 너비도 넓을까? 품종마다 모여 있는 자리가 다를까?'],
            ['violinplot', '품종마다 꽃잎 길이가 얼마나 다를까?'],
        ],
    },
    'penguins': {
        'cat': 'bio', 'level': 1,
        'ko': '남극 펭귄 세 종의 몸 치수',
        'desc': '남극 파머 기지 근처 세 섬에서 펭귄 세 종의 부리 길이·깊이, 날개 길이, 몸무게, 성별을 잰 자료입니다. '
                '빠진 값이 조금 섞여 있어 결측치 처리 연습에도 알맞습니다.',
        'row': '펭귄 한 마리',
        'src': 'palmerpenguins (Horst·Hill·Gorman) — 파머 기지 장기 생태 연구',
        'tags': ['수업 단골'],
        'colko': {
            'species': '종 (아델리·턱끈·젠투)', 'island': '사는 섬', 'bill_length_mm': '부리 길이 (mm)',
            'bill_depth_mm': '부리 깊이 (mm)', 'flipper_length_mm': '날개 길이 (mm)',
            'body_mass_g': '몸무게 (g)', 'sex': '성별',
        },
        'roles': {
            'xy': ['flipper_length_mm', 'body_mass_g'], 'v': 'body_mass_g', 'cat': ['species', 'island', 'sex'],
            'hue': 'species', 'col': 'island',
            'num': ['bill_length_mm', 'bill_depth_mm', 'flipper_length_mm', 'body_mass_g'],
        },
        'picks': [
            ['scatterplot', '날개가 긴 펭귄이 몸무게도 무거울까? 종마다 다를까?'],
            ['boxplot', '세 종 가운데 가장 무거운 종은 무엇일까?'],
            ['pairplot', '부리 길이와 부리 깊이만으로도 세 종을 가를 수 있을까?'],
        ],
    },
    'geyser': {
        'cat': 'bio', 'level': 1,
        'ko': '간헐천 분출 시간과 기다린 시간',
        'desc': '미국 옐로스톤 국립공원의 올드 페이스풀 간헐천에서 물이 솟은 시간과 다음 분출까지 기다린 시간을 적은 자료입니다. '
                'seaborn 판에는 기다린 시간이 긴지 짧은지로 나눈 kind 열이 덧붙어 있습니다.',
        'row': '분출 한 번',
        'src': 'R datasets 패키지의 faithful (옐로스톤 올드 페이스풀 간헐천)',
        'tags': [],
        'colko': {
            'duration': '분출 시간 (분)', 'waiting': '다음 분출까지 기다린 시간 (분)', 'kind': '기다린 시간으로 나눈 무리 (long·short)',
        },
        'roles': {
            'xy': ['waiting', 'duration'], 'v': 'waiting', 'cat': ['kind'], 'hue': 'kind',
            'num': ['duration', 'waiting'],
        },
        'picks': [
            ['scatterplot', '오래 기다린 뒤에는 더 오래 분출할까?'],
            ['histplot', '기다리는 시간은 한 곳에 몰려 있을까, 두 곳에 몰려 있을까?'],
            ['kdeplot', 'kind 의 long·short 는 무엇을 기준으로 나눈 것일까? 두 무리의 곡선이 만나는 곳을 보자'],
        ],
    },

    # ── 사회·역사 ──────────────────────────────────────────────────
    'titanic': {
        'cat': 'soc', 'level': 1,
        'ko': '타이타닉호 승객 명부',
        'desc': '1912년 가라앉은 타이타닉호 승객 891명의 객실 등급·성별·나이·요금·탄 항구와 살아남았는지를 담은 자료입니다. '
                '같은 뜻을 글자와 숫자로 두 번 적은 열이 여럿 있어 열을 고를 때 조심해야 합니다.',
        'row': '승객 한 명',
        'src': 'Kaggle 타이타닉 대회 자료',
        'tags': ['수업 단골'],
        'colko': {
            'survived': '살아남았나 (1 = 예, 0 = 아니오)', 'pclass': '객실 등급 (숫자 1·2·3)', 'sex': '성별',
            'age': '나이', 'sibsp': '함께 탄 형제·배우자 수', 'parch': '함께 탄 부모·자녀 수', 'fare': '낸 요금',
            'embarked': '탄 항구 (머리글자 C·Q·S)', 'class': '객실 등급 (글자 First·Second·Third)',
            'who': '어른 남자·어른 여자·아이', 'adult_male': '어른 남자인가', 'deck': '객실이 있던 갑판',
            'embark_town': '탄 항구 (이름)', 'alive': '살아남았나 (yes·no)', 'alone': '혼자 탔나',
        },
        'roles': {
            'xy': ['age', 'fare'], 'v': 'age', 'rate': 'survived', 'cat': ['class', 'sex', 'who', 'embark_town'],
            'hue': 'sex', 'col': 'class',
            'num': ['survived', 'pclass', 'age', 'sibsp', 'parch', 'fare'], 'pair': [],
        },
        'picks': [
            ['barplot', '객실 등급과 성별에 따라 살아남은 비율이 달랐을까?'],
            ['histplot', '승객의 나이는 어떻게 퍼져 있었을까?'],
            ['countplot', '등급마다 남자와 여자는 몇 명씩 탔을까?'],
        ],
    },
    'healthexp': {
        'cat': 'soc', 'level': 1,
        'ko': '여섯 나라의 의료비와 기대수명',
        'desc': '캐나다·프랑스·독일·영국·일본·미국 여섯 나라가 해마다 한 사람당 쓴 의료비와 기대수명을 적은 자료입니다. '
                '1970년부터 2020년까지 이어지는 시계열입니다.',
        'row': '한 나라의 한 해',
        'src': 'Our World in Data — 기대수명과 의료비 지출',
        'tags': ['시계열'],
        'colko': {
            'Year': '연도', 'Country': '나라', 'Spending_USD': '한 사람당 의료비 (달러)',
            'Life_Expectancy': '기대수명 (세)',
        },
        'roles': {
            'xy': ['Spending_USD', 'Life_Expectancy'], 'v': 'Life_Expectancy', 'cat': ['Country'],
            'hue': 'Country', 'line': {'x': 'Year', 'y': 'Life_Expectancy', 'hue': 'Country'},
            'num': ['Year', 'Spending_USD', 'Life_Expectancy'],
        },
        'picks': [
            ['lineplot', '나라마다 기대수명이 해마다 어떻게 늘어 왔을까?'],
            ['scatterplot', '의료비를 많이 쓰는 나라일수록 오래 살까? 모든 나라가 그럴까?'],
        ],
    },
    'car_crashes': {
        'cat': 'soc', 'level': 2,
        'ko': '미국 주별 교통사고와 보험료',
        'desc': '미국 50개 주와 수도(워싱턴 D.C.)마다 치명적인 사고에 얽힌 운전자가 얼마나 되는지, 그 가운데 과속·음주가 얼마인지, '
                '자동차 보험료가 얼마인지를 적은 자료입니다. 사고 수는 「운전 거리 10억 마일당 몇 명」으로 맞춰 두었습니다.',
        'row': '미국의 한 주',
        'src': 'FiveThirtyEight 「위험한 운전자」 기사 자료 (Kaggle)',
        'tags': [],
        'colko': {
            'total': '치명 사고에 얽힌 운전자 (10억 마일당)', 'speeding': '그 가운데 과속한 운전자',
            'alcohol': '그 가운데 음주한 운전자', 'not_distracted': '그 가운데 한눈팔지 않은 운전자',
            'no_previous': '그 가운데 사고 전력이 없는 운전자', 'ins_premium': '자동차 보험료 (달러)',
            'ins_losses': '보험사가 운전자 한 명당 낸 보험금 (달러)', 'abbrev': '주 이름 (두 글자 약자)',
        },
        'roles': {
            'xy': ['alcohol', 'total'], 'v': 'total', 'label': 'abbrev',
            'num': ['total', 'speeding', 'alcohol', 'not_distracted', 'no_previous', 'ins_premium', 'ins_losses'],
        },
        'picks': [
            ['barplot', '사고가 가장 많은 주와 가장 적은 주는 어디일까?'],
            ['heatmap', '일곱 가지 값 가운데 서로 함께 움직이는 짝은 무엇일까?'],
            ['regplot', '음주 운전자가 많은 주일수록 사고도 많을까?'],
        ],
    },

    # ── 경제·산업 ──────────────────────────────────────────────────
    'diamonds': {
        'cat': 'econ', 'level': 3,
        'ko': '다이아몬드 5만 개의 값과 품질',
        'desc': '다이아몬드 약 5만 4천 개의 무게(캐럿)·연마·색·투명도·치수와 가격을 담은 자료입니다. '
                '행이 아주 많아 점을 다 찍으면 뭉개지므로, 투명도를 낮추거나 육각형으로 묶어 그리는 연습에 알맞습니다.',
        'row': '다이아몬드 한 개',
        'src': 'R ggplot2 패키지의 diamonds',
        'tags': ['큰 자료'],
        'colko': {
            'carat': '무게 (캐럿)', 'cut': '연마 등급', 'color': '색 등급 (D 가 가장 좋고 J 로 갈수록 누렇다)',
            'clarity': '투명도 등급 (IF 가 가장 좋고 I1 이 가장 낮다)', 'depth': '깊이 비율 (%)',
            'table': '윗면 너비 비율 (%)', 'price': '가격 (달러)',
            'x': '길이 (mm)', 'y': '너비 (mm)', 'z': '높이 (mm)',
        },
        'roles': {
            'xy': ['carat', 'price'], 'v': 'price', 'cat': ['cut', 'color', 'clarity'], 'hue': 'cut',
            'num': ['carat', 'depth', 'table', 'price', 'x', 'y', 'z'],
        },
        'picks': [
            ['scatterplot', '무거운 다이아몬드일수록 얼마나 더 비쌀까?'],
            ['boxplot', '연마 등급이 좋을수록 가격도 높을까? 결과를 보고 왜 그런지 생각해 보자'],
            ['histplot', '다이아몬드 가격은 어느 쪽에 몰려 있을까?'],
        ],
    },
    'mpg': {
        'cat': 'econ', 'level': 1,
        'ko': '자동차 연비와 엔진 (1970~82년)',
        'desc': '1970년부터 1982년까지 나온 자동차 약 400대의 연비, 실린더 수, 배기량, 마력, 무게, 가속 성능, 연식, 생산 지역을 담은 자료입니다. '
                '마력에 빠진 값이 조금 있습니다.',
        'row': '자동차 한 대',
        'src': 'UCI 머신러닝 저장소의 Auto MPG 자료 (data.world 판)',
        'tags': [],
        'colko': {
            'mpg': '연비 (갤런당 마일, 클수록 기름을 덜 먹는다)', 'cylinders': '실린더 수',
            'displacement': '배기량 (세제곱인치)', 'horsepower': '마력', 'weight': '무게 (파운드)',
            'acceleration': '가속 (시속 60마일까지 걸린 초)', 'model_year': '연식 (70 = 1970년)',
            'origin': '생산 지역 (미국·유럽·일본)', 'name': '차 이름',
        },
        'roles': {
            'xy': ['horsepower', 'mpg'], 'v': 'mpg', 'cat': ['origin', 'cylinders'], 'hue': 'origin',
            'line': {'x': 'model_year', 'y': 'mpg', 'hue': 'origin'},
            'num': ['mpg', 'cylinders', 'displacement', 'horsepower', 'weight', 'acceleration'],
            'pair': ['mpg', 'horsepower', 'weight', 'acceleration'],
        },
        'picks': [
            ['scatterplot', '힘센 차일수록 연비가 나쁠까? 생산 지역마다 다를까?'],
            ['lineplot', '해가 갈수록 자동차 연비가 좋아졌을까?'],
            ['boxplot', '미국·유럽·일본 가운데 연비가 가장 좋은 곳은?'],
        ],
    },
    'dowjones': {
        'cat': 'econ', 'level': 2,
        'ko': '다우존스 주가지수 (1914~1968년, 월별)',
        'desc': '미국 주식시장의 대표 지수인 다우존스 산업평균지수를 1914년 12월부터 1968년 12월까지 한 달에 한 번씩 적은 자료입니다. '
                '날짜와 지수, 딱 두 열뿐이라 선그래프 연습에 알맞습니다.',
        'row': '한 달',
        'src': '미국 세인트루이스 연방준비은행 FRED (M1109BUSM293NNBR)',
        'tags': ['시계열', '날짜·시각'],
        'colko': {'Date': '날짜 (매달 1일)', 'Price': '지수'},
        'roles': {'v': 'Price', 'line': {'x': 'Date', 'y': 'Price'}},
        'picks': [
            ['lineplot', '1929년 대공황 무렵 선은 어떻게 움직였을까?'],
            ['histplot', '지수 값의 분포만 보면 무엇을 놓치게 될까?'],
        ],
    },
    'flights': {
        'cat': 'econ', 'level': 1,
        'ko': '항공 승객 수 (1949~1960년, 월별)',
        'desc': '한 항공사의 국제선 승객 수를 1949년부터 1960년까지 달마다 적은 자료입니다. 승객 수는 천 명 단위입니다. '
                '해마다 늘어나는 흐름과 여름마다 솟는 물결이 함께 보여, 선그래프와 열지도를 견주기에 좋습니다.',
        'row': '한 해의 한 달',
        'src': 'R datasets 패키지의 AirPassengers (Box & Jenkins)',
        'tags': ['시계열'],
        'colko': {'year': '연도', 'month': '달 (Jan~Dec)', 'passengers': '승객 수 (천 명)'},
        'roles': {
            'v': 'passengers', 'cat': ['month'], 'line': {'x': 'year', 'y': 'passengers', 'hue': 'month'},
            'pivot': {'index': 'month', 'columns': 'year', 'values': 'passengers'},
        },
        'picks': [
            ['heatmap', '어느 달에 승객이 가장 많을까? 해마다 늘었을까?'],
            ['lineplot', '열두 달의 선이 모두 같은 방향으로 움직일까?'],
            ['barplot', '열두 해를 평균하면 어느 달이 가장 붐빌까?'],
        ],
    },

    # ── 지구·우주 ──────────────────────────────────────────────────
    'seaice': {
        'cat': 'earth', 'level': 2,
        'ko': '북극 바다 얼음의 넓이 (1980~2019년, 날마다)',
        'desc': '북극 바다를 덮은 얼음의 넓이를 1980년부터 2019년까지 날마다 적은 자료입니다. 넓이는 백만 제곱킬로미터 단위입니다. '
                '1년마다 크게 오르내리는 물결 속에 긴 흐름이 숨어 있습니다.',
        'row': '하루',
        'src': '미국 국립 눈·얼음 자료 센터(NSIDC) 해빙 도구',
        'tags': ['시계열', '날짜·시각', '큰 자료'],
        'colko': {'Date': '날짜', 'Extent': '바다 얼음 넓이 (백만 km²)'},
        'roles': {'v': 'Extent', 'line': {'x': 'Date', 'y': 'Extent'}},
        'picks': [
            ['lineplot', '해마다 오르내리는 물결 속에서 전체 흐름은 어느 쪽일까?'],
            ['histplot', '얼음 넓이가 두 곳에 몰려 있다면 그것은 무엇을 뜻할까?'],
        ],
    },
    'planets': {
        'cat': 'earth', 'level': 2,
        'ko': '태양계 밖 행성 발견 기록',
        'desc': '다른 별 둘레를 도는 행성(외계 행성) 약 천 개가 어떤 방법으로, 언제 발견되었는지와 공전 주기·질량·거리를 담은 자료입니다. '
                '값의 크기 차이가 수만 배라 로그 눈금으로 그려야 모습이 보입니다. 질량에 빠진 값이 많습니다.',
        'row': '행성 하나',
        'src': 'NASA 외계 행성 목록',
        'tags': ['로그 눈금'],
        'colko': {
            'method': '발견 방법', 'number': '그 별에서 알려진 행성 수', 'orbital_period': '공전 주기 (일)',
            'mass': '질량 (목성의 몇 배)', 'distance': '지구에서의 거리 (파섹)', 'year': '발견한 해',
        },
        'roles': {
            'xy': ['distance', 'orbital_period'], 'v': 'orbital_period', 'cat': ['method'], 'hue': 'method',
            'log': ['distance', 'orbital_period', 'mass'], 'horiz': True,
            'num': ['number', 'orbital_period', 'mass', 'distance', 'year'], 'pair': [],
        },
        'picks': [
            ['countplot', '행성을 가장 많이 찾아낸 방법은 무엇일까?'],
            ['boxplot', '발견 방법마다 찾아내는 행성의 공전 주기가 다를까?'],
            ['scatterplot', '멀리 있는 별의 행성도 찾을 수 있을까? 방법마다 찾는 영역이 다를까?'],
        ],
    },

    # ── 실험·측정 기록 ─────────────────────────────────────────────
    'fmri': {
        'cat': 'lab', 'level': 2,
        'ko': '뇌 영상(fMRI) 신호 실험',
        'desc': '참가자 14명에게 자극을 준 뒤 뇌의 두 영역(두정엽·전두엽)에서 나온 신호를 시간 순서로 잰 자료입니다. '
                '같은 시점에 여러 사람의 값이 있어, seaborn 이 평균과 신뢰구간 띠를 스스로 그려 주는 모습을 보기 좋습니다.',
        'row': '한 참가자의 한 영역·한 사건·한 시점',
        'src': 'Waskom 외 (2017) 뇌 영상 연구 자료',
        'tags': ['반복 측정'],
        'colko': {
            'subject': '참가자 (s0~s13)', 'timepoint': '시점 (0~18)', 'event': '사건 종류 (stim 자극·cue 신호)',
            'region': '뇌 영역 (parietal 두정엽·frontal 전두엽)', 'signal': '뇌 신호의 변화량',
        },
        'roles': {
            'v': 'signal', 'cat': ['region', 'event'], 'hue': 'event', 'col': 'region',
            'line': {'x': 'timepoint', 'y': 'signal', 'hue': 'event'},
        },
        'picks': [
            ['lineplot', '자극을 받은 뒤 뇌 신호는 몇 번째 시점에 가장 커질까?'],
            ['relplot', '두정엽과 전두엽은 같은 모습으로 반응할까?'],
        ],
    },
    'dots': {
        'cat': 'lab', 'level': 3,
        'ko': '움직이는 점을 본 원숭이의 신경세포 반응',
        'desc': '원숭이에게 화면 속 점들이 어느 쪽으로 움직이는지 고르게 하고, 그때 뇌 신경세포가 얼마나 자주 신호를 내는지 잰 실험 자료입니다. '
                '점의 움직임이 얼마나 뚜렷했는지(coherence)에 따라 반응이 달라집니다.',
        'row': '한 조건의 한 시점',
        'src': 'Roitman & Shadlen (2002) 신경과학 실험',
        'tags': ['반복 측정'],
        'colko': {
            'align': '시간을 맞춘 기준 (dots 점이 뜬 때·sacc 눈을 움직인 때)', 'choice': '고른 과녁 (T1·T2)',
            'time': '기준에서 지난 시간 (밀리초)', 'coherence': '점 움직임이 얼마나 한쪽으로 모였나 (%)',
            'firing_rate': '신경세포가 신호를 낸 빈도 (초당)',
        },
        'roles': {
            'v': 'firing_rate', 'cat': ['choice', 'align'], 'hue': 'choice', 'col': 'align',
            'line': {'x': 'time', 'y': 'firing_rate', 'hue': 'coherence'},
            'facet': "facet_kws={'sharex': False}",
        },
        'picks': [
            ['relplot', '점의 움직임이 뚜렷할수록 신경세포 반응이 더 빨리 커질까?'],
        ],
    },
    'brain_networks': {
        'cat': 'lab', 'level': 3,
        'ko': '뇌 연결망 62곳의 활동 기록',
        'desc': '사람의 뇌를 62개 영역으로 나누어 잰 활동 값이 920줄 들어 있는 자료입니다. 영역들은 17개 연결망으로 묶여 있습니다. '
                '머리글이 세 줄(연결망 번호·노드·좌우 반구)이라 그냥 부르면 표가 망가집니다. 반드시 header 를 정해서 불러야 합니다.',
        'row': '한 번 잰 때',
        'src': 'seaborn-data 출처 목록에 적혀 있지 않음 (seaborn 예제용으로 실린 자료)',
        'tags': ['넓은 표', '머리글 3줄'],
        'load': 'header=[0, 1, 2], index_col=0',
        'colko': {},
        'roles': {'corrAll': True},
        'picks': [
            ['clustermap', '어느 뇌 영역끼리 함께 움직일까? 비슷한 것끼리 묶어 보자'],
        ],
    },
    'attention': {
        'cat': 'lab', 'level': 1,
        'ko': '주의 집중과 낱말 퍼즐 점수 (긴 표)',
        'desc': '참가자 20명이 주의를 한곳에 모으거나(focused) 나눈(divided) 상태에서, 답이 1·2·3개인 낱말 퍼즐을 풀고 받은 점수입니다. '
                '옆의 anagrams 와 같은 실험을 「한 행 = 한 번 잰 값」의 긴 표로 적은 것입니다.',
        'row': '한 참가자의 한 조건',
        'src': 'Stanford Psych 252 수업 자료',
        'tags': ['반복 측정', '긴 표'],
        'colko': {
            'Unnamed: 0': '행 번호가 열로 딸려 들어온 것 (쓰지 않는다)', 'subject': '참가자 번호',
            'attention': '주의 조건 (divided 나눔·focused 집중)', 'solutions': '퍼즐의 답 개수 (1·2·3)',
            'score': '점수',
        },
        'roles': {'v': 'score', 'cat': ['solutions', 'attention'], 'hue': 'attention'},
        'picks': [
            ['pointplot', '주의가 나뉘면 점수가 떨어질까? 답이 많은 퍼즐에서도 그럴까?'],
            ['barplot', '답의 개수에 따라 평균 점수가 어떻게 달라질까?'],
        ],
    },
    'anagrams': {
        'cat': 'lab', 'level': 2,
        'ko': '주의 집중과 낱말 퍼즐 점수 (넓은 표)',
        'desc': 'attention 과 같은 실험을 「한 행 = 참가자 한 명」으로 적은 넓은 표입니다. 답이 1·2·3개인 퍼즐 점수가 num1·num2·num3 세 열로 옆으로 늘어서 있습니다. '
                '긴 표와 넓은 표가 어떻게 다른지, melt( ) 로 어떻게 바꾸는지 배우기에 알맞습니다.',
        'row': '참가자 한 명',
        'src': 'Stanford Psych 252 수업 자료',
        'tags': ['넓은 표'],
        'colko': {
            'subidr': '참가자 번호', 'attnr': '주의 조건 (divided·focused)',
            'num1': '답이 1개인 퍼즐 점수', 'num2': '답이 2개인 퍼즐 점수', 'num3': '답이 3개인 퍼즐 점수',
        },
        'roles': {'wide': ['num1', 'num2', 'num3']},
        'picks': [
            ['boxplot', '넓은 표를 그대로 넣으면 seaborn 은 무엇을 x 축에 놓을까?'],
        ],
    },
    'exercise': {
        'cat': 'lab', 'level': 1,
        'ko': '운동 종류·식단에 따른 맥박 변화',
        'desc': '30명을 쉬기·걷기·달리기로 나누고 식단(지방 없음·저지방)도 나눈 뒤, 1분·15분·30분 때 맥박을 잰 실험 자료입니다. '
                '한 사람을 세 번 쟀기 때문에 시간에 따른 변화를 무리끼리 견주기 좋습니다.',
        'row': '한 사람의 한 시점',
        'src': 'Stanford Psych 252 수업 자료',
        'tags': ['반복 측정'],
        'colko': {
            'Unnamed: 0': '행 번호가 열로 딸려 들어온 것 (쓰지 않는다)', 'id': '참가자 번호',
            'diet': '식단 (no fat 지방 없음·low fat 저지방)', 'pulse': '맥박 (분당)',
            'time': '잰 때 (1분·15분·30분)', 'kind': '운동 종류 (rest 쉬기·walking 걷기·running 달리기)',
        },
        'roles': {
            'v': 'pulse', 'cat': ['time', 'kind', 'diet'], 'hue': 'kind', 'col': 'diet',
            'line': {'x': 'time', 'y': 'pulse', 'hue': 'kind'},
        },
        'picks': [
            ['pointplot', '달리기를 하면 시간이 갈수록 맥박이 어떻게 변할까?'],
            ['catplot', '식단에 따라 운동 뒤 맥박이 달라질까?'],
        ],
    },

    # ── 통계·인공지능 ──────────────────────────────────────────────
    'anscombe': {
        'cat': 'stat', 'level': 1,
        'ko': '앤스컴의 네 쌍둥이 자료',
        'desc': '통계학자 앤스컴이 1973년에 일부러 만든 네 묶음(I~IV)의 자료입니다. 네 묶음은 평균·분산·상관계수·회귀선이 거의 같은데 '
                '그래프로 그리면 전혀 다른 모습입니다. 「숫자만 보지 말고 먼저 그려 보라」는 교훈으로 유명합니다.',
        'row': '점 하나',
        'src': 'Anscombe (1973) — 위키백과 「Anscombe\'s quartet」',
        'tags': ['수업 단골', '긴 표'],
        'colko': {'dataset': '묶음 (I·II·III·IV)', 'x': 'x 값', 'y': 'y 값'},
        'roles': {'xy': ['x', 'y'], 'v': 'y', 'cat': ['dataset'], 'hue': 'dataset', 'col': 'dataset', 'lmcol': True},
        'picks': [
            ['lmplot', '평균과 상관계수가 같은 네 묶음은 그림도 같을까?'],
        ],
    },
    'glue': {
        'cat': 'stat', 'level': 2,
        'ko': '언어 인공지능 모델의 GLUE 성적표',
        'desc': '글을 이해하는 인공지능 모델 8개가 GLUE 라는 시험의 과제 8개에서 받은 점수입니다. '
                '모델이 나온 해와 구조(LSTM·Transformer)가 함께 적혀 있어, 인공지능이 몇 해 사이에 얼마나 나아졌는지 볼 수 있습니다.',
        'row': '한 모델의 한 과제',
        'src': 'GLUE 벤치마크 순위표',
        'tags': [],
        'colko': {
            'Model': '모델 이름', 'Year': '발표한 해', 'Encoder': '구조 (LSTM·Transformer)',
            'Task': '과제 이름', 'Score': '점수',
        },
        'roles': {
            'v': 'Score', 'cat': ['Model', 'Task'], 'hue': 'Encoder', 'horiz': True,
            'pivot': {'index': 'Model', 'columns': 'Task', 'values': 'Score'}, 'clusterPivot': True,
        },
        'picks': [
            ['heatmap', '어느 모델이 어느 과제를 잘할까? 모두에게 어려운 과제는?'],
            ['barplot', 'Transformer 모델과 LSTM 모델의 평균 점수는 얼마나 차이 날까?'],
        ],
    },
}

# 뒤쪽 이름이 겹치지 않게 순서를 고정한다 (sns.get_dataset_names( ) 와 같은 가나다순)
ORDER = sorted(ITEMS)
