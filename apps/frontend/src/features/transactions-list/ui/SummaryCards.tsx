"use client";

import type { TransactionsSummary } from "@expense-tracker/shared";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { formatMoney } from "@/entities/transaction";
import { cn } from "@/shared/lib/utils";
import { Sparkline } from "@/shared/ui/sparkline";

type Tone = "mint" | "peach" | "lavender";

const toneStyles: Record<Tone, { bg: string; ink: string }> = {
  mint: { bg: "bg-mint", ink: "text-mint-ink" },
  peach: { bg: "bg-peach", ink: "text-peach-ink" },
  lavender: { bg: "bg-lavender", ink: "text-lavender-ink" },
};

function StatCard({
  tone,
  label,
  value,
  icon: Icon,
  trend,
  hint,
  delay,
  loading,
}: {
  tone: Tone;
  label: string;
  value: string;
  icon: typeof Wallet;
  trend: "up" | "down" | "flat";
  hint: string;
  delay: number;
  loading: boolean;
}) {
  const s = toneStyles[tone];
  return (
    <div
      className={cn("rise-in relative overflow-hidden rounded-2xl p-5", s.bg)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Icon className="size-5" />
        </span>
        <Sparkline variant={trend} className={cn("h-7 w-16", s.ink)} />
      </div>
      <p className={cn("mt-5 font-display text-[26px] font-bold tracking-tight tnum", loading && "opacity-40")}>
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-foreground/55">
        <span className={cn("font-semibold", s.ink)}>{label}</span> · {hint}
      </p>
    </div>
  );
}

export function SummaryCards({
  summary,
  isLoading,
}: {
  summary: TransactionsSummary | null;
  isLoading: boolean;
}) {
  const income = summary?.income ?? 0;
  const expense = summary?.expense ?? 0;
  const balance = summary?.balance ?? 0;
  const dash = "—";

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        tone="mint"
        label="Доходы"
        icon={ArrowUpRight}
        value={summary ? formatMoney(income) : dash}
        trend="up"
        hint="всего поступило"
        delay={0}
        loading={isLoading}
      />
      <StatCard
        tone="peach"
        label="Расходы"
        icon={ArrowDownRight}
        value={summary ? formatMoney(expense) : dash}
        trend="down"
        hint="всего потрачено"
        delay={70}
        loading={isLoading}
      />
      <StatCard
        tone="lavender"
        label="Баланс"
        icon={Wallet}
        value={summary ? formatMoney(balance) : dash}
        trend={balance >= 0 ? "up" : "down"}
        hint="чистый остаток"
        delay={140}
        loading={isLoading}
      />
    </div>
  );
}
