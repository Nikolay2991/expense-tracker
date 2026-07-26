"use client";

import * as React from "react";
import type { TransactionsListResponse } from "@expense-tracker/shared";
import { ApiError } from "@/shared/api/client";
import { getTransactions } from "../api/transactionsApi";

export function useTransactions(limit = 10) {
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<TransactionsListResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    getTransactions({ page, limit })
      .then((res) => {
        if (active) setData(res);
      })
      .catch((e) => {
        if (active) {
          setError(e instanceof ApiError ? e.message : "Не удалось загрузить транзакции");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, limit]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return { page, setPage, totalPages, data, isLoading, error };
}
