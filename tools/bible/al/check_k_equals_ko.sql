-- k 조각 이어붙임 == ko 검사 (모든 절)
with u as (select book, ch, v1, ko, al from bible_units where al is not null),
r as (select book, ch, v1, ko,
  (select string_agg(case when jsonb_typeof(e.value)='array' then e.value->>0 else e.value#>>'{}' end,'' order by e.ordinality)
   from jsonb_array_elements(al->'k') with ordinality e) kk from u)
select book, ch, count(*) total, count(*) filter (where kk=ko) ok, array_agg(v1 order by v1) filter (where kk<>ko) bad
from r group by book, ch order by book, ch;
