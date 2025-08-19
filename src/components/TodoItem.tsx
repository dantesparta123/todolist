'use client';

import { useState } from 'react';
import { Todo } from '@/types/todo';
import { updateTodo, deleteTodo } from '@/lib/todo';
import { Check, Edit, Trash2, X, Save } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleComplete = async () => {
    try {
      setIsLoading(true);
      const updatedTodo = await updateTodo(todo.id, { completed: !todo.completed });
      onUpdate(updatedTodo);
    } catch (error) {
      console.error('切换任务状态失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    
    try {
      setIsLoading(true);
      const updatedTodo = await updateTodo(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim()
      });
      onUpdate(updatedTodo);
      setIsEditing(false);
    } catch (error) {
      console.error('保存任务失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteTodo(todo.id);
      onDelete(todo.id);
    } catch (error) {
      console.error('删除任务失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setIsEditing(false);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 transition-all ${
      todo.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggleComplete}
          disabled={isLoading}
          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {todo.completed && <Check className="w-3 h-3" />}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="任务标题"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="任务描述（可选）"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isLoading || !editTitle.trim()}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  保存
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  <X className="w-4 h-4" />
                  取消
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className={`font-medium text-gray-900 ${
                todo.completed ? 'line-through text-gray-500' : ''
              }`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className={`mt-1 text-sm text-gray-600 ${
                  todo.completed ? 'line-through' : ''
                }`}>
                  {todo.description}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-400">
                创建于 {format(new Date(todo.created_at), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
              </p>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex gap-1">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
