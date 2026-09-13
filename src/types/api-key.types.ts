/**
 * Interfaz que representa una API Key registrada en el sistema.
 */
export interface ApiKey {
  readonly id: string;
  readonly name: string;
  readonly prefix: string;
  readonly isActive: boolean;
  readonly lastUsedAt?: string;
  readonly expiresAt?: string;
  readonly createdAt: string;
}

/**
 * Carga útil requerida para generar una nueva API Key.
 */
export interface CreateApiKeyPayload {
  readonly name: string;
  readonly expiresAt?: string;
}

/**
 * Respuesta retornada al crear una API Key, incluyendo la clave en texto plano.
 */
export interface CreateApiKeyResponse {
  readonly id: string;
  readonly name: string;
  readonly prefix: string;
  readonly rawKey: string;
  readonly isActive: boolean;
  readonly expiresAt?: string;
  readonly createdAt: string;
}