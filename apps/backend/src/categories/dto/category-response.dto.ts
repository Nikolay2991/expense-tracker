import { ApiProperty } from "@nestjs/swagger";
import type { Category } from "@expense-tracker/shared";

/**
 * Swagger-схема категории в ответах API. Структурно соответствует
 * shared-интерфейсу `Category`; используется только для генерации документации.
 */
export class CategoryResponseDto implements Category {
  @ApiProperty({ description: "Идентификатор категории", example: 1 })
  id!: number;

  @ApiProperty({ description: "Название категории", example: "Продукты" })
  name!: string;

  @ApiProperty({ description: "Цвет категории (HEX)", example: "#22c55e", nullable: true })
  color!: string | null;

  @ApiProperty({ description: "Иконка категории", example: "shopping-cart", nullable: true })
  icon!: string | null;

  @ApiProperty({ description: "Идентификатор владельца", example: 1 })
  userId!: number;

  @ApiProperty({ description: "Дата создания", example: "2026-07-30T00:00:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ description: "Дата последнего обновления", example: "2026-07-30T00:00:00.000Z" })
  updatedAt!: Date;
}
