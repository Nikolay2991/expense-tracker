import type { TransactionType } from "@expense-tracker/shared";

const moneyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/** Форматирует сумму со знаком в зависимости от типа транзакции. */
export function formatAmount(amount: number, type: TransactionType): string {
  const sign = type === "income" ? "+" : "−";
  return `${sign}${moneyFormatter.format(amount)}`;
}

export function formatDate(date: Date | string): string {
  return dateFormatter.format(new Date(date));
}
