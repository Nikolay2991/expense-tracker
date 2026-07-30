import { CreateTransactionDto } from "../dto/create-transaction.dto";

/**
 * Команда создания транзакции. Обрабатывается `CreateTransactionHandler`.
 */
export class CreateTransactionCommand {
  /**
   * @param userId - Идентификатор пользователя-владельца новой транзакции.
   * @param dto - Данные новой транзакции.
   */
  constructor(
    public readonly userId: number,
    public readonly dto: CreateTransactionDto,
  ) {}
}
