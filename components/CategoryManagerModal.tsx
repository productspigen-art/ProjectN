import React, { useState } from 'react';
import type { Category } from '../types';
import { Icon } from './Icons';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAdd: (name: string) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({ isOpen, onClose, categories, onAdd, onUpdate, onDelete }) => {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<{id: string, name: string} | null>(null);

    if (!isOpen) return null;

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            onAdd(newCategoryName.trim());
            setNewCategoryName('');
        }
    };
    
    const handleUpdateCategory = () => {
        if (editingCategory && editingCategory.name.trim()) {
            onUpdate(editingCategory.id, editingCategory.name.trim());
            setEditingCategory(null);
        }
    }

    const handleDeleteCategory = (id: string) => {
        if (window.confirm("정말로 이 카테고리를 삭제하시겠어요? 이 카테고리의 링크들은 '카테고리 없음'으로 이동됩니다.")) {
            onDelete(id);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6 border border-slate-700" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">카테고리 관리</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon name="close" className="w-6 h-6" /></button>
                </div>

                <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="flex-grow bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="새 카테고리 이름"
                    />
                    <button type="submit" className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-500 transition-colors font-semibold">추가</button>
                </form>

                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                    {categories.length > 0 ? categories.map(cat => (
                        <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-md">
                            {editingCategory?.id === cat.id ? (
                                <input
                                    type="text"
                                    value={editingCategory.name}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                    className="flex-grow bg-slate-700 border border-slate-500 rounded-md px-2 py-1 text-white"
                                    autoFocus
                                    onBlur={handleUpdateCategory}
                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateCategory()}
                                />
                            ) : (
                                <span className="text-slate-200">{cat.name}</span>
                            )}
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                {editingCategory?.id === cat.id ? (
                                     <button onClick={handleUpdateCategory} className="p-2 text-slate-400 hover:text-green-500"><Icon name="check" className="w-5 h-5" /></button>
                                ) : (
                                    <button onClick={() => setEditingCategory({ id: cat.id, name: cat.name })} className="p-2 text-slate-400 hover:text-white"><Icon name="edit" className="w-4 h-4" /></button>
                                )}
                                <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-slate-400 hover:text-red-500"><Icon name="trash" className="w-4 h-4" /></button>
                            </div>
                        </div>
                    )) : (
                      <p className="text-center text-slate-500 py-4">생성된 카테고리가 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryManagerModal;
