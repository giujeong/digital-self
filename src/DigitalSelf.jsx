import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Youtube } from 'lucide-react';
import { mdWorks, findWork, mdProjects, findProject, standaloneWorks } from './content';

const slugFromPath = () => {
  const m = window.location.pathname.match(/^\/works\/([^/]+)/);
  return m ? decodeURIComponent(m[1]) : null;
};
const projectFromPath = () => {
  const m = window.location.pathname.match(/^\/projects\/([^/]+)/);
  return m ? decodeURIComponent(m[1]) : null;
};
const sectionFromPath = () => (slugFromPath() ? 'work' : projectFromPath() ? 'project' : 'home');
const STAGES = ['질문', '푸는 중', '변화'];

export default function DigitalSelf() {
  const [workSlug, setWorkSlug] = useState(slugFromPath());
  const [projectSlug, setProjectSlug] = useState(projectFromPath());
  const [activeSection, setActiveSection] = useState(sectionFromPath());

  useEffect(() => {
    const onPop = () => {
      setWorkSlug(slugFromPath());
      setProjectSlug(projectFromPath());
      setActiveSection(sectionFromPath());
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const openWork = (slug) => {
    window.history.pushState({}, '', `/works/${slug}`);
    setWorkSlug(slug);
    setActiveSection('work');
    window.scrollTo(0, 0);
  };

  const closeWork = () => {
    window.history.pushState({}, '', '/');
    setWorkSlug(null);
    setProjectSlug(null);
    setActiveSection('works');
    window.scrollTo(0, 0);
  };

  const [projectBack, setProjectBack] = useState('works');
  const openProject = (slug, from) => {
    if (from) setProjectBack(from);
    window.history.pushState({}, '', `/projects/${slug}`);
    setProjectSlug(slug);
    setWorkSlug(null);
    setActiveSection('project');
    window.scrollTo(0, 0);
  };

  const ProjectBack = () => (
    <button
      onClick={() => {
        if (projectBack === 'journey') {
          window.history.pushState({}, '', '/');
          setProjectSlug(null);
          setActiveSection('journey');
          window.scrollTo(0, 0);
        } else closeWork();
      }}
      className="text-xs text-stone-500 hover:text-stone-700 mb-14 transition-colors"
    >
      ← {projectBack === 'journey' ? 'Journey' : 'Works'}
    </button>
  );
  const ProjectHead = ({ p }) => (
    <>
      {p.question && <p className="text-xs text-amber-800 mb-2">Q. {p.question}</p>}
      <h1 className="text-3xl font-light text-stone-800 mb-3 break-keep">{p.title}</h1>
      {p.stage && <StageSteps stage={p.stage} />}
      <div className="mt-8 text-sm text-stone-700 leading-relaxed break-keep whitespace-pre-wrap">{p.body}</div>
    </>
  );

  const currentWork = workSlug ? findWork(workSlug) : null;
  const currentProject = projectSlug ? findProject(projectSlug) : null;
  const workProject = currentWork?.project ? findProject(currentWork.project) : null;

  useEffect(() => {
    const t = currentWork?.title || currentProject?.title;
    document.title = t ? `${t} | 정기우` : '정기우 | Digital Self';
  }, [currentWork, currentProject]);

  const StageSteps = ({ stage }) => (
    <div className="flex gap-1.5 mt-3">
      {STAGES.map((s) => (
        <span
          key={s}
          className={`text-xs px-2.5 py-0.5 rounded-full border ${s === stage ? 'bg-stone-800 text-white border-stone-800' : 'border-stone-200 text-stone-500'}`}
        >
          {s}
        </span>
      ))}
    </div>
  );
  const [showQuote, setShowQuote] = useState(0);
  const [works, setWorks] = useState([]);
  const [loadingWorks, setLoadingWorks] = useState(true);

  const quotes = [
    "넘어지되 다시 일어나는 자",
    "질문하는 자, 문제 푸는 사람",
    "참 인간은 주님의 임재 안에서 가능하다",
    "막연함에서 명료함으로",
  ];

  // Firebase에서 works 불러오기
  useEffect(() => {
    const q = query(
      collection(db, 'works'),
      where('status', '==', 'published'),
      orderBy('year', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const worksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWorks(worksData);
      setLoadingWorks(false);
    }, (error) => {
      console.error('Error fetching works:', error);
      setLoadingWorks(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const birthDate = new Date(1988, 2, 4);
  const today = new Date();
  const ageInDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
  const ageInYears = Math.floor(ageInDays / 365.25);

  // 카테고리별 스타일
  const categoryStyles = {
    Writing: 'bg-amber-100 text-amber-800',
    Learning: 'bg-blue-100 text-blue-800',
    Project: 'bg-green-100 text-green-800',
    default: 'bg-stone-100 text-stone-600'
  };

  const sections = {
    home: (
      <div className="min-h-screen flex flex-col justify-center items-center px-6">
        <div className="text-center max-w-xl">
          <p className="text-xs tracking-widest text-stone-400 mb-6">DIGITAL SELF</p>
          <h1 className="text-4xl md:text-5xl font-light text-stone-800 mb-4">
            정기우
          </h1>
          <p className="text-2xl text-stone-600 mb-1" lang="he" dir="rtl">קָם</p>
          <p className="text-xs text-stone-400 mb-6">캄</p>
          <p className="text-sm text-stone-500 mb-2">1988. 3. 4 —</p>
          <p className="text-xs text-stone-400 mb-16">
            {ageInDays.toLocaleString()}일째 살아가는 중
          </p>
          
          <div className="h-12 flex items-center justify-center mb-16">
            <p className="text-base text-stone-600 font-light">
              "{quotes[showQuote]}"
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {['identity', 'journey', 'works', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className="px-5 py-2 text-xs tracking-wider text-stone-500 border border-stone-200 hover:border-stone-400 hover:text-stone-700 transition-all duration-200"
              >
                {section.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="mt-16">
            <p className="text-base text-stone-600 tracking-widest">千里之行 始於足下</p>
            <p className="text-base text-stone-600 tracking-widest mt-2">無爲故無敗</p>
          </div>

          <div className="mt-10">
            <p className="text-base text-stone-600 tracking-widest">待人春風 持己秋霜</p>
          </div>
        </div>
      </div>
    ),

    identity: (
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-xl mx-auto">
          <button 
            onClick={() => setActiveSection('home')}
            className="text-xs text-stone-400 hover:text-stone-600 mb-16 transition-colors"
          >
            ← Back
          </button>
          
          <h2 className="text-2xl font-light text-stone-800 mb-16">Identity</h2>
          
          <div className="space-y-16">
            <div>
              <p className="text-xs tracking-widest text-stone-400 mb-6">WHO I AM</p>
              <div className="space-y-3 text-sm text-stone-600 leading-relaxed">
                <p><span className="font-medium text-stone-800">믿는 자.</span> 넘어지되 다시 일어나는 자.</p>
                <p><span className="font-medium text-stone-800">질문하는 자.</span> 문제 푸는 사람.</p>
                <p><span className="font-medium text-stone-800">확신.</span> 참 인간은 주님의 임재 안에서 가능하다.</p>
              </div>
            </div>

            <div>
              <p className="text-xs tracking-widest text-stone-400 mb-6">WHERE I STAND</p>
              <div className="text-sm text-stone-600 leading-loose space-y-4">
                <p>하나님 앞에서 인간의 존엄을 믿기에 국가의 오만을 경계하고,</p>
                <p>현장을 믿기에 설계자를 의심하며,</p>
                <p>기술로 이념의 토대를 바꾸려는</p>
                <p className="text-stone-800 pt-4 border-t border-stone-200">
                  복음주의 실사구시자.
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs tracking-widest text-stone-400 mb-6">THE FINITE & THE ETERNAL</p>
              <div className="text-sm text-stone-600 leading-loose space-y-4">
                <p>2025년, 양가의 조부모 세대가 모두 이 땅을 떠나셨다.</p>
                <p>아내와 나 사이에 아이는 없다. 우리가 마지막 세대일 수 있다.</p>
                <p>유한의 끝을 자각한다. 그래서 더 분명하게 산다.</p>
                <p className="text-stone-800 pt-4 border-t border-stone-200">
                  유한 안에서 영원을 향해.<br />
                  남은 세대로서, 더 분명하게.
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs tracking-widest text-stone-400 mb-6">CORE VALUES</p>
              <div className="space-y-3 text-sm text-stone-600">
                <p><span className="font-medium text-stone-800">Resilience.</span> 넘어져도 일어난다.</p>
                <p><span className="font-medium text-stone-800">Inquiry.</span> 질문이 답을 찾는다.</p>
                <p><span className="font-medium text-stone-800">Presence.</span> 임재 안에서 참 인간.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    journey: (
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-xl mx-auto">
          <button 
            onClick={() => setActiveSection('home')}
            className="text-xs text-stone-400 hover:text-stone-600 mb-16 transition-colors"
          >
            ← Back
          </button>
          
          <h2 className="text-2xl font-light text-stone-800 mb-16">Journey</h2>
          
          <div className="space-y-8 text-sm">
            <div className="flex gap-6">
              <span className="text-stone-400 w-20 shrink-0">1988</span>
              <div>
                <p className="font-medium text-stone-800">태어남</p>
                <p className="text-stone-500">3월 4일, 여정의 시작</p>
              </div>
            </div>

            <div className="flex gap-6">
              <span className="text-stone-400 w-20 shrink-0">Childhood</span>
              <div>
                <p className="font-medium text-stone-800">막연한 두려움</p>
                <p className="text-stone-500">유한함을 생각조차 할 수 없던 시절</p>
              </div>
            </div>

            <div className="flex gap-6">
              <span className="text-stone-400 w-20 shrink-0">Faith</span>
              <div>
                <p className="font-medium text-stone-800">믿는 자가 되다</p>
                <p className="text-stone-500">질문하고, 넘어지고, 다시 일어나는 법을 배우다</p>
              </div>
            </div>

            <div className="flex gap-6">
              <span className="text-stone-400 w-20 shrink-0">2025</span>
              <div>
                <p className="font-medium text-stone-800">세대의 끝</p>
                <p className="text-stone-500">유한의 끝을 다시 마주하다</p>
              </div>
            </div>

            <div className="flex gap-6">
              <span className="text-stone-400 w-20 shrink-0">Now</span>
              <div>
                <p className="font-medium text-stone-800">나를 정의하다</p>
                <p className="text-stone-500">막연함에서 명료함으로</p>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-stone-200">
            <p className="text-xs tracking-widest text-stone-400 mb-4">CURRENT PROJECTS</p>
            {mdProjects.map((p, i) => (
              <button
                key={p.slug}
                onClick={() => openProject(p.slug, 'journey')}
                className={`block w-full text-left group ${i ? 'mt-8' : ''}`}
              >
                <p className="font-medium text-stone-800 mb-1 group-hover:underline underline-offset-4">「{p.title}」</p>
                {p.question && <p className="text-xs text-amber-800 mb-1">Q. {p.question}</p>}
                <p className="text-sm text-stone-500">{p.body.split('\n')[0]}</p>
                <p className="text-xs text-stone-500 mt-1">{[p.stage, p.posts.length ? `글 ${p.posts.length}편` : '공개 준비 중'].filter(Boolean).join(' · ')}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    ),

    works: (
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-xl mx-auto">
          <button 
            onClick={() => setActiveSection('home')}
            className="text-xs text-stone-400 hover:text-stone-600 mb-16 transition-colors"
          >
            ← Back
          </button>
          
          <h2 className="text-2xl font-light text-stone-800 mb-4">Works</h2>
          <p className="text-sm text-stone-500 mb-16">질문하고, 문제 풀고, 나누는 것들</p>
          
          {mdWorks.length > 0 && (
            <div className="mb-16">
              <p className="text-xs tracking-widest text-stone-500 mb-6">RECENT</p>
              <div className="space-y-5">
                {mdWorks.slice(0, 5).map((w) => {
                  const proj = w.project ? findProject(w.project) : null;
                  return (
                    <button key={w.slug} onClick={() => openWork(w.slug)} className="block w-full text-left group">
                      <p className="text-xs text-stone-500">{[w.date, proj?.title].filter(Boolean).join(' · ')}</p>
                      <p className="text-base text-stone-800 group-hover:underline underline-offset-4 break-keep">{w.title}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {mdProjects.length > 0 && (
            <p className="text-xs tracking-widest text-stone-500 mb-6">PROJECTS</p>
          )}
          {mdProjects.length > 0 && (
            <div className="space-y-10 mb-10">
              {mdProjects.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => openProject(p.slug, 'works')}
                  className="block w-full text-left pb-8 border-b border-stone-200 group"
                >
                  {p.question && <p className="text-xs text-amber-800 mb-1">Q. {p.question}</p>}
                  <p className="text-lg font-medium text-stone-800 group-hover:underline underline-offset-4">{p.title}</p>
                  <p className="text-xs text-stone-500 mt-1">프로젝트 · {p.posts.length ? `글 ${p.posts.length}편` : '공개 준비 중'}{p.updated ? ` · 최근 ${p.updated}` : ''}</p>
                  {p.stage && <StageSteps stage={p.stage} />}
                </button>
              ))}
            </div>
          )}

          {standaloneWorks.length > 0 && (
            <div className="space-y-10 mb-12">
              {standaloneWorks.map((w) => (
                <button
                  key={w.slug}
                  onClick={() => openWork(w.slug)}
                  className="block w-full text-left pb-8 border-b border-stone-200 group"
                >
                  {w.question && <p className="text-xs text-amber-800 mb-1">Q. {w.question}</p>}
                  <p className="text-lg font-medium text-stone-800 group-hover:underline underline-offset-4">{w.title}</p>
                  <p className="text-xs text-stone-500 mt-1">{[w.category, w.date].filter(Boolean).join(' · ')}</p>
                  {w.stage && <StageSteps stage={w.stage} />}
                </button>
              ))}
            </div>
          )}

          {loadingWorks ? (
            <p className="text-sm text-stone-400">불러오는 중...</p>
          ) : works.length === 0 && mdWorks.length === 0 ? (
            <p className="text-sm text-stone-400">아직 등록된 작업이 없습니다.</p>
          ) : (
            <div className="space-y-12">
              {works.map((work) => (
                <div key={work.id} className="pb-8 border-b border-stone-200">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs px-2 py-1 rounded ${categoryStyles[work.category] || categoryStyles.default}`}>
                      {work.category}
                    </span>
                    <span className="text-xs text-stone-400">{work.year}</span>
                  </div>
                  <p className="font-medium text-stone-800 mb-2">{work.title}</p>
                  <p className="text-sm text-stone-500 mb-3">{work.description}</p>
                  {work.tags && work.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {work.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),

    work: currentWork && workProject?.type === 'book' ? (() => {
      const r = workProject.reading;
      const i = r.findIndex((w) => w.slug === currentWork.slug);
      const prev = i > 0 ? r[i - 1] : null;
      const next = i >= 0 && i < r.length - 1 ? r[i + 1] : null;
      const tocItem = workProject.toc.find((t) => t.post?.slug === currentWork.slug);
      const partIdx = tocItem ? workProject.toc.indexOf(tocItem) : -1;
      const part = partIdx > 0 && tocItem.sub ? [...workProject.toc.slice(0, partIdx)].reverse().find((t) => !t.sub)?.text : null;
      return (
        <div className="min-h-screen py-16 px-6 bg-[#faf8f3]">
          <article className="max-w-lg mx-auto" style={{ fontFamily: "'Noto Serif KR', serif" }}>
            <button
              onClick={() => openProject(workProject.slug)}
              className="text-xs text-stone-500 hover:text-stone-700 mb-14 transition-colors"
              style={{ fontFamily: 'Pretendard, Inter, sans-serif' }}
            >
              ← 『{workProject.title}』 목차
            </button>
            <p className="text-xs tracking-widest text-stone-500 text-center">{part || workProject.title}</p>
            <h1 className="text-2xl text-stone-800 text-center mt-4 mb-2 break-keep leading-snug">{currentWork.title}</h1>
            {currentWork.question && <p className="text-sm text-stone-500 text-center break-keep">{currentWork.question}</p>}
            <div className="w-10 h-px bg-stone-300 mx-auto my-12" />
            <div className="space-y-7 text-[17px] text-stone-800 leading-[2] break-keep">
              {currentWork.body.split(/\n\s*\n/).map((para, k) =>
                para.startsWith('> ') ? (
                  <blockquote key={k} className="border-l-2 border-stone-300 pl-4 text-stone-600">{para.replace(/^> ?/gm, '')}</blockquote>
                ) : (
                  <p key={k}>{para.split('\n').map((line, j, arr) => (<React.Fragment key={j}>{line}{j < arr.length - 1 && <br />}</React.Fragment>))}</p>
                )
              )}
            </div>
            <div className="w-10 h-px bg-stone-300 mx-auto my-14" />
            <nav className="flex justify-between gap-4 text-sm" style={{ fontFamily: 'Pretendard, Inter, sans-serif' }}>
              {prev ? (
                <button onClick={() => openWork(prev.slug)} className="text-left text-stone-600 hover:text-stone-900">
                  <span className="block text-xs text-stone-400">← 이전</span>{prev.title}
                </button>
              ) : <span />}
              {next ? (
                <button onClick={() => openWork(next.slug)} className="text-right text-stone-600 hover:text-stone-900">
                  <span className="block text-xs text-stone-400">다음 →</span>{next.title}
                </button>
              ) : (
                <span className="text-right text-xs text-stone-400 self-end">다음 글은 연재 중</span>
              )}
            </nav>
          </article>
        </div>
      );
    })() : currentWork && workProject?.type === 'dictionary' ? (
      <div className="min-h-screen py-16 px-6">
        <article className="max-w-lg mx-auto">
          <button onClick={() => openProject(workProject.slug)} className="text-xs text-stone-500 hover:text-stone-700 mb-14 transition-colors">
            ← {workProject.title}
          </button>
          <div className="border-t-2 border-stone-800 pt-6">
            <h1 className="text-3xl text-stone-800 break-keep" style={{ fontFamily: "'Noto Serif KR', serif" }}>{currentWork.title}</h1>
            {currentWork.th && <p className="text-base text-stone-500 mt-2" lang="th">{currentWork.th}</p>}
            <p className="text-xs text-stone-500 mt-2">{currentWork.date}</p>
          </div>
          <div className="mt-10 space-y-10">
            {currentWork.body.split(/^## /m).filter((b) => b.trim()).map((sec, k) => {
              const [head, ...rest] = sec.split('\n');
              const text = rest.join('\n').trim();
              const th = head.trim() === 'ภาษาไทย';
              return (
                <section key={k} lang={th ? 'th' : undefined} className={th ? 'pt-8 border-t border-stone-200' : ''}>
                  <p className="text-xs tracking-widest text-stone-500 mb-3">{head.trim()}</p>
                  <div className="space-y-4 text-[17px] text-stone-800 leading-[1.9] break-keep" style={{ fontFamily: th ? undefined : "'Noto Serif KR', serif" }}>
                    {text.split(/\n\s*\n/).map((para, j) => (
                      <p key={j} className={para.startsWith('*') ? 'text-sm text-stone-500 italic' : ''}>
                        {para.replace(/^\*|\*$/g, '').split('\n').map((line, n, arr) => (<React.Fragment key={n}>{line}{n < arr.length - 1 && <br />}</React.Fragment>))}
                      </p>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </article>
      </div>
    ) : currentWork ? (
      <div className="min-h-screen py-20 px-6">
        <article className="max-w-xl mx-auto">
          <button
            onClick={() => (workProject ? openProject(workProject.slug) : closeWork())}
            className="text-xs text-stone-500 hover:text-stone-700 mb-16 transition-colors"
          >
            ← {workProject ? workProject.title : 'Works'}
          </button>
          {currentWork.question && (
            <p className="text-xs text-amber-800 mb-2">Q. {currentWork.question}</p>
          )}
          <h1 className="text-3xl font-light text-stone-800 mb-3">{currentWork.title}</h1>
          <p className="text-xs text-stone-500">{[currentWork.category, currentWork.date, currentWork.version].filter(Boolean).join(' · ')}</p>
          {currentWork.source && <p className="text-xs text-stone-500 mt-1">출처 · {currentWork.source}</p>}
          {currentWork.stage && <StageSteps stage={currentWork.stage} />}

          {currentWork.format === 'note' ? (
            <div className="mt-12 whitespace-pre-wrap text-sm text-stone-700 leading-relaxed break-keep">{currentWork.body}</div>
          ) : (
          <div className="mt-14 space-y-6 text-base text-stone-700 leading-loose break-keep">
            {currentWork.body.split(/\n\s*\n/).map((para, i) => (
              <p key={i}>
                {para.split('\n').map((line, j, arr) => (
                  <React.Fragment key={j}>
                    {line}
                    {j < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            ))}
          </div>
          )}

          {currentWork.history && (
            <p className="mt-16 pt-6 border-t border-stone-200 text-xs text-stone-500">
              이력 · {currentWork.history}
            </p>
          )}
        </article>
      </div>
    ) : (
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-xl mx-auto">
          <button onClick={closeWork} className="text-xs text-stone-500 mb-16">← Works</button>
          <p className="text-sm text-stone-500">글을 찾을 수 없습니다.</p>
        </div>
      </div>
    ),

    project: currentProject && currentProject.type === 'book' ? (
      <div className="min-h-screen py-16 px-6 bg-[#faf8f3]">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => {
              if (projectBack === 'journey') {
                window.history.pushState({}, '', '/');
                setProjectSlug(null);
                setActiveSection('journey');
                window.scrollTo(0, 0);
              } else closeWork();
            }}
            className="text-xs text-stone-500 hover:text-stone-700 mb-14 transition-colors"
          >
            ← {projectBack === 'journey' ? 'Journey' : 'Works'}
          </button>
          <div className="text-center" style={{ fontFamily: "'Noto Serif KR', serif" }}>
            <h1 className="text-3xl text-stone-800">{currentProject.title}</h1>
            {currentProject.subtitle && <p className="text-sm text-stone-500 mt-3">{currentProject.subtitle}</p>}
            <p className="text-xs text-stone-400 mt-6">정기우</p>
          </div>
          {currentProject.question && <p className="text-xs text-amber-800 text-center mt-10">Q. {currentProject.question}</p>}
          <div className="flex justify-center">{currentProject.stage && <StageSteps stage={currentProject.stage} />}</div>
          <p className="mt-10 text-sm text-stone-600 leading-relaxed break-keep text-center">{currentProject.intro}</p>

          <div className="mt-14 pt-10 border-t border-stone-300" style={{ fontFamily: "'Noto Serif KR', serif" }}>
            <p className="text-xs tracking-widest text-stone-500 mb-8 text-center" style={{ fontFamily: 'Pretendard, Inter, sans-serif' }}>목차</p>
            <ol className="space-y-3">
              {currentProject.toc.map((t, k) => (
                <li key={k} className={t.sub ? 'pl-5' : k ? 'pt-5' : ''}>
                  {t.post ? (
                    <button onClick={() => openWork(t.post.slug)} className="text-left text-stone-800 hover:underline underline-offset-4 break-keep">
                      {t.text}
                    </button>
                  ) : (
                    <span className={`break-keep ${t.sub ? 'text-stone-400' : 'text-stone-600'}`}>{t.text}</span>
                  )}
                </li>
              ))}
            </ol>
            <p className="text-xs text-stone-400 mt-10 text-center" style={{ fontFamily: 'Pretendard, Inter, sans-serif' }}>
              진하게 보이는 글은 읽을 수 있어요 · 목차는 쓰면서 자란다 (처음 잡은 목차 기준)
            </p>
          </div>
        </div>
      </div>
    ) : currentProject && currentProject.type === 'study' ? (() => {
      const seen = new Set();
      const chars = currentProject.posts.flatMap((w) => (w.kanji || '').split(/\s+/).filter(Boolean).map((c) => ({ c, w }))).filter(({ c }) => (seen.has(c) ? false : (seen.add(c), true)));
      return (
        <div className="min-h-screen py-16 px-6">
          <div className="max-w-xl mx-auto">
            <ProjectBack />
            <ProjectHead p={currentProject} />
            <div className="mt-12 flex items-baseline gap-3">
              <span className="text-5xl font-light text-stone-800">{chars.length}</span>
              <span className="text-sm text-stone-500">자 익힘 · 글 {currentProject.posts.length}편</span>
            </div>
            <div className="mt-6 grid grid-cols-5 sm:grid-cols-8 gap-2">
              {chars.map(({ c, w }, k) => (
                <button
                  key={k}
                  onClick={() => openWork(w.slug)}
                  title={w.title}
                  className="aspect-square flex items-center justify-center text-2xl text-stone-800 bg-white border border-stone-200 rounded hover:border-stone-500"
                >
                  {c}
                </button>
              ))}
            </div>
            <p className="text-xs text-stone-500 mt-3">글자를 누르면 그 글자가 나온 글로 가요</p>
            <div className="mt-12 space-y-6">
              {currentProject.posts.map((w) => (
                <button key={w.slug} onClick={() => openWork(w.slug)} className="block w-full text-left pb-5 border-b border-stone-200 group">
                  <p className="text-base text-stone-800 group-hover:underline underline-offset-4 break-keep">{w.title}</p>
                  <p className="text-xs text-stone-500 mt-1">{[w.category, w.date].filter(Boolean).join(' · ')}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    })() : currentProject && currentProject.type === 'log' ? (
      <div className="min-h-screen py-16 px-6">
        <div className="max-w-xl mx-auto">
          <ProjectBack />
          <ProjectHead p={currentProject} />
          <p className="text-xs tracking-widest text-stone-500 mt-14 mb-6">기록</p>
          <ol className="relative border-l border-stone-300 ml-2">
            {currentProject.posts.map((w) => (
              <li key={w.slug} className="ml-6 pb-10">
                <span className="absolute -left-[5px] mt-1.5 w-2.5 h-2.5 rounded-full bg-stone-800" />
                <p className="text-xs text-stone-500">{w.date}</p>
                <button onClick={() => openWork(w.slug)} className="text-left text-lg text-stone-800 hover:underline underline-offset-4 break-keep">
                  {w.title}
                </button>
                {w.question && <p className="text-xs text-amber-800 mt-1">Q. {w.question}</p>}
                {w.stage && <StageSteps stage={w.stage} />}
              </li>
            ))}
          </ol>
          <p className="text-xs text-stone-500">현장과 개발에서 나온 기록이 날짜순으로 쌓여요</p>
        </div>
      </div>
    ) : currentProject && currentProject.type === 'dictionary' ? (
      <div className="min-h-screen py-16 px-6">
        <div className="max-w-xl mx-auto">
          <ProjectBack />
          <ProjectHead p={currentProject} />
          <div className="mt-12 border-t-2 border-stone-800 pt-6">
            <p className="text-xs tracking-widest text-stone-500 mb-6">단어</p>
            {currentProject.posts.length ? (
              <dl className="space-y-6">
                {[...currentProject.posts].sort((a, b) => a.title.localeCompare(b.title, 'ko')).map((w) => (
                  <button key={w.slug} onClick={() => openWork(w.slug)} className="block w-full text-left group">
                    <dt className="text-xl text-stone-800 group-hover:underline underline-offset-4">{w.title}</dt>
                    {w.th && <dd className="text-sm text-stone-500">{w.th}</dd>}
                  </button>
                ))}
              </dl>
            ) : (
              <div className="text-stone-500">
                <p className="text-xl text-stone-400">（첫 단어 공개 준비 중）</p>
                <p className="text-xs mt-4">한 단어마다 · 단어 — 그 단어에 담긴 기억 — 아내에게</p>
              </div>
            )}
          </div>
        </div>
      </div>
    ) : currentProject ? (
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-xl mx-auto">
          <button
            onClick={() => {
              if (projectBack === 'journey') {
                window.history.pushState({}, '', '/');
                setProjectSlug(null);
                setActiveSection('journey');
                window.scrollTo(0, 0);
              } else closeWork();
            }}
            className="text-xs text-stone-500 hover:text-stone-700 mb-16 transition-colors"
          >
            ← {projectBack === 'journey' ? 'Journey' : 'Works'}
          </button>
          {currentProject.question && <p className="text-xs text-amber-800 mb-2">Q. {currentProject.question}</p>}
          <h1 className="text-3xl font-light text-stone-800 mb-3">{currentProject.title}</h1>
          <p className="text-xs text-stone-500">프로젝트 · {currentProject.posts.length ? `글 ${currentProject.posts.length}편` : '공개 준비 중'}</p>
          {currentProject.stage && <StageSteps stage={currentProject.stage} />}
          <div className="mt-10 text-sm text-stone-700 leading-relaxed break-keep whitespace-pre-wrap">{currentProject.body}</div>

          <div className="mt-14 space-y-8">
            {currentProject.posts.map((w) => (
              <button
                key={w.slug}
                onClick={() => openWork(w.slug)}
                className="block w-full text-left pb-6 border-b border-stone-200 group"
              >
                <p className="text-base font-medium text-stone-800 group-hover:underline underline-offset-4 break-keep">{w.title}</p>
                <p className="text-xs text-stone-500 mt-1">{[w.category, w.date].filter(Boolean).join(' · ')}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-xl mx-auto">
          <button onClick={closeWork} className="text-xs text-stone-500 mb-16">← Works</button>
          <p className="text-sm text-stone-500">프로젝트를 찾을 수 없습니다.</p>
        </div>
      </div>
    ),

    contact: (
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-xl mx-auto">
          <button 
            onClick={() => setActiveSection('home')}
            className="text-xs text-stone-400 hover:text-stone-600 mb-16 transition-colors"
          >
            ← Back
          </button>
          
          <h2 className="text-2xl font-light text-stone-800 mb-4">Contact</h2>
          <p className="text-sm text-stone-500 mb-16">함께 질문하고 싶다면</p>
          
          <div className="space-y-8">
            <p className="text-sm text-stone-600 leading-relaxed">
              질문은 찾는 자의 표시입니다.<br />
              함께 질문하고, 함께 발견하고 싶습니다.
            </p>

            <div className="flex flex-wrap gap-4">
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=giujeong@gmail.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 text-xs tracking-wider text-stone-500 border border-stone-200 hover:border-stone-400 hover:text-stone-700 transition-all duration-200"
              >
                EMAIL
              </a>
              <a 
                href="https://www.youtube.com/@giujeong" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube 채널"
                className="inline-flex items-center gap-2 px-5 py-2 text-xs tracking-wider text-stone-500 border border-stone-200 hover:border-stone-400 hover:text-stone-700 transition-all duration-200"
              >
                <Youtube size={14} strokeWidth={1.5} />
                YOUTUBE
              </a>
              <a
                href="https://x.com/giujeong_me"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X 계정"
                className="px-5 py-2 text-xs tracking-wider text-stone-500 border border-stone-200 hover:border-stone-400 hover:text-stone-700 transition-all duration-200"
              >
                X
              </a>
              <a
                href="https://www.instagram.com/giujeong"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram 계정"
                className="px-5 py-2 text-xs tracking-wider text-stone-500 border border-stone-200 hover:border-stone-400 hover:text-stone-700 transition-all duration-200"
              >
                INSTAGRAM
              </a>
            </div>
          </div>

          <div className="mt-24 pt-8 border-t border-stone-200 text-center">
            <p className="text-xs text-stone-400 mb-2">
              "다리는 이미 놓여 있다. 건널 것인가?"
            </p>
            <p className="text-lg text-stone-600 mb-1">עִמָּנוּ אֵל</p>
            <p className="text-xs text-stone-400">
              임마누엘 — 하나님이 우리와 함께
            </p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      {sections[activeSection]}
      
      <footer className="py-8 text-center text-xs text-stone-400">
        <p>정기우 · {ageInYears}세 · {ageInDays.toLocaleString()}일</p>
        <p className="mt-1">믿는 자 · 질문하는 자 · 문제 푸는 사람</p>
        <a
          href="https://www.youtube.com/@giujeong"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube 채널"
          className="inline-flex mt-3 text-stone-400 hover:text-stone-700 transition-colors"
        >
          <Youtube size={18} strokeWidth={1.5} />
        </a>
        <p className="mt-1 text-stone-300">updated {__BUILD_DATE__}</p>
      </footer>
    </div>
  );
}
