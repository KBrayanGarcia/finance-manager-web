import React from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Transaction } from '@/types/transaction.types';
import { TransactionMobileCard } from './TransactionMobileCard';

interface TransactionsTableProps {
  readonly transactions: readonly Transaction[];
  readonly isLoading: boolean;
  readonly onDelete: (id: string) => void;
}

export function TransactionsTable({
  transactions,
  isLoading,
  onDelete,
}: TransactionsTableProps): React.ReactElement {
  if (isLoading) {
    return (
      <Card className="border-border shadow-sm">
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          Cargando transacciones...
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="border-border shadow-sm">
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          No se encontraron transacciones para los filtros seleccionados.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Vista para pantallas móviles en tarjetas */}
      <div className="space-y-3 md:hidden">
        {transactions.map((tx) => (
          <TransactionMobileCard key={tx.id} tx={tx} onDelete={onDelete} />
        ))}
      </div>

      {/* Vista para tablets y escritorios en tabla con scroll horizontal preventivo */}
      <Card className="border-border shadow-sm hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[640px]">
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
                          onClick={() => onDelete(tx.id)}
                          aria-label="Eliminar transacción"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
