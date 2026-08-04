"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight } from "lucide-react";
import { useAuth } from "@/features/auth";
import { DashboardShell } from "@/widgets/dashboard-shell";

export default function TransactionsPage() {
  const router = useRouter();
  const { user, isReady } = useAuth();

  React.useEffect(() => {
    if (isReady && !user) router.replace("/login");
  }, [isReady, user, router]);

  if (!isReady || !user) return null;

  return (
    <DashboardShell title="Транзакции" greeting="Полная история">
      <div className="panel flex flex-col items-center justify-center px-6 py-20 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-foreground">
          <ArrowLeftRight className="size-6" />
        </span>
        <p className="mt-5 font-display text-lg font-bold tracking-tight">Раздел в разработке</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Здесь появятся фильтры, поиск и подробная история операций. Пока смотрите последние
          транзакции на дашборде.
        </p>
      </div>
    </DashboardShell>
  );
}
