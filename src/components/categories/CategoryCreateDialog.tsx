import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CategoryType } from '@/types/category.types';

const categorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  type: z.enum(['EXPENSE', 'INCOME']),
  color: z.string(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryCreateDialogProps {
  readonly isOpen: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (values: CategoryFormValues) => Promise<void>;
  readonly isSubmitting: boolean;
}

export function CategoryCreateDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: CategoryCreateDialogProps): React.ReactElement {
  const createForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'EXPENSE',
      color: '#EF4444',
    },
  });

  const handleFormSubmit = async (values: CategoryFormValues) => {
    await onSubmit(values);
    createForm.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Categoría
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Categoría</DialogTitle>
          <DialogDescription>Define una etiqueta para clasificar tus movimientos</DialogDescription>
        </DialogHeader>

        <form onSubmit={createForm.handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium" htmlFor="cat-name">
              Nombre de la Categoría
            </label>
            <Input
              id="cat-name"
              placeholder="Ej. Supermercado, Salario"
              {...createForm.register('name')}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Tipo de Categoría</label>
            <Select
              defaultValue="EXPENSE"
              onValueChange={(val) => createForm.setValue('type', val as CategoryType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXPENSE">Gasto (EXPENSE)</SelectItem>
                <SelectItem value="INCOME">Ingreso (INCOME)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium" htmlFor="cat-color">
              Color Identificador
            </label>
            <Input
              id="cat-color"
              type="color"
              className="h-9 p-1 cursor-pointer"
              {...createForm.register('color')}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Crear Categoría'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
