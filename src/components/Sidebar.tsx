import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStore } from '@/lib/store';
import { PlusCircle } from 'lucide-react';

export function Sidebar() {
  const { categories, selectedCategory, setSelectedCategory } = useStore();

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Button
              variant={selectedCategory === null ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedCategory(null)}
            >
              All Prompts
            </Button>
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Categories
            </h2>
            <ScrollArea className="h-[300px] px-1">
              <div className="space-y-1">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div
                      className={cn(
                        'mr-2 h-4 w-4 rounded',
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
    </div>
  );
}