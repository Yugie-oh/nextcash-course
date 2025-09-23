"use server"

import { auth } from '@clerk/nextjs/server';
import { transactionsTable } from '@/db/schema';
import { db } from '@/db';
import { updateTransactionSchema } from '@/validation/transactionSchema';
import { and, eq } from 'drizzle-orm';

export const updateTransaction = async (data: {
  id: number,
  amount: number;
  transactionDate: string;
  description: string;
  categoryId: number;
}) => {
  const {userId} = await auth();

  if (!userId) {
    return {
      error: true,
      message: "Unauthorized"
    }
  }

  const validation = updateTransactionSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0].message,
    }
  }

  await db.update(transactionsTable).set({
    amount: data.amount.toString(),
    description: data.description,
    categoryId: data.categoryId,
    transactionDate: data.transactionDate
  }).where(
    and(
      eq(transactionsTable.id, data.id),
      eq(transactionsTable.userId, userId)
    )
  );
}

export const deleteTransaction = async (transactionId: number) => {
  const {userId} = await auth();

  if (!userId) {
    return {
      error: true,
      message: "Unauthorized"
    }
  }

  await db.delete(transactionsTable).where(
    and(
      eq(transactionsTable.id, transactionId),
      eq(transactionsTable.userId, userId)
    )
  );
}
