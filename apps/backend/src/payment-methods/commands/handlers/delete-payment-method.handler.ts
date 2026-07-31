import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PaymentMethod } from "@prisma/client";
import { PaymentMethodsService } from "../../payment-methods.service";
import { DeletePaymentMethodCommand } from "../delete-payment-method.command";

/**
 * CQRS-обёртка над удалением способа оплаты: делегирует в {@link PaymentMethodsService}.
 */
@CommandHandler(DeletePaymentMethodCommand)
export class DeletePaymentMethodHandler
  implements ICommandHandler<DeletePaymentMethodCommand>
{
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  /**
   * @param command - Команда с `id` и `userId`.
   * @returns Удалённый способ оплаты.
   * @throws {NotFoundException} Если способ оплаты не найден или принадлежит другому пользователю.
   */
  execute(command: DeletePaymentMethodCommand): Promise<PaymentMethod> {
    return this.paymentMethodsService.remove(command.id, command.userId);
  }
}
