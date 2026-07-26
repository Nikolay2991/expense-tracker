"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import { CreateTransactionDialog } from "@/features/create-transaction";
import { TransactionsList } from "@/features/transactions-list";
import { MainNav } from "@/widgets/main-nav";
import { UserProfile } from "@/widgets/user-profile";

export default function Home() {
  const router = useRouter();
  const { user, isReady } = useAuth();
  const [reloadKey, setReloadKey] = React.useState(0);

  React.useEffect(() => {
    if (isReady && !user) {
      router.replace("/login");
    }
  }, [isReady, user, router]);

  if (!isReady || !user) {
    return null;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 p-4 sm:p-6">
      <UserProfile />
      <MainNav />
      <div className="flex justify-end">
        <CreateTransactionDialog onCreated={() => setReloadKey((key) => key + 1)} />
      </div>
      <TransactionsList key={reloadKey} />
    </main>
  );
}
