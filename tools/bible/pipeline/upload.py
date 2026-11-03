"""units.jsonl(+words.json) → Supabase 업로드 SQL (8절씩 쪼갬) + md5 대조문.

사용:
  python3 tools/bible/pipeline/upload.py units.jsonl --book jhn --ch 2 [--words words.json] [--out outdir]
  units.jsonl 한 줄: {"ord","v1","v2","jp","toks"[,"ko","al"]}

출력(outdir, 기본 ./out_<book>_<ch>/):
  00_check_before.sql   이미 있는 절 수·md5 (덮어쓰기 전 확인)
  01_units_01.sql …     8절씩 upsert (id = <book>.<ch>.<v1>, al 은 있을 때만 갱신)
  02_words.sql          bible_meta `<book>.<ch>.words` upsert (words.json 있을 때)
  03_check_after.sql    절 수 · jp md5 · k==ko 검사 — 기대 md5 는 파일 머리에 주석
규칙:
  - 본문은 레포에 넣지 않는다. 이 스크립트의 입력·출력 파일은 레포 밖(스크래치)에 둔다
  - SQL 문자열은 $u$ … $u$ 달러 인용으로 감싸므로 따옴표 걱정 없음
"""
import argparse
import hashlib
import json
import os


def q(s: str) -> str:
    assert "$u$" not in s
    return f"$u${s}$u$"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("units")
    ap.add_argument("--book", required=True)
    ap.add_argument("--ch", type=int, required=True)
    ap.add_argument("--words")
    ap.add_argument("--out")
    ap.add_argument("--chunk", type=int, default=8)
    a = ap.parse_args()
    units = [json.loads(l) for l in open(a.units, encoding="utf-8") if l.strip()]
    units.sort(key=lambda u: u["ord"])
    out = a.out or f"out_{a.book}_{a.ch}"
    os.makedirs(out, exist_ok=True)
    book, ch = a.book, a.ch
    jp_md5 = hashlib.md5("".join(u["jp"] for u in units).encode("utf-8")).hexdigest()

    open(os.path.join(out, "00_check_before.sql"), "w", encoding="utf-8").write(
        f"select count(*) n, md5(string_agg(jp,'' order by ord)) jp_md5, count(ko) filter (where ko<>'') n_ko, count(al) n_al\n"
        f"from bible_units where book='{book}' and ch={ch};\n"
    )

    for i in range(0, len(units), a.chunk):
        part = units[i : i + a.chunk]
        rows = []
        for u in part:
            uid = f"{book}.{ch}.{u['v1']}"
            toks = json.dumps(u["toks"], ensure_ascii=False)
            ko = u.get("ko") or ""
            al = json.dumps(u["al"], ensure_ascii=False) if u.get("al") else None
            rows.append(
                f"({q(uid)}, '{book}', {ch}, {u['v1']}, {u['v2']}, {u['ord']}, 'JCB', {q(u['jp'])}, {q(toks)}::jsonb, {q(ko)}, "
                + (f"{q(al)}::jsonb" if al else "null")
                + ")"
            )
        sql = (
            "insert into bible_units (id, book, ch, v1, v2, ord, ver, jp, toks, ko, al) values\n"
            + ",\n".join(rows)
            + "\non conflict (id) do update set v2=excluded.v2, ord=excluded.ord, jp=excluded.jp, toks=excluded.toks,\n"
            "  ko=case when excluded.ko<>'' then excluded.ko else bible_units.ko end,\n"
            "  al=coalesce(excluded.al, bible_units.al);\n"
        )
        n = i // a.chunk + 1
        open(os.path.join(out, f"01_units_{n:02d}.sql"), "w", encoding="utf-8").write(sql)

    if a.words:
        words = json.load(open(a.words, encoding="utf-8"))
        wid = f"{book}.{ch}.words"
        open(os.path.join(out, "02_words.sql"), "w", encoding="utf-8").write(
            f"insert into bible_meta (id, data) values ({q(wid)}, {q(json.dumps(words, ensure_ascii=False))}::jsonb)\n"
            "on conflict (id) do update set data=excluded.data;\n"
        )

    open(os.path.join(out, "03_check_after.sql"), "w", encoding="utf-8").write(
        f"-- 기대: n={len(units)}, jp_md5={jp_md5}\n"
        f"with u as (select v1, ko, al from bible_units where book='{book}' and ch={ch}),\n"
        "r as (select v1, ko, (select string_agg(case when jsonb_typeof(e.value)='array' then e.value->>0 else e.value#>>'{}' end,'' order by e.ordinality)\n"
        "  from jsonb_array_elements(al->'k') with ordinality e) kk from u where al is not null)\n"
        f"select (select count(*) from bible_units where book='{book}' and ch={ch}) n,\n"
        f"  (select md5(string_agg(jp,'' order by ord)) from bible_units where book='{book}' and ch={ch}) jp_md5,\n"
        "  (select count(*) from r) n_al, (select count(*) from r where kk=ko) al_ok, (select array_agg(v1) from r where kk<>ko) al_bad;\n"
    )
    print(f"{out}: units {len(units)}, chunks {(len(units)+a.chunk-1)//a.chunk}, jp_md5 {jp_md5}")


if __name__ == "__main__":
    main()
