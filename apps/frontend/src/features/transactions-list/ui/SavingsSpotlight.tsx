"use client";

import type { TransactionsSummary } from "@expense-tracker/shared";
import { formatMoney } from "@/entities/transaction";
import { cn } from "@/shared/lib/utils";

export function SavingsSpotlight({
  summary,
  isLoading,
}: {
  summary: TransactionsSummary | null;
  isLoading: boolean;
}) {
  const income = summary?.income ?? 0;
  const expense = summary?.expense ?? 0;
  const total = income + expense;
  const incomeShare = total > 0 ? (income / total) * 100 : 0;
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl bg-primary p-6 text-primary-foreground">
      <div>
        <p className="text-sm text-primary-foreground/60">Норма сбережений</p>
        <p className={cn("mt-1 font-display text-5xl font-bold tracking-tight tnum", isLoading && "opacity-40")}>
          {summary ? `${savingsRate}%` : "—"}
        </p>
        <p className="mt-2 text-sm text-primary-foreground/60">
          {savingsRate > 0
            ? "Вы откладываете часть доходов — так держать."
            : "Расходы близки к доходам. Есть куда расти."}
        </p>
      </div>

      <div className="mt-8">
        <div className="flex h-2.5 overflow-hidden rounded-full bg-white/12">
          <div
            className="bg-up transition-[width] duration-500"
            style={{ width: `${incomeShare}%` }}
          />
          <div className="flex-1 bg-peach-ink/80" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <span className="flex items-center gap-1.5 text-xs text-primary-foreground/60">
              <span className="size-2 rounded-full bg-up" /> Доходы
            </span>
            <p className="mt-0.5 text-sm font-semibold tnum">{formatMoney(income)}</p>
          </div>
          <div>
            <span className="flex items-center gap-1.5 text-xs text-primary-foreground/60">
              <span className="size-2 rounded-full bg-peach-ink/80" /> Расходы
            </span>
            <p className="mt-0.5 text-sm font-semibold tnum">{formatMoney(expense)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
