import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/features/auth";
import { AuthScreen } from "@/shared/ui/auth-screen";

export const metadata: Metadata = {
  title: "Вход — Expense Tracker",
};

export default function LoginPage() {
  return (
    <AuthScreen
      title="Вход"
      description="Войдите в аккаунт, чтобы продолжить"
      footer={
        <>
          Нет аккаунта?{" "}
          <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
            Зарегистрироваться
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthScreen>
  );
}
