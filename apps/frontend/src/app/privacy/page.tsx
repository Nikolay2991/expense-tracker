import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика безопасности — Expense Tracker",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Политика безопасности</h1>
      <p className="mt-4 text-muted-foreground">
        Текст политики безопасности будет добавлен позже.
      </p>
    </main>
  );
}
