import type { Transaction } from "@expense-tracker/shared";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { formatAmount, formatDate } from "../lib/format";

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isIncome = transaction.type === "income";
  const categoryColor = transaction.category?.color ?? undefined;
  const Icon = isIncome ? ArrowUpRight : ArrowDownLeft;

  return (
    <li className="flex items-center gap-3.5 py-3.5">
      <span
        aria-hidden
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          !categoryColor && (isIncome ? "bg-mint text-mint-ink" : "bg-secondary text-foreground"),
        )}
        style={categoryColor ? { backgroundColor: `${categoryColor}22`, color: categoryColor } : undefined}
      >
        <Icon className="size-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {transaction.category?.name ?? "Без категории"}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {transaction.description || formatDate(transaction.date)}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p
          className={cn(
            "text-sm font-semibold tnum",
            isIncome ? "text-up" : "text-foreground",
          )}
        >
          {formatAmount(transaction.amount, transaction.type)}
        </p>
        <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
      </div>
    </li>
  );
}
