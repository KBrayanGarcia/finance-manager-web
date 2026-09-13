import { apiClient } from '@/lib/axios-client';
import type {
  ApiKey,
  CreateApiKeyPayload,
  CreateApiKeyResponse,
} from '@/types/api-key.types';

/**
 * Obtiene el listado de API Keys registradas para el usuario autenticado.
 */
export async function fetchApiKeys(): Promise<ApiKey[]> {
  const response = await apiClient.get<ApiKey[]>('/api-keys');
  return response.data;
}

/**
 * Crea una nueva API Key y retorna el token plano por única vez.
 */
export async function createApiKey(
  payload: CreateApiKeyPayload
): Promise<CreateApiKeyResponse> {
  const response = await apiClient.post<CreateApiKeyResponse>(
    '/api-keys',
    payload
  );
  return response.data;
}

/**
 * Elimina o revoca una API Key existente por su identificador único.
 */
export async function deleteApiKey(id: string): Promise<void> {
  await apiClient.delete(`/api-keys/${id}`);
}