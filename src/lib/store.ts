import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Prompt, Category } from '@/types';

interface PromptStore {
  prompts: Prompt[];
  categories: Category[];
  searchQuery: string;
  selectedCategory: string | null;
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePrompt: (id: string, prompt: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
}

export const useStore = create<PromptStore>()(
  persist(
    (set) => ({
      prompts: [],
      categories: [
        { id: '1', name: 'General', color: 'bg-blue-500' },
        { id: '2', name: 'Technical', color: 'bg-green-500' },
        { id: '3', name: 'Creative', color: 'bg-purple-500' },
      ],
      searchQuery: '',
      selectedCategory: null,
      addPrompt: (prompt) =>
        set((state) => ({
          prompts: [
            ...state.prompts,
            {
              ...prompt,
              id: crypto.randomUUID(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),
      updatePrompt: (id, prompt) =>
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === id ? { ...p, ...prompt, updatedAt: new Date() } : p
          ),
        })),
      deletePrompt: (id) =>
        set((state) => ({
          prompts: state.prompts.filter((p) => p.id !== id),
        })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, { ...category, id: crypto.randomUUID() }],
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
    }),
    {
      name: 'prompt-store',
    }
  )
);