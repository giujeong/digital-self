import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export default function DigitalSelf() {
  const [activeSection, setActiveSection] = useState('home');
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
            <p className="text-xs tracking-widest text-stone-400 mb-4">CURRENT PROJECT</p>
            <p className="font-medium text-stone-800 mb-2">「질문으로 만나는 하나님」</p>
            <p className="text-sm text-stone-500">
              성경 원어 학습을 통해 하나님의 말씀을 더 깊이 알아가며,
              그 여정에서 발견한 것들을 나누는 책 프로젝트
            </p>
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
          
          {loadingWorks ? (
            <p className="text-sm text-stone-400">불러오는 중...</p>
          ) : works.length === 0 ? (
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

            <div className="flex gap-4">
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=giujeong@gmail.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 text-xs tracking-wider text-stone-500 border border-stone-200 hover:border-stone-400 hover:text-stone-700 transition-all duration-200"
              >
                EMAIL
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
      </footer>
    </div>
  );
}
