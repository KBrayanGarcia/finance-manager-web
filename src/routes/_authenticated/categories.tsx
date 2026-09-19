import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Tags } from 'lucide-react';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/features/categories/use-categories';
import { PageContainer } from '@/components/layout/page-container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CategoryCreateDialog,
  type CategoryFormValues,
} from '@/components/categories/CategoryCreateDialog';
import { CategoryEditDialog } from '@/components/categories/CategoryEditDialog';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { confirmAction } from '@/store/confirm.store';
import { toast } from 'sonner';
import type { Category, CategoryType } from '@/types/category.types';

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

  const handleCreateSubmit = async (values: CategoryFormValues) => {
    try {
      await createCategoryMutation.mutateAsync(values);
      toast.success('Categoría creada exitosamente');
      setIsCreateOpen(false);
    } catch {
      toast.error('Error al crear la categoría');
    }
  };

  const handleUpdateSubmit = async ({
    id,
    name,
    color,
  }: {
    readonly id: string;
    readonly name: string;
    readonly color: string;
  }) => {
    try {
      await updateCategoryMutation.mutateAsync({
        id,
        payload: { name, color },
      });
      toast.success('Categoría actualizada correctamente');
      setEditingCategory(null);
    } catch {
      toast.error('Error al actualizar la categoría');
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirmAction({
      title: '¿Eliminar categoría?',
      description:
        'Esta categoría será eliminada. Las transacciones existentes asociadas conservarán su registro histórico.',
      confirmLabel: 'Eliminar',
    });

    if (!isConfirmed) return;

    try {
      await deleteCategoryMutation.mutateAsync(id);
      toast.success('Categoría eliminada exitosamente');
    } catch {
      toast.error('Error al eliminar la categoría');
    }
  };

  return (
    <PageContainer
      title="Categorías"
      description="Organiza y clasifica tus transacciones de ingresos y gastos"
      actions={
        <CategoryCreateDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmit={handleCreateSubmit}
          isSubmitting={createCategoryMutation.isPending}
        />
      }
    >
      <div className="space-y-6">
        {/* Filtros por pestaña rápida */}
        <div className="flex flex-wrap items-center gap-2">
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
          <Card className="p-6 sm:p-12 text-center border-dashed">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={setEditingCategory}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <CategoryEditDialog
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
        onSubmit={handleUpdateSubmit}
        isSubmitting={updateCategoryMutation.isPending}
      />
    </PageContainer>
  );
}
