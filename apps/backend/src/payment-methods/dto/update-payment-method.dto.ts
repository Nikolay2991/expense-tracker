import { PartialType } from "@nestjs/swagger";
import { CreatePaymentMethodDto } from "./create-payment-method.dto";

/**
 * Тело запроса на частичное обновление способа оплаты. Наследует все поля
 * {@link CreatePaymentMethodDto} через `PartialType`, делая их необязательными.
 */
export class UpdatePaymentMethodDto extends PartialType(CreatePaymentMethodDto) {}
