import type { Category } from "@expense-tracker/shared";
import { apiFetch } from "@/shared/api/client";

export function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories");
}
