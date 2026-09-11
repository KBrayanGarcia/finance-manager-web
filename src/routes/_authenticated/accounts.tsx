import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Wallet } from 'lucide-react';
import {
  useAccounts,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
} from '@/features/accounts/use-accounts';
import { PageContainer } from '@/components/layout/page-container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AccountCreateDialog,
  type AccountFormValues,
} from '@/components/accounts/AccountCreateDialog';
import { AccountEditDialog } from '@/components/accounts/AccountEditDialog';
import { AccountCard } from '@/components/accounts/AccountCard';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import type { Account } from '@/types/account.types';

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
  const [deactivatingAccountId, setDeactivatingAccountId] = useState<string | null>(null);

  const handleCreateSubmit = async (values: AccountFormValues) => {
    try {
      await createAccountMutation.mutateAsync(values);
      toast.success('Cuenta creada exitosamente');
      setIsCreateOpen(false);
    } catch {
      toast.error('Error al crear la cuenta financiera');
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
      await updateAccountMutation.mutateAsync({
        id,
        payload: { name, color },
      });
      toast.success('Cuenta actualizada correctamente');
      setEditingAccount(null);
    } catch {
      toast.error('Error al actualizar la cuenta');
    }
  };

  const handleConfirmDeactivate = async () => {
    if (!deactivatingAccountId) return;
    try {
      await deleteAccountMutation.mutateAsync(deactivatingAccountId);
      toast.success('Cuenta desactivada exitosamente');
    } catch {
      toast.error('Error al desactivar la cuenta');
    } finally {
      setDeactivatingAccountId(null);
    }
  };

  return (
    <PageContainer
      title="Cuentas Financieras"
      description="Gestiona tus cuentas bancarias, de ahorro, efectivo y tarjetas de crédito"
      actions={
        <AccountCreateDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmit={handleCreateSubmit}
          isSubmitting={createAccountMutation.isPending}
        />
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
            <AccountCard
              key={account.id}
              account={account}
              onEdit={setEditingAccount}
              onDelete={(id) => setDeactivatingAccountId(id)}
            />
          ))}
        </div>
      )}

      <AccountEditDialog
        account={editingAccount}
        onClose={() => setEditingAccount(null)}
        onSubmit={handleUpdateSubmit}
        isSubmitting={updateAccountMutation.isPending}
      />

      <ConfirmDialog
        isOpen={Boolean(deactivatingAccountId)}
        onOpenChange={(open) => !open && setDeactivatingAccountId(null)}
        title="¿Desactivar cuenta financiera?"
        description="Esta cuenta será desactivada y sus movimientos históricos se conservarán intactos."
        confirmLabel="Desactivar"
        isLoading={deleteAccountMutation.isPending}
        onConfirm={handleConfirmDeactivate}
      />
    </PageContainer>
  );
}
