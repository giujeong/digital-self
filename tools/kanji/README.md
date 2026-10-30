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
