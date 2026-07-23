import type { Category } from "./expense";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  description: string | null;
  date: Date;
  categoryId: number;
  category?: Category;
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
}

export interface UpdateTransactionDto {
  amount?: number;
  type?: TransactionType;
  description?: string;
  date?: Date;
  categoryId?: number;
}

export interface TransactionsSummary {
  income: number;
  expense: number;
  balance: number;
}

export interface TransactionsListResponse {
  transactions: Transaction[];
  summary: TransactionsSummary;
}
