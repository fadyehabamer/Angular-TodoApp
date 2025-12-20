export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  category: string[];
  priority: 'low' | 'medium' | 'high';
}