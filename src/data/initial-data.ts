import { Category, Prompt } from '@/types';

export const initialCategories: Category[] = [
  { id: 'general', name: 'General', color: 'bg-blue-500' },
  { id: 'coding', name: 'Coding', color: 'bg-green-500' },
  { id: 'writing', name: 'Writing', color: 'bg-purple-500' },
  { id: 'business', name: 'Business', color: 'bg-orange-500' },
];

export const initialPrompts: Prompt[] = [
  {
    id: '1',
    title: 'React Component Generator',
    content: 'Create a React component that implements...',
    category: 'coding',
    tags: ['react', 'typescript', 'frontend'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'Blog Post Outline',
    content: 'Generate an outline for a blog post about...',
    category: 'writing',
    tags: ['content', 'blog'],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];