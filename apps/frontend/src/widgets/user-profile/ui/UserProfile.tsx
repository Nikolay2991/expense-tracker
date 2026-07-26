"use client";

import { useAuth } from "@/features/auth";
import { Button } from "@/shared/ui/button";

export function UserProfile() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">С возвращением,</p>
        <p className="truncate text-xl font-semibold">{user?.name ?? "Гость"}</p>
      </div>
      <Button variant="outline" size="sm" onClick={logout}>
        Выйти
      </Button>
    </header>
  );
}
