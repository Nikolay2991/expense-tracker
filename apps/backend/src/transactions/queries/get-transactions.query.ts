import { QueryTransactionsDto } from "../dto/query-transactions.dto";

/**
 * Запрос страницы транзакций пользователя с итогами. Обрабатывается `GetTransactionsHandler`.
 */
export class GetTransactionsQuery {
  /**
   * @param userId - Идентификатор пользователя-владельца.
   * @param filter - Фильтры и параметры пагинации (`month`, `year`, `page`, `limit`).
   */
  constructor(
    public readonly userId: number,
    public readonly filter: QueryTransactionsDto,
  ) {}
}
