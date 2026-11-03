"""toks → 단어 후보 목록 (bible_meta `<book>.<ch>.words` 의 초안).

사용:
  python3 tools/bible/pipeline/words.py toks.jsonl [prev_words.json ...] > words_draft.json

규칙 (1장 words 와 같은 형식 {w, r, ko, refs}):
  - 4원소 토큰([s, r, b, br])의 기본형 b 를 단어로. 읽기 r 은 기본형 읽기 br (가타카나는 표면형 그대로)
  - refs = 그 단어가 나오는 절 번호(v1) 오름차순, 중복 없음
  - ko 는 비워 둔다("") → 사람/클로드가 채운 뒤 upload.py 로 올린다
  - prev_words.json(앞 장 words)을 주면 같은 w 의 ko 를 미리 채운다(뜻 재사용)
"""
import json
import sys


def main(toks_path: str, prev_paths: list[str]) -> None:
    prev: dict[str, str] = {}
    for pp in prev_paths:
        for w in json.load(open(pp, encoding="utf-8")):
            if w.get("ko"):
                prev.setdefault(w["w"], w["ko"])
    words: dict[str, dict] = {}
    for line in open(toks_path, encoding="utf-8"):
        if not line.strip():
            continue
        u = json.loads(line)
        for t in u["toks"]:
            if not isinstance(t, list) or len(t) < 4:
                continue
            s, r, b, br = t
            e = words.setdefault(b, {"w": b, "r": br, "ko": prev.get(b, ""), "refs": []})
            if u["v1"] not in e["refs"]:
                e["refs"].append(u["v1"])
    out = sorted(words.values(), key=lambda e: (e["refs"][0], e["w"]))
    for e in out:
        e["refs"].sort()
    sys.stdout.write("[\n" + ",\n".join(json.dumps(e, ensure_ascii=False) for e in out) + "\n]\n")
    missing = sum(1 for e in out if not e["ko"])
    print(f"words {len(out)}, ko missing {missing}", file=sys.stderr)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2:])
