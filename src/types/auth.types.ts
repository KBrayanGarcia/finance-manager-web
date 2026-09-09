export interface User {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string | null;
  readonly isActive: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface AuthResponse {
  readonly accessToken: string;
  readonly user: User;
}

export interface LoginPayload {
  readonly email: string;
  readonly password: string;
}

export interface RegisterPayload {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName?: string;
}

export interface UpdateProfilePayload {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly password?: string;
}
