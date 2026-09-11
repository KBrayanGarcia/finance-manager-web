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
import type { Account } from '@/types/account.types';

interface AccountEditDialogProps {
  readonly account: Account | null;
  readonly onClose: () => void;
  readonly onSubmit: (params: { readonly id: string; readonly name: string; readonly color: string }) => Promise<void>;
  readonly isSubmitting: boolean;
}

export function AccountEditDialog({
  account,
  onClose,
  onSubmit,
  isSubmitting,
}: AccountEditDialogProps): React.ReactElement {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!account) return;

    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') as string)?.trim() ?? '';
    const color = (formData.get('color') as string)?.trim() ?? '#3B82F6';

    await onSubmit({ id: account.id, name, color });
  };

  return (
    <Dialog open={Boolean(account)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Cuenta</DialogTitle>
          <DialogDescription>Modifica el nombre o color de la cuenta</DialogDescription>
        </DialogHeader>

        {account && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium" htmlFor="edit-name">
                Nombre
              </label>
              <Input id="edit-name" name="name" defaultValue={account.name} required />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium" htmlFor="edit-color">
                Color
              </label>
              <Input
                id="edit-color"
                name="color"
                type="color"
                className="h-9 p-1 cursor-pointer"
                defaultValue={account.color || '#3B82F6'}
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
