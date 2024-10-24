export interface PromptVersion {
  id: string;
  content: string;
  createdAt: Date;
  message: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  versions: PromptVersion[];
  category: string;
  tags: string[];
  starred: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface PromptDiff {
  added: string[];
  removed: string[];
}</content></file>

<boltAction type="file" filePath="src/lib/utils.ts">import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PromptDiff } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateDiff(oldContent: string, newContent: string): PromptDiff {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  
  return {
    removed: oldLines.filter(line => !newLines.includes(line)),
    added: newLines.filter(line => !oldLines.includes(line))
  };
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}</content></file>

<boltAction type="file" filePath="src/lib/store.ts">import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Prompt, Category, PromptVersion } from '@/types';
import { initialCategories } from '@/data/initial-data';

interface PromptStore {
  prompts: Prompt[];
  categories: Category[];
  searchQuery: string;
  selectedCategory: string | null;
  selectedPromptId: string | null;
  selectedVersionId: string | null;

  addPrompt: (data: { title: string; description: string; content: string; category: string; tags: string[]; message: string; }) => void;
  updatePrompt: (id: string, data: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  starPrompt: (id: string) => void;
  
  createVersion: (promptId: string, content: string, message: string) => void;
  deleteVersion: (promptId: string, versionId: string) => void;
  
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedPrompt: (promptId: string | null) => void;
  setSelectedVersion: (versionId: string | null) => void;
}

export const useStore = create<PromptStore>()(
  persist(
    (set, get) => ({
      prompts: [],
      categories: initialCategories,
      searchQuery: '',
      selectedCategory: null,
      selectedPromptId: null,
      selectedVersionId: null,

      addPrompt: (data) => {
        const newVersion: PromptVersion = {
          id: crypto.randomUUID(),
          content: data.content,
          message: data.message,
          createdAt: new Date(),
        };

        const newPrompt: Prompt = {
          id: crypto.randomUUID(),
          title: data.title,
          description: data.description,
          versions: [newVersion],
          category: data.category,
          tags: data.tags,
          starred: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          prompts: [newPrompt, ...state.prompts],
        }));
      },

      updatePrompt: (id, data) =>
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: new Date() } : p
          ),
        })),

      deletePrompt: (id) =>
        set((state) => ({
          prompts: state.prompts.filter((p) => p.id !== id),
          selectedPromptId: state.selectedPromptId === id ? null : state.selectedPromptId,
        })),

      starPrompt: (id) =>
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === id ? { ...p, starred: !p.starred } : p
          ),
        })),

      createVersion: (promptId, content, message) =>
        set((state) => ({
          prompts: state.prompts.map((p) => {
            if (p.id !== promptId) return p;
            
            const newVersion: PromptVersion = {
              id: crypto.randomUUID(),
              content,
              message,
              createdAt: new Date(),
            };

            return {
              ...p,
              versions: [newVersion, ...p.versions],
              updatedAt: new Date(),
            };
          }),
        })),

      deleteVersion: (promptId, versionId) =>
        set((state) => ({
          prompts: state.prompts.map((p) => {
            if (p.id !== promptId) return p;
            if (p.versions.length <= 1) return p;
            
            return {
              ...p,
              versions: p.versions.filter((v) => v.id !== versionId),
            };
          }),
        })),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSelectedPrompt: (promptId) => set({ selectedPromptId: promptId, selectedVersionId: null }),
      setSelectedVersion: (versionId) => set({ selectedVersionId: versionId }),
    }),
    {
      name: 'prompt-store',
    }
  )
);</content></file>

<boltAction type="file" filePath="src/components/prompts/PromptList.tsx">import { useStore } from '@/lib/store';
import { PromptCard } from './PromptCard';
import { EmptyState } from '../ui/empty-state';
import { FileIcon } from 'lucide-react';

