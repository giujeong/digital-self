# al — 일·한 대응(하이라이트) 데이터 도구

`bible_units.al` (jsonb) 포맷 — Supabase 데이터에서 역으로 확인(2026-11-03):

```
al = {
  v1: 절 번호,
  g:  [[gid, type, [jp 토큰 인덱스…]], …]   # 일본어 쪽 묶음. type = n 명사 · a 부사 · d 지시어 · v 동사 · j 형용사 · p 조사 · g 문법
  k:  [ "그대로 출력할 문자열" | [ko 조각, gid] | [ko 조각, gid, type덮어쓰기], … ]   # 한국어 쪽. 조각을 순서대로 이으면 ko 와 정확히 같아야 한다
  nk: { gid: "ko:기본형+어미…/ja:基本形+…" }  # 변형 풀이 키(동사·형용사)
  vg: { gid: [gid, …] }                      # 풀이 하나가 덮는 gid 묶음
  notes: { 키: { t_ko, t_ja, tip_ko, tip_ja, kr: [[어간, 붙임, 결과, 설명ko, 설명ja]…], jr: [...] } }
}
```

연결 조건: `k` 조각 텍스트를 이어 붙인 문자열 == `ko`. (`ko` 를 고치면 그 절 `al` 을 다시 만들어야 한다.)

## 검사
- `check_k_equals_ko.sql` — 47절 전부 `k` 이어붙임 == `ko` 인지 (2026-11-03: 47/47 통과)
- `loose_pairs.sql` — 조사(p) 짝 가운데 통상 대응표(は↔은/는 …) 밖인 것 목록. 사람이 판정(해제 / 문법 g 재분류 / 유지)

실행: Supabase SQL Editor 또는 MCP `execute_sql` (프로젝트 qfypowruejziftranphu).
