import type { TransactionsListResponse } from "@expense-tracker/shared";
import { apiFetch } from "@/shared/api/client";

export function getTransactions(
  params: { page?: number; limit?: number } = {},
): Promise<TransactionsListResponse> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return apiFetch<TransactionsListResponse>(`/transactions${qs ? `?${qs}` : ""}`);
}
