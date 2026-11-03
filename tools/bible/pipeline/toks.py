"""jp 본문 → toks (형태소·후리가나). 1장 toks 를 재현하는 규칙을 고정한 것.

사용:
  uv run --with fugashi --with unidic-lite --python 3.12 python -I tools/bible/pipeline/toks.py in.tsv > out.jsonl
  in.tsv: 탭 구분 `ord v1 v2 jp [stored_md5]` (md5 가 있으면 재현 검사 결과를 stderr 에)
  out.jsonl: {"ord","v1","v2","jp","toks"} 한 줄씩

toks 형식 (bible_units.toks):
  문자열      = 한자 없는 토큰(그대로 출력)
  [s, r]      = 한자 토큰, 기본형을 붙이지 않는 경우 (한 글자 + 기본형이 다르거나 기본형 읽기가 다름)
  [s, r, b, br] = 한자 토큰 + 기본형 + 기본형 읽기
"""
import hashlib
import json
import re
import sys

from fugashi import Tagger

T = Tagger()


def kata2hira(s: str) -> str:
    return "".join(chr(ord(c) - 0x60) if "ァ" <= c <= "ヶ" else c for c in s)


def has_kanji(s: str) -> bool:
    return any("一" <= c <= "鿿" or c == "々" for c in s)


def kanji_only(s: str) -> str:
    return "".join(c for c in s if "一" <= c <= "鿿" or c == "々")


KATA = re.compile(r"^[ァ-ヶー]+$")
READ = {"私": "わたし", "方": "かた", "四": "よ", "何": "なに", "主": "しゅ"}
READ_FULL = {"開け": ("ひらけ", "ひらける")}  # 표면형별 읽기·기본형 읽기 강제
BASE_DROP = {"行く", "来る", "見る"}  # 1장 관례: 이 동사는 기본형을 붙이지 않는다 ["行き","いき"]


def tok(w):
    s = w.surface
    f = w.feature
    if not has_kanji(s):
        # 가타카나 낱말(고유명사·외래어)은 읽기 없이 기본형만: ["キリスト","","キリスト","キリスト"]
        if len(s) >= 2 and KATA.match(s):
            return [s, "", s, s]
        return s
    r = kata2hira(f.kana or f.pron or "")
    # 기본형은 lemma(作る·信ずる)가 아니라 표기 기본형 orthBase(造る·信じる)
    b = getattr(f, "orthBase", None) or f.lemma or s
    br = kata2hira(getattr(f, "kanaBase", "") or "")
    if s in READ:  # unidic 기본 읽기와 다른 1장 관례(私=わたし, 方=かた)
        r = READ[s]
        if b == s:
            br = r
    if s in READ_FULL:
        r, br = READ_FULL[s]
    if f.pos1 == "接尾辞" and s == "人":  # ユダヤ人·パリサイ人 → じん
        r = br = "じん"
    if b in BASE_DROP:
        return [s, r]
    if len(s) == 1:
        # 한 글자: 보통명사(子·語·時)만 기본형을 붙이고, 접두·접미사(全·者·人)·수사(一)·대명사(私)·동사(見·来)는 [s, r]
        if not (f.pos1 == "名詞" and f.pos2 == "普通名詞" and b == s and br == r):
            return [s, r]
    return [s, r, b, br]


def toks_of(jp: str):
    out = []
    for w in T(jp):
        x = tok(w)
        # 가타카나 고유명사가 쪼개지면(ベタ+ニヤ) 앞 가타카나 토큰에 이어 붙인다
        if isinstance(x, list) and x[1] == "" and out and isinstance(out[-1], list) and out[-1][1] == "":
            m = out[-1][0] + x[0]
            out[-1] = [m, "", m, m]
            continue
        out.append(x)
    return out


def pg_text(obj) -> str:
    """Postgres jsonb::text 와 같은 형태(", " 구분, 공백 없는 괄호)."""
    return json.dumps(obj, ensure_ascii=False, separators=(", ", ": "))


def main(path: str) -> None:
    ok = bad = 0
    for line in open(path, encoding="utf-8"):
        line = line.rstrip("\n")
        if not line:
            continue
        parts = line.split("\t")
        ord_, v1, v2, jp = int(parts[0]), int(parts[1]), int(parts[2]), parts[3]
        toks = toks_of(jp)
        rec = {"ord": ord_, "v1": v1, "v2": v2, "jp": jp, "toks": toks}
        print(json.dumps(rec, ensure_ascii=False))
        if len(parts) > 4 and parts[4]:
            h = hashlib.md5(pg_text(toks).encode("utf-8")).hexdigest()
            if h == parts[4]:
                ok += 1
            else:
                bad += 1
                print(f"MISMATCH v{v1}", file=sys.stderr)
    if ok or bad:
        print(f"reproduced {ok}/{ok + bad}", file=sys.stderr)


if __name__ == "__main__":
    main(sys.argv[1])
