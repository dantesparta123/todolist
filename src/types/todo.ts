export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoData {
  title: string;
  description: string;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
}
