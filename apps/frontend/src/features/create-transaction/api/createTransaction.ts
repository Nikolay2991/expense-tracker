import type { CreateTransactionDto, Transaction } from "@expense-tracker/shared";
import { apiFetch } from "@/shared/api/client";

export function createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
  return apiFetch<Transaction>("/transactions", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}
