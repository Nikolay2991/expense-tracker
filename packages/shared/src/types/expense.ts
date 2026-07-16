export interface Category {
  id: number;
  name: string;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: number;
  amount: number;
  description: string | null;
  date: Date;
  categoryId: number;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpenseDto {
  amount: number;
  description?: string;
  date?: Date;
  categoryId: number;
}

export interface CreateCategoryDto {
  name: string;
  color?: string;
}
