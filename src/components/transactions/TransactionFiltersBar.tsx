import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Account } from '@/types/account.types';
import type { TransactionType } from '@/types/transaction.types';

interface TransactionFiltersBarProps {
  readonly selectedType: TransactionType | undefined;
  readonly onSelectType: (type: TransactionType | undefined) => void;
  readonly selectedAccountId: string | undefined;
  readonly onSelectAccount: (accountId: string | undefined) => void;
  readonly accounts: readonly Account[];
}

export function TransactionFiltersBar({
  selectedType,
  onSelectType,
  selectedAccountId,
  onSelectAccount,
  accounts,
}: TransactionFiltersBarProps): React.ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <Button
          variant={selectedType === undefined ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelectType(undefined)}
        >
          Todos
        </Button>
        <Button
          variant={selectedType === 'EXPENSE' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelectType('EXPENSE')}
        >
          Gastos
        </Button>
        <Button
          variant={selectedType === 'INCOME' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelectType('INCOME')}
        >
          Ingresos
        </Button>
        <Button
          variant={selectedType === 'TRANSFER' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelectType('TRANSFER')}
        >
          Transferencias
        </Button>
      </div>

      <div className="w-48">
        <Select
          value={selectedAccountId ?? 'ALL'}
          onValueChange={(val) => onSelectAccount(val === 'ALL' ? undefined : val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas las cuentas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas las cuentas</SelectItem>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
