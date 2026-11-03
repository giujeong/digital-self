-- 느슨한 조사 짝 후보: ko 조각이 조사(p)로 연결됐는데 통상 대응표 밖인 것
with u as (select v1, toks, al from bible_units where book='jhn' and ch=1),
k as (select u.v1, u.toks, u.al, e.value piece, e.ordinality pos from u, jsonb_array_elements(u.al->'k') with ordinality e where jsonb_typeof(e.value)='array'),
p as (select k.*, piece->>0 kt, (piece->>1)::int gid, piece->>2 flag from k),
j as (select p.*, gr.value->>1 gtype,
  (select string_agg(case when jsonb_typeof(toks->(x::int))='array' then toks->(x::int)->>0 else toks->>(x::int) end,'' order by o)
   from jsonb_array_elements_text(gr.value->2) with ordinality q(x,o)) js
  from p, jsonb_array_elements(p.al->'g') gr where (gr.value->>0)::int=p.gid)
select v1, pos, kt, coalesce(flag,'') flag, gtype, js from j
where coalesce(flag,gtype)='p' and not (
  (js in ('は') and kt in ('은','는','에는','께는','까지는')) or
  (js in ('が') and kt in ('이','가','께서')) or
  (js in ('を') and kt in ('을','를')) or
  (js in ('の') and kt in ('의','인','은','는')) or
  (js in ('に','へ','には') and kt in ('에','에게','께','로','에는','께는')) or
  (js in ('で','では') and kt in ('에서','로','으로','에는')) or
  (js in ('と') and kt in ('와','과','하고','라고','이라고','고')) or
  (js in ('も') and kt in ('도')) or
  (js in ('から') and kt in ('부터','에서','에게서')) or
  (js in ('まで') and kt in ('까지')) or
  (js in ('より') and kt in ('보다')) or
  (js in ('こそ') and kt in ('야말로','이야말로')) or
  (js in ('だけ') and kt in ('만','뿐')) or
  (js in ('でも') and kt in ('도')) or
  (js in ('のように','ように') and kt in ('처럼'))
) order by v1, pos;
