# 부수 한자 빌드 도구 (jpkanji.giujeong.me = public/kanji/)

원천 → 앱
- `content/works/kanji-*.md` (사이트 공부 글) + `data.py` 안의 직접 작성분(249~251쪽 W·PG·RADM, 부수자 연상 DRAFT·예문 HX)
- 화면 틀: `tpl.html` (연상 그림 ILL 도 여기)
- 필순: `kvg/` (KanjiVG, CC BY-SA 3.0 — 없으면 data.py 가 자동으로 받음)

빌드
    python3 tools/kanji/data.py     # → tools/kanji/data.json
    python3 tools/kanji/make.py     # → public/kanji/{index.html, kanji-data.json, sw.js, manifest, icons}
                                    #   + tools/kanji/preview/부수한자_preview.html (데이터 내장 미리보기)

배포 규칙: 미리보기 → 신수 "좋아" → main 푸시 (Vercel 자동, giujeong.me/kanji 와 jpkanji.giujeong.me 동시)
sw.js 의 CACHE 이름을 버전마다 올리면 폰 캐시가 새로 받음.
루프: 볼트 「프로토콜_한자공부_루프_v2」

## JLPT 데이터 (tools/kanji/jlpt/)
- levels.json — 한자별 JLPT(신 기준) 급수. 출처: davidluzgouveia/kanji-data (KANJIDIC2 기반). N5는 통용 80자 목록으로 보정
- vocab.json — N5~N1 단어 [급수, 표제어, 읽기, 영어 뜻]. 출처: jamsinclair/open-anki-jlpt-decks
- jlpt_ko.json — 표제어 → 한국어 뜻 (신지 번역). 뜻이 있는 단어만 앱에 실림. `data.py` 실행 시 미번역 수를 출력
- freq.json — 단어 빈도(zipf). `freq.py`가 만듦(wordfreq 일본어 말뭉치 + fugashi). 사전에 없는 복합어는 조각 조합 빈도 − 조각 경계당 1, 접사형(～人)은 −1.5

## 단어 원칙 (2026-11-05 신수)
- **급수 단어**: 급수 제한 없음(N5~N1) · **자주 쓰는 순** · 한자당 **10개 상한** · 같은 표기는 한 번. 뜻이 없으면 빠지므로 `data.py`의 「JLPT 미번역」이 0이 되게 jlpt_ko.json을 채운다
- **예문 단어**: 예문마다 그 문장에 쓰인 단어 칩(읽기·뜻, 누르면 소리). 4자 이상 덩어리는 조각 풀이(絶滅危惧種 = 絶滅 + 危惧 + 種) — `words.py`의 parts

점검: `make.py`가 `tools/qa/lint.py`(id 중복·문법)를 자동 실행 — 실패하면 빌드 멈춤. 커밋 전 `node tools/qa/flow.cjs`(복습 흐름). → `tools/qa/README.md`

## 설계 원칙 — 학습 패턴을 읽고 맞춰 준다 (2026-11-05 신수)
> "학습자의 학습패턴을 익히는데 쓰는거지 잘외운사람은 그에 맞게 약하면 떠올릴수있게 작은출력기회를 주어 보조하게" · "심리, 교육 모두 뇌와 근육에 연결되"
- 퀴즈·복습 결과는 점수가 아니라 **패턴 신호**다 (유형별 정답률 `ST`, 글자별 `S[ch].miss`·`rd`).
- **강하면 앞으로**: 다 맞힌 글자는 복습을 예문부터(`rd`), 강한 유형은 '강화'(어려운 형태).
- **약하면 한 단계 낮춰 꺼내게**: 예문을 틀리면 단어 읽기 → 같은 예문 다시, 틀린 유형은 복습에서 먼저 + 표시.
- 근거는 원리 수준에서(인출 연습·간격 반복·오류 후 교정·비계·전문성 역전·운동 기억). 구체적 값(0.3초 등)은 근거 없음 → 사용 데이터로 맞춘다.
- 새 기능을 붙일 때 점검: 강할 때 무엇이 줄어드나 / 약할 때 어떤 작은 출력이 생기나.

## 남은 일
- [ ] 뜻을 틀렸을 때 받쳐 주기 — 부품·연상구 힌트 → 뜻 한 번 더 (설계 원칙의 빈 칸)
- [x] 손으로 써 보기 — 홈 「써 보기」 (11/5)
- [x] 급수 단어 0개인 55자(JLPT 목록 밖 한자) — 예문 단어만으로 충분 (11/5 신수 결정)
- [ ] 맞춤 복습 약한 것 기준(평균 −8점 또는 65% 미만) — 1주 사용 후 신수 판단 (`docs/tasks_jpbible-jpkanji_20261103.md` B7 과 동기)
