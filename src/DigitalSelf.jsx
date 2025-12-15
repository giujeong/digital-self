import React, { useState, useEffect } from 'react';

export default function DigitalSelf() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);
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
        <div className="text-center max-w-2xl">
          <p className="text-stone-500 text-sm tracking-widest mb-4">DIGITAL SELF</p>
          <h1 className="text-5xl md:text-7xl font-light text-stone-800 mb-6">
            정기우
          </h1>
          <p className="text-lg text-stone-600 mb-2">
            1988. 3. 4 —
          </p>
          <p className="text-sm text-stone-400 mb-12">
            {ageInDays.toLocaleString()}일째 살아가는 중
          </p>
          
          <div className="h-20 flex items-center justify-center">
            <div className="transition-all duration-1000 ease-in-out">
              <p className="text-xl md:text-2xl text-stone-700 italic font-light">
                "{quotes[showQuote].text}"
              </p>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-4">
            {['identity', 'journey', 'works', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className="px-6 py-2 text-sm tracking-wider text-stone-600 border border-stone-300 rounded-full hover:bg-stone-800 hover:text-white hover:border-stone-800 transition-all duration-300"
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
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => setActiveSection('home')}
            className="text-stone-400 hover:text-stone-800 mb-12 flex items-center gap-2 transition-colors"
          >
            ← Back
          </button>
          
          <h2 className="text-4xl font-light text-stone-800 mb-12">Identity</h2>
          
          <div className="space-y-16">
<div>
  <h3 className="text-xs tracking-widest text-stone-400 mb-8">WHO I AM</h3>
  <div className="space-y-4 text-stone-700 leading-relaxed">
    <p><span className="font-semibold">믿는 자.</span> 넘어지되 다시 일어나는 자.</p>
    <p><span className="font-semibold">질문하는 자.</span> 문제 푸는 사람.</p>
    <p><span className="font-semibold">확신.</span> 참 인간은 주님의 임재 안에서 가능하다.</p>
  </div>
</div>

            <div className="border-t border-stone-200 pt-12">
              <h3 className="text-sm tracking-widest text-stone-400 mb-6">THE FINITE & THE ETERNAL</h3>
              <div className="bg-stone-50 p-8 rounded-lg">
                <p className="text-stone-600 leading-relaxed mb-4">
                  2025년, 두 분의 외할머니를 하늘로 보내드렸다.
                </p>
                <p className="text-stone-600 leading-relaxed mb-4">
                  이 두 분을 끝으로, 양가의 할머니 할아버지 세대가 모두 이 땅을 떠나셨다.<br />
                  <span className="text-stone-700 font-medium">세대의 끝.</span>
                </p>
                <p className="text-stone-600 leading-relaxed mb-4">
                  아내와 나 사이에 아직 아이는 없다.<br />
                  우리가 <span className="text-stone-700 font-medium">마지막 세대</span>일 수 있다.
                </p>
                <p className="text-stone-600 leading-relaxed mb-4">
                  어린 시절, 유한함을 생각조차 할 수 없어 막연히 두려워했던 그때를 지나—
                </p>
                <p className="text-stone-700 leading-relaxed">
                  지금 다시 <span className="font-medium">유한의 끝</span>을 자각한다.
                </p>
                <p className="text-stone-700 leading-relaxed mt-6 border-l-2 border-amber-400 pl-4">
                  그러나 유한 안에서 <span className="font-medium">영원</span>을 향해 산다.<br />
                  남은 세대로서, 더 분명하게.
                </p>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-12">
              <h3 className="text-sm tracking-widest text-stone-400 mb-6">CORE VALUES</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6">
                  <div className="text-3xl mb-3">🔄</div>
                  <h4 className="font-medium text-stone-800 mb-2">Resilience</h4>
                  <p className="text-sm text-stone-500">넘어져도 일어난다</p>
                </div>
                <div className="text-center p-6">
                  <div className="text-3xl mb-3">❓</div>
                  <h4 className="font-medium text-stone-800 mb-2">Inquiry</h4>
                  <p className="text-sm text-stone-500">질문이 답을 찾는다</p>
                </div>
                <div className="text-center p-6">
                  <div className="text-3xl mb-3">✝️</div>
                  <h4 className="font-medium text-stone-800 mb-2">Presence</h4>
                  <p className="text-sm text-stone-500">임재 안에서 참 인간</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    journey: (
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => setActiveSection('home')}
            className="text-stone-400 hover:text-stone-800 mb-12 flex items-center gap-2 transition-colors"
          >
            ← Back
          </button>
          
          <h2 className="text-4xl font-light text-stone-800 mb-12">Journey</h2>
          
          <div className="space-y-12">
            <div className="border-l-2 border-stone-200 pl-8 py-2">
              <p className="text-sm text-stone-400 mb-1">1988</p>
              <h3 className="text-xl text-stone-800 mb-2">Born</h3>
              <p className="text-stone-600">3월 4일, 여정의 시작</p>
            </div>

            <div className="border-l-2 border-stone-200 pl-8 py-2">
              <p className="text-sm text-stone-400 mb-1">Childhood</p>
              <h3 className="text-xl text-stone-800 mb-2">막연한 두려움</h3>
              <p className="text-stone-600">유한함을 생각조차 할 수 없던 시절</p>
            </div>

            <div className="border-l-2 border-stone-200 pl-8 py-2">
              <p className="text-sm text-stone-400 mb-1">Faith Journey</p>
              <h3 className="text-xl text-stone-800 mb-2">믿는 자가 되다</h3>
              <p className="text-stone-600">질문하고, 넘어지고, 다시 일어나는 법을 배우다</p>
            </div>

            <div className="border-l-2 border-stone-200 pl-8 py-2">
              <p className="text-sm text-stone-400 mb-1">2025</p>
              <h3 className="text-xl text-stone-800 mb-2">세대의 끝, 유한의 자각</h3>
              <p className="text-stone-600">두 분의 외할머니를 보내드리며—양가 조부모 세대가 모두 이 땅을 떠나시다.<br />마지막 세대일 수 있는 우리, 유한의 끝을 다시 마주하다.</p>
            </div>

            <div className="border-l-2 border-amber-400 pl-8 py-2 bg-amber-50 -ml-8 rounded-r-lg">
              <p className="text-sm text-amber-600 mb-1">Now — 40을 앞두고</p>
              <h3 className="text-xl text-stone-800 mb-2">나를 정의하다</h3>
              <p className="text-stone-600">막연함에서 명료함으로, 디지털 셀프를 세우다</p>
            </div>

            <div className="border-l-2 border-stone-300 border-dashed pl-8 py-2 opacity-60">
              <p className="text-sm text-stone-400 mb-1">Future</p>
              <h3 className="text-xl text-stone-800 mb-2">계속되는 여정</h3>
              <p className="text-stone-600">질문은 계속된다. 그리고 응답하시는 분이 계신다.</p>
            </div>
          </div>

          <div className="mt-16 p-8 bg-stone-800 text-white rounded-lg">
            <p className="text-stone-400 text-sm mb-2">현재 프로젝트</p>
            <h3 className="text-2xl font-light mb-4">「질문으로 만나는 하나님」</h3>
            <p className="text-stone-300 leading-relaxed">
              성경 원어(헬라어, 히브리어) 학습을 통해 하나님의 말씀을 더 깊이 알아가며,<br />
              그 여정에서 발견한 것들을 나누는 책 프로젝트
            </p>
          </div>
        </div>
      </div>
    ),

    works: (
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => setActiveSection('home')}
            className="text-stone-400 hover:text-stone-800 mb-12 flex items-center gap-2 transition-colors"
          >
            ← Back
          </button>
          
          <h2 className="text-4xl font-light text-stone-800 mb-4">Works</h2>
          <p className="text-stone-500 mb-12">질문하고, 문제 풀고, 나누는 것들</p>
          
          <div className="space-y-8">
            <div className="border border-stone-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Writing</span>
                <span className="text-stone-400 text-sm">2025</span>
              </div>
              <h3 className="text-2xl text-stone-800 mb-3">질문으로 만나는 하나님</h3>
              <p className="text-stone-600 mb-4">
                막연함에서 명료함으로. 성경의 핵심을 질문과 답의 형식으로 풀어낸 책.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">신학</span>
                <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">헬라어</span>
                <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">히브리어</span>
              </div>
            </div>

            <div className="border border-stone-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Learning</span>
                <span className="text-stone-400 text-sm">Ongoing</span>
              </div>
              <h3 className="text-2xl text-stone-800 mb-3">성경 원어 학습</h3>
              <p className="text-stone-600 mb-4">
                신약 헬라어(코이네)와 구약 히브리어로 하나님의 말씀을 직접 읽는 여정.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">요한복음</span>
                <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">욥기</span>
              </div>
            </div>

            <div className="border border-dashed border-stone-300 rounded-lg p-8 opacity-70">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-full">Coming</span>
              </div>
              <h3 className="text-2xl text-stone-800 mb-3">AI 시대, 참 인간이란</h3>
              <p className="text-stone-600">
                AI와 공존하는 시대에 성경이 말하는 '참 인간'을 탐구하는 프로젝트
              </p>
            </div>
          </div>
        </div>
      </div>
    ),

    contact: (
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => setActiveSection('home')}
            className="text-stone-400 hover:text-stone-800 mb-12 flex items-center gap-2 transition-colors"
          >
            ← Back
          </button>
          
          <h2 className="text-4xl font-light text-stone-800 mb-4">Contact</h2>
          <p className="text-stone-500 mb-12">함께 질문하고 싶다면</p>
          
          <div className="space-y-8">
            <div className="bg-stone-50 p-8 rounded-lg">
              <p className="text-stone-700 leading-relaxed mb-6">
                질문은 찾는 자의 표시입니다.<br />
                함께 질문하고, 함께 발견하고 싶습니다.
              </p>
              <p className="text-stone-600 text-sm">
                연락처와 SNS 링크는 여기에 추가하세요.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-stone-200 rounded-lg p-6 text-center hover:bg-stone-50 transition-colors cursor-pointer">
                <div className="text-2xl mb-2">📧</div>
                <p className="text-stone-600">Email</p>
              </div>
              <div className="border border-stone-200 rounded-lg p-6 text-center hover:bg-stone-50 transition-colors cursor-pointer">
                <div className="text-2xl mb-2">📝</div>
                <p className="text-stone-600">Blog</p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-stone-400 text-sm mb-4">
              "다리는 이미 놓여 있다. 건널 것인가?"
            </p>
            <p className="text-2xl">
              עִמָּנוּ אֵל
            </p>
            <p className="text-stone-500 text-sm mt-1">
              임마누엘 — 하나님이 우리와 함께
            </p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 font-sans">
      {sections[activeSection]}
      
      <footer className="py-8 text-center text-stone-400 text-sm">
        <p>정기우 · {ageInYears}세 · {ageInDays.toLocaleString()}일</p>
        <p className="mt-1">믿는 자 · 질문하는 자 · 문제 푸는 사람</p>
      </footer>
    </div>
  );
}
