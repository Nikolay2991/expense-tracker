"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Tags } from "lucide-react";
import { useAuth } from "@/features/auth";
import { DashboardShell } from "@/widgets/dashboard-shell";

export default function CategoriesPage() {
  const router = useRouter();
  const { user, isReady } = useAuth();

  React.useEffect(() => {
    if (isReady && !user) router.replace("/login");
  }, [isReady, user, router]);

  if (!isReady || !user) return null;

  return (
    <DashboardShell title="Категории" greeting="Управление">
      <div className="panel flex flex-col items-center justify-center px-6 py-20 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-foreground">
          <Tags className="size-6" />
        </span>
        <p className="mt-5 font-display text-lg font-bold tracking-tight">Раздел в разработке</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Скоро вы сможете создавать категории, задавать им цвета и группировать траты по смыслу.
        </p>
      </div>
    </DashboardShell>
  );
}
