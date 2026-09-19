import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Edit2, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Category } from '@/types/category.types';

interface CategoryCardProps {
  readonly category: Category;
  readonly onEdit: (category: Category) => void;
  readonly onDelete: (id: string) => void;
}

export function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps): React.ReactElement {
  const isIncome = category.type === 'INCOME';

  return (
    <Card className="border-border shadow-sm flex items-center justify-between p-4 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isIncome ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
          }`}
        >
          {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-foreground m-0 truncate">{category.name}</h4>
          <Badge variant={isIncome ? 'success' : 'outline'} className="mt-1 text-[10px]">
            {isIncome ? 'Ingreso' : 'Gasto'}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => onEdit(category)}
        >
          <Edit2 className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(category.id)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
}
