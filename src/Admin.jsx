import React, { useState, useEffect } from 'react';
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const ADMIN_EMAIL = 'giujeong@gmail.com';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [works, setWorks] = useState([]);
  const [editingWork, setEditingWork] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    tags: '',
    year: '',
    status: 'published'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser && currentUser.email === ADMIN_EMAIL) {
        fetchWorks();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchWorks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'works'));
      const worksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWorks(worksData);
    } catch (error) {
      console.error('Error fetching works:', error);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setWorks([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const workData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingWork) {
        await updateDoc(doc(db, 'works', editingWork.id), workData);
      } else {
        workData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'works'), workData);
      }
      
      setFormData({
        category: '',
        title: '',
        description: '',
        tags: '',
        year: '',
        status: 'published'
      });
      setEditingWork(null);
      fetchWorks();
    } catch (error) {
      console.error('Error saving work:', error);
    }
  };

  const handleEdit = (work) => {
    setEditingWork(work);
    setFormData({
      category: work.category || '',
      title: work.title || '',
      description: work.description || '',
      tags: work.tags?.join(', ') || '',
      year: work.year || '',
      status: work.status || 'published'
    });
  };

  const handleDelete = async (workId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'works', workId));
        fetchWorks();
      } catch (error) {
        console.error('Error deleting work:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingWork(null);
    setFormData({
      category: '',
      title: '',
      description: '',
      tags: '',
      year: '',
      status: 'published'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-500">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-light text-stone-800 mb-8">관리자 로그인</h1>
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-stone-800 text-white text-sm hover:bg-stone-700 transition-colors"
        >
          Google로 로그인
        </button>
        <a href="/" className="mt-8 text-xs text-stone-400 hover:text-stone-600">
          ← 사이트로 돌아가기
        </a>
      </div>
    );
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-light text-stone-800 mb-4">접근 권한 없음</h1>
        <p className="text-stone-500 mb-8">관리자만 접근할 수 있습니다.</p>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-stone-800 text-white text-sm hover:bg-stone-700 transition-colors"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-medium text-stone-800">Digital Self 관리</h1>
          <div className="flex items-center gap-4">
            <span className="text-xs text-stone-500">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-stone-400 hover:text-stone-600"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Works 추가/수정 폼 */}
        <section className="mb-16">
          <h2 className="text-sm tracking-widest text-stone-400 mb-6">
            {editingWork ? 'WORK 수정' : '새 WORK 추가'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 border border-stone-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-stone-500 mb-1">카테고리</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="예: 글쓰기, 배움"
                  className="w-full px-3 py-2 text-sm border border-stone-200 focus:outline-none focus:border-stone-400"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1">연도/상태</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  placeholder="예: 2025, 진행 중"
                  className="w-full px-3 py-2 text-sm border border-stone-200 focus:outline-none focus:border-stone-400"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-stone-500 mb-1">제목</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="프로젝트 제목"
                className="w-full px-3 py-2 text-sm border border-stone-200 focus:outline-none focus:border-stone-400"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs text-stone-500 mb-1">설명</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="프로젝트 설명"
                rows={3}
                className="w-full px-3 py-2 text-sm border border-stone-200 focus:outline-none focus:border-stone-400 resize-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs text-stone-500 mb-1">태그 (쉼표로 구분)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="예: 신학, 헬라어, 히브리어"
                className="w-full px-3 py-2 text-sm border border-stone-200 focus:outline-none focus:border-stone-400"
              />
            </div>

            <div>
              <label className="block text-xs text-stone-500 mb-1">상태</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-stone-200 focus:outline-none focus:border-stone-400"
              >
                <option value="published">공개</option>
                <option value="draft">비공개</option>
                <option value="upcoming">예정</option>
              </select>
            </div>
            
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-stone-800 text-white text-sm hover:bg-stone-700 transition-colors"
              >
                {editingWork ? '수정' : '추가'}
              </button>
              {editingWork && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-stone-200 text-stone-600 text-sm hover:bg-stone-100 transition-colors"
                >
                  취소
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Works 목록 */}
        <section>
          <h2 className="text-sm tracking-widest text-stone-400 mb-6">WORKS 목록</h2>
          
          {works.length === 0 ? (
            <p className="text-stone-500 text-sm">등록된 work가 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {works.map((work) => (
                <div key={work.id} className="bg-white p-6 border border-stone-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs text-stone-400">{work.category}</span>
                      <span className="text-xs text-stone-300 mx-2">·</span>
                      <span className="text-xs text-stone-400">{work.year}</span>
                      {work.status === 'draft' && (
                        <span className="ml-2 text-xs text-amber-600">(비공개)</span>
                      )}
                      {work.status === 'upcoming' && (
                        <span className="ml-2 text-xs text-stone-400">(예정)</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(work)}
                        className="text-xs text-stone-400 hover:text-stone-600"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(work.id)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <h3 className="font-medium text-stone-800 mb-1">{work.title}</h3>
                  <p className="text-sm text-stone-500 mb-2">{work.description}</p>
                  {work.tags && work.tags.length > 0 && (
                    <div className="flex gap-2">
                      {work.tags.map((tag, i) => (
                        <span key={i} className="text-xs text-stone-400">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mt-16 pt-8 border-t border-stone-200">
          <a href="/" className="text-xs text-stone-400 hover:text-stone-600">
            ← 사이트로 돌아가기
          </a>
        </div>
      </main>
    </div>
  );
}
