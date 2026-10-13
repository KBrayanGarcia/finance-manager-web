import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatTransactionDate } from '@/lib/formatters';
import {
  transactionSchema,
  type TransactionFormValues,
} from './transaction-form.schema';
import type { Account } from '@/types/account.types';
import type { Category } from '@/types/category.types';
import type { Transaction, TransactionType } from '@/types/transaction.types';

interface TransactionEditDialogProps {
  readonly transaction: Transaction | null;
  readonly onClose: () => void;
  readonly accounts: readonly Account[];
  readonly categories: readonly Category[];
  readonly isSubmitting: boolean;
  readonly onSubmit: (id: string, values: TransactionFormValues) => Promise<void>;
}

export function TransactionEditDialog({
  transaction,
  onClose,
  accounts,
  categories,
  isSubmitting,
  onSubmit,
}: TransactionEditDialogProps): React.ReactElement {
  const editForm = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'EXPENSE',
      accountId: '',
      destinationAccountId: '',
      categoryId: '',
      amount: 0,
      transactionDate: '',
      description: '',
    },
  });

  useEffect(() => {
    if (!transaction) {
      editForm.clearErrors();
      return;
    }

    editForm.reset({
      type: transaction.type,
      accountId: transaction.accountId,
      destinationAccountId: transaction.destinationAccountId ?? '',
      categoryId: transaction.categoryId ?? '',
      amount: Number(transaction.amount),
      transactionDate: formatTransactionDate(transaction.transactionDate, 'yyyy-MM-dd'),
      description: transaction.description ?? '',
    });
  }, [transaction, editForm]);

  const selectedType = useWatch({
    control: editForm.control,
    name: 'type',
  });
  const selectedAccountId = useWatch({
    control: editForm.control,
    name: 'accountId',
  });
  const selectedDestinationAccountId = useWatch({
    control: editForm.control,
    name: 'destinationAccountId',
  });
  const selectedCategoryId = useWatch({
    control: editForm.control,
    name: 'categoryId',
  });

  const filteredCategories = categories.filter((c) => c.type === selectedType);

  const handleFormSubmit = async (values: TransactionFormValues) => {
    if (!transaction) return;
    try {
      await onSubmit(transaction.id, values);
    } catch {
      // Preservar los valores en el formulario si la petición falla
    }
  };

  return (
    <Dialog open={Boolean(transaction)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Transacción</DialogTitle>
          <DialogDescription>
            Modifica los datos del movimiento; los saldos de tus cuentas se ajustarán automáticamente
          </DialogDescription>
        </DialogHeader>

        {transaction && (
          <form onSubmit={editForm.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Tipo de Movimiento</label>
              <Select
                value={selectedType}
                onValueChange={(val) => {
                  const nextType = val as TransactionType;
                  editForm.setValue('type', nextType, { shouldValidate: true });
                  if (nextType === 'TRANSFER') {
                    editForm.setValue('categoryId', '');
                  } else {
                    editForm.setValue('destinationAccountId', '');
                    const currentCategory = categories.find((c) => c.id === selectedCategoryId);
                    if (currentCategory && currentCategory.type !== nextType) {
                      editForm.setValue('categoryId', '');
                    }
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXPENSE">Gasto</SelectItem>
                  <SelectItem value="INCOME">Ingreso</SelectItem>
                  <SelectItem value="TRANSFER">Transferencia entre Cuentas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">
                {selectedType === 'TRANSFER' ? 'Cuenta Origen' : 'Cuenta'}
              </label>
              <Select
                value={selectedAccountId || undefined}
                onValueChange={(val) =>
                  editForm.setValue('accountId', val, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una cuenta" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem
                      key={acc.id}
                      value={acc.id}
                      disabled={
                        selectedType === 'TRANSFER' && acc.id === selectedDestinationAccountId
                      }
                    >
                      {acc.name} (${Number(acc.currentBalance).toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editForm.formState.errors.accountId && (
                <p className="text-xs text-destructive mt-1">
                  {editForm.formState.errors.accountId.message}
                </p>
              )}
            </div>

            {selectedType === 'TRANSFER' && (
              <div className="space-y-1">
                <label className="text-xs font-medium">Cuenta Destino</label>
                <Select
                  value={selectedDestinationAccountId || undefined}
                  onValueChange={(val) =>
                    editForm.setValue('destinationAccountId', val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona cuenta receptora" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((acc) => (
                      <SelectItem
                        key={acc.id}
                        value={acc.id}
                        disabled={acc.id === selectedAccountId}
                      >
                        {acc.name} (${Number(acc.currentBalance).toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editForm.formState.errors.destinationAccountId?.message && (
                  <p className="text-xs text-destructive mt-1">
                    {editForm.formState.errors.destinationAccountId.message}
                  </p>
                )}
              </div>
            )}

            {selectedType !== 'TRANSFER' && (
              <div className="space-y-1">
                <label className="text-xs font-medium">Categoría</label>
                <Select
                  value={selectedCategoryId || undefined}
                  onValueChange={(val) => editForm.setValue('categoryId', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium" htmlFor="edit-tx-amount">
                  Monto ($)
                </label>
                <Input
                  id="edit-tx-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...editForm.register('amount', { valueAsNumber: true })}
                />
                {editForm.formState.errors.amount?.message && (
                  <p className="text-xs text-destructive mt-1">
                    {editForm.formState.errors.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium" htmlFor="edit-tx-date">
                  Fecha
                </label>
                <Input
                  id="edit-tx-date"
                  type="date"
                  {...editForm.register('transactionDate')}
                />
                {editForm.formState.errors.transactionDate?.message && (
                  <p className="text-xs text-destructive mt-1">
                    {editForm.formState.errors.transactionDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium" htmlFor="edit-tx-desc">
                Descripción (Opcional)
              </label>
              <Input
                id="edit-tx-desc"
                placeholder="Ej. Pago de luz, quincena..."
                {...editForm.register('description')}
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
