# 과업 — jpbible·jpkanji (클로드 코드용, 2026-11-03 저녁)

> 출처: 코워크(신지) 핸드오프 2026-11-03 12:50. 이 문서가 작업 순서의 원본. 끝난 항목은 지우지 말고 `[x]`로.

## 0. 시작 전
- [x] `git pull` — 11-03 21:5x rebase 완료(로컬 10-30 한자 커밋 2건은 생성 파일 직접 수정이라 origin 쪽 채택, 광고 계획 문서만 유지, 원본은 브랜치 `local/kanji-ads-20261030`). 로컬 main이 origin보다 10커밋 뒤(768ea54까지). origin/jpbible-skeleton 브랜치도 있음(뼈대 단계, 참고용)
- [x] 규칙: **미리보기 → 신수 "좋아" → 커밋·푸시(main → Vercel)**. 커밋 보류 시 사유 설명
- [x] 규칙: **성경 본문(jp·toks·ko·al)은 레포·정적 파일에 절대 넣지 않기** — Supabase `bible_units`(회원 전용 RLS)에만
- [x] 빌드: 먼저 `python3 tools/kanji/data.py`(gitignore 된 data.json 생성) → `python3 tools/bible/make.py` (tpl.html + kanji_words.json → public/bible/)
- [x] 배포 확인(11-03 21:5x): 프로덕션 dpl_2xkib…= 768ea54 main, 라이브 /bible/·/kanji/ md5 = 커밋 파일 일치. Vercel이 푸시를 놓친 적 있음 → deployments API로 sha 대조. 놓치면 빈 커밋으로 재배포

## 1. 지금 상태 (배포됨)
- jpbible 임시 주소 https://jpkanji.giujeong.me/bible/ (정식 jpbible.giujeong.me 미연결)
- 요한복음 1장 47단위(JCB 묶음 절: 1-2, 6-7, 11-12, 24-25). Supabase 프로젝트 jpkanji (`qfypowruejziftranphu`)
  - `bible_units.ko` 47절 = 신지 초벌 한국어 번역(검토 전)
  - `bible_units.al` jsonb 47절 = 일·한 대응 하이라이트(색 7종, 동사·형용사 변형 풀이 171개). **k 조각은 ko와 정확 일치가 연결 조건** → ko 고치면 그 절 al 재생성
  - 한자 카드: 발음 칩 音·訓·한(TTS), 한자별 단어+예문 359자 (`tools/bible/kanji_words.json`, 일 1,213 / 한 1,156)
- jpkanji: 홈 「이어서 익히기」= 안 익힌 다음 글자(현재 又)
- ⚠ 정렬 작업 파일(/home/claude/bible/al: check.py 검증기, example.json 포맷)은 클라우드 컨테이너에만 있었고 **지금은 없음**. 필요하면 Supabase al 데이터를 내려받아 포맷을 역으로 확인하고 `tools/bible/al/`에 검증기를 다시 두기

## 2. 과업 (우선순위 순)

### A. 환경·외부 (클로드 코드가 직접 — 로그인·CAPTCHA·최종 제출만 신수)
- [x] A1 (완료 11-03 22:1x — 신수가 `vercel domains add` 실행, DNS는 Vercel 네임서버라 CNAME 불필요. 확인: / → 307 → /bible/ 200, 인증서 *.giujeong.me) Vercel 도메인: `vercel domains add jpbible.giujeong.me` (프로젝트 digital-self, `.vercel/` 링크 있음) → 안내되는 CNAME 값 확인. DNS는 giujeong.me 등록처에서 `jpbible CNAME cname.vercel-dns.com` — 등록처 CLI/API 없으면 브라우저로 직접 등록 (신수 로그인)
- [x] A2 (완료 11-03 22:5x — 신수가 대시보드에서 `https://jpbible.giujeong.me/**` 추가, jpkanji 줄 유지) Supabase Redirect URL: 프로젝트 `qfypowruejziftranphu` Auth 설정에 `https://jpbible.giujeong.me/**` 추가 — Management API(`PATCH /v1/projects/{ref}/config/auth`, `uri_allow_list`) 또는 대시보드. 기존 jpkanji URL 유지(덮어쓰기 금지)
- [ ] A3 허락 요청: Biblica Permission Request Form 3단계 — 브라우저로 이어서 작성, 제출 직전 화면 보여주고 신수 "좋아" 후 제출. いのちのことば社 문의 양식은 CAPTCHA·送信만 신수
- [x] A4 (A안으로 진행, 11-03 — 신수 이견 없음) 묶음 절(1-2, 6-7, 11-12, 24-25) — A안(원문 묶음 유지) 추천. 신수가 달리 말하지 않으면 A안으로 진행하고 B4에서 표시만 통일

