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
import type { AccountType } from '@/types/account.types';

const accountSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'CASH', 'INVESTMENT']),
  currency: z.string(),
  initialBalance: z.number().min(0, 'El saldo no puede ser negativo'),
  color: z.string(),
});

export type AccountFormValues = z.infer<typeof accountSchema>;

interface AccountCreateDialogProps {
  readonly isOpen: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (values: AccountFormValues) => Promise<void>;
  readonly isSubmitting: boolean;
}

export function AccountCreateDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: AccountCreateDialogProps): React.ReactElement {
  const createForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      type: 'CHECKING',
      currency: 'MXN',
      initialBalance: 0,
      color: '#3B82F6',
    },
  });

  const handleFormSubmit = async (values: AccountFormValues) => {
    await onSubmit(values);
    createForm.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cuenta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Cuenta Financiera</DialogTitle>
          <DialogDescription>
            Registra una nueva cuenta para empezar a registrar movimientos
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={createForm.handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium" htmlFor="acc-name">
              Nombre de la Cuenta
            </label>
            <Input
              id="acc-name"
              placeholder="Ej. BBVA Nómina"
              {...createForm.register('name')}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Tipo de Cuenta</label>
            <Select
              defaultValue="CHECKING"
              onValueChange={(val) => createForm.setValue('type', val as AccountType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CHECKING">Cuenta Corriente (Débito)</SelectItem>
                <SelectItem value="SAVINGS">Cuenta de Ahorros</SelectItem>
                <SelectItem value="CREDIT_CARD">Tarjeta de Crédito</SelectItem>
                <SelectItem value="CASH">Efectivo</SelectItem>
                <SelectItem value="INVESTMENT">Inversión</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium" htmlFor="acc-balance">
                Saldo Inicial
              </label>
              <Input
                id="acc-balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...createForm.register('initialBalance', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium" htmlFor="acc-color">
                Color
              </label>
              <Input
                id="acc-color"
                type="color"
                className="h-9 p-1 cursor-pointer"
                {...createForm.register('color')}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Crear Cuenta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
