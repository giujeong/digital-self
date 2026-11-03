// 흐름 점검 — 화면에서 실제로 눌러 보고 다음으로 넘어가는지 확인 (playwright 필요).
//   node tools/qa/flow.js            (레포 루트에서, public/ 빌드 후)
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
  const b=await chromium.launch();
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
