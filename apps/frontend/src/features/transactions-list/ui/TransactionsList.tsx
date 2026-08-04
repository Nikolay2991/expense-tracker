"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { TransactionItem } from "@/entities/transaction";
import { cn } from "@/shared/lib/utils";
import { useTransactions } from "../model/useTransactions";

const PAGE_SIZE = 8;

function PagerButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-full border border-border/70 bg-card text-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {children}
    </button>
  );
}

export function TransactionsList() {
  const { page, setPage, totalPages, data, isLoading, error } = useTransactions(PAGE_SIZE);
  const hasItems = data && data.transactions.length > 0;

  return (
    <section className="panel flex h-full flex-col p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight">Последние транзакции</h2>
          <p className="text-sm text-muted-foreground">История доходов и расходов</p>
        </div>
      </div>

      <div className="mt-2 flex-1">
        {isLoading ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Загрузка…</p>
        ) : error ? (
          <p className="py-12 text-center text-sm text-destructive">{error}</p>
        ) : hasItems ? (
          <ul className="divide-y divide-border/70">
            {data.transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </ul>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm font-medium">Транзакций пока нет</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Добавьте первую — она появится здесь.
            </p>
          </div>
        )}
      </div>

      {data && data.total > 0 ? (
        <div className={cn("mt-4 flex items-center justify-between border-t border-border/70 pt-4")}>
          <span className="text-sm text-muted-foreground tnum">
            Стр. {page} из {totalPages}
          </span>
          <div className="flex gap-2">
            <PagerButton
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              label="Предыдущая страница"
            >
              <ChevronLeft className="size-4" />
            </PagerButton>
            <PagerButton
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isLoading}
              label="Следующая страница"
            >
              <ChevronRight className="size-4" />
            </PagerButton>
          </div>
        </div>
      ) : null}
    </section>
  );
}
