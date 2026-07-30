import { ApiProperty } from "@nestjs/swagger";
import type { TransactionsListResponse, TransactionsSummary } from "@expense-tracker/shared";
import { TransactionResponseDto } from "./transaction-response.dto";

/**
 * Swagger-схема сводки сумм (доход/расход/баланс) за выбранный период.
 */
export class TransactionsSummaryResponseDto implements TransactionsSummary {
  @ApiProperty({ description: "Сумма доходов за период", example: 50000 })
  income!: number;

  @ApiProperty({ description: "Сумма расходов за период", example: 32000 })
  expense!: number;

  @ApiProperty({ description: "Баланс (доход минус расход)", example: 18000 })
  balance!: number;
}

/**
 * Swagger-схема страницы транзакций со сводкой и метаданными пагинации.
 * Структурно соответствует shared-интерфейсу `TransactionsListResponse`.
 */
export class TransactionsListResponseDto implements TransactionsListResponse {
  @ApiProperty({ description: "Транзакции текущей страницы", type: [TransactionResponseDto] })
  transactions!: TransactionResponseDto[];

  @ApiProperty({ description: "Сводка сумм за выбранный период", type: TransactionsSummaryResponseDto })
  summary!: TransactionsSummaryResponseDto;

  @ApiProperty({ description: "Общее количество транзакций, подходящих под фильтр", example: 42 })
  total!: number;

  @ApiProperty({ description: "Номер текущей страницы", example: 1 })
  page!: number;

  @ApiProperty({ description: "Размер страницы", example: 10 })
  limit!: number;
}
