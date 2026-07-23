import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/features/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export const metadata: Metadata = {
  title: "Вход — Expense Tracker",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Вход</CardTitle>
          <CardDescription>
            Войдите в свой аккаунт, чтобы продолжить
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            Нет аккаунта?{" "}
            <Link href="/register" className="text-primary underline-offset-4 hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
