import type { CreatePaymentMethodDto } from "../dto/create-payment-method.dto";

/**
 * Команда создания способа оплаты. Обрабатывается `CreatePaymentMethodHandler`.
 */
export class CreatePaymentMethodCommand {
  /**
   * @param userId - Идентификатор пользователя-владельца нового способа оплаты.
   * @param dto - Данные нового способа оплаты.
   */
  constructor(
    public readonly userId: number,
    public readonly dto: CreatePaymentMethodDto,
  ) {}
}
