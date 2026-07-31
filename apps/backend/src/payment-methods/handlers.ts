import { CreatePaymentMethodHandler } from "./commands/handlers/create-payment-method.handler";
import { DeletePaymentMethodHandler } from "./commands/handlers/delete-payment-method.handler";
import { UpdatePaymentMethodHandler } from "./commands/handlers/update-payment-method.handler";
import { GetPaymentMethodsHandler } from "./queries/handlers/get-payment-methods.handler";

/** CQRS-обработчики команд (запись), спредятся в `providers` модуля способов оплаты. */
export const PaymentMethodCommandHandlers = [
  CreatePaymentMethodHandler,
  UpdatePaymentMethodHandler,
  DeletePaymentMethodHandler,
];

/** CQRS-обработчики запросов (чтение), спредятся в `providers` модуля способов оплаты. */
export const PaymentMethodQueryHandlers = [GetPaymentMethodsHandler];
