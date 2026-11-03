# jpbible 빌드 — 공개 파일만 만든다(한자 카드 데이터 + 화면). 성경 본문은 Supabase(회원 전용)에만 있음.
import json,os,sys,shutil
B=os.path.dirname(os.path.abspath(__file__));REPO=os.path.dirname(os.path.dirname(B));OUT=os.path.join(REPO,'public','bible')
sys.path.insert(0,os.path.join(REPO,'tools','kanji'))
K=json.load(open(os.path.join(REPO,'tools','kanji','data.json'),encoding='utf-8'))['chars']
X=json.load(open(os.path.join(B,'extra_kanji.json'),encoding='utf-8'))
import importlib.util
spec=importlib.util.spec_from_file_location('kd',os.path.join(REPO,'tools','kanji','data.py'))
# strokes()만 쓰기 위해 data.py를 실행하지 않고 함수만 가져온다
src=open(os.path.join(REPO,'tools','kanji','data.py'),encoding='utf-8').read().split('def ex(')[0]
ns={'__file__':os.path.join(REPO,'tools','kanji','data.py')};exec(src,ns);strokes=ns['strokes']
import sys as _s;_s.path.insert(0,os.path.join(REPO,'tools','qa'));from lint import lint;lint(os.path.join(B,'tpl.html'),'bible')
out={}
for c,v in K.items():
    out[c]={"hun":v["hun"],"on":v["on"],"kun":v["kun"],"parts":v.get("parts",""),"memo":v.get("memo",""),"s":v["s"],"pg":v.get("pg"),"busu":1}
for c,v in X.items():
    out[c]={"hun":v["hun"],"on":v["on"],"kun":v["kun"],"s":strokes(c)}
KWP=os.path.join(B,'kanji_words.json')
if os.path.exists(KWP):
    KW=json.load(open(KWP,encoding='utf-8'))
    for c in out:
        if c in KW: out[c]['kw']=KW[c]
os.makedirs(OUT,exist_ok=True)
open(os.path.join(OUT,'bible-kanji.json'),'w',encoding='utf-8').write(json.dumps(out,ensure_ascii=False,separators=(',',':')))
t=open(os.path.join(B,'tpl.html'),encoding='utf-8').read()
open(os.path.join(OUT,'index.html'),'w',encoding='utf-8').write(t)
for f in ('icon-192.png','icon-512.png','apple-touch-icon.png'):
    p=os.path.join(B,'assets',f)
    if os.path.exists(p): shutil.copy(p,OUT)
print('built ->',OUT,len(out),'kanji')
