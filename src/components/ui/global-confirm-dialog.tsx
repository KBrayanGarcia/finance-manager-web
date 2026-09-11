import React from 'react';
import { useConfirmStore } from '@/store/confirm.store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function GlobalConfirmDialog(): React.ReactElement {
  const isOpen = useConfirmStore((state) => state.isOpen);
  const options = useConfirmStore((state) => state.options);
  const handleConfirm = useConfirmStore((state) => state.handleConfirm);
  const handleCancel = useConfirmStore((state) => state.handleCancel);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{options.title}</DialogTitle>
          <DialogDescription>{options.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={handleCancel}>
            {options.cancelLabel || 'Cancelar'}
          </Button>
          <Button
            type="button"
            variant={options.variant || 'destructive'}
            onClick={handleConfirm}
          >
            {options.confirmLabel || 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
