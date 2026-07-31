import { Type } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";
import { TransactionType } from "@prisma/client";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * Тело запроса на создание транзакции. Валидируется глобальным `ValidationPipe`
 * (`whitelist` + `forbidNonWhitelisted`): неизвестные поля отклоняются.
 */
export class CreateTransactionDto {
  /** Сумма транзакции, положительная, не более двух знаков после запятой. */
  @ApiProperty({
    description: "Сумма транзакции",
    example: 1500.5,
    minimum: 0,
    exclusiveMinimum: true,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount!: number;

  /** Тип транзакции: доход (`income`) или расход (`expense`). */
  @ApiProperty({
    description: "Тип транзакции",
    enum: TransactionType,
    example: TransactionType.expense,
  })
  @IsEnum(TransactionType)
  type!: TransactionType;

  /** Необязательное описание; если задано — непустая строка. */
  @ApiPropertyOptional({
    description: "Описание транзакции",
    example: "Обед в кафе",
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  /** Необязательная дата транзакции (приводится к `Date` из строки запроса). */
  @ApiPropertyOptional({
    description: "Дата транзакции (ISO 8601); по умолчанию — текущая дата",
    example: "2026-07-30T00:00:00.000Z",
    type: String,
    format: "date-time",
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  /** Идентификатор категории; владение проверяется в сервисе. */
  @ApiProperty({
    description: "Идентификатор категории, принадлежащей пользователю",
    example: 1,
  })
  @IsInt()
  categoryId!: number;

  /** Необязательный идентификатор способа оплаты; владение проверяется в сервисе. */
  @ApiPropertyOptional({
    description: "Идентификатор способа оплаты, принадлежащего пользователю",
    example: 1,
  })
  @IsOptional()
  @IsInt()
  paymentMethodId?: number;
}
