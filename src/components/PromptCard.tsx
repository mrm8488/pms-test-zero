import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Prompt } from '@/types';
import { Edit, Trash } from 'lucide-react';
import { useStore } from '@/lib/store';

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
}

export function PromptCard({ prompt, onEdit }: PromptCardProps) {
  const { deletePrompt, categories } = useStore();
  const category = categories.find((c) => c.id === prompt.category);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h2 className="text-lg font-semibold">{prompt.title}</h2>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(prompt)}
          >
            <Edit className="h-4 w-4" />
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
        <p className="text-sm text-muted-foreground">{prompt.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          {prompt.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        {category && (
          <Badge className={category.color}>
            {category.name}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}