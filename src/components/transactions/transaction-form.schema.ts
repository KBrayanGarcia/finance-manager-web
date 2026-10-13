import * as z from 'zod';

export const transactionSchema = z
  .object({
    type: z.enum(['EXPENSE', 'INCOME', 'TRANSFER']),
    accountId: z.string().min(1, 'Selecciona una cuenta de origen'),
    destinationAccountId: z.string().optional(),
    categoryId: z.string().optional(),
    amount: z.number().positive('El monto debe ser mayor a 0'),
    transactionDate: z.string().min(1, 'Selecciona la fecha'),
    description: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'TRANSFER') {
      if (!data.destinationAccountId || data.destinationAccountId.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecciona una cuenta de destino',
          path: ['destinationAccountId'],
        });
      } else if (data.destinationAccountId === data.accountId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La cuenta de destino no puede ser igual a la de origen',
          path: ['destinationAccountId'],
        });
      }
    }
  });

export type TransactionFormValues = z.infer<typeof transactionSchema>;
