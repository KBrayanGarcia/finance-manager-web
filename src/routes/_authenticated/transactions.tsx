import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '@/features/transactions/use-transactions';
import { useAccounts } from '@/features/accounts/use-accounts';
import { useCategories } from '@/features/categories/use-categories';
import { PageContainer } from '@/components/layout/page-container';
import {
  TransactionCreateDialog,
  type TransactionFormValues,
} from '@/components/transactions/TransactionCreateDialog';
import { TransactionEditDialog } from '@/components/transactions/TransactionEditDialog';
import { TransactionFiltersBar } from '@/components/transactions/TransactionFiltersBar';
import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import { confirmAction } from '@/store/confirm.store';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api-error';
import type { Transaction, TransactionType } from '@/types/transaction.types';

export const Route = createFileRoute('/_authenticated/transactions')({
  component: TransactionsPage,
});

function TransactionsPage(): React.ReactElement {
  const [selectedType, setSelectedType] = useState<TransactionType | undefined>(undefined);
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(undefined);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const { data: txData, isLoading } = useTransactions({
    type: selectedType,
    accountId: selectedAccount,
    limit: 50,
    offset: 0,
  });

  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();
  const createTxMutation = useCreateTransaction();
  const updateTxMutation = useUpdateTransaction();
  const deleteTxMutation = useDeleteTransaction();

  const handleCreateSubmit = async (values: TransactionFormValues) => {
    try {
      await createTxMutation.mutateAsync({
        type: values.type,
        accountId: values.accountId,
        destinationAccountId: values.type === 'TRANSFER' ? values.destinationAccountId : undefined,
        categoryId: values.type !== 'TRANSFER' ? values.categoryId : undefined,
        amount: values.amount,
        transactionDate: values.transactionDate || undefined,
        description: values.description || undefined,
      });
      toast.success('Transacción registrada con éxito');
      setIsCreateOpen(false);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Error al registrar la transacción'));
      throw error;
    }
  };

  const handleUpdateSubmit = async (id: string, values: TransactionFormValues) => {
    try {
      await updateTxMutation.mutateAsync({
        id,
        payload: {
          type: values.type,
          accountId: values.accountId,
          destinationAccountId:
            values.type === 'TRANSFER' ? values.destinationAccountId || null : null,
          categoryId: values.type !== 'TRANSFER' ? values.categoryId || null : null,
          amount: values.amount,
          transactionDate: values.transactionDate || undefined,
          description: values.description?.trim() ? values.description.trim() : null,
        },
      });
      toast.success('Transacción actualizada y balances recalculados');
      setEditingTransaction(null);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Error al actualizar la transacción'));
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirmAction({
      title: '¿Eliminar transacción?',
      description:
        'Esta acción eliminará el movimiento y revertirá automáticamente los balances asociados en tus cuentas.',
      confirmLabel: 'Eliminar',
    });

    if (!isConfirmed) return;

    try {
      await deleteTxMutation.mutateAsync(id);
      toast.success('Transacción eliminada y balances actualizados');
    } catch {
      toast.error('Error al eliminar la transacción');
    }
  };

  const transactions = txData?.data ?? [];

  return (
    <PageContainer
      title="Historial de Transacciones"
      description="Registro cronológico de gastos, ingresos y transferencias"
      actions={
        <TransactionCreateDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          accounts={accounts}
          categories={categories}
          isSubmitting={createTxMutation.isPending}
          onSubmit={handleCreateSubmit}
        />
      }
    >
      <div className="space-y-4">
        <TransactionFiltersBar
          selectedType={selectedType}
          onSelectType={setSelectedType}
          selectedAccountId={selectedAccount}
          onSelectAccount={setSelectedAccount}
          accounts={accounts}
        />

        <TransactionsTable
          transactions={transactions}
          isLoading={isLoading}
          onEdit={setEditingTransaction}
          onDelete={handleDelete}
        />
      </div>

      <TransactionEditDialog
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        accounts={accounts}
        categories={categories}
        isSubmitting={updateTxMutation.isPending}
        onSubmit={handleUpdateSubmit}
      />
    </PageContainer>
  );
}
