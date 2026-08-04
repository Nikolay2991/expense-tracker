import * as React from "react";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";

// Two-column branded auth screen: ink brand panel + form panel.
export function AuthScreen({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[calc(var(--radius)+10px)] border border-border/70 bg-card shadow-[0_1px_2px_rgba(24,25,27,0.04),0_20px_50px_-24px_rgba(24,25,27,0.25)] md:grid-cols-2">
        {/* Brand panel */}
        <aside className="relative hidden flex-col justify-between bg-primary p-8 text-primary-foreground md:flex">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/12">
              <Wallet className="size-[18px]" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight">Кошелёк</span>
          </div>

          <div>
            <p className="font-display text-2xl font-bold leading-snug tracking-tight">
              Все доходы и расходы — в одном спокойном месте.
            </p>
            <div className="mt-6 flex gap-3">
              <div className="flex-1 rounded-2xl bg-mint p-3 text-mint-ink">
                <ArrowUpRight className="size-4" />
                <p className="mt-4 text-xs font-medium opacity-80">Доходы</p>
                <p className="font-display text-sm font-bold">+ 42 500 ₽</p>
              </div>
              <div className="flex-1 rounded-2xl bg-peach p-3 text-peach-ink">
                <ArrowDownRight className="size-4" />
                <p className="mt-4 text-xs font-medium opacity-80">Расходы</p>
                <p className="font-display text-sm font-bold">− 18 200 ₽</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Form panel */}
        <div className="flex flex-col justify-center p-7 sm:p-9">
          <div className="mb-6 flex items-center gap-2.5 md:hidden">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Wallet className="size-[18px]" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight">Кошелёк</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          <div className="mt-6 space-y-4">
            {children}
            <div className="text-center text-sm text-muted-foreground">{footer}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
