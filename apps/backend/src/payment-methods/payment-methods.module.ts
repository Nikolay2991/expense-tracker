import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PaymentMethodsController } from "./payment-methods.controller";
import { PaymentMethodsRepository } from "./payment-methods.repository";
import { PaymentMethodsService } from "./payment-methods.service";
import { PaymentMethodCommandHandlers, PaymentMethodQueryHandlers } from "./handlers";

/**
 * Модуль фичи «Способы оплаты». Подключает `CqrsModule`, регистрирует контроллер,
 * сервис, репозиторий и все CQRS-обработчики команд/запросов.
 */
@Module({
  imports: [CqrsModule],
  controllers: [PaymentMethodsController],
  providers: [
    PaymentMethodsService,
    PaymentMethodsRepository,
    ...PaymentMethodCommandHandlers,
    ...PaymentMethodQueryHandlers,
  ],
})
export class PaymentMethodsModule {}
