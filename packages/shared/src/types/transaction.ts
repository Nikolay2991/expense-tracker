import type { Category } from "./category";
import type { PaymentMethod } from "./payment-method";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  description: string | null;
  date: Date;
  categoryId: number;
  category?: Category;
  paymentMethodId: number | null;
  paymentMethod?: PaymentMethod;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionDto {
  amount: number;
  type: TransactionType;
  description?: string;
  date?: Date;
  categoryId: number;
  paymentMethodId?: number;
}

export interface UpdateTransactionDto {
  amount?: number;
  type?: TransactionType;
  description?: string;
  date?: Date;
  categoryId?: number;
  paymentMethodId?: number;
}

export interface TransactionsSummary {
  income: number;
  expense: number;
  balance: number;
}

export interface TransactionsListResponse {
  transactions: Transaction[];
  summary: TransactionsSummary;
  total: number;
  page: number;
  limit: number;
}
