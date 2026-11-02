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

## 남은 일
1. `tpl.html` 작성 — 로그인(카카오, 부수한자와 같은 Supabase) → 회원 확인 → 읽기(절 카드·후리가나 토글·한자 탭=부수한자 카드·단어 탭=뜻·▶듣기·읽었어요) → 복습(한자/단어/문장) → 매 화면 판권 문구 + bible.com 링크
2. `vercel.json`에 jpbible.giujeong.me 호스트 규칙(jpkanji와 같은 방식, /bible/)
3. 신수 작업: Vercel 도메인 추가 + DNS CNAME, Supabase Auth Redirect URLs에 https://jpbible.giujeong.me 추가
4. 미리보기 → "좋아" → 배포 (본문은 레포·정적 파일에 절대 넣지 않기)
5. 한국어 번역(ko) 입력, 2장 이후 추가 — 신수가 bible.com에서 장 단위로 붙여 주기(스크래핑 금지)

## 허락
Biblica Permission Request Form 3단계 작성 중(11/3), いのちのことば社 문의 양식 작성(사람 확인 후 送信 필요). 승인 전까지 개인용.