export function PromptList() {
  const { prompts, searchQuery, selectedCategory } = useStore();

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory = !selectedCategory || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (filteredPrompts.length === 0) {
    return (
      <EmptyState
        icon={FileIcon}
        title="No prompts found"
        description="Get started by creating a new prompt"
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredPrompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
}</content></file>

<boltAction type="file" filePath="src/components/prompts/PromptCard.tsx">import { formatDistanceToNow } from 'date-fns';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Prompt } from '@/types';
import { Edit2, GitBranch, Star, Trash } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';

interface PromptCardProps {
  prompt: Prompt;
}

export function PromptCard({ prompt }: PromptCardProps) {
  const { deletePrompt, starPrompt, setSelectedPrompt, categories } = useStore();
  const category = categories.find((c) => c.id === prompt.category);

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold leading-none">{prompt.title}</h2>
            {prompt.starred && (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {prompt.description}
          </p>
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => starPrompt(prompt.id)}
          >
            <Star className={cn("h-4 w-4", prompt.starred && "fill-yellow-400 text-yellow-400")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedPrompt(prompt.id)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deletePrompt(prompt.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GitBranch className="h-4 w-4" />
          <span>{prompt.versions.length} versions</span>
          <span>·</span>
          <span>Updated {formatDistanceToNow(prompt.updatedAt)} ago</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {prompt.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {category && (
          <Badge variant="outline" className={cn("gap-2", category.color)}>
            <div className={cn("h-2 w-2 rounded-full", category.color)} />
            {category.name}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}</content></file>

<boltAction type="file" filePath="src/components/prompts/PromptEditor.tsx">import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDate, generateDiff } from '@/lib/utils';
import { ChevronDown, ChevronUp, GitCommit, Save } from 'lucide-react';

export function PromptEditor() {
  const { prompts, selectedPromptId, selectedVersionId, createVersion } = useStore();
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [showDiff, setShowDiff] = useState(false);

  const prompt = prompts.find((p) => p.id === selectedPromptId);
  if (!prompt) return null;

  const currentVersion = selectedVersionId
    ? prompt.versions.find((v) => v.id === selectedVersionId)
    : prompt.versions[0];

  const handleSave = () => {
    if (!content.trim() || !message.trim()) return;
    createVersion(prompt.id, content, message);
    setContent('');
    setMessage('');
  };

  const diff = currentVersion
    ? generateDiff(currentVersion.content, content)
    : null;

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">{prompt.title}</h2>
          <p className="text-sm text-muted-foreground">{prompt.description}</p>
        </div>
        <div className="flex-1 p-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your prompt here..."
            className="h-full resize-none"
          />
        </div>
        <div className="border-t p-4 space-y-4">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message describing your changes..."
          />
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setShowDiff(!showDiff)}
              disabled={!diff}
            >
              {showDiff ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronUp className="h-4 w-4 mr-2" />}
              {showDiff ? 'Hide' : 'Show'} Changes
            </Button>
            <Button onClick={handleSave} disabled={!content.trim() || !message.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Save Version
            </Button>
          </div>
          {showDiff && diff && (
            <div className="space-y-2 text-sm">
              {diff.added.map((line, i) => (
                <div key={i} className="text-green-600 bg-green-50 p-1">+ {line}</div>
              ))}
              {diff.removed.map((line, i) => (
                <div key={i} className="text-red-600 bg-red-50 p-1">- {line}</div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="w-80 border-l">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Version History</h3>
        </div>
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="space-y-2 p-4">
            {prompt.versions.map((version) => (
              <div
                key={version.id}
                className="space-y-1 p-3 rounded-lg hover:bg-accent cursor-pointer"
              >
                <div className="flex items-center gap-2 text-sm">
                  <GitCommit className="h-4 w-4" />
                  <span className="font-medium">{version.message}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(version.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}</content></file>

<boltAction type="file" filePath="src/App.tsx">import { useStore } from '@/lib/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { PromptList } from '@/components/prompts/PromptList';
import { PromptEditor } from '@/components/prompts/PromptEditor';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function App() {
  const { searchQuery, setSearchQuery, selectedPromptId } = useStore();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="w-64 border-r">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-lg font-semibold">Prompt Manager</h1>
        </div>
        <Sidebar />
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
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
        </div>
        <div className="flex-1 overflow-auto p-6">
          {selectedPromptId ? <PromptEditor /> : <PromptList />}
        </div>
      </main>
    </div>
  );
}</content></file>

<boltAction type="file" filePath="src/data/initial-data.ts">import { Category } from '@/types';

export const initialCategories: Category[] = [
  {
    id: 'general',
    name: 'General',
    color: 'bg-blue-500',
    description: 'General-purpose prompts',
  },
  {
    id: 'coding',
    name: 'Coding',
    color: 'bg-green-500',
    description: 'Programming and development prompts',
  },
  {
    id: 'writing',
    name: 'Writing',
    color: 'bg-purple-500',
    description: 'Content writing and creative prompts',
  },
  {
    id: 'business',
    name: 'Business',
    color: 'bg-orange-500',
    description: 'Business and professional prompts',
  },
];</content></file>

<boltAction type="shell">
<command>npm run dev</command>