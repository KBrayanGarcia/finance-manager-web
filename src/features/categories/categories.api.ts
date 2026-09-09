import { apiClient } from '@/lib/axios-client';
import type { Category, CategoryType, CreateCategoryPayload, UpdateCategoryPayload } from '@/types/category.types';

export async function fetchCategories(type?: CategoryType): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/categories', {
    params: type ? { type } : undefined,
  });
  return response.data;
}

export async function fetchCategoryById(id: string): Promise<Category> {
  const response = await apiClient.get<Category>(`/categories/${id}`);
  return response.data;
}

export async function createCategory(payload: CreateCategoryPayload): Promise<Category> {
  const response = await apiClient.post<Category>('/categories', payload);
  return response.data;
}

export async function updateCategory(params: {
  readonly id: string;
  readonly payload: UpdateCategoryPayload;
}): Promise<Category> {
  const { id, payload } = params;
  const response = await apiClient.patch<Category>(`/categories/${id}`, payload);
  return response.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}
