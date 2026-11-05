// 흐름 점검 — 화면에서 실제로 눌러 보고 다음으로 넘어가는지 확인 (playwright 필요).
//   node tools/qa/flow.cjs           (레포 루트에서, public/ 빌드 후)
//   .cjs 인 이유: package.json 이 "type":"module" 이라 .js 는 require 를 못 쓴다
//   맥: playwright 를 레포 밖에 두고 NODE_PATH 로 — tools/qa/README.md
// 실패하면 exit 1. 새 화면·흐름을 만들면 여기 한 묶음씩 추가.
const {chromium}=require('playwright');
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'..','..','public');
const TYPES={'.html':'text/html','.json':'application/json','.js':'text/javascript','.webmanifest':'application/manifest+json','.png':'image/png'};
const srv=http.createServer((q,r)=>{let f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));if(f.endsWith('/'))f+='index.html';
  fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':TYPES[path.extname(f)]||'application/octet-stream'});r.end(b)})});
const fails=[];const ok=(name,cond,info)=>{console.log((cond?'✓ ':'✗ ')+name+(info?' — '+info:''));if(!cond)fails.push(name)};
// Supabase 없이 돌리는 가짜 클라이언트 (모든 호출이 {data:null} 로 끝남)
const SB_STUB=`(function(){const mk=()=>new Proxy(function(){},{get:(t,k)=>k==='then'?(res)=>res({data:null,error:null}):mk(),apply:()=>mk()});window.supabase={createClient:()=>mk()}})()`;
(async()=>{
  await new Promise(r=>srv.listen(0,r));const base='http://localhost:'+srv.address().port;
  // 브라우저 묶음(npx playwright install)이 없으면 맥에 깔린 크롬으로
  const b=await chromium.launch().catch(()=>chromium.launch({channel:'chrome'}));
  const page=async()=>{const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
    await p.route('**/*',r=>{const u=r.request().url();if(u.includes('supabase')&&u.endsWith('.js'))return r.fulfill({contentType:'text/javascript',body:SB_STUB});return u.startsWith(base)?r.fallback():r.abort()});return [p,errs]};
  // ── 부수 한자: 복습 — 답 고르기 → 피드백이 복습 칸에 보임 → 다음 → 새 문제
  {const [p,errs]=await page();await p.goto(base+'/kanji/');await p.waitForFunction(()=>typeof D!=='undefined'&&D);
    const r=await p.evaluate(()=>{curL=D.lessons[D.lessons.length-1];show('review');startReview(true);let n=0;while(Q&&Q.type==='paper'&&n++<20)next();
      const rv=document.getElementById('rv');const o=rv.querySelector('.opt');if(!o)return{err:'선택지 없음'};o.click();
      const fb=rv.querySelector('.fb');const nx=rv.querySelector('.fb button');const vis=!!(fb&&fb.textContent.trim()&&fb.offsetParent);
      if(nx)nx.click();return{vis,hasNext:!!nx,after:rv.querySelectorAll('.opt').length,lock:rv.dataset.lock}});
    ok('한자 복습: 답 고른 뒤 피드백이 보임',r.vis,JSON.stringify(r));ok('한자 복습: 다음 → 새 문제',r.hasNext&&r.after>0&&r.lock==='0');
    ok('한자: 화면 오류 없음',!errs.length,errs.join(' | '));await p.close()}
  // ── 부수 한자: 복습 평가 — 답이 유형별로 기록 → 약점·강점 판정 → 제안 버튼이 그 유형만 냄
  {const [p,errs]=await page();await p.goto(base+'/kanji/');await p.waitForFunction(()=>typeof D!=='undefined'&&D);
    const r=await p.evaluate(()=>{ST={h:{},d:{},ses:[]};
      ST.h.reading=Array(12).fill(0).map((_,i)=>i%3?0:1);ST.h.meaning=Array(12).fill(1);ST.h.char=Array(12).fill(1).map((x,i)=>i%5?1:0);
      const lv={reading:stLevel('reading'),meaning:stLevel('meaning'),paper:stLevel('paper')};
      const c={};for(let i=0;i<400;i++){const k=stPick(['meaning','reading','char','reading']);c[k]=(c[k]||0)+1}
      show('home');const btn=document.querySelector('#home [data-focus="reading"]');const hasCard=!!document.querySelector('#home .ev');
      if(btn)btn.click();const types=new Set();queue.forEach(ch=>types.add(makeQ(ch,1).type));const q=Q&&Q.type;const n0=(ST.h.reading||[]).length;
      document.querySelector('#rv .opt').click();document.getElementById('rvnx').click();
      return{lv,c,hasCard,btn:!!btn,q,types:[...types],rec:(ST.h.reading||[]).length-n0,hard:stHard('meaning')}});
    ok('복습 평가: 약점·강점·보류 판정',r.lv.reading==='weak'&&r.lv.meaning==='strong'&&r.lv.paper==='wait',JSON.stringify(r.lv));
    ok('복습 평가: 약한 유형이 더 자주 나옴',r.c.reading/400>0.6,JSON.stringify(r.c));
    ok('복습 평가: 대시보드 카드·제안 버튼',r.hasCard&&r.btn);
    ok('복습 평가: 집중 연습은 그 유형만, 답이 기록됨',r.q==='reading'&&r.types.join()==='reading'&&r.rec===1,JSON.stringify({q:r.q,types:r.types,rec:r.rec}));
    ok('복습 평가: 강점 유형은 강화',r.hard===true);
    ok('복습 평가: 화면 오류 없음',!errs.length,errs.join(' | '));await p.close()}
  // ── 부수 한자: 익혔어요 → 꺼내 보기 퀴즈 팝업 — 문제마다 다음으로 넘어감 → 끝나면 오늘 복습에 들어감
  {const [p,errs]=await page();await p.goto(base+'/kanji/');await p.waitForFunction(()=>typeof D!=='undefined'&&D);
    const r=await p.evaluate(async()=>{const ch=Object.keys(D.chars).find(x=>!D.chars[x].rad&&D.chars[x].ex.length&&D.chars[x].s.length);delete S[ch];curL=D.lessons.find(l=>l.chars.includes(ch));curC=ch;show('learn');renderAll();
      $('learnbtn').click();const open=!$('lqov').hidden;const n=LQ.qs.length;let steps=0,auto=true;
      while(LQ&&LQ.i<LQ.qs.length&&steps++<10){const i0=LQ.i;const o=$('lqcard').querySelector('.opt');if(!o)break;o.click();await new Promise(r=>setTimeout(r,5000));if(LQ.i===i0)auto=false}
      const endShown=!!$('lqend');const inS=!!S[ch];$('lqend')&&$('lqend').click();return{open,n,auto,endShown,inS,closed:$('lqov').hidden}});
    ok('익혔어요 퀴즈: 팝업 열림·문제 2개(뜻·읽기)',r.open&&r.n===2,JSON.stringify(r));ok('익혔어요 퀴즈: 답 고르면 저절로 다음',r.auto);ok('익혔어요 퀴즈: 끝 → 오늘 복습에 들어감 → 닫힘',r.endShown&&r.inS&&r.closed);
    const r2=await p.evaluate(()=>{const ch=curC;delete S[ch];renderAll();$('learnbtn').click();const ov=$('lqov');ov.dispatchEvent(new MouseEvent('click',{bubbles:true}));return{closed:ov.hidden,notAdded:!S[ch],lq:LQ===null}});
    ok('익혔어요 퀴즈: 바깥 누르면 닫힘(복습에 안 넣음)',r2.closed&&r2.notAdded&&r2.lq,JSON.stringify(r2));
    const r4=await p.evaluate(async()=>{const ch=Object.keys(D.chars).find(x=>!D.chars[x].rad&&D.chars[x].ex.length>=1&&D.words.some(w=>w.w.includes(x)&&w.w!==x));delete S[ch];curL=D.lessons.find(l=>l.chars.includes(ch));curC=ch;show('learn');renderAll();lqStart(true);
      LQ.qs.sort((a,b)=>(a.t==='meaning'?0:1)-(b.t==='meaning'?0:1));lqDraw();const wrong=()=>{const q=LQ.qs[LQ.i];const i=q.opts.findIndex(o=>o!==q.ans);$('lqcard').querySelectorAll('.opt')[i].click()};
      const right=()=>{const q=LQ.qs[LQ.i];const i=q.opts.indexOf(q.ans);$('lqcard').querySelectorAll('.opt')[i].click()};const w=ms=>new Promise(r=>setTimeout(r,ms));
      right();await w(500);wrong();await w(2800);const t1=LQ.qs[LQ.i]&&LQ.qs[LQ.i].t;right();await w(500);const t2=LQ.qs[LQ.i]&&LQ.qs[LQ.i].t,rt=LQ.qs[LQ.i]&&LQ.qs[LQ.i].retry;right();await w(500);
      const miss=S[ch]&&S[ch].miss;$('lqend')&&$('lqend').click();S[ch].due=TODAY;queue=[ch];practice=false;FOCUS=null;next();const rem=Q&&Q.remind&&Q.type==='reading';return{ch,t1,t2,rt,miss,rem}});
    ok('익혔어요 퀴즈: 예문 틀리면 → 단어 읽기 → 같은 예문 다시',r4.t1==='word'&&r4.t2==='reading'&&r4.rt,JSON.stringify(r4));
    ok('익혔어요 퀴즈: 틀린 유형 기록 → 복습에서 먼저·표시',JSON.stringify(r4.miss)==='["reading"]'&&r4.rem);
    const r5=await p.evaluate(async()=>{const ch=Object.keys(D.chars).find(x=>!D.chars[x].rad&&D.chars[x].ex.length);delete S[ch];curL=D.lessons.find(l=>l.chars.includes(ch));curC=ch;show('learn');renderAll();lqStart(true);
      const w=ms=>new Promise(r=>setTimeout(r,ms));while(LQ&&LQ.i<LQ.qs.length){const q=LQ.qs[LQ.i];$('lqcard').querySelectorAll('.opt')[q.opts.indexOf(q.ans)].click();await w(500)}
      const rd=S[ch].rd;$('lqend').click();S[ch].due=TODAY;queue=[ch];practice=false;FOCUS=null;const ts=[];for(let i=0;i<6;i++){next();ts.push(Q.type);queue=[ch]}return{rd,ts}});
    ok('익혔어요 퀴즈: 다 맞히면 복습은 바로 예문부터',r5.rd===1&&r5.ts.every(x=>x==='reading'),JSON.stringify(r5));
    const r6=await p.evaluate(()=>{show('home');renderHome();const b=$('hmwr');b.click();const open=!$('wrov').hidden&&!!$('wrcard').offsetParent,n=WR&&WR.cs.length;const cv=$('wrpad').querySelector('canvas');
      const R=cv.getBoundingClientRect();const ev=(t,x,y)=>cv.dispatchEvent(new PointerEvent(t,{clientX:R.left+x,clientY:R.top+y,pointerId:1,bubbles:true}));ev('pointerdown',20,20);ev('pointermove',120,120);ev('pointerup',120,120);
      const drawn=WR.strokes.length;const h0=(ST.h.paper||[]).length;$('wrdone').click();const ref=!!$('wrpad').querySelector('svg.ref');const adv=$('wrtools').querySelectorAll('.wr-adv li').length;const rec=(ST.h.paper||[]).length===h0+1;$('wrnx').click();wrClose();show('learn');renderAll();return{open,n,drawn,ref,rec,adv,closed:$('wrov').hidden}});
    ok('써 보기: 홈 버튼 → 손가락으로 쓰기 → 자동 판정·조언 → 기록',r6.open&&r6.n>0&&r6.drawn===1&&r6.ref&&r6.rec&&r6.adv>0&&r6.closed,JSON.stringify(r6));
    const r3=await p.evaluate(()=>{const ch=curC;delete S[ch];renderAll();const b=$('learnmute');const vis=!!b.offsetParent;b.click();const m=LQ&&LQ.mute;const head=$('lqcard').textContent.includes('🔇');lqClose();return{vis,m,head}});
    ok('익혔어요 퀴즈: 🔇 소리 없이 버튼 → 무음 퀴즈',r3.vis&&r3.m&&r3.head,JSON.stringify(r3));
    ok('익혔어요 퀴즈: 화면 오류 없음',!errs.length,errs.join(' | '));await p.close()}
  // ── jpbible: 책·장·절 고르기 — 열림 → 책 바꾸면 장·절이 그 책으로
  {const [p,errs]=await page();await p.goto(base+'/bible/');await p.waitForTimeout(600);
    const r=await p.evaluate(()=>{IDX=[];CHAPS.forEach(([b,c])=>{for(let v=1;v<=3;v++)IDX.push({id:b+'.'+c+'.'+v,book:b,ch:c,v1:v,v2:v,ord:v})});
      bkB=book;bkC=ch;document.getElementById('bk').hidden=false;renderBk();
      const books=[...document.querySelectorAll('#bkl [data-b]')].map(e=>e.dataset.b);const last=books[books.length-1];
      document.querySelector('#bkl [data-b="'+last+'"]').click();
      return{books:books.length,chaps:document.querySelectorAll('#bkm [data-c]').length,verses:document.querySelectorAll('#bkr [data-j]').length,label:document.getElementById('bks').textContent}});
    ok('jpbible 고르기: 책 목록',r.books===new Set(await p.evaluate(()=>CHAPS.map(x=>x[0]))).size,JSON.stringify(r));
    ok('jpbible 고르기: 책 바꾸면 장·절 갱신',r.chaps>0&&r.verses===3);ok('jpbible: 화면 오류 없음',!errs.length,errs.join(' | '));await p.close()}
  await b.close();srv.close();
  if(fails.length){console.log('✗ 흐름 점검 실패 '+fails.length);process.exit(1)}console.log('✓ 흐름 점검 통과')})();
