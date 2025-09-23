import { addDays, subYears } from 'date-fns';
import z from 'zod';

export const transactionSchema = z.object({
  categoryId: z.number().positive("Category ID is invalid"),
  transactionDate: z.coerce
    .date()
    .min(subYears(new Date(), 100))
    .max(addDays(new Date(), 1), "Transaction date cannot be in the future"),
  amount: z.number().positive("Amount must be greater than 0"),
  description: z
    .string()
    .min(3, "Description must contain at least 3 characters")
    .max(300, "Description must contain a maximum of 300 characters")
});

export const updateTransactionSchema = transactionSchema.and(z.object({
  id: z.number()
}));
