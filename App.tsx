import React, { useState, useMemo, useEffect } from 'react';
import type { Link, Category } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import LinkCard from './components/LinkCard';
import { Icon } from './components/Icons';

// Default Categories
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: '보험체크' },
  { id: 'cat-2', name: '생활정보' },
  { id: 'cat-3', name: '재밌는 사이트' },
  { id: 'cat-4', name: '웹소설 추천' },
];

// Default Links
const DEFAULT_LINKS: Link[] = [
  // 보험체크
  { id: 'link-11', title: '🌟 1:1 문의하기 🌟', url: 'http://pf.kakao.com/_AvZcn', categoryId: 'cat-1', isSpecial: true },
  { id: 'link-1', title: '내 보험 다보여', url: 'https://www.credit4u.or.kr/', categoryId: 'cat-1' },
  { id: 'link-2', title: '보험다모아', url: 'https://www.e-insmarket.or.kr/', categoryId: 'cat-1' },
  
  // 생활정보
  { id: 'link-3', title: '유용한 제품', url: 'https://beacons.ai/lildesksurfer', categoryId: 'cat-2' },
  { id: 'link-4', title: '무료재테크자료', url: 'https://beacons.ai/lildesksurfer', categoryId: 'cat-2' },

  // 재밌는 사이트
  { id: 'link-6', title: '유용한AI정보', url: 'https://www.youtube.com/@lil_desksurfer/shorts', categoryId: 'cat-3' },
  { id: 'link-7', title: '걸려걸려걸림판', url: 'https://pick-random-hhpw.vercel.app/', categoryId: 'cat-3' },
  { id: 'link-8', title: '랜덤메뉴추천기', url: 'https://lunch-random.vercel.app/', categoryId: 'cat-3' },

  // 웹소설 추천
  { id: 'link-9', title: '문피아', url: 'https://library.munpia.com/ppcf67f200e69bb9c', categoryId: 'cat-4' },
];


const App: React.FC = () => {
  const [links, setLinks] = useLocalStorage<Link[]>('links', DEFAULT_LINKS);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', DEFAULT_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Data migration script from old structure
    const needsMigration = links.length > 0 && links.some(l => 'category' in l && !('categoryId' in l));
    if (needsMigration) {
      console.log("Migrating old data structure...");
      const newCategories: Category[] = [];
      const categoryMap = new Map<string, string>();
      
      const existingCategories = new Set(categories.map(c => c.name));

      const migratedLinks = links.map((link: any) => {
        if (link.category && !categoryMap.has(link.category) && !existingCategories.has(link.category)) {
          const newId = crypto.randomUUID();
          categoryMap.set(link.category, newId);
          newCategories.push({ id: newId, name: link.category });
        }
        
        const categoryId = link.category ? (categoryMap.get(link.category) ?? categories.find(c => c.name === link.category)?.id) : null;

        return {
          id: link.id,
          title: link.title,
          url: link.url,
          categoryId: categoryId ?? null,
        };
      });

      if (newCategories.length > 0) {
        setCategories(prev => [...prev, ...newCategories]);
      }
      setLinks(migratedLinks);
    }
  }, []);

  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) {
      return links;
    }
    const lowercasedQuery = searchQuery.trim().toLowerCase();
    return links.filter(link =>
      link.title.toLowerCase().includes(lowercasedQuery) ||
      link.url.toLowerCase().includes(lowercasedQuery)
    );
  }, [links, searchQuery]);

  const groupedLinks = useMemo(() => {
    const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));
    const categoryOrder = [null, ...sortedCategories.map(c => c.id)];
    
    return categoryOrder.map(catId => {
      const category = categories.find(c => c.id === catId);
      const categoryLinks = filteredLinks.filter(l => l.categoryId === catId);
      
      categoryLinks.sort((a, b) => {
        if (a.isSpecial && !b.isSpecial) return -1;
        if (!a.isSpecial && b.isSpecial) return 1;
        return 0;
      });

      return {
        id: catId,
        name: category?.name ?? '카테고리 없음',
        links: categoryLinks,
      };
    }).filter(group => {
      if (searchQuery.trim()) {
        return group.links.length > 0;
      }
      if (group.id !== null) { // It's a named category
        return true;
      } else { // The 'uncategorized' group
        return group.links.length > 0;
      }
    });
  }, [filteredLinks, categories, searchQuery]);
  
  const renderContent = () => {
    if (links.length === 0) {
      return (
        <div className="text-center py-20 px-6 bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-700">
          <Icon name="tag" className="mx-auto w-16 h-16 text-slate-600 mb-4" />
          <h2 className="text-2xl font-semibold text-slate-300">아직 등록된 정보가 없어요.</h2>
          <p className="text-slate-400 mt-2">표시할 콘텐츠가 없습니다.</p>
        </div>
      );
    }

    if (searchQuery.trim() && filteredLinks.length === 0) {
      return (
        <div className="text-center py-20 px-6 bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-700">
          <Icon name="search" className="mx-auto w-16 h-16 text-slate-600 mb-4" />
          <h2 className="text-2xl font-semibold text-slate-300">검색 결과가 없습니다.</h2>
          <p className="text-slate-400 mt-2">"{searchQuery}"에 대한 검색 결과가 없습니다. 다른 검색어로 다시 시도해보세요.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {groupedLinks.map(group => group.links.length > 0 && (
          <section key={group.id ?? 'uncategorized'} className="bg-slate-800/70 rounded-lg p-3 sm:p-4 border border-slate-700 flex flex-col">
            <h2 className="text-xl font-bold text-sky-400 mb-4 text-center">{group.name}</h2>
            <div className="flex flex-col gap-2">
              {group.links.map(link => (
                <div key={link.id}>
                  <LinkCard link={link} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-slate-900">
        <header className="sticky top-0 z-40 py-6 bg-slate-900/70 backdrop-blur-lg border-b border-slate-800 mb-8">
            <div className="container mx-auto px-4 flex flex-col items-center gap-4">
                <div className="text-center">
                  <h1 className="text-3xl font-extrabold text-white tracking-tight">
                    짜자자쟌! 부업대소동
                  </h1>
                  <p className="mt-1 text-sm text-slate-400">프로젝트 라인업</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Icon name="search" className="w-5 h-5 text-slate-500" />
                      </span>
                      <input
                          type="search"
                          placeholder="제목으로 검색..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-48 sm:w-64 bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      />
                  </div>
                </div>
            </div>
        </header>

      <main className="container mx-auto px-4 pb-12">
        {renderContent()}
      </main>

      <footer className="text-center pb-8 pt-4 text-xs text-slate-500">
        <p>제작: JH Tech | N잡 투자 재테크 보험 건강</p>
      </footer>
    </div>
  );
};

export default App;