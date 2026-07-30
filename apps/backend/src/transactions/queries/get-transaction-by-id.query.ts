/**
 * Запрос одной транзакции по идентификатору. Обрабатывается `GetTransactionByIdHandler`.
 */
export class GetTransactionByIdQuery {
  /**
   * @param id - Идентификатор запрашиваемой транзакции.
   * @param userId - Идентификатор пользователя-владельца.
   */
  constructor(
    public readonly id: number,
    public readonly userId: number,
  ) {}
}
