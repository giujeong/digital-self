import os
B=os.path.dirname(os.path.abspath(__file__));REPO=os.path.dirname(os.path.dirname(B));OUT=os.path.join(REPO,'public','kanji');import shutil
t=open(B+'/tpl.html',encoding='utf-8').read()
d=open(B+'/data.json',encoding='utf-8').read().strip()
os.makedirs(B+'/preview',exist_ok=True);open(B+'/preview/부수한자_preview.html','w',encoding='utf-8').write(t.replace('__DATA__',d))
s=t
for a,b in [("const D = __DATA__;","let D=null;"),
 ("let curL=(_last&&D.chars[_last]&&D.lessons.find(l=>l.chars.includes(_last)))||D.lessons[0], curC=(_last&&curL.chars.includes(_last))?_last:curL.chars[0]","let curL=null, curC=null")]:
    assert a in s,a; s=s.replace(a,b)
a="\nrenderAll();\n</script>"; assert a in s
s=s.replace(a,"""
function boot(d){D=d;curL=(_last&&D.chars[_last]&&D.lessons.find(l=>l.chars.includes(_last)))||D.lessons[0];curC=(_last&&curL.chars.includes(_last))?_last:curL.chars[0];renderAll()}
fetch('kanji-data.json',{cache:'no-cache'}).then(r=>r.json()).then(boot).catch(()=>{document.getElementById('v-learn').innerHTML='<p class="note">글자 데이터를 불러오지 못했어요. 인터넷 연결을 확인하고 새로고침해 주세요.</p>'});
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}
</script>""")
te=s.index('</title>')+8
head='''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="부수 계열로 일본 한자를 익히고 간격 복습으로 꺼내는 학습장 — 정기우">
<meta name="theme-color" content="#2B2620">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon-192.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="부수 한자">
'''
open(OUT+'/index.html','w',encoding='utf-8').write(head+s[:te]+'\n<style>body{margin:0}img{max-width:100%}</style>\n</head>\n<body>\n'+s[te:]+'\n</body>\n</html>\n')
open(OUT+'/kanji-data.json','w',encoding='utf-8').write(d)
for f in os.listdir(B+'/assets'): shutil.copy(os.path.join(B,'assets',f),OUT)
print('built ->',OUT)
