"use client";

import * as React from "react";
import type { TransactionsSummary } from "@expense-tracker/shared";
import { getTransactions } from "../api/transactionsApi";

/** Загружает агрегированную сводку (доходы/расходы/баланс). */
export function useSummary(reloadKey?: number) {
  const [summary, setSummary] = React.useState<TransactionsSummary | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    setIsLoading(true);
    getTransactions({ page: 1, limit: 1 })
      .then((res) => {
        if (active) setSummary(res.summary);
      })
      .catch(() => {
        if (active) setSummary(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  return { summary, isLoading };
}
