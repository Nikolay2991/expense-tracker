import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Введите email").email("Некорректный email"),
  password: z.string().min(1, "Введите пароль"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(1, "Введите имя"),
  email: z.string().min(1, "Введите email").email("Некорректный email"),
  password: z.string().min(8, "Пароль должен быть не короче 8 символов"),
  agreedToTerms: z.boolean().refine((value) => value === true, {
    message: "Нужно принять пользовательское соглашение и политику безопасности",
  }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
