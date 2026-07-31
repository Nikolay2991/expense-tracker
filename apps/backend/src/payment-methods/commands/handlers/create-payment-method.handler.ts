import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PaymentMethod } from "@prisma/client";
import { PaymentMethodsService } from "../../payment-methods.service";
import { CreatePaymentMethodCommand } from "../create-payment-method.command";

/**
 * CQRS-обёртка над созданием способа оплаты: делегирует в {@link PaymentMethodsService}.
 */
@CommandHandler(CreatePaymentMethodCommand)
export class CreatePaymentMethodHandler
  implements ICommandHandler<CreatePaymentMethodCommand>
{
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  /**
   * @param command - Команда с `userId` и данными нового способа оплаты.
   * @returns Созданный способ оплаты.
   * @throws {ConflictException} Если у пользователя уже есть способ оплаты с таким именем.
   */
  execute(command: CreatePaymentMethodCommand): Promise<PaymentMethod> {
    return this.paymentMethodsService.create(command.userId, command.dto);
  }
}
