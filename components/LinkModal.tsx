import React, { useState, useEffect } from 'react';
import type { Link, Category } from '../types';
import { Icon } from './Icons';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: Omit<Link, 'id'>, id?: string) => void;
  linkToEdit?: Link | null;
  categories: Category[];
}

const LinkModal: React.FC<LinkModalProps> = ({ isOpen, onClose, onSave, linkToEdit, categories }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (linkToEdit) {
        setTitle(linkToEdit.title);
        setUrl(linkToEdit.url);
        setCategoryId(linkToEdit.categoryId);
      } else {
        setTitle('');
        setUrl('');
        setCategoryId(null);
      }
    }
  }, [linkToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    
    let finalUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      finalUrl = 'https://' + url;
    }
    
    onSave({ title, url: finalUrl, categoryId }, linkToEdit?.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6 border border-slate-700" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{linkToEdit ? '링크 수정' : '새 링크 추가'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">제목</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium text-slate-300 mb-2">URL</label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
              placeholder="example.com"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">카테고리</label>
            <select
              id="category"
              value={categoryId === null ? 'none' : categoryId}
              onChange={(e) => setCategoryId(e.target.value === 'none' ? null : e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="none">카테고리 없음</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-slate-600 text-white hover:bg-slate-500 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-500 transition-colors font-semibold"
            >
              {linkToEdit ? '변경사항 저장' : '링크 추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkModal;
