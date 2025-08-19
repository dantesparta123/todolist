import { supabase } from './supabase';
import { Todo, CreateTodoData, UpdateTodoData } from '@/types/todo';

export async function getTodos(): Promise<Todo[]> {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`获取任务列表失败: ${error.message}`);
  }

  return data || [];
}

export async function createTodo(todoData: CreateTodoData): Promise<Todo> {
  const { data, error } = await supabase
    .from('todos')
    .insert([todoData])
    .select()
    .single();

  if (error) {
    throw new Error(`创建任务失败: ${error.message}`);
  }

  return data;
}

export async function updateTodo(id: string, todoData: UpdateTodoData): Promise<Todo> {
  const { data, error } = await supabase
    .from('todos')
    .update({ ...todoData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`更新任务失败: ${error.message}`);
  }

  return data;
}

export async function deleteTodo(id: string): Promise<void> {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`删除任务失败: ${error.message}`);
  }
}

export async function toggleTodoStatus(id: string, completed: boolean): Promise<Todo> {
  return updateTodo(id, { completed });
}
