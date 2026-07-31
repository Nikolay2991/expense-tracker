/**
 * Команда удаления способа оплаты. Обрабатывается `DeletePaymentMethodHandler`.
 */
export class DeletePaymentMethodCommand {
  /**
   * @param id - Идентификатор удаляемого способа оплаты.
   * @param userId - Идентификатор пользователя-владельца.
   */
  constructor(
    public readonly id: number,
    public readonly userId: number,
  ) {}
}
