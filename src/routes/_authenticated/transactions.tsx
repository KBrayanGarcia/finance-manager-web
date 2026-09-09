import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
import { useTransactions, useCreateTransaction, useDeleteTransaction } from '@/features/transactions/use-transactions';
import { useAccounts } from '@/features/accounts/use-accounts';
import { useCategories } from '@/features/categories/use-categories';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

type TransactionFormValues = z.infer<typeof transactionSchema>;

export const Route = createFileRoute('/_authenticated/transactions')({
  component: TransactionsPage,
});

function TransactionsPage(): React.ReactElement {
  const [selectedType, setSelectedType] = useState<TransactionType | undefined>(undefined);
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(undefined);

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

  const [isCreateOpen, setIsCreateOpen] = useState(false);
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
    createForm.reset();
    setIsCreateOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Deseas eliminar esta transacción? Los balances se revertirán automáticamente.')) {
      await deleteTxMutation.mutateAsync(id);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === formType);
  const transactions = txData?.data ?? [];

  return (
    <PageContainer
      title="Historial de Transacciones"
      description="Registro cronológico de gastos, ingresos y transferencias"
      actions={
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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

            <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Tipo de Movimiento</label>
                <Select
                  defaultValue="EXPENSE"
                  onValueChange={(val) => {
                    const t = val as TransactionType;
                    setFormType(t);
                    createForm.setValue('type', t);
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
                <Button type="submit" disabled={createTxMutation.isPending}>
                  {createTxMutation.isPending ? 'Guardando...' : 'Registrar Transacción'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={selectedType === undefined ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(undefined)}
            >
              Todos
            </Button>
            <Button
              variant={selectedType === 'EXPENSE' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('EXPENSE')}
            >
              Gastos
            </Button>
            <Button
              variant={selectedType === 'INCOME' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('INCOME')}
            >
              Ingresos
            </Button>
            <Button
              variant={selectedType === 'TRANSFER' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('TRANSFER')}
            >
              Transferencias
            </Button>
          </div>

          <div className="w-48">
            <Select onValueChange={(val) => setSelectedAccount(val === 'ALL' ? undefined : val)}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las cuentas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas las cuentas</SelectItem>
                {accounts.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabla de Resultados */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-muted-foreground">Cargando transacciones...</div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No se encontraron transacciones para los filtros seleccionados.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cuenta</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => {
                    const isIncome = tx.type === 'INCOME';
                    const isTransfer = tx.type === 'TRANSFER';

                    return (
                      <TableRow key={tx.id}>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {format(new Date(tx.transactionDate), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {tx.description || (isTransfer ? 'Transferencia' : 'Sin descripción')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={isIncome ? 'success' : isTransfer ? 'secondary' : 'outline'}>
                            {tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {isTransfer ? (
                            <span>
                              {tx.account?.name} → {tx.destinationAccount?.name}
                            </span>
                          ) : (
                            tx.account?.name || '—'
                          )}
                        </TableCell>
                        <TableCell className="text-xs">{tx.category?.name || '—'}</TableCell>
                        <TableCell
                          className={`text-right font-semibold ${
                            isIncome ? 'text-emerald-600' : isTransfer ? 'text-blue-600' : 'text-foreground'
                          }`}
                        >
                          {isIncome ? '+' : isTransfer ? '' : '-'}$
                          {Number(tx.amount).toLocaleString('es-MX', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(tx.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
