import { apiClient } from '@/lib/axios-client';
import type { Account, CreateAccountPayload, UpdateAccountPayload } from '@/types/account.types';

export async function fetchAccounts(): Promise<Account[]> {
  const response = await apiClient.get<Account[]>('/accounts');
  return response.data;
}

export async function fetchAccountById(id: string): Promise<Account> {
  const response = await apiClient.get<Account>(`/accounts/${id}`);
  return response.data;
}

export async function createAccount(payload: CreateAccountPayload): Promise<Account> {
  const response = await apiClient.post<Account>('/accounts', payload);
  return response.data;
}

export async function updateAccount(params: {
  readonly id: string;
  readonly payload: UpdateAccountPayload;
}): Promise<Account> {
  const { id, payload } = params;
  const response = await apiClient.patch<Account>(`/accounts/${id}`, payload);
  return response.data;
}

export async function deleteAccount(id: string): Promise<void> {
  await apiClient.delete(`/accounts/${id}`);
}
