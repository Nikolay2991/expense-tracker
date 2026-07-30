/**
 * Команда удаления транзакции. Обрабатывается `DeleteTransactionHandler`.
 */
export class DeleteTransactionCommand {
  /**
   * @param id - Идентификатор удаляемой транзакции.
   * @param userId - Идентификатор пользователя-владельца.
   */
  constructor(
    public readonly id: number,
    public readonly userId: number,
  ) {}
}
