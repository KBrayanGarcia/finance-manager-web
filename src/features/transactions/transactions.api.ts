import { apiClient } from '@/lib/axios-client';
import type {
  CreateTransactionPayload,
  Transaction,
  TransactionFilters,
  TransactionListResponse,
  UpdateTransactionPayload,
} from '@/types/transaction.types';

export async function fetchTransactions(filters?: TransactionFilters): Promise<TransactionListResponse> {
  const response = await apiClient.get<TransactionListResponse>('/transactions', {
    params: filters,
  });
  return response.data;
}

export async function fetchTransactionById(id: string): Promise<Transaction> {
  const response = await apiClient.get<Transaction>(`/transactions/${id}`);
  return response.data;
}

export async function createTransaction(payload: CreateTransactionPayload): Promise<Transaction> {
  const response = await apiClient.post<Transaction>('/transactions', payload);
  return response.data;
}

export async function updateTransaction(
  id: string,
  payload: UpdateTransactionPayload,
): Promise<Transaction> {
  const response = await apiClient.patch<Transaction>(`/transactions/${id}`, payload);
  return response.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await apiClient.delete(`/transactions/${id}`);
}
