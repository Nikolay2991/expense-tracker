/**
 * Запрос списка способов оплаты пользователя. Обрабатывается `GetPaymentMethodsHandler`.
 */
export class GetPaymentMethodsQuery {
  /**
   * @param userId - Идентификатор пользователя-владельца.
   */
  constructor(public readonly userId: number) {}
}
