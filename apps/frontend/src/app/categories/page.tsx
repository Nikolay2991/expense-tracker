import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/shared/ui/button";

export const metadata: Metadata = {
  title: "Категории — Expense Tracker",
};

export default function CategoriesPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">Категории</h1>
      <p className="text-sm text-muted-foreground">Раздел в разработке</p>
      <Button asChild variant="outline" size="sm">
        <Link href="/">На главную</Link>
      </Button>
    </main>
  );
}
