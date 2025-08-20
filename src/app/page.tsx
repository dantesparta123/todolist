'use client';

import { useState, useEffect } from 'react';
import { Todo } from '@/types/todo';
import { getTodos } from '@/lib/todo';
import TodoItem from '@/components/TodoItem';
import AddTodo from '@/components/AddTodo';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import FloatingImportExport from '@/components/FloatingImportExport';
import StatisticsDashboard from '@/components/StatisticsDashboard';
import { CheckCircle, Clock } from 'lucide-react';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载任务失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = (newTodo: Todo) => {
    setTodos(prev => [newTodo, ...prev]);
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setTodos(prev => prev.map(todo => 
      todo.id === updatedTodo.id ? updatedTodo : todo
    ));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadTodos}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* 头部 */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">任务清单</h1>
          <p className="text-sm sm:text-base text-gray-600">管理您的日常任务，提高工作效率</p>
        </div>

        {/* 统计信息 */}
        {totalCount > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                  <Clock className="w-4 h-4" />
                  <span>总任务: {totalCount}</span>
                </div>
                <div className="flex items-center gap-2 text-green-600 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4" />
                  <span>已完成: {completedCount}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 text-center sm:text-right">
                {totalCount > 0 ? `${Math.round((completedCount / totalCount) * 100)}%` : '0%'} 完成
              </div>
            </div>
            {/* 进度条 */}
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* 添加任务 */}
        <AddTodo onAdd={handleAddTodo} />

        {/* 任务列表 */}
        <div className="mt-4 sm:mt-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : todos.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {todos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleUpdateTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 浮动统计看板按钮 */}
      <StatisticsDashboard todos={todos} />
      
      {/* 浮动导入导出按钮 */}
      <FloatingImportExport todos={todos} onImportSuccess={loadTodos} />
    </div>
  );
}
