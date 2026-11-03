# 빌드 전 점검 — make.py가 부르고, 실패하면 빌드를 멈춘다.
# 1) 같은 id가 두 번 (예: 11-02 v0.27 홈 의견 카드 id="fb"가 복습 피드백 id="fb"를 가로챔 → 복습이 멈춘 것처럼 보임)
# 2) 인라인 <script> 문법 오류 (node --check)
import re,sys,os,subprocess,tempfile
# 같은 자리에 번갈아 그려지는 템플릿(동시에 화면에 없는 것)만 여기 등록
ALLOW={'bible':{'pclose'}}
def lint(path,app):
    t=open(path,encoding='utf-8').read();bad=[]
    ids=re.findall(r'\bid="([^"$]+)"',t);seen={}
    for i in ids: seen[i]=seen.get(i,0)+1
    dup=sorted(i for i,n in seen.items() if n>1 and i not in ALLOW.get(app,set()))
    if dup: bad.append('id 중복: '+', '.join(dup))
    for n,js in enumerate(re.findall(r'<script>(.*?)</script>',t,re.S)):
        with tempfile.NamedTemporaryFile('w',suffix='.js',delete=False,encoding='utf-8') as f: f.write(js.replace('__DATA__','null'))
        try:
            r=subprocess.run(['node','--check',f.name],capture_output=True,text=True)
            if r.returncode: bad.append(f'script#{n} 문법: '+(r.stderr.strip().splitlines() or ['?'])[-1])
        except FileNotFoundError: pass
        finally: os.unlink(f.name)
    if bad:
        print('✗ 점검 실패 ('+app+')\n  '+'\n  '.join(bad));sys.exit(1)
    print('✓ 점검 통과 ('+app+'): id',len(ids),'· script ok')
if __name__=='__main__':
    R=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    for a in ('kanji','bible'): lint(os.path.join(R,'tools',a,'tpl.html'),a)
