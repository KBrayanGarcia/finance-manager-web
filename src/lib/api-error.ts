interface ApiErrorPayload {
  readonly message?: string | readonly string[];
  readonly error?: string;
  readonly statusCode?: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Extrae de forma segura el mensaje de error emitido por la API backend (NestJS/Axios).
 * Maneja tanto strings simples como arrays de mensajes generados por NestJS ValidationPipe.
 *
 * @param error - Objeto de error capturado en bloque try/catch (unknown)
 * @param fallback - Mensaje por defecto en caso de no poder extraer un mensaje específico
 * @returns Mensaje de error legible para mostrar en la interfaz de usuario
 */
export function getApiErrorMessage(error: unknown, fallback = 'Ha ocurrido un error'): string {
  if (isRecord(error)) {
    // Si contiene la estructura típica de respuesta de Axios (error.response.data)
    if (isRecord(error.response) && isRecord(error.response.data)) {
      const data = error.response.data as ApiErrorPayload;
      const message = data.message;

      if (typeof message === 'string' && message.trim().length > 0) {
        return message;
      }

      if (Array.isArray(message) && message.length > 0) {
        const textParts = message.filter((item): item is string => typeof item === 'string');
        if (textParts.length > 0) {
          return textParts.join(', ');
        }
      }

      if (typeof data.error === 'string' && data.error.trim().length > 0) {
        return data.error;
      }
    }

    // Si es un error de red o timeout con propiedad message (ej. { isAxiosError: true, message: 'Network Error' })
    if (typeof error.message === 'string' && error.message.trim().length > 0) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error;
  }

  return fallback;
}
