import type { UpdatePaymentMethodDto } from "../dto/update-payment-method.dto";

/**
 * Команда частичного обновления способа оплаты. Обрабатывается `UpdatePaymentMethodHandler`.
 */
export class UpdatePaymentMethodCommand {
  /**
   * @param id - Идентификатор обновляемого способа оплаты.
   * @param userId - Идентификатор пользователя-владельца.
   * @param dto - Частичный набор изменяемых полей.
   */
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly dto: UpdatePaymentMethodDto,
  ) {}
}
