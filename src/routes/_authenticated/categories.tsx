import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Edit2, Tags, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/features/categories/use-categories';
import { PageContainer } from '@/components/layout/page-container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Category, CategoryType } from '@/types/category.types';

const categorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  type: z.enum(['EXPENSE', 'INCOME']),
  color: z.string(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export const Route = createFileRoute('/_authenticated/categories')({
  component: CategoriesPage,
});

function CategoriesPage(): React.ReactElement {
  const [filterType, setFilterType] = useState<CategoryType | undefined>(undefined);
  const { data: categories = [], isLoading } = useCategories(filterType);
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const createForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'EXPENSE',
      color: '#EF4444',
    },
  });

  const handleCreateSubmit = async (values: CategoryFormValues) => {
    await createCategoryMutation.mutateAsync(values);
    createForm.reset();
    setIsCreateOpen(false);
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const color = formData.get('color') as string;

    await updateCategoryMutation.mutateAsync({
      id: editingCategory.id,
      payload: { name, color },
    });
    setEditingCategory(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Deseas eliminar esta categoría?')) {
      await deleteCategoryMutation.mutateAsync(id);
    }
  };

  return (
    <PageContainer
      title="Categorías"
      description="Organiza y clasifica tus transacciones de ingresos y gastos"
      actions={
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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

            <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
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
                <Button type="submit" disabled={createCategoryMutation.isPending}>
                  {createCategoryMutation.isPending ? 'Guardando...' : 'Crear Categoría'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="space-y-6">
        {/* Filtros por pestaña rápida */}
        <div className="flex items-center gap-2">
          <Button
            variant={filterType === undefined ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType(undefined)}
          >
            Todas
          </Button>
          <Button
            variant={filterType === 'EXPENSE' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('EXPENSE')}
          >
            Solo Gastos
          </Button>
          <Button
            variant={filterType === 'INCOME' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('INCOME')}
          >
            Solo Ingresos
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-sm text-muted-foreground">Cargando categorías...</div>
        ) : categories.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <Tags className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">No hay categorías encontradas</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Crea categorías para organizar tus entradas y salidas de dinero.
            </p>
            <Button onClick={() => setIsCreateOpen(true)} size="sm">
              Crear Categoría
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const isIncome = category.type === 'INCOME';

              return (
                <Card key={category.id} className="border-border shadow-sm flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isIncome ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                      }`}
                    >
                      {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground m-0">{category.name}</h4>
                      <Badge variant={isIncome ? 'success' : 'outline'} className="mt-1 text-[10px]">
                        {isIncome ? 'Ingreso' : 'Gasto'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setEditingCategory(category)}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de edición */}
      <Dialog open={Boolean(editingCategory)} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>Modifica el nombre o color de la categoría</DialogDescription>
          </DialogHeader>

          {editingCategory && (
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium" htmlFor="edit-cat-name">
                  Nombre
                </label>
                <Input id="edit-cat-name" name="name" defaultValue={editingCategory.name} required />
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
                  defaultValue={editingCategory.color || '#EF4444'}
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={updateCategoryMutation.isPending}>
                  {updateCategoryMutation.isPending ? 'Actualizando...' : 'Guardar Cambios'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
