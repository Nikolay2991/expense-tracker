import { z } from "zod";

export const createTransactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z
    .string()
    .min(1, "Введите сумму")
    .refine((v) => {
      const n = Number(v.replace(",", "."));
      return Number.isFinite(n) && n > 0;
    }, "Введите сумму больше нуля")
    .refine((v) => /^\d+([.,]\d{1,2})?$/.test(v.trim()), "Не больше двух знаков после запятой"),
  categoryId: z.string().min(1, "Выберите категорию"),
  description: z.string().max(255, "Слишком длинное описание").optional(),
  date: z.string().min(1, "Укажите дату"),
});

export type CreateTransactionFormValues = z.infer<typeof createTransactionSchema>;
