import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TransactionType } from "@prisma/client";
import type { Transaction } from "@expense-tracker/shared";
import { CategoryResponseDto } from "../../categories/dto/category-response.dto";

/**
 * Swagger-схема транзакции в ответах API. Структурно соответствует
 * shared-интерфейсу `Transaction`; используется только для генерации документации.
 */
export class TransactionResponseDto implements Transaction {
  @ApiProperty({ description: "Идентификатор транзакции", example: 1 })
  id!: number;

  @ApiProperty({ description: "Сумма транзакции", example: 1500.5 })
  amount!: number;

  @ApiProperty({ description: "Тип транзакции", enum: TransactionType, example: TransactionType.expense })
  type!: TransactionType;

  @ApiProperty({ description: "Описание транзакции", example: "Обед в кафе", nullable: true })
  description!: string | null;

  @ApiProperty({ description: "Дата транзакции", example: "2026-07-30T00:00:00.000Z" })
  date!: Date;

  @ApiProperty({ description: "Идентификатор категории", example: 1 })
  categoryId!: number;

  @ApiPropertyOptional({ description: "Категория транзакции (если включена в выборку)", type: CategoryResponseDto })
  category?: CategoryResponseDto;

  @ApiProperty({ description: "Идентификатор владельца", example: 1 })
  userId!: number;

  @ApiProperty({ description: "Дата создания", example: "2026-07-30T00:00:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ description: "Дата последнего обновления", example: "2026-07-30T00:00:00.000Z" })
  updatedAt!: Date;
}
