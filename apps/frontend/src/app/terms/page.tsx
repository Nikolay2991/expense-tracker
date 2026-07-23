import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Пользовательское соглашение — Expense Tracker",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Пользовательское соглашение</h1>
      <p className="mt-4 text-muted-foreground">
        Текст пользовательского соглашения будет добавлен позже.
      </p>
    </main>
  );
}
