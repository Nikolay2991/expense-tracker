import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PaymentMethod } from "@prisma/client";
import { PaymentMethodsService } from "../../payment-methods.service";
import { GetPaymentMethodsQuery } from "../get-payment-methods.query";

/**
 * CQRS-обёртка над выборкой списка способов оплаты: делегирует в {@link PaymentMethodsService}.
 */
@QueryHandler(GetPaymentMethodsQuery)
export class GetPaymentMethodsHandler
  implements IQueryHandler<GetPaymentMethodsQuery>
{
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  /**
   * @param query - Запрос с `userId`.
   * @returns Список способов оплаты пользователя.
   */
  execute(query: GetPaymentMethodsQuery): Promise<PaymentMethod[]> {
    return this.paymentMethodsService.findAll(query.userId);
  }
}
