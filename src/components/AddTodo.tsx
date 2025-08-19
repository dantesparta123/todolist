'use client';

import { useState } from 'react';
import { createTodo } from '@/lib/todo';
import { Todo } from '@/types/todo';
import { Plus } from 'lucide-react';

interface AddTodoProps {
  onAdd: (todo: Todo) => void;
}

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsLoading(true);
      const newTodo = await createTodo({
        title: title.trim(),
        description: description.trim()
      });
      onAdd(newTodo);
      setTitle('');
      setDescription('');
      setIsExpanded(false);
    } catch (error) {
      console.error('创建任务失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setIsExpanded(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>添加新任务</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="任务标题"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="任务描述（可选）"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {isLoading ? '添加中...' : '添加任务'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              取消
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
