import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/features/auth";
import { AuthScreen } from "@/shared/ui/auth-screen";

export const metadata: Metadata = {
  title: "Регистрация — Expense Tracker",
};

export default function RegisterPage() {
  return (
    <AuthScreen
      title="Регистрация"
      description="Создайте аккаунт, чтобы начать"
      footer={
        <>
          Уже есть аккаунт?{" "}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Войти
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthScreen>
  );
}
