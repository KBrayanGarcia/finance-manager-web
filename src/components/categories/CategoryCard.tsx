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
  const displayColor = category.color || (isIncome ? '#10B981' : '#EF4444');

  return (
    <Card className="border-border shadow-sm flex items-center justify-between p-4 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${displayColor}1A`, color: displayColor }}
        >
          {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: displayColor }}
            />
            <h4 className="text-sm font-semibold text-foreground m-0 truncate">{category.name}</h4>
          </div>
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
          aria-label={`Editar categoría ${category.name}`}
        >
          <Edit2 className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(category.id)}
          aria-label={`Eliminar categoría ${category.name}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
}