### B. 클로드 코드 작업
- [ ] B1 **LINE 로그인** — LINE Developers 채널 생성(브라우저, 로그인은 신수) → Channel ID/Secret 받기 → Supabase 커스텀 OIDC 등록 → tpl.html 로그인 화면에 LINE 버튼(카카오 옆). 일본어 UI 모드에서는 LINE을 앞에
- [ ] B2 **한국어 번역 검토 루프** — 신수가 절 번호+수정문을 주면: `ko` 갱신 → 해당 절 `al` 재생성(k 조각 재연결) → 해시 대조 → 미리보기. 절 단위 SQL 스크립트로(큰 SQL은 8절씩 쪼개기, md5 대조)
- [x] B3 (완료 11-03 22:3x — 신수 "좋아": 해제 6·문법 재분류 9 적용, 유지 52. k==ko 47/47, 재집계 잔여 0. 기록 `tools/bible/al/fix_loose_pairs_20261103.sql`) **느슨한 짝 정리** — 46절 など↔이, 44절 や↔쉼표 등 조사·기호가 억지로 묶인 짝 → 짝 해제 또는 '문법' 색으로 분류. 먼저 47절 전체를 훑어 느슨한 짝 목록을 뽑아 신수에게 보고 후 수정
- [x] B4 (확인 11-03: vlabel `1:1-2`, 절 격자 `1-2`, bible.com 링크 `1.1-2` 모두 묶음 표기 통일, 코드 변경 없음) 묶음 절 표시 — A안 기준으로 「1-2절」 표시 통일 확인(코드 변경 없을 가능성 큼)
- [~] B5 (11-03 23:0x 구현·미리보기 3장 보냄, 커밋 전 — 신수 "좋아" 대기. SRS 공유 유지 추천) **일본어 모드 단어 복습** — 지금은 한국어판과 같은 방식. 일본어 모드에서는 "한국어 뜻 고르기" 중심으로(일본인 학습자 관점). 복습 데이터는 `bible_progress.words` 재사용, 모드별 SRS 분리 여부는 신수 확인
- [~] B6 (11-03 23:3x 스크립트 3종 `tools/bible/pipeline/` + README — toks 1장 재현 44/47, words·upload 1장 스모크 통과. 남은 것: 신수가 2장 본문 붙여주면 3단계(ko·al)부터) **2장 파이프라인** — 신수가 bible.com에서 장 단위 붙여넣기(스크래핑 금지) → toks(형태소·후리가나) → words(bible_meta `jhn.N.words`) → ko 초벌 → al 생성 → 8절 단위 업로드 + md5 대조. 1장에서 손으로 한 단계를 `tools/bible/pipeline/` 스크립트로 고정해 2장부터는 한 명령으로

### C. 마무리 체크
- [ ] 매 화면 판권 문구 + bible.com 링크 유지 확인
- [ ] `tools/bible/README.md` 「남은 일」 갱신(이 문서와 동기)
- [ ] 코워크 복귀용 핸드오프: 끝난 것·남은 것·결정 필요한 것 3줄

## 3. 참고
- 레포: giujeong/digital-self (main → Vercel). 로컬 `~/Dev/digital-self`
- 1장 jp md5 = 9e38988f9b2781193d0c5da94117fa70 (`md5(string_agg(jp order by ord))`)
- 코워크 핸드오프 원본: 프로젝트 문서 `claude/핸드오프_jpbible·jpkanji_v1_20261103.md`
