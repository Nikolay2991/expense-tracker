export interface PaymentMethod {
  id: number;
  name: string;
  color: string | null;
  icon: string | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentMethodDto {
  name: string;
  color?: string;
  icon?: string;
}

export interface UpdatePaymentMethodDto {
  name?: string;
  color?: string;
  icon?: string;
}
