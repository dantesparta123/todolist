'use client';

import { useState } from 'react';
import { createTodo } from '@/lib/todo';
import { Todo } from '@/types/todo';
import { Plus, Sparkles, Loader2 } from 'lucide-react';

interface AddTodoProps {
  onAdd: (todo: Todo) => void;
}

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [wordLimit, setWordLimit] = useState(20);

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

  // AI生成任务描述
  const generateDescription = async () => {
    if (!title.trim()) {
      alert('请先输入任务标题');
      return;
    }

    setIsGenerating(true);
    setDescription(''); // 清空之前的描述
    
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          wordLimit: wordLimit
        }),
      });

      if (!response.ok) {
        throw new Error('生成失败');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                throw new Error(data.error);
              }
              
              if (data.char) {
                // 逐字添加
                setDescription(prev => prev + data.char);
              }
              
              if (data.done) {
                // 生成完成，使用清理后的文本
                setDescription(data.description);
                break;
              }
            } catch (e) {
              console.error('解析流数据失败:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('生成描述失败:', error);
      alert('生成描述失败，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors py-2"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
            autoFocus
          />
          
          {/* AI生成描述区域 */}
          <div className="flex flex-col sm:flex-row gap-2 items-start">
            <div className="flex-1">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="任务描述（可选）"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                rows={3}
              />
            </div>
            
            <div className="flex flex-col gap-2 min-w-fit">
              {/* 字数限制输入 */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600 whitespace-nowrap">字数限制:</label>
                <input
                  type="number"
                  value={wordLimit}
                  onChange={(e) => setWordLimit(Math.max(5, Math.min(100, parseInt(e.target.value) || 20)))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-center"
                  min="5"
                  max="100"
                />
              </div>
              
              {/* AI生成按钮 */}
              <button
                type="button"
                onClick={generateDescription}
                disabled={isGenerating || !title.trim()}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm whitespace-nowrap"
              >
                {isGenerating ? (
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                {isGenerating ? '生成中...' : 'AI生成'}
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="flex items-center justify-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              {isLoading ? '添加中...' : '添加任务'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              取消
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
