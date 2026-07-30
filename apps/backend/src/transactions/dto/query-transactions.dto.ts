import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

/**
 * Query-параметры выборки транзакций: фильтр по периоду и пагинация.
 * Значения приходят строками и приводятся к числу через `@Type(() => Number)`.
 */
export class QueryTransactionsDto {
  /** Месяц фильтра (1–12); задаёт интервал в один месяц. */
  @ApiPropertyOptional({
    description: "Месяц фильтра (1–12); без указания года берётся текущий UTC-год",
    example: 7,
    minimum: 1,
    maximum: 12,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  /** Год фильтра (1970–9999); без месяца охватывает весь год. */
  @ApiPropertyOptional({
    description: "Год фильтра; без указания месяца охватывает весь год",
    example: 2026,
    minimum: 1970,
    maximum: 9999,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1970)
  @Max(9999)
  year?: number;

  /** Номер страницы (от 1); по умолчанию 1. */
  @ApiPropertyOptional({
    description: "Номер страницы",
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  /** Размер страницы (1–100); по умолчанию 10. */
  @ApiPropertyOptional({
    description: "Размер страницы",
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
