# pipeline — 새 장 추가 (2장부터)

1장에서 손으로 한 단계를 스크립트로 고정한 것. **본문·중간 파일은 레포 밖(스크래치)에** 둔다.

| 단계 | 도구 | 입력 → 출력 | 비고 |
|---|---|---|---|
| 0 | 신수 | bible.com 에서 장 단위 붙여넣기(스크래핑 금지) → `jhn2_jp.tsv` (`ord v1 v2 jp`) | 묶음 절은 v1-v2 로 한 줄 (A안) |
| 1 | `toks.py` | tsv → `units.jsonl`(toks) | `uv run --with fugashi --with unidic-lite --python 3.12 python -I tools/bible/pipeline/toks.py jhn2_jp.tsv > units.jsonl`. 1장 재현 44/47(27·32·36절은 1장 수작업 편차: 始め/続け/上げる 기본형 생략) |
| 2 | `words.py` | units.jsonl (+ 앞 장 words.json) → `words_draft.json` | ko 빈칸. 앞 장 words 를 주면 같은 단어 뜻은 자동 |
| 3 | 클로드 | words_draft 의 `ko` 채우기, `ko` 초벌 번역(절마다), `al` 생성 | al 포맷·검사는 `tools/bible/al/README.md`. **k 조각 이어붙임 == ko** |
| 4 | `upload.py` | units.jsonl(+ko, al), words.json → `out_jhn_2/*.sql` | 8절씩 upsert, 앞뒤 검사 SQL 포함 |
| 5 | MCP/SQL Editor | 00_check_before → 01_units_* 순서대로 → 02_words → 03_check_after | 기대 md5 는 03 파일 머리 주석 |
| 6 | 앱 | `tpl.html` 의 BOOKS/장 목록에 2장 노출(코드 1줄) → `make.py` → 미리보기 → "좋아" → 푸시 | 본문은 레포에 없음 |

toks 규칙(1장 관례) 은 `toks.py` 머리 주석과 `READ`/`READ_FULL`/`BASE_DROP` 표에 있다. 새 장에서 읽기가 틀린 낱말은 거기에 한 줄 추가.
