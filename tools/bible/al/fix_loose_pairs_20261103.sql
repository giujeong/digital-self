-- B3 느슨한 짝 정리 (2026-11-03, 신수 "좋아"). 요 1장. 실행 완료 — 기록용.
-- 주의: 같은 절에 수정이 여러 개면 한 UPDATE 에 하나만 적용된다(같은 행 다중 갱신). 절마다 한 건씩 나눠 돌릴 것.
-- 해제(짝 끊기 → 색 없는 문자열): 44절 pos5 ','↔や · 46절 pos21 '이'↔など · 31절 pos2 '에는'↔最初 · 38절 pos26 '이'↔ご用 · 39절 pos18 '을'↔言われ · 43절 pos17 '에'↔途中
-- 문법(g) 재분류(ko 조각 3번째 요소 'g'): 21절 pos7·10·20 '요'↔か · 22절 pos7 '란'·pos9 '말이오'↔か · 11절 pos40·17절 pos15 '지만'↔が · 31절 pos14·33절 pos15 '줄'↔とは · 50절 pos17 '다고'↔と · 28절 pos26 '의'↔にある
with fixes(v1, pos, mode) as (values
 (44,5,'detach'),(46,21,'detach'),(31,2,'detach'),(38,26,'detach'),(39,18,'detach'),(43,17,'detach'),
 (21,7,'g'),(21,10,'g'),(21,20,'g'),(22,7,'g'),(22,9,'g'),(11,40,'g'),(17,15,'g'),(31,14,'g'),(33,15,'g'),(50,17,'g'),(28,26,'g')),
cur as (select f.v1, f.pos, f.mode, u.id, (u.al->'k')->(f.pos-1) piece from fixes f join bible_units u on u.book='jhn' and u.ch=1 and u.v1=f.v1),
newp as (select *, case when mode='detach' then to_jsonb(piece->>0) else jsonb_build_array(piece->0, piece->1, 'g') end np from cur where jsonb_typeof(piece)='array')
update bible_units u set al = jsonb_set(u.al, array['k', (n.pos-1)::text], n.np) from newp n where u.id=n.id;
-- 검사: check_k_equals_ko.sql → 47/47, loose_pairs.sql → 해제·재분류 항목이 더 이상 안 나와야 함
