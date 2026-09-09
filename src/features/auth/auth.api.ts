import { apiClient } from '@/lib/axios-client';
import type { AuthResponse, LoginPayload, RegisterPayload, UpdateProfilePayload, User } from '@/types/auth.types';

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', payload);
  return response.data;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', payload);
  return response.data;
}

export async function fetchUserProfile(): Promise<User> {
  const response = await apiClient.get<User>('/users/profile');
  return response.data;
}

export async function updateUserProfile(payload: UpdateProfilePayload): Promise<User> {
  const response = await apiClient.patch<User>('/users/profile', payload);
  return response.data;
}
