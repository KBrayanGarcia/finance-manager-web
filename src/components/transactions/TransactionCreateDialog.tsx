import React, { useState } from 'react';
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
import type { Account } from '@/types/account.types';
import type { Category } from '@/types/category.types';
import type { TransactionType } from '@/types/transaction.types';

const transactionSchema = z.object({
  type: z.enum(['EXPENSE', 'INCOME', 'TRANSFER']),
  accountId: z.string().min(1, 'Selecciona una cuenta de origen'),
  destinationAccountId: z.string().optional(),
  categoryId: z.string().optional(),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  transactionDate: z.string().min(1, 'Selecciona la fecha'),
  description: z.string().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionCreateDialogProps {
  readonly isOpen: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly accounts: readonly Account[];
  readonly categories: readonly Category[];
  readonly isSubmitting: boolean;
  readonly onSubmit: (values: TransactionFormValues) => Promise<void>;
}

export function TransactionCreateDialog({
  isOpen,
  onOpenChange,
  accounts,
  categories,
  isSubmitting,
  onSubmit,
}: TransactionCreateDialogProps): React.ReactElement {
  const [formType, setFormType] = useState<TransactionType>('EXPENSE');

  const createForm = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'EXPENSE',
      accountId: '',
      destinationAccountId: '',
      categoryId: '',
      amount: 0,
      transactionDate: new Date().toISOString().split('T')[0],
      description: '',
    },
  });

  const handleFormSubmit = async (values: TransactionFormValues) => {
    await onSubmit(values);
    createForm.reset();
  };

  const filteredCategories = categories.filter((c) => c.type === formType);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Transacción
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Transacción</DialogTitle>
          <DialogDescription>Añade un gasto, ingreso o transferencia entre tus cuentas</DialogDescription>
        </DialogHeader>

        <form onSubmit={createForm.handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium">Tipo de Movimiento</label>
            <Select
              defaultValue="EXPENSE"
              onValueChange={(val) => {
                const type = val as TransactionType;
                setFormType(type);
                createForm.setValue('type', type);
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
              {formType === 'TRANSFER' ? 'Cuenta Origen' : 'Cuenta'}
            </label>
            <Select onValueChange={(val) => createForm.setValue('accountId', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una cuenta" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.name} (${Number(acc.currentBalance).toFixed(2)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formType === 'TRANSFER' && (
            <div className="space-y-1">
              <label className="text-xs font-medium">Cuenta Destino</label>
              <Select onValueChange={(val) => createForm.setValue('destinationAccountId', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona cuenta receptora" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name} (${Number(acc.currentBalance).toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formType !== 'TRANSFER' && (
            <div className="space-y-1">
              <label className="text-xs font-medium">Categoría</label>
              <Select onValueChange={(val) => createForm.setValue('categoryId', val)}>
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
              <label className="text-xs font-medium" htmlFor="tx-amount">
                Monto ($)
              </label>
              <Input
                id="tx-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...createForm.register('amount', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium" htmlFor="tx-date">
                Fecha
              </label>
              <Input id="tx-date" type="date" {...createForm.register('transactionDate')} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium" htmlFor="tx-desc">
              Descripción (Opcional)
            </label>
            <Input id="tx-desc" placeholder="Ej. Pago de luz, quincena..." {...createForm.register('description')} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Registrar Transacción'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
