# jpbible — 일본어 성경 읽기 (뼈대 인수인계, 2026-11-03)

이 폴더에는 **성경 본문이 없다.** JCB 본문은 저작권(Biblica) 때문에 Supabase 잠긴 표에만 있다.

## Supabase (프로젝트 jpkanji, qfypowruejziftranphu)
- `bible_members(user_id)` — 허용 계정 목록. 지금은 신수 계정 1개만.
- `is_bible_member()` — RLS용 함수
- `bible_units(id, book, ch, v1, v2, ord, ver, jp, toks jsonb, ko)` — 회원만 읽기. 요한복음 1장 47단위(JCB는 1-2·6-7·11-12·24-25절을 묶음). md5(string_agg(jp order by ord)) = 9e38988f9b2781193d0c5da94117fa70
  - `toks`: 토큰 배열. 문자열 = 그대로 출력, 배열 = [표면형, 읽기(후리가나), 기본형, 기본형 읽기]
  - `ko`: 신수 평이한 한국어 번역 — 아직 비어 있음
- `bible_meta(id, data)` — `jhn.1.words` = 단어 195개 {w, r, ko, refs}
- `bible_progress(user_id, rd, srs, words, sent, log)` — 본인+회원만

## 파일
- `make.py` — 공개 파일 빌드: `public/bible/bible-kanji.json`(부수한자 data.json + extra_kanji.json + KanjiVG 필순) + `tpl.html` → `public/bible/index.html`
- `extra_kanji.json` — 부수한자에 없는 1장 한자 153자(KANJIDIC 읽기 + 훈음)
- `hun.json` — 위 153자 훈음 원본 / `wgloss.json` — 단어 뜻 원본

## 남은 일 (2026-11-03 밤 기준 — 원본은 `docs/tasks_jpbible-jpkanji_20261103.md`)
끝남: tpl.html(읽기·복습·일본어 모드) · jpbible.giujeong.me 도메인·Redirect URL · 느슨한 짝 정리(k==ko 47/47) · 일본어 모드 단어 복습 · 새 장 파이프라인 `pipeline/`.

1. **LINE 로그인(B1)** — 신수가 LINE 채널 생성(볼트 `261103 일본어 성경 읽기 jpbible/조사_LINE로그인_Supabase연결_v1_20261103` §1) → Supabase Custom OAuth2 `custom:line` 등록 → `tpl.html` 로그인 버튼(일본어 모드에서 LINE 앞). 결정 대기: 카카오 계정과 identity linking 여부
2. **한국어 번역 검토(B2)** — 신수가 절 번호+수정문 → `ko` 갱신 → 그 절 `al` 재생성(k 조각은 ko 정확 일치) → `al/` 검사 SQL 통과 → 미리보기. 큰 SQL은 8절씩, md5 대조
3. **2장 이후(B6)** — 신수가 bible.com에서 장 단위 붙여넣기(스크래핑 금지) → `pipeline/` toks → words → ko 초벌 → al → upload. 1장 toks 재현 44/47(27·32·36절 수작업 편차)
4. 허락 요청(A3) — 아래 「허락」
5. 마무리 체크 — 매 화면 판권 문구 + bible.com 링크 유지
6. 결정 대기(신수) — 한자 광고 계측 코드(`local/kanji-ads-20261030`)를 tpl.html로 이식할지(광고 실험 11-06 예정)

규칙: `public/bible/index.html`은 생성 파일 — `tpl.html` 고치고 `make.py`(먼저 `tools/kanji/data.py`). 미리보기 → "좋아" → 커밋·푸시. `git commit -a` 금지. 본문(jp·toks·ko·al)은 레포에 절대 넣지 않기.

## 허락
Biblica Permission Request Form 3단계 작성 중(11/3), いのちのことば社 문의 양식 작성(사람 확인 후 送信 필요). 승인 전까지 개인용.
