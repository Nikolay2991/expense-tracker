import type { Transaction } from "@expense-tracker/shared";
import { cn } from "@/shared/lib/utils";
import { formatAmount, formatDate } from "../lib/format";

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isIncome = transaction.type === "income";
  const categoryColor = transaction.category?.color ?? undefined;

  return (
    <li className="flex items-center gap-3 py-3">
      <span
        aria-hidden
        className="size-2.5 shrink-0 rounded-full bg-muted-foreground"
        style={categoryColor ? { backgroundColor: categoryColor } : undefined}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {transaction.category?.name ?? "Без категории"}
        </p>
        {transaction.description ? (
          <p className="truncate text-xs text-muted-foreground">{transaction.description}</p>
        ) : null}
      </div>
      <div className="shrink-0 text-right">
        <p
          className={cn(
            "text-sm font-semibold tabular-nums",
            isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-foreground",
          )}
        >
          {formatAmount(transaction.amount, transaction.type)}
        </p>
        <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
      </div>
    </li>
  );
}
