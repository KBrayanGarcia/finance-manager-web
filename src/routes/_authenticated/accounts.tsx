import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Edit2, Wallet } from 'lucide-react';
import {
  useAccounts,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
} from '@/features/accounts/use-accounts';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Account, AccountType } from '@/types/account.types';

const accountSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'CASH', 'INVESTMENT']),
  currency: z.string(),
  initialBalance: z.number().min(0, 'El saldo no puede ser negativo'),
  color: z.string(),
});

type AccountFormValues = z.infer<typeof accountSchema>;

export const Route = createFileRoute('/_authenticated/accounts')({
  component: AccountsPage,
});

function AccountsPage(): React.ReactElement {
  const { data: accounts = [], isLoading } = useAccounts();
  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();
  const deleteAccountMutation = useDeleteAccount();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

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

  const handleCreateSubmit = async (values: AccountFormValues) => {
    await createAccountMutation.mutateAsync(values);
    createForm.reset();
    setIsCreateOpen(false);
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAccount) return;
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const color = formData.get('color') as string;

    await updateAccountMutation.mutateAsync({
      id: editingAccount.id,
      payload: { name, color },
    });
    setEditingAccount(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de desactivar esta cuenta?')) {
      await deleteAccountMutation.mutateAsync(id);
    }
  };

  return (
    <PageContainer
      title="Cuentas Financieras"
      description="Gestiona tus cuentas bancarias, de ahorro, efectivo y tarjetas de crédito"
      actions={
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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

            <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
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
                <Button type="submit" disabled={createAccountMutation.isPending}>
                  {createAccountMutation.isPending ? 'Guardando...' : 'Crear Cuenta'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {isLoading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Cargando cuentas...</div>
      ) : accounts.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground">No tienes cuentas registradas</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Crea tu primera cuenta para comenzar a llevar control de tu dinero.
          </p>
          <Button onClick={() => setIsCreateOpen(true)} size="sm">
            Crear Primera Cuenta
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <Card key={account.id} className="border-border shadow-sm flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: account.color || '#3B82F6' }}
                    />
                    <CardTitle className="text-base font-bold">{account.name}</CardTitle>
                  </div>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded font-medium text-muted-foreground">
                    {account.type}
                  </span>
                </div>
                <CardDescription className="text-xs">
                  Moneda: {account.currency}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-4">
                <p className="text-xs text-muted-foreground m-0">Saldo actual</p>
                <div className="text-2xl font-bold text-foreground">
                  ${Number(account.currentBalance).toLocaleString('es-MX', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </CardContent>

              <div className="px-6 py-3 bg-muted/20 border-t border-border flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setEditingAccount(account)}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(account.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de edición */}
      <Dialog open={Boolean(editingAccount)} onOpenChange={(open) => !open && setEditingAccount(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cuenta</DialogTitle>
            <DialogDescription>Modifica el nombre o color de la cuenta</DialogDescription>
          </DialogHeader>

          {editingAccount && (
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium" htmlFor="edit-name">
                  Nombre
                </label>
                <Input id="edit-name" name="name" defaultValue={editingAccount.name} required />
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
                  defaultValue={editingAccount.color || '#3B82F6'}
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={updateAccountMutation.isPending}>
                  {updateAccountMutation.isPending ? 'Actualizando...' : 'Guardar Cambios'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
