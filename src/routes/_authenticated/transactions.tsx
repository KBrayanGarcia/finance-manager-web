import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  useTransactions,
  useCreateTransaction,
  useDeleteTransaction,
} from '@/features/transactions/use-transactions';
import { useAccounts } from '@/features/accounts/use-accounts';
import { useCategories } from '@/features/categories/use-categories';
import { PageContainer } from '@/components/layout/page-container';
import {
  TransactionCreateDialog,
  type TransactionFormValues,
} from '@/components/transactions/TransactionCreateDialog';
import { TransactionFiltersBar } from '@/components/transactions/TransactionFiltersBar';
import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import type { TransactionType } from '@/types/transaction.types';

export const Route = createFileRoute('/_authenticated/transactions')({
  component: TransactionsPage,
});

function TransactionsPage(): React.ReactElement {
  const [selectedType, setSelectedType] = useState<TransactionType | undefined>(undefined);
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(undefined);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: txData, isLoading } = useTransactions({
    type: selectedType,
    accountId: selectedAccount,
    limit: 50,
    offset: 0,
  });

  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();
  const createTxMutation = useCreateTransaction();
  const deleteTxMutation = useDeleteTransaction();

  const handleCreateSubmit = async (values: TransactionFormValues) => {
    await createTxMutation.mutateAsync({
      type: values.type,
      accountId: values.accountId,
      destinationAccountId: values.type === 'TRANSFER' ? values.destinationAccountId : undefined,
      categoryId: values.type !== 'TRANSFER' ? values.categoryId : undefined,
      amount: values.amount,
      transactionDate: values.transactionDate ? new Date(values.transactionDate).toISOString() : undefined,
      description: values.description || undefined,
    });
    setIsCreateOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Deseas eliminar esta transacción? Los balances se revertirán automáticamente.')) {
      await deleteTxMutation.mutateAsync(id);
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
          onDelete={handleDelete}
        />
      </div>
    </PageContainer>
  );
}
