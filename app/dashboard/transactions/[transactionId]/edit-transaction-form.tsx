"use client"

import { z } from 'zod';
import TransactionForm, { transactionFormSchema } from '@/components/transaction-form';
import { type Category } from '@/types/Categories';
import { updateTransaction } from './actions';
import { format } from 'date-fns';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

type Props = {
  categories: Category[];
  transaction: {
    id: number,
    amount: string,
    categoryId: number,
    description: string,
    transactionDate: string,
  }
};

export default function EditTransactionForm({
  categories,
  transaction
}: Props) {
  const router = useRouter();
  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    const result = await updateTransaction({
      id: transaction.id,
      amount: data.amount,
      transactionDate: format(data.transactionDate, "yyyy-MM-dd"),
      categoryId: data.categoryId,
      description: data.description
    });

    if (result?.error) {
      toast.error("Error", { description: result.message });
      return;
    }

    toast.success("Success", { description: "Transaction updated" });
    router.push(
      `/dashboard/transactions?month=${
        data.transactionDate.getMonth() + 1
      }&year=${data.transactionDate.getFullYear()}`
    );
  }

  const transactionType = categories.find(category => category.id === transaction.categoryId)?.type ?? "income";

  const defaultValues = {
    amount: Number(transaction.amount),
    categoryId: transaction.categoryId,
    description: transaction.description,
    transactionDate: new Date(transaction.transactionDate),
    transactionType: transactionType
  }

  return <TransactionForm defaultValues={defaultValues} categories={ categories } onSubmit={handleSubmit} />
}
