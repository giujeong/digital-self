import React, { useState, useEffect } from 'react';

export default function DigitalSelf() {
  const [activeSection, setActiveSection] = useState('home');
  const [showQuote, setShowQuote] = useState(0);

  const quotes = [
    { text: "넘어지되 다시 일어나는 자", source: "Identity" },
    { text: "질문하는 자, 문제 푸는 사람", source: "Identity" },
    { text: "참 인간은 주님의 임재 안에서 가능하다", source: "Conviction" },
    { text: "막연함에서 명료함으로", source: "Journey" },
  ];

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
              "{quotes[showQuote].text}"
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
                <p>2025년, 두 분의 외할머니를 하늘로 보내드렸다.</p>
                <p>이 두 분을 끝으로, 양가의 할머니 할아버지 세대가 모두 이 땅을 떠나셨다. <span className="font-medium text-stone-800">세대의 끝.</span></p>
                <p>아내와 나 사이에 아이는 없다. 우리가 <span className="font-medium text-stone-800">마지막 세대</span>일 수 있다.</p>
                <p>어린 시절, 유한함을 생각조차 할 수 없어 막연히 두려워했던 그때를 지나—</p>
                <p>지금 다시 <span className="font-medium text-stone-800">유한의 끝</span>을 자각한다.</p>
                <p className="pt-4 border-t border-stone-200 text-stone-800">
                  그러나 유한 안에서 <span className="font-medium">영원</span>을 향해 산다.<br />
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
              <span className="text-stone-400 w-24 shrink-0">1988</span>
              <div>
                <p className="font-medium text-stone-800">태어남</p>
                <p className="text-stone-500">3월 4일, 여정의 시작</p>
              </div>
            </div>

            <div className="flex gap-6">
              <span className="text-stone-400 w-24 shrink-0">어린 시절</span>
              <div>
                <p className="font-medium text-stone-800">막연한 두려움</p>
                <p className="text-stone-500">유한함을 생각조차 할 수 없던 시절</p>
              </div>
            </div>

            <div className="flex gap-6">
              <span className="text-stone-400 w-24 shrink-0">믿음의 여정</span>
              <div>
                <p className="font-medium text-stone-800">믿는 자가 되다</p>
                <p className="text-stone-500">질문하고, 넘어지고, 다시 일어나는 법을 배우다</p>
              </div>
            </div>

            <div className="flex gap-6">
              <span className="text-stone-400 w-24 shrink-0">2025</span>
              <div>
                <p className="font-medium text-stone-800">세대의 끝, 유한의 자각</p>
                <p className="text-stone-500">두 분의 외할머니를 보내드리며—양가 조부모 세대가 모두 이 땅을 떠나시다. 마지막 세대일 수 있는 우리, 유한의 끝을 다시 마주하다.</p>
              </div>
            </div>

            <div className="flex gap-6 py-3 -mx-4 px-4 bg-stone-100">
              <span className="text-stone-500 w-24 shrink-0">지금</span>
              <div>
                <p className="font-medium text-stone-800">나를 정의하다</p>
                <p className="text-stone-500">40을 앞두고, 막연함에서 명료함으로, 디지털 셀프를 세우다</p>
              </div>
            </div>

            <div className="flex gap-6 opacity-50">
              <span className="text-stone-400 w-24 shrink-0">앞으로</span>
              <div>
                <p className="font-medium text-stone-800">계속되는 여정</p>
                <p className="text-stone-500">질문은 계속된다. 그리고 응답하시는 분이 계신다.</p>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-stone-200">
            <p className="text-xs tracking-widest text-stone-400 mb-4">현재 프로젝트</p>
            <p className="font-medium text-stone-800 mb-2">「질문으로 만나는 하나님」</p>
            <p className="text-sm text-stone-500">
              성경 원어(헬라어, 히브리어) 학습을 통해 하나님의 말씀을 더 깊이 알아가며,
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
          
          <div className="space-y-12">
            <div className="pb-8 border-b border-stone-200">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-stone-400">글쓰기</span>
                <span className="text-xs text-stone-400">2025</span>
              </div>
              <p className="font-medium text-stone-800 mb-2">질문으로 만나는 하나님</p>
              <p className="text-sm text-stone-500 mb-3">
                막연함에서 명료함으로. 성경의 핵심을 질문과 답의 형식으로 풀어낸 책.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-stone-400">신학</span>
                <span className="text-xs text-stone-400">·</span>
                <span className="text-xs text-stone-400">헬라어</span>
                <span className="text-xs text-stone-400">·</span>
                <span className="text-xs text-stone-400">히브리어</span>
              </div>
            </div>

            <div className="pb-8 border-b border-stone-200">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-stone-400">배움</span>
                <span className="text-xs text-stone-400">진행 중</span>
              </div>
              <p className="font-medium text-stone-800 mb-2">성경 원어 학습</p>
              <p className="text-sm text-stone-500 mb-3">
                신약 헬라어(코이네)와 구약 히브리어로 하나님의 말씀을 직접 읽는 여정.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-stone-400">요한복음</span>
                <span className="text-xs text-stone-400">·</span>
                <span className="text-xs text-stone-400">욥기</span>
              </div>
            </div>

            <div className="opacity-50">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-stone-400">예정</span>
                <span className="text-xs text-stone-400">—</span>
              </div>
              <p className="font-medium text-stone-800 mb-2">AI 시대, 참 인간이란</p>
              <p className="text-sm text-stone-500">
                AI와 공존하는 시대에 성경이 말하는 '참 인간'을 탐구하는 프로젝트
              </p>
            </div>
          </div>
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
            <div className="text-sm text-stone-600 leading-relaxed">
              <p>질문은 찾는 자의 표시입니다.</p>
              <p>함께 질문하고, 함께 발견하고 싶습니다.</p>
            </div>

<div className="flex gap-3">
  <a href="mailto:giujeong@gmail.com" className="px-5 py-2 text-xs tracking-wider text-stone-500 border border-stone-200 hover:border-stone-400 hover:text-stone-700 transition-all duration-200">
    EMAIL
  </a>
</div>
          </div>

          <div className="mt-24 pt-8 border-t border-stone-200 text-center">
            <p className="text-xs text-stone-400 mb-3">
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
