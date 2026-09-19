import React from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Transaction } from '@/types/transaction.types';

interface TransactionMobileCardProps {
  readonly tx: Transaction;
  readonly onDelete: (id: string) => void;
}

/**
 * Componente de tarjeta para visualizar una transacción en dispositivos móviles.
 */
export function TransactionMobileCard({
  tx,
  onDelete,
}: TransactionMobileCardProps): React.ReactElement {
  const isIncome = tx.type === 'INCOME';
  const isTransfer = tx.type === 'TRANSFER';

  return (
    <Card className="border-border shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {format(new Date(tx.transactionDate), 'dd/MM/yyyy')}
        </span>
        <div className="flex items-center gap-2">
          <Badge variant={isIncome ? 'success' : isTransfer ? 'secondary' : 'outline'} className="text-[10px]">
            {tx.type}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(tx.id)}
            aria-label="Eliminar transacción"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold text-foreground m-0 truncate">
            {tx.description || (isTransfer ? 'Transferencia' : 'Sin descripción')}
          </p>
          <p className="text-xs text-muted-foreground m-0 truncate">
            {isTransfer ? (
              <span>{tx.account?.name} → {tx.destinationAccount?.name}</span>
            ) : (
              <span>{tx.account?.name || '—'}{tx.category?.name ? ` • ${tx.category.name}` : ''}</span>
            )}
          </p>
        </div>

        <div
          className={`text-base font-bold flex-shrink-0 ${
            isIncome ? 'text-emerald-600' : isTransfer ? 'text-blue-600' : 'text-foreground'
          }`}
        >
          {isIncome ? '+' : isTransfer ? '' : '-'}$
          {Number(tx.amount).toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>
    </Card>
  );
}
