export interface Category {
  id: number;
  name: string;
  color: string | null;
  icon: string | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDto {
  name: string;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  color?: string;
  icon?: string;
}
