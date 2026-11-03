# 예문 단어 추출 — fugashi(unidic-lite) 필요. data.py 다음에 실행. 결과 words.json은 커밋.
import json,re,collections,sys,os
HERE=os.path.dirname(os.path.abspath(__file__))
import fugashi
T=fugashi.Tagger()
D=json.load(open(os.path.join(HERE,'data.json'),encoding='utf-8'))
h=lambda s:''.join(chr(ord(c)-0x60) if 'ァ'<=c<='ヶ' else c for c in (s or ''))
KEEP4={'老若男女','健康診断','記者会見'}
FIX={'木曜日':'もくようび','土曜日':'どようび','水曜日':'すいようび','出納係':'すいとうがかり','老若男女':'ろうにゃくなんにょ','木の葉':'きのは','一足':'いっそく','年':'とし','政':'まつりごと','下':'した','明日':'あした','小麦粉':'こむぎこ','日本語':'にほんご','富士山':'ふじさん','韓国人':'かんこくじん','大音声':'だいおんじょう','仇':'かたき','主人公':'しゅじんこう','日本':'にほん','面':'おもて'}
STOP={'為る','有る','居る','此の','其の','彼の','事','物','様','為','方','所','時','中','人','私','貴方','無い','良い','言う','成る','出来る','見る','行く','来る','貰う','下さる','頂く','呉れる','置く','仕舞う','付く','思う','分かる'}
NOUNY=lambda f:(f.pos1=='名詞' and f.pos2 in('普通名詞','固有名詞')) or f.pos1=='接頭辞' or (f.pos1=='接尾辞' and f.pos2=='名詞的')
def toks(s):
    out=[];buf=[]
    def flush():
        if not buf: return
        parts=[(b.surface,h(b.feature.kana or '')) for b in buf]
        comp=''.join(p[0] for p in parts)
        if len(parts)>1 and all(len(p[0])>=2 for p in parts) and comp not in KEEP4:
            for p in parts: out.append({'w':p[0],'r':p[1],'pos':'名詞'})
        else: out.append({'w':comp,'r':''.join(p[1] for p in parts),'pos':'名詞'})
        buf.clear()
    for w in T(s):
        f=w.feature
        if NOUNY(f) and f.pos2!='数詞' and not (f.pos2=='固有名詞' and f.pos3=='人名') and not (f.pos1=='接尾辞' and not re.search(r'[㐀-鿿]',w.surface)):
            kata=bool(re.fullmatch(r'[ァ-ヶー]+',w.surface))
            if buf and (f.pos1=='接頭辞' or kata!=bool(re.fullmatch(r'[ァ-ヶー]+',buf[-1].surface))): flush()
            buf.append(w);continue
        flush()
        if f.pos1 in('動詞','形容詞','形状詞','副詞') and not (f.pos1=='動詞' and f.pos2=='非自立可能'):
            out.append({'w':f.orthBase or w.surface,'r':h(f.kanaBase or f.kana or ''),'pos':f.pos1})
    flush();return out
words=collections.OrderedDict()
for ch,v in D['chars'].items():
    for ei,e in enumerate(v['ex']):
        for t in toks(e['jp']):
            if t['w'] in STOP or not re.search(r'[㐀-鿿々ァ-ヶ]',t['w']): continue
            t['r']=FIX.get(t['w'],t['r'])
            if re.fullmatch(r'[ァ-ヶー]+',t['w']): t['r']=t['w']
            if t['pos']=='名詞' and t['r'] and t['r'] not in e['kana']: print('READ?',t['w'],t['r'],e['kana'],file=sys.stderr)
            o=words.setdefault(t['w'],{"w":t['w'],"r":t['r'],"pos":t['pos'],"in":[]})
            if [ch,ei] not in o["in"]: o["in"].append([ch,ei])
print(len(words),file=sys.stderr)
json.dump(list(words.values()),open(os.path.join(HERE,'words.json'),'w',encoding='utf-8'),ensure_ascii=False,indent=0)
