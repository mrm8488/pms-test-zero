import { cn } from '@/lib/utils';
import { Category } from '@/types';
import { FolderIcon, PlusCircleIcon, SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  onNewPrompt: () => void;
}

export function Sidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  onNewPrompt,
}: SidebarProps) {
  return (
    <div className="pb-12 w-64 border-r">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Button
              onClick={onNewPrompt}
              className="w-full justify-start"
              variant="default"
            >
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              New Prompt
            </Button>
          </div>
          <div className="mt-4">
            <Input
              placeholder="Search prompts..."
              className="w-full"
              prefix={<SearchIcon className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Categories
          </h2>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1">
              <Button
                onClick={() => onSelectCategory(null)}
                variant={selectedCategory === null ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <FolderIcon className="mr-2 h-4 w-4" />
                All Prompts
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => onSelectCategory(category.id)}
                  variant={
                    selectedCategory === category.id ? 'secondary' : 'ghost'
                  }
                  className="w-full justify-start"
                >
                  <div
                    className={cn(
                      'mr-2 h-2 w-2 rounded-full',
                      category.color
                    )}
                  />
                  {category.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}