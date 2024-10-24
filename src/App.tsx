import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Sidebar } from '@/components/Sidebar';
import { PromptCard } from '@/components/PromptCard';
import { PromptDialog } from '@/components/PromptDialog';
import { Input } from '@/components/ui/input';
import { Prompt } from '@/types';
import { Search } from 'lucide-react';

export default function App() {
  const { prompts, searchQuery, setSearchQuery, selectedCategory } = useStore();
  const [editingPrompt, setEditingPrompt] = useState<Prompt | undefined>();

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory = !selectedCategory || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 border-r bg-background">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-lg font-semibold">Prompt Manager</h1>
        </div>
        <Sidebar />
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="flex h-16 items-center justify-between border-b px-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <PromptDialog
            prompt={editingPrompt}
            onClose={() => setEditingPrompt(undefined)}
          />
        </div>
        <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onEdit={setEditingPrompt}
            />
          ))}
        </div>
      </main>
    </div>
  );
}