"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getCategories, type Category } from "@/entities/category";
import { ApiError } from "@/shared/api/client";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { createTransaction } from "../api/createTransaction";
import { createTransactionSchema, type CreateTransactionFormValues } from "../model/schema";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function CreateTransactionForm({ onSuccess }: { onSuccess: () => void }) {
  const [categories, setCategories] = React.useState<Category[] | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<CreateTransactionFormValues>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type: "expense",
      amount: "",
      categoryId: "",
      description: "",
      date: today(),
    },
  });

  React.useEffect(() => {
    let active = true;
    getCategories()
      .then((res) => {
        if (active) setCategories(res);
      })
      .catch(() => {
        if (active) setCategories([]);
      });
    return () => {
      active = false;
    };
  }, []);

  async function onSubmit(values: CreateTransactionFormValues) {
    setIsSubmitting(true);
    try {
      await createTransaction({
        type: values.type,
        amount: Number(values.amount.replace(",", ".")),
        categoryId: Number(values.categoryId),
        description: values.description?.trim() || undefined,
        date: new Date(values.date),
      });
      toast.success("Транзакция добавлена");
      form.reset({ ...form.getValues(), amount: "", description: "" });
      onSuccess();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Не удалось создать транзакцию";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (categories !== null && categories.length === 0) {
    return (
      <div className="space-y-4 text-sm">
        <p className="text-muted-foreground">
          Сначала создайте хотя бы одну категорию — без неё нельзя добавить транзакцию.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/categories">Перейти к категориям</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тип</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-1 rounded-full bg-secondary p-1">
                  {(
                    [
                      { value: "expense", label: "Расход" },
                      { value: "income", label: "Доход" },
                    ] as const
                  ).map((option) => {
                    const active = field.value === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => field.onChange(option.value)}
                        className={cn(
                          "h-8 rounded-full text-sm font-medium transition-colors",
                          active
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сумма</FormLabel>
              <FormControl>
                <Input inputMode="decimal" placeholder="0.00" autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Категория</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={!categories}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={categories ? "Выберите категорию" : "Загрузка…"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Дата</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Input placeholder="Необязательно" autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Сохранение…" : "Добавить"}
        </Button>
      </form>
    </Form>
  );
}
