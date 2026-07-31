import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PaymentMethod } from "@prisma/client";
import { PaymentMethodsService } from "../../payment-methods.service";
import { UpdatePaymentMethodCommand } from "../update-payment-method.command";

/**
 * CQRS-обёртка над обновлением способа оплаты: делегирует в {@link PaymentMethodsService}.
 */
@CommandHandler(UpdatePaymentMethodCommand)
export class UpdatePaymentMethodHandler
  implements ICommandHandler<UpdatePaymentMethodCommand>
{
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  /**
   * @param command - Команда с `id`, `userId` и изменяемыми полями.
   * @returns Обновлённый способ оплаты.
   * @throws {NotFoundException} Если способ оплаты не найден или принадлежит другому пользователю.
   * @throws {ConflictException} Если у пользователя уже есть способ оплаты с таким именем.
   */
  execute(command: UpdatePaymentMethodCommand): Promise<PaymentMethod> {
    return this.paymentMethodsService.update(
      command.id,
      command.userId,
      command.dto,
    );
  }
}
