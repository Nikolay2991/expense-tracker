import { UpdateTransactionDto } from "../dto/update-transaction.dto";

/**
 * Команда частичного обновления транзакции. Обрабатывается `UpdateTransactionHandler`.
 */
export class UpdateTransactionCommand {
  /**
   * @param id - Идентификатор обновляемой транзакции.
   * @param userId - Идентификатор пользователя-владельца.
   * @param dto - Частичный набор изменяемых полей.
   */
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly dto: UpdateTransactionDto,
  ) {}
}
