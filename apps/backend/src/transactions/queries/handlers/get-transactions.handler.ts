import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { TransactionsListResponse } from "@expense-tracker/shared";
import { TransactionsService } from "../../transactions.service";
import { GetTransactionsQuery } from "../get-transactions.query";

/**
 * CQRS-обёртка над выборкой списка транзакций: делегирует в {@link TransactionsService}.
 */
@QueryHandler(GetTransactionsQuery)
export class GetTransactionsHandler
  implements IQueryHandler<GetTransactionsQuery>
{
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * @param query - Запрос с `userId` и фильтром/пагинацией.
   * @returns Список транзакций, сводка сумм и метаданные пагинации.
   */
  execute(query: GetTransactionsQuery): Promise<TransactionsListResponse> {
    return this.transactionsService.findAll(query.userId, query.filter);
  }
}
