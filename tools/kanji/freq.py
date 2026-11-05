# 단어 빈도 — wordfreq(일본어 말뭉치) zipf 값. 사전에 없는 복합어는 fugashi로 쪼개 조합. 결과 freq.json은 커밋.
# 필요: pip install wordfreq fugashi unidic-lite  /  data.py 전에 실행(단어가 바뀔 때만)
import json,math,os,re
from wordfreq import get_frequency_dict
import fugashi
HERE=os.path.dirname(os.path.abspath(__file__))
F=get_frequency_dict('ja');T=fugashi.Tagger()
def z(w):
    aff=bool(re.search(r'^[～~]|[～~]$',w))  # ～人 같은 접사형은 단독 글자보다 낮게
    w=re.sub(r'\(.*?\)','',re.sub(r'^[～~]|[～~]$','',w)).split(';')[0].strip()
    if w in F: return round(math.log10(F[w])+9-(1.5 if aff else 0),2)
    fs=[F.get(t.surface) for t in T(w)]
    if not fs or None in fs: fs=[F.get(ch) for ch in w]  # 형태소로도 안 되면 글자 단위
    if not fs or None in fs: return 0
    # 사전에 없는 말 = 덜 쓰이는 말: 조각 조합 빈도에서 조각 경계마다 1씩 깎음
    return round(math.log10(1/sum(1/f for f in fs))+9-(len(fs)-1)-(1.5 if aff else 0),2)
C=json.load(open(os.path.join(HERE,'data.json'),encoding='utf-8'))['chars']
JV=json.load(open(os.path.join(HERE,'jlpt','vocab.json'),encoding='utf-8'))
WJ=json.load(open(os.path.join(HERE,'words.json'),encoding='utf-8'))
ws={e for n,e,r,en in JV if any(c in e for c in C)}|{w['w'] for w in WJ}
out={w:z(w) for w in sorted(ws)}
json.dump(out,open(os.path.join(HERE,'freq.json'),'w',encoding='utf-8'),ensure_ascii=False,indent=0)
print('freq',len(out),'0점',sum(1 for v in out.values() if not v))
