import { IsHexColor, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * Тело запроса на создание способа оплаты. Валидируется глобальным `ValidationPipe`
 * (`whitelist` + `forbidNonWhitelisted`): неизвестные поля отклоняются.
 */
export class CreatePaymentMethodDto {
  /** Название способа оплаты (например, «Карта», «Наличные»). */
  @ApiProperty({ description: "Название способа оплаты", example: "Карта" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  /** Необязательный цвет для UI (HEX). */
  @ApiPropertyOptional({ description: "Цвет способа оплаты (HEX)", example: "#0ea5e9" })
  @IsOptional()
  @IsHexColor()
  color?: string;

  /** Необязательная иконка для UI. */
  @ApiPropertyOptional({ description: "Иконка способа оплаты", example: "credit-card" })
  @IsOptional()
  @IsString()
  icon?: string;
}
