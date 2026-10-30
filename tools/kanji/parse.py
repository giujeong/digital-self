import re,glob,os,json
CJK=r'[㐀-鿿⺀-⿟豈-﫿]'
def parse_file(path):
    t=open(path,encoding='utf-8').read()
    fm=dict(re.findall(r'^(\w+): (.*)$',t.split('---')[1],re.M))
    body=t.split('---',2)[2]
    lines=body.split('\n')
    lessons=[];chars={};cur=None;curch=None;mode=None;points=[]
    i=0
    while i<len(lines):
        ln=lines[i];s=ln.strip()
        m=re.match(r'^(\d+)\. (.+)$',ln)
        if m:
            h=m.group(2).strip()
            mm=re.match(r'('+CJK+r')\(([^,)]+)',h)
            series=bool(mm)
            if mm: head,name=mm.group(1),mm.group(2).strip()
            else:
                c=re.search(CJK,h);head=c.group(0) if c else '·';name=re.sub(r'\s*—.*$','',h)
            cur={"id":os.path.basename(path)[6:-3]+'-'+m.group(1),"head":head,"name":name,"chars":[],"point":"","date":fm.get('date',''),"src":fm.get('source',''),"series":series}
            lessons.append(cur);mode='entry'
            if series:
                if head not in chars:
                    chars[head]={"hun":name,"on":[],"kun":[],"parts":"기본자","memo":"","ex":[],"rad":True}
                cur['chars'].append(head)
            i+=1;continue
        m=re.match(r'^\s+('+CJK+r') = (.+)$',ln)
        if m and mode!='point' and cur is not None and m.group(1) in chars and chars[m.group(1)].get('rad') and not chars[m.group(1)]['memo']:
            v=chars[m.group(1)];v['memo']=m.group(2).strip()
            pp=re.match(r'^(\S+ \+ [^:—]+?)\s*[:—]',v['memo'])
            if pp: v['parts']=pp.group(1).strip()
            i+=1;continue
        if s.startswith('포인트'):mode='point';i+=1;continue
        if mode=='point':
            if s:points.append(s)
            i+=1;continue
        m=re.match(r'^\s+\((?:\d+|복습)\) ('+CJK+r') (.+)$',ln)
        if m and cur is not None:
            ch=m.group(1);rest=m.group(2)
            note=''
            hun,_,parts=rest.partition(' = ')
            hm=re.match(r'^(.*?)\s*\((.*)\)\s*$',hun)
            if hm and not parts: hun,note=hm.group(1),hm.group(2)
            pm=re.match(r'^(.*?)\s{1,}\((.*)\)\s*$',parts)
            if pm: parts,note=pm.group(1),pm.group(2)
            parts=parts.strip()
            on=[];kun=[];memo=[]
            j=i+1
            while j<len(lines) and lines[j].strip() and not re.match(r'^\s+\((?:\d+|복습)\) ',lines[j]) and not re.match(r'^\s+[AB]:',lines[j]) and not lines[j].strip().startswith('예문'):
                x=lines[j].strip()
                if x.startswith('音') or x.startswith('訓'):
                    o=re.search(r'音 (.+?)(?: · 訓|$)',x);k=re.search(r'訓 (.+)$',x)
                    if o: on=[re.sub(r'\([ぁ-ゖ]+\)','',r).strip() for r in re.split(r'[・·]',o.group(1)) if r.strip()]
                    if k: kun=[re.sub(r'\s+\(.*\)$','',r).strip() for r in k.group(1).split('・') if r.strip()]
                else: memo.append(x)
                j+=1
            if ch not in cur['chars']:cur['chars'].append(ch)
            if ch in chars and chars[ch].get('rad'):
                old=chars[ch];del chars[ch]
            else: old=None
            if ch not in chars:
                chars[ch]={"hun":hun.strip(),"on":on,"kun":kun,"parts":parts or hun.strip(),"memo":' '.join(memo)+((' ('+note+')') if note and note!='복습' else ''),"ex":[]}
                if old: chars[ch]["ex"]=old["ex"]
            curch=None;i=j;continue
        m=re.match(r'^\s*- ('+CJK+r')\(([^)]+)\)(\S*)\s*:\s*(.*)$',ln)
        if m and m.group(1) in chars:
            ch,inner,ok,rest=m.groups()
            r=inner.split('・')[0]
            r=f"{r}({ok})" if ok else r
            jp,kana,ko=rest,'',''
            mm=re.match(r'^(.*?)\s*\(([ぁ-ゖー・、。 ]+)\)\s*(.*)$',rest)
            if mm: jp,kana,ko=mm.group(1).strip(),mm.group(2),mm.group(3)
            elif i+1<len(lines):
                nx=re.match(r'^\s*\(([^)]+)\)\s*(.*)$',lines[i+1])
                if nx: kana,ko=nx.group(1),nx.group(2);i+=1
            chars[ch]["ex"].append({"r":r,"jp":jp,"kana":kana,"ko":ko})
        i+=1
    for l in lessons:
        l['point']=' / '.join(p for p in points if any(c in p for c in l['chars']))
    return fm,lessons,chars
if __name__=='__main__':
    for f in sorted(glob.glob('/home/claude/digital-self/content/works/kanji-*.md')):
        fm,L,C=parse_file(f)
        print(f,[ (l['head'],l['name'],l['chars']) for l in L])
        for ch,v in C.items():
            bad=[e['r'] for e in v['ex'] if e['r'] not in v['on']+v['kun']]
            if bad or not v['ex'] or not (v['on'] or v['kun']): print('  !',ch,v['on'],v['kun'],bad,len(v['ex']))
