import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Category } from '@/types/category.types';

interface CategoryEditDialogProps {
  readonly category: Category | null;
  readonly onClose: () => void;
  readonly onSubmit: (params: { readonly id: string; readonly name: string; readonly color: string }) => Promise<void>;
  readonly isSubmitting: boolean;
}

export function CategoryEditDialog({
  category,
  onClose,
  onSubmit,
  isSubmitting,
}: CategoryEditDialogProps): React.ReactElement {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!category) return;

    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') as string)?.trim() ?? '';
    const color = (formData.get('color') as string)?.trim() ?? '#EF4444';

    await onSubmit({ id: category.id, name, color });
  };

  return (
    <Dialog open={Boolean(category)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Categoría</DialogTitle>
          <DialogDescription>Modifica el nombre o color de la categoría</DialogDescription>
        </DialogHeader>

        {category && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium" htmlFor="edit-cat-name">
                Nombre
              </label>
              <Input id="edit-cat-name" name="name" defaultValue={category.name} required />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium" htmlFor="edit-cat-color">
                Color
              </label>
              <Input
                id="edit-cat-color"
                name="color"
                type="color"
                className="h-9 p-1 cursor-pointer"
                defaultValue={category.color || '#EF4444'}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Actualizando...' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
