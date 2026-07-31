import { ApiProperty } from "@nestjs/swagger";
import type { PaymentMethod } from "@expense-tracker/shared";

/**
 * Swagger-схема способа оплаты в ответах API. Структурно соответствует
 * shared-интерфейсу `PaymentMethod`; используется только для генерации документации.
 */
export class PaymentMethodResponseDto implements PaymentMethod {
  @ApiProperty({ description: "Идентификатор способа оплаты", example: 1 })
  id!: number;

  @ApiProperty({ description: "Название способа оплаты", example: "Карта" })
  name!: string;

  @ApiProperty({ description: "Цвет способа оплаты (HEX)", example: "#0ea5e9", nullable: true })
  color!: string | null;

  @ApiProperty({ description: "Иконка способа оплаты", example: "credit-card", nullable: true })
  icon!: string | null;

  @ApiProperty({ description: "Идентификатор владельца", example: 1 })
  userId!: number;

  @ApiProperty({ description: "Дата создания", example: "2026-07-30T00:00:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ description: "Дата последнего обновления", example: "2026-07-30T00:00:00.000Z" })
  updatedAt!: Date;
}
