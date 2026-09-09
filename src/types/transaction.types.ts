import type { Account } from './account.types';
import type { Category } from './category.types';

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface Transaction {
  readonly id: string;
  readonly userId: string;
  readonly accountId: string;
  readonly categoryId: string | null;
  readonly destinationAccountId: string | null;
  readonly type: TransactionType;
  readonly amount: string | number;
  readonly transactionDate: string;
  readonly description?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly account?: Account;
  readonly category?: Category;
  readonly destinationAccount?: Account;
}

export interface TransactionListResponse {
  readonly data: Transaction[];
  readonly total: number;
}

export interface CreateTransactionPayload {
  readonly accountId: string;
  readonly type: TransactionType;
  readonly amount: number;
  readonly categoryId?: string;
  readonly destinationAccountId?: string;
  readonly transactionDate?: string;
  readonly description?: string;
}

export interface TransactionFilters {
  readonly accountId?: string;
  readonly categoryId?: string;
  readonly type?: TransactionType;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly limit?: number;
  readonly offset?: number;
}
