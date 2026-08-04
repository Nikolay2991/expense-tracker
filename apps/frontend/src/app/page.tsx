"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import { CreateTransactionDialog } from "@/features/create-transaction";
import {
  SavingsSpotlight,
  SummaryCards,
  TransactionsList,
  useSummary,
} from "@/features/transactions-list";
import { DashboardShell } from "@/widgets/dashboard-shell";

export default function Home() {
  const router = useRouter();
  const { user, isReady } = useAuth();
  const [reloadKey, setReloadKey] = React.useState(0);
  const { summary, isLoading } = useSummary(reloadKey);

  React.useEffect(() => {
    if (isReady && !user) {
      router.replace("/login");
    }
  }, [isReady, user, router]);

  if (!isReady || !user) {
    return null;
  }

  const firstName = user.name?.split(" ")[0] ?? "";

  return (
    <DashboardShell
      title="Дашборд"
      greeting={firstName ? `С возвращением, ${firstName}` : "С возвращением"}
      action={<CreateTransactionDialog onCreated={() => setReloadKey((k) => k + 1)} />}
    >
      <div className="flex flex-col gap-5">
        <SummaryCards summary={summary} isLoading={isLoading} />

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TransactionsList key={reloadKey} />
          </div>
          <div className="lg:col-span-1">
            <SavingsSpotlight summary={summary} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
