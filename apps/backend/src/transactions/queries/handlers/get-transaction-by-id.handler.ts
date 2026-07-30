import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { Transaction } from "@expense-tracker/shared";
import { TransactionsService } from "../../transactions.service";
import { GetTransactionByIdQuery } from "../get-transaction-by-id.query";

/**
 * CQRS-обёртка над выборкой одной транзакции: делегирует в {@link TransactionsService}.
 */
@QueryHandler(GetTransactionByIdQuery)
export class GetTransactionByIdHandler
  implements IQueryHandler<GetTransactionByIdQuery>
{
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * @param query - Запрос с `id` и `userId`.
   * @returns Транзакция в формате shared-DTO.
   * @throws {NotFoundException} Если транзакция не найдена или принадлежит другому пользователю.
   */
  execute(query: GetTransactionByIdQuery): Promise<Transaction> {
    return this.transactionsService.findOne(query.id, query.userId);
  }
}
