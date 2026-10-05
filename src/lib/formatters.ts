import { format, type Locale } from 'date-fns';
import { es } from 'date-fns/locale';
import type { AccountType } from '@/types/account.types';
import type { TransactionType } from '@/types/transaction.types';
import type { CategoryType } from '@/types/category.types';

export const ACCOUNT_TYPE_LABELS = {
  CHECKING: 'Cuenta Corriente',
  SAVINGS: 'Cuenta de Ahorros',
  CREDIT_CARD: 'Tarjeta de Crédito',
  CASH: 'Efectivo',
  INVESTMENT: 'Inversión',
} as const satisfies Record<AccountType, string>;

export const TRANSACTION_TYPE_LABELS = {
  INCOME: 'Ingreso',
  EXPENSE: 'Gasto',
  TRANSFER: 'Transferencia',
} as const satisfies Record<TransactionType, string>;

export const CATEGORY_TYPE_LABELS = {
  INCOME: 'Ingreso',
  EXPENSE: 'Gasto',
} as const satisfies Record<CategoryType, string>;

export interface FormatTransactionDateOptions {
  readonly locale?: Locale;
}

/**
 * Retorna la etiqueta legible en español para un tipo de cuenta financiera.
 */
export function formatAccountType(type: AccountType): string {
  return ACCOUNT_TYPE_LABELS[type] ?? type;
}

/**
 * Retorna la etiqueta legible en español para un tipo de transacción.
 */
export function formatTransactionType(type: TransactionType): string {
  return TRANSACTION_TYPE_LABELS[type] ?? type;
}

/**
 * Retorna la etiqueta legible en español para un tipo de categoría.
 */
export function formatCategoryType(type: CategoryType): string {
  return CATEGORY_TYPE_LABELS[type] ?? type;
}

/**
 * Parsea una fecha en formato string extrayendo sus componentes locales [año, mes, día]
 * para evitar el desfase de 1 día provocado por conversiones a UTC medianoche.
 */
export function parseTransactionLocalDate(dateStr: string): Date {
  if (!dateStr) {
    return new Date();
  }

  const [datePart] = dateStr.split('T');
  const [yearStr, monthStr, dayStr] = datePart.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (Number.isInteger(year) && Number.isInteger(month) && Number.isInteger(day)) {
    return new Date(year, month - 1, day);
  }

  return new Date(dateStr);
}

/**
 * Formatea una fecha de transacción usando la fecha local de calendario.
 * Por defecto formatea con el patrón 'dd/MM/yyyy' y locale en español.
 */
export function formatTransactionDate(
  dateStr: string,
  formatStr: string = 'dd/MM/yyyy',
  options?: FormatTransactionDateOptions,
): string {
  if (!dateStr) {
    return '';
  }

  const localDate = parseTransactionLocalDate(dateStr);
  return format(localDate, formatStr, { locale: es, ...options });
}
