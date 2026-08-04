"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, Clock, LayoutDashboard, LogOut, Tags, Wallet } from "lucide-react";
import { useAuth } from "@/features/auth";
import { cn } from "@/shared/lib/utils";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

const navItems = [
  { href: "/", label: "Дашборд", icon: LayoutDashboard },
  { href: "/transactions", label: "Транзакции", icon: ArrowLeftRight },
  { href: "/categories", label: "Категории", icon: Tags },
] as const;

function isActive(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Wallet className="size-[18px]" />
      </span>
      <span className="font-display text-xl font-bold tracking-tight">Кошелёк</span>
    </Link>
  );
}

function NavLink({ href, label, icon: Icon, active }: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
        active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl border transition-colors",
          active
            ? "border-transparent bg-primary text-primary-foreground"
            : "border-border/70 bg-card text-foreground group-hover:border-border",
        )}
      >
        <Icon className="size-[18px]" />
      </span>
      {label}
    </Link>
  );
}

function UserChip() {
  const { user, logout } = useAuth();
  const initial = (user?.name ?? "Г").trim().charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2.5 rounded-full border border-border/70 bg-card py-1 pr-1 pl-1.5">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {initial}
        </span>
        <span className="hidden max-w-32 truncate pr-1 text-sm font-medium sm:block">
          {user?.name ?? "Гость"}
        </span>
      </div>
      <button
        type="button"
        onClick={logout}
        aria-label="Выйти"
        className="inline-flex size-10 items-center justify-center rounded-full border border-border/70 bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <LogOut className="size-[18px]" />
      </button>
    </div>
  );
}

export function DashboardShell({
  title,
  greeting,
  action,
  children,
}: {
  title: string;
  greeting?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-5">
      <div className="mx-auto flex w-full max-w-7xl gap-5">
        {/* Sidebar */}
        <aside className="sticky top-5 hidden h-[calc(100vh-2.5rem)] w-64 shrink-0 flex-col rounded-2xl px-2 py-3 lg:flex">
          <div className="px-3 pt-2 pb-6">
            <Logo />
          </div>
          <nav className="flex flex-1 flex-col gap-1">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} active={isActive(item.href, pathname)} />
            ))}
          </nav>
          <div className="mt-4 rounded-2xl bg-primary p-4 text-primary-foreground">
            <span className="flex size-9 items-center justify-center rounded-full bg-white/12">
              <Clock className="size-[18px]" />
            </span>
            <p className="mt-3 text-sm font-semibold">Отчёты скоро</p>
            <p className="mt-1 text-xs text-primary-foreground/65">
              Недельная аналитика по тратам уже в работе.
            </p>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {/* Topbar */}
          <header className="panel flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="min-w-0 lg:hidden">
              <Logo />
            </div>
            <p className="hidden text-sm text-muted-foreground first-letter:uppercase lg:block">
              {dateFormatter.format(new Date())}
            </p>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserChip />
            </div>
          </header>

          {/* Mobile nav */}
          <nav className="flex gap-2 overflow-x-auto lg:hidden">
            {navItems.map((item) => {
              const active = isActive(item.href, pathname);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "border-border/70 bg-card text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Page header */}
          <div className="flex flex-wrap items-end justify-between gap-4 px-1">
            <div>
              {greeting ? (
                <p className="text-sm text-muted-foreground">{greeting}</p>
              ) : null}
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                {title}
              </h1>
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
          </div>

          <main className="pb-2">{children}</main>
        </div>
      </div>
    </div>
  );
}
